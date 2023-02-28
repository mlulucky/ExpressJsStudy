// alert("참조됨!"); // 연결됬는지 체크하는 가장 간단한 방법 : alert
const empInsertForm=document.forms["empInsertForm"]; // 폼태그
const empnoInput=empInsertForm["empno"];
const empnoMsg=document.getElementById("empnoMsg");
const EMPNO_CHECK_URL="/emp/empnoCheck.do"; // 통신페이지 // 상수는 대문자표기를 권장. 정보의 상수. 오브젝트인 경우!
empnoInput.addEventListener("change",empnoHandler) //empno 에 change 이벤트(수정하고 마우스를 화면에 클릭)가 발생하면 콜백함수 ()=>{ } 실행
empInsertForm.addEventListener("submit",submitHandler); // submit 이벤트가 오면 submitHandler 를 실행하겠다!
async function submitHandler(e){ // 폼양식 제출 서브밋 이벤트. 이벤트 정보를 꼭 받아야 한다! e
    e.preventDefault(); // submit 이벤트를 막는다! // 사용가능한 사번일때만 제출하겠다!!!
    let empnoCheck=await empnoHandler(); // empnoHandler 실행이 끝난 후 이어서 응답을 받아서 결과 반환.
    console.log(empnoCheck);
    if(empnoCheck){ // empnoCheck 가 true 이면 실행
        empInsertForm.submit();
    }
}
async function empnoHandler(){
    // alert(empnoInput.value); 작동체크
    let val=(empnoInput.value);
    let check=false;
    const res=await fetch(EMPNO_CHECK_URL+"?empno="+val); // then 실행 + 첫번째 매개변수를 받는다.
    if(res.status===200){ // 서버와 통신 성공했을떄
        const obj=await res.json(); // return을 안하고 await 한다 // JSON 오브젝트 // 프라미스를 반환!
        if(obj.check){ // ob.check 가 true 일때
            empnoMsg.innerText=`${obj.emp.ENAME}이(가) 사용 중인 사원번호입니다.`;
        }else{
            empnoMsg.innerText="사용 가능한 사원번호입니다.";
            return true; // 응답내역!
        }
    }else if(res.status===400){ // 파라미터 오류
        empnoMsg.innerText="잘못된 요청입니다";
    }else if(res.status===500){ // 서버오류
        empnoMsg.innerText="조회 오류! 다시 시도하세요~" // 디비조회 오류
    }

    // 🍋AJAX 통신 - fetch
    // fetch(EMPNO_CHECK_URL+"?empno="+val) // fetch 를 하는 순간 스레드가 생성된다.!!! 혼자서 따로 일을 하고 있다.  이미 false가 반환된 후// 멀티스레드간에 동기가 안된다
    // .then((res)=>{
    //     if(res.status===200){ // 서버와 통신 성공했을떄
    //         return res.json(); // JSON 오브젝트 // 프라미스를 반환!
    //     }else if(res.status===400){ // 파라미터 오류
    //         empnoMsg.innerText="잘못된 요청입니다";
    //     }else if(res.status===500){ // 서버오류
    //         empnoMsg.innerText="조회 오류! 다시 시도하세요~" // 디비조회 오류
    //     }
    // }).then((obj)=>{ // 통신 성공했을때 실행! // obj == res.json // 첫번째 then 에 응답내역 res.json 을 전달받는다.
    //     if(obj["check"]){ // obj["check"] 가 true 이면 // == obj.check
    //         empnoMsg.innerText=obj["emp"]["ENAME"]+"님이 사용하고 있는 사원번호 입니다."; // == obj.emp.ENAME
    //     }else{
    //         empnoMsg.innerText="사용 가능한 사번입니다.";
    //         check=true; // 🍒fetch 가 비동기 코드라 소용없음!
    //         // fetch가 멀티스레드이기 때문에 check가 리턴된 후(function empnoHandler 가 check false 선언, return check를 먼저 실행)에 fetch가 check true 를 반환해서, true 반환이 적용이 안된다. 소용이 없다!
    //         // => 해결방법 : 함수를 async 로 하고 await fetch 하기!
    //     }
    // });

    return check; // fetch 통신이 되기전에 반환이 된다!!

}