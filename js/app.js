const log = console.log;
class App {
    constructor() {
        this.addEvent();
        this.getJson();
        this.fundList=[]; //펀드 리스트
        this.invlist=[]; //투자자 리스트
        this.invdup=[]; //중복 제거 투자자 리스트
        this.page=0;
        this.fundPage=1;
        this.invPage=1;
        this.sign = new sign();
        this.moneyvalue=false;
    }

    get email()    { return $("#email").val()  }
    get lname()     { return $("#lname").val()   }
    get pass()     { return $("#pass").val()   }
    get passch()   { return $("#passc").val()  }

    get emailMsg() { return $("#emailMsg");     }
    get logMsg()   { return $("#lnameMsg");     }
    get passMsg()  { return $("#pMsg");        }
    get passchMsg(){ return $("#pcMsg");      }

    // 펀드등록
    get name()     { return $("#name").val();  }
    get total()    { return $("#total").val(); }
    get expl()     { return $("#expl").val();  }
    get img()      { return $("#file").val()   }
    
    get nameMsg()  { return  $("#nameMsg");    }
    get timeMsg()  { return $("#dateMsg");     }
    get totalMsg() { return $("#totalMsg");    }
    get fileMsg()  { return $("#fileMsg");     }
    get exMsg()    { return $("#exMsg");       }

    submitHandler=e=> {
        const money = document.querySelector("#money").value;
        if(!money=="" && this.sign.isSigned) {
            alert("투자완료");
            document.querySelector("#popup").classList.remove("active");
        }else {
            this.toastform();
        }
    }

    toastform() {
        let $elem = $("<div class='toastWrap'>값이 잘못되었습니다.<b></b></div>");
        $("#toast").prepend($elem); 
        $elem.slideToggle(100, function() {
            let a=0;
            const timer=setInterval(() => {
                a++;
                $('.timerWrap', this).first().outerWidth($elem.find('.toast').first().outerWidth() - 10);
                if(a>=3) {
                    clearInterval(timer);
                    $elem.fadeOut(function() {
                        $(this).remove();
                    });
                }
            }, 1000);
        });
        $("#toast").on("click", "b", function() {
            $(this).closest('.toastWrap').remove();
        })
    }

    creatBtn=e=> {        
        document.querySelector("#endDate").addEventListener("input",e=> {
            const now = new Date();
            const d = new Date(e.target.value);
            endTime = d;
            if(now>d) {
                this.timeMsg.html("이전 날짜 불가능");
                $("#dateIcon").css('color','red');
            }else {
                this.timeMsg.html("");
                $("#dateIcon").css('color','green');
            }
        });
        document.querySelector("#file").addEventListener("input",e=> {
            let fileSize = document.querySelector("#file").files[0].size;
            if((e.target.value.slice(-3) == "png" || e.target.value.slice(-3) == "jpg")&& fileSize <= 5 * 1024 * 1024 ) {
                this.fileMsg.html("");
                this.img= e.target.value;
                
                $("#fileIcon").css('color','green');
            }else {
                e.target.value = "";
                this.fileMsg.html("첨부파일 사이즈는 5MB 이내로 등록 가능합니다.");
                $("#fileIcon").css('color','red');
            }
        });
        
        document.querySelector("#creat").addEventListener("click", e=> {
            if(this.img=="" || this.name=="" || this.total=="" || this.expl=="" || this.endDate=="") {
                this.toastform();
            }else if(!this.nameMsg.text()=="" || !this.fileMsg.text()=="" || !this.totalMsg.text()=="" ||!this.exMsg.text()=="" || !this.timeMsg.text()=="") {
                this.toastform();
            }
            else {
                alert("등록 완료");
                document.querySelector(`#navMenu > div:nth-child(1)`).click();
            }
        })  
    }


    joinBtnClickHandler = e => {
        if( this.email=="" || this.lname=="" || this.pass=="" || this.passch=="" ) {
            this.toastform();
          }else if( !this.emailMsg.text()=="" || !this.logMsg.text()=="" || !this.passMsg.text()=="" || !this.passchMsg.text()=="") {
            this.toastform();
          }else {
              console.log("성공");
  
          }
    }
    
