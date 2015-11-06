(function ($) {
    var methods = {
        init: function (options) {
            // 在每个元素上执行方法
            return this.each(function () {
                var $this = $(this);
                var settings = $this.data("selectall");
                if (typeof settings === "undefined") {
                    var defaults = {
                        enabled: false
                    };
                    settings = $.extend({}, defaults, options);
                    $this.data("selectall", settings);
                } else {
                    settings = $.extend({}, settings, options);
                    $this.data("selectall", settings);
                }
                
                var data = {
                    name: $this.attr("data-name")
                }
                $("body").on("click", "input:checkbox[name=" + data.name + "]", function () {
                    var cks = $("input:checkbox[name=" + data.name + "]").not(":disabled");
                   
                    var cksChecked = $("input:checkbox[name=" + data.name + "]").not(":disabled").map(function () {
                        if ($(this).prop("checked") == true) {
                            return this;
                        }
                    });
                    if (cksChecked.length == 0) {
                        $this.prop("checked", false);
                    } else {
                        if (cks.length != cksChecked.length) {
                            $this.prop("checked", false);
                            //这里做未全选，注意未全选跟没选中状态是不一样的(暂时不实现)
                        } else {
                            $this.prop("checked", true);
                        }
                    }
                });
                $this.on("click", function () {
                    //正式开始逻辑代码
                    var cks = $("input:checkbox[name=" + data.name + "]").not(":disabled");
                   
                    var isChecked = $this.prop("checked");
                    cks.prop("checked", isChecked);
                });
            });
        },
        destroy: function (options) {
            // 在每个元素中执行代码
            return $(this).each(function () {
                var $this = $(this);
                // 执行代码
                // 删除元素对应的数据
                $this.removeData("selectall");
            });
        }
    };
    $.fn.selectall = function () {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method === "object" || !method) {
            method = methods.init;
        } else {
            $.error("Method" + method + "does not exist on jQuery.selectall");
            return this;
        }
        return method.apply(this, arguments);
    };
})(jQuery);
$(function () {
    $("input[data-func='selectall']").selectall("init");
});