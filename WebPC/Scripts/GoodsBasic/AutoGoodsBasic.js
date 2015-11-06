$(document).ready(function () {
    //确定选择事件
    $("#btnSubmit").click(function () {
        debugger;
        var c = $("#content input[type='checkbox']:checked");
        var retObject = [];
        $.each(c, function () {
            var id = $(this).attr("goodsid");
            var name = $(this).attr("goodsName");
            retObject.push({ id: id, name: name })
        });
        window.parent.setSelectGoods(retObject);
        window.parent.$("body").css({
            "overflow-y": "scroll"
        });
        $.closeParentWindow({ winid: "autoOpen" });
    });
    window.success = function (hxr) {
        $("#pager").Pager("init", hxr, option);
    }
    var pageSize = 20;
    var option = {
        callback: function (index) {
            $.post("/GoodsBasic/AutoGoodsBasicPage", {
                GoodsClassFirst: $("select[name='GoodsClassFirst']").val(),
                GoodsClassSecond: $("select[name='GoodsClassSecond']").val(),
                groupId: $("select[name='groupId']").val(),
                GoodsBasicIDs: $("#GoodsBasicIDs").val(),
                name: $("#name").val(), pageIndex: index, pageSize: pageSize
            }, function (data) {
                $("#content").html(data);
                $.resizeParentWindow("autoOpen");
            });
        },
        pagesize: pageSize,
        showpage: 6,
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }
    //第一页默认加载数据 只需设置默认参数
    function getTotal() {
        var total = 0;
        $.ajax({
            async: false,
            url: '/GoodsBasic/GetAutoGoodsBasicTotal',
            data: { name: $("#name").val(), GoodsBasicIDs: $("#GoodsBasicIDs").val() }
            , success: function (data) {
                total = data;
            }
        });
        return total;
    }
    $("#pager").Pager("init", getTotal(), option);
});