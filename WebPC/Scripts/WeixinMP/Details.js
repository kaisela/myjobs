var index = (function ($) {
    var that = this;
    var pageSize = publicConfig.PagePublic;
    var startIndex = 1;

    //加载分页数据
    var option = {
        callback: function (pageIndex, params) {
            startIndex = pageIndex;
            var allparams = $.extend({}, params, { pageIndex: pageIndex, pageSize: pageSize, id: $("#id").val() });
            $.getJSON("/WeixinMP/DetailsGetDataPager", allparams, function (data) {
                var htmlArr = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var _Html = "";
                    _Html += "<tr>";
                    _Html += "    <td>" + item.ShopName + "</td>";
                    _Html += "    <td>" + item.AreasDesc + "</td>";
                    if (item.Agent) {
                        _Html += "<td><a href=\"javascript:void(0)\">" + item.Agent.AgentName + "</a></td>";
                    }
                    else {
                        _Html += "<td></td>";
                    }
                    _Html += "    <td>";
                    _Html += "        <div class=\"progress col-sm-10\" style=\"padding-left: 0;padding-right: 0;margin-bottom:0 ;margin-top: 4px;\">";
                    _Html += "            <div style=\"width: 40%\" aria-valuemax=\"100\" aria-valuemin=\"0\" aria-valuenow=\"40\" role=\"progressbar\" class=\"progress-bar progress-bar-success\">";
                    _Html += "                <span class=\"\">" + item.QRNumUsed + "</span>";
                    _Html += "            </div>";
                    _Html += "        </div>";
                    _Html += "        <span>" + item.QRNum + "</span>";
                    _Html += "    </td>";
                    _Html += "    <td>" + StatusStr(item.Status) + "</td>";
                    _Html += "    <td>";
                    _Html += "        <a href=\"javascript:void(0)\" data-id='" + item.ID + "' name =\"EditShopQRNumEdit\" class=\"winO2OPanel\" data-toggle=\"modal\" data-target=\".bs-example-modal-lg\" data-title=\"修改渠道可分配二维数\">修改</a>";
                    //_Html += "        <a href=\"javascript:void(0)\">删除</a>";
                    _Html += "    </td>";
                    _Html += "</tr>";
                    htmlArr.push(_Html);
                }
                $(".table>tbody").html(htmlArr.join(""));
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

        //注册表格的删除事件 通过jquery选择器查找到标签 $("#DetailsTable")元素必须先要存在
        $("#DetailsTable").on("click", "a[name='EditShopQRNumEdit']", function () {
            //标准的jquery命名变量
            var $this = $(this);
            var id = $this.attr("data-id");
            $.windowBase({
                id: "EditShopQRNumiframe",
                title: "修改渠道可分配二维数",
                isShowBtn: false,
                //回传方法 用于刷新页面 方法应该在外面注册不能在分页里注册
                callbackStr: "EditShopQRNumSuccessloadDataCount",
                url: '/WeixinMP/EditShopQRNum/' + id,
                width: 900,
                height: 300
            });
        });
    }
    //默认先加载总数 在加载完总数后再去加载分页数据
    var loadDataCount = function () {
        $.getJSON("/WeixinMP/DetailsGetTotal", { id: $("#id").val() }, function (data) {
            var totalCount = parseInt(data);
            option.startIndex = startIndex;
            //在加载完总数后再去加载分页数据
            $("span.pager").Pager("init", totalCount, option);
        });
    }
    return {
        init: init,
        loadDataCount: loadDataCount
    }
})(jQuery);
index.init();

//方法应该在外面注册不能在分页里注册
var EditShopQRNumSuccessloadDataCount = function (data) {
    //如果状态是true 才刷新页面
    if (data.status) {
        //刷新页面
        window.top.location.href = "/WeixinMP/Details/" + $("#id").val()
    }
}

//现在权限控制不需要给可用的标签绑定点击事件了
$("#WeixinMPEdit").on("click", function () {
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
            callbackStr: "EditSuccess",
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
            callbackStr: "EditSuccess",
            url: '/WeixinMP/EditOfSecond/' + id,
            width: 900,
            height: 300
        });
    }
});

var EditSuccess = function (data) {
    //如果状态是true 才刷新页面
    if (data.status) {
        //刷新页面
        window.top.location.href = "/WeixinMP/Details/" + $("#id").val();
    }
}

//根据实体店状态ID返回相应描述
var StatusStr = function (status) {
    if (status == 0) {
        return "正常";
    } else if (status == 1) {
        return "待审核";
    } else if (status == 2) {
        return "待分配";
    } else if (status == 3) {
        return "待验证";
    } else if (status == 4) {
        return "审核不通过";
    } else if (status == 5) {
        return "暂停";
    } else if (status == 6) {
        return "关闭";
    }
}
var Refresh = function (data) {
    //如果状态是true 才刷新页面
    if (data.status) {
        window.top.location.href = "/WeixinMP/Details/" + $("#id").val();
    }
}

//装载后注册事件 .content 一开始页面加载的时候就要存在时才能注册成功
$("#BindEnterpriseShop").on("click", function () {
    var $this = $(this);
    var id = $this.attr("data-id");
    $.post("/WeixinMP/GetQRNumCan", { ID: id }, function (data) {
        if (data > 0) {
            $.windowBase({
                id: "BindEnterpriseShopiframe",
                title: "绑定直营店",
                isShowBtn: false,
                //回传方法 用于刷新页面
                callbackStr: "Refresh",
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