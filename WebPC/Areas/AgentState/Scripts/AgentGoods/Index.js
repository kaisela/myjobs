var isSale = 1;//操作：是否上/下架
var $gName ="";//搜索：商品名称
var $ulIsSale = 0;//当前上/下架状态
var pageSize = 20;
var AllIndex = 0;//总页数
var AllSorting = new Array();

var initPage = function () {
    $.getJSON("/AgentGoods/GetAllCount"
       , { GName: $gName, IsSales: $ulIsSale }
    , function (data) {
        var totalCount = parseInt(data[1]);
        if (totalCount <= pageSize) {
            $("span.pager").hide();
        }
        $("span.pager").Pager("init", totalCount, option);
        AllIndex = Math.ceil(totalCount / pageSize);
        AllSorting = data[2];
    });
};
var option = {
    callback: function (index, params) {
        pageIndex = index;
        var allparams = $.extend({}, params, { IsSales: $ulIsSale, PageIndex: index, pageSize: pageSize });

        $.getJSON('/AgentGoods/GetList'
                , allparams, function (data) {
                    var htmlArr = [];
                    var opIsSale = GetIsSales();
                    for (var i = 0; i < data.length; i++) {
                        htmlArr.push('<tr><td>');
                        htmlArr.push('<div class="ckbox ckbox-success">');
                        htmlArr.push('<input type="checkbox" name="check" id="checkbox' + i + '" value="' + data[i]["ID"] + '">');
                        htmlArr.push('<label for="checkbox' + i + '"></label>');
                        htmlArr.push('</div></td><td>');
                        htmlArr.push(' <img class="imgpew" src="' + getImgUrl(data[i]["IMG"] + "_3") + '" /></td>');
                        htmlArr.push('<td><a href="javascript:void(0)" class="shopName" title="' + data[i]["GName"].DeXml() + '">' + data[i]["GName"].DeXml() + '</a></td><td><span>');
                        htmlArr.push((data[i]["RType"] == 1) ? '零售建议价' : '全国统一价');
                        htmlArr.push('</span><br/>￥<span id="spanP_' + data[i]["ID"] + '">' + data[i]["Price"].toFixed(2) + '</span></td>');
                        htmlArr.push('<td>' + data[i]["GCount"] + '</td><td>' + data[i]["GCount"] + '</td>');
                        htmlArr.push(' <td>' + data[i]["PCName"].DeXml() + '>' + data[i]["CName"].DeXml() + '</td> <td>');
                        htmlArr.push((data[i]["ISNormal"] == 1) ? '<span>有货</span>' : '<span style="color:red;">停售</span>');
                        htmlArr.push('<td class="btngroup" style="text-align:center;">');
                        htmlArr.push('<a href="javascript:void(0)" class=""  id="IsSales_' + data[i]["ID"] + '" >' + opIsSale + '</a>&nbsp;');
                        htmlArr.push('<a href="javascript:void(0)" class="" id="Edit_' + data[i]["ID"] + '" ptype="' + data[i]["RType"] + '" price="' + data[i]["Price"]
                        + '" pMin="' + data[i]["MinPrice"] + '" pMax="' + data[i]["MaxPrice"] + '">编辑</a>&nbsp;');
                        htmlArr.push('<a href="javascript:void(0)" class="" id="Del_' + data[i]["ID"] + '">删除</a>');
                        if ($ulIsSale == 0) {
                            htmlArr.push('<br/>');
                            if (index == 0) index = 1;
                            if (index <= 1 && i == 0) {
                                htmlArr.push('<span>上移</span>&nbsp;');
                            }
                            else {

                                htmlArr.push('<a href="javascript:void(0)" class="" data-next="' + AllSorting[((index - 1) * pageSize) + (i - 1)]
                                    + '"  id="Sort_Up-' + data[i]["Sorting"] + '">上移</a>&nbsp;');
                            }
                            if ((index == AllIndex || AllIndex <= 1) && i == data.length - 1) {
                                htmlArr.push('<span>下移</span>&nbsp;');
                            }
                            else {
                                htmlArr.push('<a href="javascript:void(0)" class="" data-next="' + AllSorting[((index - 1) * pageSize) + (i + 1)]
                                    + '"  id="Sort_Down-' + data[i]["Sorting"] + '">下移</a>&nbsp;');

                            }
                        }
                        htmlArr.push('</td></tr>');
                    };
                    $("#tbodyGoods").html(htmlArr.join(""));

                    //单个删除
                    $("a[id^='Del_']").off("click").on("click", function () {
                        var delId = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                        if (confirm("确定要删除吗?")) {
                            $.getJSON("/AgentGoods/UpdateStatus", { agids: delId }
                                , function (data) {
                                    //if (data == "1") { }
                                    initPage();
                                    $("#selectall").removeAttr("checked");
                                    $.message("删除成功", true);
                                });
                        }
                    });
                    //单个上/下架
                    $("a[id^='IsSales_']").off("click").on("click", function () {
                        var salesId = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                        /// if (confirm("确定要" + $(this).html() + "吗?")) {
                        $.getJSON("/AgentGoods/UpdateIsSale", { isSale: isSale, gbids: salesId }
                            , function (data) {
                                //if (data == "1") { }
                                initPage();
                                $("#selectall").removeAttr("checked");
                                $.message($("#IsSales_" + salesId).html() + "成功", true);
                            });
                        //  }
                    });
                    //单个编辑商品
                    $("a[id^='Edit_']").off("click").on("click", function () {
                        var id = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                        var ptype = $(this).attr("ptype");
                        var price = $(this).attr("price");
                        var pMin = $(this).attr("pMin");
                        var pMax = $(this).attr("pMax");
                        $.windowBase({
                            id: "newWin1",
                            title: "修改商品",
                            isShowBtn: false,
                            callbackStr: "EditGoods",
                            url: "/AgentState/AgentGoods/EditGoodsAgent?gaid=" + id + "&ptype=" + ptype + "&price=" + price + "&pMin=" + pMin + "&pMax=" + pMax,
                            width: 800,
                            height: 600
                        });
                    });
                    //上/下移
                    $("a[id^='Sort_']").each(function () {
                        $(this).on("click", function () {
                            var sort = $(this).attr("id").substr($(this).attr("id").indexOf('-') + 1);
                            var upnext = $(this).attr("data-next");
                            $.getJSON("/AgentGoods/UpdateSorting", { sorting: sort, nextSorting: upnext }
                                    , function (data) {
                                        //if (data == "1") { }
                                        option.callback(pageIndex, option.getparams());
                                    });
                        });
                    });
                });
    },
    getparams: function () {
        return { GName: $gName };
    },
    pagesize: pageSize,
    showpage: 6,
    pageParam: "page",//ajax为true时不用传递
    ajax: true//当为false时callback不用传递,，但是必须传递pageParam
};
$(function () {
    initPage();
    //搜索
    $("#btnSearch").click(function () {
        $gName = $.trim($("#GName").val());
        initPage();
        $("#selectall").removeAttr("checked");
    });
    //商品上/下架列表
    $("#ulIsSale li").click(function () {
        $(this).addClass("active").siblings("li").removeClass("active");
        var idSaleIndex = parseInt($(this).find("a").attr("id"));
        $ulIsSale = idSaleIndex;        
        OpBatchIsSale();
        initPage();
        $("#selectall").removeAttr("checked");
    });
    //批量删除（逻辑）
    $("#batchDel").click(function () {
        var ids = checkedGBids();
        if (ids == "") {
            $.message("请先选择所要删除的商品!", false);
        }
        else {
            if (confirm("确定要删除吗?")) {
                $.getJSON("/AgentGoods/UpdateStatus", { agids: ids }
                    , function (data) {
                        //if (data == "1") { }
                        initPage();
                        $("#selectall").removeAttr("checked");
                        $.message("删除成功!", true);
                    });
            }
        }
    });
    //批量下架
    $("#divBatchOP").on("click", "#batch0", function () {
        var ids = checkedGBids();
        if (ids == "") {
            $.message("请先选择所要下架的商品！", false);
        }
        else {
            if (confirm("确定要下架吗?")) {
                $.getJSON("/AgentGoods/UpdateIsSale", { isSale: 1, gbids: ids }
                    , function (data) {
                        //if (data == "1") { }
                        initPage();
                        $("#selectall").removeAttr("checked");
                        $.message("下架成功!", true);
                    });
            }
        }
    });
    //批量上架
    $("#divBatchOP").on("click", "#batch1", function () {
        var ids = checkedGBids();
        if (ids == "") {
            $.message("请先选择所要上架的商品！", false);
        }
        else {
            if (confirm("确定要上架吗?")) {
                $.getJSON("/AgentGoods/UpdateIsSale", { isSale:0, gbids: ids }
                    , function (data) {
                        //if (data == "1") { }
                        initPage();
                         $("#selectall").removeAttr("checked");
                        $.message("上架成功!", true);
                    });
            }
        }
    });
    //批量修改
    $("#batchUpdate").click(function () {
        var ids = checkedGBids();
        if (ids == "") {
            $.message("请先选择所要修改的商品！", false);
        }
        else {
            $.windowBase({
                id: "newWin2",
                title: "批量修改商品",
                isShowBtn: false,
                callbackStr: "EditBatchGoods",
                url: "/AgentState/AgentGoods/EditBatchGoodsAgent?ids=" + ids + "&isSale=" + $ulIsSale,
                width: 800,
                height: 600
            });
        }
    });
    //获取选中的商品id集合
    var checkedGBids = function () {
        var ids = "";
        $("#tbodyGoods").find("input[name = check]:checked").each(function () {
            ids = ids + $(this).attr("value") + ",";
        });
        if (ids != "") ids = ids.substr(0, ids.length - 1);
        return ids;
    };
});
//获取操作中的上下架名称
function GetIsSales()
{
   return ($ulIsSale == 0) ? "下架" : ($ulIsSale == 1) ? "上架" : "入库";
}
//显示/隐藏 批量上下架
function OpBatchIsSale()
{
    if ($ulIsSale == 1) {
        isSale = 0;
        $("#divBatchOP").html('<a class="btn btn-primary btn-sm" id="batch1">批量上架</a>');
    }
    else if ($ulIsSale == 0) {
        isSale = 1;
        $("#divBatchOP").html('<a class="btn btn-primary btn-sm" id="batch0">批量下架</a>');
    }
    else {
        isSale = 1;
        $("#divBatchOP").html('<a class="btn btn-primary btn-sm" id="batch0">批量下架</a>'+
           ' <a class="btn btn-primary btn-sm" id="batch1">批量上架</a>');
    }
   
}
function EditGoods(data) {
    if (data.status)
    {
        var datas = data.Data.split(',');
        if (datas[1] != "")
        {
            $("#spanP_" + datas[0]).html(parseFloat(datas[1]).toFixed(2));
        }
        $.message("修改成功!", true);
    }
}
function EditBatchGoods(data) {
    if (data.status) {
        initPage();
        $.message("修改成功!", true);
    }
}