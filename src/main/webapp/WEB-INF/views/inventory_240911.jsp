<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!-- 이소정 -->
<head>
<link rel="stylesheet" href="${contextPath}/resources/css/product/inventory.css" />
<script defer src="${contextPath}/resources/js/product/inventory.js"></script>

<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=medium-dpi" />
</head>

<script>
    var contextPath = "${contextPath}/resources/";
    var downloadPath = "${contextPath}";
    var gConfigInfo = []; // 구정보(1:송파,2:서대문)
</script>

<!-- 컨텐츠 시작 -->
<main>
	<div class="content_wrap">		
		<!-- 컨텐츠 상단(등록버튼, 검색input, 단계버튼) 시작-->
        <div class="top_content">
            <div class="btn_wrap top_left">
                <button type="button" class="btn_modal_show" id="btn_inventory_N">
                    <div>신규 등록</div>
                </button>
            </div>
            <!-- 
            <div class="search_wrap">
                <div class="search_left">
                    <div class="select_box">
                        <select name="" id="userCate">
                            <option value="제품명">제품명</option>
                            <option value="작성자">작성자</option>
                            <option value="작성일">작성일</option>
                        </select>
                        <span class="select_icon"></span>
                    </div>
                </div>
                <div class="search_right">
                    <input type="text" />
                    <button type="button" id="btn_search">
                        <div class="search_icon"></div>
                    </button>
                </div>
            </div>
             -->
        </div>
		<!-- 컨텐츠 중간(리스트) 시작-->
		<div class="list" id="mainList">
			<table>
				<thead>
					<tr>
						<th style="min-width: 64px">순번</th>
						<th style="min-width: 250px">제품명</th>
						<th style="min-width: 250px">구매처</th>
						<th style="min-width: 250px">담당자</th>
						<th style="min-width: 250px">연락처</th>
						<th style="min-width: 120px">전체 입고 수량</th>
						<th style="min-width: 120px">전체 출고 수량</th>
						<th style="min-width: 120px">현재 재고 수량</th>
						<th style="min-width: 120px">재고 상세 페이지</th>
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
	<div class="modal_wrap inventory_modal">
		<div class="modal_top">
			<b></b> <span class="modal_close"></span>
		</div>
		<div class="modal_main">
			<!-- 재고관리 모달 시작 -->
			<div id="new_inventory_form">
				<form action="" id="form_inventory_info" name="form_inventory_info">
					<div class="form_inventory_row_bundle">
						<div class="input_row">
							<div class="input_tit">
								<i>제품명</i>
							</div>
							<div class="input_wrap">
								<input type="text" id="text_product_name" name="text_product_name" />
							</div>
						</div>
						<div class="input_row">
							<div class="input_tit">
								<i>구매처</i>
							</div>
							<div class="input_wrap">
								<input type="text" id="text_purchase_company" name="text_purchase_company" />
							</div>
						</div>
					</div>
					<div class="form_inventory_row_bundle">
						<div class="input_row">
							<div class="input_tit">
								<i>담당자</i>
							</div>
							<div class="input_wrap">
								<input type="text" id="text_manager" name="text_manager" />
							</div>
						</div>
						<div class="input_row">
							<div class="input_tit">
								<i>연락처</i>
							</div>
							<div class="input_wrap">
								<input type="text" id="text_tel" name="text_tel" />
							</div>
						</div>
					</div>
					<div class="input_row">
						<div class="input_tit">
							<i>URL</i>
						</div>
						<div class="input_wrap">
							<input type="text" id="text_url" name="text_url" tabindex="5"/>
						</div>
					</div>
				</form>
			</div>
			<!-- 재고관리 모달 끝 -->
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