    menuClick = e =>{   //페이지 이동
        const menuIdx = e.target.dataset.idx;
        if(menuIdx == this.page ) {
            return;
        }
        this.page = menuIdx;
        let el = document.querySelector(".menu-page");
        let h=el.offsetHeight //현재 페이지 높이
        let re = h*menuIdx;
        window.scrollTo({
            top: re,
            left: 0,
            behavior: 'smooth'
        });
        this.drawPage();
    }
    
    getJson() { 
        fetch('js/fund.json')
        .then(res =>res.json())
        .then(json => {
            this.fundList=json;
            this.makePercent();
            this.getUser();
            this.drawPage();
        })
    }
    
    getUser() { //투자자목록 
        this.fundList.map(f => {
            f.investorList.forEach(item => {
                item.total = f.total;
                item.name = "홍길동";
                item.fundName = f.name;
                item.number = f.number;
                item.percent = item.pay / f.total * 100;
                this.invlist.push(item);
            });
            return f;
        });
        this.clearUser();
    }
    
    clearUser() {//중복
        this.invlist.forEach(f => {
            let user = this.invdup.find(e => e.number == f.number && e.email == f.email);
            if (user != undefined) {
                user.pay += f.pay;
            } else {
                const { email, pay, datetime, name,fundName, number,percent,total } = f;
                this.invdup.push({ email, pay, datetime, name,fundName, number,percent,total });
            }
        });
        this.invdup.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    }
    
    makePercent() { 
        this.fundList = this.fundList.map(f => {
            f.percent = f.current / f.total * 100;
            return f;
        }).sort((a, b) => b.percent - a.percent);
    }
    
    mainFund() {
        const now = new Date();
        let count=0;
        let drawList=[];
        drawList = this.fundList.filter(f => {
            if(count >=4 ){
                return false;
            }
            const day= new Date(f.endDate);
            if(day > now){
                count++;
                return true;
            }
        });
        
        const el = document.querySelector('#fundMain');
        el.innerHTML="";
        drawList.forEach(f => {
            const div = document.createElement("div");
            const current = f.current.toLocaleString();
            div.classList.add("fund");
            div.innerHTML=`
            <div class="info">
            <p title="${f.number}">${f.number}</p>
            <p title="${f.name}">${f.name}</p>
            <p title="${f.endDate}">${f.endDate}</p>
            <p title="${current}">${current}</p>
            <p title="${f.percent}">${f.percent}</p>
            <button id="btn" value="${f.number}">상세보기</button>
            <div class="progress">
            <div class="progress-bar role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:0"></div>
            </div>
            </div>
            `;
            let bar = div.querySelector(".progress-bar");
            new animation(bar,f);
            const btn = div.querySelector("#btn");
            btn.addEventListener("click", e=> {
                let number =btn.value;
                let count=0;
                this.invdup.forEach( item=>{
                    count++;
                    if(count>=5) {
                        document.querySelector(".vBox").style.scrollY="scroll";
                    }
                    if(item.number === number) {
                        
                        new invPopup(item);
                    }
                })
            })
            el.appendChild(div);
        });
    }
    
