$("a[name='finished']").on("click", function () {
    //关闭模式窗口 刷新页面已在模式窗口回传里写好
    $.closeParentWindow({ status: true, winId: "Create" })
});
