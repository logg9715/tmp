<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!-- 이소정 -->
<head>
    <link rel="stylesheet" href="${contextPath}/resources/css/setting/setting.css" />
    <script defer src="${contextPath}/resources/js/setting/setting.js"></script>

    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=medium-dpi" />
</head>

<script>
    var contextPath = "${contextPath}/resources/";
    var downloadPath = "${contextPath}";
    var gConfigInfo = []; // 구정보(1:송파,2:서대문)
</script>
<!-- sw수정 1-->

<!-- 컨텐츠 시작 -->
<!-- 컨텐츠 시작 -->
<main>
    <div class="content_wrap">
        <!-- 컨텐츠 상단(등록버튼, 검색input, 단계버튼) 시작-->
        <div class="top_content">
            <div class="btn_wrap top_left">
                <button type="button" class="btn_modal_show" id="btn_setUser_N">
                    <div>사용자 신규 등록</div>
                </button>
            </div>
            <div class="search_wrap">
                <div class="search_left">
                    <div class="select_box">
                        <select name="searchType" id="searchType">
                            <option value="0">선택</option>
                            <option value="1">이름</option>
                            <option value="2">아이디</option>
                        </select>
                        <span class="select_icon"></span>
                    </div>
                </div>
                <div class="search_right">
                    <input type="text" id="searchData" name="searchData" placeholder="검색어입력" />
                    <button type="button" id="btn_search">
                        <div class="search_icon"></div>
                    </button>
                </div>
            </div>
            <div class="btn_wrap">
                <!-- <button type="button" class="btn_modal_show" id="btn_section_management">
                    <div>구분 항목 관리</div>
                </button>
                <button type="button" class="btn_modal_show" id="btn_contractor_management">
                    <div>계약 업체 관리</div>
                </button> -->
                <button type="button" id="subMenu_btn"><span class="icon"></span></button>
                <div class="subMenu_modal">
                    <div class="subMenu_modal_wrap">
                        <button type="button" class="btn_modal_show" id="btn_section_management"><span class="icon"></span><div>구분 항목 관리</div></button>
                        <button type="button" class="btn_modal_show" id="btn_contractor_management"><span class="icon"></span><div>계약 업체 관리</div></button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 컨텐츠 상단(등록버튼, 검색input, 단계버튼) 끝-->
        <!-- 컨텐츠 중간(리스트) 시작-->
        <div class="list" id="mainList">
            <table>
                <thead>
                    <tr>
                        <th style="min-width: 64px">순번</th>
                        <th style="min-width: 60px">권한</th>
                        <th style="min-width: 60px">소속</th>
                        <th style="min-width: 60px">이름</th>
                        <th style="min-width: 100px">아이디</th>
                        <th style="min-width: 100px">이메일</th>
                        <th style="min-width: 100px">연락처</th>
                        <th style="min-width: 100px">비상연락망</th>
                        <th style="min-width: 100px">요청일</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <!-- 컨텐츠 중간(리스트) 끝-->
        <!-- 컨텐츠 하단(전체수, 페이지네이션, 삭제버튼) 시작-->
        <div class="bottom_content">
            <div class="total_num">전체수 : <span id="list_total_num"></span>건</div>
            <div class="paging" id="contractManagementListPaging"></div>
            <!-- 
			<div class="btn_wrap bottom_right">
				<button type="button" id="btn_excel">
					<div>엑셀 내보내기</div>
				</button>
				<button type="button" id="btn_list_del">
					<div>삭제</div>
				</button>
			</div>
			 -->
        </div>
        <!-- 컨텐츠 하단(전체수, 페이지네이션, 삭제버튼) 끝-->
    </div>
