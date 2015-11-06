var index = (function ($) {
    var init = function () {
        //加载数据
        loadData();
        //搜索就是获取总行数 成功后去分页 hxr是总行数
        window.success = function (view) {
            //在内容页里装载数据
            $("#content").html(view);
        }

        //注册删除事件 通过jquery选择器查找到标签
        //为了配合权限需要在选择器的查找属性里加:not([disabled=disabled])来给可用的标签绑定点击事件
        //因为on事件注册了就移除不了
        $("#content").on("click", "a[name='delete']:not([disabled=disabled])", function () {
            var $this = $(this);
            var id = $this.attr("data-id");
            //先判断是否关联过渠道
            $.post("/WeixinMP/GetShopRelation", { id: id }, function (data) {
                if (data.Status == false) {
                    $.message(data.Message, false);
                    return;
                }
                //获取ID data-id是存ID的html5格式的标签属性
                if (confirm("是否确认要删除？")) {
                    //post请求
                    $.post("/WeixinMP/Delete", { id: id }, function (returnData) {
                        //永远是正确的结果 直接提示出消息
                        $.message(returnData.Message, true);
                        //重新加载数据
                        loadData();
                        //返回一个json格式的结果 把returnData转成json
                    }, "json");
                }
                //返回一个json格式的结果 把returnData转成json
            }, "json");
        });

        $("#content").on("click", "a[name='edit']:not([disabled=disabled])", function () {
            var $this = $(this);
            var id = $this.attr("data-id");
            //修改是两种方式分开 如果是第一种方式增加的修改时也修改相对应的数据
            var addtype = $this.attr("data-addtype");
            if (addtype == 1) {
                $.windowBase({
                    id: "EditOfFirst",
                    title: "修改公众号",
                    isShowBtn: false,
                    //回传方法 用于刷新页面
                    callbackStr: "CreateSuccess",
                    url: '/WeixinMP/EditOfFirst/' + id,
                    width: 900,
                    height: 300
                });
            }
            else {
                $.windowBase({
                    id: "EditOfSecond",
                    title: "修改公众号",
                    isShowBtn: false,
                    //回传方法 用于刷新页面
                    callbackStr: "CreateSuccess",
                    url: '/WeixinMP/EditOfSecond/' + id,
                    width: 900,
                    height: 300
                });
            }
        });
    }
    //加载数据
    var loadData = function () {
        //直接请求页面内容
        $.post("/WeixinMP/WeixinMPList", { keywords: $("#keywords").val() }, function (data) {
            //在内容页里装载数据
            $("#content").html(data);
        });
    }
    return {
        init: init,
        loadData: loadData
    }
})(jQuery);
index.init();

//装载后注册事件 .content 一开始页面加载的时候就要存在时才能注册成功
$("#content").on("click", ".spread", function () {
    //装载微信省份的城市分布 没有装过时才去装载 要用trim方法去掉空行
    var dorp = $(this).children().find(".dorp");
    if (dorp.html().trim() == "") {
        //直接请求页面内容
        $.post("/WeixinMP/WeixinMPProvinceDetail", {
            WeixinMPID: $(this).attr("data-id"),
            ProvoiceID: $(this).attr("data-provoiceid")
        }, function (data) {
            //在内容页里装载数据
            dorp.html(data);
        });
    }
    if ($(this).children().find(".dorp").css("display") == "none") {
        $(this).children().find(".dorp").css("display", "block");
    } else {
        $(this).children().find(".dorp").css("display", "none");
    }
});

$("#Create").on("click", function () {
    $.windowBase({
        id: "CreateOfFirst",
        title: "新增公众号",
        isShowBtn: false,
        //回传方法 用于刷新页面
        callbackStr:"CreateSuccess",
        url: '/WeixinMP/CreateOfFirst',
        width: 900,
        height: 400
    });
});

var CreateSuccess = function (data) {
    //如果状态是true 才刷新页面
    if (data.status) {
        index.loadData();
    }
}
//装载后注册事件 .content 一开始页面加载的时候就要存在时才能注册成功
$("#content").on("click", "a[name='BindEnterpriseShopLink']", function () {
    var $this = $(this);
    var id = $this.attr("data-id");
    $.post("/WeixinMP/GetQRNumCan", { ID: id }, function (data) {
        if (data > 0) {
            $.windowBase({
                id: "BindEnterpriseShopiframe",
                title: "绑定直营店",
                isShowBtn: false,
                //回传方法 用于刷新页面
                callbackStr: "CreateSuccess",
                url: '/WeixinMP/BindEnterpriseShop/' + id,
                width: 900,
                height: 600
            });
        }
        else {
            $.message("抱歉，当前公众号的二维码使用量已达到上限，不允许再绑定新的实体店，如需强制绑定，请联系运营方！", false);
            return;
        }
    });
});

//装载后注册事件 .content 一开始页面加载的时候就要存在时才能注册成功
$("#content").on("click", "a[name='BindAgentLink']", function () {
    var $this = $(this);
    var id = $this.attr("data-id");
    $.post("/WeixinMP/GetQRNumCan", { ID: id }, function (data) {
        if (data > 0) {
            $.windowBase({
                id: "BindAgentiframe",
                title: "绑定直营店",
                isShowBtn: false,
                //回传方法 用于刷新页面
                callbackStr: "CreateSuccess",
                url: '/WeixinMP/BindAgent/' + id,
                width: 900,
                height: 600
            });
        }
        else {
            $.message("抱歉，当前公众号的二维码使用量已达到上限，不允许再绑定新的实体店，如需强制绑定，请联系运营方！", false);
            return;
        }
    });
});

