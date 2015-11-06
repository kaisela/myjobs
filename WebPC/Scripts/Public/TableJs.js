var Attributes=new Attry();
Attributes.Class="";



var TableStr = function (data) {
    var htmlAttr = [];
    $.each(data, function (i, item) {
        htmlAttr.push("<td class=" + Attributes.Class + ">" + item[i] + "</td>");
    });
    return htmlAttr.join("");
}