"use district";

$(document).ready(function(){
    const loginContent = $('.login_content');
    const dimLayer = $('.dimLayer');

    // -------------------------------------------------------------------------
    // 팝업창 닫기 
    // -------------------------------------------------------------------------
 
    dimLayer.find(".modal_close, .btn_backLogin").click(function() {
        dimLayer.hide();
        dimLayer.find('.modal_content').css('height','513px');
        dimLayer.find('input').text('');
    });

    dimLayer.find(".modal_confirm_ok").on("click", function() {
        action_popup.close(this);
    });

    
    // -------------------------------------------------------------------------
    // 가입신청 
    // -------------------------------------------------------------------------

    /*
    dimLayer.find('#dept').on('change', function() {
    	let index = $(this).prop('selectedIndex');
    	if(index <= 0) dimLayer.find("#user_dept_input").val('');
    	else dimLayer.find("#user_dept_input").val($(this).find('option:selected').text());
    });
    */
    loginContent.find('#user_signUp').on('click', function(){
    	dimLayer.find("#dept").children("option:not(:first)").remove();
    	$(this).attr("overlap_check", 0);

    	let resultJson = axCallFunction("listGroupInfo", "", false);
    	if(resultJson == null || resultJson.length <= 0) return;
    	
    	for(let keyValue of resultJson) {
    		dimLayer.find("#dept").append('<option value="' + keyValue.tgi_code + '">' + keyValue.tgi_name + "</option>");
    	}
    	
        dimLayer.show();
        dimLayer.find('.modal_content').css('height','871px');
        dimLayer.find('.terms_desc , .content_signUp').show();
        dimLayer.find('.content_findPwd , .modal_confirm , .content_informPwd').hide();
        dimLayer.find('#user_id_input').focus();
    });

    //아이디 중복확인
    dimLayer.find('#btn_doubleCheck').on('click', function(){
    	let doubleCheck_id = dimLayer.find('#user_id_input').val();
    	if(doubleCheck_id === '') {
    		alert('아이디를 입력하여 주십시요');
    		return;
    	} else if(doubleCheck_id.toUpperCase() == 'ADMIN' || doubleCheck_id.toUpperCase() == 'USER' || doubleCheck_id.toUpperCase() == 'MASTER'){
    		alert(`${doubleCheck_id}(은)는 사용할 수 없는 아이디입니다.`);
    		dimLayer.find('#user_id_input').css('background-color', 'rgba(255, 0, 0, 0.306)');
    		return;
    	}
    	
    	let sendData = {userId:doubleCheck_id};
    	let resultJson = axCallFunction("getIdOverlapCheck", sendData, false);
    	if(resultJson != undefined && resultJson > 0) {
    		loginContent.find("#user_signUp").attr("overlap_check", 0);
    		alert("이미 사용되고 있는 아이디입니다.");
    		return;
    	}
    	loginContent.find("#user_signUp").attr("overlap_check", 1);
        alert(`${doubleCheck_id}(은)는 사용가능한 아이디입니다.`);
        dimLayer.find('#user_id_input').css('background-color', '#326ddc3e');
    });
    
    /*
    function loginProc() {
		var loginId = dimLayer.find("#userId").val();
		if(loginId == "") {
			alert("아이디를 입력하여 주십시요");
			return false;
		}
		
		var loginPwd = dimLayer.find("#userPwd").val();
		if(loginPwd == "") {
			alert("비밀번호를 입력하여 주십시요");
			return false;
		}
		let isContain = logincontainsSpecialCharacters(loginId);
		if(isContain) {
			alert("아이디 또는 비밀번호에 < 또는 > 문자는 사용할 수 없습니다.");
			return false;
		}
		isContain = logincontainsSpecialCharacters(loginPwd);
		if(isContain) {
			alert("아이디 또는 비밀번호에 < 또는 > 문자는 사용할 수 없습니다.");
			return false;
		}
		
		let num = loginPwd.search(/[0-9]/g);
		let eng = loginPwd.search(/[a-z]/ig);
		let spe = loginPwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

		if (loginPwd.length < 9 || loginPwd.length > 16) {
			alert("9자리 ~ 16자리 이내로 입력해주세요.");
			return false;
		} else if (loginPwd.search(/\s/) != -1) {
			alert("비밀번호는 공백 없이 입력해주세요.");
			return false;
		} else if (num < 0 || eng < 0 || spe < 0) {
			alert("영문,숫자, 특수문자를 혼합하여 입력해주세요.");
			return false;
		}

		let sendData = { userId:loginId, userPwd:loginPwd };
        let resultJson = axCallFunction("loginCheck", sendData, false);
        if (resultJson != undefined && resultJson > 0) {
        	resultJson = axCallFunction("getLoginLevel", "", false);
            if(resultJson <= COMMONLEVEL) window.location.href="error_device.do?gnb_index=2";
            else window.location.href="main.do";
        } else {
        	alert("등록된 정보와 일치되는 정보가 존재하지 않습니다.");
        	return false;
        }
	}
	*/
    //비밀번호 재확인
    dimLayer.find('#user_pwd_R_input').keyup(function(){
        let pwd1 = dimLayer.find('#user_pwd_input').val();
        let pwd2 = dimLayer.find('#user_pwd_R_input').val();
        if(pwd1 === pwd2){
        	dimLayer.find('.pwd_R_text').attr("same", 1);
            dimLayer.find('.pwd_R_text').text('일치합니다.');
            dimLayer.find('.pwd_R_text').css('color','#326ddc');
            dimLayer.find('#user_pwd_R_input').css('border','')
        }else{
        	dimLayer.find('.pwd_R_text').attr("same", 0);
            dimLayer.find('.pwd_R_text').text('불일치합니다.');
            dimLayer.find('.pwd_R_text').css('color','red');
            dimLayer.find('#user_pwd_R_input').css('border','1px solid red');
        }
    });

    //가입신청 완료버튼
    dimLayer.find('.btn_signUp').on('click',function(){
    	let overlap_check = loginContent.find("#user_signUp").attr("overlap_check");
    	if(overlap_check != 1) {
    		alert('아이디 중복 체크를 먼저 진행하여 주시기 바랍니다.');
    		return;
    	}
    	
    	let loginId = dimLayer.find("#user_id_input").val().trim();
    	if(loginId == "") {
    		alert('아이디를 입력하여 주십시요');
    		return;
    	}
    	
    	let isContain = logincontainsSpecialCharacters(loginId);
		if(isContain) {
			alert("아이디에 < 또는 > 문자는 사용할 수 없습니다.");
			return false;
		}
    	
    	let loginPwd = dimLayer.find("#user_pwd_input").val().trim();
    	if(loginPwd == "") {
    		alert('비밀번호를 입력하여 주십시요');
    		return;
    	}
    	let loginPwd1 = dimLayer.find("#user_pwd_R_input").val().trim();
    	if(loginPwd != loginPwd1) {
    		alert("비밀번호가 일치하지 않습니다.");
    		return;
    	}
    	
    	
    	isContain = logincontainsSpecialCharacters(loginPwd);
		if(isContain) {
			alert("비밀번호에 < 또는 > 문자는 사용할 수 없습니다.");
			return false;
		}
		
		let num = loginPwd.search(/[0-9]/g);
		let eng = loginPwd.search(/[a-z]/ig);
		let spe = loginPwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
		
		if (loginPwd.length < 9 || loginPwd.length > 16) {
			alert("9자리 ~ 16자리 이내로 입력해주세요.");
			return false;
		} else if (loginPwd.search(/\s/) != -1) {
			alert("비밀번호는 공백 없이 입력해주세요.");
			return false;
		} else if (num < 0 || eng < 0 || spe < 0) {
			alert("영문,숫자, 특수문자를 혼합하여 입력해주세요.");
			return false;
		}
		
		let userName = dimLayer.find("#user_name_input").val().trim();
		if(userName == "") {
			alert('이름을 입력하여 주십시요');
			return;
		}
		
		let isEmail = dimLayer.find("#user_email_input").val();
		let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailPattern.test(isEmail)) {
			alert("이메일 형식이 잘못되었습니다.");
			return;
		}
		
		let isGroup = dimLayer.find("#dept").val();
		if(isGroup == 0) {
			alert("부서를 선택하여 주십시요");
			return;
		}
		let formData = dimLayer.find("#fmJoin").serialize();
		let resultJson = axCallFunction("saveJoinInfo", formData, false);
		if(resultJson <= 0) {
			if(resultJson == -2) {
				alert('이미 등록된 아이디입니다.');
			} else {
				alert('처리 중 오류가 발생하였습니다.');
			}
			return;
		}
        dimLayer.hide();
        dimLayer.find('.modal_content').css('height','');
        alert('가입신청이 완료되었습니다.')
        
    });


    // -------------------------------------------------------------------------
    // 비밀번호 찾기
    // -------------------------------------------------------------------------

    loginContent.find('#pwd_find').on('click', function(){
    	dimLayer.find('#find_user_id_input').val('');
    	dimLayer.find("#find_user_email_input").val('');
        dimLayer.show();
        dimLayer.find('.content_findPwd').show();
        dimLayer.find('.terms_desc , .content_signUp , .content_informPwd , .modal_confirm').hide();
        dimLayer.find('#find_user_id_input').focus();
    });
    
    
    // -------------------------------------------------------------------------
    // 비밀번호 알림
    // -------------------------------------------------------------------------

    dimLayer.find("#find_user_email_input").keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            dimLayer.find('.btn_findPwd').click();
        }
    });
    
    dimLayer.find('.btn_findPwd').on('click', function(){
        let findId = dimLayer.find('#find_user_id_input').val();
        if(findId == "") {
    		alert('아이디를 입력하여 주십시요');
    		return;
    	}
    	
    	let isContain = logincontainsSpecialCharacters(findId);
		if(isContain) {
			alert("아이디에 < 또는 > 문자는 사용할 수 없습니다.");
			return false;
		}
		
		let isEmail = dimLayer.find("#find_user_email_input").val();
		let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailPattern.test(isEmail)) {
			alert("이메일 형식이 잘못되었습니다.");
			return;
		}
		
		let sendData = {findId:findId, findEmail:isEmail};
		let resultJson = axCallFunction("findPaswordInfo", sendData, false);
		if (resultJson) {
			dimLayer.find('b').text(resultJson);
            dimLayer.find('.content_findPwd , .modal_confirm').hide();
            dimLayer.find('.content_informPwd').show();
        } else {
        	alert("등록된 정보와 일치되는 정보가 존재하지 않습니다.");
        	return false;
        }
    });


    // -------------------------------------------------------------------------
    // 로그인 
    // -------------------------------------------------------------------------

    loginContent.find("#btLogin").click(function (e) {
        e.preventDefault();
        loginProc();
    });

    loginContent.find("#userPwd").keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            loginProc();
        }
    });

    //로그인 확인
    function loginProc() {
        var loginId = loginContent.find("#userId").val();
        var loginPwd = loginContent.find("#userPwd").val();
        if(loginId == "") {
    		alert('아이디를 입력하여 주십시요');
    		return;
    	}
    	
    	let isContain = logincontainsSpecialCharacters(loginId);
		if(isContain) {
			alert("아이디에 < 또는 > 문자는 사용할 수 없습니다.");
			return false;
		}
    	
    	if(loginPwd == "") {
    		alert('비밀번호를 입력하여 주십시요');
    		return;
    	}
    	
    	let sendData = {userId:loginId, userPwd:loginPwd};
		let resultJson = axCallFunction("loginCheck", sendData, false);
		if (resultJson) {
            window.location.href="main";
        } else {
        	alert("등록된 정보와 일치되는 정보가 존재하지 않습니다.");
        	return false;
        }
    } 
});
