const express=require("express");
const app=express(); // 익스프레스 시작
app.use(express.static("public"));
// "" '' `` : 자바스크립트 문자열
// app.use : 미들웨어로 요청을 처리하기 전에(중간에) 가로채서 무언가를 하는 것 (중간처리자)
// 확장자가 정적리소스 이면(html,js,css,jpeg,png...) 무조건 public 폴더에서 리소스를 찾아서 반환한다.


// "/" index 동적페이지
// if(req.url=="/" && req.method=="GET") : 인덱스 페이지 + 요청이 GET 방식일때
// =>😎라우팅! app.get("/", (rep,res)=>{})
app.get("/", (rep,res)=>{ // index 요청이 오면 반응.응답 하겠다. => 콜백함수 실행
    // res.setHeader("content-type","text/html;charset=UTF-8");
    // res.send() : setHeader 응답헤더의 컨텐츠 타입을 자동으로 맵핑하고 res.end() 도 자동으로 한다.
    const o={checkId:true};
    // res.send(o); // 오브젝트를 보내면 => 자동으로 JSON.stringify(o) + content-type : application/json
    let html=("<h1>안녕 Express.js</h1>"); // == res.write() 노드js 의 write 와 동일
    html+=("<h1>Express.js 는 nod.js 의 웹앱 프레임워크(다수의 라이브러리에 의해서 웹앱이 지배당하고 있을 때) 입니다.</h1>"); <!-- 그냥 끌어다 쓰는건 라이브러리 --><!-- 프레임워크 : 여러개 라이브러리에 의해서 프레임워크에 의존하는 것 -->
    html+=`<ul> 
                <li>nodejs 가 동적페이지 구분이 안되는 것을 express 가 요청 메소드(get() get방식,post() post방식)와 동일한 이름의 함수(라우팅)를 제공해서 해결</li>
                <li>한 페이지에 너무 많은 동적 리소스를 작성하는 것을 router 라는 것으로 해결</li>
                <li>미들웨어를 이용해서 특정 요청의 중간처리를 할 수 있다.</li>
                <li>미들웨어를 이용해서 편리하게 라이브러리 적용을 할 수 있다.</li> <!-- 미들웨어 - 익스프레스 사용하는 이유 중 큰 하나 -->
                <li>node.js 의 모든 기능을 사용할 수 있다.</li>
          </ul>
          <h2>라우팅과 res.send()</h2>
          <ul>
          <li><a href="/checkIdJson.do">JSON 페이지 요청</a></li> <!-- a 태그로 이동하는 것 - GET방식 -->
          <li><a href="/sum.do?a=10&b=20&c=30">파라미터 처리로 더하기</a></li>
          <li><a href="/img/참새.jpeg">정적 페이지 요청(참새 이미지)</a></li> <!-- 상단에 미들웨어 설정 app.use(express.static("public")); --> <!-- public 폴더경로 없음 -->
          </ul>
    `;
    res.send(html); // send 는 여러번 못하고 한번만 가능
}); // express 는 에러처리가 되어있음! (404(없는페이지 요청), 500(서버오류)) // 400(꼭 필요한 파라미터가 없다)에러는 직접처리하기

//📢 동적페이지
// a태그로 페이지 이동 - GET 방식 통신 -> .get()
app.get("/checkIdJson.do", (req,res)=>{
    const o={checkId:true,emp:{empno:7777, ename:"이현주"}};
    // res.setHeader("content-type","application/json;charset=UTF-8");
    // res.write(JSON.stringify(o)); // Json 오브젝트 -> 문자열
    // res.end();
    res.send(o);
});
//📢 동적페이지 / 주소에 파라미터 처리를 안해도된다.
app.get("/sum.do", (req,res)=>{
   // const urlObj=url.parse(req.url);
   // const params=querystring.parse(urlObj.query);
    console.log(req.query); // req.query == params // { a: '10', b: '20', c: '30' }
    let a=Number(req.query.a); // sum.do 페이지로 이동했을때, url에 쿼리(파라미터)가 있으면
    let b=Number(req.query.b);
    let c=Number(req.query.c);
    res.send(`<h1>a+b+c=${a+b+c} 파라미터는 req.query에 처리되어 있다.</h1>`);
});


app.listen(7777,()=>{ // 서버 주소 7777 을 듣겠다
    console.log("http://localhost:7777 에 express web app 생성!")
});