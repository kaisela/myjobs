$("#EditShopQRNumCancel").on("click", function () {
    $.closeParentWindow({
        status: false,
        winId: "EditShopQRNumiframe"
    });
});

var EditShopQRNumSuccess = function (hxr) {
    if (hxr.Status == true) {
        $.message(hxr.Message, true);
        setTimeout(function () {
            $.closeParentWindow({ status: true, winId: "EditShopQRNumiframe" })
        }, 2000);
    }
    else {
        $.message(hxr.Message, false);
    }
}
