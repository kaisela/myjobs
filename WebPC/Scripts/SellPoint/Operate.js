$(function () {
    fzrgj();
    $("#btnSelectGB").on("click", function () {
        $("#hidGB").val(GetSelectGBID());
        $.windowBase({
            id: "autoOpen",
            title: "选择商品",
            isShowBtn: false,
            url: '/GoodsBasic/AutoGoodsBasic/?GoodsBasicIDs=' + $("#hidGB").val(),
            width: 900,
            height: 700
        });
    });
    //删除关联的商品
    $("#divGB").on("click", "span i[id^='delGb_']", function () {
        $(this).parent("span").remove();
    });
    $("#btnSave").click(function () {
        $("#hidGB").val(GetSelectGBID());
        $("#Content").val(editor.getData());
        //$("#cke_Content").attr("data-val","true");
        //$("#cke_Content").attr("data-val-autovalidate", "卖点详情不能为空！");

        var mark = true;
        if ($.trim($("#Content").val()) == "") {
            $("#cke_Content").O2OtipsShow({
                eleid: "cke_Content",
                content: "卖点详情不能为空"
            });
            mark = false;
        }
        else {
            $("#cke_Content").O2OtipsHide({ eleid: "cke_Content" });
        }
        if (parseInt(getStringLen($.trim($("#Title").val()))) > parseInt($("#Title").attr("data-val-length-max"))) {
            $("#Title").O2OtipsShow({
                eleid: "Title",
                content: $("#Title").attr("data-val-length")
            });
            mark = false;
        }
        if(mark)
        $("#formList").submit();
    });
    $("#btnCancel").click(function () {
        window.top.location.href = "/SellPoint/Index";
    });    
});
//获取已选择的商品id
function GetSelectGBID()
{
    var gb = "";
    $("i[id^='delGb_']").each(function () {
        gb = gb + "," + $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
    });
    if (gb != "")
        gb = gb.substr(1);
    return gb;
}
function setSelectGoods(obj) {
    var gbid = "";
    $.each(obj, function () {
        var o = $("#divGB").find("span[id='" + this.id + "']");
        if (!o || o.length == 0) {
            var html = '<span class="proLable" id="' + this.id + '">';
            html += ' <span class="proName" title="' + this.name.DeXml() + '">' + this.name.DeXml() + '</span>';
            html += '<i class="close" id="delGb_' + this.id + '">x</i>';
            html += "</span>";
            $("#divGB").append(html);
            gbid = gbid + "," + this.id;
        }
    });
    if (obj.length>0) {
        $("#btnSelectGB").O2OtipsHide({ eleid: "btnSelectGB" });
    }
}
//提交前手动验证
function autovalidate(value, con) {
    //debugger;
    //if ($(con).attr("id") == "btnSelectGB") {
    //    if ($.trim($("#divGB").html()) == "") {
    //        return false;
    //    }
    //    else {
    //        return true;
    //    }
    //} 
    if ($(con).attr("id") == "cke_Content") {
        if ($.trim($("#Content").val()) == "") {
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}
var sellpointSave = function(hxr) {
 if (hxr.Status == true) {
        $.message("操作成功", true);
        setTimeout(function () {
            window.top.location.href = "/SellPoint/Index";
        }, 1 * 1000);
    }
}