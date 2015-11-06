//扩展方法等
//转xml
String.prototype.EnXml = function () {
    return $("<div/>").html(this.toString()).text();
}
//解析xml
String.prototype.DeXml = function () {
    return $("<div/>").text(this.toString()).html();
}

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
    var avg = Math.round(sub / length, 2);
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
function play(file) {
    var container = $("body");
    var embed;
    embed = $('#firstSound');
    if (embed.length != 0) {
        embed.remove();
    }
    embed = $("<embed/>").attr({
        'id': 'firstSound',
        'name': 'firstSound',
        'controls': 'smallconsole',
        'src': file,
        'hidden': true,
        'autostart': true
    });
    embed.appendTo(container);
}
function stop() {
    var embed;
    var $embed = $('#firstSound');
    if ($embed.length != 0) {
        embed = $('#firstSound')[0];
        if (null != embed.stop || undefined != embed.stop || embed.stop) {
            embed.stop();
        } else {
            embed.remove();
        }
    }


}
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var getImgUrl = function (imgId) {
    if (imgId.indexOf("_") != -1) {
        return publicConfig.ImageShowUrl + imgId;
    }
    return publicConfig.ImageShowUrl + imgId + "_1";
}
var getAviUrl = function (avi_ext) {
    return (publicConfig.AviShowUrl + avi_ext).toString();
}
function replaceEnter(str) {
    var reg = new RegExp("\r\n", "g");
    str = str.replace(reg, "<br>");
    return str;
}
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
    var toString = function (arr) {
        var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);
        str = str.replace(/,/g, "");
        return str;
    }
    var initByOther = function (arr) {
        var i = 32;
        while (i--) {
            arr.push("0");
        }
    }
    var initByString = function (arr, g) {
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
(function ($) {
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }
    $.extend({
        getUrlParams: function () {
            if (window.location.href.indexOf('?') == -1) {
                return false;
            }
            var vars = {}, hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
        getUrlParam: function (name) {
            return $.getUrlParams()[name];
        },
        htmlDecode: function (str) {
            if (!str) {
                return "";
            }
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&gt;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            s = s.replace(/<br>/g, "\n");
            return s;
        },
        windowBase: function (option) {
            var defaults = {
                id: "customer_window",
                title: "",
                isShowBtn: false,
                beforeOpen: function () {
                    return true;
                },
                callback: function () { },
                beforeClose: function () {
                    return true;
                },
                ele: null,
                url: null,
                width: 300,
                height: 300
            }

            $.extend(defaults, option);
            if (defaults.beforeOpen) {
                var result = defaults.beforeOpen();
                if (!result) {
                    return false;
                }
            }
            var iframId = null;
            var helper = {
                createOverlay: function (id) {
                    var overlay = $("<div id='o2o-window'></div>");
                    $("#" + id).size() <= 0 && $("body").append(overlay);
                    return overlay;
                },
                createWindow: function (data) {
                    
                    var html = [];
                    html.push('<div id=' + data.id + ' class="w-title" data-callback="' + data.callbackStr + '" style="width:' + data.width + 'px;">');
                    html.push('   <div class="w-title-header">');
                    html.push('	     <span>' + data.title + '</span>');
                    html.push('	     <a href="javascript:void(0);" class="modal-close">×</a>');
                    html.push('   </div>');
                    html.push('   <div  class="w-title-content" style="height:' + data.height + 'px">');
                    //如果有url就会直接使用 iframe模式 ele无效
                  
                    if (data.url) {
                        iframId = "iframe_" + new Date().getTime();
                        html.push('<iframe id="' + iframId + '"  src="' + data.url + '" border="0" width="100%" scrolling="no" height="100%" frameborder="no" allowtransparency="yes" marginheight="0" marginwidth="0"></iframe>');
                    }
                    html.push('   </div>');
                    html.push('   <div class="w-title-footer">');
                    html.push('<span style="float: right">');
                    html.push('<input data-func="ok" style="padding:0;width: 60px;margin-right: 10px;height: 35px;line-height: 35px" class="btn btn-primary" type="button" value="确定" />');
                    html.push('<input data-func="cancel" style="padding:0;width: 60px;height: 35px;line-height: 35px" class="btn btn-default" type="button" value="取消" />');
                    html.push('</span>');
                    html.push('</div>');
                    html.push('</div>');
                    return $(html.join(""));
                }
            }
            //清除已存在window
            var $oldWindow = $("#" + defaults.id);
            if ($oldWindow.size() > 0) {
                $oldWindow.remove();
            }
            //遮罩层
            var $overlay = null;
            var overlayId = "o2o-window";
            var $oldOverlay = $("#" + overlayId);
            if ($oldOverlay.size() > 0) {
                $overlay = $oldOverlay;
            } else {
                $overlay = helper.createOverlay(overlayId);
            }
            $overlay.show();
            helper.createWindow(defaults).appendTo("body");

            if (iframId != null) document.getElementById(iframId).contentWindow.publicConfig = publicConfig;

            var $newWindow = $("#" + defaults.id);
            if (defaults.isShowBtn != "true") {
                $newWindow.find(".w-title-footer").hide();
            }
            var $windowContent = $newWindow.find(".w-title-content");
            var $closebtn = $newWindow.find(".modal-close,[data-func='cancel']");
            var $okBtn = $newWindow.find("[data-func='ok']");
            if (!defaults.url && defaults.ele) {
                $("#" + defaults.ele).appendTo($windowContent).show();
            } else {
                var iframe = $newWindow.find("iframe")[0];

                if (iframe.attachEvent) {
                    iframe.attachEvent("onload", function () {
                        iframe.height = iframe.contentWindow.document.documentElement.scrollHeight;
                    });
                } else {
                    iframe.onload = function () {
                        iframe.height = iframe.contentWindow.document.documentElement.scrollHeight;
                    };
                }

            }
            $okBtn.click(function () {
                if (defaults.beforeClose) {
                    var result = defaults.beforeClose(true);
                    if (result) {
                        close(true);
                    }
                } else {
                    close(true);
                }

            });
            $closebtn.click(function () {
                if (defaults.beforeClose) {
                    var result = defaults.beforeClose(false);
                    if (result) {
                        close(false);
                    }
                } else {
                    close(false);
                }
            });
            var winWidth = $newWindow.outerWidth();
            $newWindow.css({
                'display': 'block',
                'position': 'fixed',
                'opacity': 0,
                'z-index': 11000,
                'left': 50 + '%',
                'margin-left': -(winWidth / 2) + "px",
                'top': 70 + "px"
            });
            $newWindow.fadeTo(200, 1);
            //关闭窗口
            function close(status) {
                if (defaults.url) {
                    $.closeParentWindow({
                        status: status,
                        winId: option.id,
                        data: {}
                    });
                } else {
                    $.closeWindow({
                        status: status,
                        winId: option.id,
                        data: {}
                    });
                }
            }
        },
        resizeParentWindow: function (winId) {
            //param数据格式
            var $win = winId ? window.parent.$("#" + winId) : window.parent.$(".w-title");
            var iframe = $win.find("iframe")[0];
            iframe.height = iframe.contentWindow.document.documentElement.scrollHeight;
        },
        closeParentWindow: function (paramObj) {
            //param数据格式
            var obj = {
                status: false,
                winId: null,
                data: {}
            }
            $.extend(obj, paramObj);
            var $win = obj.winId ? window.parent.$("#" + obj.winId) : window.parent.$(".w-title");

            var $overLay = window.parent.$("#o2o-window");
            var callback = $win.attr("data-callback");
            $overLay.hide();
            $win.hide();
            if (callback && callback != "undefined") {
                var callbackFunc = window.parent.eval('(' + callback + ')');
                callbackFunc(obj);
            }
        },
        closeWindow: function (paramObj) {
            //param数据格式
            var obj = {
                status: false,
                winId: null,
                data: {}
            }
            $.extend(obj, paramObj);
            var $win = obj.winId ? $("#" + obj.winId) : $(".w-title");
            var $overLay = $("#o2o-window");
            $overLay.hide();
            $win.hide();
            $win.find(".w-title-content").prependTo("body").hide();
            var callback = $win.attr("data-callback");
            if (callback && callback != "undefined") {
                var callbackFunc = eval('(' + callback + ')');

                callbackFunc(obj);
            }

        },
        alert: function (message, status) {
            if (!status) {
                status = "info";
            }
            var data = {
                info: "-175",
                fail: "-30",
                success: "-77",
                warn: "-275",
                problem: "-225",
                idea: "-125"
            }
            var id = Math.random().toString().substr(2);
            var content = $("<div>").css({
                padding: "5px"
            }).attr("id", id).appendTo($("body"));
            $("<div>").css({
                background: "url(/images/form.png) no-repeat 0 " + data[status] + "px",
                height: "40px",
                width: "40px",
                float: "left",
            }).appendTo(content);
            $("<div>").css({
                padding: "5px",
                "line-height": "25px"
            }).append(message)
                .appendTo(content);

            $.windowBase({
                id: "customer_alert",
                title: "提示",
                isShowBtn: false,
                callback: function () { },
                ele: id,
                url: undefined,
                width: 300,
                height: 80
            });

            //alert(message);
        },
        message: function (message, status) {
            var tips = $("#tips");
            if (status && status == true || status == "true") {
                if (tips.length == 0) {
                    $("<div style='display:none' id='tips' class='tips'>" + message + "</div>").prependTo("body").slideDown();
                } else {
                    $("#tips").removeClass("error-tips").html(message).slideDown();
                }
            } else {
                if (tips.length == 0) {
                    $("<div style='display:none' id='tips'class='tips error-tips'>" + message + "</div>").prependTo("body").slideDown();

                } else {
                    $("#tips").addClass("error-tips").html(message).slideDown();
                }
            }
            setTimeout(function () {
                $("#tips").slideUp();
            }, 3000);
        },
        loading: function () {
            $("<div class='busy'><div style='position: absolute;left: 50%;top: 50%;'><img src='/Plugin/busy/indicator_medium.gif' /></div></busy>").appendTo("body");
        },
        loadingEnd: function () {
            $(".busy").remove();
        },
        intercept: function ($ele) {
            var $this = $ele;
            var data = $this.serialize();
            var callback = $this.attr("data-callback");
            var action = $this.attr("action");
            var method = $this.attr("method");

            var realCallback = eval('(' + callback + ')');
            $.ajax({
                url: action,
                type: method,
                data: data,
                dataType: "json",
                success: function (returnData) {
                    //如果非规定格式，那么直接返回
                    if (realCallback!=undefined) {

                        if (returnData.Status == undefined) {
                            realCallback(returnData);
                            return;
                        }
                        if (returnData.Status) {
                            realCallback(returnData); //执行真正的回调方法
                            if ($.fn.permission) {
                                $("input[data-au],button[data-au],a[data-au]").permission("init");
                            }
                            return;
                        } else {
                            //显示异常信息
                            $.message(returnData.Message, returnData.Status, $this.parents(".w-title-content"));
                            return;
                        }
                    }

                }
            });
        }
    });
    $.fn.O2OtipsShow = function (obj) {
        var _poshy = $("#" + obj.eleid).data("poshy");
        var opts;
        if (obj) {
            opts = $.extend({}, {
                eleid: "",
                content: "test",
                showOn: 'none',
                alignTo: 'target',
                alignX: 'right',
                alignY: 'center',
                className: 'tip-yellowsimple',
                showTimeout: 100,
                offsetX: 5,
                offsetY: 0,
                keepInViewport: false
            }, obj);
        }
        if (_poshy) {
            _poshy = $("#" + obj.eleid).poshytip('update', opts.content);
        }
        else {
            _poshy = $("#" + obj.eleid).poshytip(opts);
        }
        $("#" + obj.eleid).data("poshy", _poshy);
        _poshy.poshytip('show');


    };
    $.fn.O2OtipsHide = function (obj) {

        var _poshy = $("#" + obj.eleid).data("poshy");
        if (_poshy) { _poshy.poshytip('hide'); }
    }
    $.fn.O2OReset = function () {
        $(this).find("input[type='text'],input[type='email']").each(function () {
            $(this).val("");
        });
        $(this).find("select").each(function () {
            $(this).find("option").eq(0).prop("selected", "selected");
        });
    }

})(jQuery);
$(document).ready(function () {
    var cityDatas = {
        data: null,
        defaultValue: '<option value="-1">请选择</option>',
        selectProvincialData: null,
        selectCitiesData: null,
        selectCountiesData: null
    }

    SetSelection();
    function SetSelection() {
        var selectName = ['Provincial', 'Cities', 'Counties'];
        var optis = $("div[domdata-citys]");
        if (optis.length && optis.length > 0) {
            $.ajax({
                url: '/base/GetCitys',
                success: function (data) {
                    cityDatas.data = data;
                }
                , async: false,
                type: 'post',
                dataType: 'json',
            });
            $.each(optis, function () {
                var _this = $(this);
                var _sName = ['Provincial', 'Cities', 'Counties']
                var sName = _this.attr("selectName");
                if (sName) _sName = eval("(" + sName + ")");

                var _sValue = [-1, -1, -1];
                var sValue = _this.attr("selectValue");
                if (sValue) _sValue = eval("(" + sValue + ")");

                $(this).append(Provincial(_sName[0], _sValue[0], _this, _sName.length));

                if (_sName.length >= 2) {
                    $(this).append(Cities(_sName[1], _sValue[1], _this, _sName.length));
                }
                if (_sName.length == 3) {
                    $(this).append(Counties(_sName[2], _sValue[2], _this));
                }

            });
        }
    }
    //省
    function Provincial(name, deValue, _this, len) {
        var Provincial = $('<select class="form-control" name="' + name + '"></select>');
        Provincial.append('<option value="-1">请选择省</option>');
        $(cityDatas.data).each(function () {
            Provincial.append('<option value="' + this.ID + '"' + (deValue == this.ID ? "selected" : "") + '>' + this.AName + '</option>');
        });

        if (deValue != -1) {
            var citys = GetCities(deValue);
            $(_this).data("citys", citys);
        }

        if (len >= 2) {
            Provincial.change(function () {
                var val = $(Provincial).val();
                var citys = GetCities(val);
                var _cities = $(Provincial).next();
                var _counties = _cities.next();
                _cities.html("");
                _cities.append('<option value="-1">请选择市</option>');
                _counties.html("");
                _counties.append('<option value="-1">请选择县</option>');

                $.each(citys, function () {
                    _cities.append("<option value='" + this.ID + "'>" + this.AName + "</option>");
                });
            });
        }
        return Provincial;
    }
    //市 
    function Cities(name, deValue, _this, len) {
        var Cities = $('<select  class="form-control" name="' + name + '" style="margin-left:10px"></select>');
        Cities.append('<option value="-1">请选择市</option>');
        var citys = $(_this).data("citys");
        if (citys != null) {
            $.each(citys, function () {
                Cities.append('<option value="' + this.ID + '"' + (deValue == this.ID ? "selected" : "") + '>' + this.AName + '</option>');
            });
        }
        if (deValue != -1) {
            var counties = GetCounties(deValue);
            $(_this).data("counties", counties);
        }
        if (len == 3) {
            Cities.change(function () {
                var val = $(Cities).val();
                var _counties = $(Cities).next();
                var counties = GetCounties(val);
                _counties.html("");
                _counties.append('<option value="-1">请选择县</option>');
                $.each(counties, function () {
                    _counties.append("<option value='" + this.ID + "'>" + this.AName + "</option>");
                });
            });
        }
        return Cities;
    }
    //县
    function Counties(name, deValue, _this) {
        var Counties;
        var check = $(_this).attr("dataneedcheck");
        if (check == "1") {
            Counties = $('<select data-val="true" data-val-number="字段 所属县的id 必须是一个数字。" data-val-range="请选择区域。" data-val-range-max="999999999" data-val-range-min="1" data-val-required="所属县的id不能为空" class="form-control" name="' + name + '" style="margin-left:10px"></select>');
        }
        else Counties = $('<select  class="form-control" name="' + name + '" style="margin-left:10px"></select>');

        Counties.append('<option value="-1">请选择县</option>');
        var counties = $(_this).data("counties");
        if (counties) {
            $.each(counties, function () {
                Counties.append('<option value="' + this.ID + '"' + (deValue == this.ID ? "selected" : "") + '>' + this.AName + '</option>');
            });
        }

        return Counties;
    }
    //获取市
    function GetCities(id) {
        var Citys = null;
        $.each(cityDatas.data, function () {
            if (this.ID == id) {
                cityDatas.selectProvincialData = this;
                Citys = this.Children;
                return false;
            }
        });
        return Citys;
    }

    //获取县
    function GetCounties(id) {
        var Counties = null;
        if (cityDatas.selectProvincialData && cityDatas.selectProvincialData) {
            $.each(cityDatas.selectProvincialData.Children, function () {
                if (this.ID == id) {
                    cityDatas.selectCitiesData == this;
                    Counties = this.Children;
                    return false;
                }
            });
        }
        return Counties;

    }





    SetGoodsClass();
    //设置一级类目，二级类目
    function SetGoodsClass() {
        var noBrand;
        var hasBrand;
        var opts = $("div[domdata-goodsClass]");
        if (opts != null && opts.length > 0) {
            $.ajax({
                url: '/base/GetGoodsClass',
                success: function (data) {
                    noBrand = data.NoBrand;
                    hasBrand = data.HasBrand;
                }
                    , async: false,
                type: 'post',
                dataType: 'json',
            });
        }
        $.each(opts, function () {
            var _this = this;
            var _name = $(this).attr("selectname");
            var _value = $(this).attr("selectvalue");
            var __name = ["brand", "classFirst", "classSecond"];
            var __value = [-1, -1, -1];
            if (_name) __name = eval("(" + _name + ")");
            if (_value) __value = eval("(" + _value + ")");

            var obj = $(this).attr("hasBrand");
            if (obj != undefined) {
                $(this).data("brand", hasBrand);
                $(this).append(setBrand(__name[0], __value[0], _this));
            } else
                $(this).data("goodsClassFirst", noBrand);

            $(this).append(SetGoodsClassFirst(__name[1], __value[1], _this));
            $(this).append(SetGoodsClassSecond(__name[2], __value[2], _this));
        });

    }

    function setBrand(name, deValue, _this) {
        var brand = $('<select  class="form-control" name="' + name + '"></select>');
        brand.append(cityDatas.defaultValue);
        var data = $(_this).data("brand");
        $(data).each(function () {
            brand.append('<option value="' + this.ID + '"' + (deValue == this.ID ? "selected" : "") + '>' + this.BName + '</option>');
        });
        if (deValue != -1) {
            var first = GetFirstClass(deValue, _this);
            $(_this).data("goodsClassFirst", first);
        }
        brand.change(function () {
            var val = $(brand).val();
            var firstValue = GetFirstClass(val, _this);
            $(_this).data("goodsClassFirst", firstValue);
            var goodsClassFirst = $(brand).next();

            goodsClassFirst.html("");
            goodsClassFirst.append(cityDatas.defaultValue);


            $.each(firstValue, function () {
                goodsClassFirst.append("<option value='" + this.ID + "'>" + this.CName + "</option>");
            });
        });
        return brand;
    }

    function SetGoodsClassFirst(name, deValue, _this) {
        var goodsClassFirst = $('<select  class="form-control" name="' + name + '"></select>');
        goodsClassFirst.append(cityDatas.defaultValue);
        var data = $(_this).data("goodsClassFirst");
        if (data) {
            $(data).each(function () {
                goodsClassFirst.append('<option value="' + this.ID + '"' + (deValue == this.ID ? "selected" : "") + '>' + this.CName + '</option>');
            });
        }

        if (deValue != -1) {
            var second = GetSecodeClass(deValue, _this)
            $(_this).data("goodsClassSecond", second);

        }
        goodsClassFirst.change(function () {
            var val = $(goodsClassFirst).val();
            var secondValue = GetSecodeClass(val, _this);
            var goodsClassSecond = $(goodsClassFirst).next();

            goodsClassSecond.html("");
            goodsClassSecond.append(cityDatas.defaultValue);

            $.each(secondValue, function () {
                goodsClassSecond.append("<option value='" + this.ID + "'>" + this.CName + "</option>");
            });
        });
        return goodsClassFirst;
    }

    function SetGoodsClassSecond(name, deValue, _this) {
        var goodsClassSecond = $('<select  class="form-control" name="' + name + '" style="margin-left:10px"></select>');
        goodsClassSecond.append(cityDatas.defaultValue);
        var data = $(_this).data("goodsClassSecond");
        if (data) {
            $(data).each(function () {
                goodsClassSecond.append('<option value="' + this.ID + '"' + (deValue == this.ID ? "selected" : "") + '>' + this.CName + '</option>');
            });
        }

        return goodsClassSecond;
    }

    //获取二级类目
    function GetSecodeClass(id, _this) {
        var dataAll = $(_this).data("goodsClassFirst");

        var ret = [];
        if (dataAll == null) return ret;

        $.each(dataAll, function () {
            if (this.ID == id) {
                ret = this.Children;
                return false;
            }
        });
        return ret;
    }

    function GetFirstClass(id, _this) {
        var dataAll = $(_this).data("brand");
        var ret = [];
        $.each(dataAll, function () {
            if (this.ID == id) {
                ret = this.GoodsClass;
                return false;
            }
        });
        return ret;
    }

});

