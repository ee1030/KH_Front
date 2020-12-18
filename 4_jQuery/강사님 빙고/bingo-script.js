var cellCount = 0; // 입력된 칸 수를 저장할 전역변수
var inputCount = 0; // 입력된 승리 빙고 수를 저장할 전역변수
var bingoCount = 0; // 빙고 개수를 카운트 할 전역변수
var clickable = true; // 빙고판 클릭 가능 여부를 저장할 전역변수

$("#btn").click(function () { // 생성 버튼 클릭 시

    // 칸 수 또는 승리 빙고 수가 잘못 입력된 경우
    if ($("#cellCount").val() != "" && $("#cellCount").val() < 3) {
        return;
    }
    if ($("#inputCount").val() != "" && $("#inputCount").val() < 1) {
        return;
    }

    cellCount = Number($("#cellCount").val()); // 입력된 칸 수
    inputCount = Number($("#inputCount").val()); // 승리 빙고 수

    var tbl = $("#tbl");
    $(tbl).empty(); // 이전 빙고판 내용 삭제
    $(tbl).nextAll().remove(); // 빙고 개수, 빙고 여부 출력문구 삭제
    clickable = true; // 빙고판을 클릭 가능한 상태로 바꿈

    // && : 자바스크립트에서 제공하는 짧은 조건문 연산자로
    // A && B : A가 참인 경우 B 수행
    cellCount == 0 && (cellCount = 5); // 칸 수가 입력되지 않으면 5 대입
    inputCount == 0 && (inputCount = 3);  //  승리 빙고 수가 입력되지 않으면 5 대입

    var ranArr = []; // 랜덤 값을 저장할 배열 선언

    for (var i = 0; i < cellCount * cellCount; i++) { // cellCount*cellCount 만큼반복
        var ran = Math.floor(Math.random() * cellCount * cellCount + 1); // 랜덤값 생성

        // 중복 제거
        if (ranArr.indexOf(ran) == -1) {
            // 배열.indexOf(값) : 배열에서 값과 일치하는 요소가 있는 인덱스를 반환, 없으면 -1 반환
            ranArr.push(ran);
            // ranArr에 ran과 같은 값을 가진 요소가 없다면 ranArr에 ran 추가
        } else {
            i--; // 중복값이 있다면 i를 1 감소시켜 현재 인덱스 유지
        }
    }

    var idx = 0; // ranArr 배열 요소 접근용 변수
    for (var r = 0; r < cellCount; r++) {  // 행 생성용 for문

        var tr = $("<tr>"); // tr 객체 생성

        for (var c = 0; c < cellCount; c++) {  // 열 생성용 for문

            // td 객체 생성 후 내용으로 ranArr배열에 현재 접근중(idx번째)인 요소 값 삽입
            var td = $("<td>").text(ranArr[idx]);

            idx++; // 다음 배열 요소 접근을 위해 1증가

            $(tr).append(td); // tr 객체의 마지막 자식으로 td 객체 추가
        }

        $(tbl).append(tr); // table 객체의 마지막 자식으로 tr객체 추가
    }

    $(tbl).after("<h2 id='bingoCount'>빙고 개수 : <span>0</span></h2>"); // 빙고 개수 출력 문구를 table 다음에 추가
});


// 빙고판의 숫자를 클릭하는 경우에 대한 이벤트
// td 요소가 클릭이 되었을 때 (동적 추가 요소에 이벤트 설정)
$(document).on("click", "td", function (e) {

    if (clickable) { // 빙고판이 클릭 가능할 경우
        if ($(this).is(".check")) { // 이벤트가 발생한 요소에 check 클래스가 있는 경우
            $(this).removeClass("check"); // check 클래스 제거

        } else { //  check 클래스가 없는 경우
            $(this).addClass("check"); // check 클래스 추가
        }
        checkBingo(); // 빙고 여부 확인 함수 호출
    }

});

