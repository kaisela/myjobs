var index = (function ($) {
    var that = this;
    var pageSize = publicConfig.PagePublic;
    var startIndex = 1;

    //加载分页数据
    var option = {
        callback: function (pageIndex) {
            startIndex = pageIndex;
            var allparams = $.extend({}, { pageIndex: pageIndex, pageSize: pageSize });
            $.getJSON("/WeixinMP/GetNotWeixinMPAgent", allparams, function (data) {
                var htmlArr = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var _Html = "";
                    _Html += "<li>";
                    _Html += "<label class=\"col-sm-9\"><a href='WeixinMP/BindAgentShop/" + $("#WeixinMPID").val() + "?AgentID='" + item.ID + " class=\"HrefFrame\" data-div=\".O2OWin\">" + item.AgentName + "</a></label>";
                    _Html += "<label class=\"col-sm-3\">备注：<span>" + item.Remarks + "</span></label>";
                    _Html += "</li>";
                    htmlArr.push(_Html);
                }
                $("#BindEnterpriseShopContent").html(htmlArr.join(""));
                //如果页面高度很高 必须给iframe重置高度
                $.resizeParentWindow("BindAgentiframe");
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
        $.getJSON("/WeixinMP/GetNotWeixinMPAgentTotal", {}, function (data) {
            var totalCount = parseInt(data);
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
