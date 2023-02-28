const express=require("express");
const fs=require("fs/promises");
// const pug=require("pug"); // pug - import // 노드 방식
const app=express(); // 서버 생성 + 실행
// app.set("views", "./views") // default(기본)로 pug의 경로를 views 로 설정! // ./views 는 템플릿엔진이 있는 폴더이름경로
app.set("view engine","pug"); // pug 는 사용하려는 템플릿엔진 (express 사이트에 명시된 템플릿 엔진사용 가능)

//💎app.use 미들웨어로 정적리소스 처리
app.use(express.static("public")); // 🍒urlEncoding 처리가 되어 있음 ! 참새.jpeg 로 해도 처리가 된다 // public 경로를 정적리소스의 위치로 하겠다.
// app.get("/public/*",async (req,res)=>{ // public 폴더에 모든 리소스 요청
//     let data=await fs.readFile("."+req.path); // 상대경로 .
//     res.send(data);
// }) // 참새이미지 불러오기
// 🍒url 의 문자는 아스키코드만 참조! (아스키코드 : 1byte 로 표현할 수 있는 문자표!)
// 1byte => 데이터 전송과 저장하는 주소의 기본단위!(신호의 기본단위) => 최초의 문자표를 아스키코드로 생성
// 🍒urlEncoding(유니코드 문자표를 아스키 코드로 바꾼것) : 공백을 + 플러스로 처리한다
// 참새 => %EC%B0%B8 %EC%83%88 (유니코드 문자표를 아스키코드로 바꾼 것) (참 3바이트 %EC%B0%B)(새 3바이트 %EC%83%8)
// http://localhost:7777/img/참새.jpeg => http://localhost:7777/img/%EC%B0%B8%EC%83%88.jpeg
// 문자표는 3바이트로 표현 / EC 는 16진수 / %는 1바이트 구분자 // 8은 문자의 끝. 마감자
// => 한글 참새(3바이트 주소) 유니코드 문자표를 아스키 코드(1바이트)로 바꾼 것
// 유니코드는 가변길이이다. 4byte 까지 있다. (예전에 2byte 까지 있었음)
// %EC%B0%B8%EC%83%88 => 참새(🍒urlDecoding - url 인코딩을 다시 되돌리는 것)
// h t t p : / / l o c a l ....
// 문자마다 다 짤라서 데이터 전송에 쓰인다
// 파라미터는 자동으로 url 인코딩(아스키코드)된다


//💎express 에서 제공하는 템플릿 엔진 적용(pug)
app.get("/",(res,resp)=>{
    // index => ./views/index.pug  // 기본으로 .views 로 셋팅 // app.set("views", "./views")
    /*let html=pug.renderFile("./views/index.pug");
    resp.write(html);
    resp.end();*/ // 노드에서 쓰던 방식
    // resp.send(html);
    resp.render("index", {a:10, b:20});
})

const querystring=require("querystring"); // 쿼리스트링 나눠서 객체만들기
//💎post 요청이 오면!
app.post("/signup.do",(req,res)=>{
    console.log(req.query.id); // url 에 포함된 id 파라미터 // 파라미터의 아이디를 받을 수 있다.
    // req.on("data",()=>{}) : post 파라미터 불러오기 // 요청헤더의 쿼리스트링을 읽어오는 이벤트
    let bodyQueryString="";
    req.on("data",(data)=>{ // 넘어오는 데이터
        bodyQueryString+=data;
    });  // => 쿼리스트링 완성시점!
    req.on("end",()=>{ // 데이터가 넘어온 시점! // 쿼리스트링이 있는 시점!
        // res.send(bodyQueryString);
        const params=querystring.parse(bodyQueryString);
        res.send(JSON.stringify(params));  // send 는 하나밖에 적용안된다.
    })
})

//💎미들웨어로 bodyParser 를 이용해 쿼리스트링(파라미터)을 불러오고 화면 출력
const bodyParser=require("body-parser"); // 사용법 : bodyParser 하겠다 // npm i body-parser --save 모듈설치해야함
app.use(bodyParser.urlencoded({extended:true})); // url 인코딩 // post방식 url 인코딩(참새)(유니코드)=>아스키코드)// 생략가능 {extended:true}
// extended:false : nodejs 에서 제공하는 query-string 을 사용해서 파싱하겠다.
// extended:true : 외부모듈 qs 를 사용해서 파싱하겠다.
// req.body 필드가 추가되고 body 에 쿼리스트링을 오브젝트로 파싱하고 있다.
app.post("/signup2.do",(req,res)=>{
   res.send(JSON.stringify(req.body)) // reqest 에 body 가 추가될때
});


app.listen(7777,()=>{ // 서버가 응답을 받는다.
    console.log("http://localhost:7777 미들웨어로 bodyParser 적용");
})
