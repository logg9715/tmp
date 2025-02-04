"use district";
// let purchaseFileInfo = [];
$(document).ready(function () {
    const top_content = $(".top_content");
    const list = $(".list");
    const bottom_content = $(".bottom_content");
    const modal = $(".modal");
    const CONTRACT_PAGE_LIST = 30;
    const SALES_LEVEL_NAME = ["영업", "계약전", "계약관리", "매출관리"];

    // let readyMoneyInfo = [];

    // -------------------------------------------------------------------------
    // 리스트
    // -------------------------------------------------------------------------
    initReadyFunc();

    /*
     *  최초 페이지가 시작할 때 동작
     */
    function initReadyFunc() {
        //체크박스 선택 동작(개별)
        // checkboxHandler("mainList");

        //    	checkboxHandler("compltedList");
        // checkboxHandler("workInfoList");

        modal.find("#salesUserCate").children("option:not(:first)").remove();
        modal.find("#contractUserCate").children("option:not(:first)").remove();

        let resultJson = axCallFunction("listInitType", "", false);
        if (!resultJson) return;

        for (let keyValue of resultJson.salesType) {
            modal.find("#salesUserCate").append('<option value="' + keyValue.tst_code + '">' + keyValue.tst_name + "</option>");
            modal.find("#contractUserCate").append('<option value="' + keyValue.tst_code + '">' + keyValue.tst_name + "</option>");
        }
        for (let keyValue of resultJson.productCompany) {
            modal.find("#salesUserCate").append('<option value="' + keyValue.tst_code + '">' + keyValue.tst_name + "</option>");
            modal.find("#contractUserCate").append('<option value="' + keyValue.tst_code + '">' + keyValue.tst_name + "</option>");
        }
        /*
    	for (let keyValue of resultJson.productCompany) {
    		modal.find("#salesUserCate").append('<option value="' + keyValue.tst_code + '">' + keyValue.tst_name + "</option>");
    		modal.find("#contractUserCate").append('<option value="' + keyValue.tst_code + '">' + keyValue.tst_name + "</option>");
    	}
    	*/

        listContractInfo(1, 1);
    }

    top_content.find(".search_icon").click(function () {
        listContractInfo(1, 1);
    });

    top_content.find("#searchCateData").keydown(function (key) {
        if (key.keyCode == 13) {
            event.preventDefault();
            listContractInfo(1, 1);
        }
    });
    /*
     *  등록된 계약 정보를 읽어오는 부분
     */
    function listContractInfo(pageIndex, isRefresh = 0) {
        let searchType = top_content.find("#searchCate").val();
        let searchData = top_content.find("#searchCateData").val();
        let orderBy = 0;
        let sendData = { searchType: searchType, searchData: searchData, orderBy: orderBy, isRefresh: isRefresh, pageIndex: pageIndex, listCount: CONTRACT_PAGE_LIST };
        let resultJson = axCallFunction("listContractInfo", sendData, false);
        if (!resultJson) return;

        // 새로고침일 경우 전체 수량과 페이지 번호 재설정
        if (isRefresh == 1) {
            bottom_content.find("#list_total_num").text(numberWithCommas(resultJson.contractDataCount));
            // pagingStart(resultJson.contractDataCount, CONTRACT_PAGE_LIST, 1, "#contractManagementListPaging", listContractInfo);
        }

        list.find("#list_contract_info").children().remove();
        let resultData = "";
        let index = 1;
        let confirmLevel = "";
        for (let keyValue of resultJson.contractData) {
            resultData = '<td class="list_check">';
            resultData += '<input type="checkbox" name="mainListCheckBox' + index + '" id="mainListCheckBox' + index + '" class="mainListCheckBox checkbox" check_name="mainList"/> <label for="mainListCheckBox' + index + '"></label>';
            resultData += "</td>";
            resultData += '<td class="list_num">' + (index + (pageIndex - 1) * CONTRACT_PAGE_LIST) + "</td>";
            resultData += '<td class="list_section">' + keyValue.tst_name + "</td>";
            resultData += '<td class="list_">' + keyValue.tsi_demand_name + "</td>";
            resultData += '<td class="list_orderer">' + keyValue.tsi_order_name + "</td>";
            resultData += '<td class="list_Bname" style="width: 360px">';
            resultData += '<a href="#" class="btn_info_change contract_info" confirm_level=' + keyValue.tsi_confirm_level + " sales_code=" + keyValue.tsi_code + ">" + keyValue.tsi_bus_name + "</a>";
            resultData += "</td>";
            resultData += '<td class="list_term_C">';
            resultData += '<div class="date_wrap">';
            resultData += "<p>" + keyValue.tsi_bus_starttm;
            // resultData += '<span>~</span>';
            resultData += "<p>" + keyValue.tsi_bus_endtm + "</p>";
            resultData += "</div>";
            resultData += "</td>";

            resultData += '<td class="list_term_C">';
            resultData += '<div class="date_wrap">';
            resultData += "<p>" + keyValue.tsi_as_starttm;
            // resultData += '<span>~</span>';
            resultData += "<p>" + keyValue.tsi_as_endtm + "</p>";
            resultData += "</div>";
            resultData += "</td>";

            resultData += '<td class="list_">' + (keyValue.tsi_contract_date || "") + "</td>";
            resultData += '<td class="list_">' + numberWithCommas(keyValue.tsi_contract_price || 0) + "</td>";
            resultData += '<td class="list_">' + numberWithCommas(keyValue.tsi_contract_vat || 0) + "</td>";
            if (gLoginLevel >= MANAGERLEVEL) {
                if (keyValue.tsi_confirm_level > 0) resultData += '<td class="list_" data-purchase="o"><span class="purchase_icon purchase_info" sales_code=' + keyValue.tsi_code + "></span></td>";
                else resultData += '<td class="list_" data-purchase="o"></td>';
            }
            resultData += '<td class="list_manager">' + keyValue.tmi_name + "</td>";
            resultData += '<td class="list_">' + keyValue.regDate + "</td>";
            confirmLevel = SALES_LEVEL_NAME[keyValue.tsi_confirm_level || 0];
            /*
			if(keyValue.tsi_confirm_level == 1) confirmLevel = '계약전';
			else if(keyValue.tsi_confirm_level == 2) confirmLevel = '계약관리';
			else if(keyValue.tsi_confirm_level == 3) confirmLevel = '매출관리';
			else confirmLevel = '영업';
			*/
            resultData += '<td class="list_status" data-status="' + confirmLevel + '">';
            resultData += "<div><span class='icon'></span></div>";
            resultData += "</td>";
            /*
			resultData += '<td class="list_status_P" data-status_P="보고전">';
			resultData += '<div>';
			resultData += '<span class="status_P_icon"></span>';
			resultData += '<p>보고전</p>';
			resultData += '</div>';
			resultData += '</td>';
			*/
            resultData = '<tr class="list_row">' + resultData + "</tr>";
            list.find("#list_contract_info").append(resultData);

            // $(".mainListCheckBox")
            //     .last()
            //     .on("click", function () {
            //         checkCallbackFunc("mainList");
            //     });
            index++;
        }
    }

    function initPurchaseProductInfo() {
        let rootTag = modal.find("#productModal");
        rootTag.find('input[type="text"]').val("");
        rootTag.find("#productCompanyInfo").prop("selectedIndex", 0);
        rootTag.find("#productName").prop("selectedIndex", 0);
        // rootTag.find("#productFileInput").val("");
        // rootTag.find("#productList").children().remove();
    }

    function initPurchaseWorkInfo() {
        let rootTag = modal.find("#workModal");
        rootTag.find('input[type="text"]').val("");
        rootTag.find("#workCompanyInfo").prop("selectedIndex", 0);
        rootTag.find("#workName").prop("selectedIndex", 0);
        // rootTag.find("#workInfoList").children().remove();
    }

    // 매입 처리
    $(document).on("click", ".purchase_info", function () {
        let salesCode = $(this).attr("sales_code") || 0;
        if (salesCode <= 0) {
            alert("계약정보를 선택하여 주십시요");
            return;
        }

        // let contractCode = $(this).attr("contract_code") || 0;

        $("#productList").children().remove();
        $("#workInfoList").children().remove();

        /*
        $("#productCost").val("");
        $("#productCostVat").val("");
        $("#productRate").val("");
        */
        initPurchaseProductInfo();
        initPurchaseWorkInfo();
        $("#purchasePreview").children().remove();

        $("#purchase_info_save").attr("tr_index", $(this).closest("tr").index());
        // $("#purchase_info_save").attr("contract_code", contractCode);
        $("#purchase_info_save").attr("sales_code", salesCode);

        let resultJson = axCallFunction("purchaseItemInfo", "", false);

        $("#productCompanyInfo").children("option:not(:first)").remove();
        if (resultJson.productCompanyInfo) {
            for (let keyValue of resultJson.productCompanyInfo) {
                $("#productCompanyInfo").append('<option value="' + keyValue.tpc_code + '">' + keyValue.tpc_name + "</option>");
            }
        }
        $("#productName").children("option:not(:first)").remove();
        if (resultJson.productNameInfo) {
            for (let keyValue of resultJson.productNameInfo) {
                $("#productName").append('<option value="' + keyValue.tpi_code + '">' + keyValue.tpi_name + "</option>");
            }
        }
        $("#workCompanyInfo").children("option:not(:first)").remove();
        if (resultJson.workCompanyInfo) {
            for (let keyValue of resultJson.workCompanyInfo) {
                $("#workCompanyInfo").append('<option value="' + keyValue.twc_code + '">' + keyValue.twc_name + "</option>");
            }
        }
        $("#workName").children("option:not(:first)").remove();
        if (resultJson.workNameInfo) {
            for (let keyValue of resultJson.workNameInfo) {
                $("#workName").append('<option value="' + keyValue.twi_code + '">' + keyValue.twi_name + "</option>");
            }
        }

        loadProductDetailInfo(salesCode);
        loadWorkDetailInfo(salesCode);
        loadContractFileInfo(salesCode);

        let clickedBtnClass = $(this).attr("class");
        // console.log(clickedBtnClass);
        initpurchaseTabBtn();
        modal.find(".modal_main > div").hide();
        modal.show();
        modal.find(".modal_wrap").css("width", "1200px");
        modal.find(".modal_wrap > .modal_bottom").hide();
        //
        modal.find(".modal_top > b").text("신규 매입");
        modal.find("#new_Purchase_form, #formPurchaseInfo").show();
        // modal.find(".modal_bottom").show();
        modal.find("#btn_info_save").hide();
        modal.find("#btn_info_edit, #btn_info_del, .bottom_left ").show();
    });

    // 매입정보 저장
    $("#purchase_info_save").click(function () {
        let salesCode = $(this).attr("sales_code") || 0;
        if (salesCode <= 0) {
            alert("계약정보를 선택하여 주십시요");
            return;
        }

        // let contractCode = $(this).attr("contract_code");
        let rootFormTag = $("#formPurchaseInfo");
        let purchaseProductInfo = [];
        $("#productList tr").each(function () {
            let productInfoItem = {};
            productInfoItem.productCompany = $(this).find("td:eq(1)").text();
            productInfoItem.productName = $(this).find("td:eq(2)").text();
            productInfoItem.productCount = $(this).find("td:eq(3)").text() || 0;
            productInfoItem.productPrice = $(this).find("td:eq(4)").text();
            productInfoItem.productPriceVat = $(this).find("td:eq(5)").text();
            productInfoItem.productRate = $(this).find("td:eq(6)").text();
            productInfoItem.productMemo = $(this).find("td:eq(7) span").attr("memo");
            purchaseProductInfo.push(productInfoItem);
        });

        let purchaseWorkInfo = [];
        $("#workInfoList tr").each(function () {
            let workInfoItem = {};
            workInfoItem.workCompany = $(this).find("td:eq(1)").text();
            workInfoItem.workName = $(this).find("td:eq(2)").text();
            workInfoItem.workCount = $(this).find("td:eq(3)").text() || 0;
            workInfoItem.workPrice = $(this).find("td:eq(4)").text();
            workInfoItem.workPriceVat = $(this).find("td:eq(5)").text();
            workInfoItem.workRate = $(this).find("td:eq(6)").text();
            workInfoItem.workMemo = $(this).find("td:eq(7) span").attr("memo");
            purchaseWorkInfo.push(workInfoItem);
        });

        let trIndex = $(this).attr("tr_index");
        action_popup.confirm("입력하신 내용을 등록하시겠습니까?", function (res) {
            if (res) {
                let formData = new FormData(rootFormTag[0]);
                formData.set("productInfo", JSON.stringify(purchaseProductInfo));
                formData.set("workInfo", JSON.stringify(purchaseWorkInfo));
                formData.set("salesCode", salesCode);
                // formData.set("contractCode", contractCode);
                formData.set("imgFolderName", "phuchase");
                formData.set("delFiles", rootFormTag.find("#purchasePreview").attr("del_file") || "");
                // console.log("delFile=", rootFormTag.find("#purchasePreview").attr("del_file"));

                let resultJson = axFormdataCallFunction("savePurchaseInfo", formData, false);
                if (resultJson <= 0) {
                    if (resultJson == -99) {
                        changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                        window.location.href = "login";
                        return;
                    } else if (resultJson == -3) {
                        changePopupMessage("물품구매(오류), 설치공사하도급(오류) 발생하였습니다.", modal);
                    } else if (resultJson == -2) {
                        changePopupMessage("물품구매(정상), 설치공사하도급(오류) 발생하였습니다.", modal);
                    } else if (resultJson == -1) {
                        changePopupMessage("물품구매(오류), 설치공사하도급(정상) 발생하였습니다.", modal);
                    }
                } else {
                    $("#list_contract_info tr").eq(trIndex).find("td:eq(11) span").attr("contract_code", resultJson);
                    changePopupMessage("처리가 완료되었습니다.", modal);
                }
            } else {
                changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
            }
        });
    });

    function loadContractDetailInfo() {
        let contractCode = $("#purchase_info_save").attr("contract_code");
        let sendData = { contractCode: contractCode };
        let resultJson = axCallFunction("contractDetailInfo", sendData, false);
        if (!resultJson) return;

        $("#productCost").val(resultJson.tci_product_cost || "");
        $("#productCostVat").val(resultJson.tci_product_vat || "");
        $("#productRate").val(resultJson.tci_contract_rate || "");
    }

    function loadProductDetailInfo(salesCode) {
        // let salesCode = $("#purchase_info_save").attr("contract_code");
        let sendData = { salesCode: salesCode };
        let resultJson = axCallFunction("productInfo", sendData, false);
        if (!resultJson) return;

        // console.log("resultJson=", resultJson);
        $("#productList").children().remove();
        let resultData = "";
        for (let keyValue of resultJson) {
            let resultData = '<tr class="list_row">';
            resultData += '<td class="">' + ($("#productList tr").length + 1) + "</td>";
            resultData += '<td class="">' + (keyValue.tpc_name || "") + "</td>";
            resultData += '<td class=""><a href="#" company_code=' + keyValue.tpc_code + ' class="product_detail_info" product_namecode=' + (keyValue.tpi_code || 0) + " product_code=" + (keyValue.tpp_code || 0) + ">" + (keyValue.tpi_name || "") + "</a></td>";
            resultData += '<td class="">' + (keyValue.tpp_count || 0) + "</td>";
            resultData += '<td class="">' + (keyValue.tpp_price || "") + "</td>";
            resultData += '<td class="">' + (keyValue.tpp_price_vat || "") + "</td>";
            resultData += '<td class="">' + (keyValue.tpp_rate || "") + "</td>";
            resultData += '<td class=""><span class="icon" memo_code="' + (keyValue.tpp_memo === "" ? 0 : 1) + '" memo="' + keyValue.tpp_memo + '"></span></td>';
            resultData += '<td class=""><button type="button" class="btn_modalList_del"></button></td>';
            resultData += "</tr>";
            $("#productList").append(resultData);
        }
    }

    function loadContractFileInfo(salesCode) {
        $("#purchasePreview").children().remove();

        // let contractCode = $("#purchase_info_save").attr("contract_code");
        let sendData = { salesCode: salesCode };
        let resultJson = axCallFunction("contractFileInfo", sendData, false);
        if (!resultJson) return;

        // console.log("resultJson=", resultJson);
        let index = 0;
        let fileData = "";
        for (let keyValue of resultJson) {
            fileData = '<tr id="purchase_file_index_' + index + '" file_code=' + keyValue.tfi_code + ">";
            fileData += '<td><button type="button" data-index="purchase_file_index_' + index + '" file_code=' + keyValue.tfi_code + ' class="file_remove" file_tagid="purchase"></button></td>';
            fileData += '<td><div class="file_name"><span class="none"></span><p>' + keyValue.tfi_res_name + "</p></div></td>";
            fileData += '<td><a href="#none" onclick="location.href=\'' + downloadPath + "/salesDownload?resFileName=" + keyValue.tfi_res_name + "&fileName=" + keyValue.tfi_file_name + '&imageFolder=phuchase\'" class="file_download"></a></td></tr>';
            $("#purchasePreview").append(fileData);
            index++;
        }
    }

    $(document).on("click", ".product_detail_info", function () {
        let rootTag = $("#formPurchaseInfo");

        rootTag.find("#productCompanyInfo").val($(this).attr("company_code")).prop("selected", true);
        let idx = rootTag.find("#productCompanyInfo option").index(rootTag.find("#productCompanyInfo option:selected"));
        if (idx < 0) rootTag.find("#productCompanyInfo option").eq(0).prop("selected", true);
        rootTag.find("#productCompanyOther").val($(this).closest("tr").find("td:eq(1)").text() || "");
        rootTag.find("#productPrice").val($(this).closest("tr").find("td:eq(4)").text() || "");
        rootTag.find("#productPriceVat").val($(this).closest("tr").find("td:eq(5)").text() || "");
        rootTag.find("#productRate").val($(this).closest("tr").find("td:eq(6)").text() || "");
        rootTag.find("#productCount").val($(this).closest("tr").find("td:eq(3)").text() || "");

        rootTag.find("#productName").val($(this).attr("product_namecode")).prop("selected", true);
        idx = rootTag.find("#productName option").index(rootTag.find("#productName option:selected"));
        if (idx < 0) rootTag.find("#productName option").eq(0).prop("selected", true);
        rootTag.find("#productNameOther").val($(this).closest("tr").find("td:eq(2)").text() || "");
        rootTag.find("#productMemo").val($(this).closest("tr").find("td:eq(7) span").attr("memo") || "");
        rootTag.find("#btn_edit_product").attr("tr_index", $(this).closest("tr").index());
    });

    $(document).on("click", ".work_detail_info", function () {
        let rootTag = $("#formPurchaseInfo");

        rootTag.find("#workCompanyInfo").val($(this).attr("company_code")).prop("selected", true);
        let idx = rootTag.find("#workCompanyInfo option").index(rootTag.find("#workCompanyInfo option:selected"));
        if (idx < 0) rootTag.find("#workCompanyInfo option").eq(0).prop("selected", true);
        rootTag.find("#workCompanyOther").val($(this).closest("tr").find("td:eq(1)").text() || "");
        rootTag.find("#workPrice").val($(this).closest("tr").find("td:eq(4)").text() || "");
        rootTag.find("#workPriceVat").val($(this).closest("tr").find("td:eq(5)").text() || "");
        rootTag.find("#workRate").val($(this).closest("tr").find("td:eq(6)").text() || "");
        rootTag.find("#workCount").val($(this).closest("tr").find("td:eq(3)").text() || "");

        rootTag.find("#workName").val($(this).attr("work_namecode")).prop("selected", true);
        idx = rootTag.find("#workName option").index(rootTag.find("#workName option:selected"));
        if (idx < 0) rootTag.find("#workName option").eq(0).prop("selected", true);
        rootTag.find("#workNameOther").val($(this).closest("tr").find("td:eq(2)").text() || "");
        rootTag.find("#workMemo").val($(this).closest("tr").find("td:eq(7) span").attr("memo") || "");
        rootTag.find("#btn_edit_work").attr("tr_index", $(this).closest("tr").index());
    });
    /*
    $(document).on("click", ".product_detail_info", function () {
        let productCode = $(this).attr("product_code");
        let sendData = { productCode: productCode };
        let resultJson = axCallFunction("productDetailInfo", sendData, false);
        if (!resultJson) return;
        if (!resultJson.detail_productdata) return;

        let rootTag = $("#formPurchaseInfo");
        console.log("resultJson.detail_productdata=", resultJson.detail_productdata);

        rootTag.find("#productCompanyInfo").val(resultJson.detail_productdata.tpp_tpccode).prop("selected", true);
        let idx = rootTag.find("#productCompanyInfo option").index(rootTag.find("#productCompanyInfo option:selected"));
        if (idx < 0) rootTag.find("#productCompanyInfo option").eq(0).prop("selected", true);
        rootTag.find("#productCompanyOther").val($('#productCompanyInfo option[value="' + resultJson.detail_productdata.tpp_tpccode + '"]').text() || "");
        rootTag.find("#productPrice").val(resultJson.detail_productdata.tpp_price || "");
        rootTag.find("#productPriceVat").val(resultJson.detail_productdata.tpp_price_vat || "");
        rootTag.find("#productCount").val(resultJson.detail_productdata.tpp_count || 0);
        rootTag.find("#productName").val(resultJson.detail_productdata.tpp_tpicode).prop("selected", true);
        idx = rootTag.find("#productName option").index(rootTag.find("#productName option:selected"));
        if (idx < 0) rootTag.find("#productName option").eq(0).prop("selected", true);
        rootTag.find("#productNameOther").val($('#productNameOther option[value="' + resultJson.detail_productdata.tpp_tpicode + '"]').text() || "");
        rootTag.find("#productMemo").val(resultJson.detail_productdata.tpp_memo || "");
    });
   
    
    $(document).on("click", ".work_detail_info", function () {
    	let workCode = $(this).attr("work_code");
    	let sendData = { workCode: workCode };
    	let resultJson = axCallFunction("workDetailInfo", sendData, false);
    	if (!resultJson) return;
    	if (!resultJson.detail_workdata) return;
    	
    	let rootTag = $("#workModal");
    	
    	rootTag.find("#workCompanyInfo").val(resultJson.detail_workdata.tiw_twccode).prop("selected", true);
    	let idx = rootTag.find("#workCompanyInfo option").index(rootTag.find("#workCompanyInfo option:selected"));
    	if (idx < 0) rootTag.find("#workCompanyInfo option").eq(0).prop("selected", true);
    	rootTag.find("#workCompanyOther").val($('#workCompanyInfo option[value="' + keyValue.detail_workdata.tiw_twccode + '"]').text() || "");
    	rootTag.find("#workPrice").val(keyValue.detail_workdata.tiw_price || "");
    	rootTag.find("#workPriceVat").val(keyValue.detail_workdata.tiw_price_vat || "");
    	rootTag.find("#workCount").val(keyValue.detail_workdata.tiw_count || 0);
    	rootTag.find("#workName").val(resultJson.detail_workdata.tiw_twicode).prop("selected", true);
    	idx = rootTag.find("#workName option").index(rootTag.find("#workName option:selected"));
    	if (idx < 0) rootTag.find("#workName option").eq(0).prop("selected", true);
    	rootTag.find("#workNameOther").val($('#workNameOther option[value="' + keyValue.detail_workdata.tiw_twicode + '"]').text() || "");
    	rootTag.find("#workMemo").val(keyValue.detail_workdata.tiw_memo || "");
    });
     */
    function loadWorkDetailInfo(salesCode) {
        // let sa = $("#purchase_info_save").attr("contract_code");
        let sendData = { salesCode: salesCode };
        let resultJson = axCallFunction("workInfo", sendData, false);
        if (!resultJson) return;

        $("#workInfoList").children().remove();
        let resultData = "";
        for (let keyValue of resultJson) {
            let resultData = '<tr class="list_row">';
            resultData += '<td class="">' + ($("#workInfoList tr").length + 1) + "</td>";
            resultData += '<td class="">' + (keyValue.twc_name || "") + "</td>";
            resultData += '<td class=""><a href="#" company_code=' + keyValue.twc_code + ' class="work_detail_info" work_namecode=' + (keyValue.twi_code || 0) + " work_code=" + (keyValue.tiw_code || 0) + ">" + keyValue.twi_name + "</a></td>";
            resultData += '<td class="">' + (keyValue.tiw_count || "") + "</td>";
            resultData += '<td class="">' + (keyValue.tiw_price || "") + "</td>";
            resultData += '<td class="">' + (keyValue.tiw_price_vat || "") + "</td>";
            resultData += '<td class="">' + (keyValue.tiw_rate || "") + "</td>";
            resultData += '<td class=""><span class="icon" memo_code="' + (keyValue.tiw_memo === "" ? 0 : 1) + '" memo="' + keyValue.tiw_memo + '"></span></td>';
            resultData += '<td class=""><button type="button" class="btn_modalList_del"></button></td>';
            resultData += "</tr>";
            $("#workInfoList").append(resultData);
        }
    }

    $("#btn_add_product, #btn_edit_product").click(function () {
        let clickId = $(this).attr("id");
        let memoVal = $("#productMemo").val().trim();
        let saveType = 1;
        let trIndex = $(this).attr("tr_index") || -1;
        if (clickId == "btn_edit_product") {
            saveType = 2;
            if (trIndex < 0) {
                alert("수정 할 데이터를 선택하여 주십시요");
                return;
            }
        }
        let rootTag = $("#productModal");
        if (rootTag.find("#productNameOther").val() == "") {
            alert("제품명을 입력 또는 선택하여 주십시요");
            return;
        }
        // let selIndex = rootTag.find("#payContractType").prop("selectedIndex");
        // let selVal = rootTag.find("#payContractType").val();
        if (saveType != 2) {
            let resultData = '<tr class="list_row">';
            resultData += '<td class="">' + (rootTag.find("#productList tr").length + 1) + "</td>";
            resultData += '<td class="">' + rootTag.find("#productCompanyOther").val() + "</td>";
            resultData += '<td class="">';
            resultData += '<a href="#" class="product_detail_info" product_code=0 company_code=' + rootTag.find("#productCompanyInfo").val() + " product_namecode=" + rootTag.find("#productName").val() + ">" + rootTag.find("#productNameOther").val() + "</a>";
            resultData += "</td>";
            resultData += '<td class="">' + rootTag.find("#productCount").val() + "</td>";
            resultData += '<td class="">' + rootTag.find("#productPrice").val() + "</td>";
            resultData += '<td class="">' + rootTag.find("#productPriceVat").val() + "</td>";
            resultData += '<td class="">' + rootTag.find("#productRate").val() + "</td>";
            // resultData += '<td class="">' + rootTag.find("#productMemo").val() + "</td>";
            resultData += '<td class=""><span class="icon" memo_code="' + (memoVal === "" ? 0 : 1) + '" memo="' + memoVal + '"></span></td>';
            resultData += '<td class="">';
            resultData += '<button type="button" class="btn_modalList_del"></button>';
            resultData += "</td>";
            resultData += "</tr>";

            rootTag.find("#productList").append(resultData);
        } else {
            rootTag.find("#productList tr").eq(trIndex).find("td:eq(1)").text(rootTag.find("#productCompanyOther").val());
            rootTag.find("#productList tr").eq(trIndex).find("td:eq(2) a").text(rootTag.find("#productNameOther").val());
            rootTag.find("#productList tr").eq(trIndex).find("td:eq(2) a").attr("company_code", rootTag.find("#productCompanyInfo").val());
            rootTag.find("#productList tr").eq(trIndex).find("td:eq(2) a").attr("product_namecode", rootTag.find("#productName").val());
            rootTag.find("#productList tr").eq(trIndex).find("td:eq(3)").text(rootTag.find("#productCount").val());
            rootTag.find("#productList tr").eq(trIndex).find("td:eq(4)").text(rootTag.find("#productPrice").val());
            rootTag.find("#productList tr").eq(trIndex).find("td:eq(5)").text(rootTag.find("#productPriceVat").val());
            rootTag.find("#productList tr").eq(trIndex).find("td:eq(6)").text(rootTag.find("#productRate").val());
            //            rootTag.find("#productList tr").eq(trIndex).find("td:eq(6)").text(rootTag.find("#productMemo").val());
            rootTag.find("#productList tr").eq(trIndex).find("td:eq(7) span").attr("memo", memoVal);
            rootTag
                .find("#productList tr")
                .eq(trIndex)
                .find("td:eq(7) span")
                .attr("memo_code", memoVal === "" ? 0 : 1);
        }
        /*
        addOptionInExist("productCompanyInfo", rootTag.find("#productCompanyOther").val());
        addOptionInExist("productName", rootTag.find("#productNameOther").val());
        */
        initPurchaseProductInfo();
    });

    function addOptionInExist(selectTagName, optionVal) {
        let selectTag = $("#" + selectTagName);
        let optionCheck =
            selectTag.find("option").filter(function () {
                return $(this).text === optionVal;
            }).length > 0;

        if (!optionCheck) selectTag.append('<option value="-1">' + optionVal + "</option>");
    }

    $("#btn_add_work, #btn_edit_work").click(function () {
        let clickId = $(this).attr("id");
        let memoVal = $("#workMemo").val().trim();
        let saveType = 1;
        let trIndex = $(this).attr("tr_index") || -1;
        if (clickId == "btn_edit_work") {
            saveType = 2;
            if (trIndex < 0) {
                alert("수정 할 데이터를 선택하여 주십시요");
                return;
            }
        }
        let rootTag = $("#workModal");
        if (rootTag.find("#workNameOther").val() == "") {
            alert("공사명을 입력하여 주십시요");
            return;
        }
        // let selIndex = rootTag.find("#payContractType").prop("selectedIndex");
        // let selVal = rootTag.find("#payContractType").val();
        if (saveType != 2) {
            let resultData = '<tr class="list_row">';
            resultData += '<td class="">' + (rootTag.find("#workInfoList tr").length + 1) + "</td>";
            resultData += '<td class="">' + rootTag.find("#workCompanyOther").val() + "</td>";
            resultData += '<td class="">';
            resultData += '<a href="#" class="work_detail_info" work_code=0 company_code=' + rootTag.find("#workCompanyInfo").val() + " work_namecode=" + rootTag.find("#workName").val() + ">" + rootTag.find("#workNameOther").val() + "</a>";
            resultData += "</td>";
            resultData += '<td class="">' + rootTag.find("#workCount").val() + "</td>";
            resultData += '<td class="">' + rootTag.find("#workPrice").val() + "</td>";
            resultData += '<td class="">' + rootTag.find("#workPriceVat").val() + "</td>";
            resultData += '<td class="">' + rootTag.find("#workRate").val() + "</td>";
            // resultData += '<td class="">' + rootTag.find("#workMemo").val() + "</td>";
            resultData += '<td class=""><span class="icon" memo_code="' + (memoVal === "" ? 0 : 1) + '" memo="' + memoVal + '"></span></td>';
            resultData += '<td class="">';
            resultData += '<button type="button" class="btn_modalList_del"></button>';
            resultData += "</td>";
            resultData += "</tr>";

            rootTag.find("#workInfoList").append(resultData);
        } else {
            rootTag.find("#workInfoList tr").eq(trIndex).find("td:eq(1)").text(rootTag.find("#workCompanyOther").val());
            rootTag.find("#workInfoList tr").eq(trIndex).find("td:eq(2) a").text(rootTag.find("#workNameOther").val());
            rootTag.find("#workInfoList tr").eq(trIndex).find("td:eq(2) a").attr("company_code", rootTag.find("#workCompanyInfo").val());
            rootTag.find("#workInfoList tr").eq(trIndex).find("td:eq(2) a").attr("work_namecode", rootTag.find("#workName").val());
            rootTag.find("#workInfoList tr").eq(trIndex).find("td:eq(3)").text(rootTag.find("#workCount").val());
            rootTag.find("#workInfoList tr").eq(trIndex).find("td:eq(4)").text(rootTag.find("#workPrice").val());
            rootTag.find("#workInfoList tr").eq(trIndex).find("td:eq(5)").text(rootTag.find("#workPriceVat").val());
            rootTag.find("#workInfoList tr").eq(trIndex).find("td:eq(6)").text(rootTag.find("#workRate").val());
            // rootTag.find("#workInfoList tr").eq(trIndex).find("td:eq(6)").text(rootTag.find("#workMemo").val());
            rootTag.find("#workInfoList tr").eq(trIndex).find("td:eq(7) span").attr("memo", memoVal);
            rootTag
                .find("#workInfoList tr")
                .eq(trIndex)
                .find("td:eq(7) span")
                .attr("memo_code", memoVal === "" ? 0 : 1);
        }
        /*
    	addOptionInExist("workCompanyInfo", rootTag.find("#workCompanyOther").val());
        addOptionInExist("workName", rootTag.find("#workNameOther").val());
        */
        initPurchaseWorkInfo();
    });

    $("#productCompanyInfo").change(function () {
        if ($(this).val() == 0) $("#productCompanyOther").val("");
        else $("#productCompanyOther").val($(this).find("option:selected").text());
    });

    $("#productName").change(function () {
        if ($(this).val() == 0) $("#productNameOther").val("");
        else $("#productNameOther").val($(this).find("option:selected").text());
    });

    $("#workCompanyInfo").change(function () {
        if ($(this).val() == 0) $("#workCompanyOther").val("");
        else $("#workCompanyOther").val($(this).find("option:selected").text());
    });

    $("#workName").change(function () {
        if ($(this).val() == 0) $("#workNameOther").val("");
        else $("#workNameOther").val($(this).find("option:selected").text());
    });

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

    // 선택 항목 삭제
    bottom_content.find("#btn_list_del").click(function () {
        var checkedList = list.find(".check_box:checked");
        if (checkedList.length === 0) {
            alert("선택된 리스트가 없습니다.");
        } else {
            action_popup.confirm("리스트를 삭제하시겠습니까?", function (res) {
                if (res) {
                    action_popup.alert("");
                    console.log(checkedList);
                    checkedList.each(function () {
                        checkedList.parents("tr").remove();
                    });
                }
            });
        }
    });

    // 매출관리 총 합계
    // listInclud_TotalSumValue();

    // -------------------------------------------------------------------------
    //  계약 모달
    // -------------------------------------------------------------------------
    // 계약 모달에서 관리자폼 나오게
    $("#contract_admin").click(function () {
        $("#modalContractAdmin").show();
    });
    /*
    $("#bill_info_save").click(function () {
        action_popup.confirm("관리자 계약관리 정보를 저장하시겠습니까?", function (res) {
            if (res) {
                changePopupMessage("처리가 완료되었습니다.");
            }
        });
    });
    */
    $("#formAdmin_close").click(function () {
        $("#modalContractAdmin").hide();
    });

    //탭메뉴(계약정보,기성금)
    var contract_tabBtn = modal.find(".contract_tabBtn");
    var contract_tabItem = modal.find(".contract_tabItem");
    contract_tabBtn.click(function () {
        let index = contract_tabBtn.index($(this));
        contract_tabBtn.removeClass("active");
        contract_tabItem.hide();
        $(this).addClass("active");
        contract_tabItem.eq(index).show();
        $(".btn_add_form_back , .btn_list_edit").hide();
        $(".btn_list_add").show();
    });
    //탭메뉴활성화초기화(계약정보,기성금)
    function initContractTabBtn() {
        contract_tabBtn.removeClass("active");
        contract_tabItem.hide();
        contract_tabBtn.eq(0).addClass("active");
        contract_tabItem.eq(0).show();
    }

    //매입_탭메뉴(물품구매, 설치공사하도급)
    var purchase_tabBtn = modal.find(".btn_modal_formTab > div");
    var purchase_tabItem = modal.find(".modal_formTab");

    purchase_tabBtn.click(function () {
        let index = purchase_tabBtn.index($(this));
        purchase_tabBtn.removeClass("active");
        purchase_tabItem.hide();
        $(this).addClass("active");
        purchase_tabItem.eq(index).show();
    });

    //탭메뉴활성화초기화(물품구매, 설치공사하도급)
    function initpurchaseTabBtn() {
        purchase_tabBtn.removeClass("active");
        purchase_tabItem.hide();
        purchase_tabBtn.eq(0).addClass("active");
        purchase_tabItem.eq(0).show();
    }

    //계약첨부파일_탭메뉴(영업, 계약, 계약관리)
    var file_tabBtn = modal.find(".contract_tabItem .btn_preview_tab_wrap > .btn_preview_tab"); //탭버튼(영업,계약,계약관리)
    var file_tabInput = modal.find("#new_contract_form .btn_file_wrap > .btn_file"); //내PC
    var file_tabIContent = modal.find("#new_contract_form .preview_tab_content > .preview");
    file_tabBtn.click(function () {
        let index = file_tabBtn.index($(this));
        console.log($(this));
        if ($(this).hasClass("disabled")) {
            alert("작성단계가 아닙니다.");
            return false;
        } else {
            file_tabBtn.removeClass("active");
            file_tabInput.removeClass("active");
            file_tabIContent.removeClass("active");
            file_tabInput.hide();
            file_tabIContent.hide();
            $(this).addClass("active");
            file_tabInput.eq(index).show();
            file_tabIContent.eq(index).show();
            file_tabInput.eq(index).addClass("active");
            file_tabIContent.eq(index).addClass("active");
        }
        if (index == 0) {
            alert("계약관련파일만 첨부 가능합니다.");
            $(".btn_file.active").hide();
        } else if (index == 1) {
            $(".btn_file.active").show();
        }
    });

    // -------------------------------------------------------------------------
    //  모달창
    // -------------------------------------------------------------------------

    function initSalesModal() {
        let rootTag = modal.find("#new_business_form");
        rootTag.find('input[type="text"]').val("");
        rootTag.find('input[type="date"]').val("");
        rootTag.find("#businessPreview").children().remove();
        // rootTag.find("#businessEditor").html("");
        rootTag.find("#businessFileInput").val("");
        rootTag.find("#salesUserCate").prop("selectedIndex", 0);

        modal.find("#btn_info_edit").removeAttr("write_user");
        modal.find("#btn_info_edit").removeAttr("write_group");
        modal.find("#btn_info_edit").removeAttr("sales_code");
        modal.find("#btn_info_edit").removeAttr("index_tag");
        modal.find("#btn_info_edit").removeAttr("confirm_level");

        modal.find("#businessPreview").removeAttr("del_file");
    }

    function initContractModal() {
        let rootTag = modal.find("#new_contract_form");
        rootTag.find('input[type="text"]').val("");
        rootTag.find('input[type="date"]').val("");
        rootTag.find("#contract1Preview").children().remove();
        rootTag.find("#contract2Preview").children().remove();
        rootTag.find("#contract3Preview").children().remove();
        // rootTag.find("#contractEditorUser").html("");
        rootTag.find("#contract1FileInput").val("");
        rootTag.find("#contract2FileInput").val("");
        rootTag.find("#contract3FileInput").val("");
        rootTag.find("#contractUserCate").prop("selectedIndex", 0);

        modal.find("#contract_info_edit").removeAttr("write_user");
        modal.find("#contract_info_edit").removeAttr("write_group");
        modal.find("#contract_info_edit").removeAttr("sales_code");
        modal.find("#contract_info_edit").removeAttr("pay_code");
        modal.find("#contract_info_edit").removeAttr("index_tag");
        modal.find("#contract_info_edit").removeAttr("confirm_level");

        modal.find("#contract1Preview").removeAttr("del_file");
        modal.find("#contract2Preview").removeAttr("del_file");

        $("#compltedList tbody").children().remove();
        $("#payContractType").prop("selectedIndex", 0);
        $("#payContractPrice").val("");
        $("#payContractPriceVat").val("");
        $("#contractRequestBillDate").val("");
        $("#contractSalesEtc").val("");
    }

    function initContractReadyMoney() {
        // $("#companyName").prop("selectedIndex", 0);
        let rootTag = modal.find("#formContractReadyMoney");
        rootTag.find('input[type="text"]').val("");
        rootTag.find('input[type="date"]').val("");
        rootTag.find("#payContractType").prop("selectedIndex", 0);
        rootTag.find("#payContractCompany").prop("selectedIndex", 0);
        rootTag.find("#adminMemo").val("");
        rootTag.find("#payCollect").prop("checked", false);
        rootTag.find("#billType").prop("checked", false);
        rootTag.find("#editContractInfo").removeAttr("tr_index");
        // modal.find("#contract_info_edit").removeAttr("pay_code");
    }

    function initPayBill() {
        let rootTag = modal.find("#formContractAdmin");
        rootTag.find('input[type="text"]').val("");
        rootTag.find('input[type="date"]').val("");
        rootTag.find("#payContractCompany").prop("selectedIndex", 0);
        rootTag.find("input[name='payCollect']").prop("checked", false);
        rootTag.find("input[name='billType']").prop("checked", false);
        rootTag.find("#contractAdminPreview").children().remove();
        rootTag.find("#contractAdminPreview").removeAttr("del_file");
        // rootTag.find("#contractEditorAdmin").html("");
        modal.find("#bill_info_save").removeAttr("bill_code");
    }

    //모달창 열기(신규)
    top_content.find(".btn_modal_show").click(function () {
        let clickedBtnId = $(this).attr("id");

        modal.find(".modal_main > div").hide();
        modal.show();
        modal.find(".modal_wrap").css("width", ""); //모달 너비 초기화
        // modal.find("btn_business_N").show();
        modal.find(".modal_wrap > .modal_bottom").hide();
        // modal.find("#btn_info_edit, #btn_info_del, #btn_request_I, #btn_issue_I, #btn_cancel_I").hide();
        // modal.find("#btn_request_I, #btn_issue_I, #btn_cancel_I").hide();
        if (clickedBtnId === "btn_business_N") {
            //신규영업등록 눌렀을 때 모달
            initSalesModal();
            modal.find("#btn_info_edit").attr("confirm_level", 1);
            modal.find(".modal_top > b").text("신규 영업"); //타이틀 변경
            modal.find("#new_business_form").show(); //신규영업모달 폼 보이게
            modal.find("#btn_info_edit, #btn_info_del").hide(); // 수정, 삭제 버튼 숨기기
            modal.find("#btn_info_nextstep").hide(); // 수정, 삭제 버튼 숨기기
        } else if (clickedBtnId === "btn_contract_N") {
            initContractModal();
            initContractTabBtn();
            modal.find("#contract_info_edit").attr("confirm_level", 1);
            modal.find("#modalContractAdmin").hide(); //관리자모달 닫기
            modal.find(".modal_top > b").text("신규 계약"); //타이틀 변경
            modal.find(".modal_wrap").css("width", "1147px");
            modal.find("#new_contract_form").show(); //신규계약모달 폼 보이게
            // modal.find(".modal_admin_content").hide(); //관리자 폼 숨기기
            modal.find("#contract_info_nextstep, #contract_info_prevstep").hide(); // 수정, 삭제 버튼 숨기기
            modal.find("#contract_info_edit, #contract_info_del").hide(); // 수정, 삭제 버튼 숨기기
            modal.find("#contract_info_save").show(); // 수정, 삭제 버튼 숨기기
        }
    });

    //모달창 열기(기존)
    $(document).on("click", ".btn_info_change", function () {
        let salesCode = $(this).attr("sales_code") || 0;
        if (salesCode <= 0) return;

        let confirmLevel = $(this).attr("confirm_level") || 0;

        // console.log("salesLevel=", salesLevel);
        modal.find(".modal_main > div").hide();
        modal.show();

        if (confirmLevel == 0) {
            //영업
            detailSalesInfo(salesCode, $(this));
            modal.find(".modal_wrap").css("width", "680px");
            modal.find(".modal_admin_content").hide();
            modal.find(".modal_top > b").text("영업 수정");
            modal.find("#new_business_form , #btn_info_edit, #btn_info_del").show(); //영업모달 폼, 수정/삭제 버튼 보이게
            modal.find("#btn_info_nextstep").show();
            modal.find("#btn_info_save").hide(); // 저장 버튼 숨기기
        } else if (confirmLevel == 1) {
            //계약
            initContractTabBtn();
            modal.find("#contract_admin").show();
            modal.find("#modalContractAdmin").hide(); //관리자모달 닫기
            detailContractInfo(salesCode, $(this));
            modal.find(".modal_admin_content").show();
            modal.find(".modal_wrap").css("width", "1147px");
            modal.find(".modal_top > b").text("계약 수정");
            modal.find("#new_contract_form").show();
            modal.find("#contract_info_nextstep, #contract_info_prevstep").show();
            modal.find("#contract_info_edit, #contract_info_del").show(); // 수정, 삭제 버튼 보이기
            modal.find("#contract_info_save").hide(); // 저장 버튼 숨기기
        } else if (confirmLevel == 2) {
            //게약관리
            initContractTabBtn();
            modal.find("#modalContractAdmin").hide(); //관리자모달 닫기

            detailContractInfo(salesCode, $(this));
            modal.find(".modal_wrap").css("width", "1147px");
            modal.find(".modal_top > b").text("계약관리 수정");
            modal.find("#new_contract_form").show();
            modal.find("#contract_info_nextstep, #contract_info_prevstep").show();
            modal.find("#contract_info_edit, #contract_info_del").show(); // 수정, 삭제 버튼 보이기
            modal.find("#contract_info_save").hide(); // 저장 버튼 숨기기
        }
    });

    function salesLevelChange(tagInfo, levelType) {
        let salesCode = tagInfo.attr("sales_code") || 0;
        if (salesCode <= 0) {
            alert("처리할 데이터가 선택되지 않았습니다.");
            return;
        }
        let confirmLevel = tagInfo.attr("confirm_level") || 0;
        if (levelType < 0) {
            confirmLevel--;
            if (confirmLevel < 0) {
                alert("영업단계에서는 이전 단계로 이동할 수 없습니다.");
                return;
            }
        } else confirmLevel++;
        // console.log("confirmLevel=", confirmLevel, tagInfo.val());
        let parentTagIndex = tagInfo.attr("index_tag");
        action_popup.confirm('선택된 데이터 "' + SALES_LEVEL_NAME[confirmLevel] + '" 단계로 이동하시겠습니까?', function (res) {
            if (res) {
                let sendData = { salesCode: salesCode, level: confirmLevel };
                let resultJson = axCallFunction("changeSalesDataStep", sendData, false);
                if (!resultJson) {
                    changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                    return;
                } else if (resultJson == -99) {
                    changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                    window.location.href = "login";
                    return;
                }
                changePopupMessage("처리가 완료되었습니다.", modal);

                listContractInfo(1, 1);
                /*
                if (confirmLevel >= 3) {
                    listContractInfo(1, 1);
                    modal.hide();
                } else {
//                    list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td:eq(14)").find("div").text(SALES_LEVEL_NAME[confirmLevel]);
                    list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td:eq(14)").attr("data-status", SALES_LEVEL_NAME[confirmLevel]);
                    list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td:eq(5)").find("a").attr("confirm_level", confirmLevel);
                }
                */
            }
        });
    }

    modal.find(".info_nextstep, .info_prevstep").click(function () {
        let tagInfo = $(this).val() == 1 || $(this).val() == -1 ? modal.find("#btn_info_edit") : modal.find("#contract_info_edit");

        salesLevelChange(tagInfo, $(this).val());
    });

    $(".btn_nextStep, .btn_prevStep").click(function () {
        let checkedCount = $(".mainListCheckBox").filter(":checked").length;
        if (checkedCount <= 0) {
            alert("선택된 데이터가 존재하지 않습니다.");
            return;
        }
        let confirmLevels = [];
        let checkVal = $(this).val();
        let checkedItems = $(".mainListCheckBox:checked");
        checkedItems.each(function () {
            let confirmLevelData = {};
            let currConfirmLevel = $(this).closest("tr").find("a").attr("confirm_level");
            let salesCode = $(this).closest("tr").find("a").attr("sales_code");
            let lastConfirmLevel = parseInt(currConfirmLevel) + parseInt(checkVal);
            if (lastConfirmLevel >= 0) {
                confirmLevelData.confirmLevel = lastConfirmLevel;
                confirmLevelData.salesCode = salesCode;
                confirmLevels.push(confirmLevelData);
            }
        });

        action_popup.confirm("데이터 단계를 변경하시겠습니까?", function (res) {
            if (res) {
                let sendData = { confirmLevels: JSON.stringify(confirmLevels) };
                let resultJson = axCallFunction("changeConfirmLevel", sendData, false);
                if (resultJson <= 0) {
                    if (resultJson == -99) {
                        changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                        window.location.href = "login";
                        return;
                    } else {
                        changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                    }
                } else {
                    changePopupMessage("처리가 완료되었습니다.", modal);
                    listContractInfo(1, 1);
                }
            }
        });
    });

    /*
   	modal.find(".btn_prevStep").click(function() {
   		let level = modal.find(".btn_nextStep").attr("level");
   		console.log("level=", level);
   		if(level > 1) level -= 1;
   		if(level <= 0) {
   			alert("영업단계에서는 이전 단계로 이동할 수 없습니다.");
   			return;
   		}
   		let parentTagIndex = modal.find(".btn_nextStep").attr("index_tag");
   		let writeUser = modal.find(".btn_nextStep").attr("write_user") || 0;
   		let writeGoup = modal.find(".btn_nextStep").attr("write_group") || 0;
   		let salesCode = modal.find(".btn_nextStep").attr("sales_code") || 0;    	
   		if(salesCode > 0) {  // 수정일 경우
   			if(gLoginLevel == MANAGERLEVEL) {
   				if(writeGoup != gLoginGroup) {
   					alert("작성자와 동일 부서가 아니기 때문에 처리할 수 있는 권한이 존재하지 않습니다.");
   					return;
   				}
   			} else if(gLoginLevel < MANAGERLEVEL) {
   				if(writeUser != gLoginCode) {
   					alert("처리할 수 있는 권한이 존재하지 않습니다.");
   					return;
   				}
   			}
   		} else {
   			alert("처리할 데이터가 선택되지 않았습니다.");
   			return;
   		}
   		
   		action_popup.confirm("선택된 데이터를 이전 단계로 이동하시겠습니까?", function (res) {
   			if(res) {
   				let sendData = { salesCode: salesCode, level : level };
   				let resultJson = axCallFunction("changeSalesDataStep", sendData, false);
   				if(!resultJson) {
   					changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
   					return;
   				}
   				changePopupMessage("처리가 완료되었습니다.", modal);
   				
   				list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td:eq(14)").find("div").text(SALES_LEVEL_NAME[level]);
        		list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td:eq(14)").attr("data-status", SALES_LEVEL_NAME[level]);
        		list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td:eq(5)").find("a").attr("sales_level", level);
   			}
   		});
   	});
   	*/
    function detailSalesInfo(salesCode, self) {
        initSalesModal();

        let rootFormTag = modal.find("#new_business_form");
        let sendData = { salesCode: salesCode };
        let resultJson = axCallFunction("salesDetailInfo", sendData, false);
        if (!resultJson) return;

        if (!resultJson.detail_data) return;
        console.log("resultJson=", resultJson);
        rootFormTag.find("#salesUserCate").val(resultJson.detail_data.tsi_tstcode).prop("selected", true);
        let idx = rootFormTag.find("#salesUserCate option").index(rootFormTag.find("#salesUserCate option:selected"));
        if (idx < 0) rootFormTag.find("#salesUserCate option").eq(0).prop("selected", true);
        rootFormTag.find("#salesDemand").val(resultJson.detail_data.tsi_demand_name);
        rootFormTag.find("#salesOrder").val(resultJson.detail_data.tsi_order_name);
        rootFormTag.find("#salesBusSTime").val(resultJson.detail_data.tsi_bus_starttm);
        rootFormTag.find("#salesBusETime").val(resultJson.detail_data.tsi_bus_endtm);
        rootFormTag.find("#salesServiceSTime").val(resultJson.detail_data.tsi_as_starttm);
        rootFormTag.find("#salesServiceETime").val(resultJson.detail_data.tsi_as_endtm);
        rootFormTag.find("#salesBusName").val(resultJson.detail_data.tsi_bus_name);
        rootFormTag.find("#salesContractPrice").val(resultJson.detail_data.tsi_contract_price);
        rootFormTag.find("#salesContractVat").val(resultJson.detail_data.tsi_contract_vat);
        // rootFormTag.find("#businessEditor").html(resultJson.detail_data.tsi_etc);
        rootFormTag.find("#salesComment").val(resultJson.detail_data.tsi_etc);

        modal.find("#btn_info_edit").attr("confirm_level", resultJson.detail_data.tsi_confirm_level);
        modal.find("#btn_info_edit").attr("write_user", resultJson.detail_data.tsi_tmicode);
        modal.find("#btn_info_edit").attr("write_group", resultJson.detail_data.tsi_tgicode);
        modal.find("#btn_info_edit").attr("sales_code", resultJson.detail_data.tsi_code);
        modal.find("#btn_info_edit").attr("index_tag", self.closest("tr").index());

        if (resultJson.file_data) {
            let index = 0;
            let fileData = "";
            for (let keyValue of resultJson.file_data) {
                fileData = '<tr id="business_file_index_' + index + '" file_code=' + keyValue.tfi_code + ">";
                fileData += '<td><button type="button" data-index="business_file_index_' + index + '" file_code=' + keyValue.tfi_code + ' class="file_remove" file_tagid="business"></button></td>';
                fileData += '<td><div class="file_name"><span class="none"></span><p>' + keyValue.tfi_res_name + "</p></div></td>";
                fileData += '<td><a href="#none" onclick="location.href=\'' + downloadPath + "/salesDownload?resFileName=" + keyValue.tfi_res_name + "&fileName=" + keyValue.tfi_file_name + '&imageFolder=sales\'" class="file_download"></a></td></tr>';
                rootFormTag.find("#businessPreview").append(fileData);
                index++;
            }
        }
        modal.find("#new_business_form").show();
    }

    function detailContractInfo(salesCode, self) {
        initContractModal();
        initContractReadyMoney();
        initPayBill();

        let rootTag = modal.find("#new_contract_form");
        let sendData = { salesCode: salesCode };
        let resultJson = axCallFunction("salesDetailInfo", sendData, false);
        if (!resultJson) return;
        if (!resultJson.detail_data) return;

        // 계약정보 출력
        rootTag.find("#contractUserCate").val(resultJson.detail_data.tsi_tstcode).prop("selected", true);
        let idx = rootTag.find("#contractUserCate option").index(rootTag.find("#contractUserCate option:selected"));
        if (idx < 0) rootTag.find("#contractUserCate option").eq(0).prop("selected", true);
        rootTag.find("#contractDate").val(resultJson.detail_data.tsi_contract_date);
        rootTag.find("#contractDemand").val(resultJson.detail_data.tsi_demand_name);
        rootTag.find("#contractOrder").val(resultJson.detail_data.tsi_order_name);
        rootTag.find("#contractBusSTime").val(resultJson.detail_data.tsi_bus_starttm);
        rootTag.find("#contractBusETime").val(resultJson.detail_data.tsi_bus_endtm);
        rootTag.find("#contractServiceSTime").val(resultJson.detail_data.tsi_as_starttm);
        rootTag.find("#contractServiceETime").val(resultJson.detail_data.tsi_as_endtm);
        if (resultJson.detail_data.tsi_send_contract != undefined && resultJson.detail_data.tsi_send_contract > 0) rootTag.find("#contractSend").prop("checked", true);
        else rootTag.find("#contractSend").prop("checked", false);
        rootTag.find("#contractBusName").val(resultJson.detail_data.tsi_bus_name);
        rootTag.find("#contractPrice").val(resultJson.detail_data.tsi_contract_price);
        rootTag.find("#contractVat").val(resultJson.detail_data.tsi_contract_vat);
        rootTag.find("#contractInfoMemo").val(resultJson.detail_data.tsi_etc);

        modal.find("#contract_info_edit").attr("confirm_level", resultJson.detail_data.tsi_confirm_level);
        modal.find("#contract_info_edit").attr("write_user", resultJson.detail_data.tsi_tmicode);
        modal.find("#contract_info_edit").attr("write_group", resultJson.detail_data.tsi_tgicode);
        modal.find("#contract_info_edit").attr("sales_code", resultJson.detail_data.tsi_code);
        modal.find("#contract_info_edit").attr("index_tag", self.closest("tr").index());

        if (resultJson.file_data) {
            let index = 0;
            let fileData = "";
            for (let keyValue of resultJson.file_data) {
                fileData = '<tr id="contract1_file_index_' + index + '" file_code=' + keyValue.tfi_code + ">";
                fileData += '<td><button type="button" data-index="contract1_file_index_' + index + '" file_code=' + keyValue.tfi_code + ' class="file_remove" file_tagid="contract1"></button></td>';
                fileData += '<td><div class="file_name"><span class="none"></span><p>' + keyValue.tfi_res_name + "</p></div></td>";
                fileData += '<td><a href="#none" onclick="location.href=\'' + downloadPath + "/salesDownload?resFileName=" + keyValue.tfi_res_name + "&fileName=" + keyValue.tfi_file_name + '&imageFolder=sales\'" class="file_download"></a></td></tr>';
                rootTag.find("#contract1Preview").append(fileData);
                index++;
            }
        }

        if (resultJson.file_contract_data) {
            let index = 0;
            let fileData = "";
            for (let keyValue of resultJson.file_contract_data) {
                fileData = '<tr id="contract2_file_index_' + index + '" file_code=' + keyValue.tfi_code + ">";
                fileData += '<td><button type="button" data-index="contract2_file_index_' + index + '" file_code=' + keyValue.tfi_code + ' class="file_remove" file_tagid="contract2"></button></td>';
                fileData += '<td><div class="file_name"><span class="none"></span><p>' + keyValue.tfi_res_name + "</p></div></td>";
                fileData += '<td><a href="#none" onclick="location.href=\'' + downloadPath + "/salesDownload?resFileName=" + keyValue.tfi_res_name + "&fileName=" + keyValue.tfi_file_name + '&imageFolder=contract\'" class="file_download"></a></td></tr>';
                rootTag.find("#contract2Preview").append(fileData);
                index++;
            }
        }

        // 계약관리일 경우 업체정보 추가
        if (gLoginLevel > MANAGERLEVEL) {
            modal.find(".modal_admin_content").show();

            $("#payContractCompany").children("option:not(:first)").remove();
            if (resultJson.detail_pay_company) {
                for (let keyValue of resultJson.detail_pay_company) {
                    $("#payContractCompany").append('<option value="' + keyValue.tpc_code + '">' + keyValue.tpc_name + "</option>");
                }
            }

            if (resultJson.detail_bill_publication) {
                let rootBillTag = modal.find("#formContractAdmin");
                rootBillTag.find("#payContractReponseDate").val(resultJson.detail_bill_publication.tbp_bill_pubdate || "");
                let companyCode = resultJson.detail_bill_publication.tbp_tpccode || 0;
                rootBillTag.find("#payContractCompany").val(companyCode).prop("selected", true);
                resultJson.detail_bill_publication.tbp_is_collection == 1 ? rootBillTag.find("#payCollect").prop("checked", true) : rootBillTag.find("#payCollect").prop("checked", false);
                resultJson.detail_bill_publication.tbp_bill_pubtype == 1 ? rootBillTag.find("#billType").prop("checked", true) : rootBillTag.find("#billType").prop("checked", false);
                rootBillTag.find("#adminMemo").val(resultJson.detail_bill_publication.tbp_memo || "");
                rootBillTag.find("#bill_info_save").attr("bill_code", resultJson.detail_bill_publication.tbp_code || 0);
                if (resultJson.file_billpublication_data) {
                    let index = 0;
                    let fileData = "";
                    for (let keyValue of resultJson.file_billpublication_data) {
                        fileData = '<tr id="contractAdmin_file_index_' + index + '" file_code=' + keyValue.tfi_code + ">";
                        fileData += '<td><button type="button" data-index="contractAdmin_file_index_' + index + '" file_code=' + keyValue.tfi_code + ' class="file_remove" file_tagid="contractAdmin"></button></td>';
                        fileData += '<td><div class="file_name"><span class="none"></span><p>' + keyValue.tfi_res_name + "</p></div></td>";
                        fileData += '<td><a href="#none" onclick="location.href=\'' + downloadPath + "/salesDownload?resFileName=" + keyValue.tfi_res_name + "&fileName=" + keyValue.tfi_file_name + '&imageFolder=contract_admin\'" class="file_download"></a></td></tr>';
                        rootBillTag.find("#contractAdminPreview").append(fileData);
                        index++;
                    }
                }
            }
        }

        if (resultJson.detail_contract_readymoney) {
            let resultData = "";
            for (let keyValue of resultJson.detail_contract_readymoney) {
                let resultData = '<tr class="list_row">';
                resultData += '<td class="">' + ($("#compltedList tbody tr").length + 1) + "</td>";

                // if(resultJson.detail_data.tsi_confirm_level >= 2) {
                if (keyValue.tpi_tpccode) {
                    let companyName = $('#payContractCompany option[value="' + keyValue.tpi_tpccode + '"]').text();
                    resultData += '<td class="" pay_company_code=' + keyValue.tpi_tpccode + ">" + (companyName || "") + "</td>";
                } else {
                    resultData += '<td class="" pay_company_code="0"></td>';
                }
                // resultData += $('#companyName option[value="' + keyValue.tpi_type + '"]').text() || ""; //업체명
                resultData += '<td class="">';
                let paytypeName = $('#payContractType option[value="' + keyValue.tpi_type + '"]').text() || "";
                resultData += '<a href="#" class="contractPayType" pay_company_code=' + (keyValue.tpi_tpccode || 0) + " pay_code=" + keyValue.tpi_code + " contract_paytype=" + keyValue.tpi_type + ">" + paytypeName + "</a>";
                resultData += "</td>";
                resultData += '<td class="">' + keyValue.tpi_price + "</td>";
                resultData += '<td class="">' + keyValue.tpi_price_vat + "</td>";
                resultData += '<td class="">' + keyValue.tpi_sales_type + "</td>";
                resultData += '<td class="">' + (keyValue.tpi_request_date || "") + "</td>";
                // resultData += '<td class="" bill_type=' + keyValue.tpi_pay_type + ">" + (keyValue.tpi_pay_type == 1 ? "발행완료" : "발행전") + "</td>";
                resultData += '<td class="billType" bill_type=' + (keyValue.tpi_pay_type || 0) + "><span class='icon'></span></td>";
                resultData += '<td class="">' + (keyValue.tpi_response_date || "") + "</td>";
                resultData += '<td class=""><span class="icon" memo_code="' + (keyValue.tpi_etc === "" ? 0 : 1) + '" memo="' + keyValue.tpi_etc + '"></span></td>'; //메모
                // resultData += '<td class="" pay_collect=' + (keyValue.tpi_collection || 0) + ">" + (keyValue.tpi_collection == 1 ? "수금완료" : "수금전") + "</td>"; //수정시 수금
                resultData += '<td class="payCollect" pay_collect=' + (keyValue.tpi_collection || 0) + "> <span class='icon'></span>    </td>";
                resultData += '<td class="">';
                resultData += '<button type="button" class="btn_modalList_del"></button>';
                resultData += "</td>";
                resultData += "</tr>";
                $("#compltedList tbody").append(resultData);
            }
        }

        modal.find("#new_contract_form").show();
    }

    //열린 모달창(기존) 정보삭제
    modal.find("#btn_info_del").click(function () {
        let writeUser = modal.find("#btn_info_edit").attr("write_user") || 0;
        let writeGoup = modal.find("#btn_info_edit").attr("write_group") || 0;
        let salesCode = modal.find("#btn_info_edit").attr("sales_code") || 0;
        if (salesCode > 0) {
            if (writeUser != gLoginCode) {
                if (gLoginLevel <= COMMONLEVEL) {
                    alert("처리할 수 있는 권한이 존재하지 않습니다.");
                    return;
                } else if (gLoginLevel == MANAGERLEVEL) {
                    if (writeGoup != gLoginGroup) {
                        alert("작성자와 동일 부서가 아니기 떄문에 처리할 수 있는 권한이 존재하지 않습니다.");
                        return;
                    }
                } else {
                    alert("권한이 없어 처리할 수 없습니다.");
                    return;
                }
            }
        } else {
            alert("삭제할 데이터가 선택되지 않았습니다.");
            return;
        }

        action_popup.confirm("정보를 삭제하시겠습니까?", function (res) {
            if (res) {
                let sendData = { salesCode: salesCode };
                let resultJson = axCallFunction("removeSalesInfo", sendData, false);
                if (!resultJson) {
                    changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                    return;
                } else {
                    changePopupMessage("처리가 완료되었습니다.", modal);
                    listContractInfo(1, 1);
                }
            }
        });
    });

    modal.find("#bill_info_save").click(function () {
        let salesCode = modal.find("#contract_info_edit").attr("sales_code") || 0;
        if (salesCode <= 0) {
            alert("데이터를 선택하여 주십시요");
            return;
        }
        let billCode = $(this).attr("bill_code") || 0;

        let rootTag = modal.find("#formContractAdmin");
        let contractResponseBillDate = rootTag.find("#payContractReponseDate").val();
        if (!contractResponseBillDate) {
            alert("계산서 발행 또는 취소일을 입력하여 주십시요");
            return;
        }
        let payContractCompany = rootTag.find("#payContractCompany").val();
        if (payContractCompany <= 0) {
            alert("계약업체를 선택하여 주십시요");
            return;
        }
        let trIndex = $("#contract_info_edit").attr("tr_index");
        action_popup.confirm("현재 선택된 데이터 계산서 현황을 변경하시겠습니까?", function (res) {
            if (res) {
                let formData = new FormData(rootTag[0]);

                // let sendData = {};
                // sendData.payCompanyCode = $("#payContractCompany").val();
                // sendData.payBillType = $('input[name="billType"]:checked').val();
                // sendData.payCollect = $("#payCollect").is(":checked") ? 1 : 0;
                // sendData.contractResponseBillDate = $("#payContractReponseDate").val();
                // sendData.contractMemo = $("#contractEditorAdmin").html();
                // formData.set("payCode", payCode);
                formData.set("imgFolderName", "contract_admin");
                // sendData.payCode = payCode;
                formData.set("delFiles", rootTag.find("#contractAdminPreview").attr("del_file") || "");
                formData.set("billCode", billCode);
                formData.set("salesCode", salesCode);
                // console.log("delFile=", rootFormTag.find("#purchasePreview").attr("del_file"));

                let resultJson = axFormdataCallFunction("changePayBillInfo", formData, false);
                if (!resultJson) {
                    changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                    return;
                } else if (resultJson == -99) {
                    changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                    window.location.href = "login";
                    return;
                } else {
                    changePopupMessage("처리가 완료되었습니다.", modal);

                    /*
                    $("#compltedList tbody tr").eq(trIndex).find("td:eq(1)").text($("#payContractCompany option:selected").text());
                    $("#compltedList tbody tr").eq(trIndex).find("td:eq(1)").attr("pay_company_code", payContractCompany);
                    $("#compltedList tbody tr").eq(trIndex).find("td:eq(2) a").attr("pay_company_code", payContractCompany);
                    if (sendData.payBillType == 1) $("#compltedList tbody tr").eq(trIndex).find("td:eq(6)").text("발행완료");
                    else $("#compltedList tbody tr").eq(trIndex).find("td:eq(6)").text("발행전");
                    $("#compltedList tbody tr").eq(trIndex).find("td:eq(6)").attr("bill_type", rootTag.find("#billType").val() || 0);
                    $("#compltedList tbody tr")
                        .eq(trIndex)
                        .find("td:eq(8)")
                        .text($("#payContractReponseDate").val() || "");
                    $("#compltedList tbody tr")
                        .eq(trIndex)
                        .find("td:eq(9)")
                        .text($("#contractEditorAdmin").html() || "");
                    if (sendData.payCollect == 1) $("#compltedList tbody tr").eq(trIndex).find("td:eq(10)").text("수금완료");
                    else $("#compltedList tbody tr").eq(trIndex).find("td:eq(10)").text("수금전");
                    $("#compltedList tbody tr").eq(trIndex).find("td:eq(10)").attr("pay_collect", sendData.payCollect);
					*/
                    initPayBill();
                }
            }
        });
    });

    //열린 모달창(기존) 리스트삭제
    $(document).on("click", ".btn_modalList_del", function () {
        var result = confirm("리스트를 삭제하시겠습니까?");
        if (result) {
            $(this).parents("tr").remove();
            let parentTr = $("#compltedList tbody tr");
            console.log("parentTr.length=", parentTr.length);
            for (let i = 0; i < parentTr.length; i++)
                parentTr
                    .eq(i)
                    .find("td:eq(0)")
                    .text(i + 1);
        }
    });

    $(document).on("click", ".contractPayType", function () {
        let rootFormTag = $("#formContractReadyMoney");
        let payCode = $(this).attr("pay_code");

        rootFormTag.find("#payContractType").val($(this).attr("contract_paytype")).prop("selected", true);
        let idx = $("#payContractType option").index($("#payContractType option:selected"));
        if (idx < 0) $("#payContractType option").eq(0).prop("selected", true);

        $("#payContractCompany option").eq(0).prop("selected", true);
        let payCompanyCode = $(this).attr("pay_company_code");
        if (payCompanyCode > 0) {
            $("#payContractCompany").val(payCompanyCode).prop("selected", true);
            idx = $("#payContractCompany option").index($("#payContractCompany option:selected"));
            if (idx < 0) $("#payContractCompany option").eq(0).prop("selected", true);
        }
        rootFormTag.find("#payContractPrice").val($(this).closest("tr").find("td:eq(3)").text());
        rootFormTag.find("#payContractPriceVat").val($(this).closest("tr").find("td:eq(4)").text());
        rootFormTag.find("#contractSalesEtc").val($(this).closest("tr").find("td:eq(5)").text());
        rootFormTag.find("#contractRequestBillDate").val($(this).closest("tr").find("td:eq(6)").text());
        // rootFormTag.find("#contractReadyMoneyMemo").val($(this).closest("tr").find("td:eq(9) span").attr("memo"));
        if (($(this).closest("tr").find("td:eq(7)").attr("bill_type") || 0) == 1) rootFormTag.find("#billType").prop("checked", true);
        else rootFormTag.find("#billType").prop("checked", false);
        rootFormTag.find("#payContractReponseDate").val($(this).closest("tr").find("td:eq(8)").text());
        rootFormTag.find("#adminMemo").val($(this).closest("tr").find("td:eq(9) span").attr("memo") || "");
        if (($(this).closest("tr").find("td:eq(10)").attr("pay_collect") || 0) == 1) rootFormTag.find("#payCollect").prop("checked", true);
        else rootFormTag.find("#payCollect").prop("checked", false);
        rootFormTag.find("#editContractInfo").attr("tr_index", $(this).closest("tr").index());
        modal.find("#editContractInfo").attr("pay_code", payCode);
    });

    $("#addContractInfo, #editContractInfo").click(function () {
        let confirmLevel = modal.find("#contract_info_edit").attr("confirm_level");

        let rootTag = modal.find("#formContractReadyMoney");
        let saveType = 1;
        let trIndex = rootTag.find("#editContractInfo").attr("tr_index");
        if ($(this).val() == 2) {
            saveType = 2;
            if (trIndex == undefined) {
                alert("수정 할 데이터를 선택하여 주십시요");
                return;
            }
        }

        let selIndex = rootTag.find("#payContractType").prop("selectedIndex");

        let contractType = rootTag.find("#payContractType").val();
        if (contractType < 0) {
            alert("구분을 선택하여 주십시요");
            return;
        }
        let contractResponseBillDate = 0;
        let payContractCompany = 0;
        let payCollect = 0;
        let billType = 0;
        let memoVal = "";
        let publicationDate = "";
        if (gLoginLevel > MANAGERLEVEL) {
            contractResponseBillDate = rootTag.find("#payContractReponseDate").val();
            if (!contractResponseBillDate) {
                alert("계산서 발행 또는 취소일을 입력하여 주십시요");
                return;
            }
            payContractCompany = rootTag.find("#payContractCompany").val();
            if (payContractCompany <= 0) {
                alert("계약업체를 선택하여 주십시요");
                return;
            }
            payCollect = rootTag.find("#payCollect").is(":checked") ? 1 : 0;
            billType = rootTag.find("#billType").is(":checked") ? 1 : 0;
            publicationDate = rootTag.find("#payContractReponseDate").val();
            if (billType == 1 && publicationDate == "") {
                alert("발행일자를 선택하여 주십시요");
                return;
            }
            memoVal = rootTag.find("#adminMemo").val().trim();
        }

        if (saveType != 2) {
            let resultData = '<tr class="list_row">';
            resultData += '<td class="">' + (rootTag.find("#compltedList tbody tr").length + 1) + "</td>";
            if (gLoginLevel > MANAGERLEVEL) {
                if (payContractCompany > 0) resultData += '<td class="">' + rootTag.find("#payContractCompany option:selected").text() + "</td>";
                else resultData += '<td class=""></td>';
            } else resultData += '<td class=""></td>';
            resultData += '<td class="">';
            resultData += '<a href="#" class="contractPayType" pay_company_code=' + payContractCompany + " contract_paytype=" + contractType + ">" + rootTag.find("#payContractType option:selected").text() + "</a>";
            resultData += "</td>";
            resultData += '<td class="">' + rootTag.find("#payContractPrice").val() + "</td>";
            resultData += '<td class="">' + rootTag.find("#payContractPriceVat").val() + "</td>";
            resultData += '<td class="">' + rootTag.find("#contractSalesEtc").val() + "</td>";
            resultData += '<td class="">' + rootTag.find("#contractRequestBillDate").val() + "</td>";
            if (gLoginLevel > MANAGERLEVEL) {
                // resultData += "<td bill_type=" + billType + ' class="">' + (billType == 0 ? "발행전" : "발행완료") + "</td>";
                resultData += '<td class="billType" bill_type=' + billType + "><span class='icon'></span></td>";
                resultData += '<td class="">' + publicationDate + "</td>";
                resultData += '<td class=""><span class="icon" memo_code="' + (memoVal === "" ? 0 : 1) + '" memo="' + memoVal + '"></span></td>'; //메모
                // resultData += "<td pay_collect=" + payCollect + ' class="">' + (payCollect == 0 ? "수금전" : "수금완료") + "</td>";
                // 수금수정
                resultData += "<td pay_collect=" + payCollect + ' class="payCollect"><span class="icon"></span></td>"';
            } else {
                resultData += '<td bill_type=0 class="">발행전</td>';
                resultData += '<td class=""></td>';
                resultData += '<td class=""><span class="icon" memo_code="0" memo=""></span></td>'; //메모
                resultData += '<td class="" pay_collect=0><span class="icon"></span></td>';
            }
            resultData += '<td class="">';
            resultData += '<button type="button" class="btn_modalList_del"></button>';
            resultData += "</td>";
            resultData += "</tr>";

            rootTag.find("#compltedList tbody").append(resultData);
        } else {
            if (gLoginLevel > MANAGERLEVEL) {
                rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(1)").text($("#payContractCompany option:selected").text());
            }
            // rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(1)").attr("pay_company_code", $("#payContractCompany").val());

            rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(2) a").text(rootTag.find("#payContractType option:selected").text());
            rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(2) a").attr("contract_paytype", contractType);
            rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(2) a").attr("pay_company_code", payContractCompany);
            rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(3)").text(rootTag.find("#payContractPrice").val());
            rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(4)").text(rootTag.find("#payContractPriceVat").val());
            rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(5)").text(rootTag.find("#contractSalesEtc").val());
            rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(6)").text(rootTag.find("#contractRequestBillDate").val());
            if (gLoginLevel > MANAGERLEVEL) {
                rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(7)").attr("bill_type", billType);
                // rootTag
                //     .find("#compltedList tbody tr")
                //     .eq(trIndex)
                //     .find("td:eq(7)")
                //     .text(billType == 0 ? "발행전" : "발행완료");
                rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(8)").text(publicationDate);
                rootTag
                    .find("#compltedList tbody tr")
                    .eq(trIndex)
                    .find("td:eq(9) span")
                    .attr("memo_code", memoVal === "" ? 0 : 1);
                rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(9) span").attr("memo", memoVal);
                rootTag.find("#compltedList tbody tr").eq(trIndex).find("td:eq(10)").attr("pay_collect", payCollect);
                // rootTag
                //     .find("#compltedList tbody tr")
                //     .eq(trIndex)
                //     .find("td:eq(10)")
                //     .text(payCollect == 0 ? "수금전" : "수금완료");
            }
        }

        //모달안의 리스트 추가버튼
        // alert("리스트가 추가되었습니다.");
        initContractReadyMoney();
        // $('.preview tbody td').remove();
        // $(".editor_input > div").text("");
    });

    modal.find("#btn_info_save, #btn_info_edit").click(function () {
        let parentTagIndex = modal.find("#btn_info_edit").attr("index_tag");
        let writeUser = modal.find("#btn_info_edit").attr("write_user") || 0;
        let writeGoup = modal.find("#btn_info_edit").attr("write_group") || 0;
        let salesCode = modal.find("#btn_info_edit").attr("sales_code") || 0;
        let selTagId = $(this).attr("id");
        if (selTagId == "btn_info_save") {
            salesCode = 0;
        } else {
            if (salesCode > 0) {
                // 수정일 경우
                if (writeUser != gLoginCode) {
                    if (gLoginLevel <= COMMONLEVEL) {
                        alert("처리할 수 있는 권한이 존재하지 않습니다.");
                        return;
                    } else if (gLoginLevel == MANAGERLEVEL) {
                        if (writeGoup != gLoginGroup) {
                            alert("작성자와 동일 부서가 아니기 떄문에 처리할 수 있는 권한이 존재하지 않습니다.");
                            return;
                        }
                    } else {
                        alert("권한이 없어 처리할 수 없습니다.");
                        return;
                    }
                }
            }
        }

        let rootFormTag = $("#formSalesInfo");
        let index = rootFormTag.find("#salesUserCate option").index(rootFormTag.find("#salesUserCate option:selected"));
        if (index <= 0) {
            alert("구분을 선택하여 주십시요");
            return;
        }

        /*
        let busName = rootFormTag.find("#salesBusName").val();
        if (!busName) {
            alert("사업명을 입력하여 주십시요");
            return;
        }
        */
        action_popup.confirm("입력하신 내용을 등록하시겠습니까?", function (res) {
            if (res) {
                let formData = new FormData(rootFormTag[0]);

                // formData.set("salesComment", rootFormTag.find("#businessEditor").html());
                formData.set("salesCode", salesCode);
                // formData.set("groupCode", gLoginCode);
                formData.set("imgFolderName", "sales");
                formData.set("delFiles", rootFormTag.find("#businessPreview").attr("del_file") || "");

                let resultJson = axFormdataCallFunction("saveSalesInfo", formData, false);
                if (!resultJson) return;

                if (resultJson == -99) {
                    changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                    window.location.href = "login";
                    return;
                } else {
                    if (resultJson > 0) {
                        changePopupMessage("처리가 완료되었습니다.", modal);
                        if (salesCode > 0) {
                            console.log("=========", rootFormTag.find("#salesUserCate option:selected").text(), parentTagIndex);
                            // list.find("#list_contract_info").find("tr").eq()
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(2).text(rootFormTag.find("#salesUserCate option:selected").text());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(3).text(rootFormTag.find("#salesDemand").val());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(4).text(rootFormTag.find("#salesOrder").val());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(5).find("a").text(rootFormTag.find("#salesBusName").val());
                            list.find("#list_contract_info")
                                .find("tr")
                                .eq(parentTagIndex)
                                .find("td")
                                .eq(6)
                                .find("div")
                                .html("<p>" + rootFormTag.find("#salesBusSTime").val() + "</p><span>~</span><p>" + rootFormTag.find("#salesBusETime").val() + "</p>");
                            list.find("#list_contract_info")
                                .find("tr")
                                .eq(parentTagIndex)
                                .find("td")
                                .eq(7)
                                .find("div")
                                .html("<p>" + rootFormTag.find("#salesServiceSTime").val() + "</p><span>~</span><p>" + rootFormTag.find("#salesServiceETime").val() + "</p>");
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(9).text(rootFormTag.find("#salesContractPrice").val());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(10).text(rootFormTag.find("#salesContractVat").val());
                        } else listContractInfo(1, 1);
                    } else {
                        changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                    }
                }
            }
        });
    });

    modal.find("#contract_info_save, #contract_info_edit").click(function () {
        let parentTagIndex = modal.find("#contract_info_edit").attr("index_tag");
        let writeUser = modal.find("#contract_info_edit").attr("write_user") || 0;
        let writeGoup = modal.find("#contract_info_edit").attr("write_group") || 0;
        let salesCode = modal.find("#contract_info_edit").attr("sales_code") || 0;
        // console.log("gLoginLevel=", gLoginLevel, writeUser, gLoginCode);
        if (salesCode > 0) {
            // 수정일 경우
            if (gLoginLevel <= COMMONLEVEL) {
                alert("권한이 없어 처리할 수 없습니다.");
                return;
            }
        }

        let rootFormTag = $("#formContractInfo");
        let index = rootFormTag.find("#contractUserCate option").index(rootFormTag.find("#contractUserCate option:selected"));
        if (index <= 0) {
            alert("구분을 선택하여 주십시요");
            return;
        }

        let busName = rootFormTag.find("#contractBusName").val();
        if (!busName) {
            alert("사업명을 입력하여 주십시요");
            return;
        }
        let confirmLevel = gLoginLevel > MANAGERLEVEL ? 2 : modal.find("#contract_info_edit").attr("confirm_level") || 1;
        let contractReadyMoney = [];
        $("#compltedList tbody tr").each(function () {
            let contractReadyMoneyItem = {};
            contractReadyMoneyItem.payCompanyCode = $(this).find("td:eq(2) a").attr("pay_company_code") || 0;
            contractReadyMoneyItem.payContractType = $(this).find("td:eq(2) a").attr("contract_paytype");
            contractReadyMoneyItem.payContractPrice = $(this).find("td:eq(3)").text();
            contractReadyMoneyItem.payContractPriceVat = $(this).find("td:eq(4)").text();
            contractReadyMoneyItem.contractSalesType = $(this).find("td:eq(5)").text();
            contractReadyMoneyItem.contractRequestBillDate = $(this).find("td:eq(6)").text();
            contractReadyMoneyItem.payBillType = $(this).find("td:eq(7)").attr("bill_type") || 0;
            contractReadyMoneyItem.contractResponseBillDate = $(this).find("td:eq(8)").text();
            contractReadyMoneyItem.contractMemo = $(this).find("td:eq(9) span").attr("memo");
            contractReadyMoneyItem.payCollect = $(this).find("td:eq(10)").attr("pay_collect") || 0;
            contractReadyMoneyItem.confirmLevel = confirmLevel;
            contractReadyMoney.push(contractReadyMoneyItem);
        });

        action_popup.confirm("입력하신 내용을 등록하시겠습니까?", function (res) {
            if (res) {
                let formData = new FormData(rootFormTag[0]);
                formData.set("confirmLevel", confirmLevel);
                // formData.set("contractComment", rootFormTag.find("#contractEditorUser").html());
                formData.set("contractReadyMoney", JSON.stringify(contractReadyMoney));
                formData.set("salesCode", salesCode);
                formData.set("groupCode", gLoginCode);
                formData.set("imgFolderName", "contract");
                formData.set("contractSend", rootFormTag.find("#contractSend").prop("checked") ? 1 : 0);
                formData.set("delFiles", rootFormTag.find("#contract2Preview").attr("del_file") || "");

                let resultJson = axFormdataCallFunction("saveContractInfo", formData, false);
                if (!resultJson) return;

                if (resultJson == -99) {
                    changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                    window.location.href = "login";
                    return;
                } else {
                    if (resultJson > 0) {
                        changePopupMessage("처리가 완료되었습니다.", modal);
                        if (salesCode > 0) {
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(2).text(rootFormTag.find("#contractUserCate option:selected").text());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(3).text(rootFormTag.find("#contractDemand").val());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(4).text(rootFormTag.find("#contractOrder").val());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(5).find("a").text(rootFormTag.find("#contractBusName").val());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(5).find("a").attr("confirm_level", confirmLevel);
                            list.find("#list_contract_info")
                                .find("tr")
                                .eq(parentTagIndex)
                                .find("td")
                                .eq(6)
                                .find("div")
                                .html("<p>" + rootFormTag.find("#contractBusSTime").val() + "</p><span>~</span><p>" + rootFormTag.find("#contractBusETime").val() + "</p>");
                            list.find("#list_contract_info")
                                .find("tr")
                                .eq(parentTagIndex)
                                .find("td")
                                .eq(7)
                                .find("div")
                                .html("<p>" + rootFormTag.find("#contractServiceSTime").val() + "</p><span>~</span><p>" + rootFormTag.find("#contractServiceETime").val() + "</p>");
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(8).text(rootFormTag.find("#contractDate").val());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(9).text(rootFormTag.find("#contractPrice").val());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td").eq(10).text(rootFormTag.find("#contractVat").val());
                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td:eq(14)").attr("data-status", SALES_LEVEL_NAME[confirmLevel]);
                            //                            list.find("#list_contract_info").find("tr").eq(parentTagIndex).find("td:eq(14)").find("div").text(SALES_LEVEL_NAME[confirmLevel]);
                        } else listContractInfo(1, 1);
                    } else {
                        changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                    }
                }
            }
        });
    });

    modal.find("#contract_info_del").click(function () {
        // let writeUser = modal.find("#contract_info_edit").attr("write_user") || 0;
        // let writeGoup = modal.find("#contract_info_edit").attr("write_group") || 0;
        // let salesCode = modal.find("#contract_info_edit").attr("sales_code") || 0;
        let writeUser = modal.find(".btn_nextStep").attr("write_user") || 0;
        let writeGoup = modal.find(".btn_nextStep").attr("write_group") || 0;
        let salesCode = modal.find(".btn_nextStep").attr("sales_code") || 0;
        // console.log("#contract_info_del//gLoginLevel=", salesCode,  writeGoup, writeUser);
        if (salesCode > 0) {
            if (gLoginLevel > COMMONLEVEL) {
                if (writeUser != gLoginCode && gLoginLevel == MANAGERLEVEL) {
                    alert("처리할 수 있는 권한이 존재하지 않습니다.");
                    return;
                }
            } else {
                alert("권한이 없어 처리할 수 없습니다.");
                return;
            }
        } else {
            alert("삭제할 데이터가 선택되지 않았습니다.");
            return;
        }

        action_popup.confirm("선택하신 내용을 삭제하시겠습니까?", function (res) {
            if (res) {
                let sendData = { salesCode: salesCode };
                let resultJson = axCallFunction("removeContractInfo", sendData, false);
                if (!resultJson) {
                    changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                    return;
                } else {
                    changePopupMessage("처리가 완료되었습니다.", modal);
                    listContractInfo(1, 1);
                }
            }
        });
    });

    $("#btn_auto_calculate_rate").click(function () {
        // 모달안의 VAT자동계산버튼
        var priceInput = $(this).siblings("input").eq(0); // 첫 번째 input (VAT 포함)
        var vatInput = $(this).siblings("input").eq(1); // 두 번째 input (VAT 별도)
        var vatRateInput = $(this).siblings("input").eq(2); // 두 번째 input (VAT 별도)

        var priceValue = priceInput.val().trim().replace(/,/g, ""); // 쉼표 제거
        var vatValue = vatInput.val().trim().replace(/,/g, ""); // 쉼표 제거
        var vatRateValue = vatRateInput.val().trim().replace(/,/g, ""); // 쉼표 제거

        if (priceValue == "") {
            alert("계약금을 입력하여 주십시요");
            return;
        }
        if (vatRateValue == "") {
            alert("할인율(%)를 입력하여 주십시요");
            return;
        }
        var isNumeric = /^\d+(\.\d+)?$/;

        if ((!isNumeric.test(priceValue) && priceValue !== "") || (!isNumeric.test(vatValue) && vatValue !== "") || (!isNumeric.test(vatRateValue) && vatRateValue !== "")) {
            alert("숫자만 입력해 주세요.");
            return;
        }

        var rateVat = parseFloat(vatRateValue) * 0.01;
        var price = price - parseFloat(priceValue) * rateVat;
        var vat = parseFloat(vatValue);

        if (isNaN(price) && isNaN(vat)) {
            alert("계약금액을 입력하여 주십시요");
        } else if (!isNaN(price) && isNaN(vat)) {
            // VAT 별도 값이 없으면 VAT 별도 값을 계산하여 출력
            vatInput.val(Math.round(price / 1.1).toLocaleString());
        } else if (isNaN(price) && !isNaN(vat)) {
            // VAT 포함 값이 없으면 VAT 포함 값을 계산하여 출력
            priceInput.val(Math.round(vat * 1.1).toLocaleString());
        } else if (!isNaN(price) && !isNaN(vat)) {
            // 둘 다 값이 있을 경우 VAT 포함 값을 기준으로 VAT 별도 값을 출력
            vatInput.val(Math.round(price / 1.1).toLocaleString());
        }
    });
});

