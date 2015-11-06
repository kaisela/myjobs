


var index = (function ($) {
    var that = this;
    var pageSize = 5;
    var startIndex = 1;
    var option = {
        callback: function (index, params) {
            startIndex = index;
            var allparams = $.extend({}, params, { pageIndex: index, pageSize: pageSize });

            $.getJSON("/UserRole/GetDataPager", allparams, function (data) {
                var htmlArr = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    htmlArr.push("<tr>" +
                        "<td>" + item.RoleName + "</td>" +
                        "<td>" + (new Date(item.Addtime)).Format("yyyy/MM/dd") + "</td>" +
                        "<td class=\"btngroup\">" +
                        "<a class='edit' data-id=" + item.ID + " data-name=" + item.RoleName + " data-au='AccoEdit'>编辑</a>&nbsp" +
                        "<a class=\"delete\" data-id=" + item.ID + " data-au='AccoDel'>删除</a>" +
                        "</td>" +
                        "</tr>");
                }
                $(".table>tbody").html(htmlArr.join(""));
                $("#roleTable").find("a[data-func='openWin']").o2owindow("init");
            });
        },
        pagesize: pageSize,
        showpage: 6,
        getparams: function () {
            return {};
        },
        startIndex: 1,
        pageParam: "page",//ajax为true时不用传递
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }

    $(document).ready(function () {
        $("input[type='checkbox'][class='checkAll']").click(function () {
            var obj = $(this).parent().parent().parent().find("div[class='col-sm-6'] input[type='checkbox']");
            if ($(this).is(":checked")) {
                obj.attr("checked", "checked");
            } else {
                obj.removeAttr("checked");
            }
        });
    });

    

    var init = function () {
        loadDataCount();
        //这里是获取不到this的
        $("#submitAdd").on("click", function () {
            var roleName = $.trim($("input[name='roleName']").val());
         
            if (roleName.length<=0) {
                //alert("名称不能为空！");
                $.message("名称不能为空！", false);
                return;
            }
            if (roleName.length>15) {
                //alert("名称不能不能大于16位！");
                $.message("名称不能大于15位！", false);
                return;
            }
            var pattern = new RegExp("^[a-zA-Z0-9\u4e00-\u9fa5]+$");
            if (pattern.test(roleName)) {
               
                $.post("/UserRole/Add", { RoleName: roleName }, function(returnData) {
                    if (returnData == "添加成功！") {
                        //alert(returnData);
                        $.message(returnData, true);
                        $.closeWindow({
                            status: true,
                            winId: "addNewRoleWin"
                        });
                    } else {
                        // alert(returnData);
                        $.message(returnData, false);
                        return;
                    }

                });
            } else {
                $.message("名称不能还有特殊字符！", false);
                return;
            }
            
        });

        $("#roleTable").on("click", ".delete:not([disabled=disabled])", function () {
            var thisShit = $(this);
            var id = thisShit.attr("data-id");
            if (confirm("你确定要删除吗？")) {
                $.post("/UserRole/Delete", { id: id }, function (returnData) {
                    if (returnData != "角色存在关联，不能删除！") {
                        //alert(returnData);
                        $.message(returnData, true);
                        option.startIndex = startIndex;
                        loadDataCount();
                    } else {
                        //alert(returnData);
                        $.message(returnData, false);
                        return;
                    }
                });
            }

        });

        $("#roleTable").on("click", ".edit:not([disabled=disabled])", function () {
            var thisShit = $(this);
            var id = thisShit.attr("data-id");
            var name = thisShit.attr("data-name");
            $("#roleName1").val(name);
            $("#Mid").val(id);
           
                $.post("/UserRole/Edits", { Mid: id }, function(data) {
                    $("[name='CheckThis']").each(function() {
                        if ($(this).is(":checked")) {
                            $(this).prop("checked", false);
                        }

                    });
                    //找到对应的checkbox 并选中
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        $("input:checkbox[value='" + item + "']").prop("checked", "checked");
                    }
                });
          

            $.windowBase({
                id: "editThis",
                title: "编辑",
                isShowBtn: false,
                callbackStr: "index.editCallback",
               
                ele:"EditRolePower",
                width: 600,
                height: 500
            });
        });


    }
    var loadDataCount = function () {
        
        $.getJSON("/UserRole/GetTotal", {}, function (data) {
            var totalCount = parseInt(data);
            $("span.pager").Pager("init", totalCount, option);
        });
    }
    var closeCallback = function (data) {

        if (data.status) {

            option.startIndex = startIndex;
            $("input[name='roleName']").val("");
            loadDataCount();
        }
        $("input[name='roleName']").val("");
    }
    var editCallback = function (data) {
        if (data.status) {
            option.startIndex = startIndex;
            loadDataCount();
        }
       
    }
    return {
        init: init,
        closeCallback: closeCallback,
        editCallback: editCallback
    }
})(jQuery);
index.init();
