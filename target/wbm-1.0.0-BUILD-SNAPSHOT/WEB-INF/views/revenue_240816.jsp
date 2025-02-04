<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
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
						<input type="text" id="txt_search_word" name="txt_search_word"/>
						<button type="button" id="btn_search">
							<div class="search_icon"></div>
						</button>
					</div>				
				</div>
				
			</div>
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
				<div class="search_right">
					<input type="date" id="txt_bus_sdate" name="txt_bus_sdate"/>
					<input type="date" id="txt_bus_edate" name="txt_bus_edate"/>
					<label for="num_bill_year">계산서발행년도</label>
					<input type="number" id="num_bill_year" name="num_bill_year"  min="2000" max="3000" step="1" value="2024"/>
				</div>
			</div>
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
						<th style="min-width: 115px">발주처</th>
						<th>사업명</th>
						<th>
							<div>
								계약금액 <br /> <span class="vat_desc">VAT포함</span>
							</div>
						</th>
						<th>
							<div>
								계약금액 <br /> <span class="vat_desc">VAT별도</span>
							</div>
						</th>
						<th>
							<div>
								매출금액 <br /> <span class="vat_desc">VAT포함</span>
							</div>
						</th>
						<th>
							<div>
								매출금액 <br /> <span class="vat_desc">VAT별도</span>
							</div>
						</th>
						<th>계산서발행일</th>
						<th>매출구분</th>
						<th>구분</th>
						<th>계약번호</th>
						<th>사업기간</th>
						<th>업체명</th>
						<th>제품발주</th>
						<th>계약서발송</th>
						<th>수금현황</th>
						<th style="min-width: 165px">결제상태</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
		<!-- 컨텐츠 중간(리스트) 끝-->
		<!-- 컨텐츠 하단(전체수, 페이지네이션, 삭제버튼) 시작-->
		<div class="bottom_content">
			<div class="total_num">
				전체수 : <span id="list_total_num">1,000</span>건
			</div>
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
		<div class="modal_top">
			<b></b> <span class="modal_close"></span>
		</div>
		<div class="modal_main">
			<!-- 신규영업등록 모달 시작 -->
			<div id="new_business_form">
				<form action="">
					<div class="form_top">
						<!-- 신규영업등록 모달 왼쪽 시작 -->
						<div class="form_left">
							<div class="input_row">
								<div class="input_tit">
									<i>구분</i>
								</div>
								<div class="input_wrap">
									<div class="select_box">
										<select name="" id="userCate">
											<option value="구분">구분</option>
											<option value="구분">구분</option>
											<option value="구분">구분</option>
										</select>
										<span class="select_icon"></span>
									</div>
								</div>
							</div>
							<div class="input_row">
								<div class="input_tit">
									<i>수요처</i>
								</div>
								<div class="input_wrap">
									<input type="text" id="procName" name="procName" />
								</div>
							</div>
							<div class="input_row">
								<div class="input_tit">
									<i>발주처</i>
								</div>
								<div class="input_wrap">
									<input type="text" id="procName" name="procName" />
								</div>
							</div>
							<div class="input_row">
								<div class="input_tit">
									<i>담당자</i>
								</div>
								<div class="input_wrap">
									<input type="text" id="procName" name="procName" />
								</div>
							</div>
							<div class="input_row">
								<div class="input_tit">
									<i>사업기간</i>
								</div>
								<div class="input_wrap inputs_bundle">
									<input type="date" id="procName" name="procName" /> <span>~</span> <input type="date" id="procName" name="procName" />
								</div>
							</div>
							<div class="input_row">
								<div class="input_tit">
									<i>하자기간</i>
								</div>
								<div class="input_wrap inputs_bundle">
									<input type="date" id="procName" name="procName" /> <span>~</span> <input type="date" id="procName" name="procName" />
								</div>
							</div>
						</div>
						<!-- 신규영업등록 모달 왼쪽 끝 -->
						<!-- 신규영업등록 모달 오른쪽 시작 -->
						<div class="form_right">
							<div class="input_row">
								<div class="input_tit">
									<i>사업명</i>
								</div>
								<div class="input_wrap">
									<input type="text" id="procName" name="procName" />
								</div>
							</div>
							<!-- 신규영업 첨부파일 시작-->
							<div class="input_row file_row">
								<div class="input_tit">
									<i>첨부파일</i>
								</div>
								<div class="file_wrap">
									<div class="filebox">
										<div>
											<div class="btn_file active">
												<label for="businessFileInput">내PC</label> <input type="file" id="businessFileInput" multiple />
											</div>
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
																<th style="width: 65px">
																	<p>다운로드</p>
																</th>
															</tr>
														</thead>
														<tbody id="businessPreview"></tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- 신규영업 첨부파일 끝-->
						</div>
						<!-- 신규영업등록 모달 오른쪽 끝 -->
					</div>
					<!-- 신규영업 에디터 시작-->
					<div class="form_bottom">
						<div class="input_row editor_row">
							<div class="input_tit">
								<i>특이사항</i>
							</div>
							<div class="input_wrap">
								<div class="editor">
									<div class="editor_menu_wrap">
										<div class="editor_menu">
											<button type="button" class="btn-bold" id="businessEditor-btn-bold">B</button>
											<button type="button" class="btn-underline" id="businessEditor-btn-underline">U</button>
											<button type="button" class="btn-strike" id="businessEditor-btn-strike">S</button>
											<button type="button" class="btn-image" id="businessEditor-btn-image"></button>
											<input class="editor_img" id="businessEditor-img-selector" type="file" accept="image/*" style="display: none" />
										</div>
									</div>
									<div class="editor_input">
										<div id="businessEditor" contenteditable="true" class="editor_box"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- 신규영업 에디터 끝-->
				</form>
			</div>

			<!-- 신규영업등록 모달 끝 -->
			<!-- 신규계약등록 모달 시작 -->
			<div id="new_contract_form">
				<div>
					<div class="modal_top_content">
						<div class="contract_tabBtn_wrap">
							<div class="contract_tabBtn active" data-tabNum="1">계약정보</div>
							<div class="contract_tabBtn" data-tabNum="2">기성금</div>
							<div class="contract_tabBtn" data-tabNum="3">매입</div>
						</div>
						<div class="btn_wrap ">
							<button class="btn_add_form_back">
								<div>추가 돌아가기</div>
							</button>
						</div>
					</div>
					<!-- 계약정보 폼 시작 -->
					<form action="" class="contract_tabItem active" data-tabNum="1">
						<div class="form_top">
							<!-- 신규계약등록 모달 왼쪽 시작 -->
							<div class="form_left">
								<div class="input_row">
									<div class="input_tit">
										<i>구분</i>
									</div>
									<div class="input_wrap">
										<div class="select_box">
											<select name="" id="userCate">
												<option value="구분">구분</option>
												<option value="구분">구분</option>
												<option value="구분">구분</option>
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
										<input type="date" id="procName" name="procName" />
									</div>
								</div>
								<div class="input_row">
									<div class="input_tit">
										<i>수요처</i>
									</div>
									<div class="input_wrap">
										<input type="text" id="procName" name="procName" />
									</div>
								</div>
								<div class="input_row">
									<div class="input_tit">
										<i>발주처</i>
									</div>
									<div class="input_wrap">
										<input type="text" id="procName" name="procName" />
									</div>
								</div>
								<div class="input_row">
									<div class="input_tit">
										<i>담당자</i>
									</div>
									<div class="input_wrap">
										<input type="text" id="procName" name="procName" />
									</div>
								</div>
								<div class="input_row">
									<div class="input_tit">
										<i>사업기간</i>
									</div>
									<div class="input_wrap inputs_bundle">
										<input type="date" id="procName" name="procName" /> <span>~</span> <input type="date" id="procName" name="procName" />
									</div>
								</div>
								<div class="input_row">
									<div class="input_tit">
										<i>하자기간</i>
									</div>
									<div class="input_wrap inputs_bundle">
										<input type="date" id="procName" name="procName" /> <span>~</span> <input type="date" id="procName" name="procName" />
									</div>
								</div>
								<div class="input_row">
									<div class="input_tit">
										<i>발송제출</i>
									</div>
									<div class="input_wrap inputs_bundle">
										<div class="checks_bundle">
											<div>
												<i>계약서 발송</i> <input type="checkbox" name="" id="계약서" class="수금완" /> <label for="계약서"></label>
											</div>
											<div>
												<i>납품계 제출</i> <input type="checkbox" name="" id="납품계" class="수금완" /> <label for="납품계"></label>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- 신규계약등록 모달 왼쪽 끝 -->
							<!-- 신규계약등록 모달 오른쪽 시작 -->
							<div class="form_right">
								<div class="input_row">
									<div class="input_tit">
										<i>사업명</i>
									</div>
									<div class="input_wrap">
										<input type="text" id="procName" name="procName" />
									</div>
								</div>
								<div class="input_row">
									<div class="input_tit">
										<i>계약금</i>
									</div>
									<div class="input_wrap inputs_bundle">
										<input type="text" id="procName" name="procName" placeholder="VAT포함" /> <input type="text" id="procName" name="procName" placeholder="VAT별도" />
										<button type="button" class="btn_auto_calculate">
											<span class="icon_calculate" title="자동계산"></span>
										</button>
									</div>
								</div>
								<!-- 신규게약 첨부파일 시작-->
								<div class="input_row file_row">
									<div class="input_tit">
										<i>첨부파일</i>
									</div>
									<div class="file_wrap">
										<!-- 임시버튼 -->
										<div class="filebox">
											<div class="btn_file_wrap">
												<div class="btn_file active">
													<label for="contract1FileInput">내PC</label> <input type="file" id="contract1FileInput" multiple />
												</div>
												<div class="btn_file">
													<label for="contract2FileInput">내PC</label> <input type="file" id="contract2FileInput" multiple />
												</div>
												<div class="btn_file">
													<label for="contract3FileInput">내PC</label> <input type="file" id="contract3FileInput" multiple />
												</div>
											</div>
											<div class="preview_tab_wrap">
												<div class="btn_preview_tab_wrap">
													<span class="btn_preview_tab active">영업</span><span class="btn_preview_tab">계약</span><span class="btn_preview_tab">계약관리</span>
												</div>
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
															<tbody id="contract1Preview"></tbody>
														</table>
													</div>
													<div class="preview">
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
															<tbody id="contract2Preview"></tbody>
														</table>
													</div>
													<div class="preview">
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
															<tbody id="contract3Preview"></tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<!-- 신규게약 첨부파일 끝-->
							</div>
							<!-- 신규계약등록 모달 오른쪽 끝 -->
						</div>
						<div class="form_bottom">
							<!-- 신규게약 에디터 시작-->
							<div class="input_row editor_row">
								<div class="input_tit">
									<i>특이사항</i>
								</div>
								<div class="input_wrap">
									<div class="editor">
										<div class="editor_menu_wrap">
											<div class="editor_menu">
												<button type="button" class="btn-bold" id="contractEditorUser-btn-bold">B</button>
												<button type="button" class="btn-underline" id="contractEditorUser-btn-underline">U</button>
												<button type="button" class="btn-strike" id="contractEditorUser-btn-strike">S</button>
												<button type="button" class="btn-image" id="contractEditorUser-btn-image"></button>
												<input class="editor_img" id="contractEditorUser-img-selector" type="file" accept="image/*" style="display: none" />
											</div>
										</div>
										<div class="editor_input">
											<div id="contractEditorUser" contenteditable="true" class="editor_box"></div>
										</div>
									</div>
								</div>
							</div>
							<!-- 신규게약 에디터 끝-->
						</div>
						<!-- 관리자 작성폼 시작 -->
						<div class="modal_admin_content">
							<hr />
							<div class="input_desc">
								<div>※ 관리자만 작성 가능</div>
							</div>
							<div class="form_top">
								<!-- 관리자 작성폼 왼쪽 시작 -->
								<div class="form_left">
									<div class="input_row">
										<div class="input_tit">
											<i>계산서발행일</i>
										</div>
										<div class="input_wrap">
											<input type="date" id="procName" name="procName" />
										</div>
									</div>
								</div>
								<!-- 관리자 작성폼 왼쪽 왼쪽 끝 -->
								<!-- 관리자 작성폼 왼쪽 오른쪽 시작 -->
								<div class="form_right">
									<div class="input_row">
										<div class="input_tit">
											<i>수금현황</i>
										</div>
										<div class="input_wrap">
											<i>수금</i> <input type="checkbox" name="" id="수금완" class="수금완" /> <label for="수금완"></label>
										</div>
									</div>
								</div>
								<!-- 관리자 작성폼 왼쪽 모달 오른쪽 끝 -->
							</div>
							<div class="form_bottom">
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
							</div>
						</div>
						<!-- 관리자 작성폼 시작 -->
					</form>
					<!-- 계약정보 폼 끝 -->
					<!-- 기성금 폼 시작 -->
					<form action="" class="contract_tabItem" data-tabNum="2">
						<div class="form_top">
							<!-- 기성금관리 모달 왼쪽 시작 -->
							<div class="form_left">
								<div class="input_row">
									<div class="input_tit">
										<i>매출구분</i>
									</div>
									<div class="input_wrap">
										<div class="select_box">
											<select name="" id="userCate">
												<option value="구분">구분</option>
												<option value="구분">구분</option>
												<option value="구분">구분</option>
											</select>
											<span class="select_icon"></span>
										</div>
									</div>
								</div>
								<div class="input_row">
									<div class="input_tit">
										<i>계약금</i>
									</div>
									<div class="input_wrap inputs_bundle">
										<input type="text" id="procName" name="procName" placeholder="VAT포함" /> <input type="text" id="procName" name="procName" placeholder="VAT별도" />
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
										<i>계약일자</i>
									</div>
									<div class="input_wrap">
										<input type="date" id="procName" name="procName" />
									</div>
								</div>
							</div>
							<!-- 기성금관리 모달 오른쪽 끝 -->
						</div>
						<div class="form_bottom">
							<div class="input_row file_row">
								<div class="input_tit">
									<i>첨부파일</i>
								</div>
								<div class="file_wrap">
									<!-- 임시버튼 -->
									<div class="filebox">
										<div>
											<div class="btn_file active">
												<label for="compltedFileInput">내PC</label> <input type="file" id="compltedFileInput" multiple />
											</div>
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
														<tbody id="compltedPreview"></tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="form_btn_area" style="margin-bottom: 20px">
								<button type="button" class="btn_list_add">
									<div>추가</div>
								</button>
							</div>
							<hr style="margin-bottom: 20px" />
							<div class="list modal_list" id="compltedList">
								<table>
									<thead>
										<tr>
											<th style="width: 64px"><input type="checkbox" name="" id="compltedListCheckAll" class="check_all" /> <label for="compltedListCheckAll"></label></th>
											<th style="width: 64px">순번</th>
											<th>구분</th>
											<th>금액<br />
											<span class="vat_desc">(VAT포함)</span></th>
											<th>금액<br />
											<span class="vat_desc">(VAT별도)</span></th>
											<th style="width: 60px">첨부파일</th>
											<th>계산서요청일자</th>
											<th>삭제</th>
										</tr>
									</thead>
									<tbody>
										<tr class="list_row">
											<td>
												<input type="checkbox" name="" id="compltedListCheckBox1" class="compltedListCheckBox" /> <label for="compltedListCheckBox1"></label>
											</td>
											<td class="">1</td>
											<td class="">
												<a href="#">정보출력</a>
											</td>
											<td class="">d</td>
											<td class="">d</td>
											<td class="">
												<span class="icon_input" data-file="is"></span>
											</td>
											<td class="">d</td>
											<td class="">
												<button type="button" class="btn_modalList_del"></button>
											</td>
										</tr>
										<tr class="list_row">
											<td>
												<input type="checkbox" name="" id="compltedListCheckBox2" class="compltedListCheckBox" /> <label for="compltedListCheckBox2"></label>
											</td>
											<td class="">1</td>
											<td class="">
												<a href="#">정보출력</a>
											</td>
											<td class="">d</td>
											<td class="">d</td>
											<td class="">
												<span class="icon_input" data-file="not"></span>
											</td>
											<td class="">d</td>
											<td class="">
												<button type="button" class="btn_modalList_del"></button>
											</td>
										</tr>
										<tr class="list_row">
											<td>
												<input type="checkbox" name="" id="compltedListCheckBox3" class="compltedListCheckBox" /> <label for="compltedListCheckBox3"></label>
											</td>
											<td class="">1</td>
											<td class="">
												<a href="#">정보출력</a>
											</td>
											<td class="">d</td>
											<td class="">d</td>
											<td class="">
												<span class="icon_input" data-file="is"></span>
											</td>
											<td class="">d</td>
											<td class="">
												<button type="button" class="btn_modalList_del"></button>
											</td>
										</tr>
										<tr class="list_row">
											<td>
												<input type="checkbox" name="" id="compltedListCheckBox4" class="compltedListCheckBox" /> <label for="compltedListCheckBox4"></label>
											</td>
											<td class="">1</td>
											<td class="">
												<a href="#">정보출력</a>
											</td>
											<td class="">d</td>
											<td class="">d</td>
											<td class="">
												<span class="icon_input" data-file="is"></span>
											</td>
											<td class="">d</td>
											<td class="">
												<button type="button" class="btn_modalList_del"></button>
											</td>
										</tr>
										<tr class="list_row">
											<td>
												<input type="checkbox" name="" id="compltedListCheckBox5" class="compltedListCheckBox" /> <label for=""></label>
											</td>
											<td class="">1</td>
											<td class="">
												<a href="#">정보출력</a>
											</td>
											<td class="">d</td>
											<td class="">d</td>
											<td class="">
												<span class="icon_input" data-file="is"></span>
											</td>
											<td class="">d</td>
											<td class="">
												<button type="button" class="btn_modalList_del"></button>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</form>
					<!-- 기성금 폼 끝 -->
					<!-- 매입 폼 시작 -->
					<form action="" class="contract_tabItem" data-tabNum="3">
						<div class="purchase_wrap">
							<div class="input_row">
								<div class="input_tit">
									<i>계약금</i>
								</div>
								<div class="input_wrap inputs_bundle">
									<input type="text" id="procName" name="procName" placeholder="VAT포함" /> <input type="text" id="procName" name="procName" placeholder="VAT별도" />
									<button type="button" class="btn_auto_calculate">
										<span class="icon_calculate" title="자동계산"></span>
									</button>
								</div>
							</div>
						</div>
						<hr />
						<div class="btn_modal_formTab">
							<div class="active">물품구매</div>
							<div>설치공사하도급</div>
							<hr />
						</div>
						<hr style="margin-bottom: 20px" />
						<!-- 물품구매 폼 시작 -->
						<div class="modal_formTab active">
							<div class="form_top">
								<!-- 매입 모달 왼쪽 시작 -->
								<div class="form_left">
									<div class="input_row">
										<div class="input_tit">
											<i>매출구분</i>
										</div>
										<div class="input_wrap">
											<div class="select_box">
												<select name="" id="userCate">
													<option value="구분">구분</option>
													<option value="구분">구분</option>
													<option value="구분">구분</option>
												</select>
												<span class="select_icon"></span>
											</div>
										</div>
									</div>
									<div class="input_row">
										<div class="input_tit">
											<i>구매금액</i>
										</div>
										<div class="input_wrap inputs_bundle">
											<input type="text" id="procName" name="procName" placeholder="VAT포함" /> <input type="text" id="procName" name="procName" placeholder="VAT별도" />
											<button type="button" class="btn_auto_calculate">
												<span class="icon_calculate" title="자동계산"></span>
											</button>
										</div>
									</div>
									<div class="input_row">
										<div class="input_tit">
											<i>정산계산</i>
										</div>
										<div class="input_wrap inputs_bundle">
											<div class="checks_bundle">
												<div>
													<i>수수료 정산서</i> <input type="checkbox" name="" id="수수료" class="수수료" /> <label for="수수료"></label>
												</div>
												<div>
													<i>계산서 수령</i> <input type="checkbox" name="" id="계산서" class="계산서" /> <label for="계산서"></label>
												</div>
											</div>
										</div>
									</div>
								</div>
								<!-- 매입 모달 왼쪽 끝 -->
								<!-- 매입 모달 오른쪽 시작 -->
								<div class="form_right">
									<div class="input_row">
										<div class="input_tit">
											<i>공급사</i>
										</div>
										<div class="input_wrap">
											<input type="text" id="procName" name="procName" />
										</div>
									</div>
									<div class="input_row">
										<div class="input_tit">
											<i>수량</i>
										</div>
										<div class="input_wrap">
											<input type="text" id="procName" name="procName" />
										</div>
									</div>
								</div>
								<!-- 매입 모달 오른쪽 끝 -->
							</div>
							<div class="form_bottom">
								<div class="input_row file_row">
									<div class="input_tit">
										<i>첨부파일</i>
									</div>
									<div class="file_wrap">
										<div class="filebox">
											<div>
												<div class="btn_file active">
													<label for="purchase1FileInput">내PC</label> <input type="file" id="purchase1FileInput" multiple />
												</div>
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
															<tbody id="purchase1Preview"></tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="form_btn_area" style="margin-bottom: 20px">
									<button type="button" class="btn_list_add">
										<div>추가</div>
									</button>
									<button type="button" class="btn_list_edit">
										<div>수정</div>
									</button>
								</div>
								<hr style="margin-bottom: 20px" />
								<div class="list modal_list">
									<table>
										<thead>
											<tr>
												<th style="width: 64px"><input type="checkbox" name="" id="userInfoListCheckAll" class="check_all" /> <label for="userInfoListCheckAll"></label></th>
												<th style="width: 64px">순번</th>
												<th>구분</th>
												<th>금액<br />
												<span class="vat_desc">(VAT포함)</span></th>
												<th>금액<br />
												<span class="vat_desc">(VAT별도)</span></th>
												<th style="width: 60px">첨부파일</th>
												<th>계산서요청일자</th>
												<th>삭제</th>
											</tr>
										</thead>
										<tbody>
											<!-- <tr class="list_row">
                                                        <td>
                                                            <input type="checkbox" name="" id="" class="check_box" />
                                                            <label for=""></label>
                                                        </td>
                                                        <td class=""></td>
                                                        <td class=""></td>
                                                        <td class=""></td>
                                                        <td class=""></td>
                                                        <td class="">
                                                            <span class="icon_input"></span>
                                                        </td>
                                                        <td class=""></td>
                                                    </tr> -->
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<!-- 물품구매 폼 끝 -->
						<!-- 설치공사하도급 폼 시작 -->
						<div class="modal_formTab">
							<div class="form_top">
								<!-- 매입 모달 왼쪽 시작 -->
								<div class="form_left">
									<div class="input_row">
										<div class="input_tit">
											<i>매출구분</i>
										</div>
										<div class="input_wrap">
											<div class="select_box">
												<select name="" id="userCate">
													<option value="구분">구분</option>
													<option value="구분">구분</option>
													<option value="구분">구분</option>
												</select>
												<span class="select_icon"></span>
											</div>
										</div>
									</div>
									<div class="input_row">
										<div class="input_tit">
											<i>구매금액</i>
										</div>
										<div class="input_wrap inputs_bundle">
											<input type="text" id="procName" name="procName" placeholder="VAT포함" /> <input type="text" id="procName" name="procName" placeholder="VAT별도" />
											<button type="button" class="btn_auto_calculate">
												<span class="icon_calculate" title="자동계산"></span>
											</button>
										</div>
									</div>
								</div>
								<!-- 매입 모달 왼쪽 끝 -->
								<!-- 매입 모달 오른쪽 시작 -->
								<div class="form_right">
									<div class="input_row">
										<div class="input_tit">
											<i>업체명</i>
										</div>
										<div class="input_wrap">
											<input type="text" id="procName" name="procName" />
										</div>
									</div>
								</div>
								<!-- 매입 모달 오른쪽 끝 -->
							</div>
							<div class="form_bottom">
								<div class="input_row file_row">
									<div class="input_tit">
										<i>첨부파일</i>
									</div>
									<div class="file_wrap">
										<div class="filebox">
											<div>
												<div class="btn_file active">
													<label for="purchase2FileInput">내PC</label> <input type="file" id="purchase2FileInput" multiple />
												</div>
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
															<tbody id="purchase2Preview"></tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="form_btn_area" style="margin-bottom: 20px">
									<button type="button" class="btn_list_add">
										<div>추가</div>
									</button>
								</div>
								<hr style="margin-bottom: 20px" />
								<div class="list modal_list" id="installationList">
									<table>
										<thead>
											<tr>
												<th style="width: 64px"><input type="checkbox" name="" id="installationListCheckAll" class="check_all" /> <label for="installationListCheckAll"></label></th>
												<th style="width: 64px">순번</th>
												<th>구분</th>
												<th>금액<br />
												<span class="vat_desc">(VAT포함)</span></th>
												<th>금액<br />
												<span class="vat_desc">(VAT별도)</span></th>
												<th style="width: 60px">첨부파일</th>
												<th>계산서요청일자</th>
												<th>삭제</th>
											</tr>
										</thead>
										<tbody>
											<tr class="list_row">
												<td>
													<input type="checkbox" name="" id="installationListCheckBox1" class="installationListCheckBox" /> <label for="installationListCheckBox1"></label>
												</td>
												<td class="">1</td>
												<td class="">
													<a href="#">정보출력</a>
												</td>
												<td class="">d</td>
												<td class="">d</td>
												<td class="">
													<span class="icon_input" data-file="is"></span>
												</td>
												<td class="">d</td>
												<td class="">
													<button type="button" class="btn_modalList_del"></button>
												</td>
											</tr>
											<tr class="list_row">
												<td>
													<input type="checkbox" name="" id="installationListCheckBox2" class="installationListCheckBox" /> <label for="installationListCheckBox2"></label>
												</td>
												<td class="">1</td>
												<td class="">
													<a href="#">정보출력</a>
												</td>
												<td class="">d</td>
												<td class="">d</td>
												<td class="">
													<span class="icon_input" data-file="is"></span>
												</td>
												<td class="">d</td>
												<td class="">
													<button type="button" class="btn_modalList_del"></button>
												</td>
											</tr>
											<tr class="list_row">
												<td>
													<input type="checkbox" name="" id="installationListCheckBox3" class="installationListCheckBox" /> <label for="installationListCheckBox3"></label>
												</td>
												<td class="">1</td>
												<td class="">
													<a href="#">정보출력</a>
												</td>
												<td class="">d</td>
												<td class="">d</td>
												<td class="">
													<span class="icon_input" data-file="is"></span>
												</td>
												<td class="">d</td>
												<td class="">
													<button type="button" class="btn_modalList_del"></button>
												</td>
											</tr>
											<tr class="list_row">
												<td>
													<input type="checkbox" name="" id="installationListCheckBox4" class="installationListCheckBox" /> <label for="installationListCheckBox4"></label>
												</td>
												<td class="">1</td>
												<td class="">
													<a href="#">정보출력</a>
												</td>
												<td class="">d</td>
												<td class="">d</td>
												<td class="">
													<span class="icon_input" data-file="is"></span>
												</td>
												<td class="">d</td>
												<td class="">
													<button type="button" class="btn_modalList_del"></button>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<!-- 설치공사하도급 폼 끝 -->
					</form>
					<!-- 매입 폼 끝 -->
				</div>
			</div>
			<!-- 신규계약등록 모달 끝 -->
		</div>

		<hr />
		<div class="modal_bottom">
			<div>
				<button type="button" id="btn_request_I">
					<div>계산서 요청</div>
				</button>
				<button type="button" id="btn_issue_I">
					<div>계산서 발행</div>
				</button>
				<button type="button" id="btn_cancel_I">
					<div>계산서 취소</div>
				</button>
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