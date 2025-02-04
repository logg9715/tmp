<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!-- 이소정 -->
<head>
<link rel="stylesheet" href="${contextPath}/resources/css/product/inventory.css" />
<script defer src="${contextPath}/resources/js/product/inventory_sub.js"></script>

<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=medium-dpi" />
</head>

<script>
    var contextPath = "${contextPath}/resources/";
    var downloadPath = "${contextPath}";
    var gConfigInfo = []; // 구정보(1:송파,2:서대문)
    var $inventoryCode = "${inventoryCode}"; 
</script>

<!-- 컨텐츠 시작 -->
<main>
	<div class="content_wrap">
		<!-- 컨텐츠 상단(등록버튼, 검색input, 단계버튼) 시작-->
		<div class="top_content">
			<div class="btn_wrap top_left">
				<button type="button" class="btn_modal_show" id="btn_inventory_sub_N">
					<div>신규 등록</div>
				</button>
			</div>
			<div class="search_wrap">
				<div class="search_left">
					<div class="select_box">
						<select name="searchType" id="searchType">
							<option value="0">선택</option>
							<option value="1">용도</option>
							<option value="2">일자</option>
						</select>
						<span class="select_icon"></span>
					</div>
				</div>
				<div class="search_right">
					<input type="text" id="searchData" name="searchData"/>
					<button type="button" id="btn_search">
						<div class="search_icon"></div>
					</button>
				</div>
			</div>
			<div class="btn_wrap top_right">
				<button type="button" id="btn_back" onclick="location.href = 'inventory' ">
					<div>
						<span class="level_icon"></span>
						<p>재고관리 돌아가기</p>
					</div>
				</button>
			</div>
		</div>
		<!-- 컨텐츠 상단(등록버튼, 검색input, 단계버튼) 끝-->
		<!-- 컨텐츠 중간(리스트) 시작-->
		<div class="list">
			<table>
				<thead>
					<tr>
						<th style="min-width: 64px">순번</th>
						<th style="min-width: 120px">상태</th>
						<th style="min-width: 250px">용도</th>
						<th style="min-width: 120px">일자</th>
						<th style="min-width: 120px">수량</th>
						<th style="min-width: 120px">단가 <br /> <span class="vat_desc">VAT포함</span>
						</th>
						<th style="min-width: 120px">총금액 <br /> <span class="vat_desc">VAT포함</span>
						</th>
						<th style="min-width: 120px">수령자</th>
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
			<!-- 
			<div class="paging" id="contractManagementListPaging"></div>
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
	<div class="modal_wrap inventory_tmsc_modal">
		<div class="modal_top">
			<b></b> <span class="modal_close"></span>
		</div>
		<div class="modal_main">
			<!-- 상세재고관리 모달 시작 -->
			<div id="new_inventory_sub_form">
				<form id="form_inventory_sub" name="form_inventory_sub" action="">
					<div class="input_row">
						<div class="input_tit">
							<i>상태</i>
						</div>
						<div class="input_wrap">
							<div class="select_box">
								<select name="sel_inventory_type" id="sel_inventory_type">
									<option value="0" selected>선택</option>
									<option value="1">입고</option>
									<option value="2">출고</option>
								</select>
								<span class="select_icon"></span>
							</div>
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>용도</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_event_type" name="text_event_type" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>일자</i>
						</div>
						<div class="input_wrap">
							<input type="date" id="date_event_day" name="date_event_day" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>수량</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_count" name="text_count" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>단가</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_price" name="text_price" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>총계</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_total_price" name="text_total_price" />
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>수령자</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_recipient" name="text_recipient" />
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
										<button type="button" class="btn-bold" id="inventoryEditor-btn-bold">B</button>
										<button type="button" class="btn-underline" id="inventoryEditor-btn-underline">U</button>
										<button type="button" class="btn-strike" id="inventoryEditor-btn-strike">S</button>
										<button type="button" class="btn-image" id="inventoryEditor-btn-image"></button>
										<input class="editor_img" id="inventoryEditor-img-selector" type="file" accept="image/*" style="display: none" />
									</div>
								</div>
								<div class="editor_input">
									<div id="inventoryEditor" contenteditable="true" class="editor_box"></div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
			<!-- 상세재고관리 모달 끝 -->
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
