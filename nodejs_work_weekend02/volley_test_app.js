var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var static = require('serve-static');

var cors = require('cors');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

app.use(cors());

var router = express.Router();

router.route('/process/find_user').post(function(req,res){
    console.log('/process/find_user - POST 호출.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    if(paramId == undefined) {
        paramId = "no-paramId";
    }
    
    var resObj = {id:paramId};
    
    console.log(resObj);
    
    res.send(resObj);
});

router.route('/process/find_user').get(function(req,res){
    console.log('/process/find_user - GET 호출.');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    if(paramId == undefined) {
        paramId = "no-paramId";
    }
    
    var resObj = {id:paramId};
    
    console.log(resObj);
    
    res.send(resObj);
});



app.use('/', router);

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('서버가 실행 되었습니다. %d', app.get('port'));
})