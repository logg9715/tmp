/* 카카오 주소->좌표 변환 API 테스트.js */

$(document).ready(function () {

    /* 카카오 api 주소 호출 함수 */
    function dongheonAjax(searchWord) 
    {
        // kakao rest api 키
        const apiKey = 'd98c66a27a72e6300ca1398f00efd11d'; 

        $.ajax({
            type: "get",
            async: true,
            url: `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchWord)}`,
            datatype: "json",
            beforeSend : function (xhr) {
                xhr.setRequestHeader("Authorization",`KakaoAK ${apiKey}`);
            },
            success: function (args) {
                /* 
                * [args] : https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-keyword
                * type : json
                * 한 번에 최대 15개 데이터(페이지 옵션 붙이면 한 번에 15*3개)
                * 
                * 예) const tmp = args.documents[0].place_name
                */

                // 표에 반영
                applyTable_address(args);
            },
            error: function (err) {
                alert("처리 중 오류가 발생하였습니다.[" + err + "]");
            },
        });
    }

    /* 가져온 주소 표에 반영 */
    function applyTable_address(address_json) 
    {
        $(".list").find("#list_contract_info").children().remove();
                
        let resultData = "";
        let index = 1;
        const docFragment = $(document.createDocumentFragment());

        address_json.documents.forEach(keyValue => {
            /* 1. 인덱싱 */
            resultData = '<td class="list_num">' + (index) + "</td>";
            
            /* 2. 본문 */
            resultData += '<td class="list_section">' + (keyValue.place_name ||"") + "</td>";
            resultData += '<td class="list_section">' + (keyValue.address_name ||"") + "</td>";
            resultData += '<td class="list_">' + (keyValue.x ||"") + "</td>";
            resultData += '<td class="list_orderer">' + (keyValue.y ||"") + "</td>";
        
            /* 3. 줄 바꿈 */
            resultData = '<tr class="list_row">' + resultData + "</tr>";
            docFragment.append(resultData);
            index++;
        });
        $(".list").find("#list_contract_info").append(docFragment);
    }

    /* 검색창 */
    $(".top_content").find("#searchCateData").keydown(function (key) {
        if (key.keyCode == 13) 
        {
            key.preventDefault(); // 엔터키 리프레시 막기
            dongheonAjax($(this).val());
        }
    });
    
});

