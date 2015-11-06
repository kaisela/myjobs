$(function () {
    pageSize =20;
    $txtName = $("#txtName");
    var option = {
        callback: function (index, params) {
            pageIndex = index;
            var allparams = $.extend({}, params, { PageIndex: index, pageSize: pageSize });
            $.getJSON('/SellPoint/GetList'
                    , allparams, function (data) {
                        var htmlArr = [];
                        for (var i = 0; i < data.length; i++) {
                            htmlArr.push('<tr><td>');
                            htmlArr.push('<div class="ckbox ckbox-success">');
                            htmlArr.push('<input type="checkbox" name="check" id="checkbox' + i + '" value="' + data[i]["ID"] + '">');
                            htmlArr.push('<label for="checkbox' + i + '"></label>');
                            htmlArr.push('</div></td><td>');                            
                            htmlArr.push('<a href="/SellPoint/ShowSellPoint/' + data[i]["ID"] + '">' + data[i]["Title"].DeXml() + '</a></td><td>');
                            if (data[i]["GName"] != null && data[i]["GName"] != "") {
                                var ggArr = new Array();
                                ggArr = data[i]["GName"].split(',');
                                for (var item = 0; item < ggArr.length; item++)
                                // $(ggArr).each(function (item)
                                {
                                    if (item== 10) {
                                        htmlArr.push(' <span>......</span><br />');
                                        break;
                                    }
                                    htmlArr.push(' <span>' + ggArr[item].DeXml() + '</span><br />');
                                   
                                };
                            }
                            htmlArr.push(' </td><td class="table-aSpace">');
                            htmlArr.push('<a href="/SellPoint/Operate/' + data[i]["ID"] + '" class="" id="Edit_' + data[i]["ID"] + '">编辑</a>&nbsp;');
                            htmlArr.push('<a href="javascript:void(0)" class="" id="Del_' + data[i]["ID"] + '">删除</a>');
                           
                            htmlArr.push('</td></tr>');
                        };
                        $("#tbodySP").html(htmlArr.join(""));

                        //单个删除
                        $("a[id^='Del_']").off("click").on("click", function () {
                            var delId = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                            if (confirm("确定要删除吗?")) {
                                $.getJSON("/SellPoint/DelSP", { ids: delId }
                                    , function (data) {
                                        //if (data == "1") { }
                                        initPage();
                                        $.message("删除成功", true);
                                    });
                            }
                        });
                    });
        },
        getparams: function () {
            return { GName: $.trim($txtName.val()) };
        },
        pagesize: pageSize,
        showpage: 6,
        pageParam: "page",//ajax为true时不用传递
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }
    var initPage = function () {
        $.getJSON("/SellPoint/GetAllCount", { GName: $.trim($txtName.val()) }
        , function (data) {
            var totalCount = parseInt(data);
            if (totalCount <= pageSize) {
                $("span.pager").hide();
            }
            $("span.pager").Pager("init", totalCount, option);
        });
    }
    initPage();
    //搜索
    $("#btnSearch").click(function () {
        initPage();
    });
    $("#batchDel").click(function () {
        var ids = checkedGBids();
        if (ids == "") {
            $.message("请先选择所要删除的商品!", false);
        }
        else {
            if (confirm("确定要删除吗?")) {
                $.getJSON("/SellPoint/DelSP", { ids: ids }
                    , function (data) {
                        //if (data == "1") { }
                        initPage();
                        $.message("删除成功!", true);
                        $("#selectall").removeAttr("checked");
                    });
            }
        }
    });
    //获取选中的商品id集合
    var checkedGBids = function () {
        var ids = "";
        $("#tbodySP").find("input[name = check]:checked").each(function () {
            ids = ids + $(this).attr("value") + ",";
        });
        if (ids != "") ids = ids.substr(0, ids.length - 1);
        return ids;
    };
});