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

//global variable for database ref
const lyricsRef = firebase.database().ref(`/pending_songs`);

//listen submit
document.getElementById('lyricsForm').addEventListener('submit', submitForm);

//submit function
function submitForm(e){
    e.preventDefault();
    const name = getInput('songTitle');
    const albumName = getInput('album');
    const artistName = getInput('artist');
    const genre = getInput('genre');
    const movieName = getInput('movieName');
    const youtubeVideoId = getInput('movieLink');
    const contentInput = getInput('lyrics');
    const hasCords = checkBox('cords');
    const dateCreated = Math.floor(Date.now()/10);

    //get user info 
    firebase.auth().onAuthStateChanged((currentUser)=> {
        if (currentUser) {
         //User is there!
         const addedById = currentUser.uid;
         const addedByName = currentUser.displayName;

        //call saveLyrics function
        saveLyrics(name, albumName, artistName, genre, movieName, youtubeVideoId, contentInput, hasCords, addedById, addedByName, dateCreated);

        }     
      }); 


    // const addedById = firebaseAuth.currentUser.displayName;
    // const addedByName = getUsername();

    //reset form after submit
    document.getElementById('lyricsForm').reset();

    //alert user after submission
    alert('Thank you for submitting lyrics!');
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


// saveLyrics function
function saveLyrics(name, albumName, artistName, genre, movieName, youtubeVideoId, content, hasCords, addedById, addedByName, dateCreated){

    const lyricsCollection = lyricsRef.push();

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