</main>
<!-- 컨텐츠 끝 -->
<!-- modal 시작 -->
<div class="modal">
    <div class="modal_wrap setUser_modal">
        <div class="modal_top"><b></b> <span class="modal_close"></span></div>
        <div class="modal_main">
            <!-- 사용자추가 모달 시작 -->
            <!-- 	
			<div id="new_setUser_form">
				<form action="" id="form_new_userinfo" name="form_new_userinfo">
					<ul>
						<div class="modal_content_box content_signUp">
							<form action="">
								<ul>
									<li class="user_id"><label for="">아이디</label>
										<div class="doubleinput_wrap">
											<input type="text" name="user_id" id="user_id_input" />
											<button type="button" id="btn_doubleCheck">중복확인</button>
										</div></li>
									<li class="user_pwd"><label for="">비밀번호</label> <input type="password" name="user_pwd" id="user_pwd_input" /></li>
									<li class="user_pwd_R"><label for="">비밀번호 재확인 <span class="pwd_R_text"></span></label> <input type="password" name="user_pwd_R" id="user_pwd_R_input" /></li>
									<li class="user_email"><label for="">이메일</label> <input type="email" name="user_email" id="user_email_input" /></li>
									<li class="user_name"><label for="">이름</label> <input type="text" name="user_name" id="user_name_input" /></li>
									<li class="user_cp"><label for="">연락처</label> <input type="text" name="user_cp" id="user_cp_input" /></li>
									<li class="user_cp2"><label for="">비상 연락망</label> <input type="text" name="user_cp2" id="user_cp2_input" /></li>
									<li class="user_team_input_wrap"><label for="">부서</label>
										<div class="doubleinput_wrap">
											<div class="select_box">
												<select name="" id="user_team_select">
													<option value="경영지원부">경영지원부</option>
													<option value="영업부">영업부</option>
												</select>
												<span class="select_icon"></span>
											</div>
											<input type="text" name="userId" id="user_team_input" />
										</div></li>
								</ul>
							</form>
						</div>
					</ul>
				</form>
			</div>
			 -->

            <!-- 사용자추가 모달 끝 -->
            <!-- 사용자정보 모달 시작 -->
            <div id="edit_setUser_form">
                <form action="" id="form_user_info" name="form_user_info">
                    <div class="input_row">
                        <div class="input_tit">
                            <i>권한(*)</i>
                        </div>
                        <div class="input_wrap">
                            <div class="select_box">
                                <select name="edit_user_level" id="edit_user_level">
                                    <option value="0" selected>선택</option>
                                    <option value="90">관리자</option>
                                    <option value="85">계약관리</option>
                                    <option value="80">팀장</option>
                                    <option value="70">직원</option>
                                </select>
                                <span class="select_icon"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input_row">
                        <div class="input_tit">
                            <i>이름(*)</i>
                        </div>
                        <div class="input_wrap">
                            <input type="text" id="edit_user_name" name="edit_user_name" />
                        </div>
                    </div>
                    <div class="input_row">
                        <div class="input_tit">
                            <i>아이디(*)</i>
                        </div>
                        <div class="input_wrap">
                            <input type="text" id="edit_user_id" name="edit_user_id" />
                        </div>
                    </div>
                    <div class="input_row">
                        <div class="input_tit">
                            <i>비밀번호(*)</i>
                        </div>
                        <div class="input_wrap">
                            <input type="password" id="edit_user_pwd" name="edit_user_pwd" />
                        </div>
                    </div>
                    <div class="input_row">
                        <div class="input_tit">
                            <i>부서(*)</i>
                        </div>
                        <div class="input_wrap">
                            <div class="select_box">
                                <select name="edit_user_group" id="edit_user_group">
                                    <option value="0" selected>선택</option>
                                </select>
                                <span class="select_icon"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input_row">
                        <div class="input_tit">
                            <i>이메일(*)</i>
                        </div>
                        <div class="input_wrap">
                            <input type="text" id="edit_user_email" name="edit_user_email" />
                        </div>
                    </div>
                    <div class="input_row">
                        <div class="input_tit">
                            <i>연락처</i>
                        </div>
                        <div class="input_wrap">
                            <input type="text" id="edit_user_cp1" name="edit_user_cp1" />
                        </div>
                    </div>
                    <div class="input_row">
                        <div class="input_tit">
                            <i>비상연락망</i>
                        </div>
                        <div class="input_wrap">
                            <input type="text" id="edit_user_cp2" name="edit_user_cp2" />
                        </div>
                    </div>
                    <!-- 
					<div class="input_row editor_row">
						<div class="input_tit">
							<i>비고</i>
						</div>
						<div class="input_wrap">
							<div class="editor">
								<div class="editor_menu_wrap">
									<div class="editor_menu">
										<button type="button" class="btn-bold" id="sample-btn-bold">B</button>
										<button type="button" class="btn-underline" id="sample-btn-underline">U</button>
										<button type="button" class="btn-strike" id="sample-btn-strike">S</button>
										<button type="button" class="btn-image" id="sample-btn-image"></button>
										<input class="editor_img" id="sample-img-selector" type="file" accept="image/*" style="display: none" />
									</div>
								</div>
								<div class="editor_input">
									<div id="edit_user_memo" contenteditable="true" class="editor_box"></div>
								</div>
							</div>
						</div>
					</div>
					 -->
                </form>
            </div>
            <!-- 사용자정보 모달 끝 -->
            <!-- 구분 항목 관리 시작 -->
            <div id="section_management_form">
                <div class="form_top">
                    <form action="" onsubmit="return false;">
                        <div class="input_row_wrap">
                            <div class="input_row">
                                <div class="input_tit">
                                    <i>구분항목</i>
                                </div>
                                <div class="input_wrap">
                                    <input type="text" id="input_section" name="input_section" />
                                </div>
                            </div>
                            <div class="input_btn_wrap">
                                <button type="button" class="btn_blue" id="btn_add_section"><div>추가</div></button>
                                <button type="button" class="btn_yellow" id="btn_edit_section"><div>수정</div></button>
                                <button type="button" class="btn_gray" id="btn_del_section"><div>삭제</div></button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="form_bottom">
                    <div class="list">
                        <table>
                            <thead>
                                <tr>
                                    <th>순번</th>
                                    <th>구분명</th>
                                </tr>
                            </thead>
                            <tbody id="sectionList"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- 구분 항목 관리 끝 -->
            <!-- 계약 업체 관리 시작 -->
            <div id="contractor_management_form">
                <div>
                    <form action="" onsubmit="return false;">
                        <div class="input_row_wrap">
                            <div class="input_row">
                                <div class="input_tit">
                                    <i>계약업체</i>
                                </div>
                                <div class="input_wrap">
                                    <input type="text" id="input_contractor" name="input_contractor" />
                                </div>
                            </div>
                            <div class="input_btn_wrap">
                                <button type="button" class="btn_blue" id="btn_add_contractor"><div>추가</div></button>
                                <button type="button" class="btn_yellow" id="btn_edit_contractor"><div>수정</div></button>
                                <button type="button" class="btn_gray" id="btn_del_contractor"><div>삭제</div></button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="form_bottom">
                    <div class="list">
                        <table>
                            <thead>
                                <tr>
                                    <th>순번</th>
                                    <th>구분명</th>
                                </tr>
                            </thead>
                            <tbody id="contractorList"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- 계약 업체 관리 끝 -->
        </div>
        <div class="modal_bottom">
            <div>
                <button type="button" id="btn_info_edit" class="info_edit">
                    <div>수정</div>
                </button>
                <button type="button" id="btn_info_Del">
                    <div>삭제</div>
                </button>
                <button type="button" id="btn_info_add" class="info_add">
                    <div>추가</div>
                </button>
            </div>
        </div>
    </div>
</div>
<!-- modal 끝 -->
<!-- 컨텐츠 끝 -->
