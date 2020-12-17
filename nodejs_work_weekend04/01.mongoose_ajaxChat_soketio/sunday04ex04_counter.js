// sunday04ex04_counter.js
const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();

app.use(cors());

var cnt = 0;

router.route("/").get((req, res)=>{
    cnt++;
    res.end();
});

router.route('/count/:size').get((req, res) => {
    var size = Number(req.params.size);
    //console.log("size => " + size);
    if(cnt <= size) {
       res.end("");
    } else {
        console.log("변경된 내용이 있다.", size)
        res.end("" + cnt);
    }
});

app.use('/', router);
const server = http.createServer(app);
server.listen(3000, ()=>{
    console.log('http://localhost:3000');
});