// 빙고 여부 확인 함수
function checkBingo() {
    var board = []; // 빙고판을 저장할 배열 선언

    var rows = $("tr"); // tr 객체 생성
    bingoCount = 0;

    $("td").removeClass("bingo"); // 검사 전 기존에 있던 bingo 클래스 모두 삭제

    // board 1차원 배열에 요소로 각 행의 td요소 1차원 배열을 추가
    // --> 2차원 배열이 됨.
    for (var r = 0; r < cellCount; r++) {
        board.push($(rows[r]).children("td"));
    }

    checkRowBing(board); // 행 빙고 검사 함수 호출
    checkColBingo(board); // 열 빙고 검사 함수 호출
    checkDiaBingo(board); // 대각선 빙고 검사 함수 호출

    $("#bingoCount > span").text(bingoCount);

    // 빙고 개수가 승리 조건과 같을 경우
    if (bingoCount >= inputCount) {
        swal({ title: "★ BINGO ★" }); // sweetalert를 이용하여 빙고 메세지 출력

        clickable = false; // 빙고판을 클릭할 수 없게 만듦

        $("td").each(function (Index, item) {
            if (!$(item).is(".bingo")) {
                $(item).css("opacity", "0.5");
            }
        });
    }
}


// 행 빙고 검사 함수
function checkRowBing(board) {
    for (var r = 0; r < cellCount; r++) {    // 행 반복
        var checkCount = 0; // check 클래스의 개수를 카운트할 변수

        for (var c = 0; c < cellCount; c++) { // 열 반복
            if ($(board[r][c]).is(".check")) { // 현재 접근한 칸이 체크가 되어 있다면
                checkCount++;
            }
        }

        // 체크된 개수가 행의 길이와 같다면
        // == 한 줄이 전체가 체크가 되어있다 == 한 줄 빙고
        if (checkCount == cellCount) {
            bingoCount++; // 빙고 카운트 증가
            for (var c = 0; c < cellCount; c++) { // 해당 행에 bingo 클래스 추가
                $(board[r][c]).addClass("bingo");
            }
        }
    }
}

// 열 빙고 검사 함수
function checkColBingo(board) {
    for (var r = 0; r < cellCount; r++) {    // 행 반복
        var checkCount = 0; // check 클래스의 개수를 카운트할 변수

        for (var c = 0; c < cellCount; c++) { // 열 반복
            if ($(board[c][r]).is(".check")) { // 현재 접근한 칸이 체크가 되어 있다면

                // board[c][r]의 형태로 작성할 경우
                // 행을 가리키는 첫 번째 [] 값을 증가 시키면 행이 변화됨.
                checkCount++;
            }
        }

        // 체크된 개수가 열의 길이와 같다면
        // == 한 줄이 전체가 체크가 되어있다 == 한 줄 빙고
        if (checkCount == cellCount) {
            bingoCount++; // 빙고 카운트 증가
            for (var c = 0; c < cellCount; c++) { // 해당 열에 bingo 클래스 추가
                $(board[c][r]).addClass("bingo");
            }
        }
    }
}


// 대각선 빙고 검사 함수
function checkDiaBingo(board) {
    var checkCount1 = 0; // 좌상 우하 대각선 check 클래스의 개수를 카운트할 변수
    var checkCount2 = 0; // 우상 좌하 대각선 check 클래스의 개수를 카운트할 변수
    for (var i = 0; i < cellCount; i++) {

        if ($(board[i][i]).is(".check")) { // 현재 접근한 칸이 체크가 되어 있다면
            // board[i][i]의 형태로 작성할 경우
            // i값이 증가 할수로 좌상 우하로 이어지는 대각선 형태로 검사가 진행됨.
            checkCount1++;
        }

        if ($(board[i][cellCount - 1 - i]).is(".check")) { // 현재 접근한 칸이 체크가 되어 있다면
            // board[i][cellCount-1-i]의 형태로 작성할 경우
            // i값이 증가 할수로 우상 좌하로 이어지는 대각선 형태로 검사가 진행됨.
            checkCount2++;
        }

    }

    // 체크된 개수가 입력된 칸 수와 같다면
    // == 한 줄이 전체가 체크가 되어있다 == 한 줄 빙고
    if (checkCount1 == cellCount) {
        bingoCount++; // 빙고 카운트 증가
        for (var i = 0; i < cellCount; i++) { // 해당 대각선에 bingo 클래스 추가
            $(board[i][i]).addClass("bingo");
        }
    }

    if (checkCount2 == cellCount) {
        bingoCount++; // 빙고 카운트 증가
        for (var i = 0; i < cellCount; i++) { // 해당 대각선에 bingo 클래스 추가
            $(board[i][cellCount - 1 - i]).addClass("bingo");
        }
    }
}

