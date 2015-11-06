var ReturnVisitCreateSuccess = function (hxr) {
    if (hxr.Status == true) {
        $.message(hxr.Message, true);
        setTimeout(function () {
            window.top.location.href = hxr.Identify.url;
        }, 2000);
    }
}
$("#openAuto").on("click", function () {
    //$("body").css({
    //    overflow: "hidden"
    //});
    $.windowBase({
        id: "autoOpen",
        title: "选择商品",
        isShowBtn: false,
        //GoodsBasicIDs 已经选择过的商品ID
        url: '/GoodsBasic/AutoGoodsBasic?GoodsBasicIDs=' + $("#GoodsBasicIDs").val(),
        width: 900,
        height: 600
    });
});

//jquery UI autocomplete 关键字搜索
$("#ShopName").autocomplete("/ShopInfo/GetShopName?status=0", {
    width: 260,
    selectFirst: false,
    parse: JSON.parse,
    max: 20,
    formatItem: function (data, index, count, value, keywords) {
        return data;
    },
    formatResult: function (data, index, count, value, keywords) {
        return value;
    }
});

$('#BuyTime').datetimepicker({
    lang: 'ch',
    timepicker: false,
    format: 'Y-m-d',
    formatDate: 'Y-m-d',
    BeforeSelectData: function (a, b, c) {
        if (new Date(c) > new Date($('#VisitTime').val())) {
            $.message("购买时间必须小于回访时间", false);
            return false;
        }
        return true;
    },
    maxDate: (new Date()).Format("yyyy-MM-dd")
});

$('#VisitTime').datetimepicker({
    lang: 'ch',
    timepicker: false,
    format: 'Y-m-d',
    formatDate: 'Y-m-d',
    BeforeSelectData: function (a, b, c) {
        if (new Date(c) < new Date($('#BuyTime').val())) {
            $.message("购买时间必须小于回访时间", false);
            return false;
        }
        return true;
    },
    //这里只能指定最大事件 如果指定最小时间 是购买时间 
    //那么一开始加载页面时就不能选择其它事件了 因为默认购买时间也是今天
    maxDate: (new Date()).Format("yyyy-MM-dd")
});

function setSelectGoods(obj) {
    $.each(obj, function () {
        var o = $("#goodsList").find("span[class='proLable'][id='" + this.id + "']");
        if (!o || o.length == 0) {
            var html = '<span class="proLable" id="' + this.id + '">';
            html += ' <span class="proName" title="' + this.name.DeXml() + '">' + this.name.DeXml() + '</span>';
            html += '<i class="close" onclick="deleted(this)">x</i>';
            html += "</span>";
            //添加商品ID值
            var val = $("#GoodsBasicIDs").val();
            //如果不为空需要加逗号隔开
            if (val) val = val + ",";
            $("#GoodsBasicIDs").val(val + this.id);
            $("#goodsList").append(html);
        }
    });
}

function deleted(_this) {
    var val = $("#GoodsBasicIDs").val();
    //如果不为空需要删除商品ID值
    if (val) {
        //需要先转成数组 移除一项 再用逗号连接转成字符串
        var arr = val.split(",");
        //不能用$(_this).parent().id获取Id 要用$(_this).parent().attr("id")获取id
        arr.splice($.inArray($(_this).parent().attr("id"), arr), 1);
        val = arr.join(",");
        $("#GoodsBasicIDs").val(val);
    }
    $(_this).parent().remove();
}