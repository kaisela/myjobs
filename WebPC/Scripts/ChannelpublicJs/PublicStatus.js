function statusStr(status) {
    if (status == 0) {
        return "正常";
    } else if (status == 1) {
        return "待验证";
    } else if (status == 2) {
        return "暂停";
    } else if (status == 3) {
        return "关闭";
    }
}

//根据实体店状态ID返回相应描述
function statusStr2(status) {
    if (status == 0) {
        return "正常";
    } else if (status == 1) {
        return "待审核";
    } else if (status == 2) {
        return "待分配";
    } else if (status == 3) {
        return "待验证";
    } else if (status == 4) {
        return "审核不通过";
    } else if (status == 5) {
        return "暂停";
    } else if (status == 6) {
        return "关闭";
    }
}
//反选功能
//谢海荣
$("body").on("click", "[type=checkbox]:not([data-allcheckbox=all])", function () {

    var checkName = $(this).attr("name");

    var checkCount = $("[name=" + checkName + "]:not(':disabled')").length;

    if (checkCount == $("#tabbody [name=" + checkName + "]:checked").length) {
        $("[data-childcheckbox=" + checkName + "]").prop("checked", true);
    } else {
        $("[data-childcheckbox=" + checkName + "]").prop("checked", false);
    }
    //var checkCount = $("#tabbody [name=checkbox]:not(':disabled')").length;
    //if (checkCount == $("#tabbody [name=checkbox]:checked").length) {
    //    alert($("#tabbody [name=checkbox]:checked").length);
    //    $("#selectall").prop("checked", true);
    //} else {
    //    $("#selectall").prop("checked", false);
    //}
});
//提交前手动验证
window.autovalidate = function (value, con) {
    if ($(con).attr("id") == "TElSHA") {
        if ($(con).val().trim() != "*************") {
            if (!isValidPhone(value)) {
                return false;
            }
            else
                return true;
        }
        else {
            return true;
        }
    }
    return true;
}
//全选功能
//谢海荣
$("body").on("click", "[data-allcheckbox=all]", function () {
    var checkname = $(this).attr("data-childcheckbox");
    if ($(this).prop("checked") == true) {
        $("[name=" + checkname + "]:not(':disabled')").prop("checked", true);
    } else {
        $("[name=" + checkname + "]:not(':disabled')").prop("checked", false);
    }

});
$(function () {
   // $("#TElSHA").attr("data-val",false);
    $("#TElSHA").focus(function () {
        if ($("#TElSHA").val() == "*************") {
            $("#TElSHA").val("");
            $("#TElSHA").attr("data-val", true);
        }
    });
    $("#TElSHA").blur(function () {
        if ($("#TElSHA").val() == "") {
            $("#TElSHA").val("*************");
            $("#TElSHA").attr("data-val", false);
        }
    });

    $("#EditClose").click(function () {
        $.closeParentWindow({
            status: false,
            winId: "editThis"
        });
    });
    $("#AgentStatus").html(statusStr2($("#AgentStatus").html()));

})