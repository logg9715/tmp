"use district";

$(document).ready(function () {
    const top_content = $(".top_content");
    const list = $(".list");
    const bottom_content = $(".bottom_content");
    const modal = $(".modal");
    const body = $("body");

    //메뉴 active
    // 모든 li 요소에서 active 클래스 제거
    $(".main_nav > ul > li").removeClass("active");
    const main_2dep_menu = $(".main_2dep li");
    main_2dep_menu.removeClass("active");

    initReadyFunc();

    /*
     *  최초 페이지가 시작할 때 동작
     */
    function initReadyFunc() {
        listGroupInfo();
        listManagerInfo();
    }

    top_content.find("#searchData").keydown(function (key) {
        if (key.keyCode == 13) {
            event.preventDefault();
            listManagerInfo();
        }
    });

    top_content.find("#btn_search").click(function () {
        listManagerInfo();
    });

    function initUserInfoForm() {
        let rootTag = $("#form_user_info");
        rootTag.find('input[type="text"]').val("");
        rootTag.find('input[type="password"]').val("");
        rootTag.find("#edit_user_level").prop("selectedIndex", 0);
        rootTag.find("#edit_user_group").prop("selectedIndex", 0);
        modal.find("#btn_info_edit").removeAttr("attr_user_code");
        modal.find("#btn_info_edit").removeAttr("sel_tr");
    }

    //계약업체관리 폼 초기화
    function $initContractorForm() {
        let rootTag = $("#contractor_management_form");
        rootTag.find("input[type='text']").val("");
        rootTag.find("tbody").empty();
    }

    //구분항목관리 폼 초기화
    function $initSectionForm() {
        let rootTag = $("#section_management_form");
        rootTag.find("input[type='text']").val("");
        rootTag.find("tbody").empty();
    }

    function listGroupInfo() {
        $("#edit_user_group").children("option:not(:first)").remove();

        let resultJson = axCallFunction("listGroupInfo", "", false);
        if (!resultJson) return;

        for (let keyValue of resultJson) {
            $("#edit_user_group").append('<option value="' + keyValue.tgi_code + '">' + keyValue.tgi_name + "</option>");
        }
    }

    function listManagerInfo() {
        list.find("tbody").children().remove();

        let searchType = top_content.find("#searchType").val();
        let searchData = top_content.find("#searchData").val();
        let sendData = { searchType: searchType, searchData: searchData };
        let resultJson = axCallFunction("listManagerInfo", sendData, false);

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
            resultData += '<td class="list_setUser_level" data-level="' + keyValue.levelName + '">' + keyValue.levelName + "</td>";
            resultData += '<td class="list_setUser_id">' + keyValue.tgi_name + "</td>";
            resultData += '<td class="list_setUser_name"><a href="#none" class="btn_info_change setUser_info" user_code=' + keyValue.tmi_code + ">" + keyValue.tmi_name + "</a></td>";
            resultData += '<td class="list_setUser_id">' + keyValue.tmi_id + "</td>";
            resultData += '<td class="list_setUser_email">' + (keyValue.tmi_email + "") + "</td>";
            resultData += '<td class="list_setUser_cp1">' + (keyValue.tmi_tel + "") + "</td>";
            resultData += '<td class="list_setUser_cp2">' + (keyValue.tmi_tel1 || "") + "</td>";
            resultData += '<td class="list_setUser_date">' + keyValue.regDate + "</td>";
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
        modal.find("#btn_info_add").hide();
        modal.find("#btn_info_edit, #btn_info_Del").show();
        if (clickedBtnClass === "btn_info_change setUser_info") {
            let userCode = $(this).attr("user_code");
            let sel_tr = $(this).closest("tr").index();
            detailUserInfo(userCode, sel_tr);

            modal.find(".modal_top > b").text("사용자 정보 수정");
            modal.find("#edit_setUser_form").show();
            modal.show();
        }
        /*
        let target_tr = $(this).parents("tr");
        modal.find("#edit_user_level").val(target_tr.find(".list_setUser_level").text());
        modal.find("#edit_user_name").val(target_tr.find(".setUser_info").text());
        modal.find("#edit_user_id").val(target_tr.find(".list_setUser_id").text());
        modal.find("#edit_user_cp").val(target_tr.find(".list_setUser_cp").text());
        modal.find("#edit_user_cp2").val(target_tr.find(".list_setUser_cp2").text());
        modal.find("#sampleEditor").val(target_tr.find(".list_setUser_note").text());
        */
    });

    function detailUserInfo(userCode, sel_tr) {
        if (userCode <= 0) {
            alert("데이터를 선택하여 주십시요");
            return;
        }
        let sendData = { userCode: userCode };
        let resultJson = axCallFunction("detailUserInfo", sendData, false);
        if (!resultJson) return;

        let rootTag = $("#form_user_info");

        rootTag.find("#edit_user_level").val(resultJson.tmi_level).prop("selected", true);
        let idx = rootTag.find("#edit_user_level option").index(rootTag.find("#edit_user_level option:selected"));
        if (idx < 0) rootTag.find("#edit_user_level option").eq(0).prop("selected", true);
        rootTag.find("#edit_user_name").val(resultJson.tmi_name || "");
        rootTag.find("#edit_user_id").val(resultJson.tmi_id || "");
        rootTag.find("#edit_user_pwd").val(resultJson.tmi_pwd || "");
        rootTag.find("#edit_user_group").val(resultJson.tmi_tgicode).prop("selected", true);
        idx = rootTag.find("#edit_user_group option").index(rootTag.find("#edit_user_group option:selected"));
        if (idx < 0) rootTag.find("#edit_user_group option").eq(0).prop("selected", true);
        rootTag.find("#edit_user_email").val(resultJson.tmi_email || "");
        rootTag.find("#edit_user_cp1").val(resultJson.tmi_tel || "");
        rootTag.find("#edit_user_cp2").val(resultJson.tmi_tel1 || "");
        modal.find("#btn_info_edit").attr("attr_user_code", userCode);
        modal.find("#btn_info_edit").attr("sel_tr", sel_tr);
    }

    modal.find("#btn_info_add, #btn_info_edit").click(function () {
        let rootTag = $("#form_user_info");
        let selId = $(this).attr("id");
        let userCode = 0;
        if (selId == "btn_info_edit") {
            userCode = $(this).attr("attr_user_code");
            if (userCode <= 0) {
                alert("데이터를 선택하여 주십시요");
                return;
            }
        }
        if (rootTag.find("#edit_user_level").val() <= 0) {
            alert("권한을 선택하여 주십시요");
            return;
        }
        if (rootTag.find("#edit_user_name").val() == "") {
            alert("이름을 입력하여 주십시요");
            return;
        }
        let loginId = rootTag.find("#edit_user_id").val().trim();
        if (loginId == "") {
            alert("아이디를 입력하여 주십시요");
            return;
        }
        let isContain = logincontainsSpecialCharacters(loginId);
        if (isContain) {
            alert("아이디 또는 비밀번호에 < 또는 > 문자는 사용할 수 없습니다.");
            return false;
        }

        let loginPwd = rootTag.find("#edit_user_pwd").val().trim();
        if (loginPwd == "") {
            alert("비밀번호를 입력하여 주십시요");
            return;
        }

        isContain = logincontainsSpecialCharacters(loginPwd);
        if (isContain) {
            alert("아이디 또는 비밀번호에 < 또는 > 문자는 사용할 수 없습니다.");
            return false;
        }

        let num = loginPwd.search(/[0-9]/g);
        let eng = loginPwd.search(/[a-z]/gi);
        let spe = loginPwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

        if (loginPwd.length < 9 || loginPwd.length > 16) {
            alert("9자리 ~ 16자리 이내로 입력해주세요.");
            return false;
        } else if (loginPwd.search(/\s/) != -1) {
            alert("비밀번호는 공백 없이 입력해주세요.");
            return false;
        } else if (num < 0 || eng < 0 || spe < 0) {
            alert("영문,숫자, 특수문자를 혼합하여 입력해주세요.");
            return false;
        }

        if (rootTag.find("#edit_user_group").val() <= 0) {
            alert("부서를 선택하여 주십시요");
            return;
        }
        if (rootTag.find("#edit_user_email").val() == "") {
            alert("이메일을 입력하여 주십시요");
            return;
        }
        let formData = rootTag.serialize();
        formData += "&userCode=" + userCode;

        action_popup.confirm("사용자 정보를 저장하시겠습니까?", function (res) {
            let resultJson = axCallFunction("saveUserInfo", formData, false);
            if (resultJson <= 0) {
                if (resultJson == -99) {
                    changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                    window.location.href = "login";
                } else if (resultJson == -2) {
                    changePopupMessage("이미 등록된 아이디입니다.", modal);
                } else changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                return;
            } else {
                changePopupMessage("처리가 완료되었습니다.", modal);
                if (userCode > 0) {
                    let sel_tr = modal.find("#btn_info_edit").attr("sel_tr");

                    if (sel_tr) {
                        list.find("tbody tr").eq(sel_tr).find("td:eq(1)").data("level", rootTag.find("#edit_user_level option:selected").text());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(1)").text(rootTag.find("#edit_user_level option:selected").text());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(2)").text(rootTag.find("#edit_user_group option:selected").text());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(3) a").text(rootTag.find("#edit_user_name").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(4)").text(rootTag.find("#edit_user_id").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(5)").text(rootTag.find("#edit_user_email").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(6)").text(rootTag.find("#edit_user_cp1").val());
                        list.find("tbody tr").eq(sel_tr).find("td:eq(7)").text(rootTag.find("#edit_user_cp2").val());
                    }
                } else listManagerInfo();
                initUserInfoForm();
            }
        });
    });

    //열린 모달창(기존) 정보삭제
    modal.find("#btn_info_Del").click(function () {
        action_popup.confirm("정보를 삭제하시겠습니까?", function (res) {
            if (res) {
                let userCode = $("#btn_info_edit").attr("attr_user_code");
                let sendData = { userCode: userCode };
                let resultJson = axCallFunction("removeUserInfo", sendData, false);
                if (resultJson <= 0) {
                    if (resultJson == -99) {
                        changePopupMessage("로그인을 먼저 하여 주십시요", modal);
                        window.location.href = "login";
                    } else changePopupMessage("처리 중 오류가 발생하였습니다.", modal);
                    return;
                } else {
                    changePopupMessage("처리가 완료되었습니다.", modal);
                    initUserInfoForm();
                    listManagerInfo();
                }
            }
        });
    });

    //모달창 열기(신규)
    top_content.find(".btn_modal_show").click(function () {
        let clickedBtnId = $(this).attr("id");

        modal.find(".modal_main > div").hide();
        modal.show();
        modal.find(".modal_bottom , #btn_info_add").show();
        modal.find("#btn_info_edit , #btn_info_Del").hide();
        if (clickedBtnId === "btn_setUser_N") {
            initUserInfoForm();
            modal.find(".modal_top > b").text("사용자 신규 등록");
            modal.find("#edit_setUser_form").show();
        } else if (clickedBtnId === "btn_section_management") {
            $initSectionForm();
            modal.find(".modal_bottom").hide();
            modal.find(".modal_top > b").text("구분 항목 관리");
            modal.find("#section_management_form").show();
            $listSectionInfo()
        } else if (clickedBtnId === "btn_contractor_management") {
            $initContractorForm();
            modal.find(".modal_bottom").hide();
            modal.find(".modal_top > b").text("계약 업체 관리");
            modal.find("#contractor_management_form").show();
            $listcontractorInfo()
        }
    });
    
function $listSectionInfo(){
    const resultData = [
        {section : "물품 계약"},
        {section : "지급자 재계약"},
        {section : "공사 계약"},
        {section : "물품 계약"},
    ]
    for(let keyValue of resultData){
        let resultData = '';
        let index = 1;
        let rootTag = $('#sectionList')
        resultData = '<tr><td>'+index+'</td><td>'+keyValue.section+'</td></tr>'
        rootTag.append(resultData);
    }
}
function $listSectionInfo(){
    const resultData = [
        {section : "물품 계약"},
        {section : "지급자 재계약"},
        {section : "공사 계약"},
        {section : "물품 계약"},
    ]
    let index = 1;
    for(let keyValue of resultData){
        let resultData = '';
        let rootTag = $('#sectionList')
        resultData = '<tr><td>'+index+'</td><td>'+keyValue.section+'</td></tr>'
        rootTag.append(resultData);
        index++
    }
}
function $listcontractorInfo(){
    const resultData = [
        {contractor : "윈투스 시스템"},
        {contractor : "이노뎁"},
        {contractor : "디지털라인"},
        {contractor : "나라이엔씨"},
    ]
    let index = 1;
    for(let keyValue of resultData){
        let resultData = '';
        let rootTag = $('#contractorList')
        resultData = '<tr><td>'+index+'</td><td>'+keyValue.contractor+'</td></tr>'
        rootTag.append(resultData);
        index++
    }
}

    // -------------------------------------------------------------------------
    // 리스트
    // -------------------------------------------------------------------------

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
    // -------------------------------------------------------------------------
    // 가입신청
    // -------------------------------------------------------------------------

    //아이디 중복확인
    modal.find("#btn_doubleCheck").on("click", function () {
        let doubleCheck_id = modal.find("#user_id_input").val();
        if ((doubleCheck_id == "admin") | (doubleCheck_id == "user")) {
            alert(`${doubleCheck_id}는 사용할 수 없는 아이디입니다.`);
            modal.find("#user_id_input").css("background-color", "rgba(255, 0, 0, 0.306)");
        } else if (doubleCheck_id === "") {
            alert("사용하실 아이디를 입력해주세요.");
        } else {
            alert(`${doubleCheck_id}는 사용가능한 아이디입니다.`);
            modal.find("#user_id_input").css("background-color", "#326ddc3e");
        }
    });

    //비밀번호 재확인
    modal.find("#user_pwd_R_input").keyup(function () {
        let pwd1 = modal.find("#user_pwd_input").val();
        let pwd2 = modal.find("#user_pwd_R_input").val();
        if (pwd1 === pwd2) {
            modal.find(".pwd_R_text").text("일치합니다.");
            modal.find(".pwd_R_text").css("color", "#326ddc");
            modal.find("#user_pwd_R_input").css("border", "");
        } else {
            modal.find(".pwd_R_text").text("불일치합니다.");
            modal.find(".pwd_R_text").css("color", "red");
            modal.find("#user_pwd_R_input").css("border", "1px solid red");
        }
    });

    /*
    //가입신청 완료버튼
    modal.find("#btn_info_add").on("click", function () {
        modal.hide();
        modal.find(".modal_content").css("height", "");
        alert("가입신청이 완료되었습니다.");
    });
    */
});
// -------------------------------------------------------------------------
// 에디터
// -------------------------------------------------------------------------
if (document.getElementById("sampleEditor") != undefined) {
    const sampleEditor = document.getElementById("sampleEditor");
    const sampleBtnBold = document.getElementById("sample-btn-bold");
    const sampleBtnUnderline = document.getElementById("sample-btn-underline");
    const sampleBtnStrike = document.getElementById("sample-btn-strike");
    const sampleBtnImage = document.getElementById("sample-btn-image");
    const sampleImgSelector = document.getElementById("sample-img-selector");
    sampleBtnBold.addEventListener("click", function () {
        setStyle("bold", sampleEditor, sampleBtnBold, sampleBtnUnderline, sampleBtnStrike);
    });
    sampleBtnUnderline.addEventListener("click", function () {
        setStyle("underline", sampleEditor, sampleBtnBold, sampleBtnUnderline, sampleBtnStrike);
    });
    sampleBtnStrike.addEventListener("click", function () {
        setStyle("strikeThrough", sampleEditor, sampleBtnBold, sampleBtnUnderline, sampleBtnStrike);
    });
    sampleEditor.addEventListener("keydown", function () {
        checkStyle(sampleBtnBold, sampleBtnUnderline, sampleBtnStrike);
    });
    sampleEditor.addEventListener("mousedown", function () {
        checkStyle(sampleBtnBold, sampleBtnUnderline, sampleBtnStrike);
    });
    sampleBtnImage.addEventListener("click", function () {
        sampleImgSelector.click();
    });
    sampleImgSelector.addEventListener("change", function (e) {
        const files = e.target.files;
        if (!!files) {
            insertImageDate(files[0], sampleEditor);
        }
    });
}
