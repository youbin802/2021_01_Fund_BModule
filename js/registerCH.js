class registerCH {
    constructor() {
        this.check();
        document.querySelector("#join").addEventListener("click",  this.joinBtnClickHandler );

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

   joinBtnClickHandler=e=> {
        if( this.email=="" || this.lname=="" || this.pass=="" || this.passch=="" ) {
          this.toastform();
        }else if( !this.emailMsg.text()=="" || !this.logMsg.text()=="" || !this.passMsg.text()=="" || !this.passchMsg.text()=="") {
          this.toastform();
        }else {
            console.log("성공");

        }
    }

    check() {
        console.log("D");
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
}