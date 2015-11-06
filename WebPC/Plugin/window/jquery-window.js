(function ($) {
    var methods = {
        init: function (options) {
            // 在每个元素上执行方法
            return this.each(function () {
                var $this = $(this);
                $this.on("click", function () {
                    var beforeCloseFunc = null;
                    var beforeOpenFunc = null;
                    if ($this.attr("data-beforeClose")) {
                        beforeCloseFunc = eval('(' + $this.attr("data-beforeClose") + ')');
                    }
                    if ($this.attr("data-beforeOpen")) {
                        beforeOpenFunc = eval('(' + $this.attr("data-beforeOpen") + ')');
                    }
                    var callback = null;
                    if ($this.attr("data-callback")) {
                        callback = eval('(' + $this.attr("data-callback") + ')');
                    }
                    var data = {
                        id: $this.attr("data-id"),
                        title: $this.attr("data-title"),
                        isShowBtn: $this.attr("data-show-btn"),
                        callbackStr: $this.attr("data-callback"),
                        callback: callback,
                        ele: $this.attr("data-ele"),
                        url: $this.attr("data-url"),
                        width: $this.attr("data-width"),
                        height: $this.attr("data-height"),
                        beforeClose: beforeCloseFunc,
                        beforeOpen: beforeOpenFunc
                    };
                    //正式开始逻辑代码
                    $.windowBase(data);
                });
            });
        },
        close: function () {

        },
        destroy: function (options) {
            // 在每个元素中执行代码
            return $(this).each(function () {
                var $this = $(this);
                // 执行代码
                // 删除元素对应的数据
                $this.removeData("o2owindow");
            });
        }
    };
    $.fn.o2owindow = function () {
       // debugger;
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method === "object" || !method) {
            method = methods.init;
        } else {
            $.error("Method" + method + "does not exist on jQuery.Upload");
            return this;
        }
        return method.apply(this, arguments);
    };
})($);
$(function () {
    $("a[data-func='openWin'],input[data-func='openWin'],button[data-func='openWin']").o2owindow("init");
});