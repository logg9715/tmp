<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!-- 이소정 -->
<head>
    <link rel="stylesheet" href="${contextPath}/resources/css/contract/revenue.css" />
    <script defer src="${contextPath}/resources/js/contract/revenue.js"></script>

    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=medium-dpi" />
</head>

<script>
    var contextPath = "${contextPath}/resources/";
    var downloadPath = "${contextPath}";
    var gConfigInfo = []; // 구정보(1:송파,2:서대문)
</script>
<!-- sw수정 1-->

<!-- 컨텐츠 시작 -->
<main>
    <div class="content_wrap">
        <!-- 컨텐츠 상단(등록버튼, 검색input, 단계버튼) 시작-->
        <form action="#" id="form_search_revenue" name="form_search_revenue">
            <div class="top_content">
                <div class="search_wrap">
                    <div class="search_left">
                        <div class="select_box">
                            <select name="sel_search_company" id="sel_search_company">
                                <option value="0">업체선택</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="detail_search_wrap">
                    <label for="">사업기간</label>
                    <input type="date" id="txt_bus_sdate" name="txt_bus_sdate" />
                    <span>~</span>
                    <input type="date" id="txt_bus_edate" name="txt_bus_edate" />
                </div>
                <div class="detail_search_wrap">
                    <label for="num_bill_year">계산서발행년도</label>
                    <input type="number" id="num_bill_year" name="num_bill_year" min="2000" max="3000" step="1" value="2024" />
                </div>
                <div class="search_wrap">
                    <div class="search_left">
                        <div class="select_box">
                            <select name="sel_search_word" id="sel_search_word">
                                <option value="0">선택</option>
                                <option value="1">계약일자</option>
                                <option value="2">수요처</option>
                                <option value="3">발주처(계약사)</option>
                                <option value="4">건명(사업명)</option>
                                <option value="5">구분</option>
                            </select>
                            <span class="select_icon"></span>
                        </div>
                    </div>
                    <div class="search_right">
                        <input type="text" id="txt_search_word" name="txt_search_word" />
                        <button type="button" id="btn_search">
                            <div class="search_icon"></div>
                        </button>
                    </div>
                </div>
            </div>
            <!-- <div class="top_content">
			</div> -->
        </form>
        <!-- 컨텐츠 상단(등록버튼, 검색input, 단계버튼) 끝-->
        <!-- 컨텐츠 중간(리스트) 시작-->
        <div class="list" id="mainList">
            <table>
                <thead>
                    <tr>
                        <!-- 						<th style="width: 64px"><input type="checkbox" name="" id="mainListCheckAll" class="check_all" /> <label for="mainListCheckAll"></label></th> -->
                        <th style="min-width: 64px">순번</th>
                        <th style="min-width: 115px">계약일자</th>
                        <th style="min-width: 115px">수요처</th>
                        <th style="min-width: 115px">발주처(계약사)</th>
                        <th>사업명(건명)</th>
                        <th style="min-width: 60px">
                            <div>
                                계약금액 <br />
                                <span class="vat_desc">VAT포함</span>
                            </div>
                        </th>
                        <th style="min-width: 60px">
                            <div>
                                계약금액 <br />
                                <span class="vat_desc">VAT별도</span>
                            </div>
                        </th>
                        <th style="min-width: 60px">
                            <div>
                                매출금액 <br />
                                <span class="vat_desc">VAT포함</span>
                            </div>
                        </th>
                        <th style="min-width: 60px">
                            <div>
                                매출금액 <br />
                                <span class="vat_desc">VAT별도</span>
                            </div>
                        </th>
                        <th>매입</th>
                        <th style="min-width: 120px">계산서발행일</th>
                        <th>매출구분</th>
                        <th>구분</th>
                        <th>계약번호</th>
                        <th style="min-width: 120px">사업기간</th>
                        <th>업체명</th>
                        <th>제품발주</th>
                        <th>계약서발송</th>
                        <th>수금현황</th>
                        <th>결제상태</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <!-- 컨텐츠 중간(리스트) 끝-->
        <!-- 컨텐츠 하단(전체수, 페이지네이션, 삭제버튼) 시작-->
        <div class="bottom_content">
            <div class="total_num">전체수 : <span id="list_total_num">1,000</span>건</div>
            <div class="paging" id="revenueManagementListPaging"></div>
            <div class="btn_wrap bottom_right">
                <button type="button" id="btn_request_I">
                    <div>계산서 요청</div>
                </button>
                <button type="button" id="btn_issue_I">
                    <div>계산서 발행</div>
                </button>
                <button type="button" id="btn_cancel_I">
                    <div>계산서 취소</div>
                </button>
                <!-- 
				<button type="button" id="btn_excel">
					<div>엑셀 내보내기</div>
				</button>
				<button type="button" id="btn_list_del">
					<div>삭제</div>
				</button>
				 -->
            </div>
        </div>
        <!-- 컨텐츠 하단(전체수, 페이지네이션, 삭제버튼) 끝-->
    </div>
