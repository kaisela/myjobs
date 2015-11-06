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
        //选择器里的值区分大小写
        $("#content").on("click", "a[name='Delete']:not([disabled=disabled])", function () {
            var $this = $(this);
            var id = $this.attr("data-id");
            //先判断是否关联过渠道
            $.post("/operate/Enterprise/GetShopRelation", { id: id, EnterpriseID: $("#EnterpriseID").val() }, function (data) {
                if (data.Status == false) {
                    $.message(data.Message, false);
                    return;
                }
                //获取ID data-id是存ID的html5格式的标签属性
                if (confirm("是否确认要删除？")) {
                    //post请求
                    $.post("/operate/Enterprise/Delete", { id: id, EnterpriseID: $("#EnterpriseID").val() }, function (returnData) {
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
        $("#content").on("click", "a[name='Edit']", function () {
            var $this = $(this);
            var id = $this.attr("data-id");
            $.windowBase({
                //因为编辑和新增可以套用同一个js 所以用相同id的iframe
                id: "Create",
                title: "修改公众号",
                isShowBtn: false,
                //回传方法 用于刷新页面
                callbackStr: "CreateSuccess",
                url: '/operate/Enterprise/EditWeixinMP/' + id + "?EnterpriseID=" + $("#EnterpriseID").val(),
                width: 900,
                height: 400
            });
        });
    }
    //加载数据
    var loadData = function () {
        //直接请求页面内容
        //运营端请求地址要带上运营端目录/operate
        $.post("/operate/Enterprise/WeixinMPList", { EnterpriseID: $("#EnterpriseID").val() }, function (data) {
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

$("#WeixinMPCreate").on("click", function () {
    $.windowBase({
        id: "Create",
        title: "添加公众号",
        isShowBtn: false,
        //回传方法 用于刷新页面
        callbackStr: "CreateSuccess",
        url: '/operate/Enterprise/Create' + "?EnterpriseID=" + $("#EnterpriseID").val(),
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
