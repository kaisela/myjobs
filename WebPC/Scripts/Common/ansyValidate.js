$(document).ready(function () {
    
    $("input[type='text']").each(function () {

        //只能输入 数字
        if ($(this).attr("o2oint") != undefined) {
            $(this).keydown(function (event) {

                //37 39 48-57 96-105  8 9
                var code = event.keyCode;
                $(this).addClass("imeDisabled");
                //alert(event.keyCode);
                if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code == 37 || code == 39 || code == 8 || code == 9) {
                    return true;
                }
                return false;
            });
        }
    });

    
});

(function ($) {
    //验证 返回 true 或 false
    $.fn.O2O_Validate = function (options) {
        var opts = $.extend({}, $.fn.O2O_Validate.default, options);
        var retunObj = true;



        return retunObj;
    }

    //默认验证规则  一般用于查询等。
    $.fn.O2O_Validate.default = {
        container: null,
        express:null
    }

})(jQuery);