    drawrFund() {
        const list = document.querySelector(".fund-list .con");
        list.innerHTML="";
        
        for(let a = 0; a<10; a++) {
            const div = document.createElement("div");
            div.classList.add("fund");
            let f= this.fundList[a];
            const fCurrent =f.current;
            const fTotal = f.total;
            const leg = fCurrent +"/" +fTotal;
            div.innerHTML = `
            <div class="info">
            <p title="${f.number}">${f.number}</p>
            <p title="${f.name}">${f.name}</p>
            <div class="progress">
            <div class="progress-bar role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div>
            </div>
            <p title="${leg}">${leg}</p>
            <p title="${f.endDate}">${f.endDate}</p>
            <p title="${f.percent}">${f.percent}</p>
            <div class="f-btn">
            <button id="open" value="${f.number}">상세보기</button>
            <div class="menu-bar">
            </div></div>`;
            let bar = div.querySelector(".progress-bar");
            new animation(bar,f);
            const btn = div.querySelector("#open");
            btn.addEventListener("click", e=> {
                let number=btn.value;
                this.invdup.forEach( item=>{
                    if(item.number === number) {
                        new invPopup(item);
                    }
                })
                
            })
            const popup = document.querySelector("#popup");
            const menuBar = div.querySelector(".menu-bar");
            const now = new Date();
            const d = new Date(f.endDate);
            if(now > d) {
                menuBar.innerHTML = "<h4>모집완료</h4>";
            }else {
                menuBar.innerHTML=`<button id="next">투자하기</button>`;
                div.querySelector("#next").addEventListener("click", e=> {
                    this.sign.reset();
                    this.valueCheck();
                    popup.classList.add("active");
                    popup.querySelector("#fnumber").value= f.number;
                    popup.querySelector("#fname").value= f.name;
                    popup.querySelector("#iname").value= "홍길동";

                    const money = popup.querySelector("#money");
                    popup.querySelector("#close").addEventListener("click",e=> {
                        popup.classList.remove("active");
                        money.value="";
                    })
                })
            }
            list.appendChild(div);
        }
    }
    

    drawFundList() {
        const dom = document.querySelector(".inv-list");
        dom.innerHTML = "";

        for(let a =0; a<5; a++) {
            let i= this.invdup[a];
            const div = document.createElement("div");
            div.classList.add("inv");
            const f= this.fundList;
            this.pervalue =Math.ceil(f.pay / f.total * 10000) / 100;
            div.innerHTML = `
            <p title="${i.number}">${i.number}</p>
            <p title="${i.fundName}">${i.fundName}</p>
            <p title="${i.name}">${i.name}</p>
            <p title="${i.pay}">${i.pay}</p>
            <div class="progress">
            <div class="progress-bar role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:${i.percent}%"></div>
            </div>
            <p title="${i.percent}%">${i.percent}%</p>
            `;
            dom.appendChild(div);
        }
    }

    valueCheck() {
        $(document).on("input", "#money", (e) => {
            const number= document.querySelector("#fnumber").value;
            const list = this.fundList.find(x=>x.number === number);
            let max=list.total;
             let value = e.currentTarget.value;
            value = this.removeComma(value);
            value = (value.replaceAll(/[^0-9]/g, "") * 1).toLocaleString();
            if (this.removeComma(value) * 1 >= max) {
                value = max;
                value = (value.toString().replaceAll(/[^0-9]/g, "") * 1).toLocaleString();
            }
            e.currentTarget.value = value;
        });
    }

    removeComma(str) {
        return str.split(',').join('');
    }
    
    toastform() {
        log("happen");
        let $elem = $("<div class='toastWrap'>값이 잘못되었습니다.<b></b></div>");
        $("#toast").prepend($elem); 
        $elem.slideToggle(100, function() {
            let a=0;
            const timer=setInterval(() => {
                a++;
                $('.timerWrap', this).first().outerWidth($elem.find('.toast').first().outerWidth() - 10);
                if(a>=3) {
                    clearInterval(timer);
                    $elem.fadeOut(function() {
                        $(this).remove();
                    });
                }
            }, 1000);
        });
        $("#toast").on("click", "b", function() {
            $(this).closest('.toastWrap').remove();
        })
    }
    
    submit() {
        $("#total").on("input", (e) => {
            let value = e.currentTarget.value;
            value = (value.replaceAll(/[^0-9]/g, "") * 1).toLocaleString();
            e.currentTarget.value = value;
        });

        let ch=/^[가-힣a-zA-Z\s]+$/;
        $("#expl").on("input", function() {
            this.expl = $(this).val();
            if(this.expl.length>499) {
                this.exMsg.html("500자 초과되면 입력할 수 없습니다.");
            }
        })
        $("#name").blur(()=> {
            if(this.name=="") {
                this.nameMsg.html("필수 정보입니다.");
                $("#fnameIcon").css('color','red');
            }else if(!ch.test(this.name)) {
                this.nameMsg.html("한글, 영문, 띄어쓰기만 가능합니다.");
                $("#fnameIcon").css('color','red');
            }
            else {
                this.nameMsg.html("");
                $("#fnameIcon").css('color','green');
            }
        })
        
        $('#endDate').blur(()=> {
            if(this.endTime=="") {
                this.timeMsg.html("필수정보");
            }
        })
        
        $('#total').blur(()=> {
            if(this.total=="") {
                this.totalMsg.html("필수정보");
            }else{
                this.totalMsg.html("");
            }
        })
        
        $('#expl').blur(()=> {
            if(this.expl=="") {
                this.exMsg.html("필수정보");
            }else{
                this.exMsg.html("");
            }
        })
    }

