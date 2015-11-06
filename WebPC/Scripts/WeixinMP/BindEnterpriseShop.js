var index = (function ($) {
    var that = this;
    var pageSize = publicConfig.PagePublic;
    var startIndex = 1;

    //加载分页数据
    var option = {
        callback: function (pageIndex) {
            startIndex = pageIndex;
            var allparams = $.extend({}, { pageIndex: pageIndex, pageSize: pageSize });
            $.getJSON("/WeixinMP/GetNotWeixinMP", allparams, function (data) {
                var htmlArr = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var _Html = "";
                    _Html += "<li>";
                    _Html += "<label><input type=\"checkbox\" value='" + item.ID + "' name='check'>" + item.ShopName + "</label>";
                    _Html += "<label>" + item.AreasDesc + "</label>";
                    _Html += "</li>";
                    htmlArr.push(_Html);
                }
                $("#BindEnterpriseShopContent").html(htmlArr.join(""));
                //如果页面高度很高 必须给iframe重置高度
                $.resizeParentWindow("BindEnterpriseShopiframe");
                //为了分页时初始化全选按钮
                $("#BindEnterpriseShopSelectAll").prop("checked", false);
            });
        },
        startIndex: 1,
        //要对应小写的pagesize参数 否则不能正确显示分页
        pagesize: pageSize,
        showpage: 6,
        //pageParam: "page",//ajax为true时不用传递
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }
    var init = function () {
        //默认先加载总数 在加载完总数后再去加载分页数据
        loadDataCount();
    }
    //默认先加载总数 在加载完总数后再去加载分页数据
    var loadDataCount = function () {
        $.getJSON("/WeixinMP/GetNotWeixinMPTotal", {}, function (data) {
            var totalCount = parseInt(data);
            //赋值标题总数
            $("#BindEnterpriseShopTotal").text(totalCount);
            option.startIndex = startIndex;
            //在加载完总数后再去加载分页数据
            $("span.pager").Pager("init", totalCount, option);
        });
    }
    return {
        init: init
    }
})(jQuery);
index.init();

//去分配直营店二维码值
$("#BindEnterpriseShopNext").on("click", function () {
    //获取选中的实体店ID
    var shopid = "";
    var obj = $("input[type='checkbox'][name='check']:checked");
    for (var i = 0; i < obj.length ; i++) {
        shopid = shopid + obj.eq(i).val() + ",";
    };
    if (shopid) {
        //直接指定iframe的地址 用来跳转页面
        window.location.href = "/WeixinMP/EditShopQRNumBatch/" + $("#WeixinMPID").val() + "?shopID=" + shopid;
    }
    else {
        //消息提示 在public里已经封装
        $.message("至少选择一项!", false);
    }
});

