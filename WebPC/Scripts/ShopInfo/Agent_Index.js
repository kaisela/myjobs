//切换已审核门店
//负责人：xhr
$("#AgentPan1").click(function () {
    $("#statusXs").val(1);
    $("#Status option").remove();
    $("#Status").append("<option value='-1'>请选择状态</option>");
    $("#Status").append("<option value='0'>正常</option>");
    $("#Status").append("<option value='2'>待分配</option>");
    $("#Status").append("<option value='5'>暂停</option>");
    $("#conditionForm").O2OReset();
    option.startIndex = PageIndex;
    loadDataCount();
})
//切换未审核门店
//负责人：xhr
$("#AgentPan2").click(function () {
    $("#statusXs").val(2);
    $("#Status option").remove();
    $("#Status").append("<option value='-1'>请选择状态</option>");
    $("#Status").append("<option value='1'>待审核</option>");
    $("#Status").append("<option value='4'>审核不通过</option>");
    $("#conditionForm").O2OReset();
    option.startIndex = PageIndex;
    loadDataCount();
})

//保存当前页码变量
var PageIndex = 0;

//编辑页面
var testCallbackEditWindow = function (data) {
    if (data.status) {
        $.message("修改成功！", true);
        option.startIndex = PageIndex;
        loadDataCount();
    }
};
//页数
var pageSize = 20;
//根据页码加载数据
var option = {
    callback: function (index,params) {
        if (index != 0) {
            PageIndex = index;
        }
        var allparams = $.extend({}, params, { page: index, pageSize: pageSize, AgentID: $("#agentId").val() });
        $.getJSON("/ShopInfo/AgentGetList", allparams, function (data) {

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
                    htmlArr.push("<td>  <a href='javascript:void(0)'  class='disableCss' data-div='.contentpanel' data-title='门店详情'>" + item.ShopName + "</a></td>");
                    htmlArr.push("<td class='disableCss'>" + item.AgentName + "</td>");
                    htmlArr.push("<td class='disableCss'>" + Address + "</td>");
                    if ($("#statusXs").val() == 2) {
                        htmlArr.push("<td><a class='disableCss'>" + item.Contact + "</a></td>");

                    } else {
                        htmlArr.push("<td><a class='disableCss'>" + item.GuidCount + "</a></td>");
                        htmlArr.push("<td class='disableCss'>" + MPName + "</td>");
                    }
                    
                    htmlArr.push("<td class='disableCss'>" + statusStr2(item.Status) + "</td>");
                    htmlArr.push("<td class='btngroup'>");
                    if ($("#statusXs").val() == 2) {
                        htmlArr.push("<a  class='disableCss'");
                        htmlArr.push(" data-toggle='modal' data-target='.bs-example-modal-lg' name='pauseSh' data-au='ChnEdit' data-title='审核'>审核</a>&nbsp;");
                        htmlArr.push("<a");
                    } else {
                        htmlArr.push("<a  class='disableCss'");
                    }
                  
                    htmlArr.push(" data-shopname='" + item.ShopName + "' data-p=" + item.ProvinceID + " data-c=" + item.CityID + " data-a=" + item.CountyID + "");
                    htmlArr.push(" data-contact='" + item.Contact + "' data-channelgroupid='" + item.ChannelGroupID + "' data-shopId=" + item.ID + "");
                    htmlArr.push(" data-agentName='" + item.AgentName + "'");
                    htmlArr.push(" data-toggle='modal' data-target='.bs-example-modal-lg' name='editShop' data-au='ChnEdit' data-title='编辑直营店'>编辑</a>");
                    if ($("#statusXs").val() == 1) {
                        htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='Recovery' data-au='ChnClose' href='#0' >恢复</a>");
                    };
                    htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='close' data-au='ChnDel' href='#0' >关闭</a>");
                    htmlArr.push("</td>");
                    htmlArr.push("</tr>");
                } else{
                    htmlArr.push("<tr>");
                    htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' name='checkbox' id='checkbox" + item.ID + "' value=" + item.ID + "> <label for='checkbox" + item.ID + "'></label></div></td>");
                    //htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' name='checkbox' id='checkbox" + item.ID + "' value='" + item.ID + "'> <label for='checkbox" + item.ID + "'></label></div></td>");
                    htmlArr.push("<td>  <a href='Details?ShopId=" + item.ID + "' class='HrefFrame' data-div='.contentpanel' data-title='门店详情'>" + item.ShopName + "</a></td>");
                    htmlArr.push("<td>" + item.AgentName + "</td>");
                    htmlArr.push("<td>" + Address + "</td>");
                    if ($("#statusXs").val() == 2) {
                        htmlArr.push("<td><a>" + item.Contact + "</a></td>");
                      
                       
                    } else {
                        htmlArr.push("<td><a>" + item.GuidCount + "</a></td>");
                        htmlArr.push("<td>" + MPName + "</td>");
                    }

                    htmlArr.push("<td>" + statusStr2(item.Status) + "</td>");
                    htmlArr.push("<td class='btngroup'>");
                    if ($("#statusXs").val() == 2) {
                        htmlArr.push("<a");
                        htmlArr.push(" data-shopname='" + item.ShopName + "' data-pN=" + item.ProvinceN + " data-cN=" + item.CityN + " data-aN=" + item.CountyN + "");
                        htmlArr.push(" data-contact='" + item.Contact + "' data-GroupName='" + item.GroupName + "' data-shopId=" + item.ID + "");
                        htmlArr.push(" data-agentName='" + item.AgentName + "' data-contactPhone='" + item.ContactPhone + "'");
                        htmlArr.push(" data-toggle='modal' data-target='.bs-example-modal-lg' name='pauseSh' data-au='ChnEdit' data-title='审核'>审核</a>&nbsp;");
                    };
                    htmlArr.push("<a");
                    htmlArr.push(" data-shopname='" + item.ShopName + "' data-p=" + item.ProvinceID + " data-c=" + item.CityID + " data-a=" + item.CountyID + "");
                    htmlArr.push(" data-contact='" + item.Contact + "' data-channelgroupid='" + item.ChannelGroupID + "' data-shopId=" + item.ID + "");
                    htmlArr.push(" data-agentName='" + item.AgentName + "'");
                    htmlArr.push(" data-toggle='modal' data-target='.bs-example-modal-lg' name='editShop' data-au='ChnEdit' data-title='编辑直营店'>编辑</a>");
                    if ($("#statusXs").val() == 1) {
                        htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='pause' data-au='ChnClose' href='#0' >暂停</a>");
                    };
                    htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='close' data-au='ChnDel' href='#0' >关闭</a>");
                    htmlArr.push("</td>");
                    htmlArr.push("</tr>");
                }

            });
            if ($("#statusXs").val() == 1) {
                $("#tbodyAgentPanel1").html(htmlArr.join(""));
                $("#tbodyAgentPanel2 tr").empty();
            }
            else {
                $("#tbodyAgentPanel2").html(htmlArr.join(""));
                $("#tbodyAgentPanel1 tr").empty();
            }
           

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
}
//加载当前数据总数
var loadDataCount = function () {
    var allparams = $.extend({}, $("#conditionForm").serializeObject(), { AgentID: $("#agentId").val() });
    $("#selectall").prop("checked", false);
    $.getJSON("/ShopInfo/AgentGetListCount", allparams, function (data) {
        var totalCount = parseInt(data);
        option.startIndex = PageIndex;
        $("span.pager").Pager("init", totalCount, option);
    });
};
//获取选中checkbox的值
var shopIdListString = function () {
    var shopIdList = "";
    var obj = $("[name=checkbox]:checked");

    for (var i = 0; i < obj.length ; i++) {
        shopIdList = shopIdList + obj.eq(i).val() + ",";
    };
    return shopIdList;
};
//移动到渠道分组
$("#ChannelPush").change(function () {
    if ($(this).val() != "") {
        var shopIdList = shopIdListString();
        if (shopIdList == "") {
            $.message("请选择要移动的代理商门店！", false);
            $(this).find("option").eq(0).attr("selected", "selected");
        } else {
            if (confirm("确定要移动到" + $("#ChannelPush option:selected").text())) {
                $.post("/ShopInfo/MobileShop", { ChannelId: $("#ChannelPush").val(), shopIdList: shopIdList }, function (result) {
                    if (result > 0) {
                        $.message("修改成功！", true);
                        $(this).find("option").eq(0).attr("selected", "selected");
                        loadDataCount();
                    } else {
                        $.message("修改失败！", false);
                    }
                });
            };
        };
    };
});

