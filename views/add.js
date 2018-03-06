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

//redirect user
firebase.auth().onAuthStateChanged((user)=>{
    if(user){
       //no nothing 
    }
    if(!user){
        window.location = '/';
    }
})

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
    let contentInput = getInput('lyrics');
    const content = parseToHtml(contentInput);
    //test
    console.log(content);
    const hasCords = checkBox('cords');
    const dateCreated = Math.floor(Date.now()/10);
  

    //get user info 
    firebase.auth().onAuthStateChanged((currentUser)=> {
        if (currentUser) {
         //User is there!
         const addedById = currentUser.uid;
         const addedByName = currentUser.displayName;

        //call saveLyrics function
        saveLyrics(name, albumName, artistName, genre, movieName, youtubeVideoId, content, hasCords, addedById, addedByName, dateCreated);

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

//parse content to HTML
function parseToHtml(lyricsContent){

    let splitContent = lyricsContent.split('');
    let previousWasSpace =false;
    let previousWasChord = false;
    let previousWasSpecialLine = false;

    for(let i = 0; i<splitContent.length; i++){
        if(splitContent[i] === ' '){
            if(previousWasSpace){
                splitContent[i] = "&nbsp;";
                previousWasSpace = false;
                continue;
            }
            previousWasSpace = true;
        }else{
            previousWasSpace = false;
        }
        if(splitContent[i]==="`"){
            previousWasChord = true;
            splitContent[i] = `<font color='#CHORDCOLOR#'>`;
        }
        if(splitContent[i] ==="_"){
            previousWasSpecialLine = true;
            splitContent[i]= `<font color='#SPECIALCOLOR#'>`
        }
        switch(splitContent[i]){
            case'\n':
                if(previousWasChord){
                    splitContent[i] = `</font><br/>`;
                    previousWasChord = false;
                }
                else if(previousWasSpecialLine){
                    splitContent[i]=`</font><br/>`;
                }
                else{
                    splitContent[i] = `<br/>`;
                }
                
                break;
                case'\t':
                splitContent[i]= "&nbsp; &nbsp; &nbsp;";
                break;
            default:
            splitContent[i];
            
        }
    }
    return splitContent.join('');
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