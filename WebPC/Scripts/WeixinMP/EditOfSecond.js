$("#EditCancel").on("click", function () {
    $.closeParentWindow({
        status: false,
        //因为是指定iframe的url地址 iframeID 还是原来的
        winId: "EditOfSecond"
    });
});
var EditSuccess = function (hxr) {
    if (hxr.Status == true) {
        $.message(hxr.Message, true);
        setTimeout(function () {
            //直接指定iframe的url地址 用来切换选项卡
            window.location.href = "/WeixinMP/EditOfSecondSuccess/" + hxr.Identify.ID;
        }, 2000);
    }
    else {
        $.message(hxr.Message, false);
    }
}
