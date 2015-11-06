var index = (function ($) {
    var that = this;
    var pageSize = publicConfig.PageReturnVisit;
    var startIndex = 1;

    //加载分页数据
    var option = {
        callback: function (pageIndex, params) {
            startIndex = pageIndex;
            var allparams = $.extend({}, params, { pageIndex: pageIndex, pageSize: pageSize, orderby: $("#orderby").val() });
            $.getJSON("/ReturnVisit/GetDataPager", allparams, function (data) {
                var htmlArr = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    htmlArr.push("<tr>" +
                            "<td>" + item.GoodsName.DeXml() +
                            "</td>" +
                            "<td>" + item.Consumer + "</td>" +
                            //AreasDesc省市县是从缓存里读取的 js空字符串可以直接判断
                            "<td>" + item.ShopName + (item.AreasDesc ? "[" + item.AreasDesc + "]" : "") + "</td>" +
                            "<td>" + (new Date(item.BuyTime)).Format("yyyy-MM-dd") + "</td>" +
                            "<td>" + (new Date(item.VisitTime)).Format("yyyy-MM-dd") + "</td>" +
                            "<td>" + item.VistDesc + "</td>" +
                            "<td><span data-func='video' data-src='" + getAviUrl(item.Recording) + "'></span></td>" +
                            "<td>" + item.Remarks.subLongStr(20, true) + "</td>" +
                            "<td>" +
                                "<a href='/ReturnVisit/Edit/" + item.ID + "' data-au='OldCommEdit' class='edit'>编辑</a>" +
                                "<a data-id=" + item.ID + " href='javascript:void(0)' data-au='OldCommDel' class='delete'>删除</a>" +
                            "</td>" +
                        "</tr>");
                }

                $(".table>tbody").html(htmlArr.join(""));
                $("[data-func='video'][data-src]").video();
            });
        },
        getparams: function () {
            return $("#ReturnVisitForm").serializeObject();
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
        //搜索就是获取总行数 成功后去分页 hxr是总行数

        window.success = function (hxr) {
            //如果是提交表单的方式分页 orderby回到初始值 不排序
            $("span.pager").Pager("init", hxr, option);
        }

        //注册表格的删除事件 通过jquery选择器查找到标签
        //为了配合权限需要在选择器的查找属性里加:not([disabled=disabled])来给可用的标签绑定点击事件
        //因为on事件注册了就移除不了
        $("#ReturnVisitTable").on("click", ".delete:not([disabled=disabled])", function () {
            var $this = $(this);
            //获取ID data-id是存ID的html5格式的标签属性
            var id = $this.attr("data-id");
            if (confirm("你确定要删除吗？")) {
                //post请求
                $.post("/ReturnVisit/Delete", { id: id }, function (returnData) {
                    //永远是正确的结果 直接提示出消息
                    $.message(returnData.Message, true);
                    //重新加载数据
                    loadDataCount();
                    //返回一个json格式的结果 把returnData转成json
                }, "json");
            }
        });
    }
    //默认先加载总数 在加载完总数后再去加载分页数据
    var loadDataCount = function () {
        $.getJSON("/ReturnVisit/GetTotal", {}, function (data) {
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
//注册
$("a[name='Arorderby']").click(function () {
    var thisValue = $(this).attr("thisValue");
    var v = thisValue;
    if (thisValue == 0) v = 1;
    else v = 0;
    var isck = $(this).attr("isck");
    if (isck == "-1") {
        $("#orderby").val(thisValue);
        $(this).attr("isck", "1");
        $("a[name='Arorderby'][thisValue='" + v + "']").attr("isck", "-1");
        $("#ReturnVisitForm").submit();
    }
    else {
        $("#orderby").val(-1);
        $(this).attr("isck", "-1");
        $("#ReturnVisitForm").submit();
    }
});
