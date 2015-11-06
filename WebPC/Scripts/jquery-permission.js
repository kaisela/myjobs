(function ($) {
    var methods = {
        init: function (options) {
            // 在每个元素上执行方法
            return this.each(function () {
                var $this = $(this);
                var settings = $this.data("permission");
                if (typeof settings === "undefined") {
                    var defaults = {
                        enabled: false
                    };
                    settings = $.extend({}, defaults, options);
                    $this.data("permission", settings);
                } else {
                    settings = $.extend({}, settings, options);
                    $this.data("permission", settings);
                }
                var data= {
                    authKey: $this.attr("data-au")
                }
                var userInfo = JSON.parse($.htmlDecode(window.permission));
                if (userInfo.UserName == "admin") {
                    return true;
                }
                var userPower = userInfo.RolePowerList;

                var userPermissionList = [];
                for (var i = 0; i < userPower.length; i++) {
                    userPermissionList.push(userPower[i].PowerID);
                }
                if (data.authKey) {
                    var isHas = false;
                    $.each(userPermissionList, function(index) {
                        var item = userPermissionList[index];
                        if (item === data.authKey) {
                            isHas = true;
                            return;
                        }
                    });
                    if (!isHas) {
                        $this.off("click");
                        $this[0].onclick = function () {
                            return false;
                        }
                        $this.unbind("click");
                        $this.attr("disabled", "disabled");
                        if ($this[0].tagName==="A") {
                            $this.attr("href", "javascript:void(0)");
                        }
                        $this.css({
                            color: "gray",
                            cursor: "not-allowed",
                            "pointer-events":"none"
                        });
                    }
                }
            });
        },
        destroy: function (options) {
            // 在每个元素中执行代码
            return $(this).each(function () {
                var $this = $(this);
                // 执行代码
                // 删除元素对应的数据
                $this.removeData("permission");
            });
        }
    };
    $.fn.permission = function () {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method === "object" || !method) {
            method = methods.init;
        } else {
            $.error("Method" + method + "does not exist on jQuery.permission");
            return this;
        }
        return method.apply(this, arguments);
    };
})(jQuery);
$(function () {
    if ($.fn.permission) {
        $("input[data-au],button[data-au],a[data-au]").permission("init");
        $(document).ajaxSuccess(function () {
            $("input[data-au],button[data-au],a[data-au]").permission("init");
        });
    }
    
});