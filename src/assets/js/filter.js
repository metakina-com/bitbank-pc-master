// 字符串截取小数点后N位
let SubString = (value, num) => {
        // value = parseFloat(value);
        if (num == -1) {
            return value;
        }
        if (!value || value === 0) {
            return parseFloat(0).toFixed(num)
        } else {
            let s = value + ''
            if (num == 0) {
                return s.substring(0, s.indexOf('.'))
            } else {
                if (s.indexOf('.') !== -1) {
                    return s.substring(0, s.indexOf('.') + 1 + num)
                } else {
                    return s
                }
            }

        }
    }
    // 字符串截取小数点后N位
let SubString2 = (value, num) => {
        if (!value || value === 0) {
            return ""
        } else {
            let s = value + ''
            return s.substr(0, num)
        }
    }
    // 字符串截取小数点后N位 通过当前币帅选 四舍五入的
let toFixedCoin = (value, name) => {


    name = name.toUpperCase();

    let num = 2;

    if (name == 'BTC' || name == 'BCH' || name == 'BSV' || name == 'LTC') {
        num = 2
    }

    if (name == 'EOS' || name == 'ETH' || name == 'ETC') {
        num = 3
    }

    if (name == 'DASH' || name == 'XRP') {
        num = 4
    }



    if (!value || value == 0) {
        let last1 = '';
        for (let i = 0; i < num; i++) {

            last1 += '0'
                // console.log(last)
        }
        return '0.' + last1

    } else {
        value = String(value)
        if (value.indexOf('.') == -1) { //没有点
            let last = '';
            for (let i = 0; i < num; i++) {

                last += '0'
                    // console.log(last)
            }
            return value + '.' + last
        } { //有点

            // let dianLen = value.split('.')[1].length;
            // if (dianLen >= num) { // 直接截取
            //     return value.substring(0, value.indexOf('.') + 1 + num);
            // } else { //补充部分0
            //     let last = '';
            //     for (let i = 0; i < num - dianLen; i++) {
            //         last += '0'
            //     }
            //     return value + last
            // }

            return Number(value).toFixed(num)
        }
    }

}




// 字符串截取小数点后N位 通过当前币帅选
let subCoin = (value, name) => {


        name = name.toUpperCase();

        let num = 2;

        if (name == 'BTC' || name == 'BCH' || name == 'BSV' || name == 'LTC') {
            num = 2
        }

        if (name == 'EOS' || name == 'ETH' || name == 'ETC') {
            num = 3
        }

        if (name == 'DASH' || name == 'XRP') {
            num = 4
        }



        if (!value || value == 0) {
            let last1 = '';
            for (let i = 0; i < num; i++) {

                last1 += '0'
                    // console.log(last)
            }
            return '0.' + last1

        } else {
            value = String(value)
            if (value.indexOf('.') == -1) { //没有点
                let last = '';
                for (let i = 0; i < num; i++) {

                    last += '0'
                        // console.log(last)
                }
                return value + '.' + last
            } { //有点

                let dianLen = value.split('.')[1].length;
                if (dianLen >= num) { // 直接截取
                    return value.substring(0, value.indexOf('.') + 1 + num);
                } else { //补充部分0
                    let last = '';
                    for (let i = 0; i < num - dianLen; i++) {
                        last += '0'
                    }
                    return value + last
                }
            }
        }

    }
    // 字符串截取小数点后N位 补充0 站位

let SubStringZreo = (value, num) => {
    if (!value || value == 0) {
        let last1 = '';
        for (let i = 0; i < num; i++) {

            last1 += '0'
                // console.log(last)
        }
        return '0.' + last1

    } else {
        value = String(value)
        if (value.indexOf('.') == -1) { //没有点
            let last = '';
            for (let i = 0; i < num; i++) {

                last += '0'
                    // console.log(last)
            }
            return value + '.' + last
        } { //有点

            let dianLen = value.split('.')[1].length;
            if (dianLen >= num) { // 直接截取
                return value.substring(0, value.indexOf('.') + 1 + num);
            } else { //补充部分0
                let last = '';
                for (let i = 0; i < num - dianLen; i++) {
                    last += '0'
                }
                return value + last
            }
        }
    }
}


