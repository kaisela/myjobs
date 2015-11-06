
/**
*页面数据类型有效性验证。
*/

/**
*描述：非空验证，如果为空返回true。
*v:用户输入的参数。
*/
function isEmpty(v) {
    switch (typeof v) {
        case 'undefined':
            return true;
        case 'string':
            if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
            break;
        case 'boolean':
            if (!v) return true;
            break;
        case 'number':
            if (0 == v || isNaN(v)) return true;
            break;
        case 'object':
            if (null == v || v.length == 0) return true;
            for (var i in v) {
                return false;
            }
            return true;
    }
    return false;
}
/**
*描述：有效长度验证。
*str:用户输入的参数;
*length:用户输入限定长度。
*/
function isValidLength(str, length) {
    if (str.length > length) {
        return false;
    } else {
        return true;
    }

}


/**
*描述：验证字符串只含有汉字、数字、字母、下划线，下划线位置不限，如果为真返回true。
*str:用户输入的参数。
*/
function isValidCN_Letter_Number_(str) {
    var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
}

/**
*描述：验证以字母开头+数字，或+下划线组合的字符串，如果为真返回true。
*str:用户输入的参数。
*/
function isValidCN_Letter_Number_Must(str) {
    var reg = /^[a-zA-Z]+[a-zA-Z0-9_]+$/;
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
}

/**
*描述：有效半角字符长度验证；如果该字符串中含有全角字符，每个全角字符按照2个半角字符数计算。
*str:用户输入的参数;
*length:用户输入限定长度。
*/
function isValidLengthHarfAngle(str, length) {
    var count = getHalfWidthStrLength(str);
    if (count > length) {
        return false;
    } else {
        return true;
    }

}

/**
*描述：获取长度，返回整数值，默认统计长度按照半角字符统计长度；如果字符串中含有全角字符，每个全角字符算2个半角长度。
*str:用户输入的参数;
*/
function getHalfWidthStrLength(str) {
    var len = str.length;
    var reLen = 0;
    for (var i = 0; i < len; i++) {
        if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
            // 全角    
            reLen += 2;
        } else {
            reLen++;
        }
    }
    return reLen;
}

/**
*描述：decimal类型验证。
*str:用户输入的参数。
*/
function isValidDecimal(str) {
    var reg = /^(\d{1,10})(\.\d{1,2})?$/;
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
}

/**
*描述：decimal类型验证。
*str:用户输入的参数；
*p：有效位数；
*s：小数位数。
*/
function isValidDecimalParam(str, p, s) {
    //var strExp = "^(\\d{1,10})(\\.\\d{1,2})?$";
    var strExp = "^(\\d{1," + p + "})(\\.\\d{1," + s + "})?$";
    var reg = new RegExp(strExp);
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
}

/**
*描述：是否是货币。
*str:用户输入的参数；
*/
function isValidCurrency(str) {
    var reg = /^-?\d{1,28}(\.\d{2})?$/;
    return reg.test(str);
}

/**
*描述：（中国大陆）手机号码验证。
*str:用户输入的参数；
*/
function isValidPhone(str) {
    var reg = /^1[3578]\d{9}$/;
    return reg.test(str);
}

