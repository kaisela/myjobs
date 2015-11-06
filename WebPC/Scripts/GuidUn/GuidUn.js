var pageSize = 20;
var PageIndex = 0;
var testCallbackEditWindow_update = function (data) {
    if (data.status) {
        $.message("修改成功", true);
        option.startIndex = PageIndex;
        loadDataCount();
    }
}
//查询导购
$("#search").click(function () {
    loadDataCount();
});

//加载当前数据
var option = {
    callback: function (index, params) {
        if (index != 0) {
            PageIndex = index;
        };
        var allparams = $.extend({}, params, { pageIndex: index, pageSize: pageSize });
        $.getJSON("/GuidUn/GetList", allparams, function (data) {

            //var htmlArr = [];
            //for (var i = 0; i < data.length; i++) {
            //    htmlArr.push("<li>" + data[i].RoleName + "</li>");
            //}
            //$("#testData").html(htmlArr.join(""));
            var htmlArr = [];

            $.each(data, function (i, item) {
                var itemCount = i + 1;
                var GuidTypeName;
                if (item.GuidType == 0) {
                    GuidTypeName = "超级导购";
                } else {
                    GuidTypeName = "普通导购";
                }
                htmlArr.push("<tr>")
                if (item.Status == 2) {
                    htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' name='checkbox'  id='checkbox" + item.ID + "' disabled='disabled'><label for='checkbox" + item.ID + "'></label></div></td>");
                    htmlArr.push("<td class='disableCss'>" + itemCount + "</td>");
                    htmlArr.push("<td><a href='#0' class='disableCss'>" + item.GuidName + "</a></td>");
                    htmlArr.push("<td class='disableCss'>" + GuidTypeName + "</td>");
                    htmlArr.push("<td class='disableCss'>" + item.ShopName + "</td>");
                    htmlArr.push("<td class='disableCss'>" + AgentStatus(item.Status) + "</td>");
                    htmlArr.push("<td><a class='disableCss' GuidName=" + item.GuidName + " name='AgentEdit' GuidID=" + item.ID + " ConTEl=" + item.TEl + " GuidType=" + item.GuidType + "  href='#0'>编辑</a>");
                    htmlArr.push("<a href='#0' name='AgentPauseHf' AgentId=" + item.ID + ">恢复</a>");
                    htmlArr.push("<a href='#0' name='AgentPauseDelete' AgentId=" + item.ID + ">关闭</a></td>");
                } else {
                    htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' name='checkbox' id='checkbox" + item.ID + "' value=" + item.ID + "><label for='checkbox" + item.ID + "'></label></div></td>");
                    htmlArr.push("<td>" + itemCount + "</td>");
                    htmlArr.push("<td><a href='Details?GuidId="+item.ID+"'>" + item.GuidName + "</a></td>");
                    htmlArr.push("<td>" + GuidTypeName + "</td>");
                    htmlArr.push("<td>" + item.ShopName + "</td>");
                    htmlArr.push("<td>" + AgentStatus(item.Status) + "</td>");
                    htmlArr.push("<td><a GuidName=" + item.GuidName + " name='AgentEdit' GuidID=" + item.ID + " ConTEl=" + item.TEl + " GuidType=" + item.GuidType + "  href='#0'>编辑</a>");
                    htmlArr.push("<a href='#0' name='AgentPause' AgentId=" + item.ID + ">暂停</a>");
                    htmlArr.push("<a href='#0' name='AgentPauseDelete' AgentId=" + item.ID + ">关闭</a></td>");
                };
                htmlArr.push("</tr>")
            });
            $("#tabbody").html(htmlArr.join(""));
            $("[data-allcheckbox=all]").prop("checked", false);
        });
    },
    pagesize: pageSize,
    showpage: 6,
    getparams: function () {
        return $("#conditionForm").serializeObject();
    },
    startIndex: 1,
    ajax: true//当为false时callback不用传递,，但是必须传递pageParam
};
//选中checkbox
var ChectGuid = function () {
    var CheckboxValue = "";
    var ObjCheeckbox = $("input[name=checkbox]:checked");

    for (var i = 0; i < ObjCheeckbox.length; i++) {
        CheckboxValue = CheckboxValue + ObjCheeckbox.eq(i).val() + ",";
    };
    return CheckboxValue;
}
//批量关闭代理商
$("#BatchClose").click(function () {
    if (ChectGuid() == "") {
        $.message("请选择一条数据！", false);
    } else if (confirm("你确定要批量关闭代理商吗，关闭之后将不能恢复")) {
        $.post("BatchOperation", { ID: ChectGuid(), pd: 3 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                loadDataCount();
            } else {
                $.message("操作失败！", false);
            };
        })
    }
});
//编辑导购
$("#tabbody").on("click", "[name=AgentEdit]", function () {

    var obj = {};
    obj.GuidName = encodeURIComponent($(this).attr("GuidName"));
    obj.GuidID = encodeURIComponent($(this).attr("GuidID"));
    obj.ConTEl = encodeURIComponent($(this).attr("ConTEl"));
    obj.GuidType = encodeURIComponent($(this).attr("GuidType"));

    $.windowBase({
        id: "editThis_update",
        title: "编辑导购",
        isShowBtn: false,
        callbackStr: "testCallbackEditWindow_update",
        url: "Update?ID=" + obj.GuidID + "",
        width: 800,
        height: 400
    });
});
//恢复导购
$("#tabbody").on("click", "[name=AgentPauseHf]", function () {
    if (confirm("你确定要恢复吗？")) {
        var AgentId = $(this).attr("AgentId");
        $.post("Operation", { ID: AgentId, pd: 2 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                loadDataCount();
            } else {
                $.message("操作失败，正常状态的代理才能暂停！", false);
            }
        })
    }
});
//暂停导购
$("#tabbody").on("click", "[name=AgentPause]", function () {
    if (confirm("你确定要暂停吗？")) {
        var AgentId = $(this).attr("AgentId");
        $.post("Operation", { ID: AgentId, pd: 1 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                loadDataCount();
            } else {
                $.message("操作失败，正常状态的代理才能暂停！", false);
            }
        })
    }
});
//关闭导购
$("#tabbody").on("click", "[name=AgentPauseDelete]", function () {
    if (confirm("你确定要关闭导购吗，关闭之后将不能恢复？")) {
        var AgentId = $(this).attr("AgentId");
        $.post("Operation", { ID: AgentId, pd: 3 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                loadDataCount();
            } else {
                $.message("操作失败，正常状态的代理才能暂停！", false);
            }
        })
    }
});
//加载数据总数
var loadDataCount = function () {
    $("#selectall").prop("checked", false);
    $.getJSON("/GuidUn/GetCount", $("#conditionForm").serializeObject(), function (data) {
        var totalCount = parseInt(data);
        option.startIndex = PageIndex;
        $("span.pager").Pager("init", totalCount, option);
    });
};

loadDataCount();