const http = require('http');
const express = require('express');
const app = express();
const static = require('serve-static');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');

const JoindataList = [
    {"no":1,"name":"JANG"},
    {"no":2,"name":"Lee"}
];
let no = 3;

Array.prototype.myFindIndex = function(key, value){
    for(let i = 0; i<this.length; i++){
        if(this[i][key] == value){
            return i;
        }
    }
    return -1;
}

app.set('port', 3000);
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/html', static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

router.route('/').get((req,res)=>{
    res.redirect('/html');
});




router.route('Join-us/form').post((req,res)=>{
    let Joindata = {
        "no" : no++,
        "name" : req.body.name
    }
    JoindataList.push(Joindata);
    console.log("회원정보 등록 성공!!")
})