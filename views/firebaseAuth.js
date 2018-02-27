function signInWithFacebook(){
    const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

    firebase.auth()
    .signInWithPopup(facebookAuthProvider);

    window.location = '/add';
}

function signOut(){
    firebase
    .auth()
    .signOut()
    .then(()=>{
        console.log("You are signed out!");
    })
    .catch((error)=>{
        console.log(error);
    });
}
function checkLogin(){
    const firebaseToken = localStorage.getItem('firebase:authUser:AIzaSyAle0qtETlQfp9uJZGHa896Zbh1lTQzRn4:[DEFAULT]');

    if (firebaseToken === null){
        console.log('you are logged out');
    }else{
        console.log('you are logged in!');
    }
}

checkLogin();