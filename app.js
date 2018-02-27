const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
// const firebase = require('firebase');
const serviceAccount = require('./lyricsform-firebase-adminsdk-qcutu-963367b477.json');


const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lyricsform.firebaseio.com'
});


const app = express();

app.set('view engine', 'ejs');

//set static folder
app.use(express.static('views'));

app.set('views', __dirname + '/views');

//give server access to the user input
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:false}));

app.use(logger('dev'));

//Authentication middleware
function isAuthenticated(req, res, next){
    //check if user is logged in 
    //if they are, redirect
    //if not, send them to login page
    // const user = firebase.auth().currentUser;

    if(req.authenticated){
      
        return next();
    }

    res.redirect('/');
    }

app.get('/', (req, res)=>{
    res.render('index.ejs');
});

app.get('/add', (req, res)=>{
    res.render('add.ejs');
});






app.post('/',(req,res)=>{
    
});



const port = 3000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});