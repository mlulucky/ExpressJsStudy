const express=require("express"); // 여기서 express 는 서버가 아니라 라우터가 될것이다!
const scott=require("./mysqlScottPool"); // mysql db 모듈 불러오기(내가 만든거)
const router=express.Router();

/// 라우터!! - import 대상!!
router.get("/list.do",async (req,res)=>{
    const [rows,f]=await scott.query("SELECT * FROM EMP"); // await 사용하는 이유 // mysql pool.promise(); // 현재 mysql이 promise를 반환하고 있어서! scott.query
    res.render("empList",{empList:rows}); // 바로 퍼그파일을 렌더할 수 있는 이유 L05Router 파일에서 app.set("view engine", "pug"); 로 템플릿엔진을 퍼그로 설정했기 때문에 // empList 는 pug 문서 이름 // option에 empList는 내가 지은 이름
});

router.get("/detail.do",async(req,res)=>{
   if(!req.query.empno){ // req.query.empno 파라미터 없을때 400에러 => http://localhost:7777/emp/Detail.do
       res.sendStatus(400); // Bad Request
       // res.status(400).send("<h1>잘못된 요청 400</h1>");
   }
   const [rows,f]=await scott.query("SELECT * FROM EMP WHERE EMPNO=?",[req.query.empno]); // ❓언제 query이고 언제 params 인가?
   if(rows.length>0) { // 사원리스트가 있는 경우!
       res.render("empDetail",{emp:rows[0]});
   }else { // 사원리스트가 없는 경우 // 파라미터 empno가 없는 경우
       // 해당 사원(레코드)가 존재하지 않습니다.(이미 삭제된 레코드 입니다.)페이지를 반환 or 사원 리스트로 이동
       res.redirect("./list.do"); // 리다이렉트. 페이지 뒤로 돌리기
   }
// 개발에 용기 소통 테스트 주도개발? 논리?? -> 자동으로 생긴다. // 질문도 용기다
});
// 💎REST Api : 웹 서비스 요청을 구체화 시키기 위한 노력의 일부(url, 메소드)
// 1. pathVariable : 쿼리스트링이 파라미터를 파악하기 어렵고 해당 파라미터가 리소스의 꼭 필요한 것을 명시하기 위해 등장
// 2. mehtod 분할 : (GET,POST), PUT, DELETE, PATCH (서비스를 명시하려고!)
// express 가 파라미터를 패스에서 받을 수 있도록 지원!
// :empno 는 양식.형식이다!

// 사원 수정페이지 - 패스사이에 파라미터를 포함해서 보낸다(pathvariable) - 파라미터가 꼭 필요한기능. 없으면 에러처리 난다.
router.get("/:empno/update.do", async(req,res)=>{
    // pathvariable 설정으로 empno 가 존재하지 않는 페이지는 없는 페이지기 때문에 400 에러 설정은 필요없다. => 400 파라미터 에러는 pathvariable 처리하면 좋다
    const [rows,f]=await scott.query("SELECT * FROM EMP WHERE EMPNO=?", [req.params.empno]); // ❓req.query가 아니라 req.params 쓰는 이유
    if(rows.length>0){
        res.render("empUpdate",{emp:rows[0]});
    }else {
        res.redirect("list.do"); // 상대경로 "./" "." " " ".." "../"없는 것도 동일하다
        // ./list.do == .list.do == list.do  모두 상대경로
    }
    // pathname 사이(/:empno/)에 파라미터를 포함해서 보낸다.
    // http://localhost:7777/emp/2222/update.do
   // res.send(req.params); // {"empno":"2222"}
}); // 입사일은 하루 전날로 나온다. 노드js 의 나라가 미국으로 되어있어서. 한국으로 바꾸면 되는데 아직 변경전이다!
router.post("/update.do",async(req,res)=>{
    // res.send(req.body);
    let sql="UPDATE EMP SET ENAME=?,JOB=?,HIREDATE=?,SAL=?,COMM=?,MGR=?,DEPTNO=? WHERE EMPNO=?";
    for(let key in req.body){ // "" 공백을 한꺼번에 null 처리
        if(!req.body[key]){ req.body[key]=null;}
    }
    // nodemon 수정된 내역이 바로 적용되지 않을때! 저장하기!
    // 인텔리제이(자동저장!) // 인테리제이처럼 자동저장하는 경우, 노드몬이 자동저장할때마다 계속 바꿀수없다. 변화가 있는지 지켜보고 있다. 살짝 기다리고 있을때 새로고침한다.
    const values=[
                  req.body.ename,
                  req.body.job,
                  req.body.hiredate,
                  (req.body.sal) && parseFloat(req.body.sal), // (req.body.sal) true(값이 있어야.null(X))여야 parseFloat(req.body.sal) 실행. (req.body.sal) 가 false 면 (req.body.sal) 값 그대로 실행
                  (req.body.comm) && parseFloat(req.body.comm),
                  (req.body.mgr) && parseInt(req.body.mgr),
                  (req.body.deptno) && parseInt(req.body.deptno),
                  (req.body.empno) && parseInt(req.body.empno)
                  // 옵셔널 체이닝 함수로 감싸는(parseInt()) 경우에는 사용할 수없다.  req.body.sal?.parseFloat(req.body.sal)
                  // (req.body.sal) null 이냐? null 이면 null 로 처리. null 이 아니면 정수로 변환
                  // (req.body.sal==="")?null:parseFloat(req.body.sal), // "" 공백 일때, false 일때 같은말
                  // (!req.body.comm)?null:parseFloat(req.body.comm),
                  // (!req.body.deptno)?null:parseInt(req.body.deptno),
                  // (!req.body.mgr)?null:parseInt(req.body.mgr),
                  // (!req.body.empno)?null:parseInt(req.body.empno)
                  ];
        // () && () && () .. : 모두가 true가 될때까지 실행. 만약 false 이면 멈추고 반환
        let update=0;
        try{
            const [result]=await scott.execute(sql,values);
            update=result.affectedRows; // DML 실행시 성공한 rows 수
        }catch(e){
            console.error(e);
        }
        if(update>0){
            res.redirect("./detail.do?empno="+req.body.empno); // 상세페이지는 이전에 파라미터를 뒤에 보내는 식으로 했었어서
        }else {
            res.redirect(`./${req.body.empno}/update.do`); // 업데이트는 파라미터를 중간으로 적용시켰어서
        }
        // console.log(values); // NaN 출력됨
        // req.send(values);   // NaN -> Null 로 변환
        // req.send(req.body); // req.send()가 json을 처리할때 NaN -> Null 로 변환
        // 왜? JSON 은 value 가 NaN, Undefined, 함수 가 없다 => null 로 바꾼다.
        // 자동으로 JSON stringify가 동작됨
});

