var http = require('http');
var fs = require('fs');
var server = http.createServer();

var port = 3000;
server.listen(port, function() {
    console.log('서버 실행 중... %d', port);
});

//클라이언트 요청 처리 이벤트
server.on('request', function(req, res) {
    console.log('클라이언트 요청이 들어왔습니다.');
    
    var filename = 'house.jpg';
    var infile = fs.createReadStream(filename, {flag:'r'});
    var filelength = 0;
    var curlength = 0;
    
    fs.stat(filename, function(err, stats) {
        filelength = stats.size;
    });
    
    // 헤더 쓰기
    res. writeHead(200, {"Content-Type":"image/jpg"});
    //파일의 내용을 스트림에서 읽어 본문 쓰기
    infile.on('readable', function() {
        //var fn = setInterval(function() {
            var chunk;
            while(null !== (chunk = infile.read())) {
                console.log('읽어들인 데이터 크기 : %d 바이트', chunk.length);
                curlength += chunk.length;
                res.write(chunk, 'utf8', function(err) {
                    console.log('파일 부분 쓰기 완료 : %d, 파일 크기 : %d', curlength, filelength); 
                    if(curlength >= filelength) {
                        // 응답 전송하기
                        res.end();
                    } 
                    //else {
                    //    clearInterval(fn);
                    //}
                });
            }//end of while
        //}, 1000);
    });
});
