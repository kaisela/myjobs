$(function () {
    var pageSize = 10;
    var pageIndex = 1;//当前页码
    var $BName = $("#BName");
    var $EName = $("#EName");
    var $GCID = $("select[name='GCID']");
    var startIndex = 1;
    var option = {
        callback: function (index, params) {
            startIndex = index;
            var allparams = $.extend({}, params, { pageIndex: index, pageSize: pageSize, type: "data" });
            $.getJSON('/Operate/Brand/Index'
                    , allparams//{ type: "data", BName: $.trim($BName.val()), GoodsClassID: -1, EName: $.trim($EName.val()), pageIndex: index, pageSize: pageSize }
                    , function (data) {
                        var htmlArr = [];
                        for (var i = 0; i < data.length; i++) {
                            htmlArr.push('<tr><td>');
                            htmlArr.push(data[i].BName);
                            htmlArr.push('</td><td>');
                            htmlArr.push(" <img src=" + getImgUrl(data[i].BIMG) + " />");
                            htmlArr.push('</td><td>');
                            htmlArr.push(data[i].BCategory);
                            htmlArr.push('</td><td>' + data[i].EName + '</td>');
                            htmlArr.push('<td>' + data[i].goodsnum + '</td>');
                            if (data[i].Status == 0) {
                                htmlArr.push('<td>正常</td>');
                            } else {
                                htmlArr.push('<td>已屏蔽</td>');
                            }

                            htmlArr.push('<td class="btngroup">');
                            if (data[i].Status == 0) {
                                htmlArr.push('<a href="javascript:void(0)" valueid="' + data[i].ID + '" class="forbid">禁用</a>&nbsp;');
                            } else {
                                htmlArr.push('<a href="javascript:void(0)" valueid="' + data[i].ID + '" class="resume">启用</a>&nbsp;');
                            }
                            htmlArr.push('<a href="/Operate/Brand/Edit?ID=' + data[i].ID + '">编辑</a>&nbsp;');
                            htmlArr.push('<a href="/Operate/Brand/Merge?ID=' + data[i].ID + '">合并</a>&nbsp;');
                            htmlArr.push('</td></tr>');
                        };

                        $("#BrandTb").html(htmlArr.join(""));
                        $(".table").on("click", ".forbid", function () {
                            var _this = $(this);
                            var prevtd = _this.parent().prev();
                            $.getJSON('/Operate/Brand/Forbid', { ID: _this.attr("valueid") }, function (data) {
                                prevtd.html("已屏蔽");
                                _this.html("启用");
                                _this.attr("class", "resume");
                                alert("成功禁用");
                            })
                        })
                        $(".table").on("click", ".resume", function () {
                            var _this = $(this);
                            var prevtd = _this.parent().prev();
                            $.getJSON('/Operate/Brand/Resume', { ID: _this.attr("valueid") }, function (data) {
                                prevtd.html("正常");
                                _this.html("禁用");
                                _this.attr("class", "forbid");
                                alert("成功启用");
                            })
                        })
                    }
           );
        },
        getparams: function () {
            return $("#BrandForm").serializeObject();
        },
        pagesize: pageSize,
        showpage: 6,
        pageParam: "page",//ajax为true时不用传递
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }
    var initPage = function () {
        $.getJSON("/Operate/Brand/Index"
           , { type: "count", BName: $.trim($BName.val()), GoodsClassID: -1, EName: $.trim($EName.val()) }
        , function (data) {
            var totalCount = parseInt(data);
            option.startIndex = startIndex;
            $("span.pager").Pager("init", totalCount, option);
        });
    }
    initPage();
    //搜索
    $("#btnSearch").click(function () {
        initPage();
    });
});