var TableStr=function(data) {
    var htmlAttr = [];
    $.each(data, function (i, item) {       
        htmlAttr.push("<td>" + item[i] + "</td>");
    });

    return htmlAttr.join("");
}