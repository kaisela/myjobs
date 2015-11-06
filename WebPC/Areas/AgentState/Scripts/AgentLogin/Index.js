var CommentSuccess = function (hxr) {
    if (hxr.Status == true) {
        window.top.location.href = hxr.Identify.url;
    }
}
$(function () {
    $(".leftMain").css("", "");
});