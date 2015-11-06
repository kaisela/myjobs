$("#export").click(function () {
    //判断文件类型 通过jquery获取file的value来判断
    var val = $("#file").val();
    if (!val) {
        $.message("文件不能为空！", false);
        return;
    }
    debugger;
    var fileType = val.substring(val.lastIndexOf(".") + 1);
    if (fileType != "xls" && fileType != "xlsx") {
        $.message("请选择Excel文件,支持xls和xlsx", false);
        return;
    }
    $.ajaxFileUpload({
        url: '/LoadIn/SavePath',
        fileElementId: "file",
        dataType: "json",
        success: function (data, status) {
            if (data.status) {
                $.message("上传成功", true);
            }
            else {
                $.message("没有上传成功的数据己经被下载！", false);
                $("#downloaderror").submit();
            }
        }
        , error: function () {
            $.message("上传错误", false);
        },
        data: { p: 1 }
    });
});

