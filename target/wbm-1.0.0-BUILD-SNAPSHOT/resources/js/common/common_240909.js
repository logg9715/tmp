"use district";

$(document).ready(function () {
    const body = $("body");
    const header = $("header");

    // -------------------------------------------------------------------------
    // 로그인 => 각페이지에 아이디 데이터 전송 [관리자, 일반 구분]
    // -------------------------------------------------------------------------

    var id_data = localStorage.getItem("더미 데이터");
    body.find(".login_data").text(id_data);
    if (id_data === "admin") {
        console.log("관리자 로그인");
        body.addClass("admin");
        body.find("#btn_request").hide();
        body.find(".modal_admin_content").show();
        body.find(".user_team").text("경영지원부");
        body.find(".user_control").text("관리자");
    } else if (id_data === "user") {
        console.log("사용자 로그인");
        body.addClass("user");
        body.find("#btn_request").toggleClass("active");
        body.find(".user_team").text("영업부");
        body.find(".user_control").text("일반");
    }

    // -------------------------------------------------------------------------
    // 사용자정보 모달 => 로그아웃
    // -------------------------------------------------------------------------
    var user_info_modal_btn = header.find(".hd_user a");
    var user_info_modal = header.find(".user_info_modal");

    user_info_modal_btn.click(function () {
        user_info_modal.toggleClass("active");
    });

    // 외부영역 클릭 시 팝업 닫기
    $(document).mouseup(function (e) {
        if (user_info_modal.has(e.target).length === 0) {
            user_info_modal.removeClass("active");
        }
    });

    //체크박스 value 바꾸기
    const InputCheck = $("input[type=checkbox]");
    InputCheck.click(function () {
        // console.log("check 누름");
        if ($(this).val() == "off") {
            $(this).attr("value", "off");
            console.log($(this).val());
        } else if ($(this).val() == "on") {
            $(this).attr("value", "on");
            // console.log($(this).val());
        }
    });

    // -------------------------------------------------------------------------
    // 페이지네이션
    // -------------------------------------------------------------------------
    PagingHelper = {
        data: {
            currentPage: 1, // 현재페이지
            startPage: 1, // 시작페이지
            pageSize: 5, // 페이지 사이즈 (화면 출력 페이지 수)
            maxListCount: 30, // (보여질)최대 리스트 수 (한페이지 출력될 항목 갯수)
            startnum: 1, // 시작 글번호
            lastnum: 10, // 마지막 글번호
            totalCnt: 0, // 전체 글의 갯수.
            totalPageCnt: 0, // 전체 페이지 수
            pageId: "#paging",
            pageFunc: null,
        },
        setOption: function (opt) {
            if (typeof opt != "object") return;
            for (key in opt) {
                if (key in this.data) {
                    this.data[key] = opt[key]; //data에 입력받은 설정값 할당.
                }
            }
        },
        pagingHtml: function (pTotalCnt) {
            let _ = this;
            _.data["totalCnt"] = pTotalCnt != undefined ? pTotalCnt : _.data["totalCnt"];
            if (_.data["totalCnt"] == 0) {
                return "";
            }
            //총페이지수 구하기 : 페이지 출력 범위 (1|2|3|4|5)
            _.data.totalPageCnt = Math.ceil(_.data.totalCnt / _.data.maxListCount);
            //현재 블럭 구하기
            let n_block = Math.ceil(_.data.currentPage / _.data.pageSize);
            //페이징의 시작페이지와 끝페이지 구하기
            let s_page = (n_block - 1) * _.data.pageSize + 1; // 현재블럭의 시작 페이지
            let e_page = n_block * _.data.pageSize; // 현재블럭의 끝 페이지

            let sb = "";
            let sbTemp = "";
            // 블럭의 페이지 목록 및 현재페이지 강조
            for (let j = s_page; j <= e_page; j++) {
                if (j > _.data.totalPageCnt) break;
                if (j == _.data.currentPage) {
                    sbTemp += "<li class='selected'>" + j + "</li>";
                } else {
                    sbTemp += "<li onclick='PagingHelper.gotoPage(" + j + ");'>" + j + "</li>";
                }
            }

            // 이전페이지 버튼
            sb = "<ul>";
            if (_.data.currentPage > s_page || (_.data.totalCnt > _.data.maxListCount && s_page > 1)) {
                sb += "<li class='first page_bt' onclick='PagingHelper.gotoPage(1);'></li>";
                sb += "<li class='previous page_bt' onclick='PagingHelper.gotoPage(" + (_.data.currentPage - 1) + ");'></li>";
            }

            // 현재블럭의 페이지 목록
            sb += sbTemp;

            // 다음페이지 버튼
            if (_.data.currentPage < _.data.totalPageCnt) {
                sb += "<li class='next page_bt' onclick='PagingHelper.gotoPage(" + (_.data.currentPage + 1) + ");'></li>";
                sb += "<li class='last page_bt' onclick='PagingHelper.gotoPage(" + _.data.totalPageCnt + ");'></li >";
            }
            sb += "</ul>";

            return sb;
        },
        makeNum: function (className, content) {
            //필요없음.
            return "<li class='" + className + "''>[" + content + "]</li>";
        },
        setStartnumEndnum: function () {
            // 시작 글번호
            this.data.startnum = (this.data.currentPage - 1) * this.data.maxListCount + 1;

            // 마지막 글번호
            let tmp = this.data.currentPage * this.data.maxListCount;
            this.data.lastnum = tmp > this.data.totalCnt ? this.data.totalCnt : tmp;
        },
        gotoPage: function (pageNum) {
            // console.log(pageNum);

            this.data.currentPage = pageNum; //입력받은 페이지번호를 현재페이지로 설정
            this.setStartnumEndnum(); //입력받은 페이지의 startnum과 endnum구하기
            this.data.pageFunc(pageNum, 0);
            $(this.data.pageId).html(this.pagingHtml());
        },
    };

    pagingStart = (allDataCount, listMaxCount, currentPage, pagingId = "#paging", pageFunc) => {
        $(pagingId).children().remove();
        PagingHelper.data.pageId = pagingId;
        PagingHelper.data.currentPage = currentPage;
        PagingHelper.data.maxListCount = listMaxCount;
        PagingHelper.data.pageFunc = pageFunc;
        $(pagingId).append(PagingHelper.pagingHtml(allDataCount));
    };

    axCallFunction = (o_url, o_data = "", async = false, callBackFunc = null) => {
        console.log("sendUrl=", o_url, ", sendData=", o_data);
        let resultData = null;
        // showSpinner();
        $.ajax({
            type: "post",
            async: async,
            url: o_url,
            datatype: "json",
            data: o_data,
            success: function (args) {
                let jsonInfo = JSON.parse(args);
                if (async) callBackFunc(jsonInfo.resultData);
                else resultData = jsonInfo.resultData;
                // console.log("resultData=", resultData);
            },
            error: function (err) {
                alert("처리 중 오류가 발생하였습니다.[" + err + "]");
            },
        });
        if (!async) return resultData;
    };

    axFormdataCallFunction = (o_url, o_data = "", async = false) => {
        // showSpinner();
        console.log("sendUrl=", o_data);
        let resultData = null;
        $.ajax({
            url: o_url,
            enctype: "multipart/form-data",
            type: "post",
            async: async,
            processData: false,
            contentType: false,
            datatype: "json",
            data: o_data,
            success: function (args) {
                let jsonInfo = JSON.parse(args);
                resultData = jsonInfo.resultData;
                console.log("resultFormData=", resultData);
            },
            error: function (err) {
                alert("처리 중 오류가 발생하였습니다.[" + err + "]");
            },
            complete: function () {
                // hideSpinner();
            },
        });
        return resultData;
    };
    //--------------------------헤더
    // URL에서 gnb_index 파라미터 값을 가져오는 함수
    function urlParam(name) {
        let results = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1] || 0;
        }
    }

    // URL에서 gnb_index 값을 가져와 해당 인덱스의 메뉴에 focus 클래스 추가
    $(".main_nav > ul > li").removeClass("active");

    let idx = urlParam("gnb_index") == null ? 0 : urlParam("gnb_index");
    // $(".main_nav > ul > li").eq(idx).addClass("active");
    // $(".main_nav > ul > li.active li").eq(0).addClass("active");
    if (idx == 0) {
        $(".main_nav > ul > li").eq(idx).addClass("active");
        $(".main_nav > ul > li.active li").eq(0).addClass("active");
    }

    // // 메뉴의 링크를 클릭했을 때 실행될 함수(이전소스)
    // $(".main_nav > ul > li.active li a").on("click", function (e) {
    //     // 기본 동작 막기 (선택 사항)
    //     e.preventDefault();

    //     // 링크가 href 속성이 있는 경우 해당 페이지로 이동
    //     const href = $(this).attr("href");
    //     if (href !== "#none") {
    //         window.location.href = href;
    //     }
    // });

    // // 메뉴의 링크를 클릭했을 때 실행될 함수(수정소스)
    $(".main_nav > ul > li.active li a").on("click", function (e) {
        // 기본 동작 막기 (선택 사항)
        e.preventDefault();

        // 클릭한 링크의 href 속성 가져오기
        const href = $(this).attr("href");

        // URL에서 현재 gnb_index 값을 가져오기
        const currentIndex = urlParam("gnb_index");

        // href에 gnb_index 파라미터 추가
        const newHref = href.includes("?") ? `${href}&gnb_index=${currentIndex}` : `${href}?gnb_index=${currentIndex}`;

        // 새로운 URL로 이동
        if (newHref !== "#none") {
            window.location.href = newHref;
        }
    });

    $(".btn_auto_calculate").click(function () {
        // 모달안의 VAT자동계산버튼
        var priceInput = $(this).siblings("input").eq(0); // 첫 번째 input (VAT 포함)
        var vatInput = $(this).siblings("input").eq(1); // 두 번째 input (VAT 별도)

        var priceValue = priceInput.val().trim().replace(/,/g, ""); // 쉼표 제거
        var vatValue = vatInput.val().trim().replace(/,/g, "");

        var isNumeric = /^\d+(\.\d+)?$/;

        if ((!isNumeric.test(priceValue) && priceValue !== "") || (!isNumeric.test(vatValue) && vatValue !== "")) {
            alert("숫자만 입력해 주세요.");
            return;
        }

        var price = parseFloat(priceValue);
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
// 컨펌창 공통
// -------------------------------------------------------------------------
let action_popup = {
    timer: 100,
    confirm: function (txt, callback) {
        $(".type-confirm .modal_confirm_ok").on("click", function () {
            $(this).unbind("click");
            callback(true);
        });
        this.open("type-confirm", txt);
    },
    alert: function (txt) {
        if (txt == null || txt.trim() == "") {
            console.warn("confirm message is empty.");
            return;
        }
    },

    open: function (type, txt) {
        $(".modal_confirm_close").show();

        var popup = $("." + type);
        popup.find(".menu_msg").find("b").html(txt);
        popup.find(".menu_msg").find("span").css("background-image", "url('/image/icon_confirm.png')");
        $("body").append("<div class='dimLayer'></div>");
        $(".dimLayer").css("height", $(document).height()).attr("target", type);
        popup.fadeIn(this.timer);
        $(".type-confirm .modal_confirm_ok").focus();
    },

    close: function (target) {
        let modal = $(target).closest(".modal-section");
        let dimLayer;
        if (modal.hasClass("type-confirm")) {
            dimLayer = $(".dimLayer[target=type-confirm]");
            $(".type-confirm .modal_confirm_ok").unbind("click");
        } else {
            return;
        }
        modal.fadeOut(this.timer);
        setTimeout(function () {
            dimLayer != null ? dimLayer.remove() : "";
        }, this.timer);
    },
};

$(".modal_confirm_close").on("click", function () {
    action_popup.close(this);
});

$(".modal_close").on("click", function () {
    $(".modal").hide();
});

function changePopupMessage(changeMsg, hideModal) {
    $(".modal_confirm_close").hide();
    $(".type-confirm .menu_msg b").html(changeMsg);
    $(".type-confirm .menu_msg span").css("background-image", "url('/image/icon_confirm.png')"); // 아이콘변경
    $(".modal_confirm_ok").on("click", function () {
        action_popup.close(this);
        hideModal.hide();
    });
}

/*
$(".modal_bottom button").click(function () {
    let clickedBtnId = $(this).attr("id");
    
    if (clickedBtnId === "btn_info_edit") {
        alert("수정 되었습니다");
    }
});
 */

//에디터 동작
function editorHandler(editorID) {
    if (document.getElementById(`${editorID}`) != undefined) {
        const sampleEditor = document.getElementById(`${editorID}`);
        const sampleBtnBold = document.getElementById(`${editorID}-btn-bold`);
        const sampleBtnUnderline = document.getElementById(`${editorID}-btn-underline`);
        const sampleBtnStrike = document.getElementById(`${editorID}-btn-strike`);
        const sampleBtnImage = document.getElementById(`${editorID}-btn-image`);
        const sampleImgSelector = document.getElementById(`${editorID}-img-selector`);
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

    const setStyle = function (style, editor, btnBold, btnUnderline, btnStrike) {
        if (document.queryCommandSupported(style)) {
            document.execCommand(style, false, true);
        } else {
            alert("현재 버전은 적용되지 않습니다.");
            return;
        }
        focusEditor(editor);
        checkStyle(btnBold, btnUnderline, btnStrike);
    };

    const focusEditor = function (editor) {
        editor.focus({ preventScroll: true });
    };

    const checkStyle = function (btnBold, btnUnderline, btnStrike) {
        isStyle("bold") ? btnBold.classList.add("active") : btnBold.classList.remove("active");
        isStyle("underline") ? btnUnderline.classList.add("active") : btnUnderline.classList.remove("active");
        isStyle("strikeThrough") ? btnStrike.classList.add("active") : btnStrike.classList.remove("active");
    };

    const isStyle = function (style) {
        return document.queryCommandState(style);
    };

    const insertImageDate = function (file, editor) {
        const reader = new FileReader();
        reader.onload = function (e) {
            focusEditor(editor);
            document.execCommand("insertImage", false, e.target.result);
        };
        reader.readAsDataURL(file);
    };
}

// -------------------------------------------------------------------------
// 체크박스 선택 동작(공통)
// -------------------------------------------------------------------------

// function checkboxHandler(group) {
//     var checkAll = $(`#${group}CheckAll`); // 리스트 전체선택 체크박스
//     checkAll.on("change", function () {
//         const isChecked = $(this).is(":checked");
//         $(`.${group}CheckBox`).not(checkAll).prop("checked", isChecked);
//     });
// }

// function checkCallbackFunc(group) {
//     var checkAll = $(`#${group}CheckAll`);
//     const totalCheckboxes = $(`.${group}CheckBox`).not(checkAll).length;
//     const checkedCheckboxes = $(`.${group}CheckBox:checked`).not(checkAll).length;
//     checkAll.prop("checked", totalCheckboxes === checkedCheckboxes);
// }

// 체크박스들의 체크여부에 따라 전체선택 체크 동작
$(document).on("click", ".checkbox", function () {
    let checkBox = $("." + $(this).attr("check_name") + "CheckBox");
    let checkAll = $("#" + $(this).attr("check_name") + "CheckAll");
    console.log('$(this).attr("check_name")=', $(this).attr("check_name"));
    let totalCheckboxes = checkBox.length;
    console.log("totalCheckboxes=", totalCheckboxes);
    let checkedCheckboxes = checkBox.filter(":checked").length;
    checkAll.prop("checked", totalCheckboxes === checkedCheckboxes);
    console.log("checkedCheckboxes=", checkedCheckboxes);
});

// 전체선택 체크여부에 따라 하위 체크박스들 체크 동작
$(".check_all").click(function () {
    let checkBox = $("." + $(this).attr("check_name") + "CheckBox");
    let checkAll = $("#" + $(this).attr("check_name") + "CheckAll");
    const isChecked = $(this).is(":checked");
    checkBox.prop("checked", isChecked);
});

// -------------------------------------------------------------------------
// 버튼 동작
// -------------------------------------------------------------------------

// 페이지 준비중
$(".page_ready").click(function () {
    alert(`페이지 준비중입니다.`);
});

$("#btn_excel").click(function () {
    // 엑셀 내보내기버튼
    alert(`엑셀 내보내기 준비중입니다.`);
});

$(".modal_list a").click(function () {
    // 모달안의 리스트 상세보기 버튼
    alert(`해당 정보 출력중입니다.`);
    $(".btn_add_form_back , .btn_list_edit").show();
    $(".btn_list_add").hide();
    $("input").val("");
    $('input[type="checkbox"]:checked').prop("checked", false);
    $(".preview tbody td").remove();
    $(".editor_input > div").text("");
});

$(".btn_add_form_back").click(function () {
    //추가폼으로 돌아가기 버튼
    $(".btn_add_form_back , .btn_list_edit").hide();
    $(".btn_list_add").show();
    $("input").val("");
    $('input[type="checkbox"]:checked').prop("checked", false);
    $(".preview tbody td").remove();
    $(".editor_input > div").text("");
});

$(".top_right .btn_prevStep , .top_right").click(function () {
    /*
    //메인리스트 단계버튼,  돌아가기 버튼
    let clickedBtnId = $(this).attr("id");
    let listCheck = $('input[type="checkbox"]:checked');
    if (listCheck.length === 0) {
        alert("체크된 리스트가 없습니다.");
    } else {
        if (clickedBtnId === "btn_prevStep") {
            confirm("계약단계에서 시작하신 항목이 있는지 확인해주세요.");
        }
        alert("이동완료하였습니다.");
        listCheck.prop("checked", false);
    }
    */
});

/*
$(".bottom_left button").click(function () {
    //모달안의 단계이동버튼
    alert("이동완료하였습니다.");
    $(".modal").hide();
});
*/

$(".btn_list_edit").click(function () {
    //모달안의 리스트 수정버튼
    alert("리스트가 수정되었습니다.");
    $(".btn_add_form_back , .btn_list_edit").hide();
    $(".btn_list_add").show();
    /*
    $("input").val("");
    $('input[type="checkbox"]:checked').prop("checked", false);
    $('.preview tbody td').remove();
    $(".editor_input > div").text("");
    */
});

// -------------------------------------------------------------------------
//  첨부파일 미리보기
// -------------------------------------------------------------------------
function fileInputHandeler(fileID) {
    const file_handler = {
        init() {
            const fileInput = document.querySelector(`#${fileID}FileInput`);
            const preview = document.querySelector(`#${fileID}Preview`);
            fileInput.addEventListener("change", () => {
                console.log("fileInput=", fileInput, "preview=", preview);
                // if(this.contains('editor_img')){return false;}
                // console.log(fileInput);
                fileInput.dataset.isChange = 1;
                const files = Array.from(fileInput.files);

                // let currentFiles = [];
                // 파일확장자 타입 ['application/pdf', 'image/jpeg', 'image/png', 'application/haansofthwp', 'application/x-hwp','application/haansoftxlsx'];
                files.forEach((file) => {
                    let Ftype = "";
                    if (file.type == "application/pdf") {
                        Ftype = "pdf";
                    } else if (file.type == "application/haansofthwp" || file.type == "application/x-hwp") {
                        Ftype = "hwp";
                    } else if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/jpg") {
                        Ftype = "pic";
                    } else if (file.type == "application/haansoftxlsx" || file.type == "application/vnd.ms-excel") {
                        Ftype = "xlsx";
                    } else {
                        Ftype = "none";
                    }
                    // if (fileArray) currentFiles.push(file);
                    // console.log(file.type);
                    preview.innerHTML += `<tr id="${file.lastModified}">
                                			  <td><button type="button" data-index="${file.lastModified}" class="file_remove" file_tagid="${fileID}"></button></td>
                                			  <td><div class="file_name"><span class="${Ftype}"></span><p>${file.name}</p></div></td>
                                			  <td><a href="#none" download="${file.name}" class="file_download"></a></td>
                            				  </tr>`;
                });
                // if (fileArray) fileArray.push(currentFiles);
            });
        },

        removeFile: () => {
            // document.addEventListener("click", (e) => {
            $(document).on("click", ".file_remove", function () {
                // if (e.target.className !== "file_remove") return;

                const fileTagId = $(this).attr("file_tagid");
                console.log("fileTagId #1=", fileTagId, fileID);
                if (fileTagId != fileID) return;
                console.log("fileTagId #2=", fileTagId, fileID);

                const removeTargetId = $(this).data("index"); //e.target.dataset.index;
                const dataTranster = new DataTransfer();
                if (removeTargetId != -1) {
                    const preview = document.querySelector(`#${fileTagId}Preview`);
                    const removeTarget = document.getElementById(removeTargetId);
                    if (preview && removeTarget) {
                        let delFile = preview.getAttribute("del_file") || null;
                        if (delFile) delFile += "," + (removeTarget.getAttribute("file_code") || "0");
                        else delFile = removeTarget.getAttribute("file_code") || "0";
                        preview.setAttribute("del_file", delFile);
                        console.log("delFile=", removeTargetId, delFile, preview);
                        const files = document.querySelector(`#${fileTagId}FileInput`).files;

                        Array.from(files)
                            .filter((file) => file.lastModified != removeTargetId)
                            .forEach((file) => {
                                dataTranster.items.add(file);
                            });
                        if (removeTarget) removeTarget.remove();
                    }
                } else {
                    const preview = document.querySelector(`#${fileTagId}Preview`);
                    preview.setAttribute("del_file", -99);
                    preview.innerHTML = "";
                }
                document.querySelector(`#${fileTagId}FileInput`).files = dataTranster.files;
            });
        },

        // downloadFile: () => {
        //     document.addEventListener("click", (e) => {
        //         if (e.target.className !== "file_download") return;
        //         alert("해당파일이 다운로드 완료하였습니다.");
        //     });
        // },
    };
    file_handler.init();
    file_handler.removeFile();

    // const selectBox = $(".selectBox");
    // selectBox.find(".BtnSelect").click(function () {
    //     // 부모 요소에 해당하는 .inputRow의 테두리를 파란색으로 설정
    //     $(this).parents(".inputRow").css("border", "1px solid blue");

    //     // .selectBoxOption 요소를 찾기 위해 parents()와 find()를 사용
    //     let selectBoxOption = $(this).parents(".selectBox").find(".selectBoxOption");
    //     console.log("selectBoxOption", selectBoxOption);

    //     // .selectBoxOption 요소를 보이게
    //     selectBoxOption.show();
    //     //토글 안되는 이유 찾기
    // });

    // selectBox.find(".BtnOption").click(function () {
    //     let selectText = $(this).text();
    //     let selectValue = $(this).val();

    //     // .BtnSelect > div 요소에 선택된 텍스트와 값을 설정
    //     $(this).parents(".selectBox").find(".BtnSelect > div").text(selectText);
    //     $(this).parents(".selectBox").find(".BtnSelect > div").attr("value", selectValue);

    //     // 부모 요소에 해당하는 .inputRow의 테두리 초기화
    //     $(this).parents(".inputRow").css("border", "");

    //     // .selectBoxOption의 active 클래스를 제거
    //     $(this).parents(".selectBox").find(".selectBoxOption").removeClass("active").hide();
    // });
}

// 0830 수정내용
// -------------------------------------------------------------------------
//  select(공통)
// -------------------------------------------------------------------------
const selectBox = $(".selectBox");
selectBox.find(".BtnSelect").click(function () {
    $(this).parents(".inputRow").css("border", "1px solid blue");
    let selectBoxOption = $(this).next();
    console.log("selectBoxOption", selectBoxOption);
    selectBoxOption.toggle();
});
selectBox.find(".BtnOption").click(function () {
    let selectText = $(this).text();
    let selectValue = $(this).val();
    $(this).parents(".selectBox").find(".BtnSelect > div").text(selectText);
    $(this).parents(".selectBox").find(".BtnSelect > div").attr("value", selectValue);
    $(this).parents(".inputRow").css("border", "");
    $(this).parents(".selectBoxOption").hide();
});
// -------------------------------------------------------------------------
//  정렬 모달
// -------------------------------------------------------------------------
// $("#BtnSort").click(function () {
//     $(".sortModal").fadeToggle();
// });

//리스트 정렬 함수
$("#BtnSort").click(function () {
    $(".sortModal").toggle();
});
//다른 선택박스를 누르면 누른거만 활성화
$(document).on("click", ".BtnOption", function () {
    let allValuesAreMinusOne = true;

    $(".BtnSelect").each(function () {
        let value = $(this).find("div").attr("value");
        // console.log(value);
        if (value !== "-1") {
            allValuesAreMinusOne = false; // value가 -1이 아닌 것이 있으면 false로 설정
        }
    });

    if (allValuesAreMinusOne) {
        // 모든 value가 -1일 경우
        $("#BtnSort").css("border", "");
        $("#BtnSort").css("color", "");
        $("#BtnSort .icon").css("background-position-x", "0px");
    } else {
        // 하나라도 -1이 아닐 경우
        $("#BtnSort").css("border", "1px solid #1472FF");
        $("#BtnSort").css("color", "#1472FF");
        $("#BtnSort .icon").css("background-position-x", "-16px");
    }
});

//시간을 분 단위로 변환하는 함수
function convertToMinutes(timeString) {
    let [hours, minutes] = timeString.split(":");
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function containsSpecialCharacters(str) {
    var specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharacters.test(str);
}

//< 또는 >가 포함되어 있는지 확인하는 함수
function logincontainsSpecialCharacters(value) {
    var regex = /[<>]/;
    return regex.test(value);
}

function getCurrentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = new String(date.getMonth() + 1);
    var day = new String(date.getDate());

    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }

    return year + "-" + month + "-" + day;
}

//common console
function consoleFunc(funcName, arr) {
    const error = new Error();
    const stackLines = error.stack.split("\n");
    const callerLine = stackLines[2].trim();
    const callerInfo = callerLine.match(/\((.*):(\d+):\d+\)$/) || callerLine.match(/at (.*):(\d+):\d+/);
    let fileName = "unknown file";
    if (callerInfo) {
        const fullPath = callerInfo[1];
        fileName = fullPath.split("/").pop();
    }
    console.log(`File Name: ${fileName}`);

    arr.forEach((obj, index) => {
        for (let [key, value] of Object.entries(obj)) {
            console.log(`${funcName} - ${key}: ${value}`);
        }
    });
}