</main>
<!-- 컨텐츠 끝 -->
<!-- modal 시작 -->
<div class="modal">
    <div class="modal_wrap">
        <div class="modal_top"><b></b> <span class="modal_close"></span></div>
        <div class="modal_main">
            <!-- 신규계약등록 모달 시작 -->
            <div id="new_contract_form">
                <!-- 관리자 모달 시작-->
                <div id="modalContractAdmin">
                    <!-- 관리자 작성폼 시작 -->
                    <form action="" id="formContractAdmin" name="formContractAdmin" enctype="multipart/form-data">
                        <div class="input_desc">
                            <button type="button" id="formAdmin_close"></button>
                            <div>관리자 계약관리</div>
                        </div>
                        <div class="modal_admin_content">
                            <!-- 관리자 작성폼 시작 -->
                            <div class="form_top">
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>계산서발행일</i>
                                    </div>
                                    <div class="input_wrap">
                                        <input type="date" id="payContractReponseDate" name="payContractReponseDate" />
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>계약업체</i>
                                    </div>
                                    <div class="input_wrap">
                                        <div class="select_box">
                                            <select name="payContractCompany" id="payContractCompany">
                                                <option value="0">선택</option>
                                            </select>
                                            <span class="select_icon"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>수금현황</i>
                                    </div>
                                    <!-- <div class="input_wrap"><i>수금</i> <input type="checkbox" name="payCollect" id="payCollect" class="" value="1" /> <label for="payCollect"></label></div> -->
                                    <div class="input_wrap btn_onoff"><input type="checkbox" name="payCollect" id="payCollect" value="1" /> <label for="payCollect"></label></div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>계산서발행현황</i>
                                    </div>
                                    <div class="input_wrap btn_onoff"><input type="checkbox" name="billType" id="billType" value="1" /> <label for="billType"></label></div>

                                    <!-- <div class="input_wrap inputs_bundle">
                                            <div>
                                                <i>발행완료</i><input type="radio" name="billType" id="finishBillType" class="" value="1" /> <label for="finishBillType"></label>
                                            </div>
                                            <div>
                                                <i>발행취소</i><input type="radio" name="billType" id="cancelBillType" class="" value="0" /> <label for="cancelBillType"></label>
                                            </div>
                                        </div> -->
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>특이사항</i>
                                    </div>
                                    <div class="input_wrap">
                                        <!-- <input type="text" id="adminMemo" name="adminMemo" /> -->
                                        <textarea name="adminMemo" id="adminMemo"></textarea>
                                    </div>
                                </div>
                                <!-- 관리자 작성폼 끝 -->
                                <!--<div class="form_bottom">
                                         <div class="input_row editor_row">
                                            <div class="input_tit">
                                                <i>특이사항</i>
                                            </div>
                                            <div class="input_wrap">
                                                <div class="editor">
                                                    <div class="editor_menu_wrap">
                                                        <div class="editor_menu">
                                                            <button type="button" class="btn-bold" id="contractEditorAdmin-btn-bold">B</button>
                                                            <button type="button" class="btn-underline" id="contractEditorAdmin-btn-underline">U</button>
                                                            <button type="button" class="btn-strike" id="contractEditorAdmin-btn-strike">S</button>
                                                            <button type="button" class="btn-image" id="contractEditorAdmin-btn-image"></button>
                                                            <input class="editor_img" id="contractEditorAdmin-img-selector" type="file" accept="image/*" style="display: none" />
                                                        </div>
                                                    </div>
                                                    <div class="editor_input">
                                                        <div id="contractEditorAdmin" contenteditable="true" class="editor_box"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> -->
                                <div class="modal_bottom">
                                    <button type="button" id="bill_info_save">
                                        <div>계산서처리저장</div>
                                    </button>
                                    <!-- <button type="button" id="btn_issue_I">
                                            <div>계산서 발행</div>
                                        </button>
                                        <button type="button" id="btn_cancel_I">
                                            <div>계산서 취소</div>
                                        </button> -->
                                </div>
                            </div>
                        </div>
                    </form>
                    <!-- 관리자 작성폼 시작 -->
                </div>
                <!-- 관리자 모달 끝-->
                <div>
                    <div class="modal_top_content">
                        <div class="contract_tabBtn_wrap">
                            <div class="contract_tabBtn active" data-tabNum="1">계약정보</div>
                            <div class="contract_tabBtn" data-tabNum="2">기성금</div>
                            <!-- <div class="contract_tabBtn" data-tabNum="3">매입</div> -->
                        </div>
                        <!-- 
                        <button type="button" id="contract_admin" class="admin_btn">
                            <span class="icon"></span>
                            <div>관리자</div>
                        </button>
                         -->
                    </div>
                    <!-- 계약정보 폼 시작 -->
                    <form action="" class="contract_tabItem active" data-tabNum="1" id="formContractInfo" name="formContractInfo" enctype="multipart/form-data">
                        <!-- <div class="form_top"> -->
                        <!-- 신규계약등록 모달 왼쪽 시작 -->
                        <div style="display: flex; gap: 20px">
                            <div class="form_left">
                                <div class=""></div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>구분</i>
                                    </div>
                                    <div class="input_wrap">
                                        <div class="select_box">
                                            <select name="contractUserCate" id="contractUserCate">
                                                <option value="0">선택</option>
                                            </select>
                                            <span class="select_icon"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>계약일자</i>
                                    </div>
                                    <div class="input_wrap">
                                        <input type="date" id="contractDate" name="contractDate" />
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>수요처</i>
                                    </div>
                                    <div class="input_wrap">
                                        <input type="text" id="contractDemand" name="contractDemand" />
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>발주처</i>
                                    </div>
                                    <div class="input_wrap">
                                        <input type="text" id="contractOrder" name="contractOrder" />
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>사업명</i>
                                    </div>
                                    <div class="input_wrap">
                                        <input type="text" id="contractBusName" name="contractBusName" />
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>계약금</i>
                                    </div>
                                    <div class="input_wrap inputs_bundle">
                                        <input type="text" id="contractPrice" name="contractPrice" placeholder="VAT포함" /> <input type="text" id="contractVat" name="contractVat" placeholder="VAT별도" />
                                        <button type="button" class="btn_auto_calculate">
                                            <span class="icon_calculate" title="자동계산"></span>
                                        </button>
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>사업기간</i>
                                    </div>
                                    <div class="input_wrap inputs_bundle">
                                        <input type="date" id="contractBusSTime" name="contractBusSTime" />
                                        <input type="date" id="contractBusETime" name="contractBusETime" />
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>하자기간</i>
                                    </div>
                                    <div class="input_wrap inputs_bundle">
                                        <input type="date" id="contractServiceSTime" name="contractServiceSTime" />
                                        <input type="date" id="contractServiceETime" name="contractServiceETime" />
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_wrap inputs_bundle">
                                        <div class="checks_bundle">
                                            <div><i>계약서 발송</i> <input type="checkbox" name="contractSend" id="contractSend" /> <label for="contractSend"></label></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 신규계약등록 모달 왼쪽 끝 -->
                            <!-- 신규계약등록 모달 오른쪽 시작 -->
                            <div class="form_right">
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>특이사항</i>
                                    </div>
                                    <div class="input_wrap">
                                        <input type="text" id="contractInfoMemo" name="contractInfoMemo" />
                                    </div>
                                </div>
                                <!-- 신규계약 첨부파일 시작-->
                                <div class="input_row file_row">
                                    <div class="file_wrap">
                                        <!-- 영업 첨부파일 시작 -->
                                        <div class="filebox">
                                            <div class="btn_file_wrap">
                                                <div class="input_tit">
                                                    <i>영업 첨부파일</i>
                                                </div>
                                            </div>
                                            <div class="preview">
                                                <table>
                                                    <thead>
                                                        <tr class="preview_top">
                                                            <th style="width: 50px">
                                                                <!-- <button class="contract1_file_remove"></button> -->
                                                                <p>삭제</p>
                                                            </th>
                                                            <th style="text-align: left">
                                                                <p>파일명</p>
                                                            </th>
                                                            <th style="width: 70px">
                                                                <p>다운로드</p>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="contract1Preview"></tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <!-- 영업 첨부파일 끝 -->
                                        <!-- 계약 첨부파일 시작 -->
                                        <div class="filebox">
                                            <div class="btn_file_wrap">
                                                <div class="input_tit">
                                                    <i>계약 첨부파일</i>
                                                </div>
                                                <div>
                                                    <div class="btn_file active"><label for="contract2FileInput">내PC</label> <input type="file" id="contract2FileInput" name="contract2FileInput" multiple /></div>
                                                </div>
                                            </div>
                                            <!-- <div class="btn_preview_tab_wrap"><span class="btn_preview_tab">영업</span><span>|</span><span class="btn_preview_tab active">계약</span><span>|</span><span class="btn_preview_tab disabled">계약관리</span></div> -->
                                            <div class="preview active">
                                                <table>
                                                    <thead>
                                                        <tr class="preview_top">
                                                            <th style="width: 50px">
                                                                <!-- <button class="contract2_file_remove"></button> -->
                                                                <p>삭제</p>
                                                            </th>
                                                            <th style="text-align: left">
                                                                <p>파일명</p>
                                                            </th>
                                                            <th style="width: 70px">
                                                                <p>다운로드</p>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="contract2Preview"></tbody>
                                                </table>
                                            </div>
                                            <!-- <div class="preview_tab_content">
                                            </div> -->
                                            <!-- <div class="preview_tab_wrap">
                                            </div> -->
                                        </div>
                                        <!-- 계약 첨부파일 끝 -->
                                    </div>
                                </div>
                                <!-- 신규계약 첨부파일 끝-->
                            </div>
                            <!-- 신규계약등록 모달 오른쪽 끝 -->
                        </div>
                        <!-- </div> -->
                    </form>
                    <!-- 계약정보 폼 끝 -->
                    <!-- 기성금 폼 시작 -->
                    <form action="" id="formContractReadyMoney" name="formContractReadyMoney" class="contract_tabItem" data-tabNum="2">
                        <div class="form_wrap" style="display: flex; flex-direction: column; gap: 10px; height: 100%">
                            <div class="form_top">
                                <!-- 기성금관리 모달 왼쪽 시작 -->
                                <div class="form_left">
                                    <div class="form_left_inputs_bundle">                                        
                                        <div class="input_row">
                                            <div class="input_tit">
                                                <i>구분</i>
                                            </div>
                                            <div class="input_wrap">
                                                <div class="select_box">
                                                    <select name="payContractType" id="payContractType">
                                                        <option value="-1">선택</option>
                                                        <option value="0">기성금</option>
                                                        <option value="1">선금</option>
                                                        <option value="2">잔금</option>
                                                    </select>
                                                    <span class="select_icon"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="input_row">
                                        <div class="input_tit">
                                            <i>계약금</i>
                                        </div>
                                        <div class="input_wrap inputs_bundle">
                                            <input type="text" id="payContractPrice" name="payContractPrice" placeholder="VAT포함" />
                                            <input type="text" id="payContractPriceVat" name="payContractPriceVat" placeholder="VAT별도" />
                                            <button type="button" class="btn_auto_calculate">
                                                <span class="icon_calculate" title="자동계산"></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- 기성금관리 모달 왼쪽 끝 -->
                                <!-- 기성금관리 모달 오른쪽 시작 -->
                                <div class="form_right">
                                    <div class="input_row">
                                        <div class="input_tit">
                                            <i>매출구분(기타)</i>
                                        </div>
                                        <div class="input_wrap">
                                            <input type="text" id="contractSalesEtc" name="contractSalesEtc" />
                                        </div>
                                    </div>
                                    <div class="input_row">
                                        <div class="input_tit">
                                            <i>계산서요청일자</i>
                                        </div>
                                        <div class="input_wrap">
                                            <input type="date" id="contractRequestBillDate" name="contractRequestBillDate" />
                                        </div>
                                    </div>
                                </div>
                                <!-- 기성금관리 모달 오른쪽 끝 -->
                                <!-- 
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>메모</i>
                                    </div>
                                    <div class="input_wrap">
                                        <textarea name="contractReadyMoneyMemo" id="contractReadyMoneyMemo"></textarea>
                                    </div>
                                </div>
                                 -->
                                <c:choose>
                    			<c:when test="${loginLevel != null and loginLevel > 80}">
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>계산서발행일</i>
                                    </div>
                                    <div class="input_wrap">
                                        <input type="date" id="payContractReponseDate" name="payContractReponseDate" />
                                    </div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>계약업체</i>
                                    </div>
                                    <div class="input_wrap">
                                        <div class="select_box">
                                            <select name="payContractCompany" id="payContractCompany">
                                                <option value="0">선택</option>
                                            </select>
                                            <span class="select_icon"></span>
                                        </div>
                                    </div>
                                </div>
                                 <div class="input_row">
                                    <div class="input_tit">
                                        <i>수금현황</i>
                                    </div>
                                    <!-- <div class="input_wrap"><i>수금</i> <input type="checkbox" name="payCollect" id="payCollect" class="" value="1" /> <label for="payCollect"></label></div> -->
                                    <div class="input_wrap btn_onoff"><input type="checkbox" name="payCollect" id="payCollect" value="1" /> <label for="payCollect"></label></div>
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>계산서발행현황</i>
                                    </div>
                                    <div class="input_wrap btn_onoff"><input type="checkbox" name="billType" id="billType" value="1" /> <label for="billType"></label></div>

                                    <!-- <div class="input_wrap inputs_bundle">
                                            <div>
                                                <i>발행완료</i><input type="radio" name="billType" id="finishBillType" class="" value="1" /> <label for="finishBillType"></label>
                                            </div>
                                            <div>
                                                <i>발행취소</i><input type="radio" name="billType" id="cancelBillType" class="" value="0" /> <label for="cancelBillType"></label>
                                            </div>
                                        </div> -->
                                </div>
                                <div class="input_row">
                                    <div class="input_tit">
                                        <i>메모</i>
                                    </div>
                                    <div class="input_wrap">
                                        <!-- <input type="text" id="adminMemo" name="adminMemo" /> -->
                                        <textarea name="adminMemo" id="adminMemo"></textarea>
                                    </div>
                                </div>
                                </c:when>
               					</c:choose>
                                <!-- 
                                 <div class="input_row">
                                 	<div style="display: flex; gap: 5px">
                                        <div class="input_tit">
                                            <i>첨부파일</i>
                                        </div>
                                        <div class="btn_file active"><label for="contractAdminFileInput">내PC</label> <input type="file" id="contractAdminFileInput" name="contractAdminFileInput" multiple /></div>
                                    </div>
                                    <div class="preview_tab_wrap">
                                        <div class="preview_tab_content">
                                            <div class="preview active">
                                                <table>
                                                    <thead>
                                                        <tr class="preview_top">
                                                            <th style="width: 30px">
                                                                <button class="file_remove"></button>
                                                            </th>
                                                            <th style="text-align: left">
                                                                <p>파일명</p>
                                                            </th>
                                                            <th style="width: 60px">
                                                                <p>다운로드</p>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="contractAdminPreview"></tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                 </div>
                                  -->
                            </div>
                            <div class="form_bottom">
                                <div class="form_btn_area">
                                    <button type="button" class="btn_list_add" id="addContractInfo" value="1">
                                        <div>추가</div>
                                    </button>
                                    <button type="button" id="editContractInfo" value="2">
                                        <div>수정</div>
                                    </button>
                                    <button type="button" class="btn_list_edit">
                                        <div>수정</div>
                                    </button>
                                </div>
                            </div>
                            <div class="list modal_list" id="compltedList" style="border-top: 1px solid #ddd; flex-grow: 1">
                                <table>
                                    <thead>
                                        <tr>
                                            <th style="width: 64px">순번</th>
                                            <th>업체명</th>
                                            <th>구분</th>
                                            <th>
                                                금액<br />
                                                <span class="vat_desc">(VAT포함)</span>
                                            </th>
                                            <th>
                                                금액<br />
                                                <span class="vat_desc">(VAT별도)</span>
                                            </th>
                                            <th>매출구분</th>
                                            <th>계산서요청일자</th>
                                            <th>계산서발행</th>
                                            <th>계산서발행일자</th>
                                            <th>메모</th>
                                            <th>수금현황</th>
                                            <th>삭제</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <!-- </div> -->
                    </form>
                    <!-- 기성금 폼 끝 -->
                </div>
                <!-- 계약 버튼 시작-->
                <div class="modal_bottom">
                	<button type="button" class="info_prevstep" id="btn_prev_step" value="-1">
                        <div>이전단계</div>
                    </button>
                <!-- 
                    <button type="button" id="contract_info_save" class="info_save">
                        <div>저장</div>
                    </button>
                    <button type="button" id="contract_info_edit" class="info_edit">
                        <div>수정</div>
                    </button>
                    <button type="button" id="contract_info_del">
                        <div>삭제</div>
                    </button>
                 -->
                </div>
                <!-- 계약 버튼 끝-->
            </div>
            <!-- 신규계약등록 모달 끝 -->

            <!-- 신규매입등록 모달 시작 -->
            <div id="new_Purchase_form">
                <!-- 매입 폼 시작 -->
                <form action="" class="contract_tabItem" data-tabNum="3" id="formPurchaseInfo" name="formPurchaseInfo" enctype="multipart/form-data" style="display: none">
                    <!-- 계약금 시작 -->
                    <div class="purchase_wrap">
                        <div class="input_row">
                            <div class="input_tit">
                                <i>계약금</i>
                            </div>
                            <div class="input_wrap inputs_bundle">
                                <input type="text" id="productCost" name="productCost" placeholder="VAT포함" />
                                <input type="text" id="productCostVat" name="productCostVat" placeholder="VAT별도" />
                                <i>(계약금의</i><input type="text" id="productRate" name="productRate" placeholder="%" /><i>%)</i>
                                <button type="button" class="btn_auto_calculate" style="padding: 6px;">
                                    <span class="icon_calculate" title="자동계산"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- 계약금 끝 -->
                    <div style="padding: 0 30px; position: relative;">
                        <div class="btn_modal_formTab_wrap">
                            <div class="btn_modal_formTab">
                                <div class="active">물품구매</div>
                                <div>설치공사하도급</div>
                            </div>
                        </div>
                        <!-- 물품구매 폼 시작 -->
                         <div class="modal_formTab active" id="productModal">
                             <div class="form_top">
                                 <div class="form_left">
                                     <div class="input_row">
                                         <div class="input_tit">
                                             <i>공급사</i>
                                         </div>
                                         <div class="input_wrap inputs_bundle">
                                             <div class="select_box">
                                                 <select name="productCompanyInfo" id="productCompanyInfo">
                                                     <option value="0">선택</option>
                                                 </select>
                                                 <span class="select_icon"></span>
                                             </div>
                                             <input type="text" id="productCompanyOther" name="productCompanyOther" />
                                         </div>
                                     </div>
                                     <div class="input_row">
                                         <div class="input_tit">
                                             <i>단가</i>
                                         </div>
                                         <div class="input_wrap inputs_bundle">
                                             <input type="text" id="productPrice" name="productPrice" placeholder="VAT포함" /> <input type="text" id="productPriceVat" name="productPriceVat" placeholder="VAT별도" />
                                             <button type="button" class="btn_auto_calculate">
                                                 <span class="icon_calculate" title="자동계산"></span>
                                             </button>
                                         </div>
                                     </div>
                                     <div class="input_row">
                                         <div class="input_tit">
                                             <i>제품명</i>
                                         </div>
                                         <div class="input_wrap inputs_bundle">
                                             <div class="select_box">
                                                 <select name="productName" id="productName">
                                                     <option value="0">선택</option>
                                                 </select>
                                                 <span class="select_icon"></span>
                                             </div>
                                             <input type="text" id="productNameOther" name="productNameOther" placeholder="제품명" />
                                         </div>
                                     </div>
                                     <div class="input_row">
                                         <div class="input_tit">
                                             <i>메모</i>
                                         </div>
                                         <div class="input_wrap">
                                             <div class="select_box">
                                                 <input type="text" id="productMemo" name="productMemo" placeholder="메모" />
                                             </div>
                                         </div>
                                     </div>
                                     <div class="input_row">
                                         <div class="input_tit">
                                             <i>수량</i>
                                         </div>
                                         <div class="input_wrap">
                                             <input type="text" id="productCount" name="productCount" />
                                         </div>
                                     </div>
                                     <div class="form_btn_area">
                                         <button type="button" class="btn_list_add" id="btn_add_product">
                                             <div>추가</div>
                                         </button>
                                         <button type="button" class="btn_list_add" id="btn_edit_product">
                                             <div>수정</div>
                                         </button>
                                     </div>
                                 </div>
                                 <div class="form_right">
                                     <div class="list modal_list">
                                         <table>
                                             <thead>
                                                 <tr>
                                                     <th style="width: 64px">순번</th>
                                                     <th>공급사</th>
                                                     <th>제품명</th>
                                                     <th>수량</th>
                                                     <th>
                                                         단가<br />
                                                         <span class="vat_desc">(VAT포함)</span>
                                                     </th>
                                                     <th>
                                                         단가<br />
                                                         <span class="vat_desc">(VAT별도)</span>
                                                     </th>
                                                     <th>메모</th>
                                                     <th>삭제</th>
                                                 </tr>
                                             </thead>
                                             <tbody id="productList"></tbody>
                                         </table>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         <!-- 물품구매 폼 끝 -->
                         <!-- 설치공사하도급 폼 시작 -->
                         <div class="modal_formTab" id="workModal">
                             <div class="form_top">
                                 <div class="form_left">
                                     <div class="input_row">
                                         <div class="input_tit">
                                             <i>업체명</i>
                                         </div>
                                         <div class="input_wrap inputs_bundle">
                                             <div class="select_box">
                                                 <select name="workCompanyInfo" id="workCompanyInfo">
                                                     <option value="0">선택</option>
                                                 </select>
                                                 <span class="select_icon"></span>
                                             </div>
                                             <input type="text" id="workCompanyOther" name="workCompanyOther" />
                                         </div>
                                     </div>
                                     <div class="input_row">
                                         <div class="input_tit">
                                             <i>수량</i>
                                         </div>
                                         <div class="input_wrap">
                                             <input type="text" id="workCount" name="workCount" />
                                         </div>
                                     </div>
                                     <div class="input_row">
                                         <div class="input_tit">
                                             <i>단가</i>
                                         </div>
                                         <div class="input_wrap inputs_bundle">
                                             <input type="text" id="workPrice" name="workPrice" placeholder="VAT포함" /> <input type="text" id="workPriceVat" name="workPriceVat" placeholder="VAT별도" />
                                             <button type="button" class="btn_auto_calculate">
                                                 <span class="icon_calculate" title="자동계산"></span>
                                             </button>
                                         </div>
                                     </div>
                                     <div class="input_row">
                                         <div class="input_tit">
                                             <i>공사명</i>
                                         </div>
                                         <div class="input_wrap inputs_bundle">
                                             <div class="select_box">
                                                 <select name="workName" id="workName">
                                                     <option value="0">선택</option>
                                                 </select>
                                                 <span class="select_icon"></span>
                                             </div>
                                             <input type="text" id="workNameOther" name="workNameOther" />
                                         </div>
                                     </div>
                                     <div class="input_row">
                                         <div class="input_tit">
                                             <i>메모</i>
                                         </div>
                                         <div class="input_wrap">
                                             <div class="select_box">
                                                 <input type="text" id="workMemo" name="workMemo" placeholder="메모" />
                                             </div>
                                         </div>
                                     </div>
                                     <div class="form_btn_area">
                                         <button type="button" class="btn_list_add" id="btn_add_work">
                                             <div>추가</div>
                                         </button>
                                         <button type="button" class="btn_list_add" id="btn_edit_work">
                                             <div>수정</div>
                                         </button>
                                     </div>
                                 </div>
                                 <div class="form_right">
                                     <div class="list modal_list">
                                         <table>
                                             <thead>
                                                 <tr>
                                                     <th style="width: 64px">순번</th>
                                                     <th>업체명</th>
                                                     <th>공사명</th>
                                                     <th>수량</th>
                                                     <th>
                                                         단가<br />
                                                         <span class="vat_desc">(VAT포함)</span>
                                                     </th>
                                                     <th>
                                                         단가<br />
                                                         <span class="vat_desc">(VAT별도)</span>
                                                     </th>
                                                     <th>메모</th>
                                                     <th>삭제</th>
                                                 </tr>
                                             </thead>
                                             <tbody id="workInfoList"></tbody>
                                         </table>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         <!-- 설치공사하도급 폼 끝 -->
                     </div>
                    <div class="form_bottom">
                        <div class="input_row file_row">
                            <div class="file_wrap">
                                <div class="filebox">
                                    <div style="display: flex; gap: 5px;">
                                        <div class="input_tit">
                                            <i>첨부파일</i>
                                        </div>
                                        <div class="btn_file active"><label for="productFileInput">내PC</label> <input type="file" id="productFileInput" name="productFileInput" multiple /></div>
                                    </div>
                                    <div class="preview_tab_wrap">
                                        <div class="preview_tab_content">
                                            <div class="preview active">
                                                <table>
                                                    <thead>
                                                        <tr class="preview_top">
                                                            <th style="width: 30px">
                                                                <button class="file_remove"></button>
                                                            </th>
                                                            <th style="text-align: left">
                                                                <p>파일명</p>
                                                            </th>
                                                            <th style="width: 60px">
                                                                <p>다운로드</p>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="productPreview"></tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 매입 버튼 시작 -->
                    <div class="modal_bottom">
                        <button type="button" id="purchase_info_save">
                            <div>저장</div>
                        </button>
                    </div>
                    <!-- 매입 버튼 끝 -->
                </form>
                <!-- 매입 폼 끝 -->
            </div>
            <!-- 신규매입등록 모달 끝 -->
        </div>
    </div>
</div>
<!-- modal 끝 -->