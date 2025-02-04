"use district";

$(document).ready(function () {

    const top_content = $(".top_content");
    const list = $(".list");
    const bottom_content = $(".bottom_content");
    const modal = $(".modal");

    //메뉴 active
    $(".main_nav > ul > li").removeClass("active");
    $(".main_nav > ul > li").eq(1).addClass("active");

    // 모든 li 요소에서 active 클래스 제거
    const main_2dep_menu = $(".main_2dep li");
    main_2dep_menu.removeClass("active");
    // 클릭한 링크의 부모 li에 active 클래스 추가
    $(".main_nav > ul > li.active li").eq(0).addClass("active");

    // -------------------------------------------------------------------------
    // 리스트
    // -------------------------------------------------------------------------

    initReadyFunc();

    /*
     *  최초 페이지가 시작할 때 동작
     */
    function initReadyFunc() {
        listInventoryInfo();
    }

    function initInventoryInfoForm() {
        let rootTag = $("#form_inventory_info");
        rootTag.find('input[type="text"]').val("");
        rootTag.find('input[type="password"]').val("");
        modal.find("#btn_info_edit").removeAttr("attr_inventory_code");
        modal.find("#btn_info_edit").removeAttr("sel_tr");
    }

    function listInventoryInfo() {
        list.find("tbody").children().remove();

        let resultJson = axCallFunction("listInventoryInfo", "", false);
        if (resultJson == undefined) {
            changePopupMessage("로그인을 먼저 하여 주십시요", modal);
            window.location.href = "login";
            return;
        } else if (resultJson.length == 0) {
            bottom_content.find("#list_total_num").text(resultJson.length);
            return;
        }
        bottom_content.find("#list_total_num").text(resultJson.length);
        let resultData = "";
        let index = 1;
        for (let keyValue of resultJson) {
            resultData = '<td class="list_num">' + index + "</td>";
            resultData += '<td class="list_inven_Pname"><a href="#none" class="btn_info_change inventory_info" inventory_code=' + keyValue.tii_code + ">" + keyValue.tii_name + "</a></td>";
            resultData += '<td class="list_warehouse_T">' + keyValue.tii_purchase_company + "</td>";
            resultData += '<td class="list_warehouse_T">' + keyValue.tii_manager + "</td>";
            resultData += '<td class="list_warehouse_T">' + keyValue.tii_tel + "</td>";
            resultData += '<td class="list_delivery_T">' + (keyValue.purchaseCount || 0) + "</td>";
            resultData += '<td class="list_currentStock">' + (keyValue.salesCount || 0) + "</td>";
            resultData += '<td class="list_currentStock">' + ((keyValue.purchaseCount || 0) - (keyValue.salesCount || 0)) + "</td>";
            resultData += '<td class="list_detailPage"><a href="inventory_sub?inventory_code=' + keyValue.tii_code + '"><span class="icon_movePage"></span><p>바로가기</p></a></td>';
            resultData = '<tr class="list_row">' + resultData + "</tr>";
            list.find("tbody").append(resultData);

            index++;
        }
    }

    //모달창 열기(기존)
    $(document).on("click", ".btn_info_change", function () {
        let clickedBtnClass = $(this).attr("class");
        modal.find(".modal_main > div").hide();
        modal.show();
        modal.find(".modal_bottom").show();
        modal.find("#btn_info_save").hide();
        modal.find("#btn_info_edit, #btn_info_Del").show();
        if (clickedBtnClass === "btn_info_change inventory_info") {
            let inventoryCode = $(this).attr("inventory_code");
            let sel_tr = $(this).closest("tr").index();
            detailInventoryInfo(inventoryCode, sel_tr);

            modal.find(".modal_top > b").text("재고관리");
            modal.find("#new_inventory_form").show();
        } else if (clickedBtnClass === "btn_info_change inventory_tmsc_info") {
            modal.find(".modal_top > b").text("재고상세관리");
            modal.find("#new_inventory_tmsc_form").show();
        }
    });

    function detailInventoryInfo(inventoryCode, sel_tr) {
        if (inventoryCode <= 0) {
            alert("데이터를 선택하여 주십시요");
            return;
        }
        let sendData = { inventoryCode: inventoryCode };
        let resultJson = axCallFunction("detailInventoryInfo", sendData, false);
        if (!resultJson) return;

        let rootTag = $("#form_inventory_info");

        rootTag.find("#text_product_name").val(resultJson.tii_name || "");
        rootTag.find("#text_purchase_company").val(resultJson.tii_purchase_company || "");
        rootTag.find("#text_manager").val(resultJson.tii_manager || "");
        rootTag.find("#text_tel").val(resultJson.tii_tel || "");
        rootTag.find("#text_url").val(resultJson.tii_url || "");
        modal.find("#btn_info_edit").attr("attr_inventory_code", inventoryCode);
        modal.find("#btn_info_edit").attr("sel_tr", sel_tr);
    }

    modal.find("#btn_info_save, #btn_info_edit").click(function () {
        let rootTag = $("#form_inventory_info");
        let selId = $(this).attr("id");
        let inventoryCode = 0;
        if (selId == "btn_info_edit") {
            inventoryCode = $(this).attr("attr_inventory_code");
            if (inventoryCode <= 0) {
                alert("데이터를 선택하여 주십시요");
                return;
            }
        }
        if (rootTag.find("#text_product_name").val() == "") {
            alert("이름을 입력하여 주십시요");
            return;
        }
        /*
    	let storeCount = /^\d*$/.test(rootTag.find("#text_store_count").val());
    	if(!storeCount) {
        	alert("입고 수량에는 숫자만 입력 가능합니다.");
        	return;
        }
    	if(storeCount < 0) {
    		alert("입고 수량은 0보다 작을 수 없습니다.");
        	return;
    	}
    	*/

        let formData = rootTag.serialize();
        formData += "&inventoryCode=" + inventoryCode;

        action_popup.confirm("제품 정보를 저장하시겠습니까?", function (res) {
            let resultJson = axCallFunction("saveInventoryInfo", formData, false);
            if (resultJson <= 0) {
                if (resultJson == -99) {
                    changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                    window.location.href = "login";
                } else changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                return;
            } else {
                changePopupMessage("처리가 완료되었습니다.", modal);
                if (inventoryCode > 0) {
                    let sel_tr = modal.find("#btn_info_edit").attr("sel_tr");

                    if (sel_tr) {
                        list.find("tbody tr").eq(sel_tr).find("td:eq(1) a").text(rootTag.find("#text_product_name").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(2)").text(rootTag.find("#text_purchase_company").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(3)").text(rootTag.find("#text_manager").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(4)").text(rootTag.find("#text_tel").val());
                        // list.find("tbody tr").eq(sel_tr).find("td:eq(8)").text(rootTag.find("#text_url").val());
                    }
                } else listInventoryInfo();
                initInventoryInfoForm();
            }
        });
    });

    // 선택 항목 삭제
    bottom_content.find("#btn_list_del").click(function () {
        var checkedList = list.find(".check_box:checked");
        if (checkedList.length === 0) {
            alert("선택된 리스트가 없습니다.");
        } else {
            action_popup.confirm("리스트를 삭제하시겠습니까?", function (res) {
                if (res) {
                    action_popup.alert("");
                    checkedList.each(function () {
                        checkedList.parents("tr").remove();
                    });
                }
            });
        }
    });

    //열린 모달창(기존) 정보삭제
    modal.find("#btn_info_Del").click(function () {
        action_popup.confirm("정보를 삭제하시겠습니까?", function (res) {
            if (res) {
                let inventoryCode = $("#btn_info_edit").attr("attr_inventory_code");
                let sendData = { inventoryCode: inventoryCode };
                let resultJson = axCallFunction("removeInventoryInfo", sendData, false);
                if (resultJson <= 0) {
                    if (resultJson == -99) {
                        changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                        window.location.href = "login";
                    } else changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                    return;
                } else {
                    changePopupMessage("처리가 완료되었습니다.", modal);
                    initInventoryInfoForm();
                    listInventoryInfo();
                }
            }
        });
    });
    // -------------------------------------------------------------------------
    //  모달창
    // -------------------------------------------------------------------------

    //모달창 열기(신규)
    top_content.find(".btn_modal_show").click(function () {
        let clickedBtnId = $(this).attr("id");

        modal.find(".modal_main > div").hide();
        modal.show();
        modal.find(".modal_bottom , #btn_info_save").show();
        modal.find("#btn_info_edit , #btn_info_Del").hide();
        if (clickedBtnId === "btn_inventory_N") {
            initInventoryInfoForm();
            modal.find(".modal_top > b").text("재고관리");
            modal.find("#new_inventory_form").show();
        } else if (clickedBtnId === "btn_inventory_tmsc_N") {
            modal.find(".modal_top > b").text("재고상세관리");
            modal.find("#new_inventory_tmsc_form").show();
        }
    });

    //열린 모달창(기존) 리스트삭제
    modal.find(".btn_modalList_del").click(function () {
        var result = confirm("리스트를 삭제하시겠습니까?");
        if (result) {
            $(this).parents("tr").remove();
        }
    });
});

// -------------------------------------------------------------------------
// 에디터 (재고상세관리)
// -------------------------------------------------------------------------
// editorHandler("inventoryEditor")
