<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!-- 카카오 주소->좌표 변환 API 테스트.jsp -->

<head>
    <link rel="stylesheet" href="${contextPath}/resources/css/contract/contract.css" />
    <script defer src="${contextPath}/resources/js/contract/contract.js"></script>

    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=medium-dpi" />
</head>

<script>
    var contextPath = "${contextPath}/resources/";
    var downloadPath = "${contextPath}";
    var gConfigInfo = []; // 구정보(1:송파,2:서대문
</script>

<!-- 컨텐츠 시작 -->
<main>
    <div class="content_wrap">
        <!-- 주소 검색창 시작-->
        <form action="#" id="form_search_contract" name="form_search_contract">
            <div class="top_content">
                <div class="search_wrap">
                    <div class="search_right">
                        <input type="text" id="searchCateData" name="searchCateData" placeholder="주소 검색"/>
                    </div>
                </div>
            </div>
        </form>
        <!-- 주소 검색창 끝-->
        <!-- 컨텐츠 중간(리스트) 시작-->
        <div class="list" id="mainList">
            <table>
                <thead>
                    <tr>
                        <th style="min-width: 64px">순번</th>
                        <th style="min-width: 130px">장소명</th>
                        <th style="min-width: 130px">주소</th>
                        <th style="min-width: 180px">경도</th>
                        <th style="min-width: 115px">위도</th>
                    </tr>
                </thead>
                <tbody id="list_contract_info">
                    <tr>
                    </tr> 
                </tbody>
            </table>
        </div>
        <!-- 컨텐츠 중간(리스트) 끝-->
</main>
