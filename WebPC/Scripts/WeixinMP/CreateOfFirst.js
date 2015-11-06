$("#CreateCancel").on("click", function () {
    $.closeParentWindow({
        status: false,
        winId: "CreateOfFirst"
    });
});

$("#linkCreateOfSecond").on("click", function () {
    //直接指定iframe的地址 用来切换选项卡
    window.location.href = "/WeixinMP/CreateOfSecond";
});
var CreateSuccess = function (hxr) {
    if (hxr.Status == true) {
        $.message(hxr.Message, true);
        //延迟执行方法 setTimeout(); 一个参数是执行的方法 另一个参数是延迟时间
        setTimeout(function () {
            $.closeParentWindow({ status: true, winId: "CreateOfFirst" });
        }, 2000);
    }
    else {
        $.message(hxr.Message, false);
    }
}
