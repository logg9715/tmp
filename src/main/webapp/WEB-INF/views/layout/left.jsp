<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!-- gnb 공통 -->
<div id="gnb" class="preload">
    <div class="gnb_menu">
        <div class="program_home"><a href="http://192.168.0.220:9090/tm_guide/tmwatch/tmwatch.html" title="메뉴얼홈"></a></div>
        <ul>
        <c:choose>
        	<c:when test="${loginLevel != null and loginLevel > 70}">
            <li>
                <a href="${contextPath}/main.do?gnb_index=0"
                    ><div class="gnb_btn"><span></span><b>대시보드</b></div>
                </a>
            </li>
            <li>
                <a href="${contextPath}/device_map.do?gnb_index=1">
                    <div class="gnb_btn"><span></span> <b>현장</b></div>
                </a>
            </li>
            <li>
                <a href="${contextPath}/error_device.do?gnb_index=2">
                    <div class="gnb_btn"><span></span> <b>장애</b></div>
                </a>
            </li>
            <li>
                <a href="${contextPath}/center_device.do?gnb_index=3">
                    <div class="gnb_btn"><span></span> <b>하드웨어</b></div>
                </a>
            </li>
            <li>
                <a href="${contextPath}/statistics.do?gnb_index=4">
                    <div class="gnb_btn"><span></span> <b>통계</b></div>
                </a>
            </li>
            <li>
                <a href="${contextPath}/license?gnb_index=5">
                    <div class="gnb_btn"><span></span> <b>라이센스</b></div>
                </a>
            </li>
            <li>
                <a href="${contextPath}/cctv_report.do?gnb_index=6">
                    <div class="gnb_btn"><span></span> <b>현황보고서</b></div>
                </a>
            </li>
            </c:when>
            <c:otherwise>
          	<li>
                <a href="${contextPath}/error_device.do?gnb_index=2">
                    <div class="gnb_btn"><span></span> <b>장애</b></div>
                </a>
            </li>
            </c:otherwise>
        </c:choose>
<!--             <li> -->
<%--                 <a href="${contextPath}/ip_manage?gnb_index=6"> --%>
<!--                     <div class="gnb_btn"><span></span> <b>IP관리</b></div> -->
<!--                 </a> -->
<!--             </li> -->
            <li>
                <ul class="gnb_bottom_btn">
                    <li>
                        <a href="#" class="user_info_btn">
                            <div class="gnb_btn"><span></span></div>
                        </a>
                        <!-- 사용자 정보 공통 시작 -->
                        <div class="user_info_modal">
                            <div class="user_info_modal_wrap">
                                <div class="modal_top">
                                    <h5>사용자 정보</h5>
                                    <div class="modal_close"><span></span></div>
                                </div>
                                <div class="modal_main">
                                    <span></span>
                                    <div class="user_info_txt">
                                        <h5></h5>
                                        <button type="button">로그아웃</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 사용자 정보 공통 끝 -->
                    </li>
                    <c:choose>
        			<c:when test="${loginLevel != null and loginLevel > 70}">
                    <li>
                        <a href="#" class="setting_modal_btn">
                            <div class="gnb_btn"><span></span></div>
                        </a>
                    </li>
                    </c:when>
                    </c:choose>
                </ul>
            </li>
        </ul>
    </div>
