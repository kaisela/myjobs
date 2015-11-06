//修改门店
//负责人：xhr
function testCallbackEditWindow_Update(data) {
    if (data.status) {
        $.message("修改成功!", true);
        window.location.reload();
    };
};
//新增导购
function testCallbackWindow_Create_GuidUn() {
    if (data.status) {
        $.message("新增成功!", true);
    };
}
//暂停门店
//负责人：xhr
$("#pause").click(function () {
    if (confirm("你确定要暂停门店吗？")) {
        $.post("/AgentState/AgentShopInfo/Edit", { shopId: $(this).attr("data-id"), Pd: 1 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                window.location.reload();
            } else {
                $.message("操作失败,代理商门店为正常状态才能暂停！", false);
            }
        })
    }
});
//关闭门店
//负责人：xhr
$("#close").click(function () {
    if (confirm("你确定要关闭代理商门店吗？")) {
        $.post("/AgentState/AgentShopInfo/Delete", { shopId: $(this).attr("data-id") }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                setTimeout(function () {
                        window.top.location.href = "Index";
                }, 1 * 1000);
            } else {
                $.message("操作失败！", false);
            }
        })
    }
});
//新增导购
//负责人：xhr
$("#guid_create").click(function () {

});
//恢复代理商门店
//负责人：xhr
$("#Recovery").click(function () {
    if (confirm("你确定要恢复代理商门店吗？")) {
        $.post("/AgentState/AgentShopInfo/Edit", { shopId: $(this).attr("data-id"), Pd: 3 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                window.location.reload();
            } else {
                $.message("操作失败！", false);
            }
        })
    }
})
