(function ($) {
    var methods = {
        init: function (options) {
            // 在每个元素上执行方法
            return this.each(function () {
                var $this = $(this);
                var settings = $this.data("form-");
                if (typeof settings === "undefined") {
                    var defaults = {
                        enabled: false
                    };
                    settings = $.extend({}, defaults, options);
                    $this.data("AjaxIntercept", settings);
                } else {
                    settings = $.extend({}, settings, options);
                    $this.data("AjaxIntercept", settings);
                }
                $this.unbind("submit").bind("submit", function () {
                    $.intercept($this);
                    return false;
                });
            });
        },
        destroy: function (options) {
            // 在每个元素中执行代码
            return $(this).each(function () {
                var $this = $(this);
                // 执行代码
                // 删除元素对应的数据
                $this.removeData("AjaxIntercept");
            });
        }
    };
    $.fn.AjaxIntercept = function () {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method === "object" || !method) {
            method = methods.init;
        } else {
            $.error("Method" + method + "does not exist on jQuery.AjaxIntercept");
            return this;
        }

        return method.apply(this, arguments);
    };
})(jQuery);
$(function () {
    $("form[data-intercept='true'][data-ajax='true']").AjaxIntercept("init");
});