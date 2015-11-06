function move(_this) {
    var nowElement = $(_this).parent().parent().parent();
    var nextElement = $(_this).attr("move") == 1 ? nowElement.prev() : nowElement.next();
    var noworder=$(nowElement).attr("order");
    var nextorder=$(nextElement).attr("order");
   
    $.ajax({
        url: "/Operate/GoodsClass/Move",
        type: "get",
        async:false,
        data: {
            baseId: $(nowElement).attr("gcid"), baseSorting: $(nowElement).attr("order"),
            toId: $(nextElement).attr("gcid"), toSorting: $(nextElement).attr("order")
        },
        success: function (msg) {
            $.message("成功！", true);
        }
    });
    nowElement.attr("order", nextorder);
    nextElement.attr("order", noworder);
    $(_this).attr("move") == 1 ? nowElement.insertBefore(nextElement) : nowElement.insertAfter(nextElement);
    var nowA = $(_this).parent().clone();
    var nextA = nextElement.find("i:eq(0)").clone();
    nowElement.find("i:eq(0)").replaceWith(nextA);
    nextElement.find("i:eq(0)").replaceWith(nowA);
}

$('input[name="CName"]').change(function () {
    var objspan = $(this).next("span");
    $.ajax({
        url: "/Operate/GoodsClass/Edit",
        type: "get",
        data: {
            ID: $(this).parent().parent().attr("gcid"), CName: $(this).val()
        },
        success: function (msg) {
           // objspan.html(msg);
            setTimeout("$('.msg').html('')", 1000);
        }
    });
});