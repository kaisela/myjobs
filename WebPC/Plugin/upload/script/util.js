Array.prototype.AVG = function () {
    var length = this.length;
    var sub = 0.00;
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (!isNaN(item)) {
            sub = sub + item;
        } else {
            length--;
        }
    }
    var avg = Math.round(sub / length,2);
    return avg;
}
String.prototype.subLongStr = function (length, withdot) {
    var str = this.toString();
    return str.length > length ? (withdot == true ? str.substr(0, length) + "…" : str.substr(0, length)) : str;
};
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key] ? args[key] : "");
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                var reg = new RegExp("({[" + i + "]})", "g");
                result = result.replace(reg, arguments[i] ? arguments[i] : "");
            }
        }
    }
    return result;
};
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}
var Guid = (function () {
    
    var toString= function(arr) {
        var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);
        str = str.replace(/,/g, "");
        return str;
    }
    var initByOther=function (arr) {
        var i = 32;
        while (i--) {
            arr.push("0");
        }
    }
    var initByString = function (arr,g) {
        g = g.replace(/\{|\(|\)|\}|-/g, "");
        g = g.toLowerCase();
        if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1) {
            initByOther(arr);
        }
        else {
            for (var i = 0; i < g.length; i++) {
                arr.push(g[i]);
            }
        }
    }
    return {
        NewGuid: function () {
            var g = "";
            var i = 32;
            while (i--) {
                g += Math.floor(Math.random() * 16.0).toString(16);
            }
            var arr = new Array();
            initByString(arr, g);
            return toString(arr);
        }
    }
})();