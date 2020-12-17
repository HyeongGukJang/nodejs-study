const http = require('http');
const express = require('express');
const app = express();
const static = require('serve-static');
const router = express.Router();
const path = require('path'); // OS마다 다른 구분자를 
const bodyParser = require('body-parser');

const dataList = [
    {"no":1, "name":"HONG", "phone":"010-1111-1111", "subject":"JAVA", "studyday":"2020-11-15"},
    {"no":2, "name":"KIM", "phone":"010-2222-2222", "subject":"ORACLE", "studyday":"2020-11-20"},
    {"no":3, "name":"LEE", "phone":"010-3333-3333", "subject":"SPRING", "studyday":"2020-11-25"}
];
let no = 4;

const JdataList =[
    {"Jno":1, "Jname":"JANG", "Jpw":"1234"},
    {"Jno":2, "Jname":"LEE", "Jpw":"5678"}
];
let Jno = 3;

Array.prototype.myFindIndex = function(key, value){
    for(var i = 0; i<this.length; i++){
        if(this[i][key] == value){
            return i;
        }
    }
    return -1;
}

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/html', static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

router.route('/').get((req, res)=>{
    res.redirect('/html');
});

router.route('/Joinus/input').post((req, res)=>{
    let Jdata = {
        "Jno" : Jno++,
        "Jname" : req.body.Jname,
        "Jpw" : req.body.Jpw
    }
    
    JdataList.push(Jdata);
    console.log(">>>>> 회원가입 성공!!");
    res.redirect('/Joinus/list');
});

router.route('/Joinus/list').get((req, res)=>{
    // 뷰엔진 ejs 사용
    req.app.render('Joinus_list',{"list":JdataList}, (err, html)=>{
        if(err) {
            res.end('<h2>EJS Rendering Error!</h2>');
            return;
        }
        res.end(html);
    });
});


router.route('/Joinus/detail/:Jno').get((req,res)=>{
    let Jno = parseInt (req.params.Jno);
    let Jidx = JdataList.myFindIndex("Jno", Jno);

    req.app.render('Joinus_detail', {"Jdata":JdataList[Jidx]},(err, html)=>{
         if(err) {
             res.end('<h2>EJS Rendering Error!</h2>');
             return;
         }
         res.end(html);
     });
 });

 router.route('/Joinus/delete/:Jno').get((req,res)=>{
    let Jno = parseInt(req.params.Jno);
    let Jidx = JdataList.myFindIndex("Jno", Jno);
    JdataList.splice(Jidx, 1);
    res.redirect('/Joinus/list');
});

router.route('/Joinus/modify/:Jno').get((req,res)=>{
    let Jno = parseInt(req.params.Jno);
    let Jidx = JdataList.myFindIndex("Jno", Jno);
    req.app.render('Joinus_modify',{"Jdata":JdataList[Jidx]}, (err, html)=>{
        if(err) {
            res.end('<h2>EJS Rendering Error!</h2>');
            return;
        }
        res.end(html);
    });
 });


router.route('/Joinus/modify/').post((req,res)=>{
    let Jno = parseInt(req.body.Jno);
    let Jdata ={
        "Jno" : Jno,
        "Jname" : req.body.Jname,
        "Jpw" : req.body.Jpw
    }
    let Jidx = JdataList.myFindIndex("Jno", Jno);
    if(Jidx != -1){
        JdataList[Jidx] = Jdata;
    }
    // 수정이 완료 되었다. 목록으로 이동한다.
    res.redirect('/Joinus/list');
 });











router.route('/register/input').post((req, res)=>{
    let data = {
        "no" : no++,
        "name" : req.body.name,
        "phone" : req.body.phone,
        "subject" : req.body.subject,
        "studyday" : req.body.studyday
    }

    dataList.push(data);
    console.log(">>>>> 등록 성공!!");
    res.redirect('/register/list');
});

router.route('/register/list').get((req, res)=>{
    // 뷰엔진 ejs 사용
    req.app.render('register_list',{"list":dataList}, (err, html)=>{
        if(err) {
            res.end('<h2>EJS Rendering Error!</h2>');
            return;
        }
        res.end(html);
    });
});





router.route('/register/detail/:no').get((req,res)=>{
   let no = parseInt (req.params.no);
   let idx = dataList.myFindIndex("no", no);
 // res.end(`<p>${JSON.stringify(dataList[idx])}</p>`);
 // res.end(); 문자열로  전달
    // res.send(dataList[idx]); // 객체로 전달
    req.app.render('register_detail', {"data":dataList[idx]},(err, html)=>{
        if(err) {
            res.end('<h2>EJS Rendering Error!</h2>');
            return;
        }
        res.end(html);
    });
});

router.route('/register/modify/:no').get((req,res)=>{
    let no = parseInt(req.params.no);
    let idx = dataList.myFindIndex("no", no);
    req.app.render('register_modify',{"data":dataList[idx]}, (err, html)=>{
        if(err) {
            res.end('<h2>EJS Rendering Error!</h2>');
            return;
        }
        res.end(html);
    });
 });

 router.route('/register/modify/').post((req,res)=>{
    let no = parseInt(req.body.no);
    let data ={
        "no" : no,
        "name" : req.body.name,
        "phone" : req.body.phone,
        "subject" : req.body.subject,
        "studyday" : req.body.studyday
    }
    let idx = dataList.myFindIndex("no", no);
    if(idx != -1){
        dataList[idx] = data;
    }
    // 수정이 완료 되었다. 목록으로 이동한다.
    res.redirect('/register/list');
 });

router.route('/register/delete/:no').get((req,res)=>{
    let no = parseInt(req.params.no);
    let idx = dataList.myFindIndex("no", no);
    dataList.splice(idx, 1);
    res.redirect('/register/list');
});

app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('http://localhost:%d', app.get('port'));
});