var PageIndex = 0;
var pageSize = 20;
//var testCallback = function (data) {
//    $.alert(data.Message, "success");
//    $("#resetAdd").trigger("click");
//    $("#EditClose").next("[type=button]").trigger("click");
//    loadDataCount();
//};
var testCallbackEdit = function (data) {
    if (data.status) {
        $.message("修改成功", true);
        option.startIndex = PageIndex;
        loadDataCount();
    }
};

var testCallback_Agent_Create = function (data) {
    if (data.status) {
        $.message("新增成功", true);
        option.startIndex = PageIndex;
        loadDataCount();
    }
}
var option = {
    callback: function(index, params) {
        if (index != 0) {
            PageIndex = index;
        }
        var allparams = $.extend({}, params, { page: index, pageSize: pageSize });
        $.getJSON("/Agent/GetList", allparams, function(data) {

            //var htmlArr = [];
            //for (var i = 0; i < data.length; i++) {
            //    htmlArr.push("<li>" + data[i].RoleName + "</li>");
            //}
            //$("#testData").html(htmlArr.join(""));
            var htmlArr = [];
            $.each(data, function(i, item) {
                var Address = item.ProvinceN + " " + item.CityN + " " + item.CountyN;
                var groupName = item.GroupName == null ? "超级分组" : item.GroupName;
                var MPName = item.MPName == null ? "" : item.MPName;
                if (item.Status == 2) {
                    htmlArr.push("<tr>");
                    htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' id='checkbox" + item.ID + "' disabled='disabled'> <label for='checkbox" + item.ID + "'></label></div></td>");
                    htmlArr.push("<td>  <a href='javascript:void(0)' class='disableCss' data-div='.contentpanel' data-title='门店详情'>" + item.AgentName + "</a></td>");

                    htmlArr.push("<td><a class='disableCss'>" + Address + "</a></td>");
                    htmlArr.push("<td><a class='disableCss'>" + item.Shopcount + "</a></td>");
                    htmlArr.push("<td class='disableCss'>" + groupName + "</td>");
                    htmlArr.push("<td class='disableCss'>" + item.Contact + "</td>");
                    htmlArr.push("<td class='disableCss'>" + statusStr(item.Status) + "</td>");
                    htmlArr.push("<td class='btngroup'>");
                    htmlArr.push("<a  class='disableCss' data-toggle='modal' data-target='.bs-example-modal-lg' data-au='ChnEdit' data-title='编辑直营店'>编辑</a>");
                    htmlArr.push("&nbsp;<a href='#0' data-id='" + item.ID + "' data-au='ChnClose' name='Recovery'>恢复</a>");
                    htmlArr.push("&nbsp;<a href='#0' data-id='" + item.ID + "' name='close' data-au='ChnDel'>关闭</a>");
                    htmlArr.push("</td>");
                    htmlArr.push("</tr>");
                } else {
                    htmlArr.push("<tr>");
                    htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' name='checkbox' id='checkbox" + item.ID + "' value='" + item.ID + "'> <label for='checkbox" + item.ID + "'></label></div></td>");
                    htmlArr.push("<td>  <a href='Details?AgentId=" + item.ID + "' class='HrefFrame' data-div='.contentpanel' data-title='门店详情'>" + item.AgentName + "</a></td>");

                    htmlArr.push("<td>" + Address + "</td>");
                    if (item.Shopcount > 0) {
                        htmlArr.push("<td><a href='/ShopInfo/Agent_Index?ID="+item.ID+"'>" + item.Shopcount + "</a></td>");
                    } else {
                        htmlArr.push("<td><a class='disableCss'>" + item.Shopcount + "</a></td>");
                    }        
                    htmlArr.push("<td>" + groupName + "</td>");
                    htmlArr.push("<td>" + item.Contact + "</td>");
                    htmlArr.push("<td>" + statusStr(item.Status) + "</td>");
                    htmlArr.push("<td class='btngroup'>");
                    htmlArr.push("<a");
                    htmlArr.push(" data-agentname='" + item.AgentName + "' data-p=" + item.ProvinceId + " data-c=" + item.CityId + " data-a=" + item.County + "");
                    htmlArr.push(" data-contact='" + item.Contact + "' data-channelgroupid='" + item.ChannelGroupID + "' data-agentId=" + item.ID + " data-Remarks='" + item.Remarks + "'");
                    htmlArr.push(" data-toggle='modal' data-target='.bs-example-modal-lg' name='editAgent' data-au='ChnEdit' data-title='编辑直营店'>编辑</a>");
                    htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='pause' data-au='ChnClose' href='#0' >暂停</a>");
                    htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='close' data-au='ChnDel' href='#0' >关闭</a>");
                    htmlArr.push("</td>");
                    htmlArr.push("</tr>");
                }

            })
            $("#tbodyAgent").html(htmlArr.join(""));
            $("[data-allcheckbox=all]").prop("checked", false);
        });
    },
    pagesize: pageSize,
    showpage: 6,
    getparams: function () {
        return $("#conditionForm").serializeObject();
    },
    pageParam: "page",//ajax为true时不用传递
    ajax: true
}
var loadDataCount = function () {
    $("#selectall").prop("checked",false);
    $.getJSON("/Agent/GetCount", $("#conditionForm").serializeObject(), function (data) {
        var totalCount = parseInt(data);
        option.startIndex = PageIndex;
        $("span.pager").Pager("init", totalCount, option);
    });
}
var initPage = function () {
    $("#tbodyAgent").on("click", "[name=pause]", function () {
        if (confirm("你确定要暂停代理商吗？")) {
            $.post("/Agent/Pause", { pd: 2, shopId: $(this).attr("data-id") }, function (result) {
                if (result > 0) {
                    $.message("操作成功", true);
                    loadDataCount();
                } else {
                    $.message("操作失败,代理商为正常状态才能暂停！", false);
                };
            });
        }
    });
    $("#tbodyAgent").on("click", "[name=Recovery]", function () {
        if (confirm("你确定要恢复代理商吗？")) {
            $.getJSON("/Agent/Pause", { pd: 3, shopId: $(this).attr("data-id") }, function (result) {
                if (result > 0) {
                    $.message("操作成功", true);
                    loadDataCount();
                } else {
                    $.message("操作失败,代理商为正常状态才能暂停！", false);
                };
            });
        }
    });
    $("#tbodyAgent").on("click", "[name=close]", function () {
        if (confirm("你确定要关闭代理商吗？")) {
            $.post("/Agent/Delete", { pd: 1, shopId: $(this).attr("data-id") }, function (result) {
                if (result > 0) {
                    $.message("操作成功", true);
                    loadDataCount();
                } else {
                    $.message("操作失败！", false);
                };
            });
        }
    });
    $("#tbodyAgent").on("click", "[name=editAgent]", function () {
        //$("#Enterprise_Update #AgentName").val($(this).attr("data-agentname"));
        //if ($(this).attr("data-channelgroupid") == 0) {
        //    $("#Enterprise_Update #ChannelGroupID").find("option").eq(0).attr("selected","selected")
        //} else {
        //    $("#Enterprise_Update #ChannelGroupID").val($(this).attr("data-channelgroupid"));
        //}
        //alert($(this).attr("data-c"));
        //$("#Enterprise_Update #ID").val($(this).attr("data-agentId"));
        //$("#Enterprise_Update [name=Province]").val($(this).attr("data-p"));
        //$("#Enterprise_Update [name=Province]").trigger("change");
        //$("#Enterprise_Update [name=City]").val($(this).attr("data-c"));
        //$("#Enterprise_Update [name=City]").trigger("change");
        //$("#Enterprise_Update [name=County]").val($(this).attr("data-a"));
        //$("#Enterprise_Update #Contact").val($(this).attr("data-contact"));
        //$("#Enterprise_Update #Remarks").val($(this).attr("data-Remarks"));
        
        $.windowBase({
            id: "editThis",
            title: "编辑代理商",
            isShowBtn: false,
            callbackStr: "testCallbackEdit",
            url: "/Agent/Edit?AgentName=" + $(this).attr("data-agentname") + "&ProvinceId=" + $(this).attr("data-p") + "&CityId=" + $(this).attr("data-c") + "&County=" + $(this).attr("data-a") + "&Contact=" + $(this).attr("data-contact") + "&ChannelGroupID=" + $(this).attr("data-channelgroupid") + "&ID=" + $(this).attr("data-agentId") + "&Remarks=" + $(this).attr("data-remarks") + "",
            width: 800,
            height: 500
        });
    })
    //新增直营店
    $("#CreateShopInfo").click(function () {
        $('#Enterprise_Create').modal({
            keyboard: true
        });
    });
    $("#search").click(function () {
        loadDataCount();
    });
};
//获取选中checkbox的值
var AgenIdListString = function () {
    var AgenIdList = "";
    var obj = $("[name=checkbox]:checked");

    for (var i = 0; i < obj.length ; i++) {
        AgenIdList = AgenIdList + obj.eq(i).val() + ",";
    };
    return AgenIdList;
};

