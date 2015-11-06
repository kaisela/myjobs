/// <reference path="E:\O2O\O2O\WebPC\Plugin/upload/demo/多图.html" />
var a = {
    exec: function (editor) {
        $.windowBase({
            id: "uploadImage",
            title: "上传图片",
            isShowBtn: "true",
            callbackStr: "windowCallback",
            url: "/Scripts/ckeditor/plugins/customerupload/customer-upload.html",
            beforeClose: function (status) {
                if (!status) {
                    return true;
                }
                var data = $("#uploadImage").find("iframe")[0].contentWindow.$("input[name='callback']").val();
                data = data.split(";");
                var html = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    html.push("<span style='margin:0;padding:0'><img style='vertical-align:top;display:block' src='" + getImgUrl(item) + "'/></span>");
                }
                editor.setData(editor.getData()+html.join(""));
                return true;
            },
            width: 600,
            height: 500
        });
    }
},
b = 'customerupload';
CKEDITOR.plugins.add(b, {
    init: function (editor) {
        editor.addCommand(b, a);
        editor.ui.addButton('customerupload', {
            label: '上传本地图片',
            icon: this.path + 'uploadimage.png',
            command: b
        });
    }
});