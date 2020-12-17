//post 방식으로 외부 사이트의 웹 가져오기
//http.request() 메소드 사용

var http = require('http');

var opts = {
    host : 'www.google.com',
    port : 80,
    method : 'POST',
    path : '/',
    headers : {}
}

var resData = '';
var req = http.request(opts, function(res) {
    //응답처리
    res.on('data', function(chunk) {
        resData += chunk;
    });
    res.on('end', function() {
        console.log(resData); 
    });
});

opts.headers['Contnt-Type'] = 'application/x-www-form-urlencoded';
req.data = "q=actor";
opts.headers['Content-Length'] = req.data.length;

req.on('error', function(err) {
    console.log("오류 발생 : " + err.message);
});

//요청 전송
req.write(req.data);
req.end();