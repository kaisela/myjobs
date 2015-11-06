//修改回调
//负责人：xhr
function testCallbackEditWindow_Update(data) {
        if (data.status) {
            $.message("修改成功", true);
            setTimeout(function () {
                window.location.reload();
            }, 1 * 1000)

        }   
}
//暂停导购
//负责人：xhr
$("#pause").click(function () {
    if (confirm("你确定要暂停吗？")) {
        var AgentId = $(this).attr("AgentId");
        $.post("Operation", { ID: AgentId, pd: 1 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                setTimeout(function () {
                    window.location.reload();
                }, 1 * 1000)
            } else {
                $.message("操作失败，正常状态的代理才能暂停！", false);
            }
        })
    }
});
//关闭导购
//负责人：xhr
$("#close").click(function () {
    if (confirm("你确定要关闭导购吗，关闭之后将不能恢复？")) {
        var AgentId = $(this).attr("AgentId");
        $.post("Operation", { ID: AgentId, pd: 3 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                setTimeout(function () {
                    window.top.location.href = "Index";
                }, 1 * 1000)
            } else {
                $.message("操作失败，正常状态的代理才能暂停！", false);
            }
        })
    }
});
//恢复导购
//负责人：谢海荣
$("#Recovery").click(function () {
    if (confirm("你确定要恢复吗？")) {
        var AgentId = $(this).attr("AgentId");
        $.post("Operation", { ID: AgentId, pd: 2 }, function (result) {
            if (result > 0) {
                $.message("操作成功！", true);
                setTimeout(function () {
                    window.location.reload();
                }, 1 * 1000)
            } else {
                $.message("操作失败，正常状态的代理才能暂停！", false);
            }
        })
    }
})