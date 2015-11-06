
$(function () {
    var pageSize = 20;
    var pageIndex = 0;//当前页码
    var AllIndex = 0;//总页数
    var AllSorting = new Array();
    var isSale = 0;
    if (parseInt($("#hidIsSales").val()) == 0) {
        isSale = 1;
    }
    var $gName = $("#GName");
    var $gClassP = $("#GClassP");
    var $gClass = $("#GClass");
    var $gIsNormal = $("#GIsNormal");
    var $gGroup = $("#GGroup");
    var option = {
        callback: function (index, params) {
            pageIndex = index;
            var allparams = $.extend({}, params, {IsSales: $("#hidIsSales").val(), PageIndex: index, pageSize: pageSize });
            $.getJSON('/GoodsBasic/GetList'
                    , allparams, function (data) {
                        var htmlArr = [];
                        for (var i = 0; i < data.length; i++) {
                            htmlArr.push('<tr><td>');
                            htmlArr.push('<div class="ckbox ckbox-success">');
                            htmlArr.push('<input type="checkbox" name="check" id="checkbox' + i + '" value="' + data[i].ID + '">');
                            htmlArr.push('<label for="checkbox' + i + '"></label>');
                            htmlArr.push('</div></td><td>');
                            htmlArr.push(' <img class="imgpew" src="' + getImgUrl(data[i].IMG+"_3") + '" /></td><td>');
                            //htmlArr.push('<a href="javascript:void(0)">' + data[i].GName + '</a>');
                            htmlArr.push('<span class="shopName" title="' + data[i].GName.DeXml() + '">' + data[i].GName.DeXml() + '</span>');
                            htmlArr.push('</td><td>￥' + data[i].Price + '</td>');
                            htmlArr.push('<td>' + data[i].GCount + '</td><td>' + data[i].CCount + '</td>');
                            htmlArr.push(' <td>' + data[i].PCName.DeXml() + '>' + data[i].CName.DeXml() + '</td> <td>');
                            
                            if (data[i].GroupList != null) {
                                var ggArr = new Array();
                                ggArr = data[i].GroupList.split(',');
                                $(ggArr).each(function (item) {

                                    htmlArr.push(' <span>' + ggArr[item].DeXml() + '</span><br />');
                                });
                            }
                            else {
                                    htmlArr.push(' <span>超级分组</span>');
                            }
                               
                            htmlArr.push(' </td><td>');
                            htmlArr.push((data[i].ISNormal == 1) ? '<span>有货</span>' : '<span style="color:red;">停售</span>');
                            var t = new Date(parseInt(data[i].AddTime.replace("/Date(", '').replace(")/", ''), 10));
                            htmlArr.push(' </td><td>' + t.getFullYear() + "-" + (t.getMonth()+1) + "-" + t.getDate() + '</td>');
                            //htmlArr.push(' </td><td>' + new Date(data[i].AddTime).Format("yyyy-MM-dd") + '</td>');
                            htmlArr.push('<td class="btngroup" style="text-align:center;" id="tdOp">');
                            htmlArr.push('<a href="/GoodsBasic/Operate/' + data[i].ID + '" class=""  data-au="GoodsEdit"  id="Edit_' + data[i].ID + '">编辑</a>&nbsp;');
                            htmlArr.push('<a href="javascript:void(0)" class=""  data-au="GoodsDel"  id="Del_' + data[i].ID + '">删除</a>&nbsp;');
                            htmlArr.push('<a href="javascript:void(0)" class=""  data-au="GoodsView" id="Show_' + data[i].ID + '">预览</a><br/>');
                            //var itemSort = 0;
                            //for (var j = 0; j < AllSorting.length; j++) {
                            //    if (AllSorting[j].indexOf(data[i].Sorting.trim()) > -1) {
                            //        itemSort = j;
                            //        break;
                            //    }
                            //}
                            if (index == 0) index = 1;
                            if (index <= 1 && i == 0) {
                                htmlArr.push('<span>上移</span>&nbsp;');
                            }
                            else {

                                htmlArr.push('<a href="javascript:void(0)" class="" data-next="' + AllSorting[((index - 1) * pageSize) + (i - 1)]
                                    + '"  id="Sort_Up-' + data[i].Sorting + '">上移</a>&nbsp;');
                            }
                            if ((index == AllIndex || AllIndex <= 1) && i == data.length - 1) {
                                htmlArr.push('<span>下移</span>&nbsp;');
                            }
                            else {
                                htmlArr.push('<a href="javascript:void(0)" class="" data-next="' + AllSorting[((index - 1) * pageSize) + (i + 1)]
                                    + '"  id="Sort_Down-' + data[i].Sorting + '">下移</a>&nbsp;');

                            }
                            htmlArr.push('</td></tr>');
                        };
                        $("#tbodyGoods").html(htmlArr.join(""));

                        $("a[id^='Show_']").off("click").on("click", function () {
                            var showGid = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                            $("#imgShowGoods").attr("src", "/GoodsBasic/ReadByte/"+showGid);
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
                        //单个删除
                        $("a[id^='Del_']").off("click").on("click", function () {
                            var delId = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                            if (confirm("确定要删除吗?")) {
                                $.getJSON("/GoodsBasic/UpdateStatus", { gbids: delId }
                                    , function (data) {
                                        //if (data == "1") { }
                                        initPage();
                                        $.message("删除成功", true);
                                    });
                            }
                        });

                        //上/下移
                        $("a[id^='Sort_']").each(function () {
                            $(this).on("click", function () {
                                var sort = $(this).attr("id").substr($(this).attr("id").indexOf('-') + 1);
                                var upnext = $(this).attr("data-next");
                                $.getJSON("/GoodsBasic/UpdateSorting", { sorting: sort, nextSorting: upnext }
                                        , function (data) {
                                            //if (data == "1") { }
                                            option.callback(pageIndex, option.getparams());
                                        });
                            });
                        });
                    });
        },
        getparams: function () {
            return { GName: $.trim($gName.val()),PCid:$gClassP.val(), CId: $gClass.val(), IsStatus: $gIsNormal.val(), GId: $gGroup.val() };
        },
        pagesize: pageSize,
        showpage: 6,
        pageParam: "page",//ajax为true时不用传递
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }
    var initPage = function () {
        $.getJSON("/GoodsBasic/GetAllCount"
           , { GName: $.trim($gName.val()), PCid: $gClassP.val(), CId: $gClass.val(), IsStatus: $gIsNormal.val(), GId: $gGroup.val(), IsSales: $("#hidIsSales").val() }
        , function (data) {
            var totalCount = parseInt(data[1]);
            if (totalCount <= pageSize) {
                $("span.pager").hide();
            }
                $("span.pager").Pager("init", totalCount, option);
                AllIndex = Math.ceil(totalCount / pageSize);
                AllSorting = data[2];
        });

    }
    initPage();
    //搜索
    $("#btnSearch").click(function () {
        initPage();
        $("#selectall").removeAttr("checked");
    });
    //批量移动到可视分组
    $("#moveGroup").change(function () {
        var ids = checkedGBids();
        if (ids == "") {
            $.message("请先选择所要添加分组的商品!", false);
        }
        else {
            if (confirm("确定要添加到" + $("#moveGroup option[value='" + $(this).val() + "']").text() + "吗?")) {
                $.getJSON("/GoodsBasic/UpdateGoodsGroupId", { id: $(this).val(), gbids: ids }
        , function (data) {
            //if (data == "1") { }
            option.callback(pageIndex);
            $("#selectall").removeAttr("checked");
            $.message("移动成功!", true);
        });
            }
        }
        $("#moveGroup").val("0");
    });
    //批量删除（逻辑）
    $("#batchDel").click(function () {
        var ids = checkedGBids();
        if (ids == "") {
            $.message("请先选择所要删除的商品!", false);
        }
        else {
            if (confirm("确定要删除吗?")) {
                $.getJSON("/GoodsBasic/UpdateStatus", { gbids: ids }
                    , function (data) {
                        //if (data == "1") { }
                        initPage();
                        $("#selectall").removeAttr("checked");
                        $.message("删除成功!", true);
                    });
            }
        }
    });
    //批量上/下架
    $("#aIsSale").click(function () {
        var ids = checkedGBids();
        var txt=$("#aIsSale span").html();
        if (ids == "") {
            $.message("请先选择所要" + txt + "的商品！", false);
        }
        else {
            if (confirm("确定要" + txt + "吗?")) {
                $.getJSON("/GoodsBasic/UpdateIsSale", { isSale: isSale, gbids: ids }
                    , function (data) {
                        //if (data == "1") { }
                        initPage();
                        $("#selectall").removeAttr("checked");
                        $.message(txt + "成功!", true);
                    });
            }
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

    //根据一级联动二级类目
    $("#GClassP").change(function () {
        $("#GClass option").remove();
        $("#GClass").append('<option value="0">请选择二级类目</option>');
        if ($(this).val() != "0") {
            $.getJSON("/GoodsBasic/GetGCList", { pid: $(this).val() }
                   , function (data) {
                       var htmlBuilder = [];
                       $(data).each(function (item) {
                           htmlBuilder.push('<option value="' + data[item].ID + '">'+ data[item].CName+'</option>');
                       });
                       $("#GClass").append(htmlBuilder.join(""));
                   });
        }
    });
    //$("#tbodyGoods ").on("click", "tr", function () {
    //    var $checkInput = $(this).find("input[name='check']");
    //    if ($checkInput.attr("checked")) {
    //        $checkInput.removeAttr("checked");
    //    }
    //    else {
    //        $checkInput.attr("checked",true);
    //    }

    //});
});
function ShowImg() {

}
function OpenImg() {
  
}