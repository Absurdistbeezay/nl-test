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

//global variables
const artistInput = document.getElementById('artist');
const selectedArtistInput = document.getElementById('selectedArtist');

//global variable for database ref
const lyricsRef = firebase.database().ref('/pending_songs');

//redirect user
firebase.auth().onAuthStateChanged((user)=>{
    if(user){
       //do nothing 
    }
    if(!user){
        window.location = '/';
    }
});

//listen submit
document.getElementById('lyricsForm').addEventListener('submit', submitForm);

//submit function
function submitForm(e){
    e.preventDefault();
    const name = getInput('songTitle');
    const albumName = getInput('album');
    const artistName = getInput('artist');
    const artistName2 = getInput('selectedArtist');
    console.log(artistName2);
    const genre = getInput('genre');
    const movieName = getInput('movieName');
    const youtubeVideoId = getInput('movieLink');
    let contentInput = getInput('lyrics');
    const content = parseToHtml(contentInput);
    const hasCords = checkBox('cords');
    const dateCreated = Math.floor(Date.now()/10);

    //get user info 
    firebase.auth().onAuthStateChanged((currentUser)=> {
        if (currentUser) {
         //User is there!
         const addedById = currentUser.uid;
         const addedByName = currentUser.displayName;

        //call saveLyrics function
        saveLyrics(name, albumName, artistName, artistName2, genre, movieName, youtubeVideoId, content, hasCords, addedById, addedByName, dateCreated);

        }     
      }); 

    //reset form after submit
    document.getElementById('lyricsForm').reset();

    //alert user after submission
    alert('Thank you for submitting lyrics!');

    if(selectedArtistInput.style.display="block"){
        selectedArtistInput.style.display ="none";
    }
}

//get form values function
function getInput(id){
    return document.getElementById(id).value;
}

//checkbox value function
function checkBox(id){
    if(document.getElementById(id).checked){
        return true;
    }
    else return false;
}

//add artist function
function addArtist()
{

    if(document.getElementById('artist').value===''){
        alert('Add artist-1 name!');
    }
    else{
        const selectedArtist = getInput('artist');     
        selectedArtistInput.innerHTML = selectedArtist + `<a id="closeBtn" onClick="removeArtist()"><i class="fas fa-window-close"></i></a>`;
        selectedArtistInput.style.display = "block";
        document.getElementById('artist').value = '';
    }
}

//remove artist function
function removeArtist(){
    selectedArtistInput.value = '';
    selectedArtistInput.style.display ="none";
}

// saveLyrics function
function saveLyrics(name, albumName, artistName, artistName2, genre, movieName, youtubeVideoId, content, hasCords, addedById, addedByName, dateCreated){

    const lyricsCollection = lyricsRef.push();
    if(artistName2 != undefined){

    lyricsCollection.set({
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
       dateCreated     
    });
}
else {
    lyricsCollection.set({
    name,
    albumName,
    artistName,
    genre,
    movieName,
    youtubeVideoId,
    content,
    hasCords,
    addedById,
    addedByName,
    dateCreated   
});
}
}

