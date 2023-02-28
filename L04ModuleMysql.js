// react vs vue : react 먼저 배우세요! vue 나중에!
/*
기존에 모듈 사용하는 방법

const mysql=require("mysql2"); // npm i --save mysql2 라이브러리 설치되있어야함
const scottConnInfo={ // mysql 접속정보
    user:"root",
    password:"mysql123",
    host:"localhost",
    port:3306,
    database:"scott"
}
const pool=mysql.createPool(scottConnInfo);
const poolPromise=pool.promise();
(async()=>{
    const [rows,f]=await poolPromise.query("SELECT * FROM EMP");
    console.log(rows);
})(); // 함수를 생성하자마자 실행 (()=>{})();

*/

// mysql 디비 접속을 모듈로 반환해서 사용!
// mysqlCottPool.js 에서 module.exports=poolPromise; 모듈 반환함!
const scott=require("./mysqlScottPool"); // 이것이 노드모듈(export)이다 ~!!(react, vue, 브라우저 등에서는 export 라는 명칭 사용X)
// require == import (불러오기.가져오기)
// => connection pool // import
(async()=>{
    const [rows,f]=await scott.query("SELECT * FROM DEPT");
    console.log(rows);
})(); // 함수 생성하자마자 실행

// module.exports 모듈 반환 => require("모듈파일경로") 모듈사용