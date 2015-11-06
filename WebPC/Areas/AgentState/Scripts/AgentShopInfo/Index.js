var pageSize = 20;
var PageIndex = 0;
function testCallbackEditWindow_Update(data) {
    if (data.status) {
        $.message("修改成功！", true);
        option.startIndex = PageIndex;
        loadDataCount();
    };
};

function Agent_ShopInfo_Create(data) {
    if (data.status) {
        $.message("新增成功", true);
        loadDataCount();
    };
};

$("#search").click(function () {
    loadDataCount();
});
var option = {
    callback: function (index, params) {
        if (index != 0) {
            PageIndex = index;
        }
        var allparams = $.extend({}, params, { page: index, pageSize: pageSize, AgentID: $("#agentId").val() });
        $.getJSON("/AgentState/AgentShopInfo/GetList", allparams, function (data) {

            //var htmlArr = [];
            //for (var i = 0; i < data.length; i++) {
            //    htmlArr.push("<li>" + data[i].RoleName + "</li>");
            //}
            //$("#testData").html(htmlArr.join(""));
            var htmlArr = [];
            debugger;
            $.each(data, function (i, item) {
                var Address = item.ProvinceN + " " + item.CityN + " " + item.CountyN;
                var groupName = item.GroupName == null ? "" : item.GroupName;
                var MPName = item.MPName == null ? "" : item.MPName;
                if (item.Status == 5 || item.Status == 4) {
                    htmlArr.push("<tr>");
                    htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' name='checkbox' id='checkbox" + item.ID + "' disabled='disabled'> <label for='checkbox" + item.ID + "'></label></div></td>");
                    htmlArr.push("<td><a href='javascript:void(0)'  class='disableCss' data-div='.contentpanel' data-title='门店详情'>" + item.ShopName + "</a></td>");
                    htmlArr.push("<td class='disableCss'>" + Address + "</td>");
                    htmlArr.push("<td  class='disableCss'>" + item.GuidCount + "</td>");
                    htmlArr.push("<td  class='disableCss'>" + item.Contact + "</td>");
                    htmlArr.push("<td  class='disableCss'>" + statusStr2(item.Status) + "</td>");
                    htmlArr.push("<td>");
                    htmlArr.push("<a  class='disableCss'>编辑</a>");
                    htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='Recovery' href='#0' >恢复</a>");
                    htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='close'  href='#0' >关闭</a>");
                    htmlArr.push("</td>");
                    htmlArr.push("</tr>");
                } else {
                    htmlArr.push("<tr>");
                    htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' name='checkbox' id='checkbox" + item.ID + "' value=" + item.ID + "> <label for='checkbox" + item.ID + "'></label></div></td>");
                    //htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' name='checkbox' id='checkbox" + item.ID + "' value='" + item.ID + "'> <label for='checkbox" + item.ID + "'></label></div></td>");
                    htmlArr.push("<td>  <a href='/AgentState/AgentShopInfo/Details?ShopId=" + item.ID + "' class='HrefFrame' data-div='.contentpanel' data-title='门店详情'>" + item.ShopName + "</a></td>");
                    htmlArr.push("<td>" + Address + "</td>");
                    htmlArr.push("<td><a>" + item.GuidCount + "</a></td>");
                    htmlArr.push("<td>" + item.Contact + "</td>");
                    htmlArr.push("<td>" + statusStr2(item.Status) + "</td>");
                    htmlArr.push("<td>");
                    htmlArr.push("<a data-shopname='" + item.ShopName + "' data-p=" + item.ProvinceID + " data-c=" + item.CityID + " data-a=" + item.CountyID + "");
                    htmlArr.push(" data-contact='" + item.Contact + "' data-channelgroupid='" + item.ChannelGroupID + "' data-shopId=" + item.ID + "");
                    htmlArr.push(" data-agentName='" + item.AgentName + "'");
                    htmlArr.push(" data-toggle='modal' data-target='.bs-example-modal-lg' name='editShop' data-title='编辑直营店'>编辑</a>");
                    htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='pause' href='#0' >暂停</a>");
                    htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='close' href='#0' >关闭</a>");
                    htmlArr.push("</td>");
                    htmlArr.push("</tr>");
                }

            });
            $("#tbody").html(htmlArr.join(""));
            $("[data-allcheckbox=all]").prop("checked", false);
        });
    },
    pagesize: pageSize,
    showpage: 6,
    getparams: function () {
        return $("#conditionForm").serializeObject();
    },
    startIndex: PageIndex,
    ajax: true//当为false时callback不用传递,，但是必须传递pageParam
};
var loadDataCount = function () {
    $("#selectall").prop("checked", false);
    $.getJSON("/AgentState/AgentShopInfo/GetListCount", $("#conditionForm").serializeObject(), function (data) {
        var totalCount = parseInt(data);
        option.startIndex = PageIndex;
        $("span.pager").Pager("init", totalCount, option);
    });
};
//暂停门店
$("#tbody").on("click", "[name=pause]", function () {
    if (confirm("你确定要暂停门店吗？")) {
        $.post("/AgentState/AgentShopInfo/Edit", { shopId: $(this).attr("data-id"), Pd: 1 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                loadDataCount();
            } else {
                $.message("操作失败,代理商门店为正常状态才能暂停！", false);
            }
        })
    }
});
//恢复直营店方法
$("#tbody").on("click", "[name=Recovery]", function () {

    if (confirm("你确定要恢复代理商门店吗？")) {
        $.post("/AgentState/AgentShopInfo/Edit", { shopId: $(this).attr("data-id"), Pd: 3 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                loadDataCount();
            } else {
                $.message("操作失败！", false);
            }
        })
    }
});
//获取选中checkbox的值
var shopIdListString = function () {
    var shopIdList = "";
    var obj = $("input[name=checkbox]:checked");

    for (var i = 0; i < obj.length ; i++) {
        shopIdList = shopIdList + obj.eq(i).val() + ",";
    };
    return shopIdList;
};
//关闭直营店方法
$("#tbody").on("click", "[name=close]", function () {
    if (confirm("你确定要关闭代理商门店吗,关闭之后将不能恢复？")) {
        $.post("/AgentState/AgentShopInfo/Delete", { shopId: $(this).attr("data-id") }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                loadDataCount();
            } else {
                $.message("操作失败！", false);
            }
        })
    }
});
//编辑代理商门店方法
$("#tbody").on("click", "[name=editShop]", function () {
    var obj = {};
    obj.shopname = $(this).attr("data-shopname");
    obj.p = $(this).attr("data-p");
    obj.c = $(this).attr("data-c");
    obj.a = $(this).attr("data-a");
    obj.contact = $(this).attr("data-contact");
    obj.shopId = $(this).attr("data-shopId");
    $.windowBase({
        id: "editThis",
        title: "编辑代理商门店",
        isShowBtn: false,
        callbackStr: "testCallbackEditWindow_Update",
        url: "/AgentState/AgentShopInfo/Update?ID=" + obj.shopId + "",
        width: 800,
        height: 500
    });
});
//批量关闭直营店
$("#BatchClose").click(function () {
    var shopIdList = shopIdListString();
    if (shopIdList == "") {
        $.message("请选择要关闭的代理商门店！", false);
    } else {
        if (confirm("确定要批量关闭门店吗,关闭之后将不能恢复？")) {
            $.post("/AgentState/AgentShopInfo/PauseDelete", { shopIdList: shopIdList }, function (result) {
                if (result > 0) {
                    $.message("操作成功！", true);
                    loadDataCount();
                } else {
                    $.message("操作失败！", false);
                }
            })
        }

    }
});
loadDataCount();