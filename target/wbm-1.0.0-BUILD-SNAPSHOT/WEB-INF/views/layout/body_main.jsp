<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" isELIgnored="false" %>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="contextPath"  value="${pageContext.request.contextPath}"  />
<%
   request.setCharacterEncoding("UTF-8");
%>     
<!DOCTYPE html>
<html lang="ko">

<head>
	<script>
		let gLogoutPath = "${contextPath}";
	</script>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>윈투스시스템 사업관리시스템(TM-WBM)</title>
    <link rel="stylesheet" href="${contextPath}/resources/css/common/common.css" />
    <link rel="stylesheet" href="${contextPath}/resources/css/common/header.css" />    
        

    <script defer src="${contextPath}/resources/js/common/jquery-3.7.1.min.js"></script>
    <script defer src="${contextPath}/resources/js/common/common.js"></script>
</head>

<body>
	<tiles:insertAttribute name="header"/>
	<tiles:insertAttribute name="body"/>
	

	<!-- confirm 모달 시작 -->
	 <section class="modal_confirm modal-section type-confirm">
	     <div class="enroll_box">
	         <div class="menu_msg"><span></span><b></b></div>
	     </div>
	     <div class="enroll_btn">
	         <button class="modal_confirm_btn modal_confirm_ok">확인</button>
	         <button class="modal_confirm_btn modal_confirm_close">취소</button>
	     </div>
	 </section>
</body>
</html>