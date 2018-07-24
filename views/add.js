// Initialize Firebase
var config = {
  apiKey: "AIzaSyB3pt-YPoCfENqhqTMdEN42HX9z_tj4a7I",
  authDomain: "flashy-84f3e.firebaseapp.com",
  databaseURL: "https://flashy-84f3e.firebaseio.com",
  projectId: "flashy-84f3e",
  storageBucket: "flashy-84f3e.appspot.com",
  messagingSenderId: "1035470518401"
};
firebase.initializeApp(config);

// redirect user
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    //do nothing
  }
  if (!user) {
    window.location = "/nl-test";
  }
});

//global variables
const artistInput = document.getElementById("artist");
const selectedArtistInput = document.getElementById("selectedArtist");

//global variable for database ref
const artistRef = firebase.database().ref("artists");
const lyricsRef = firebase.database().ref("/pending_songs");

//listen submit
document.getElementById("lyricsForm").addEventListener("submit", submitForm);

//submit function
function submitForm(e) {
  e.preventDefault();

  const name = getInput("songTitle");
  const albumName = getInput("album");
  const artistName = getInput("artist");
  let artistInfoArr = artistInfo(artistName);
  let artistId = '';
  if (artistInfoArr[0] == undefined) {
    artistId = 'N/A';
  }
  else {
    artistId = artistInfoArr[0];
  }

  let artistImageUrl = '';
  if (artistInfoArr[1] == undefined) {
    artistImageUrl = 'https://firebasestorage.googleapis.com/v0/b/flashy-84f3e.appspot.com/o/artists%2Fnepali_lyrics.png?alt=media&token=04b6f003-16b3-4ba0-9f67-212017cd4609';
  } else {
    artistImageUrl = artistInfoArr[1];
  }
  const artistName2 = selectedArtistInput.textContent;
  const genre = getInput("genre");
  const movieName = getInput("movieName");
  const youtubeVideoId = `${getInput("movieLink")}`;
  let contentInput = getInput("lyrics");
  const content = parseToHtml(contentInput);
  const hasCords = checkBox("cords");
  const dateCreated = Math.floor(Date.now() / 10);

  //get user info
  firebase.auth().onAuthStateChanged(currentUser => {
    if (currentUser) {
      //User is there!
      const addedById = currentUser.uid;
      const addedByName = currentUser.displayName;

      let arg = {
        name,
        albumName,
        artistName,
        artistName2,
        genre,
        movieName,
        youtubeVideoId,
        content,
        hasCords,
        addedById,
        addedByName,
        dateCreated,
        artistId,
        artistImageUrl
      };

      //call saveLyrics function
      saveLyrics(arg);
    }
  });

  //reset form after submit
  document.getElementById("lyricsForm").reset();

  //alert user after submission
  alert("Thank you for submitting lyrics!");

  if ((selectedArtistInput.style.display = "block")) {
    selectedArtistInput.style.display = "none";
  }
  location.reload();
}


//get form values function
function getInput(id) {
  return document.getElementById(id).value;
}

//checkbox value function
function checkBox(id) {
  if (document.getElementById(id).checked) {
    return true;
  } else return false;
}

//add artist function
function addArtist() {
  if (document.getElementById("artist").value === "") {
    alert("Add artist-1 name!");
  } else {
    const selectedArtist = getInput("artist");
    selectedArtistInput.innerHTML =
      selectedArtist +
      `<a id='closeBtn' onClick='removeArtist()'><i class='fas fa-window-close'></i></a>`;
    selectedArtistInput.style.display = "block";
    document.getElementById("artist").value = "";

    artistRef
      .orderByChild("name")
      .equalTo(selectedArtist)
      .on("value", snapshot => {
        snapshot.forEach(data => {
          const artistID = data.key;
          const imageURL = data.child("imageUrl").val();
          artist1ID = artistID;
          artist1Image = imageURL;
        });
      });
  }
}
//ArtistInfo Function
function artistInfo(artistName) {
  let artistArr = [];

  artistRef
    .orderByChild("name")
    .equalTo(artistName)
    .on("value", snapshot => {
      snapshot.forEach(data => {
        artistArr.push(data.key);
        artistArr.push(data.child("imageUrl").val());
      });
    });
  if (artistArr === []) {
    return artistName;
  }
  return artistArr;
}


//Artist options
artistRef.orderByValue().on("value", snapshot => {
  snapshot.forEach(data => {
    let artist = data.child("name").val();

    document.getElementById(
      "artistList"
    ).innerHTML += `<option value='${artist}'></option>`;
  });
});

