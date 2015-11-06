var CommentSuccess = function (hxr) {
    if (hxr.Status == true) {
        // window.top.location.href = hxr.Identify.url;
        $.message("添加成功！",true);
    }
}