//新增直营店
$("#CreateShopInfo").click(function () {
    $('#Enterprise_Create').modal({
        keyboard: true
    });
});



var initPage = function () {
    //关闭直营店方法
    $(".tab-content").on("click", "[name=close]", function () {
        if (confirm("你确定要关闭代理商门店吗？")) {
            $.post("/ShopInfo/Delete", { shopId: $(this).attr("data-id") }, function (result) {
                if (result > 0) {
                    $.message("操作成功！", true);
                    loadDataCount();
                } else {
                    $.message("操作失败！", false);
                }
            })
        }
    });
    //暂停直营店方法
    $(".tab-content").on("click", "[name=pause]", function () {
        if (confirm("你确定要暂停代理商门店吗？")) {
            $.post("/ShopInfo/Edit", { shopId: $(this).attr("data-id"), Pd: 1 }, function (result) {
                if (result > 0) {
                    $.message("操作成功！", true);
                    loadDataCount();
                } else {
                    $.message("操作失败,代理商门店为正常状态才能暂停！", false);
                }
            })
        }
    });
    //审核直营店弹出框方法
    $(".tab-content").on("click", "[name=pauseSh]", function () {
        var obj = {};
        obj.pN = $(this).attr("data-pN");
        obj.cN = $(this).attr("data-cN");
        obj.aN = $(this).attr("data-aN");
        $("#shopNameXs").text($(this).attr("data-shopname"));
        $("#AgentNameXs").text($(this).attr("data-agentName"));
        $("#AreadNameXs").text(obj.pN + obj.cN + obj.aN);
        $("#ContactXs").text($(this).attr("data-contact"));
        $("#MethodsXs").text($(this).attr("data-contactPhone"));
        $("#ShopId").val($(this).attr("data-shopId"));
        $('#Enterprise_ToExamine').modal({
            keyboard: true
        });
    });
    //恢复代理商门店方法
    $(".tab-content").on("click", "[name=Recovery]", function () {

        if (confirm("你确定要恢复代理商门店吗？")) {
            $.post("/ShopInfo/Edit", { shopId: $(this).attr("data-id"), Pd: 3 }, function (result) {
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
    $(".tab-content").on("click", "[name=editShop]", function () {
        var obj = {};
        obj.shopname = $(this).attr("data-shopname");
        obj.p = $(this).attr("data-p");
        obj.c = $(this).attr("data-c");
        obj.a = $(this).attr("data-a");
        obj.contact = $(this).attr("data-contact");
        obj.channelgroupid = $(this).attr("data-channelgroupid");
        obj.shopId = $(this).attr("data-shopId");
        obj.AgentName = $(this).attr("data-agentName");
        $.windowBase({
            id: "editThis",
            title: "编辑代理商门店",
            isShowBtn: false,
            callbackStr: "testCallbackEditWindow",
            url: "/ShopInfo/EditAgentShop?ShopName=" + obj.shopname + "&ProvinceID=" + obj.p + "&CityID=" + obj.c + "&CountyID=" + obj.a + "&Contact=" + obj.contact + "&ChannelGroupID=" + obj.channelgroupid + "&ID=" + obj.shopId + "&AgentName=" + obj.AgentName + "",
            width: 800,
            height: 500
        });
    });
    //查询方法
    $("#search").click(function () {
        $("#agentId").val("0");
        loadDataCount();
    });
    //确定审核方法
    $("#ToExamine").click(function () {
        $.post("/ShopInfo/ToExamine", { Remarks: $("#ShRemarks").text(), ShopId: $("#ShopId").val(), pd: 1 }, function (result) {
            if (result > 0) {
                $.message("审核成功！", true);
                option.startIndex = PageIndex;
                loadDataCount();
                $("#btnClose").trigger("click");
            } else {
                $.message("审核失败！", false);
            }
        })
    });
    //拒绝审核的方法
    $("#Refuse").click(function () {
        $.post("/ShopInfo/ToExamine", { Remarks: $("#ShRemarks").text(), ShopId: $("#ShopId").val(), pd: 2 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                option.startIndex = PageIndex;
                loadDataCount();
                $("#btnClose").trigger("click");
            } else {
                $.message("操作失败！", false);
            }
        })
    })
}
//批量关闭直营店
$("#BatchClose").click(function () {
    var shopIdList = shopIdListString();
    if (shopIdList == "") {
        $.message("请选择要关闭的代理商门店！", false);
    } else {
        if (confirm("确定要批量关闭代理商门店吗？")) {
            $.post("/ShopInfo/PauseDelete", { shopIdList: shopIdList }, function (result) {
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

//加载当前页数
loadDataCount();
initPage();


