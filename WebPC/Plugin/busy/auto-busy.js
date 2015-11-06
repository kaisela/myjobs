$(document).ajaxStart(function () {
    $.loading();
}).ajaxComplete(function () {
    $.loadingEnd();
});