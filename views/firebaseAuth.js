function signInWithFacebook(){
    const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

    firebase.auth()
    .signInWithPopup(facebookAuthProvider)
    .then(()=>{
        window.location.reload();
    })
}

function signOut(){
    firebase
    .auth()
    .signOut()
    .then(()=>{
        window.location.reload();
    })
    .catch((error)=>{
        console.log(error);
    });
}

function addBtnClick(){
    firebase.auth().onAuthStateChanged(user=>{
        if(user){
            window.location ='nl-test/views/add.html';
        }
        if(!user){
            alert('Please login with Facebook Account!');
            window.location = '/nl-test/';
        }
    })
}

firebase.auth().onAuthStateChanged(user=>{
    const btn = document.getElementById('btnSignIn');
    const btnSignout = document.getElementById('btnSignOut');
    if(user){
        console.log('Logged in!');
       
        btn.style.display = "none";
        
    }
  if(!user){
      console.log('Logged Out!');
    
      btnSignOut.style.display ="none";
      

  }
})
