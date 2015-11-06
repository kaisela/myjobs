$("a[name='finished']").on("click", function () {
    //成功刷新页面
    $.closeParentWindow({ status: true, winId: "EditOfSecond" });
});
