/**
 * 半全角カナ変換モジュール
 * @return {[type]} [description]
 */
var kanaConverter = (function() {

    // マップ作成用関数
    var createKanaMap = function(properties, values) {
        var kanaMap = {};
        // 念のため文字数が同じかどうかをチェックする(ちゃんとマッピングできるか)
        if(properties.length === values.length) {
            for(var i=0, len=properties.length; i<len; i++) {
                var property= properties.charCodeAt(i),
                    value = values.charCodeAt(i);
                kanaMap[property] = value;
            }
        }
        return kanaMap;
    };

    // 全角から半角への変換用マップ
    var m = createKanaMap(
        '　アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９”！＃＄％＆’（）＝＜＞，．？＿［］｛｝＠＾￣￥',
        ' ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&\'()=<>,.?_\[\]{}@^~\\'
    );
    // 半角から全角への変換用マップ
    var mm = createKanaMap(
        ' ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&\'()=<>,.?_\[\]{}@^~\\',
        '　アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９”！＃＄％＆’（）＝＜＞，．？＿［］｛｝＠＾￣￥'
    );

    // 全角から半角への変換用マップ
    var g = createKanaMap(
        'ガギグゲゴザジズゼゾダヂヅデドバビブベボヴ',
        'ｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾊﾋﾌﾍﾎｳ'
    );
    // 半角から全角への変換用マップ
    var gg = createKanaMap(
        'ｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾊﾋﾌﾍﾎｳ',
        'ガギグゲゴザジズゼゾダヂヅデドバビブベボヴ'
    );

    // 全角から半角への変換用マップ
    var p = createKanaMap(
        'パピプペポ',
        'ﾊﾋﾌﾍﾎ'
    );
    // 半角から全角への変換用マップ
    var pp = createKanaMap(
        'ﾊﾋﾌﾍﾎ',
        'パピプペポ'
    );

    var gMark = 'ﾞ'.charCodeAt(0),
        pMark = 'ﾟ'.charCodeAt(0);

    return {
        /**
         * 全角から半角への変換用関数
         * @param	{[type]} str 変換対象文字列
         * @return {[type]}		 変換後文字列
         */
        convertKanaToOneByte : function(str) {
            for(var i=0, len=str.length; i<len; i++) {
                // 濁音もしくは半濁音文字
                if(g.hasOwnProperty(str.charCodeAt(i)) || p.hasOwnProperty(str.charCodeAt(i))) {
                    // 濁音
                    if(g[str.charCodeAt(i)]) {
                        str = str.replace(str[i], String.fromCharCode(g[str.charCodeAt(i)])+String.fromCharCode(gMark));
                    }
                    // 半濁音
                    else if(p[str.charCodeAt(i)]) {
                        str = str.replace(str[i], String.fromCharCode(p[str.charCodeAt(i)])+String.fromCharCode(pMark));
                    }
                    else {
                        break;
                    }
                    // 文字列数が増加するため調整
                    i++;
                    len = str.length;
                }
                else {
                    if(m[str.charCodeAt(i)]) {
                        str = str.replace(str[i], String.fromCharCode(m[str.charCodeAt(i)]));
                    }
                }
            }
            return str;
        },
        /**
         * 半角から全角への変換用関数
         * @param	{[type]} str 変換対象文字列
         * @return {[type]}		 変換後文字列
         */
        convertKanaToTwoByte : function(str) {
            for(var i=0, len=str.length; i<len; i++) {
                // 濁音もしくは半濁音文字
                if(str.charCodeAt(i) === gMark || str.charCodeAt(i) === pMark) {
                    // 濁音
                    if(str.charCodeAt(i) === gMark && gg[str.charCodeAt(i-1)]) {
                        str = str.replace(str[i-1], String.fromCharCode(gg[str.charCodeAt(i-1)]))
                            .replace(str[i], '');
                    }
                    // 半濁音
                    else if(str.charCodeAt(i) === pMark && pp[str.charCodeAt(i-1)]) {
                        str = str.replace(str[i-1], String.fromCharCode(pp[str.charCodeAt(i-1)]))
                            .replace(str[i], '');
                    }
                    else {
                        break;
                    }
                    // 文字列数が減少するため調整
                    i--;
                    len = str.length;
                }
                else {
                    // １つ先の文字を見て濁音もしくは半濁音でないことを確認
                    if(mm[str.charCodeAt(i)] && str.charCodeAt(i+1) !== gMark && str.charCodeAt(i+1) !== pMark) {
                        str = str.replace(str[i], String.fromCharCode(mm[str.charCodeAt(i)]));
                    }
                }
            }
            return str;
        }
    };
})();
function addCommaInt(intStr) {
    var num = new String(intStr).replace(/,/g, "");
    while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
    return num;
}
function addCommaEx(numFloat) {
    return addCommaExWithPadding(numFloat, 0);
}
function numShosuPadding(numFloat, numIntOnly, zeroDigit) {
    if (zeroDigit == 0) return "";
    var shosuNum = new Number(Math.abs(numFloat) - Math.abs(numIntOnly));
    return shosuNum.toFixed(zeroDigit).replace('0.', '.');
}
function addCommaExWithPadding(numFloat, zeroDigit) {
    var numIntOnly = Math.floor(numFloat);
    if (numFloat < 0) {
        numIntOnly = Math.floor(Math.abs(numFloat)) * -1;
    }
    var commaIntStr = addCommaInt(numIntOnly);
    return commaIntStr + numShosuPadding(numFloat, numIntOnly, zeroDigit);
}
function roundEx(num, digitCnt) {
    var numF = parseFloat(num);
    numF = (numF == Number.POSITIVE_INFINITY || numF == Number.NEGATIVE_INFINITY ? 0 : numF);
    var digitInt = parseInt(digitCnt);
    if (isNaN(numF) || isNaN(digitInt)) return 0;

    var roundValue = Math.pow(10, digitInt);
    return (Math.round(numF * roundValue) / roundValue);
}
function parseIntEx(intStr) {
    return isNaN(parseInt(intStr)) ? 0 : parseInt(intStr);
}
function parseFloatEx(floatStr) {
    return isNaN(parseFloat(floatStr)) ? 0 : parseFloat(floatStr);
}
