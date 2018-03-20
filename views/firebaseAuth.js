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
<<<<<<< HEAD
            // //dev mode
            // window.location ='/add.html';

            //deployed mode
=======
>>>>>>> d82c463ecbe9a7ba702f8608047fe05d38da3ab6
            window.location ='views/add.html';
        }
        if(!user){
            alert('Please login with Facebook Account!');

            // //dev mode
            // window.location = '/';

            //deployed mode
            window.location = 'nl-test/';
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
