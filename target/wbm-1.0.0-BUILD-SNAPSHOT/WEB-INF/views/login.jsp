<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>윈투스시스템 사업관리시스템(TM-WBM)</title>
<link rel="stylesheet" href="${contextPath}/resources/css/common/common.css" />
<link rel="stylesheet" href="${contextPath}/resources/css/login/login.css" />
<script defer src="${contextPath}/resources/js/common/jquery-3.7.1.min.js"></script>
<script defer src="${contextPath}/resources/js/login/login.js"></script>
<script defer src="${contextPath}/resources/js/common/common.js"></script>
<!-- 이소정   -->
</head>

<body>
	<main>
		<!-- <div class="login_bg"></div> -->
		<div class="login_container">
			<div class="login_content">
				<h1>WBM_</h1>
				<form action="#" method="post" id="fmLogin" name="fmLogin">
					<ul>
						<li class="login_input login_id"><input type="text" name="userId" id="userId" placeholder="아이디" />
							<div class="login_input_icon">
								<span></span>
							</div></li>
						<li class="login_input login_pw">
							<div class="login_input_icon">
								<span></span>
							</div> <input type="password" name="userPwd" id="userPwd" placeholder="비밀번호" />
							<div class="login_more">
								<a href="#" id="user_signUp">가입 신청</a> <span>|</span> <a href="#" id="pwd_find">비밀번호 찾기</a>
							</div>
						</li>
					</ul>
					<button id="btLogin" type="button">로그인</button>
				</form>
				<h2>
					<img src="${contextPath}/resources/image/logo.png" alt="logo" />
				</h2>
			</div>
		</div>
	</main>
	<!--모달 시작 -->
	<div class="dimLayer">
		<div class="modal_content">
			<button type="button" class="modal_close"></button>
			<h1>WBM</h1>
			<!--가입신청 시작 -->
			<div class="modal_content_box content_signUp">
				<div class="terms_desc">※ 가입 요청 후 관리자 승인 처리 완료 후에 사용하실 수 있습니다.</div>
				<form action="#" method="post" id="fmJoin" name="fmJoin">
					<ul>
						<li class="user_id"><label for="">아이디(*)</label>
							<div class="doubleinput_wrap">
								<input type="text" name="user_id" id="user_id_input" />
								<button type="button" id="btn_doubleCheck">중복확인</button>
							</div></li>
						<li class="user_pwd"><label for="">비밀번호(*)</label> <input type="password" name="user_pwd" id="user_pwd_input" /></li>
						<li class="user_pwd_R"><label for="">비밀번호 재확인(*) <span class="pwd_R_text" same="0"></span></label> <input type="password" name="user_pwd_R" id="user_pwd_R_input" /></li>
						<li class="user_name"><label for="">이름(*)</label> <input type="text" name="user_name" id="user_name_input" /></li>
						<li class="user_email"><label for="">이메일(*)</label> <input type="email" name="user_email" id="user_email_input" /></li>
						<li class="user_cp"><label for="">연락처</label> <input type="text" name="user_cp" id="user_cp_input" /></li>
						<li class="user_cp2"><label for="">비상 연락망</label> <input type="text" name="user_cp2" id="user_cp2_input" /></li>
						<li class="user_team_input"><label for="">부서(*)</label>
							<div class="doubleinput_wrap">
								<select name="dept" id="dept">
									<option value="0">선택</option>
								</select>
<!-- 								<input type="text" name="user_dept" id="user_dept_input" /> -->
							</div></li>
					</ul>
				</form>
				<button type="button" class="btn_signUp">가입 신청</button>
			</div>
			<!--가입신청 끝 -->
			<!--비밀번호찾기 시작 -->
			<div class="modal_content_box content_findPwd">
				<div class="find_desc">가입하신 아이다와 이메일을 입력해주세요.</div>
				<form action="">
					<ul>
						<li class="find_user_id"><label for="">아이디</label> <input type="text" name="find_user_id" id="find_user_id_input" /></li>
						<li class="find_user_email"><label for="">이메일</label> <input type="email" name="find_user_email" id="find_user_email_input" /></li>
					</ul>
				</form>
				<button type="button" class="btn_findPwd">비밀번호 찾기</button>
			</div>
			<!--비밀번호찾기 끝 -->
			<!--비밀번호찾기확인창 시작 -->
			<div class="modal_content_box content_informPwd">
				<div>
					<p>비밀번호 찾기</p>
					<span>입력하신 정보와 일치하는 비밀번호는 아래와 같습니다.</span>
				</div>
				<b>1234</b>
				<button type="button" class="btn_backLogin">로그인 페이지로 가기</button>
			</div>
			<!--비밀번호찾기확인창 끝 -->
			<!-- 하단로고 시작 -->
			<div class="modal_logo">
				<img src="${contextPath}/resources/image/logo.png" alt="modal_logo" />
			</div>
			<!-- 하단로고 끝 -->
		</div>
	</div>
	<!--모달 끝 -->
</body>
</html>