// 사원 등록페이지
router.get("/insert.do",(req, res)=>{
    res.render("empInsert");
});
router.post("/insert.do",async (req,res)=>{
   // console.log(req.body); // post 방식일 때 data 파라미터가 다 req.body 로 들어온다.
    // res.end(); // 등록폼에 비어진 값 ' ' => null 로 처리해야함.
    for (let key in req.body){ // 파라미터의 키가 참조하는 값이 null 이면 있을때까지 값을 가져온다.
        if(!req.body[key]) { // key 값이 공백이면?
            req.body[key]=null; // null 처리 // 파라미터를 공백으로 보내기 때문에 공백을 null 처리 한다. // 값이 없으면 == null
        }else {
            if(key==="comm" || key==="sal") { // 값이 null 이 아니고 key가 comm 상여금 이거나 급여이면 실행!!
                req.body[key]=parseFloat(req.body[key]);
                // 자바스크립트는 NaN 오류가 발생하지 않는다! new error 로 오류 발생시키기! 에러가 뜨며
            }else if(key==="empno" || key==="deptno" || key==="mgr") {
                req.body[key]=parseInt(req.body[key]); // 입력한 숫자를 정수로 변환. 뒤에오는 문자를 삭제한다. 100.11a => 100 // 문자가 앞에 오는 경우에는 NaN 처리 된다 a100 => NaN
            }

            if(Number.isNaN(req.body[key])) { // NaN 에러처리
                // new Error(key+"수가 아닌 파라미터가 넘어옴!");
                res.status(500).send(`<h1>${key}가 수가 아닌 값을 입력하셨습니다.</h1>`);
                return; // send 응답을 하고 또 응답 redirect 를 할 수 없다. . 응답종료시키기!
            }
            // => 위에 if, else if가 실행되고 공통으로 실행될 if문 // NaN 처리
        }
    }
    let insert=0; // 등록 성공 여부
    try { // 모델.뷰
        // 입사일 "yyyy-MM-dd" = mysql.date (이 형식의 문자열을 mysql 이 date로 바꿔준다)
        // "yyyy.MM.dd" => X mysql.date(못 바꾼다)
        // "yyyy-MM-dd HH:mm:ss" = mysql.datetime
        // "yyyy-MM-ddHH:mm:ss" => X mysql.datetime
        let sql="INSERT INTO EMP (empno, ename, job, mgr, hiredate, sal, comm, deptno) VALUE (?,?,?,?,?,?,?,?)";
        const [result,f]=await scott.execute(sql,[req.body.empno, req.body.ename, req.body.job, req.body.mgr, req.body.hiredate, req.body.sal, req.body.comm, req.body.deptno]);
        insert=result.affectedRows;
    }catch(e){
        console.error(e);
        res.status(500).send(`<h1>DB 등록을 실패했습니다. 다시 시도하세요!</h1>`); // 응답이 완료!
        return;  // send 응답을 하고 또 응답 redirect 를 할 수 없다. 응답종료시키기!
    }

    // 응답처리 // insert 등록이 성공하면!
    if(insert>0){
        res.redirect("/emp/list.do");
    }else{
        res.redirect("/emp/insert.do");
    }
});

