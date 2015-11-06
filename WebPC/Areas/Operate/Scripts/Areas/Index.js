$(function () {
    var pageSize = 10;
    var pageIndex = 0;//当前页码
    var $AName = $("#AName");
    var $ProvinceID = $("select[name='ProvinceID']");
    var $CityID = $("select[name='CityID']");
    var startIndex = 1;
    var option = {
        callback: function (index,params) {
            startIndex = index;
            var allparams = $.extend({}, params, { pageIndex: index, pageSize: pageSize, PID: $("#PID").val(),type: "data" });
            $.getJSON('/Operate/Areas/Index'
                    , allparams// { PID:$("#PID").val(),type: "data", AName: $.trim($AName.val()), ProvinceID: $ProvinceID.val(), CityID: $CityID.val(), pageIndex: index, pageSize: pageSize }
                    , function (data) {
                        var htmlArr = [];
                        for (var i = 0; i < data.length; i++) {
                            htmlArr.push('<tr><td>');
                            
                            htmlArr.push(data[i].ID);
                            htmlArr.push('</td><td>');
                            if (data[i].AType == 3) {
                                htmlArr.push(data[i].AName);
                            } else {
                                htmlArr.push('<a href="javascript:void(0)"  class="ANameLink" valueid="' + data[i].ID + '">' + data[i].AName + '</a>');
                            }
                            htmlArr.push('</td><td>' + data[i].ACode + '</td>');
                            htmlArr.push('<td class="btngroup">');
                            htmlArr.push('<a href="/Operate/Areas/Edit?ID=' + data[i].ID + '">编辑</a>&nbsp;');
                            htmlArr.push('<a href="/Operate/Areas/Merge?ID=' + data[i].ID + '">合并</a>&nbsp;');
                            htmlArr.push('</td></tr>');
                        };
                        $("#AreasTb").html(htmlArr.join(""));
                       // $("#PID").val("-1");
                        $(".ANameLink").click(function () {
                            var hid = $(this).attr("valueid");
                            $("#PID").val(hid);
                            initPage();
                        });
                    }
           );
        },
        getparams: function () {
            return $("#AreasForm").serializeObject();
        },
      
        pagesize: pageSize,
        showpage: 6,
        pageParam: "page",//ajax为true时不用传递
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }
    var initPage = function () {
        $.getJSON("/Operate/Areas/Index"
           , { PID: $("#PID").val(), type: "count", AName: $.trim($AName.val()), ProvinceID: $ProvinceID.val(), CityID: $CityID.val() }
        , function (data) {
            var totalCount = parseInt(data);
            option.startIndex = startIndex;
            $("span.pager").Pager("init", totalCount, option);
        });
    }
    initPage();
    //搜索
    $("#btnSearch").click(function () {
        $("#PID").val("-1");
        initPage();
    });
      
});



