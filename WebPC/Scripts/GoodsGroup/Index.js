
var index = (function ($) {
    var that = this;
    var pageSize = 10000;
    var option = {
        callback: function (index, params) {
            var allparams = $.extend({}, params, { pageIndex: index, pageSize: pageSize });
            $.post("/GoodsGroup/ShowList", allparams, function (data) {
                $("#GoodsTb").html(data);
               
            });
        },
        pagesize: pageSize,
        showpage: 6,
        getparams: function () {
            return {};
        },
        pageParam: "page",//ajax为true时不用传递
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }
    var init = function () {
        loadDataCount();
        $("#DeleteAllThis").on("click", function () {
            var idList = "";
            var counts = "";
            $("[name='CheckYou']").each(
               function () {
                   if ($(this).is(":checked")) {
                       idList = idList + $(this).val() + ",";
                       counts = counts + $(this).attr("counts") + ",";
                   }

               }

               );
            if (idList == "") {
                $.message("请至少选择一项！", false);
                return;
            }
            if (confirm("你确定要删除这些吗？")) {
               

              
                    $.post("/GoodsGroup/DeleteList", { ids: idList ,counts:counts}, function (data) {

                        if (data == "删除成功！") {

                            //alert(data);
                            $.message(data, true);
                            loadDataCount();

                        } else {
                           // alert(data);
                            $.message(data, false);
                            return;
                        }

                    });


              
            }
            

        });


        $("#AddThisGoods").on("click", function() {
            var name = $.trim($("#GroupName").val());
            var remarks = $("#Remarks").val();
            if (name.length<=0) {
                //alert("名称不能为空！");
                $.message("名称不能为空！", false);
                return;
            }
            if (name.length>15) {
                //alert("名称不能大于16位！");
                $.message("名称不能大于15位！", false);
                return;
            }
            if (remarks.length>100) {
               // alert("备注不能大于100位！");
                $.message("备注不能大于100位！", false);
                return;
            }
            $.post("/GoodsGroup/Add", { GroupName: name, Remarks: remarks }, function (data) {
                if (data=="添加成功！") {
                    //alert(data);
                    $.message(data, true);
                    $("#GroupName").val("");
                    $("#Remarks").val("");
                    $.closeWindow({
                        status: true,
                        winId: "addGoodsWin"
                    });
                    loadDataCount();
                } else {
                    $.message(data, false);
                }


            });

        });

        $("#KillThisGoods").on("click", function() {
            $("#GroupName").val("");
            $("#Remarks").val("");
            $.closeWindow({
                status: true,
                winId: "addGoodsWin"
            });
        });

    }
    var loadDataCount = function () {
       
        $.getJSON("/GoodsGroup/GetTotal", {}, function (data) {
            var totalCount = parseInt(data);
           $("span.pager").Pager("init", totalCount, option);
           
        });
       
    }
    var closeCallback = function () {
       
   }

    return {
        init: init,
        closeCallback:closeCallback
    }
})(jQuery);
index.init();