</div>
<!--// gnb 공통 끝 -->
<!-- 환경설정 공통 -->
<div class="modal common_setting_modal">
    <div class="modal_wrap">
        <div class="modal_top">
            <b class="">환경설정</b>
            <div href="#" class="modal_close"><span></span></div>
        </div>
        <div class="modal_main">
            <div class="modal_main_wrap">
                <div class="setting_tabhead">
                    <ul>
                        <li class="focus">사용자 정보</li>
                        <li>항목 관리</li>
                    </ul>
                </div>
                <div class="setting_tabbody">
                    <div class="setting_tabcon focus" id="managerListInfo">
                        <div class="setting_tabcon_wrap">
                            <h3>사용자 정보</h3>
                            <div class="setting_tabcon_input_wrap">
                                <form action="#" method="post" id="fmUserInfo" name="fmUserInfo">   
                                    <div class="setting_input_row">
                                        <ul>
                                            <li class="input_short">
                                                <label for="">사용자 이름<b>*</b></label>
                                                <input type="text" id="userName" name="userName" />
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <label for="">사용자 아이디<b>*</b></label>
                                                <input type="text" id="userId" name="userId" />
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <label for="">사용자 비밀번호<b>*</b></label>
                                                <input type="password" id="userPwd" name="userPwd" />
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <label for="">휴대폰<b>*</b></label>
                                                <input type="text" id="userTel" name="userTel"/>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li class="input_short">
                                                <label for="">사용자 권한<b>*</b></label>
                                                <div class="input_inner">
                                                    <select name="userLevel" id="userLevel">
                                                        <option value="90">관리자</option>
                                                        <option value="80">유지보수</option>
                                                        <option value="70">관제요원</option>
                                                    </select>                                                    
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <p class="pw_info_txt">※ 비밀번호는 숫자와 대, 소문자, 특수문자 조합으로 9-16자리를 사용 ( <, >, (, ), #, ‘, /, | 는 사용할 수 없음)</p>
                                </form>
                                <div class="input_tab_btn">
                                    <button type="button" class="btn_blue" id="addUserInfo" value="1">추가</button>
                                    <button type="button" class="btn_yellow" id="editUserInfo" value="2">수정</button>
                                    <button type="button" class="btn_gray" id="deleteUserInfo">삭제</button>
                                </div>
                            </div>
                        </div>
                        <div class="setting_tabcon_wrap">
                            <h3>등록된 사용자 정보</h3>
                            <div class="setting_tabcon_input_wrap">
                                <div class="list">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>순번</th>
                                                <th>이름</th>
                                                <th>권한</th>
                                                <th>아이디</th>
                                                <th>연락처</th>
                                                <th>등록일</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="setting_tabcon_wrap">
                            <h3>마스터 관리자 비밀번호 변경</h3>
                            <div class="setting_tabcon_input_wrap">
                                <form action="">
                                    <div class="setting_input_row">
                                        <ul>
                                            <li>
                                                <label for="">현재 마스터 비밀번호<b>*</b></label>
                                                <input type="password" id="masterPwd" name="masterPwd"/>
                                            </li>
                                        </ul>
                                        <ul>
                                            <li>
                                                <label for="">변경할 마스터 비밀번호<b>*</b></label>
                                                <div class="input_inner">
                                                    <input type="password" id="changeMasterPwd" name="changeMasterPwd" />
                                                    <p class="pw_info_txt">※ 비밀번호는 숫자와 대, 소문자, 특수문자 조합으로 9-16자리를 사용 ( <, >, (, ), #, ‘, /, | 는 사용할 수 없음)</p>
                                                </div>
                                            </li>
                                        </ul>
                                        <div class="input_tab_btn setting_input_tab_btn">
                                            <button type="button" class="btn_yellow" id="saveMasterPwd">수정</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="setting_tabcon setting_tabcon_error_info">
                        <div class="setting_tabcon_wrap2">
                            <form action="#" method="post" id="fmUsedTypeInfo" name="fmUsedTypeInfo">
                            <div class="setting_tabcon_wrap">
                                <h3>용도 관리</h3>
                                <div class="setting_tabcon_input_wrap">
                                        <div class="setting_input_row">
                                            <ul>
                                                <li class="input_short">
                                                    <label for="">용도명<b>*</b></label>
                                                    <input type="text" id="usedTypeName" name="usedTypeName" />
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="setting_input_row">
                                            <ul>
                                                <li class="input_short">
                                                    <label for="">용도코드<b>*</b></label>
                                                    <input type="text" id="usedTypeCode" name="usedTypeCode" />
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="setting_input_row">
                                            <ul>
                                                <li class="input_short">
                                                    <label for="">아이콘<b>*</b></label>
                                                    <div class="layer_icon_img">
                                                        <label for="inputIconFile">아이콘 추가</label>
                                                        <input class="upload_icon_name" value="..." disabled="disabled" hidden />
                                                        <input type="file" id="inputIconFile" class="file_icon_hidden" hidden />
                                                        <button type="button" class="input_icon_reset"><span></span></button>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    <div class="input_tab_btn">
                                        <button type="button" class="btn_blue" value="1" id="addUsedType">추가</button>
                                        <button type="button" class="btn_yellow" value="2" id="editUsedType">수정</button>
                                        <button type="button" class="btn_gray" id="deleteUsedType">삭제</button>
                                    </div>
                                </div>
                            </div>
                            <div class="setting_tabcon_wrap">
                                <h3>등록된 구분 정보</h3>
                                <div class="setting_tabcon_input_wrap">
                                    <div class="list">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>순번</th>
                                                    <th>용도명</th>
                                                    <th>용도코드</th>
                                                    <!-- <th>아이콘</th> -->
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                           </form>
                        </div>
                        <div class="setting_tabcon_wrap2">
                        	<form action="#" method="post" id="fmDongInfo" name="fmDongInfo">
                            <div class="setting_tabcon_wrap">
                                <h3>동 관리</h3>
                                <div class="setting_tabcon_input_wrap">
                                        <div class="setting_input_row">
                                            <ul>
                                                <li class="input_short">
                                                    <label for="">동명<b>*</b></label>
                                                    <input type="text" id="dongName" name="dongName" />
                                                </li>
                                            </ul>
                                        </div>
                                    <div class="input_tab_btn">
                                        <button type="button" class="btn_blue" id="addDongName" value="1">추가</button>
                                        <button type="button" class="btn_yellow" id="editDongName" value="2">수정</button>
                                        <button type="button" class="btn_gray" id="deleteDongName">삭제</button>
                                    </div>
                                </div>
                            </div>
                            <div class="setting_tabcon_wrap">
                                <h3>등록된 구분 정보</h3>
                                <div class="setting_tabcon_input_wrap">
                                    <div class="list">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>순번</th>
                                                    <th>동명</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>풍납1동</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--// 환경설정 공통 끝 -->
