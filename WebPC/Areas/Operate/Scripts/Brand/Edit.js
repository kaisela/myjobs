function del(obj) {
    $(obj).parent().parent().remove();
}
window.onload = function () {
    $.ajax({
        url: "/Operate/GoodsClass/getPidList?pid=0",
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                $('#Parentid').append('<option value="' + data[i].ID + '">' + data[i].CName + '</option>');
            }
        }
    });
    $('#Parentid').change(function () {
        $.ajax({
            url: "/Operate/GoodsClass/getPidList?pid=" + $(this).val(),
            type: 'get',
            dataType: 'json',
            success: function (data) {
                $('#CId').empty();
                for (var i = 0; i < data.length; i++) {
                    $('#CId').append('<option value="' + data[i].ID + '">' + data[i].CName + '</option>');
                }
            }
        });
    });
    $('#Parentid').change();
    $('#addC').click(function () {
        var Parentid = $('#Parentid').val();
        var CId = $('#CId').val();
        var flg = true;
        $(".addcids").each(function (k, v) {
            if ($(v).val() == CId) {
                flg = false;
                alert('已经存在相同的分类了');
                return false;
            }
        });
        if (flg) {
            $(this.parentNode.parentNode).after(" <tr><td colspan='2'><input class='addcids' type='hidden' name='CIds[]' value='" + CId + "'><span>" +
                    $('#Parentid option[value=' + Parentid + ']').text() + '>' + $('#CId option[value=' + CId + ']').text() +
                    "</span></td><td><a href='#' onclick='del(this)'>删</a> </td></tr>");
        }
    });
}