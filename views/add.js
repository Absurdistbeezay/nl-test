// Initialize Firebase
var config = {
  apiKey: "AIzaSyAle0qtETlQfp9uJZGHa896Zbh1lTQzRn4",
  authDomain: "lyricsform.firebaseapp.com",
  databaseURL: "https://lyricsform.firebaseio.com",
  projectId: "lyricsform",
  storageBucket: "lyricsform.appspot.com",
  messagingSenderId: "1093692190318"
};
firebase.initializeApp(config);

//redirect user
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
  const artistId = artistInfoArr[0];
  const artistImageUrl = artistInfoArr[1];
  const artistName2 = selectedArtistInput.textContent;
  const genre = getInput("genre");
  const movieName = getInput("movieName");
  const youtubeVideoId = getInput("movieLink");
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
    viewCount: 0
  };

  if (arg.artistName2 !== "") {
    lyrics["artistName2"] = arg.artistName2;
  }

  lyricsRef.push(lyrics);
}
