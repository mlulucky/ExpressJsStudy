const express=require("express"); // import
const bodyParser=require("body-parser"); //
const app=express();
app.set("views", "./templates"); // views 의 경로 ,  ./templates 폴더
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(bodyParser.urlencoded()); // ❓요청 POST ???
//💎라우팅
// app.[get|post|put|patch|delete].("경로",(req,res)=>{}); // 라우팅
// app.[get|post|put|patch|delete|use].("경로",(req,res,next)=>{}); // 미들웨어라우팅(==미들웨어) : next가 들어간다

app.get("/",(req,res)=>{
    res.render("index");
});

//💎라우팅 => 라우터로 한방에 해결하기! L05EmpRouter
const empRouter=require("./L05EmpRouter");
app.use("/emp",empRouter); //emp 라고 오는 요청에 // 나누는게 나중에 미들웨어 하기도 좋고 검사식 하기도 좋아서 나누는게 좋다
// export : 정의하는 것 // import : 모듈을 쓰겠다

app.listen(7777,()=>{
    console.log("http://localhost:7777 라우터로 라우팅를 분리해보자~ ")
})