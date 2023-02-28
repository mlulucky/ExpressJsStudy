const express=require("express");
const app=express(); // 서버 생성 + 실행
const fs=require("fs/promises"); // 프로미스화 된 파일시스템
//"/" index 페이지를 요청하면 L02Index.html 파일을 불러와서 응답하세요!
// app.use : 미들웨어 (감시하려고)
// "*" : 가로챌 요청의 패턴 (* 모든 와일드카드)
// next : /a.do 요청을 미들웨어가 중간에 가로챘는데 a.do 로 계속 가려면 next() 를 호출하면 된다.
app.use("*",(req, res, next)=>{ // 모든 페이지의 요청을 가로챈다
    console.log("* 미들웨어가 가로챔!", req.originalUrl); // 2번 가로챈다 // 브라우저 윈도우의 아이콘 favicon 요청 이 있어서 브라우저가 서버에게 요청.
    next(); // 원래 요청하던 url로 이동
});
app.use("/user/*",(req,res,next)=>{ // 미들웨어 : 사이트 요청을 가로챈다 / 미들웨어가 먼저 실행된다.
    console.log("/user/* 미들웨어가 가로챔!",req.originalUrl); // user 로 오는 모든 요청을 가로챈다
    if(req.query.id) { // 파라미터 아이디가 있으면
      next(); // 유저페이지로 갈 수 있다 // 페이지 응답~!
   }
    else { // 아이디가 없으면
        res.redirect("/"); // 메인페이지로 이동 // 🍒redirect : 다른페이지로 이동
        // res.writeHead(302,{location:"/"});
       // res.end();
        // 익스프레스가 노드를 품고있다.
        // 프레임워크
        // 미들웨어는 방패 벽(문지기) // (/user/* ) 감시 - 너 파라미터가 없다. / 있다? 문을 열어주고 - 응답한다.
        // 실행이 한단계 더 생긴거
        // 서버 브라우저의 관계 - 요청 / 서버에서 찾아서 응답 == 웹앱서버
        // 익스프레스 웹앱서버 - 미들웨어 - url로 검사 -> 전부다 검사. 특정요청이 아니라 광범위한 요청을 처리하는 것!
        // 폴더마다 검사 가능 => /a/b/c.do => */b/* 모든요청에 b가 오는 모든 파일
        // 검사 후 특정페이지를 응답할 수 있게한다.
        // 미들웨어 - 라이브러리 - 여러번 조건을 줄 수 있다. app.use() 를 여러개 만들기! // 실행순서는 위에서 아래로 써놓은 순서대로 실행.
        //
   }
});

app.get("/a.do",(req, res)=>{
    res.send("<h1>* 미들웨어가 모든 페이지를 감시합니다.</h1>")
});

app.get("/user/b.do",(req, res)=>{
   res.send("<h1>/user/b.do 페이지 (/user/* 유저폴더 안의 모든 리소스는 파라미터 id가 꼭 필요)</h1>")
});

app.get("/user/c.do",(req, res)=>{
    res.send("<h1>/user/c.do 페이지 (/user/* 유저폴더 안의 모든 리소스는 파라미터 id가 꼭 필요)</h1>")
});

// "/" index 페이지를 요청하면 L02Index.html 파일을 불러와서 응답하세요
// fs. 프로미스화 // 비동기통신 ajax // url 전환없이 서버와 통신해서 페이지 불러오기
app.get("/", async (req,res)=>{
    let data=await fs.readFile("L02Index.html");
    res.write(data);
    res.end();
})

app.listen(7777, ()=>{ // 위치 맨아래. 맨위 상관없다.
    console.log("http://localhost:7777 에 미들웨어 수업");
});