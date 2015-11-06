fzrgj();
pageSize = 20;
var option = {
    callback: function (index, params) {
        pageIndex = index;
        var allparams = $.extend({}, params, { PageIndex: index, pageSize: pageSize });
        $.getJSON('/Attributes/GetAList'
                , allparams, function (data) {
                    var htmlArr = [];
                    for (var i = 0; i < data.length; i++) {
                        htmlArr.push('<tr><td>');
                        htmlArr.push('<div class="ckbox ckbox-success">');
                        htmlArr.push('<input type="checkbox" name="check" id="checkbox' + i + '" value="' + data[i].ID + '">');
                        htmlArr.push('<label for="checkbox' + i + '"></label>');
                        htmlArr.push('</div></td><td>');
                        htmlArr.push('<a href="/Operate/Attributes/AttrValueIndex/' + data[i].ID + '" id="A_' + data[i].ID + '">' + data[i].AName + '</a></td><td>');
                        htmlArr.push((data[i].Status == 0) ? '<span>通过</span>' : '<span> 待审核</span>');
                        htmlArr.push(' </td><td class="table-aSpace"><span id="checkDiv_' + data[i].ID + '">');
                        htmlArr.push((data[i].Status == 0) ? '<span  style="color:#CCCCCC; padding:4px;">审核</span  >' : '<a href="javascript:void(0)" id="check_' + data[i].ID + '">审核</a>');
                        htmlArr.push('</span>&nbsp;<a href="javascript:void(0)" vn="' + data[i].AName + '" id="Edit_' + data[i].ID + '">修改</a>&nbsp;');
                        htmlArr.push('</td></tr>');
                    };
                    $("#tbodyAttr").html(htmlArr.join(""));
                    $("#combineAttr").attr("gcid", data[0].GoodsClassID);
                    //审核
                    $("a[id^='check_']").off("click").on("click", function () {
                        var checkId = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                        $.getJSON("/Attributes/CheckAttr", { id: checkId }
                            , function (data) {
                                $.message("审核成功", true);
                                $("#checkDiv_" + checkId).html('<span style="color:#CCCCCC; padding:4px;">审核</span  >');
                                $("#checkDiv_" + checkId).parent("td").prev("td").html("<span>通过</span>")
                            });
                    });
                    //编辑
                    $("a[id^='Edit_']").off("click").on("click", function () {
                        var checkId = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                        $("#textAName").val($(this).attr("vn"));
                        $("#textAName").attr("aid",checkId);
                        $.windowBase({
                            id: "window2",
                            title: "编辑属性名",
                            isShowBtn: false,
                            callbackStr: "EditCallback",
                            ele: "windowShowEdit",
                            width: 600,
                            height: 200
                        });
                        //$("#txtAName").blur(function () {
                        //    $(this).O2OtipsHide({ eleid: "txtAName" });
                        //});                         
                    });
                });
    },
    getparams: function () {
        var gclass = $("#GClass").val();
        var astatus = $("#AStatus").val();
        if (gclass == "")
            gclass = 0;
        if (astatus == "")
            astatus == -1;
        return { aName: $.trim($("#txtAName").val()), gcid: gclass, status: astatus };
    },
    pagesize: pageSize,
    showpage: 6,
    pageParam: "page",//ajax为true时不用传递
    ajax: true//当为false时callback不用传递,，但是必须传递pageParam
};
var initPage = function () {
    var gclass = $("#GClass").val();
    var astatus = $("#AStatus").val();
    if (gclass == "")
        gclass = 0;
    if (astatus == "")
        astatus == -1;
    $.getJSON("/Attributes/GetAllCount", { aName: $.trim($("#txtAName").val()), gcid: gclass, status: astatus }
    , function (data) {
        var totalCount = parseInt(data);
        if (totalCount <= pageSize) {
            $("span.pager").hide();
        }
        $("span.pager").Pager("init", totalCount, option);
    });
};
initPage();
$("#btnSaveE").click(function () {
    if ($.trim($("#textAName").val()) == "") {
        $.message("属性名称不能为空！", false);
    }
    else {
        var checkId = $("#textAName").attr("aid");
        $.getJSON('/Attributes/Update', { id: checkId, aname: $("#textAName").val() }, function (data) {
            $.message("修改成功", true);
            $.closeWindow({ status: true, winId: "window2" });
            $("#A_" + checkId).html($("#textAName").val());
            $("#Edit_" + checkId).attr("vn", $("#textAName").val());
        });
    }
});
$("#btnCancelE").click(function () {
    $.closeWindow({ status: false });
});
//搜索
$("#btnSearch").click(function () {
    initPage();
});
//合并属性
var vids=""
$("#combineAttr").click(function () {
    vids = checkedGBids();
    if (vids != "") {
        if (vids.indexOf(",") < 0) { $.message("请选择至少2项需要合并的属性名", false); }
        else {
            var gcids = $("#combineAttr").attr("gcid");
            $.windowBase({
                id: "window1",
                title: "合并属性名",
                isShowBtn: false,
                callbackStr: "CombineCallback",
                ele: "windowShowCombine",
                width: 600,
                height: 200
            });
            $.getJSON('/Attributes/GetAttrByIds', { ids: vids, gcid: gcids }, function (data) {
                var htmlArr = [];
                for (var i = 0; i < data.length; i++) {
                    htmlArr.push('<label><input type="radio" name="radios" id="' + data[i].ID + '"> ' + data[i].AName + '</label>');
                };
                $("#divCombine").html(htmlArr.join(""));
            });
           
        }
    }
    else
        $.message("请先选择需要合并的属性名", false);
});
$("#btnSaveC").click(function () {
    var $con = $("#divCombine").find("input[name = radios]:checked");
    if ($con.length > 0) {
        $.getJSON('/Attributes/CombineAttr', { id: $con.attr("id"), ids: vids, gcid: gcids }, function (data) {
            $.message("合并成功", true);
            $.closeWindow({ status: true, winId: "window1" });
        });
    }
    else {
        $.message("请先选择需要合并到的属性名", false);
    }
});
$("#btnCancelC").click(function () {
    $.closeWindow({ status: false });
});
var EditCallback = function (data) {
    if (data.status === true) {

    }
};
var CombineCallback = function (data) {
    if (data.status === true) {
        initPage();
    }
};
//获取选中的商品id集合
var checkedGBids = function () {
    var ids = "";
    $("#tbodyAttr").find("input[name = check]:checked").each(function () {
        ids = ids + $(this).attr("value") + ",";
    });
    if (ids != "") ids = ids.substr(0, ids.length - 1);
    return ids;
};
//合并属性回调
function CombineAttr() {

}