/**
*描述：是否是字母。
*str:用户输入的参数；
*/
function isValidLetter(str) {
    var reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

/**
*描述：是否是大写字母。
*str:用户输入的参数；
*/
function isValidUpperLetter(str) {
    var reg = /^[A-Z]+$/;
    return reg.test(str);
}

/**
*描述：是否是小写字母。
*str:用户输入的参数；
*/
function isValidLowerLetter(str) {
    var reg = /^[a-z]+$/;
    return reg.test(str);
}

/**
*描述：是否是数值。
*str:用户输入的参数；
*/
function isValidNumber(str) {
    var reg = new RegExp("^[-]?[0-9]+[\.]?[0-9]+$"); //"^-?\\d+$"　
    return reg.test(str)
}


/**
*描述：是否是正整数。
*str:用户输入的参数；
*/
function isValidPlusNumber(str) {
    var reg = new RegExp("^[0-9]*[1-9][0-9]*$");
    return reg.test(str)
}

/**
*描述：是否是负整数。
*str:用户输入的参数；
*/
function isValidNegativeNumber(str) {
    var reg = new RegExp("^-[0-9]*[1-9][0-9]*$");
    return reg.test(str)
}

/**
*描述：是否是正整数，含0。
*str:用户输入的参数；
*/
function isValidPlusNumber_0(str) {
    var reg = new RegExp("^\\d+$");
    return reg.test(str)
}



/**
*描述：验证字符串是否都为中文，如果为真返回true。
*str:用户输入的参数。
*/
function isValidChinese(str) {
    var reg = /^[\u4e00-\u9fa5]+$/;
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
}

/**
*描述：是否是负整数，含0。
*str:用户输入的参数；
*/
function isValidNegativeNumber_0(str) {
    var reg = new RegExp("^((-\\d+)|(0+))$");
    return reg.test(str)
}

/**
*描述：是否是浮点数。
*str:用户输入的参数；
*/
function isValidFloatingNumber(str) {
    var reg = new RegExp("^(-?\\d+)(\\.\\d+)?$");
    return reg.test(str)
}

/**
*描述：是否是正浮点数。
*str:用户输入的参数；
*/
function isValidPlusFloatingNumber(str) {
    var reg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$");
    return reg.test(str)
}

/**
*描述：是否是正浮点数，含0。
*str:用户输入的参数；
*/
function isValidPlusFloatingNumber_0(str) {
    var reg = new RegExp("^\\d+(\\.\\d+)?$");
    return reg.test(str)
}

/**
*描述：是否是负浮点数。
*str:用户输入的参数；
*/
function isValidNegativeFloatingNumber(str) {
    var reg = new RegExp("^(-(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*)))$");
    return reg.test(str)
}

/**
*描述：是否是负浮点数，含0。
*str:用户输入的参数；
*/
function isValidNegativeFloatingNumber_0(str) {
    var reg = new RegExp("^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$");
    return reg.test(str)
}

/**
*描述：是否是Email。
*str:用户输入的参数；
*/
function isValidEmail(str) {
    var result = str.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
    if (result == null) {
        return false;
    } else {
        return true;
    }

}

/**
*描述：是否是身份证号码。
*str:用户输入的参数；
*/
function isValidIDCardNumber(str) {
    var reg = /^\d{18}|(\d{17}[xX])|(\d{15})$/;
    return reg.test(str);
}

/**
*描述：是否是有效的邮编。
*str:用户输入的参数；
*/
function isValidZipCode(str) {
    var reg = /^[1-9][0-9]{5}$/;
    return reg.test(str);
}

/**
*描述：判断字符数。
*str:用户输入的参数；
*/
function getBytesCount(str) {
    var bytesCount = 0;
    if (str != null) {
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (/^[\u0000-\u00ff]$/.test(c)) {
                bytesCount += 1;
            }
            else {
                bytesCount += 2;
            }
        }
    }
    return bytesCount;
}


function ReadXml()
{
    $.ajax({
        url: "",
        dataType: 'xml',
        type: 'GET',
        timeout: 2000,
        error: function (xml) {
            alert("加载XML 文件出错！");
        },
        success: function (xml) {
            $(xml).find("Title").each(function (index) { });
        }
    })
}


/**
*描述：添加错误提示信息。
*con:所需判断的控件；
*errorMsg:错误信息；
*values:是否正确，1：错误，否则正确；
*/
function CheckInputError(con,errorMsg,values) {
    if (values == 1) {
        if ($(con).siblings("span").length <= 0) {
            var str = '<span style="color:red;display:block;">' + errorMsg + '</span>';
            $(con).after(str);
        }
        else {
            $(con).siblings("span").html(errorMsg);
        }
    }
    else {
        $(con).siblings("span").remove();
    }
    return values;
}

/**
*描述：判断是否为空。
*con:所需判断的控件；
*errorMsg:错误信息；
*/
function CheckIsNull(con, errorMsg) {
    if ($.trim(con.val()) == "") {
        return CheckInputError(con, errorMsg, 1);
    }
    else {
        return CheckInputError(con, errorMsg, 0);
    }
}
/**
*描述：判断长度。
*con:所需判断的控件；
*minLg：最小长度；
*maxLg：最大长度；
*errorMsg:错误信息；
*/
function CheckLength(con,minLg,maxLg, errorMsg) {
    if ($.trim(con.val()).length > maxLg || (minLg!=0 && $.trim(con.val()).length < minLg)) {
        return CheckInputError(con, errorMsg, 1);
    }
    else {
        return CheckInputError(con, errorMsg, 0);
    }
}