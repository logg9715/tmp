"use district";

$(document).ready(function () {
	const top_content = $(".top_content");
    const list = $(".list");
    const mainList = $("#mainList");
    const bottom_content = $(".bottom_content");
    const modal = $(".modal");
    const CONTRACT_PAGE_LIST = 30;
    
	initReadyFunc();
	
	function initReadyFunc() {
		listRevenueInfo(1, 1);
	}
	
	function listRevenueInfo(pageIndex, isRefresh = 0) {
		let rootTag = $("#form_search_revenue");
		let formData = rootTag.serialize();
    	formData += "&isRefresh=" + isRefresh;
    	formData += "&pageIndex=" + pageIndex;
    	formData += "&listCount=" + CONTRACT_PAGE_LIST;
    	
    	let resultJson = axCallFunction("listRevenueInfo", formData, false);
    	console.log("resultJson=", resultJson);
        if (!resultJson) return;
    	
        // 새로고침일 경우 전체 수량과 페이지 번호 재설정
    	if (isRefresh == 1) {
    		bottom_content.find("#list_total_num").text(numberWithCommas(resultJson.resultCount));
    		pagingStart(resultJson.resultCount, CONTRACT_PAGE_LIST, 1, "#revenueManagementListPaging", listRevenueInfo);
    	}
    	
    	mainList.find("tbody").children().remove();
    	let resultData = '';
    	let index = 1;
    	let confirmLevel = '';
    	for(let keyValue of resultJson.resultData) {
			resultData = '<td class="list_num">' + (index + (pageIndex - 1) * CONTRACT_PAGE_LIST) + '</td>';
			resultData += '<td class="list_section">' + (keyValue.tsi_contract_date || '') + '</td>';
			resultData += '<td class="list_">' + (keyValue.tsi_demand_name || '') + '</td>';
			resultData += '<td class="list_orderer">' + (keyValue.tsi_order_name || '') + '</td>';
			resultData += '<td class="list_Bname" style="width: 360px">';
			resultData += '<a href="#" class="btn_info_change contract_info" sales_level=' + keyValue.tsi_confirm_level + ' sales_code=' + keyValue.tsi_code + '>' + keyValue.tsi_bus_name + '</a>';
			resultData += '</td>';
			resultData += '<td class="list_">' + (keyValue.tsi_contract_price || 0) + '</td>';
			resultData += '<td class="list_">' + (keyValue.tsi_contract_vat || 0) + '</td>';
			resultData += '<td class="list_">' + (keyValue.tpi_price || 0) + '</td>';
			resultData += '<td class="list_">' + (keyValue.tpi_price_vat || 0)+ '</td>';
			resultData += '<td class="list_">' + (keyValue.tpi_response_date || '')+ '</td>';
			resultData += '<td class="list_">' + (keyValue.tpi_sales_type || '')+ '</td>';
			resultData += '<td class="list_">' + (keyValue.tst_name || '')+ '</td>';
			resultData += '<td class="list_">' + (keyValue.tsi_contract_no || '')+ '</td>';
			resultData += '<td class="list_term_C">';
			resultData += '<div class="date_wrap">';
			resultData += '<p>' + keyValue.tsi_bus_starttm + '</p>';
			// resultData += '<span>~</span>';
			resultData += '<p>' + keyValue.tsi_bus_endtm + '</p>';
			resultData += '</div>';
			resultData += '</td>';			
			resultData += '<td class="list_">' + (keyValue.tpc_name || '') + '</td>';
			resultData += '<td class="list_"></td>';
			resultData += '<td class="list_">' + (keyValue.tsi_send_contract == 1?'발송':'미발송') + '</td>';
			resultData += '<td class="list_">' + (keyValue.tpi_collection == 1?'수금':'미수금') + '</td>';
			resultData += '<td class="list_">' + (keyValue.tsi_confirm_level >= 2 ?'계약후':'계약전') + '</td>';
			resultData += '<td class="list_"></td>'
			resultData = '<tr class="list_row">' + resultData + '</tr>';
			mainList.find("tbody").append(resultData);
			
			$('.mainListCheckBox').last().on('click', function() {
				checkCallbackFunc('mainList');
			});
			index++;
    	}
    	
    }
    
    // -------------------------------------------------------------------------
    // 리스트 번호 매기기 , 전체 리스트 수 // 리스트 체크박스 id,for 부여
    // -------------------------------------------------------------------------

    // listNumberHandler();
    // listChangeHandler();

      // -------------------------------------------------------------------------
  // 리스트
  // -------------------------------------------------------------------------

  // 상태, 결제상태(보류)
  const status_value = list.find("#select_status_value");
  status_value.change(function () {
    var stautsGroup = list.find(".list_status");
    stautsGroup.parent("tr").hide();
    stautsGroup.each(function (index, item) {
      listNumberHandler();
      if (status_value.val() == $(item).data("status")) {
        $(item).parent("tr").show();
        console.log($(item));
      } else if (status_value.val() == "전체") {
        stautsGroup.parent("tr").show();
      }
      listNumberHandler();
    });
  });


  // -------------------------------------------------------------------------
  // 리스트 선택 항목 삭제
  // -------------------------------------------------------------------------
  bottom_content.find("#btn_list_del").click(function () {
    var checkedList = list.find(".check_box:checked");
    if(checkedList.length === 0){
       alert('선택된 리스트가 없습니다.')
    }else{
        action_popup.confirm("리스트를 삭제하시겠습니까?", function (res) {
          if (res) {
            action_popup.alert("");
            // $(".modal_confirm , .dimLayer").hide();
            console.log(checkedList);
            checkedList.each(function () {
              checkedList.parents("tr").remove();
            });
          }
        });
    }
  });

});
