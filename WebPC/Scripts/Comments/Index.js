var index = (function ($) {
    var that = this;
    var pageSize = publicConfig.PageComment;
    var startIndex = 1;
    //加载分页数据
    var option = {
        callback: function (pageIndex, params) {
            startIndex = pageIndex;
            var allparams = $.extend({}, params, {
                pageIndex: pageIndex, pageSize: pageSize
                , orderby: $("#orderby").val(), status: $("#status").val()
            });
            $.getJSON("/Comments/GetDataPager", allparams, function (data) {
                var htmlArr = [];
                $.each(data, function (i, n) {
                    var item = data[i];
                    //语音可以为多个 翻译说明一个
                    var Recording = "";
                    if (item.Recording) {
                        Recording = "   <div class=\"yuyingBox\">";
                        Recording += "      <p class=\"bold\">语音评价</p>";
                        var arr = item.Recording.split(";");
                        for (var i = 0; i < arr.length; i++) {
                            Recording += "  <span style=\"float:left;margin-right:5px;\" data-func='video' data-src='" + getAviUrl(arr[i]) + "'></span>";
                        }
                        Recording += "      <div class=\"yuying\">";
                        Recording += "          <span class=\"bold\">语音翻译：</span>";
                        Recording += "          <p>" + item.Translation + "</p>";
                        Recording += "      </div>";
                        Recording += "  </div>";
                    }
                    //图片可以为多个
                    var Picture = "";
                    if (item.Picture) {
                        Picture += "    <p class=\"bold\">图文评价</p>";
                        Picture += "     <div class=\"imgBox\">";
                        var arr = item.Picture.split(";");
                        for (var i = 0; i < arr.length; i++) {
                            //显示小图 _2 需要我们自己直接加
                            Picture += "    <img src='" + getImgUrl(arr[i] + "_2") + "' />";
                        }
                        Picture += "    </div>";
                    }
                    debugger;
                    //绘制很多内容时要一节一节拼齐 一句一句绘制 不要换行 输入tab键来确保标签成对写
                    var _Html = "";
                    _Html += "<ul class=\"conta\">";
                    _Html += "  <div class=\"main\">";
                    _Html += "      <div class=\"mainLeft col-sm-2\">";
                    _Html += "          <ul class=\"choose\">";
                    _Html += "              <li class=\"related\">";
                    _Html += "                  <span>" + item.GoodsBasic.GESnapshotList[0].GName.DeXml() + "</span>";
                    _Html += "              </li>";
                    _Html += "              <li class=\"operate\">";
                    _Html += "              <div class=\"tex\">买家姓名：<p>" + item.CName.DeXml() + "</p></div>";
                    _Html += "              <div class=\"tex\">来源门店：<p>" + item.ShopName.DeXml() + "</p></div>";
                    _Html += "              <div class=\"tex\">购买时间：<p>" + (new Date(item.BuyTime)).Format("yyyy-MM-dd") + "</p></div>";
                    _Html += "              <div class=\"tex\">评论时间：<p>" + (new Date(item.CommentTime)).Format("yyyy-MM-dd") + "</p></div>";
                    if (item.AreasDesc) {
                        _Html += "            <div class=\"tex\"><p>" + item.AreasDesc + "</p></div>";
                    }
                    _Html += "              </li>";
                    _Html += "          </ul>";
                    _Html += "      </div>";
                    _Html += "      <div class=\"col-sm-10 mainRight\">";
                    _Html += "      <li>";
                    _Html += "          <div class=\"tittletips\">";
                    _Html += "              <p>";
                    _Html += "                  <span>评价来源:</span>";
                    _Html += "                  <span>自定义评价</span>";
                    _Html += "              </p>";
                    _Html += "          </div>";
                    _Html += "          <div style=\"width: 100%;overflow: hidden;\">";
                    _Html += Recording;
                    _Html += Picture;
                    if (item.Remarks) {
                        _Html += "          <p class=\"imgtext\">" + item.Remarks.DeXml() + "</p>";
                    }
                    if (item.Reply) {
                        _Html += "              <div class=\"retext\">";
                        _Html += "                  <p>回复</p>";
                        _Html += "                  <span>" + item.Reply.DeXml() + "</span>";
                        _Html += "              </div>";
                    }
                    _Html += "              <div class=\"btna\">";
                    if (item.Status == 0) {
                        _Html += "              <a data-id=" + item.ID + " href='javascript:void(0)' data-au='FakeCommDel' name=\"shield\" class=\"btn btn-primary savepingjia\">屏蔽</a>";
                    }
                    else {
                        _Html += "              <a data-id=" + item.ID + " href='javascript:void(0)' disabled='disabled' class=\"btn btn-primary savepingjia\">已屏蔽</a>";
                    }
                    _Html += "                  <a href='/Comments/Edit/" + item.ID + "' data-au='FakeCommEdit' class=\"btn btn-primary savepingjia\">编辑</a>";
                    _Html += "               </div>";
                    _Html += "          </div>";
                    _Html += "      </li>";
                    _Html += "      </div>";
                    _Html += "  </div>";
                    _Html += "</ul>";
                    htmlArr.push(_Html);
                });
                //开始往div里装载html
                $("#content").html(htmlArr.join(""));
                $("[data-func='video'][data-src]").video();
            });
        },
        getparams: function () {
            return $("#CommentsForm").serializeObject();
        },
        startIndex: 1,
        //要对应小写的pagesize参数 否则不能正确显示分页
        pagesize: pageSize,
        showpage: 6,
        //pageParam: "page",//ajax为true时不用传递
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }
    var init = function () {
        //默认先加载总数 在加载完总数后再去加载分页数据
        loadDataCount();
        //搜索就是获取总行数 成功后去分页 hxr是总行数
        window.success = function (hxr) {
            $("span.pager").Pager("init", hxr, option);
        }

        //注册表格的删除事件 通过jquery选择器查找到标签
        //为了配合权限需要在选择器的查找属性里加:not([disabled=disabled])来给可用的标签绑定点击事件
        //因为on事件注册了就移除不了
        $("#content").on("click", "a[name='shield']:not([disabled=disabled])", function () {
            var $this = $(this);
            //获取ID data-id是存ID的html5格式的标签属性
            var id = $this.attr("data-id");
            if (confirm("屏蔽操作将不支持恢复，确定要屏蔽吗？")) {
                //post请求
                $.post("/Comments/Shield", { id: id }, function (returnData) {
                    //永远是正确的结果 直接提示出消息
                    $.message(returnData.Message, true);
                    //重新加载数据
                    loadDataCount();
                    //返回一个json格式的结果 把returnData转成json
                }, "json");
            }
        });
    }
    //默认先加载总数 在加载完总数后再去加载分页数据
    var loadDataCount = function () {
        $.getJSON("/Comments/GetTotal", {}, function (data) {
            var totalCount = parseInt(data);
            option.startIndex = startIndex;
            //在加载完总数后再去加载分页数据
            $("span.pager").Pager("init", totalCount, option);
        });
    }
    return {
        init: init
    }
})(jQuery);
index.init();

//注册
$("a[name='Arorderby']").click(function () {
    var thisValue = $(this).attr("thisValue");
    var v = thisValue;
    if (thisValue == 0) v = 1;
    else v = 0;
    var isck = $(this).attr("isck");
    if (isck == "-1") {
        $("#orderby").val(thisValue);
        $(this).attr("isck", "1");
        $("a[name='Arorderby'][thisValue='" + v + "']").attr("isck", "-1");
        $("#CommentsForm").submit();
    }
    else {
        $("#orderby").val(-1);
        $(this).attr("isck", "-1");
        $("#CommentsForm").submit();
    }
});