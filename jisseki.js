$(function() {
    // 値変更時に半角に変換
    $('#zantama_command, #toushi_command, #mochikomi_command, #mochidashi_command, #dedamachikan, #kashidama, #kankin, #sumKaiten, .playHistory').change(function(event){
        var str = $(this).val();
        str = kanaConverter.convertKanaToOneByte(str);
        str = changeCommandStr(str);
        $(this).val(str);
    });
    // コピペ禁止
    $(document).on('paste','input[type=number]',function(){
        return false;
    });
    $(document).on('paste','input[type=tel]',function(){
        return false;
    });
    $(document).on('paste','input[type=text]',function(){
        return false;
    });

    autosize($('#jissekiInput textarea'));
    autosize($('#result'));

    // 改行無効
    $('#jissekiInput textarea, #jissekiInput input, #result').bind('keydown', function(e) {
        if (e.which == 13) {
            return false;
        }
    });

    $('.scroll').click(function(event){
        event.preventDefault();

        var url = this.href;

        var parts = url.split('#');
        var target = parts[1];

        var target_offset = $('#'+target).offset();
        var target_top = target_offset.top;

        $('html, body').animate({scrollTop:target_top}, 500);
    });
    $('html,body').animate({ scrollTop: 0 }, "0");

    $('#addRow').click(function() {
        var no = parseInt($('#dispMaxNo').val());
        no += 10;
        for(var i = 1; i <= 80; i++) {
            if (i <= no) {
                $('#tr' + i).css('display', '');
            }
        }
        $('#dispMaxNo').val(no);
    });

    $('#delRow').click(function() {
        var no = parseInt($('#dispMaxNo').val());
        if (no > 10) {
            no -= 10;
            for(var i = $('#dispMaxNo').val(); i > no; i--) {
                $('#tr' + i).css('display', 'none');
            }
            $('#dispMaxNo').val(no);
        } else {
            alert('遊戯履歴は最低10行のためこれ以上削除できません。');
        }
    });
    $('.clear').click(function() {
        $('#zantama_command').val('');
        $('#toushi_command').val('');
        $('#mochikomi_command').val('');
        $('#mochidashi_command').val('');
        $('#dedamachikan').val('');
        $('#kashidama').val('');
        $('#kankin').val('');
        $('#chakusekiAll').val('');
        $('.playHistory').val('');
    });
    $('.saveTemp').click(function() {
        saveValueToStrage();
    });
});
function setToStrage(htmlID) {
    var kishuID = String($('#kishuID').text());
    var value = $('#' + htmlID).val();
    localStorage[kishuID + '_' + htmlID] = value;
}
function saveValueToStrage() {
    $.each($(':text, textarea, input[type="number"], :hidden'), function() {
        var htmlID = $(this).attr('id');
        // 計算結果は保持しない
        if (htmlID != 'result') {
            setToStrage(htmlID);
        }
    });
}
function getFromStrage(htmlID) {
    var kishuID = String($('#kishuID').text());
    var strageValue = localStorage[kishuID + '_' + htmlID];
    return typeof strageValue === 'undefined' ? '' : strageValue;
}
function getFromStrageToForm() {
    $.each($(':text, textarea, input[type="number"], :hidden'), function() {
        var htmlID = $(this).attr('id');
        // 計算結果は対象外
        if (htmlID != 'result') {
            $('#' + htmlID).val(getFromStrage(htmlID));
        }
    });
}
function inputValCheck(atariInfoArray) {
    // 入力欄を白に戻す
    $('#zantama_command, #toushi_command, #mochikomi_command, #mochidashi_command, #dedamachikan, #kashidama, #kankin, #sumKaiten, .playHistory').css('background-color', '');

    // 入力チェック
    var msgStr = '';
    if (!checkCommandStr($('#zantama_command').val())) {
        msgStr += '・残玉は「#数字(メモ)」の形式のみ入力可能です。\n';
        $('#zantama_command').css('background-color', '#f9869c');
    }
    if (!checkCommandStr($('#toushi_command').val())) {
        msgStr += '・現金投資は「#数字(メモ)」の形式のみ入力可能です。\n';
        $('#toushi_command').css('background-color', '#f9869c');
    }
    if (!checkCommandStr($('#mochikomi_command').val())) {
        msgStr += '・持込玉は「#数字(メモ)」の形式のみ入力可能です。\n';
        $('#mochikomi_command').css('background-color', '#f9869c');
    }
    if (!checkCommandStr($('#mochidashi_command').val())) {
        msgStr += '・持出玉は「#数字(メモ)」の形式のみ入力可能です。\n';
        $('#mochidashi_command').css('background-color', '#f9869c');
    }
    try {
        parseInt($('#kashidama').val());
        if (isNaN(parseInt($('#kashidama').val()))) {
            throw new Error();
        }
    } catch(e) {
        msgStr = msgStr + '・貸玉率は数字と小数点のみ入力可能です。\n';
        $('#kashidama').css('background-color', '#f9869c');
    }
    try {
        parseFloat($('#kankin').val());
        if (isNaN(parseFloat($('#kankin').val()))) {
            throw new Error();
        }
    } catch(e) {
        msgStr = msgStr + '・換金率は数字と小数点のみ入力可能です。\n';
        $('#kankin').css('background-color', '#f9869c');
    }
    try {
        parseInt($('#chakusekiAll').val());
        if (isNaN(parseInt($('#chakusekiAll').val()))) {
            throw new Error();
        }
    } catch(e) {
        msgStr = msgStr + '・着席時総回転数は数字のみ入力可能です。\n';
        $('#chakusekiAll').css('background-color', '#f9869c');
    }

    // 遊戯履歴が1件以上入っているか
    var playHistoryFlag = false;
    for(var i = 1; i < 81; i++) {
        var rowCnt = 0;
        $('.row' + String(i)).each(function() {
            if ($(this).val() != '') {
                playHistoryFlag = true;
                rowCnt++;
            }
        });
    }
    if (!playHistoryFlag) {
        msgStr += '・遊戯履歴が1件も入力されていません。\n';
        $('.playHistory').css('background-color', '#f9869c');
    }
    $.each($('.atariNo'), function(index){
        if ($(this).val() != '' && $(this).val() > 0 && $(this).val() > atariInfoArray.length) {
            msgStr += '・遊戯履歴の' + String(index+1) + '件目の当番号が不正です。\n';
            $(this).css('background-color', '#f9869c');
        }
    });
    return msgStr;
}
function changeCommandStr(str) {
    if (str == '' || str == null) return;
    // #複数を#一つに変換
    var retStr = str.replace(/#+/gi, '#');
    // (複数を(一つに変換
    var retStr = retStr.replace(/\(+/gi, '(');
    // )複数を)一つに変換
    var retStr = retStr.replace(/\)+/gi, ')');
    // 先頭と末尾の#を削る
    var retStr = retStr.replace(/^#|#$/gi, '');
    return retStr;
}
function checkCommandStr(str) {
    if (str == '') return false;
    var retFlag = true;
    $.each(str.split('#'), function() {
        if (!String(this).match(/^[0-9]+(\(+[^#\(\)]+\)+)?$/)) {
            retFlag = false;
        }
    });
    return retFlag;
}
function changeValToZero(valObj) {
    if (valObj.val() == '') {
        valObj.val(0);
    }
}
function sumCommandStr(str) {
    if (str == '') return false;
    var sum = 0;
    $.each(str.split('#'), function() {
        sum += Number(String(this).match(/^[0-9]+/));
    });
    return sum;
}
function sumValuesFromArray(arr) {
    var sumVal = 0;
    $.each(arr, function() {
        if ($(this).val() != '') {
            sumVal = sumVal + parseIntEx($(this).val());
        }
    });
    return sumVal;
}
function cntValuesFromArray(arr) {
    var cnt = 0;
    $.each(arr, function() {
        if ($(this).val() != '') {
            cnt++;
        }
    });
    return cnt;
}
function calcKitaichi(price, persentage, calcResultAll, kishuInfo) {
    var priceF = parseFloatEx(price);
    var persentageF = parseFloatEx(persentage / 100);
    return (((calcResultAll.rironAveDedama * calcResultAll.kankin) - (parseFloatEx(kishuInfo['totalRate']) / calcResultAll.bunshi * 1000 )) * (priceF / parseFloatEx(kishuInfo['totalRate'])) * (1 - persentageF)) +
            (((priceF / parseFloatEx(kishuInfo['totalRate'])) * ((calcResultAll.rironAveDedama - (parseFloatEx(kishuInfo['totalRate']) / calcResultAll.bunshi * 250)) * calcResultAll.kankin) * (persentageF)) +
            ((priceF * parseFloatEx(kishuInfo['denSupRate']) * calcResultAll.plusMinusRate) * calcResultAll.kankin));
}
