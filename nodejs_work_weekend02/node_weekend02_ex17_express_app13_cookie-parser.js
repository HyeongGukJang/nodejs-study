var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var static = require('serve-static');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));

var cookieParser = require('cookie-parser');
app.use(cookieParser() );

var router = express.Router();
router.route('/process/showCookie').get(function(req, res) {
    console.log('/process/showCookie 호출.');
    
    res.send(req.cookies);
});

router.route('/process/setUserCookie').get(function(req,res){
    // 쿠기 설정
    res.cookie('user', {
        id:'KIM',
        name:'방탄소년단',
        authorized:true
    });
    
    // redirect로 응답
    res.redirect('/process/showCookie')
});

app.use('/', router);

var server = http.createServer(app);
server.listen(app.get('port'), function() {
    console.log('서버가 실행 되었습니다. %d', app.get('port'));
})