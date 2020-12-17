const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const ejs = require('ejs');
const fs = require('fs');

const router = express.Router();

const app = express();

const admin = firebase;
var serviceAccount = require('./node-k-0dc65954b4c7.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

router.route('/home').get(function (req, res) {
    db.collection('users').get()
        .then((snapshot) => {
            var userData = [];
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
                var user = doc.data();
                user._id = doc.id;
                userData.push(user);
            });
        //db읽기 성공 후 ejs 렌더링
            req.app.render('home', {users: userData}, function (err, html) {
                res.end(html);
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });


});

var cars = [{
    name: 'SM3',
    price: 2000,
    year: 1999,
    company: 'SAMSUNG'
}, {
    name: 'SM9',
    price: 6000,
    year: 2013,
    company: 'SAMSUNG'
}];

app.get('/car_list', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');

    fs.readFile('./views/car_list.ejs', 'utf8', function (error, data) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.end(ejs.render(data, {
            cars: cars
        }));
    })
});

app.use('/', router);

exports.app = functions.https.onRequest(app);
