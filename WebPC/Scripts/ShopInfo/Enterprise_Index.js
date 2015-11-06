//保存当前页数
var PageIndex = 0;
//编辑返回的结果
var testCallbackEditWindow = function (data) {
    if (data.status) {
        $.message("修改成功", true);
        option.startIndex = PageIndex;
        loadDataCount();
    }

};
//新增成功返回的结果
var testCallback_Enterprise_Create = function (data) {
    if (data.status) {
        $.message("新增成功", true);
        option.startIndex = PageIndex;
        loadDataCount();
    }  
};
//一页显示的数据
var pageSize = 20;
//加载当前数据
var option = {
    callback: function (index, params) {
        if (index != 0) {
            PageIndex = index;
        }
        var allparams = $.extend({}, params, { page: index, pageSize: pageSize });
        $.getJSON("/ShopInfo/GetList", allparams, function (data) {

            //var htmlArr = [];
            //for (var i = 0; i < data.length; i++) {
            //    htmlArr.push("<li>" + data[i].RoleName + "</li>");
            //}
            //$("#testData").html(htmlArr.join(""));
            var htmlArr = [];
            $.each(data, function (i, item) {
                var Address = item.ProvinceN + " " + item.CityN + " " + item.CountyN;
                var groupName = item.GroupName == null ? "超级分组" : item.GroupName;
                var MPName = item.MPName == null ? "" : item.MPName;
                if (item.Status == 5) {
                    htmlArr.push("<tr>");
                    htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' id='checkbox" + item.ID + "' disabled='disabled'> <label for='checkbox" + item.ID + "'></label></div></td>");
                    htmlArr.push("<td>  <a href='Details?ShopId=" + item.ID + "' class='disableCss' data-div='.contentpanel' data-title='门店详情'>" + item.ShopName + "</a></td>");

                    htmlArr.push("<td><a class='disableCss'>" + Address + "</a></td>");
                    htmlArr.push("<td><a class='disableCss'>" + item.GuidCount + "</a></td>");
                    htmlArr.push("<td class='disableCss'>" + groupName + "</td>");
                    htmlArr.push("<td class='disableCss'>" + MPName + "</td>");
                    htmlArr.push("<td class='disableCss'>" + statusStr2(item.Status) + "</td>");
                    htmlArr.push("<td class='btngroup'>");
                    htmlArr.push("<a  class='disableCss' data-toggle='modal' data-target='.bs-example-modal-lg' data-au='ChnEdit' data-title='编辑直营店'>编辑</a>");
                    htmlArr.push("&nbsp;<a href='#0' data-id='" + item.ID + "' data-au='ChnClose' name='Recovery'>恢复</a>");
                    htmlArr.push("&nbsp;<a href='#0' data-id='" + item.ID + "' name='close' data-au='ChnDel'>关闭</a>");
                    htmlArr.push("</td>");
                    htmlArr.push("</tr>");
                } else {
                    htmlArr.push("<tr>");
                    htmlArr.push("<td><div class='ckbox ckbox-success'><input type='checkbox' name='checkbox' id='checkbox" + item.ID + "' value='" + item.ID + "'> <label for='checkbox" + item.ID + "'></label></div></td>");
                    htmlArr.push("<td>  <a href='Details?ShopId=" + item.ID + "' class='HrefFrame' data-div='.contentpanel' data-title='门店详情'>" + item.ShopName + "</a></td>");

                    htmlArr.push("<td>" + Address + "</td>");
                    htmlArr.push("<td><a>" + item.GuidCount + "</a></td>");
                    htmlArr.push("<td>" + groupName + "</td>");
                    htmlArr.push("<td>" + MPName + "</td>");
                    htmlArr.push("<td>" + statusStr2(item.Status) + "</td>");
                    htmlArr.push("<td class='btngroup'>");
                    htmlArr.push("<a");
                    htmlArr.push(" data-shopname='" + item.ShopName + "' data-p=" + item.ProvinceID + " data-c=" + item.CityID + " data-a=" + item.CountyID + "");
                    htmlArr.push(" data-contact='" + item.Contact + "' data-channelgroupid='" + item.ChannelGroupID + "' data-shopId=" + item.ID + "");
                    htmlArr.push(" data-toggle='modal' data-target='.bs-example-modal-lg' name='editShop' data-au='ChnEdit' data-title='编辑直营店'>编辑</a>");
                    htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='pause' data-au='ChnClose' href='#0' >暂停</a>");
                    htmlArr.push("&nbsp;<a data-id='" + item.ID + "' name='close' data-au='ChnDel' href='#0' >关闭</a>");
                    htmlArr.push("</td>");
                    htmlArr.push("</tr>");
                }

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
}
//加载数据总数
var loadDataCount = function () {
    $("#selectall").prop("checked", false);
    $.getJSON("/ShopInfo/GetListCount", $("#conditionForm").serializeObject(), function (data) {
        var totalCount = parseInt(data);
        option.startIndex = PageIndex;
        $("span.pager").Pager("init", totalCount, option);
    });
}
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
    var $this = $(this);
    if ($(this).val() != "") {
        var shopIdList = shopIdListString();
        if (shopIdList == "") {
            $.message("请选择要移动的直营店！", false);
            $(this).find("option").eq(0).attr("selected", "selected");
        } else {
            if (confirm("确定要移动到" + $("#ChannelPush option:selected").text())) {
                $.post("/ShopInfo/MobileShop", { ChannelId: $("#ChannelPush").val(), shopIdList: shopIdList }, function (result) {
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
   
    var shopIdList = shopIdListString();
    alert(shopIdList);
    if (shopIdList == "") {
        $.message("请选择要关闭的直营店！", false);
    } else {
        if (confirm("确定要批量关闭直营店吗？")) {
            $.post("/ShopInfo/PauseDelete", { shopIdList: shopIdList }, function (result) {
                if (result > 0) {

                    $.message("操作成功！", true);
                    loadDataCount();
                } else {
           
                    $.message("修改失败！", false);
                }
            })
        }

    }
});

//新增直营店
$("#CreateShopInfo").click(function () {
    $('#Enterprise_Create').modal({
        keyboard: true
    });
});

var initPage = function () {
    $("#tabbody").on("click", "[name=close]", function () {
        //var Message = "";
        //if (pd == 1) {
        //    Message = "你确定要暂停直营店吗？";
        //} else {
        //    Message = "你确定要关闭直营店吗？";
        //}
        if (confirm("你确定要关闭直营店吗？")) {
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
    $("#tabbody").on("click", "[name=pause]", function () {
        if (confirm("你确定要暂停直营店吗？")) {
            $.post("/ShopInfo/Edit", { shopId: $(this).attr("data-id"), Pd: 1 }, function (result) {
                if (result > 0) {
                    $.message("操作成功！", true);
                    loadDataCount();
                } else {
                    $.message("操作失败,直营店为正常状态才能暂停！", false);
                }
            })
        }
    });
    $("#tabbody").on("click", "[name=Recovery]", function () {
        //var Message = "";
        //if (pd == 1) {
        //    Message = "你确定要暂停直营店吗？";
        //} else {
        //    Message = "你确定要关闭直营店吗？";
        //}

        if (confirm("你确定要恢复直营店吗？")) {
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

    $("#tabbody").on("click", "[name=editShop]", function () {
        var obj = {};
        obj.shopname = $(this).attr("data-shopname");
        obj.p = $(this).attr("data-p");
        obj.c = $(this).attr("data-c");
        obj.a = $(this).attr("data-a");
        obj.contact = $(this).attr("data-contact");
        obj.channelgroupid = $(this).attr("data-channelgroupid");
        obj.shopId = $(this).attr("data-shopId");

        debugger;
        $.windowBase({
            id: "editThis",
            title: "编辑直营店",
            isShowBtn: false,
            callbackStr: "testCallbackEditWindow",
            url: "/ShopInfo/Update?ShopName=" + obj.shopname + "&ProvinceID=" + obj.p + "&CityID=" + obj.c + "&CountyID=" + obj.a + "&Contact=" + encodeURIComponent(obj.contact) + "&ChannelGroupID=" + obj.channelgroupid + "&ID=" + obj.shopId + "",
            width: 800,
            height: 500
        });
    });
    $("#search").click(function () {
        loadDataCount();
    });
};

//加载数据
loadDataCount();
initPage();