// -------------------------------------------------------------------------
// 매출합계
// -------------------------------------------------------------------------
const listInclud_TotalSumValue = () => {
    let listInclud_C = [];
    let listNotInclud_C = [];
    let listInclud_R = [];
    let listNotInclud_R = [];

    const listInclud_C_Group = $(".list_includ_C");
    const listNotInclud_C_Group = $(".list_notinclud_C");
    const listInclud_R_Group = $(".list_includ_R");
    const listNotInclud_R_Group = $(".list_notinclud_R");

    for (let i = 0; i < listInclud_C_Group.length; i++) {
        let listInclud_C_item = $(listInclud_C_Group[i]);
        listInclud_C.push(Number(listInclud_C_item.text()));
    }
    // console.log(listInclud_C);

    for (let i = 0; i < listNotInclud_C_Group.length; i++) {
        let listNotInclud_C_item = $(listNotInclud_C_Group[i]);
        listNotInclud_C.push(Number(listNotInclud_C_item.text()));
    }
    // console.log(listNotInclud_C);

    for (let i = 0; i < listInclud_R_Group.length; i++) {
        let listInclud_R_item = $(listInclud_R_Group[i]);
        listInclud_R.push(Number(listInclud_R_item.text()));
    }
    // console.log(listInclud_R);

    for (let i = 0; i < listNotInclud_R_Group.length; i++) {
        let listNotInclud_R_item = $(listNotInclud_R_Group[i]);
        listNotInclud_R.push(Number(listNotInclud_R_item.text()));
        // 07;
    }
    // console.log(listNotInclud_R);

    // 매출관리 총 합계
    function TotalAmount(numbers) {
        let totalSum = 0;
        for (let number of numbers) {
            totalSum += number;
        }
        if (numbers === listInclud_C) {
            console.log(totalSum);
            $(".list_includ_C_total").text(totalSum);
        } else if (numbers === listNotInclud_C) {
            console.log(totalSum);
            $(".list_notinclud_C_total").text(totalSum);
        } else if (numbers === listInclud_R) {
            $(".list_includ_R_total").text(totalSum);
            console.log(totalSum);
        } else if (numbers === listNotInclud_R) {
            $(".list_notinclud_R_total").text(totalSum);
            console.log(totalSum);
        }
    }

    /*
    TotalAmount(listInclud_C);
    TotalAmount(listNotInclud_C);
    TotalAmount(listInclud_R);
    TotalAmount(listNotInclud_R);
    */
};

// -------------------------------------------------------------------------
//  첨부파일 미리보기(개별)
// -------------------------------------------------------------------------
fileInputHandeler("business");
// fileInputHandeler("contract1");
fileInputHandeler("contract2");
// fileInputHandeler("contract1");
fileInputHandeler("purchase");
//fileInputHandeler("contractAdmin");
// fileInputHandeler("work");
/*
    fileInputHandeler("contract2");
    fileInputHandeler("contract3");
    fileInputHandeler("complted");
    fileInputHandeler("purchase1");
    fileInputHandeler("purchase2");
	*/
// -------------------------------------------------------------------------
//  에디터(개별) 영업모달, 계약모달, 정산서
// -------------------------------------------------------------------------
// editorHandler("businessEditor");
// editorHandler("contractEditorUser");
// editorHandler("contractEditorAdmin");