// 사원 삭제페이지
router.get("/delete.do",async (req,res)=>{ // emp는 라우터로 쓰고 있는 경우에만 사용! L05Router 파일에서 적용시켰음
    // 요청처리
    if(!req.query.empno || isNaN(req.query.empno)) { // 400 에러 // 파라미터 값이 없으면. 숫자가 아니면(NaN)
        res.status(400).send("파라미터가 잘못된 요청입니다.");
        return;
    }
    let empno=parseInt(req.query.empno); // empno 가 없으면 삭제가 안된다!. 미리 empno 있는지 검사하기
    // 응답처리
    let del=0;
    try{ // 모델
        let sql="DELETE FROM EMP WHERE EMPNO=?";
        const [result]=await scott.execute(sql,[empno]);
        del=result.affectedRows;
    } catch(e){
        console.error(e);
    }
    if(del>0){
        res.redirect("/emp/list.do");
    }else{
        res.redirect(`/emp/${empno}/update.do`); // 파라미터가 반드시 있어야 한다! => path.variable 처리
    }

});

router.get("/empnoCheck.do",async (req,res)=>{
    // 파라미터가 있어야 들어올 수 있다
    if(!req.query.empno || isNaN(req.query.empno)){ // 파라미터가 잘못된 경우 - 400 에러
        res.sendStatus(400);
        return;
    }
    let empno=parseInt(req.query.empno);
    const resObj={check:false, emp:null}; // JSON 정보 // 있을때 true, 없을때 false
    try{
        let sql="SELECT * FROM EMP WHERE EMPNO=?"; // 💎empno가 있는지 물어보는 것!
        const [rows,f]=await scott.query(sql,[empno]); // 파라미터 ?물음표에 empno 대입
        if(rows.length>0) { // 동일한 사번이 있으면 1이 나온다.
            resObj.check=true;
            resObj.emp=rows[0]; // 사번으로 검색해서 나온 emp 사원 == rows[0]
        }
    }catch(e){
        console.error(e);
        res.sendStatus(500); // 오류가 뜨면 500
        return;
    }
    // 응답처리
    res.send(resObj); // 페이지응답.출력 // http://localhost:7777/emp/empnoCheck.do?empno=2222 => {check:false, emp:null}

})


module.exports=router; // router 내보내기!










// NaN 예외처리 어떻게 할건가? => null 처리?
// aaa11aa => 입력이 안되게. 브라우저 검사! => 검사했는데 넘어오는 경우. (악의적인 상황! 인위적!)
// 어떻게 취급할 것인가? 인위로 값을 바꿔서 저장할것인가 ? 다시 입력하는게 낫다.
// console.log(req.body)
// res.end();
// post 로 페이지가 올때 async 콜백 함수 실행
// 요청처리 : 사원 파라미터 처리 후(: 컨트롤역할 Controller) (db에 사원을 등록 : 서비스! Model,Servie) // 전체가 서비스인데. 클라이언트 측에서 서비스는 무언갈 제공해주는것. db에 사원등록. 사원파라미터 처리는 개발자의 몫인것  // 동적페이지 자체를 컨트롤러라고도 한다.
// 응답처리 : 등록에 성공하면 성공페이지(view)를 렌더링해서 응답한다.(상세페이지로 이동 : redirect)
// 이걸 합쳐서 MVC 라고 한다. // 현재 우리는 view 를 퍼그로 분리함.


// REST(Representation State Transfer): 통신할때 어떻게 url을 표시할건지. 구체적으로 서비스를 분할
// 파라미터로 전달되는 쿼리스트링이 복잡. 명시적X
// => 페이지에 url 파라미터가 꼭 필요한 것을 명시
/*
 historyA 문서 : A문서 조회
 history/A - * 특정 리소스안에 문서가 있는것처럼 표기하기
 edit/A

비동기식 통신할때는 통신 메서드를 세분화하기
실제 형식은 POST, GET 만 있고
PUT, DELETE 는 이름만 있다.
=> 왜? 서비스의 이름 대신 메서드를 사용
=> PUT 요청오면 수정한다 (empUpdate 와 동일)
=> DELETE 요청오면 삭제를 한다 (empDelete 와 동일)
=> POST 요청오면 삭제를 한다 (등록 와 동일)
=> Patch 일부만 수정

* PUT, DELETE 는 AJAX 에서만 동작한다.

오버로드와 같다
동적리소스의 이름을 지을때 delete, update 를 포함하지않고
통신메서드를 사용
=> 이렇게 하는이유?!
1. 재사용
2. 보안
💎3. 약속 - 유지보수 용이 -> 시간이 준다 -> 돈이 절감된다
- 예) 이름짓기(오버로드 - 이름짓기가 힘들어서)
통신메서드 : 통일된 이름을 주고 이름짓기 일을 줄여준다.

파일이름 empInsert, empDelete 로 하지 말기
 */


