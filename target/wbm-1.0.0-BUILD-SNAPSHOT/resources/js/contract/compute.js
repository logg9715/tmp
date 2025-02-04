"use district";

$(document).ready(function () {
    const top_content = $(".top_content");
    const list = $(".list");
    const modal = $(".modal");
    const bottom_content = $(".bottom_content");

    //메뉴 active
    // 모든 li 요소에서 active 클래스 제거
    const main_2dep_menu = $(".main_2dep li");
    main_2dep_menu.removeClass("active");
    // 클릭한 링크의 부모 li에 active 클래스 추가
    main_2dep_menu.eq(2).addClass("active");
    // -------------------------------------------------------------------------
    //  모달창
    // -------------------------------------------------------------------------

    initReadyFunc();

    function initReadyFunc() {
        listComputeInfo();
    }

    top_content.find("#searchData").keydown(function (key) {
        if (key.keyCode == 13) {
            event.preventDefault();
            listComputeInfo();
        }
    });

    top_content.find("#btn_search").click(function () {
        listComputeInfo();
    });

    function initComputeInfoForm() {
        let rootTag = $("#form_compute_info");
        rootTag.find('input[type="text"]').val("");
        rootTag.find("#text_product_count").val("0");
        modal.find("#btn_info_edit").removeAttr("attr_compute_code");
        modal.find("#btn_info_edit").removeAttr("sel_tr");

    }

    function listComputeInfo() {
        list.find("tbody").children().remove();

        let searchType = top_content.find("#searchType").val();
        let searchData = top_content.find("#searchData").val();
        let sendData = { searchType: searchType, searchData: searchData };
        let resultJson = axCallFunction("listComputeInfo", sendData, false);

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
            resultData += '<td class="list_Ppin">' + keyValue.tcc_no + "</td>";
            resultData += '<td class="list_Pname"><a href="#none" class="btn_info_change compute_info" compute_code=' + keyValue.tcc_code + ">" + keyValue.tcc_name + "</a></td>";
            resultData += '<td class="list_standard">' + keyValue.tcc_standard + "</td>";
            resultData += '<td class="list_price">' + (keyValue.tcc_price + "") + "</td>";
            resultData += '<td class="list_Pquantity">' + (keyValue.tcc_count + 0) + "</td>";
            resultData += '<td class="list_C_total">' + (keyValue.tcc_total || "") + "</td>";
            resultData += '<td class="list_Commission_R">' + keyValue.tcc_commission_rate + "</td>";
            resultData += '<td class="list_Commission">' + keyValue.tcc_commission + "</td>";

            // 비고 텍스트 30글자 초과시 말줄임표 추가
            let tccEtcMemo = truncateText(keyValue.tcc_etc, 25);
            resultData += '<td class="list_Pnote">' + tccEtcMemo + "</td>";
            // resultData += '<td class="list_Pnote">' + keyValue.tcc_etc + "</td>";

            resultData = '<tr class="list_row">' + resultData + "</tr>";
            list.find("tbody").append(resultData);

            index++;
        }
    }

    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    }

    //모달창 열기(기존)
    $(document).on("click", ".btn_info_change", function () {
        let clickedBtnClass = $(this).attr("class");

        modal.find(".modal_main > div").hide();
        modal.show();
        modal.find(".modal_bottom").show();
        modal.find("#btn_info_save").hide();
        modal.find("#btn_info_edit, #btn_info_Del, .bottom_left ").show();
        if (clickedBtnClass === "btn_info_change compute_info") {
            let computeCode = $(this).attr("compute_code");
            let sel_tr = $(this).closest("tr").index();
            detailComputeInfo(computeCode, sel_tr);

            modal.find(".modal_top > b").text("정산서 관리 수정");
            modal.find("#new_compute_form").show();
        }
    });

    function detailComputeInfo(computeCode, sel_tr) {
        if (computeCode <= 0) {
            alert("데이터를 선택하여 주십시요");
            return;
        }
        let sendData = { computeCode: computeCode };
        let resultJson = axCallFunction("detailComputeInfo", sendData, false);
        if (!resultJson) return;

        let rootTag = $("#form_compute_info");

        rootTag.find("#text_identification_no").val(resultJson.tcc_no || "");
        rootTag.find("#text_product_name").val(resultJson.tcc_name || "");
        rootTag.find("#text_standard_size").val(resultJson.tcc_standard || "");
        rootTag.find("#text_product_price").val(resultJson.tcc_price || "");
        rootTag.find("#text_product_count").val(resultJson.tcc_count || "");
        rootTag.find("#text_total_price").val(resultJson.tcc_total || "");
        rootTag.find("#text_commission_rate").val(resultJson.tcc_commission_rate || "");
        rootTag.find("#text_commission_price").val(resultJson.tcc_commission || "");
        rootTag.find("#computeEditor").html(resultJson.tcc_etc || "");
        modal.find("#btn_info_edit").attr("attr_compute_code", computeCode);
        modal.find("#btn_info_edit").attr("sel_tr", sel_tr);
    }

    //모달창 열기(신규)
    top_content.find(".btn_modal_show").click(function () {
        let clickedBtnId = $(this).attr("id");

        modal.find(".modal_main > div").hide();
        modal.show();
        modal.find(".modal_bottom").show();
        modal.find("#btn_info_save").show();
        modal.find("#btn_info_edit, #btn_info_Del, #btn_request_I, #btn_issue_I, #btn_cancel_I, .bottom_left").hide();
        if (clickedBtnId === "btn_compute_N") {
            initComputeInfoForm();

            modal.find(".modal_top > b").text("정산서 관리");
            modal.find("#new_compute_form").show();
            modal.find("#btn_info_Del").hide();
            modal.find("#computeEditor").text("");
            // console.log("모달 비고 값 = ", modal.find("#computeEditor").text());
        }
    });

    modal.find("#btn_info_save, #btn_info_edit").click(function () {
        let rootTag = $("#form_compute_info");
        let selId = $(this).attr("id");
        let computeCode = 0;
        if (selId == "btn_info_edit") {
            computeCode = $(this).attr("attr_compute_code");
            if (computeCode <= 0) {
                alert("데이터를 선택하여 주십시요");
                return;
            }
        }
        if (rootTag.find("#text_identification_no").val() == "") {
            alert("물품식별번호를 입력하여 주십시요");
            return;
        }

        if (rootTag.find("#text_product_name").val() == "") {
            alert("품명을 입력하여 주십시요");
            return;
        }

        if (!/^\d*$/.test(rootTag.find("#text_product_count").val())) {
            alert("수량에는 숫자만 입력 가능합니다.");
            return;
        }

        let formData = rootTag.serialize();
        formData += "&computeCode=" + computeCode;
        formData += "&computeEditor=" + rootTag.find("#computeEditor").html();

        action_popup.confirm("정산 정보를 저장하시겠습니까?", function (res) {
            let resultJson = axCallFunction("saveComputeInfo", formData, false);
            if (resultJson <= 0) {
                if (resultJson == -99) {
                    changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                    window.location.href = "login";
                } else changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                return;
            } else {
                changePopupMessage("처리가 완료되었습니다.", modal);
                if (computeCode > 0) {
                    let sel_tr = modal.find("#btn_info_edit").attr("sel_tr");

                    if (sel_tr) {
                        list.find("tbody tr").eq(sel_tr).find("td:eq(1)").text(rootTag.find("#text_identification_no").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(2) a").text(rootTag.find("#text_product_name").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(3)").text(rootTag.find("#text_standard_size").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(4)").text(rootTag.find("#text_product_price").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(5)").text(rootTag.find("#text_product_count").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(6)").text(rootTag.find("#text_total_price").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(7)").text(rootTag.find("#text_commission_rate").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(8)").text(rootTag.find("#text_commission_price").val());
                        // 비고 텍스트 30글자 초과시 말줄임표 추가
                        let editEtcMemo = rootTag.find("#computeEditor").html();
                        let tccEtcMemo = truncateText(editEtcMemo, 25);
                        list.find("tbody tr").eq(sel_tr).find("td:eq(9)").html(tccEtcMemo);
                        // list.find("tbody tr").eq(sel_tr).find("td:eq(9)").html(rootTag.find("#computeEditor").html());
                    }
                } else listComputeInfo();
                initComputeInfoForm();
            }
        });
    });

    //열린 모달창(기존) 정보삭제
    modal.find("#btn_info_Del").click(function () {
        action_popup.confirm("정보를 삭제하시겠습니까?", function (res) {
            if (res) {
                let computeCode = $("#btn_info_edit").attr("attr_compute_code");
                let sendData = { computeCode: computeCode };
                let resultJson = axCallFunction("removeComputeInfo", sendData, false);
                if (resultJson <= 0) {
                    if (resultJson == -99) {
                        changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                        window.location.href = "login";
                    } else changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                    return;
                } else {
                    changePopupMessage("처리가 완료되었습니다.", modal);
                    initComputeInfoForm();
                    listComputeInfo();
                }
            }
        });
    });
    //열린 모달창(기존) 리스트삭제
    modal.find(".btn_modalList_del").click(function () {
        var result = confirm("리스트를 삭제하시겠습니까?");
        if (result) {
            $(this).parents("tr").remove();
        }
    });

    //에디터
    editorHandler("computeEditor");
});
