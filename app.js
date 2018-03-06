const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const firebase = require('firebase');
// const firebaseMiddleWare = require('express-firebase-middleware');
const serviceAccount = require('./lyricsform-firebase-adminsdk-qcutu-963367b477.json');


const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lyricsform.firebaseio.com'
});

const database = firebaseAdmin.database();


const app = express();

app.set('view engine', 'ejs');

//set static folder
app.use(express.static('views'));

app.set('views', __dirname + '/views');

//give server access to the user input
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:false}));

app.use(logger('dev'));

// //Authentication middleware
// const isAuthenticated = (req, res, next)=>{
//     const user = firebase.auth().currentUser;
//     if(user!=null){
//         req.user = user;
//         next();
//     }else{
//         res.redirect('/');
//     }
// }

app.get('/', (req, res)=>{
    res.render('index.ejs');
});

app.get('/add', (req, res)=>{
    const artistRef = database.ref('/artists');
    artistRef.once('value', (snapshot)=>{
        const data = snapshot.val()
        if(!data){
            data={};
        }
        res.render('add.ejs', {artists: data});
    })
    
});






app.post('/',(req,res)=>{
    
});



const port = 3000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});