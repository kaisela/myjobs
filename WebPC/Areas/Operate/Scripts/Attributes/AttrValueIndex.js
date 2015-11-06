fzrgj();
pageSize = 20;
var $aid = $("#hidAid").val();
var option = {
    callback: function (index, params) {
        pageIndex = index;
        var allparams = $.extend({}, params, { PageIndex: index, pageSize: pageSize });
        $.getJSON('/Attributes/GetAVList'
                , allparams, function (data) {
                    var htmlArr = [];
                    for (var i = 0; i < data.length; i++) {
                        htmlArr.push('<tr><td>');
                        htmlArr.push('<div class="ckbox ckbox-success">');
                        htmlArr.push('<input type="checkbox" name="check" id="checkbox' + i + '" value="' + data[i].ID + '">');
                        htmlArr.push('<label for="checkbox' + i + '"></label>');
                        htmlArr.push('</div></td><td>');
                        htmlArr.push('<span id="span_' + data[i].ID + '">' + data[i].VName + '</span></td><td>');
                        htmlArr.push('<a href="javascript:void(0)" vn="' + data[i].VName + '" id="Edit_' + data[i].ID + '">修改</a>');
                        htmlArr.push('</td></tr>');
                    };
                    $("#tbodyAV").html(htmlArr.join(""));

                    //编辑
                    $("a[id^='Edit_']").off("click").on("click", function () {
                        var checkId = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                        $("#textVName").val($(this).attr("vn"));
                        $("#textVName").attr("vid", checkId);
                        $.windowBase({
                            id: "window2",
                            title: "编辑属性名",
                            isShowBtn: false,
                            callbackStr: "EditCallback",
                            ele: "windowShowEdit",
                            width: 600,
                            height: 200
                        });                       
                    });
                });
    },
    getparams: function () {
        return { aid: $aid };
    },
    pagesize: pageSize,
    showpage: 6,
    pageParam: "page",//ajax为true时不用传递
    ajax: true//当为false时callback不用传递,，但是必须传递pageParam
};
var initPage = function () {
    $.getJSON("/Attributes/GetAVAllCount", { aid: $aid }
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
    if ($.trim($("#textVName").val()) == "") {
        $.message("属性名称不能为空！", false);
    }
    else {
        var checkId = $("#textVName").attr("vid");
        $.getJSON('/Attributes/UpdateAV', { id: checkId, vname: $("#textVName").val() }, function (data) {
            $.message("修改成功", true);
            $.closeWindow({ status: true, winId: "window2" });
            $("#span_" + checkId).html($("#textVName").val());
            $("#Edit_" + checkId).attr("vn", $("#textVName").val());
        });
    }
});
$("#btnCancelE").click(function () {
    $.closeWindow({ status: false });
});
//合并属性值
var vids = "";
$("#combineAv").click(function () {
   vids = checkedGBids();
    if (vids != "") {
        if (vids.indexOf(",") < 0) { $.message("请选择至少2项需要合并的属性值", false); }
        else {
            $.windowBase({
                id: "window1",
                title: "合并属性名",
                isShowBtn: false,
                callbackStr: "CombineCallback",
                ele: "windowShowCombine",
                width: 600,
                height: 200
            });
            $.getJSON('/Attributes/GetAVByIds', { ids: vids, aid: $aid }, function (data) {
                var htmlArr = [];
                for (var i = 0; i < data.length; i++) {
                    htmlArr.push('<label><input type="radio" name="radios" id="' + data[i].ID + '"> ' + data[i].VName + '</label>');
                };
                $("#divCombine").html(htmlArr.join(""));
            });
           
        }
    }
    else
        $.message("请先选择需要合并的属性值", false);
});
$("#btnSaveC").click(function () {
    var $con = $("#divCombine").find("input[name = radios]:checked");
    if ($con.length>0) {
        $.getJSON('/Attributes/CombineAV', { id: $con.attr("id"), ids: vids, aid: $aid }, function (data) {
            $.message("合并成功", true);
            $.closeWindow({ status: true, winId: "window1" });
        });
    }
    else {
        $.message("请先选择需要合并到的属性值", false);
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
    $("#tbodyAV").find("input[name = check]:checked").each(function () {
        ids = ids + $(this).attr("value") + ",";
    });
    if (ids != "") ids = ids.substr(0, ids.length - 1);
    return ids;
};
//合并属性回调
function CombineAttr() {

}