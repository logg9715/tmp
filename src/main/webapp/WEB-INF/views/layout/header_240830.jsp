<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!-- 헤더 시작 -->
<header>
	<script>
		let gLoginCode = ${loginCode};
		let gLoginLevel = ${loginLevel};
		let gLoginGroup = ${groupCode};
		let COMMONLEVEL = 70;
		let MANAGERLEVEL = 80;
	</script>
	<div class="top_hd">
		<h1>
			<img src="${contextPath}/resources/image/logo_main.png" alt="logo" />
		</h1>
		<nav class="main_nav">
			<ul>
				<!-- 
				<li><a href="#none" class="page_ready">보고서관리</a>
					<ul class="main_2dep">
						<li><a href="#none">업무보고</a></li>
						<li><a href="#none">지출품의</a></li>
						<li><a href="#none">야간/주말근무</a></li>
					</ul></li>
				-->
				<li class="active"><a href="main">계약관리</a>
					<ul class="main_2dep">
					<c:choose>
                		<c:when test="${loginLevel != null and loginLevel > 70}">
							<li class="active"><a href="main">계약관리</a></li>
							<li><a href="revenue">매출관리</a></li>
							<li><a href="compute">정산서</a></li>
<!-- 							<li><a href="#none" class="page_ready">통계관리</a></li> -->
						</c:when>
                		<c:otherwise>
                			<li class="active"><a href="main">계약관리</a></li>
                		</c:otherwise>
                	</c:choose>
					</ul></li>
				<li><a href="inventory">제품관리</a>
					<ul class="main_2dep">
						<li><a href="inventory">재고관리</a></li>
<!-- 						<li><a href="#none" class="page_ready">판매관리</a></li> -->
<!-- 						<li><a href="#none" class="page_ready">라이선스관리</a></li> -->
					</ul></li>
				<!-- 
				<li><a href="#none" class="page_ready">근태관리</a>
					<ul class="main_2dep">
						<li><a href="../contract/contract.html">계약관리</a></li>
					</ul>
				</li>
				-->
			</ul>
		</nav>
		<div class="hd_right">
			<ul>
				<c:choose>
                	<c:when test="${loginLevel != null and loginLevel > 70}">
					<li class="hd_set"><a href="setting">
							<div class="header_icon">
								<span></span>
							</div>
							<p>설정</p>
					</a></li>
					</c:when>
				</c:choose>
				<li class="hd_user"><a href="#none">
						<div class="header_icon">
							<span></span>
						</div>
						<p>
							<span class="login_data"></span>
						</p>
				</a>
					<div class="user_info_modal">
						<div class="user_info_modal_inner">
							<p>
								<b class="login_data"></b>${loginName}님이 로그인하셨습니다
							</p>
							<table>
								<tbody>
									<tr>
										<th>부서</th>
										<td>
											<span class="user_team">${groupName}</span>
										</td>
									</tr>
									<tr>
										<th>권한</th>
										<td>
											<span class="user_control">${levelName}</span>
										</td>
									</tr>
									<tr>
										<th>이메일</th>
										<td>
											<span class="user_control"></span>
										</td>
									</tr>
								</tbody>
							</table>
							<button type="button" onclick="location.href = 'logout'">
								<span>로그아웃</span>
							</button>
						</div>
					</div></li>
			</ul>
		</div>
	</div>
	<div class="content_tit_wrap">
		<p>
			<a href="../contract/contract.html">계약관리</a>
		</p>
		<span></span>
		<p>
			<a href="../contract/contract.html">계약관리</a>
		</p>
	</div>
</header>
<!-- 헤더 끝 -->