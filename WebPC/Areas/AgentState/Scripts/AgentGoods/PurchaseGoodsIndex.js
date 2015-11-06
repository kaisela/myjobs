var $ulIsSelect = 0;//是否选购
var GName = $.trim($("#GName").val());
var CId = $("#GClass").val();
var PCId = $("#GClassP").val();
$(function () {
    var pageSize = 20;
    var option = {
        callback: function (index, params) {
            pageIndex = index;
            var allparams = $.extend({}, params, { PageIndex: index, pageSize: pageSize });
            $.getJSON('/AgentPurchaseGoods/GetList'
                    , allparams, function (data) {
                        var htmlArr = [];
                        for (var i = 0; i < data.length; i++) {
                            htmlArr.push('<tr><td>');
                            htmlArr.push('<div class="ckbox ckbox-success">');
                            htmlArr.push('<input type="checkbox" name="check" id="checkbox' + i + '" value="' + data[i]["ID"] + '">');
                            htmlArr.push('<label for="checkbox' + i + '"></label>');
                            htmlArr.push('</div></td><td>');
                            htmlArr.push(' <img class="imgpew" src="' + getImgUrl(data[i]["IMG"] + "_3") + '" /></td>');
                            htmlArr.push('<td><a class="shopName" id="Show_' + data[i]["ID"] + '" title="' + data[i]["GName"].DeXml() + '">' + data[i]["GName"].DeXml() + '</a></td><td><span>');
                            htmlArr.push((data[i]["RType"] == 1) ? '零售建议价' : '全国统一价');
                            htmlArr.push('</span>￥' + data[i]["Price"].toFixed(2) + '</td>');
                            htmlArr.push('<td>' + data[i]["GCount"] + '</td><td>' + data[i]["GCount"] + '</td>');
                            htmlArr.push(' <td>' + data[i]["PCName"].DeXml() + '>' + data[i]["CName"].DeXml() + '</td> <td>');
                            htmlArr.push((data[i]["ISNormal"] == 1) ? '<span>有货</span>' : '<span style="color:red;">停售</span>');
                            var t = new Date(parseInt(data[i]["AddTime"].replace("/Date(", '').replace(")/", ''), 10));
                            htmlArr.push(' </td><td>' + t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + '</td>');
                            htmlArr.push('<td class="btngroup" style="text-align:center;" id="tdOp">');
                            if ($ulIsSelect == 0) {
                                htmlArr.push('<a href="javascript:void(0)" class=""  id="IsSelect_' + data[i]["ID"] + '" >选购</a>');
                            }
                            else
                                htmlArr.push('<span class="gray" >已选购</span>');

                        }
                        htmlArr.push('</td></tr>');

                        $("#tbodyGoods").html(htmlArr.join(""));

                        $("a[id^='Show_']").off("click").on("click", function () {
                            var showGid = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);                          
                            $("#imgShowGoods").attr("src", "/GoodsBasic/ReadByte/" + showGid);
                                $.windowBase({
                                    id: "newWin1",
                                    title: "商品二维码",
                                    isShowBtn: false,
                                    callbackStr: "ShowImg",
                                    ele: "windowShowImg",
                                    width: 220,
                                    height: 220
                                });
                        });
                        //选购
                        $("a[id^='IsSelect_']").off("click").on("click", function () {
                            var id = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                            $.getJSON("/AgentPurchaseGoods/AddGoodsByGoodsBasic", { gbid: id }
                                , function (data) {
                                    //if (data == "1") { }
                                    initPage();
                                    $("#selectall").removeAttr("checked");
                                    $.message("选购成功", true);
                                });
                        });
                    });
        },
        getparams: function () {
            //GName, CId, PCId, IsSelect
            return { GName: GName, CId: CId, PCId: PCId, IsSelect: $ulIsSelect };
        },
        pagesize: pageSize,
        showpage: 6,
        pageParam: "page",//ajax为true时不用传递
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }
    var initPage = function () {
        $.getJSON("/AgentPurchaseGoods/GetAllCount"
           , { GName: GName, CId: CId, PCId: PCId, IsSelect: $ulIsSelect }
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
        $ulIsSelect =parseInt($("#ddlIsSelect").val());
        GName = $.trim($("#GName").val());
        CId = $("#GClass").val();
        PCId = $("#GClassP").val();
        $("#selectall").removeAttr("checked");
        if ($ulIsSelect == 1) {
            $("#liBatchSelect").html(' <span class="btn btn-primary btn-sm white" style="cursor:default;" >批量选购</span>');
        }
        else {
            $("#liBatchSelect").html(' <a class="btn btn-primary btn-sm white" id="BatchSelect">批量选购</a>');
        }
    });

    //批量选购
    $("#liBatchSelect").on("click", "#BatchSelect", function () {
        var ids = checkedGBids();
        if (ids == "") {
            $.message("请先选择所要选购的商品!", false);
        }
        else {
            $.getJSON("/AgentPurchaseGoods/AddGoodsByGoodsBasic", { gbid: ids }
                               , function (data) {
                                   //if (data == "1") { }
                                   initPage();
                                   $("#selectall").removeAttr("checked");
                                   $.message("选购成功", true);
                               });
        }
    });

    //根据一级联动二级类目
    $("#GClassP").change(function () {
        $("#GClass option").remove();
        $("#GClass").append('<option value="0">商品二级类目</option>');
        if ($(this).val() != "0") {
            $.getJSON("/AgentPurchaseGoods/GetGCList", { pid: $(this).val() }
                   , function (data) {
                       var htmlBuilder = [];
                       $(data).each(function (item) {
                           htmlBuilder.push('<option value="' + data[item].ID + '">' + data[item].CName + '</option>');
                       });
                       $("#GClass").append(htmlBuilder.join(""));
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