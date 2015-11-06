$("#EditShopQRNumBatchCancel").on("click", function () {
    $.closeParentWindow({
        status: false,
        winId: "BindEnterpriseShopiframe"
    });
});

var EditShopQRNumBatchSuccess = function (hxr) {
    if (hxr.Status == true) {
        $.message(hxr.Message, true);
        //延迟执行方法 setTimeout(); 一个参数是执行的方法 另一个参数是延迟时间
        setTimeout(function () {
            $.closeParentWindow({ status: true, winId: "BindEnterpriseShopiframe" });
        }, 2000);
    }
    else {
        $.message(hxr.Message, false);
    }
}
//选择器里的值可以不用写引号
$("a[name=EditShopQRNumBatchDelete]").on("click", function () {
    //jquery标准变量声称
    var $this = $(this);
    if (confirm("确定删除吗？")) {
        $this.parent().remove();
        //更新选中的实体店个数 span 标签之间的值用text()方法获取 也用text()来赋值
        $("#ShopNum").text(parseInt($("#ShopNum").text()) - 1);
        //实时更新最多可分配数
        GetQRNumCan();
    }
});

//分配时实时更新最多可分配数
$("input[name=QRNum]").blur(function () {
    GetQRNumCan();
});

var GetQRNumCan = function () {
    $.post("/WeixinMP/GetQRNumCan", { ID: $("#WeixinMPID").val() }, function (data) {
        //item.QRNum是根据循环model来的 这里不能用value选择器来查找
        var obj = $("input[type='text'][name='QRNum']");
        //页面上全部已经输入的数
        var sum = 0;
        for (var i = 0; i < obj.length ; i++) {
            var val = obj.eq(i).val();
            if (isNaN(val) == false) {
                sum = sum + parseInt(val);
            }
        };
        //不允许超过可分配数量
        var remain = parseInt(data) - sum;
        if (remain < 0) {
            $.message("不允许超过可分配数量", false);
        }
        $("#QRNumCan").text(remain);
    });
}
