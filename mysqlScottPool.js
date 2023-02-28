const mysql=require("mysql2");
const scottConnInfo={ // mysql 접속정보
    user:"root",
    password:"mysql123",
    host:"localhost",
    port:3306,
    database:"scott"
}
const pool=mysql.createPool(scottConnInfo);
const poolPromise=pool.promise();

// console.log(pool) // 화면 마우스오른쪽 실행
module.exports=poolPromise; // nodemodule exports - 모듈로 반환이 된다!