// 时分秒
let hms = (value,type) => {
        var date = new Date(value) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var h = date.getHours()
        h = h < 10 ? '0' + h : h
        var m = date.getMinutes()
        m = m < 10 ? '0' + m : m
        var s = date.getSeconds()
        s = s < 10 ? '0' + s : s
        if(type){
            return  m + ':' + s
        }
        return h + ':' + m + ':' + s
    }
    // 年月日时分秒
let yndhms = (value, type) => {
        var date = new Date(value) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate()
        D = D < 10 ? '0' + D : D
        var h = date.getHours()
        h = h < 10 ? '0' + h : h
        var m = date.getMinutes()
        m = m < 10 ? '0' + m : m
        var s = date.getSeconds()
        s = s < 10 ? '0' + s : s
        if (type == 'M') {
            return M + D + ' ' + h + ':' + m + ':' + s
        }
        return Y + M + D + ' ' + h + ':' + m + ':' + s
    }
    // 年月日
let ynd = value => {
    var date = new Date(value) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = date.getDate()
    D = D < 10 ? '0' + D : D
    return Y + M + D
}




// 手机号加密
let encryptionphone = value => {
        return value.substr(0, 3) + '****' + value.substr(-4)
    }
    // 邮箱加密
let encryptionmail = value => {
        return value.substr(0, 3) + '****' + value.substr(-9)
    }
    // 数字截取万，亿
let SubString1 = (val, n) => {
    val = parseFloat(val);
    if (!val) {
        return parseFloat(0).toFixed(n)
    }

    if (val < 10000) {
        return SubString(val, n);
    } else if (val < 100000000) {
        // (parseFloat(val) / 10000).toFixed(n)
        val = SubString(parseFloat(val) / 10000, n) + '万'
        return val;
    } else {
        // val = (parseFloat(val) / 100000000).toFixed(n) + '亿'
        val = SubString(parseFloat(val) / 100000000, n) + '亿'
        return val;
    }
}


//
let toFixed = (val, n) => {
    if (!val) {
        return parseFloat(0).toFixed(n)
    }
    return parseFloat(val).toFixed(n)
}
let toFixedRate = (val, n) => {
    var val = val - 0;
    if (!val) {
        return parseFloat(0).toFixed(n)
    }
    if (val > 0) {
        return '+' + val.toFixed(n)
    }
    return val.toFixed(n)
}


// userId显示处理
let useridhander = (s) => {
        return s.substring(0, 5) + '...' + s.substring(s.length - 5, s.length)
    }
    // 身份证加星
let cardNum = (val) => {
    val = val + '';
    if (!val) {
        return val;
    }
    console.log(val)
        // return val.replace(/(.{3}).*(.{4})/, "$1***********$2");
    return val.substring(0, 4) + '**********' + val.substring(val.length - 4, val.length)

}
let toNumber = (num, n = -1) => {

        //处理非数字
        if (isNaN(num)) { return num };

        //处理不需要转换的数字
        var str = '' + num;
        if (!/e/i.test(str)) { return SubString(parseFloat(num), n); };
        return SubString((num).toFixed(18).replace(/\.?0+$/, ""), n);
    }
    //截取字符串长度
let subStrings = (val, n) => {
    val = val + '';
    if (!val) {
        return;
    }
    return val.substr(0, n)
}
export default {
    SubString,
    hms,
    yndhms,
    ynd,
    encryptionphone,
    encryptionmail,
    toFixed,
    SubString1,
    SubStringZreo,
    toFixedRate,
    useridhander,
    cardNum,
    SubString2,
    toNumber,
    subStrings,
    toFixedCoin,
    subCoin
}