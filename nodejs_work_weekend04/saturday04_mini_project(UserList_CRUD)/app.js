const http=require('http');
const express=require('express');
const cors=require('express');
const static=require('serve-static');
const bodyParser=require('body-parser');
const path=require('path');
const app=express();
const router=express.Router();

app.set('port', 80);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({exteneded:false}));
app.use(bodyParser.json());

let userIdCount = 0;
let userList = [];

// 요청 라우팅 설정
// 사용자 정보 저장 요청 -> 배열에 사용자 정보 저장
router.route('/user').post((req,res)=>{
    console.log('/user -post 요청 받음.');
    let user = {
        id: userIdCount++,
        name: req.body.name || req.query.name,
        region: req.body.region || req.query.region
    };
    
    userList.push(user);
    
    //res.send(userList);
    res.redirect('/user'); // GET으로 /user 요청
});

// 사용자 목록 보기 요청 -> user_list.ejs페이지 렌더링
router.route('/user').get((req,res)=>{
    console.log('/user -get 요청 받음.');
    if(userList.length > 0) {
        req.app.render('user_list', {'users':userList}, (err, html)=>{
            if(err) throw err;
            res.end(html);
        });
    } else {
        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
        res.end("<h2>입력된 정보가 없습니다.</h2>");
    }
});
// 사용자 정보 상세보기 페이지 렌더링 -> user_detail.ejs
router.route('/user/:id').get((req,res)=>{
    console.log('/user/:id -get 요청');
    let context;
    let id = req.params.id;
    for(let user of userList){
        if(user.id == id) {
            context = {'user': user};
            break;
        }
    }
    req.app.render('user_detail', context, (err, html)=>{
        if(err) throw err;
        res.end(html);
    });
});
// 사용자 정보 수정 페이지 렌더링 -> user_modyfy.ejs
router.route('/user/:id/modify').get((req,res)=>{
    console.log('/user/:id/modify -get 요청');
    let context;
    let id = req.params.id;
    for(let user of userList){
        if(user.id == id) {
            context = {'user': user};
            break;
        }
    }
    req.app.render('user_modify', context, (err, html)=>{
        if(err) throw err;
        res.end(html);
    });
});
// 사용자 정보 수정 페이지 완료 -> /user로 redirect된다.
router.route('/user/:id/update').post((req,res)=>{
    console.log('/user/:id/modify -get 요청');
    let id = req.params.id;
    let name = req.body.name;
    let region = req.body.region;
    for(let i=0; i<userList.length; i++){
        if(userList[i].id == id) {
            userList[i] = {id:id, 'name':name, 'region':region};
            break;
        }
    }
    res.redirect('/user');
});
// 사용자 정보 삭제 페이지 -> /user로 redirect
router.route('/user/:id/delete').get((req,res)=>{
    console.log('/user/:id/delete -get 요청');
    let id = req.params.id;
    for(let i=0; i<userList.length; i++){
        if(userList[i].id == id) {
            //delete userList[i];
            for(let j=i; j<userList.length-1; j++){
                userList[j] = userList[j+1];
            }
            userList.pop();
            break;
        }
    }
    res.redirect('/user');
});

app.use('/', router);

let server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`http://localhost:${app.get('port')}`);
});