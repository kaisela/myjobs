$("a[name='finished']").on("click", function () {
    //关闭模式窗口 刷新页面已在模式窗口回传里写好
    $.closeParentWindow({ status: true, winId: "CreateOfFirst" })
});
$("#linkCreateOfFirst").on("click", function () {
    //直接指定iframe的url地址 用来切换选项卡
    window.location.href = "/WeixinMP/CreateOfFirst";
});
