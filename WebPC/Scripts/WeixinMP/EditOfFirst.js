$("#EditCancel").on("click", function () {
    $.closeParentWindow({
        status: false,
        winId: "EditOfFirst"
    });
});
var EditSuccess = function (hxr) {
    if (hxr.Status == true) {
        $.message(hxr.Message, true);
        setTimeout(function () {
            $.closeParentWindow({ status: true, winId: "EditOfFirst" });
        }, 2000);
    }
    else {
        $.message(hxr.Message, false);
    }
}
