// sunday04ex01_require.js
// 모둘 파일의 경로를 상대경로 설정한다.
var user1 = require('./sunday04ex01_exports');

function showUser() {
    return `name은 ${user1.getUser().name} , group은 ${user1.group.name}`;
}

console.log('사용자 정보: %s', showUser());