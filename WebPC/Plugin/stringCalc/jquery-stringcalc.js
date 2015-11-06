(function ($) {
    var methods = {
        init: function (options) {
            // 在每个元素上执行方法
            return this.each(function () {
                var $this = $(this);
                var settings = $this.data("stringcalc");
                if (typeof settings === "undefined") {
                    var defaults = {
                        enabled: false
                    };
                    settings = $.extend({}, defaults, options);
                    $this.data("stringcalc", settings);
                } else {
                    settings = $.extend({}, settings, options);
                    $this.data("stringcalc", settings);
                }
               
                //正式开始逻辑代码
                var maxLengthStr = $this.attr("data-max");
                var textAreaName = $this.attr("name");
                var spanId = (textAreaName ? textAreaName + "_t" : "calcLength");
                var data = {
                    max: maxLengthStr && !isNaN(maxLengthStr) ? parseInt(maxLengthStr) : 10000
                };
                $this.keyup(function () {
                    var $span = null;
                    if ($("#" + spanId).length == 0) {
                        $span = $("<span id='" + spanId + "' style='color: red;display: block;font-size: 9px;font-family: Microsoft YaHei;'></span>");
                        $this.after($span);
                    } else {
                        $span = $("#" + spanId);
                    }
                    var oldStr = $this.val();
                    if (oldStr.length >= data.max) {
                        $this.val(oldStr.substring(0, data.max));
                        $span.html("无法输入更多字符");
                    } else {
                        var dvalue = data.max - oldStr.length;
                        $span.html("还剩余" + dvalue + "个字符");
                    }
                });
              
            });
        },
        destroy: function (options) {
            // 在每个元素中执行代码
            return $(this).each(function () {
                var $this = $(this);
                // 执行代码
                // 删除元素对应的数据
                $this.removeData("stringcalc");
            });
        }
    };
    $.fn.stringcalc = function () {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method === "object" || !method) {
            method = methods.init;
        } else {
            $.error("Method" + method + "does not exist on jQuery.stringcalc");
            return this;
        }

        return method.apply(this, arguments);
    };
})(jQuery);
$(function () {
    $("textarea[data-func='calcLength']").stringcalc("init");
});