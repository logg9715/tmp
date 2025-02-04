"use district";

let purchaseFileInfo = [];
$(document).ready(function () {
    const top_content = $(".top_content");
    const list = $(".list");
    const mainList = $("#mainList");
    const bottom_content = $(".bottom_content");
    const modal = $(".modal");
    const CONTRACT_PAGE_LIST = 50;
    const SALES_LEVEL_NAME = ["영업", "계약전", "계약관리", "매출관리"];

    //메뉴 active
    // 모든 li 요소에서 active 클래스 제거
    const main_2dep_menu = $(".main_2dep li");
    main_2dep_menu.removeClass("active");
    // 클릭한 링크의 부모 li에 active 클래스 추가
    main_2dep_menu.eq(1).addClass("active");

    initReadyFunc();

    function initReadyFunc() {
    	// var date = new Date();
    	// $("#num_bill_year").val(date.getFullYear());
        loadPayCompany();
        listRevenueInfo(1, 1);
    }

    function loadPayCompany() {
        $("#sel_search_company").children("option:not(:first)").remove();
        let resultJson = axCallFunction("listPayCompany", "", false);
        if (!resultJson) return;

        for (let keyValue of resultJson) {
            $("#sel_search_company").append('<option value="' + keyValue.tpc_code + '">' + keyValue.tpc_name + "</option>");
        }
    }
    
    /*
    $("#btn_search").click(function() {
    	listRevenueInfo(1, 1);
    });
    */
    $(".search_icon").click(function () {
    	listRevenueInfo(1, 1);
    });

    function listRevenueInfo(pageIndex, isRefresh = 0) {
        let rootTag = $("#form_search_revenue");
        
        let sortInfo = [];
        $('.sortListRow').each(function(index) {
        	let selectedValue = $(this).find('.selSortValue').attr("value");
        	// if(selectedValue == undefined) selectedValue = -1;
        	console.log("selectedValue=", selectedValue);
        	if(selectedValue >= 0) sortInfo.push(selectedValue);
        	/*
        	if(index == 0) sortInfo.push(0);
        	else sortInfo.push(1);
        	*/
        });
        if(sortInfo.every(value=>value == -1)) sortInfo = [];
        
        let formData = rootTag.serialize();
        formData += "&isRefresh=" + isRefresh;
        formData += "&pageIndex=" + pageIndex;
        formData += "&listCount=" + CONTRACT_PAGE_LIST;
        formData += "&sortInfo=" + JSON.stringify(sortInfo);

        let resultJson = axCallFunction("listRevenueInfo", formData, false);
        console.log("resultJson=", resultJson);
        if (!resultJson) return;

        // 새로고침일 경우 전체 수량과 페이지 번호 재설정
        if (isRefresh == 1) {
            bottom_content.find("#list_total_num").text(numberWithCommas(resultJson.resultCount));
            pagingStart(resultJson.resultCount, CONTRACT_PAGE_LIST, 1, "#revenueManagementListPaging", listRevenueInfo);
        }

        mainList.find("tbody").children().not(":first").remove();
        let resultData = "";
        let index = 1;
        let confirmLevel = "";
        let total_contract_price = 0; //계약금액
        let total_contract_vat = 0; //
        let total_sprice = 0;
        let total_price_vat = 0;
        let salesCode = 0;
        let rowSpanCount = 1;
        let currSalesCode = -1;
        const docFragment = $(document.createDocumentFragment());
        for (let keyValue of resultJson.resultData) {
        	currSalesCode = keyValue.tsi_code;
        	if(currSalesCode != salesCode) {
        		if(rowSpanCount != 1) {
        			//docFragment.children('tr').eq(rowSpanCount*-1).children('td').slice(0,9).attr('rowspan', rowSpanCount);
        			//docFragment.children('tr').eq(rowSpanCount*-1).children('td').slice(11,14).attr('rowspan', rowSpanCount);
        			rowSpanCount = 1;
        		}
        	} else rowSpanCount++;
        	salesCode = currSalesCode;
        	
            total_contract_price += Number(keyValue.tsi_contract_price) || 0;
            total_contract_vat += Number(keyValue.tsi_contract_vat) || 0;
            total_sprice += Number(keyValue.tpi_price) || 0;
            total_price_vat += Number(keyValue.tpi_price_vat) || 0;

            /*
            resultData = '<td class="list_check">';
            resultData += '<input type="checkbox" name="mainListCheckBox' + index + '" id="mainListCheckBox' + index + '" class="mainListCheckBox checkbox" check_name="mainList"/> <label for="mainListCheckBox' + index + '"></label>';
            resultData += "</td>";
            */
            resultData = '<td class="list_check">';
            resultData += '<input type="checkbox" name="mainListCheckBox' + index + '" id="mainListCheckBox' + index + '" class="mainListCheckBox checkbox" check_name="mainList"/> <label for="mainListCheckBox' + index + '"></label>';
            resultData += "</td>";
            resultData += '<td class="list_num">' + (index + (pageIndex - 1) * CONTRACT_PAGE_LIST) + "</td>"; //순번
            if(keyValue.tsi_confirm_level == 0) resultData += "<td><span class='confirm_level_0'>영업관리<span></td>";
            else if(keyValue.tsi_confirm_level == 1) resultData += "<td><span class='confirm_level_1'>계약전<span></td>";
            else if(keyValue.tsi_confirm_level == 2) resultData += "<td><span class='confirm_level_2'>계약관리<span></td>";
            else if(keyValue.tsi_confirm_level > 2) resultData += "<td><span class='confirm_level_3'>계약완료<span></td>";

            //if(rowSpanCount == 1) {
            	resultData += '<td class="list_term_C">';
            	resultData += '<div class="date_wrap">';
            	resultData += "<p>" + keyValue.tsi_bus_starttm + "</p>";
            	resultData += "<p>" + keyValue.tsi_bus_endtm + "</p>";
            	resultData += "</div>";
            	resultData += "</td>";
            	resultData += '<td class="list_section">' + (keyValue.tsi_contract_date || "") + "</td>"; //계약일자
            	resultData += "<td>" + (keyValue.tsi_demand_name || "") + "</td>"; //수요처
            	resultData += '<td class="list_orderer">' + (keyValue.tsi_order_name || "") + "</td>"; //발주처
            	resultData += '<td class="list_Bname" style="width: 360px">'; //사업명
            	resultData += '<a href="#" class="btn_info_change contract_info" confirm_level=' + keyValue.tsi_confirm_level + " sales_code=" + keyValue.tsi_code + ">" + keyValue.tsi_bus_name + "</a>";
            	resultData += "</td>";
                // console.log('keyValue.work_count=',keyValue.work_count, 'keyValue.purchase_count=',keyValue.purchase_count)
            	if (keyValue.tsi_confirm_level > 0) {
                	if(keyValue.work_count > 0 || keyValue.purchase_count > 0) {
                		resultData += '<td><span class="purchase_icon purchase_info" sales_code=' + keyValue.tsi_code + ' data-purchase="o">매입</span></td>"';
                	} else {
                		resultData += '<td></td>';
                	}
                } else resultData += '<td></td>'; //매입 모달 내용 없는거 sales_code=0 ,  data-purchase="x"
            	resultData += "<td>" + numberWithCommas(parseInt(keyValue.tsi_contract_price || 0)) + "</td>";
            	resultData += "<td>" + numberWithCommas(parseInt(keyValue.tsi_contract_vat || 0)) + "</td>";
            //}
            resultData += "<td>" + numberWithCommas(parseInt(keyValue.tpi_price || 0)) + "</td>";
            resultData += "<td>" + numberWithCommas(parseInt(keyValue.tpi_price_vat || 0)) + "</td>";
            // resultData += '<td><span class="purchase_icon purchase_info" sales_code=' + keyValue.tsi_code + " contract_code=" + (keyValue.tci_code || 0) + " data-purchase='o'></span></td>";
            resultData += "<td>" + (keyValue.tpi_response_date || "") + "</td>";
            resultData += "<td>" + (keyValue.tpi_sales_type || "") + "</td>";
            //if(rowSpanCount == 1) {
            	resultData += "<td>" + (keyValue.tst_name || "") + "</td>";
//            	resultData += "<td>" + (keyValue.tsi_contract_no || "") + "</td>";
            	resultData += "<td>" + (keyValue.tpc_name || "") + "</td>"; //업체명
            //}
            // resultData += "<td>" + (keyValue.tsi_send_contract == 1 ? "발송" : "미발송") + "</td>";
            let send_type = (keyValue.tsi_send_contract || 0) == 1?"발송":"미발송";
            resultData += '<td class="sendType" send_type=' + (keyValue.tsi_send_contract || 0) + "><span class='icon'>" + send_type + "</span></td>";
            
            // resultData += "<td>" + (keyValue.tpi_collection == 1 ? "수금완료" : "수금전") + "</td>";
            let pay_collect = (keyValue.tpi_collection || 0) == 1?"수금완료":"수금전";
            resultData += '<td class="payCollect" pay_collect=' + (keyValue.tpi_collection || 0) + "><span class='icon'>" + pay_collect + "</span></td>";
            /*
            // resultData += "<td>" + (keyValue.tpc_name || "") + "</td>";
            // resultData += "<td><span class="icon+(keyValue.tsi_send_contract == 1 ? "발송" : "미발송")+"></span></td>";
            resultData += '<td class="list_send"><span title="' + (keyValue.tsi_send_contract == 1 ? " 발송" : "미발송") + '"class="icon ' + (keyValue.tsi_send_contract == 1 ? " send" : " notSend") + '"></span></td>';
            // resultData += '<td class="list_payment"><span title="' + (keyValue.tpi_collection == 1 ? "수금완료" : "수금전") + '"class="icon ' + (keyValue.tpi_collection == 1 ? "payment" : "unpayment") + '"></span></td>';
            resultData += "<td pay_collect=" + payCollect + ' class="payCollect"><span class="icon"></span></td>"';
            resultData += '<td class="list_agreement"><span title="' + (keyValue.tsi_confirm_level >= 2 ? "계약완료" : "계약전") + '"class="icon ' + (keyValue.tpi_collection == 1 ? "agreement" : "disagree") + '"></span></td>';
            */
            resultData = '<tr class="list_row">' + resultData + "</tr>";
            docFragment.append(resultData);
            /*
            $(".mainListCheckBox").last().on("click", function () {
                checkCallbackFunc("mainList");
            });
            */
            index++;
        }
        // if(currSalesCode != salesCode) {
    		// if(rowSpanCount != 1) {
    		//	docFragment.children('tr').eq(rowSpanCount*-1).children('td').slice(0,9).attr('rowspan', rowSpanCount);
    		//	docFragment.children('tr').eq(rowSpanCount*-1).children('td').slice(11,14).attr('rowspan', rowSpanCount);
    			rowSpanCount = 1;
    		// }
    	// }
        mainList.find("tbody").append(docFragment);
        $("#total_contract_price").text(numberWithCommas(Number(total_contract_price)));
        $("#total_contract_vat").text(numberWithCommas(Number(total_contract_vat)));
        $("#total_sprice").text(numberWithCommas(Number(total_sprice)));
        $("#total_price_vat").text(numberWithCommas(Number(total_price_vat)));
        // console.log("total_contract_price=", total_contract_price);
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
        if (checkedList.length === 0) {
            alert("선택된 리스트가 없습니다.");
        } else {
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

    // -------------------------------------------------------------------------
    //  계약 모달
    // -------------------------------------------------------------------------
    // 계약 모달에서 관리자폼 나오게
    $("#contract_admin").click(function () {
        $("#modalContractAdmin").show();
    });
    $("#bill_info_save").click(function () {
        action_popup.confirm("관리자 계약관리 정보를 저장하시겠습니까?", function (res) {
            if (res) {
                changePopupMessage("처리가 완료되었습니다.");
            }
        });
    });
    $("#formAdmin_close").click(function () {
        $("#modalContractAdmin").hide();
    });
    //탭메뉴(계약금,기성금)
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

    /*
    modal.find(".info_nextstep, .info_prevstep").click(function () {
        let tagInfo = $(this).val() == 1 || $(this).val() == -1 ? modal.find("#btn_info_edit") : modal.find("#contract_info_edit");

        salesLevelChange(tagInfo, $(this).val());
    });
    */
    
    //모달창 열기(기존)
    $(document).on("click", ".btn_info_change", function () {
        let salesCode = $(this).attr("sales_code") || 0;
        if (salesCode <= 0) return;

        if (gLoginLevel > MANAGERLEVEL) modal.find("#info_prevstep").show();
        else modal.find("#info_prevstep").hide();

        modal.find(".modal_main > div").hide();
        modal.show();

        initContractTabBtn();
        modal.find("#modalContractAdmin").hide(); //관리자모달 닫기

        detailContractInfo(salesCode, $(this));

        modal.find(".modal_admin_content").show();
        modal.find(".modal_wrap").css("width", "1147px");
        modal.find(".modal_top > b").text("계약 수정");
        modal.find("#new_contract_form").show();
        // modal.find("#contract_info_save").hide();
    });
    
    $("#contract_info_save").click(function() {
    	let writeUser = $(this).attr("write_user") || 0;
    	let salesCode = $(this).attr("sales_code") || 0;
    	let confirmLevel = $(this).attr("confirm_level") || 0;
    	if (gLoginLevel <= COMMONLEVEL) {
            alert("권한이 없어 처리할 수 없습니다.");
            return;
        } else if(gLoginLevel == MANAGERLEVEL && gLoginCode != writeUser) {
        	alert("저장 권한이 없어 처리할 수 없습니다.");
        	return;
        }
    	
    	let rootFormTag = $("#formContractInfo");
        let index = rootFormTag.find("#contractCompany option").index(rootFormTag.find("#contractCompany option:selected"));
        if (index <= 0) {
            alert("계약업체를 선택하여 주십시요");
            return;
        }
        index = rootFormTag.find("#contractUserCate option").index(rootFormTag.find("#contractUserCate option:selected"));
        if (index <= 0) {
        	alert("구분을 선택하여 주십시요");
        	return;
        }
        if(!rootFormTag.find("#contractDate").val()) {
        	alert("계약일자를 선택하여 주십시요");
        	return;
        }
        if(!rootFormTag.find("#contractDemand").val()) {
        	alert("수요처를 입력햐여 주십시요");
        	return;
        }
        if(!rootFormTag.find("#contractOrder").val()) {
        	alert("발주처를 입력햐여 주십시요");
        	return;
        }
        if(!rootFormTag.find("#contractBusName").val()) {
        	alert("사업명을 입력햐여 주십시요");
        	return;
        }
        if(!rootFormTag.find("#contractPrice").val()) {
        	alert("계약금을 입력햐여 주십시요");
        	return;
        }
        if(!rootFormTag.find("#contractBusSTime").val() || !rootFormTag.find("#contractBusETime").val()) {
        	alert("사업기간을 선택햐여 주십시요");
        	return;
        }
        $("#compltedList tbody tr").each(function () {
            let contractReadyMoneyItem = {};
            contractReadyMoneyItem.payCompanyCode = $(this).find("td:eq(2) a").attr("pay_company_code") || 0;
            contractReadyMoneyItem.payContractType = $(this).find("td:eq(2) a").attr("contract_paytype");
            contractReadyMoneyItem.payContractPrice = $(this).find("td:eq(3)").text();
            contractReadyMoneyItem.payContractPriceVat = $(this).find("td:eq(4)").text();
            contractReadyMoneyItem.contractSalesType = $(this).find("td:eq(5)").text();
            contractReadyMoneyItem.contractRequestBillDate = $(this).find("td:eq(6)").text();
            contractReadyMoneyItem.payCheck = $(this).find("td:eq(7)").attr("pay_check") || 0;
            contractReadyMoneyItem.payBillType = $(this).find("td:eq(8)").attr("bill_type") || 0;
            contractReadyMoneyItem.contractResponseBillDate = $(this).find("td:eq(9)").text();
            contractReadyMoneyItem.contractMemo = $(this).find("td:eq(10) span").attr("memo");
            contractReadyMoneyItem.payCollect = $(this).find("td:eq(11)").attr("pay_collect") || 0;
            contractReadyMoneyItem.confirmLevel = confirmLevel;
            contractReadyMoney.push(contractReadyMoneyItem);
        });

        action_popup.confirm("입력하신 내용을 등록하시겠습니까?", function (res) {
            if (res) {
                let formData = new FormData(rootFormTag[0]);
                formData.set("confirmLevel", confirmLevel);
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
                                .html("<p>" + rootFormTag.find("#contractBusSTime").val() + rootFormTag.find("#contractBusETime").val() + "</p>");
                            list.find("#list_contract_info")
                                .find("tr")
                                .eq(parentTagIndex)
                                .find("td")
                                .eq(7)
                                .find("div")
                                .html("<p>" + rootFormTag.find("#contractServiceSTime").val() + rootFormTag.find("#contractServiceETime").val() + "</p>");
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

    $("#contract_info_prevstep").click(function () {
        let salesCode = $(this).attr("sales_code") || 0;
        if (salesCode <= 0) {
            alert("처리할 데이터가 선택되지 않았습니다.");
            return;
        }
        let confirmLevel = $(this).attr("confirm_level") || 0;
        confirmLevel--;
        if (confirmLevel < 0) {
            alert("이전 단계로 이동할 수 없습니다.");
            return;
        }
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

                listRevenueInfo(1, 1);
                modal.hide();
            }
        });
    });

    function initContractTabBtn() {
        contract_tabBtn.removeClass("active");
        contract_tabItem.hide();
        contract_tabBtn.eq(0).addClass("active");
        contract_tabItem.eq(0).show();
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
            resultData += '<td class="">' + (keyValue.tpp_price || "") + "</td>"; //금액
            resultData += '<td class="">' + (keyValue.tpp_price_vat || "") + "</td>"; //금액
            resultData += '<td class="">' + (keyValue.tpp_rate || "") + "</td>"; //매출구분
            // resultData += '<td class="" bill_type=' + keyValue.tpi_pay_type + ">" + (keyValue.tpp_pay_type == 1 ? "발행완료" : "발행전") + "</td>";
            resultData += '<td class=""><span class="icon" memo_code="' + (keyValue.tpp_memo === "" ? 0 : 1) + '" memo="' + keyValue.tpp_memo + '"></span></td>';
            resultData += '<td class=""><button type="button" class="btn_modalList_del"></button></td>';
            resultData += "</tr>";
            $("#productList").append(resultData);
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
        // rootTag.find("#btn_edit_product").attr("tr_index", $(this).closest("tr").index());
    });

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
        // rootTag.find("#btn_edit_work").attr("tr_index", $(this).closest("tr").index());
    });

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

        modal.find("#contract_info_prevstep").attr("confirm_level", resultJson.detail_data.tsi_confirm_level);
        modal.find("#contract_info_prevstep").attr("write_user", resultJson.detail_data.tsi_tmicode);
        modal.find("#contract_info_prevstep").attr("write_group", resultJson.detail_data.tsi_tgicode);
        modal.find("#contract_info_prevstep").attr("sales_code", resultJson.detail_data.tsi_code);
        modal.find("#contract_info_prevstep").attr("index_tag", self.closest("tr").index());

        modal.find("#contract_info_save").attr("confirm_level", resultJson.detail_data.tsi_confirm_level);
        modal.find("#contract_info_save").attr("write_user", resultJson.detail_data.tsi_tmicode);
        modal.find("#contract_info_save").attr("sales_code", resultJson.detail_data.tsi_code);
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
                resultData += '<td class="">' + (keyValue.tpi_request_date || "") + "</td>"; //요청날짜
                // resultData += '<td class="" bill_type=' + keyValue.tpi_pay_type + ">" + (keyValue.tpi_pay_type == 1 ? "발행완료" : "발행전") + "</td>";
                // resultData += '<td class="billType" bill_type=' + (keyValue.tpi_pay_type || 0) + "><span class='icon'></span></td>";
                let bill_type = (keyValue.tpi_pay_type || 0) == 1?"발행완료":"발행전";
                resultData += '<td class="billType" bill_type=' + (keyValue.tpi_pay_type || 0) + "><span class='icon'>" + bill_type + "</span></td>";
                resultData += '<td class="">' + (keyValue.tpi_response_date || "") + "</td>"; //발행날짜
                resultData += '<td class=""><span class="icon" memo_code="' + (keyValue.tpi_etc === "" ? 0 : 1) + '" memo="' + keyValue.tpi_etc + '"></span></td>'; //메모
                // resultData += '<td class="" pay_collect=' + (keyValue.tpi_collection || 0) + ">" + (keyValue.tpi_collection == 1 ? "수금완료" : "수금전") + "</td>";
                resultData += "<td pay_collect=" + (keyValue.tpi_collection || 0)  + ' class="payCollect"><span class="icon"></span></td>"';
                resultData += '<td class="">';
                resultData += '<button type="button" class="btn_modalList_del"></button>';
                resultData += "</td>";
                resultData += "</tr>";
                $("#compltedList tbody").append(resultData);
            }
        }

        modal.find("#new_contract_form").show();
    }
    
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

    function initContractModal() {
        let rootTag = modal.find("#new_contract_form");
        rootTag.find('input[type="text"]').val("");
        rootTag.find('input[type="date"]').val("");
        rootTag.find("#contract1Preview").children().remove();
        rootTag.find("#contract2Preview").children().remove();
        rootTag.find("#contract3Preview").children().remove();
        rootTag.find("#contractEditorUser").html("");
        rootTag.find("#contract1FileInput").val("");
        rootTag.find("#contract2FileInput").val("");
        rootTag.find("#contract3FileInput").val("");
        rootTag.find("#contractUserCate").prop("selectedIndex", 0);
        if (modal.find(".btn_nextStep").attr("write_user")) modal.find(".btn_nextStep").removeAttr("write_user");
        if (modal.find(".btn_nextStep").attr("write_goup")) modal.find(".btn_nextStep").removeAttr("write_goup");
        if (modal.find(".btn_nextStep").attr("sales_code")) modal.find(".btn_nextStep").removeAttr("sales_code");
        if (modal.find(".btn_nextStep").attr("pay_code")) modal.find(".btn_nextStep").removeAttr("pay_code");

        modal.find("#contract1Preview").removeAttr("del_file");
        modal.find("#contract2Preview").removeAttr("del_file");
        modal.find("#contract_info_edit").removeAttr("index_tag");

        $("#compltedList tbody").children().remove();
        $("#payContractType").prop("selectedIndex", 0);
        $("#payContractPrice").val("");
        $("#payContractPriceVat").val("");
        $("#contractRequestBillDate").val("");
        $("#contractSalesEtc").val("");
    }

    function initContractReadyMoney() {
        $("#companyName").prop("selectedIndex", 0);
        $("#payContractType").prop("selectedIndex", 0);
        $("#contractRequestBillDate").val("");
        $("#payContractPrice").val("");
        $("#payContractPriceVat").val("");
        $("#contractSalesEtc").val("");
        $("#contractReadyMoneyMemo").val("");
        modal.find(".btn_nextStep").removeAttr("pay_code");
    }

    function initPurchaseProductInfo() {
        let rootTag = modal.find("#productModal");
        rootTag.find('input[type="text"]').val("");
        rootTag.find("#productCompanyInfo").prop("selectedIndex", 0);
        rootTag.find("#productName").prop("selectedIndex", 0);
        // rootTag.find("#productFileInput").val("");
        // rootTag.find("#productList").children().remove();
    }

    // -------------------------------------------------------------------------
    //  매입 모달
    // -------------------------------------------------------------------------

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

        initPurchaseProductInfo();
        initPurchaseWorkInfo();

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

    //탭메뉴활성화초기화(물품구매, 설치공사하도급)
    function initpurchaseTabBtn() {
        purchase_tabBtn.removeClass("active");
        purchase_tabItem.hide();
        purchase_tabBtn.eq(0).addClass("active");
        purchase_tabItem.eq(0).show();
    }

    // 매입정보 저장
    $("#purchase_info_save").click(function () {
        let salesCode = $(this).attr("sales_code") || 0;
        if (salesCode <= 0) {
            alert("계약정보를 선택하여 주십시요");
            return;
        }

        let contractCode = $(this).attr("contract_code");
        let rootFormTag = $("#formPurchaseInfo");
        let purchaseProductInfo = [];
        $("#productList tr").each(function () {
            let productInfoItem = {};
            productInfoItem.productCompany = $(this).find("td:eq(1)").text();
            productInfoItem.productName = $(this).find("td:eq(2)").text();
            productInfoItem.productCount = $(this).find("td:eq(3)").text() || 0;
            productInfoItem.productPrice = $(this).find("td:eq(4)").text();
            productInfoItem.productPriceVat = $(this).find("td:eq(5)").text();
            productInfoItem.productMemo = $(this).find("td:eq(6)").text();
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
            workInfoItem.workMemo = $(this).find("td:eq(6)").text();
            purchaseWorkInfo.push(workInfoItem);
        });

        action_popup.confirm("입력하신 내용을 등록하시겠습니까?", function (res) {
            if (res) {
                let formData = new FormData(rootFormTag[0]);
                formData.set("productInfo", JSON.stringify(purchaseProductInfo));
                formData.set("workInfo", JSON.stringify(purchaseWorkInfo));
                formData.set("salesCode", salesCode);
                formData.set("contractCode", contractCode);
                formData.set("imgFolderName", "phuchase");
                formData.set("delFiles", rootFormTag.find("#productPreview").attr("del_file") || "");

                let resultJson = axFormdataCallFunction("savePurchaseInfo", formData, false);
                if (!resultJson) return;
                if (resultJson == -99) {
                    changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                    window.location.href = "login";
                    return;
                } else {
                    changePopupMessage("처리가 완료되었습니다.", modal);
                }
            } else {
                changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
            }
        });
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
                    listRevenueInfo(1, 1);
                }
            }
        });
    });

    // function initPayBill() {
    //     let rootTag = modal.find(".modal_admin_content");
    //     rootTag.find('input[type="text"]').val("");
    //     rootTag.find('input[type="date"]').val("");
    //     rootTag.find("#payContractCompany").prop("selectedIndex", 0);
    //     rootTag.find("input[name='payCollect']").prop("checked", false);
    //     rootTag.find("input[name='billType']").prop("checked", false);
    //     rootTag.find("#contractEditorAdmin").html("");
    //     modal.find(".btn_nextStep").removeAttr("pay_code");
    // }

    // -------------------------------------------------------------------------
    //  첨부파일 미리보기(개별)
    // -------------------------------------------------------------------------
    // fileInputHandeler("business");
    // fileInputHandeler("contract1");
    //fileInputHandeler("work");

    // fileInputHandeler("contract2");
    // fileInputHandeler("product", purchaseFileInfo);
    // /*fileInputHandeler("contract3");
    // fileInputHandeler("complted");
    // fileInputHandeler("purchase1");
    // fileInputHandeler("purchase2");
});