    InputReset() {
        $("#emailMsg").html("");
        $("#lnameMsg").html("");
        $("#pMsg").html("");
        $("#pcMsg").html("");

        $("#emailIcon").css('color','#ddd');
        $("#nameIcon").css('color','#ddd');
        $("#pIcon").css('color','#ddd');
        $("#pcIcon").css('color','#ddd');
        
        $("#nameMsg").html("");
        $("#dateMsg").html("");
        $("#totalMsg").html("");
        $("#fileMsg").html("");
        $("#exMsg").html("");

        $("#dateIcon").css('color','#ddd');
        $("#fileIcon").css('color','#ddd');
        $("#fnameIcon").css('color','#ddd');
    }

    checkechk() {
        let ch1 = /[0-9]/;
        let ch2 = /[a-zA-Z]/;
        let ch3= /[~!@#$%^&*()_+|<>?:{}]/;
        let ch4= /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        let ch5= /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[a-z]{1,2}\.[a-z]{1,3}$/;
        let emailMsg= $("#emailMsg");

        $("#email").blur(()=> {
            if( this.email=="") {
                log("null");
                this.emailMsg.html("필수 정보입니다.");
                $("#emailIcon").css('color','red');
            }
            else if(this.email.match(ch5)==null) {
                emailMsg.html("이메일 형식이 올바르지 않습니다.");
                $("#emailIcon").css('color','red');
            }else {
                this.emailMsg.html("");
                $("#emailIcon").css('color','green');
            }
        })
        
        $("#lname").blur(()=> {
            if(this.lname=="") {
                this.logMsg.html("필수 정보입니다.");
                $("#nameIcon").css('color','red');
            }else {
                this.logMsg.html("");
                $("#nameIcon").css('color','green');
            }
        })
        
        $("#pass").blur(()=> {
            if(this.pass=="") {
                this.passMsg.html("필수 정보입니다.");
                $("#pIcon").css('color','red');
            }else if(!(ch1.test(this.pass)) || !(ch2.test(this.pass)) || !(ch3.test(this.pass)) || ch4.test(this.pass)) {
                this.passMsg.html("영문 특문 숫자");
                $("#pIcon").css('color','red');
            }else {{
                this.passMsg.html("");
                $("#pIcon").css('color','green');
            }}
        })
        $("#passc").blur(()=> {
            if(this.passch=="") {
                $("#pcIcon").css('color','red');
                this.passchMsg.html("필수 정보입니다.");
                
            }else if(this.passch!= this.pass) {
                this.passchMsg.html("불일치");
                $("#pcIcon").css('color','red');
            }else {{
                this.passchMsg.html("");
                $("#pcIcon").css('color','green');
            }}
        })
    }
    
    drawPage() {
        if(this.page ==0) {
            this.mainFund();
        }
        if(this.page==1) {
            this.drawrFund();
        }
        if(this.page==2) {
            this.submit();
            this.InputReset();
        }
        if(this.page==3) {
            this.drawFundList();
        }
        if(this.page==4) {
            this.InputReset();
            this.checkechk();
        }
    }

    addEvent() {
        document.querySelector("#navMenu").addEventListener("click", this.menuClick);


        document.querySelector("#join").addEventListener("click",  this.joinBtnClickHandler );
        document.querySelector("#submit").addEventListener("click",  this.submitHandler );
    }

}

window.onload=()=> {
    window.app = new App();
}
