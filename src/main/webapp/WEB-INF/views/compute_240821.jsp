<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!-- 이소정 -->
<head>
<link rel="stylesheet" href="${contextPath}/resources/css/contract/contract.css" />
<script defer src="${contextPath}/resources/js/contract/compute.js"></script>

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
		<div class="top_content">
			<div class="btn_wrap top_left">
				<button type="button" class="btn_modal_show" id="btn_compute_N">
					<div>신규 등록</div>
				</button>
			</div>
			<div class="search_wrap">
				<div class="search_left">
					<div class="select_box">
						<select name="searchType" id="searchType">
							<option value="0">선택</option>
							<option value="1">물품식별번호</option>
							<option value="2">품명</option>
						</select>
						<span class="select_icon"></span>
					</div>
				</div>
				<div class="search_right">
					<input type="text" id="searchData"  name="searchData" placeholder="검색어입력"/>
					<button type="button" id="btn_search">
						<div class="search_icon"></div>
					</button>
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
						<th style="min-width: 130px">물품식별번호</th>
						<th style="min-width: 250px">품명</th>
						<th style="min-width: 250px">규격</th>
						<th style="min-width: 120px">단가</th>
						<th style="min-width: 120px">수량</th>
						<th style="min-width: 150px">합계(계약금액)</th>
						<th style="min-width: 80px">수수료요율</th>
						<th style="min-width: 150px">수수료(청산금액)</th>
						<th style="min-width: 250px">비고</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
		<!-- 컨텐츠 중간(리스트) 끝-->
		<!-- 컨텐츠 하단(전체수, 페이지네이션, 삭제버튼) 시작-->
		<div class="bottom_content">
			<div class="total_num">
				전체수 : <span id="list_total_num">0</span>건
			</div>
			<div class="paging" id="contractManagementListPaging"></div>
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
	<div class="modal_wrap comoute_moaal">
		<div class="modal_top">
			<b></b> <span class="modal_close"></span>
		</div>
		<div class="modal_main">
			<!-- 정산서관리 모달 시작 -->
			<div id="new_compute_form">
				<form action="" id="form_compute_info" name="form_compute_info">
					<div class="input_row">
						<div class="input_tit">
							<i>물품식별번호(*)</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_identification_no" name="text_identification_no" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>품명(*)</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_product_name" name="text_product_name" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>규격</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_standard_size" name="text_standard_size" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>단가</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_product_price" name="text_product_price" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>수량</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_product_count" name="text_product_count" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>합계(계약금액)</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_total_price" name="text_total_price" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>수수료요율</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_commission_rate" name="text_commission_rate" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>수수료(청구금액)</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_commission_price" name="text_commission_price" />
						</div>
					</div>
					<div class="input_row editor_row">
						<div class="input_tit">
							<i>비고</i>
						</div>
						<div class="input_wrap">
							<div class="editor">
								<div class="editor_menu_wrap">
									<div class="editor_menu">
										<button type="button" class="btn-bold" id="computeEditor-btn-bold">B</button>
										<button type="button" class="btn-underline" id="computeEditor-btn-underline">U</button>
										<button type="button" class="btn-strike" id="computeEditor-btn-strike">S</button>
										<button type="button" class="btn-image" id="computeEditor-btn-image"></button>
										<input class="editor_img" id="computeEditor-img-selector" type="file" accept="image/*" style="display: none" />
									</div>
								</div>
								<div class="editor_input">
									<div id="computeEditor" contenteditable="true" class="editor_box"></div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
			<!-- 정산서관리 모달 끝 -->
		</div>
		<div class="modal_bottom">
			<div>
				<button type="button" id="btn_info_edit" class="info_edit">
					<div>수정</div>
				</button>
				<button type="button" id="btn_info_Del">
					<div>삭제</div>
				</button>
				<button type="button" id="btn_info_save" class="info_save">
					<div>저장</div>
				</button>
			</div>
		</div>
	</div>
</div>
<!-- modal 끝 -->
<!-- 컨텐츠 끝 -->