//remove artist function
function removeArtist() {
  selectedArtistInput.textContent = "";
  selectedArtistInput.style.display = "none";
}

// saveLyrics function
function saveLyrics(arg) {
  let lyrics = {
    name: arg.name,
    albumName: arg.albumName,
    artistName: arg.artistName,
    genre: arg.genre,
    movieName: arg.movieName,
    youtubeVideoId: arg.youtubeVideoId,
    content: arg.content,
    hasCords: arg.hasCords,
    addedById: arg.addedById,
    addedByName: arg.addedByName,
    dateCreated: arg.dateCreated,
    artistId: arg.artistId,
    artistImageUrl: arg.artistImageUrl,
    likeCount: 0,
    viewCount: 0,
    favouriteCount: 0
  };

  if (arg.artistName2 !== "") {
    lyrics["artistName2"] = arg.artistName2;
  }

  lyricsRef.push(lyrics);
}

//preview Lyrics 

function previewLyrics() {

  const name = getInput("songTitle");
  const lyrics = getInput('lyrics');
  const genre = getInput('genre');
  const parsedLyrics = parseToHtml(lyrics);
  const artistName = getInput("artist");
  let artistInfoArr = artistInfo(artistName);
  let artistImage = '';
  const youtubeLink = getInput('movieLink');
  


  firebase.auth().onAuthStateChanged(currentUser => {
    if (currentUser) {
      const userName = currentUser.displayName;

      if (artistInfoArr[1] == undefined) {
        artistImage = 'https://firebasestorage.googleapis.com/v0/b/flashy-84f3e.appspot.com/o/artists%2Fnepali_lyrics.png?alt=media&token=04b6f003-16b3-4ba0-9f67-212017cd4609';
      }
      else {
        artistImage = artistInfoArr[1];
      }

      if ((name && lyrics && artistName) == '') {
        alert('Please fill the fields first!');

      }

      else {

        document.getElementById('previewContainer').innerHTML = `
      <div class="modal" id="myModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
          <h5 class="modal-title">${name}</h5> 
          <button class="close" data-dismiss="modal">&times;</button> 
        </div>
        <div class="modal-body">
          <div class="row">
         
          <img id="artistImage" style="width:40px; height: 40px; border-radius:50%; margin-left: 10px; margin-right: 8px; margin-bottom:5px;" src="${artistImage}"/>
          <font color='#341f97' id="artistNameModal">${artistName}</font>
         
          </div>
          <hr/>
          <div class="mb-4">Genre: <font color='#341f97'>${genre}</font></div>
          <hr/>
          <div>Contributed By: <font color='#341f97'>${userName}</font></div>
          <hr/>
          <div id="lyricsPreviewContainer" class="unselectable">
            ${parsedLyrics}
          </div>
          <div id="youtubeVideo" data-toggle="tooltip" data-placement="top" title="Click to toggle video"  onclick="playVideo()"><img src="images/if_youtube_317714.png" alt="youtube"/></div>
        
        </div>
        <div id="videoContainer">
        <div class="embed-responsive embed-responsive-16by9 videos-container">
            <iframe class="embed-responsive-item" src="https://youtube.com/embed/${youtubeLink}" allowfullscreen></iframe>
        </div>
        </div>
        <div class="modal-footer">
        <button type="submit" class="btn btn-primary">Submit Lyrics</button>
        <button class="btn btn-secondary" data-dismiss="modal">Back</button>
        </div>
      
        </div>
        </div>
        </div>
       `
      }
      if (youtubeLink == '') {
        document.getElementById('youtubeVideo').style.display = 'none';
      }

    }
    else {
      alert('Please Log in!');
    }

  })
}
function playVideo() {
  if (document.getElementById('videoContainer').style.display != 'block') {
    document.getElementById('videoContainer').style.display = 'block';
  }
  else {
    document.getElementById('videoContainer').style.display = 'none';
  }

}


//test for primary arstist
//youtube link id only DONE!

//add new artist


 document.getElementById('newArtistForm').addEventListener('submit', addNewArtist)

 function addNewArtist(){
   const newArtistName = getInput('newArtistName');
   const newArtistImgUrl = getInput('newArtistImageUrl');
  
   const newArtistInfo = {
     name: newArtistName,
     imageUrl: newArtistImgUrl,
     viewCount: 0
   }

   artistRef.push(newArtistInfo);
 }




