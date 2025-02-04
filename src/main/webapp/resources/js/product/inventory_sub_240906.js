"use district";

$(document).ready(function () {
    const top_content = $(".top_content");
    const list = $(".list");
    const bottom_content = $(".bottom_content");
    const modal = $(".modal");
    
    if($inventoryCode > 0) {
    	listInventorySubInfo();
    }
    
    top_content.find("#searchData").keydown(function (key) {
        if (key.keyCode == 13) {
            event.preventDefault();
            listInventorySubInfo();
        }
    });
    
    top_content.find("#btn_search").click(function() {
    	listInventorySubInfo();
    });    
    
    function initInventorySubInfoForm() {
    	let rootTag = $("#form_inventory_sub");
    	rootTag.find('input[type="text"]').val("");
    	rootTag.find("#date_event_day").val(getCurrentDate());
    	rootTag.find("#sel_inventory_type").prop('selectedIndex', 0);
    	rootTag.find("#inventoryEditor").html('');
    	rootTag.find("#text_count").val('0');
    	rootTag.find("#text_price").val('0');
    	rootTag.find("#text_total_price").val('0');
    	modal.find("#btn_info_edit").removeAttr("attr_user_code");  
        modal.find("#btn_info_edit").removeAttr("sel_tr");
    }
    
    function listInventorySubInfo() {
    	list.find("tbody").children().remove();

    	let searchType = top_content.find("#searchType").val();
    	let searchData = top_content.find("#searchData").val();
    	let sendData = {inventoryCode:$inventoryCode,searchType:searchType, searchData:searchData};
    	let resultJson = axCallFunction("listInventorySubInfo", sendData, false);        
        if (resultJson == undefined) {
        	changePopupMessage("로그인을 먼저 하여 주십시요", modal);
            window.location.href = "login";
            return;
        } else if (resultJson.length == 0) {
        	bottom_content.find("#list_total_num").text(resultJson.length);
        	return;
        }          	
        bottom_content.find("#list_total_num").text(resultJson.length);
    	let resultData = '';
    	let index = 1;
    	for(let keyValue of resultJson) {
			resultData = '<td class="list_num">' + index + '</td>';
			resultData += '<td class="list_InOutStatus"><a href="#none" class="btn_info_change inventory_sub_info" inventory_subcode=' + keyValue.tis_code + '>' + keyValue.typeName + '</a></td>';
			resultData += '<td class="">' + keyValue.tis_used_type + '</td>';
			resultData += '<td class="">' + keyValue.tis_event_date + '</td>';
			resultData += '<td class="">' + keyValue.tis_count + '</td>';
			resultData += '<td class="">' + keyValue.tis_price + '</td>';
			resultData += '<td class="">' + keyValue.tis_total_price + '</td>';
			resultData += '<td class="">' + keyValue.tis_recipient + '</td>';
			resultData = '<tr class="list_row">' + resultData + '</tr>';
			list.find("tbody").append(resultData);
			
			index++;
    	}    	
    }
    
    $(document).on("click", ".btn_info_change", function() {
    	let clickedBtnClass = $(this).attr("class");
        modal.find(".modal_main > div").hide();
        modal.show();
        modal.find(".modal_bottom").show();
        modal.find("#btn_info_save").hide();
        modal.find("#btn_info_edit, #btn_info_Del").show();
        
        let inventorySubCode = $(this).attr("inventory_subcode");
    	let sel_tr = $(this).closest("tr").index();
    	detailInventorySubInfo(inventorySubCode, sel_tr);

        modal.find(".modal_top > b").text("재고상세관리");
        modal.find("#new_inventory_sub_form").show();
    });
    
    function detailInventorySubInfo(inventorySubCode, sel_tr) {
    	if(inventorySubCode <= 0) {
    		alert("데이터를 선택하여 주십시요");
    		return;
    	}
    	let sendData = { inventorySubCode: inventorySubCode };
    	let resultJson = axCallFunction("detailInventorySubInfo", sendData, false);
    	if(!resultJson) return;      
    	
    	let rootTag = $("#form_inventory_sub");

    	rootTag.find("#sel_inventory_type").val(resultJson.tis_type).prop("selected", true);
        let idx = rootTag.find("#sel_inventory_type option").index(rootTag.find("#sel_inventory_type option:selected"));
        if (idx < 0) rootTag.find("#sel_inventory_type option").eq(0).prop("selected", true);  
        
        rootTag.find("#text_event_type").val(resultJson.tis_used_type || "");
        rootTag.find("#date_event_day").val(resultJson.tis_event_date || "");
        rootTag.find("#text_manager").val(resultJson.tii_manager || "");
        rootTag.find("#text_count").val(resultJson.tis_count || "");
        rootTag.find("#text_price").val(resultJson.tis_price || "");
        rootTag.find("#text_total_price").val(resultJson.tis_total_price || "");
        rootTag.find("#text_recipient").val(resultJson.tis_recipient || "");
        rootTag.find("#inventoryEditor").html(resultJson.tis_etc || "");
        modal.find("#btn_info_edit").attr("attr_inventory_subcode", inventorySubCode);  
        modal.find("#btn_info_edit").attr("sel_tr", sel_tr);
    }    
    
    modal.find("#btn_info_save, #btn_info_edit").click(function() {
    	let rootTag = $("#form_inventory_sub");
    	let selId = $(this).attr("id");
    	let inventorySubCode = 0;
    	if(selId == "btn_info_edit") {
    		inventorySubCode = $(this).attr("attr_inventory_subcode");
    		if(inventorySubCode <= 0) {
    			alert("데이터를 선택하여 주십시요");
        		return;
    		}
    	}
    	if(rootTag.find("#sel_inventory_type").val() <= 0) {
    		alert("상태를 선택하여 주십시요");
    		return;
    	}
    	if(rootTag.find("#text_event_type").val() == '') {
    		alert("용도를 입력하여 주십시요");
    		return;
    	}
    	let storeCount = /^\d*$/.test(rootTag.find("#text_count").val());
    	if(!storeCount) {
        	alert("수량에는 숫자만 입력 가능합니다.");
        	return;
        }
    	storeCount = rootTag.find("#text_count").val();
    	if(storeCount < 0) {
    		alert("입고 수량은 0보다 작을 수 없습니다.");
        	return;
    	}
    	
    	if(rootTag.find("#sel_inventory_type").val() == 2) {
    		let sendData = {inventoryCode:$inventoryCode};
    		let resultJson = axCallFunction("inventoryCountCheck", sendData, false);
    		console.log("resultJson.purchaseCount=", resultJson.purchaseCount, resultJson.salesCount, storeCount);
            if (!resultJson || ((resultJson.purchaseCount || 0)-(resultJson.salesCount || 0)) < storeCount) {
            	alert("현재 재고 수량을 초과하였습니다.");
            	return;
            }            
    	}
    	
    	let price = /^\d*$/.test(rootTag.find("#text_price").val());
    	if(!price) {
        	alert("단가에는 숫자만 입력 가능합니다.");
        	return;
        }
    	let totalPrice = /^\d*$/.test(rootTag.find("#text_total_price").val());
    	if(!totalPrice) {
    		alert("총계에는 숫자만 입력 가능합니다.");
    		return;
    	}
    	
    	let formData = rootTag.serialize();
    	formData += "&inventoryCode=" + $inventoryCode;
    	formData += "&inventorySubCode=" + inventorySubCode;
    	formData += "&inventorySubEditor=" + rootTag.find("#inventoryEditor").html();
    	
    	action_popup.confirm("제품 상세 정보를 저장하시겠습니까?", function (res) {
    		let resultJson = axCallFunction("saveInventorySubInfo", formData, false);
            if (resultJson <= 0) {
            	if(resultJson == -99) {
            		changePopupMessage("로그인을 먼저 하여 주십시요", modal);
            		window.location.href = "login";
            	} else changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
            	return;
            } else {
            	changePopupMessage("처리가 완료되었습니다.", modal);
            	if(inventorySubCode > 0) {
            		let sel_tr = modal.find("#btn_info_edit").attr("sel_tr");

            		if(sel_tr) {
            			list.find("tbody tr").eq(sel_tr).find("td:eq(1) a").text(rootTag.find("#sel_inventory_type option:selected").text());
            			list.find("tbody tr").eq(sel_tr).find("td:eq(2)").text(rootTag.find("#text_event_type").val());
            			list.find("tbody tr").eq(sel_tr).find("td:eq(3)").text(rootTag.find("#date_event_day").val());
            			list.find("tbody tr").eq(sel_tr).find("td:eq(4)").text(rootTag.find("#text_count").val());
            			list.find("tbody tr").eq(sel_tr).find("td:eq(5)").text(rootTag.find("#text_price").val());
            			list.find("tbody tr").eq(sel_tr).find("td:eq(6)").text(rootTag.find("#text_total_price").val());
            			list.find("tbody tr").eq(sel_tr).find("td:eq(7)").text(rootTag.find("#text_recipient").val());
            		}
            	} else listInventorySubInfo();            
            	initInventorySubInfoForm();
            }
    	});
    }); 
    
  //열린 모달창(기존) 정보삭제
    modal.find("#btn_info_Del").click(function () {
        action_popup.confirm("정보를 삭제하시겠습니까?", function (res) {
            if (res) {
            	let inventorySubCode = $("#btn_info_edit").attr("attr_inventory_subcode");
            	let sendData = {inventorySubCode:inventorySubCode};
            	let resultJson = axCallFunction("removeInventorySubInfo", sendData, false);
                if (resultJson <= 0) {
                	if(resultJson == -99) {
                		changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                		window.location.href = "login";
                	} else changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                	return;
                } else {
                	changePopupMessage("처리가 완료되었습니다.", modal);
                	initInventorySubInfoForm();
                	listInventorySubInfo();            
                }
            }
        });
    });
    
    top_content.find(".btn_modal_show").click(function () {
        let clickedBtnId = $(this).attr("id");

        modal.find(".modal_main > div").hide();
        modal.show();
        modal.find(".modal_bottom , #btn_info_save").show();
        modal.find("#btn_info_edit , #btn_info_Del").hide();

        initInventorySubInfoForm();
        modal.find(".modal_top > b").text("재고상세관리");
        modal.find("#new_inventory_sub_form").show();
    });
    
    editorHandler("inventoryEditor");
});


// -------------------------------------------------------------------------
// 에디터 (재고상세관리)
// -------------------------------------------------------------------------