//移动到渠道分组
$("#ChannelPush").change(function () {
    $this = $(this);
    if ($(this).val() != "") {
        var AgenIdList = AgenIdListString();
        if (AgenIdList == "") {
            $.message("请选择要移动的代理商！", false);
            $(this).find("option").eq(0).attr("selected", "selected");
        } else {
            if (confirm("确定要移动到" + $("#ChannelPush option:selected").text())) {
                $.post("/Agent/MobileChannel", { ChannelGroupID: $("#ChannelPush").val(), AgenId: AgenIdList }, function (result) {
                    if (result > 0) {
                        $.message("修改成功！", true);
                        $this.find("option").eq(0).attr("selected", "selected");
                        loadDataCount();
                    } else {
                        $.message("修改失败！", false);
                    }
                });
            };
        };
    };
});
//批量关闭直营店
$("#BatchClose").click(function () {
    var AgenIdList = AgenIdListString();
    if (AgenIdList == "") {
        $.message("请选择要关闭的代理商！", false);

    } else {
        if (confirm("确定要批量关闭代理商吗？")) {
            $.post("/Agent/DeleteList", { AgenId: AgenIdList }, function (result) {
                if (result > 0) {
                    $.message("操作成功！", true);
                    loadDataCount();
                } else {
                    $.message("操作失败！", true);
                }
            })
        }

    }
});
var JsonParameters = function (index, pageSize) {
    return { agentName: $("#agentNameSreach").val(), pId: $("[name=ProvinceSreach]").val(), cId: $("[name=CitySreach]").val(), aId: $("[name=AreasIDSreach]").val(), channelGroupID: $("#ChannelID").val(), status: $("#Status").val(), page: index, pageSize: pageSize }
}
var JsonParametersCount = function () {
    return { agentName: $("#agentNameSreach").val(), pId: $("[name=ProvinceSreach]").val(), cId: $("[name=CitySreach]").val(), aId: $("[name=AreasIDSreach]").val(), channelGroupID: $("#ChannelID").val(), status: $("#Status").val() }
}

loadDataCount();
initPage();