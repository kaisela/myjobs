//自定义移动方法  图片上传
function isImage(fileName) {
    //img.src.match(/\/(\w+\.(?:png|jpg|gif|bmp))$/i)[1]
    var regex = /\w+\.(?:BPM|JPG|JPEG|PNG|GIF|ICO|bpm|jpg|jpeg|png|gif|ico)/;
    var x = regex.exec(fileName)
    return x;
}
(function ($) {
    $.fn.ImageUpload = function (options) {
        var id = $(this).attr("id");
        var fileName = document.getElementById(id).value;
        if (isImage(document.getElementById(id).value) == null) {
            alert("请选择图片格式的文件");
            return;
        }
        var opts = $.extend({}, $.fn.ImageUpload.default, options);
        //异步上传图片

        opts.data.p = opts.imageType;
        if (!$.ajaxFileUpload) {

        }
        $.ajaxFileUpload({
            url: opts.url,
            fileElementId: id,
            dataType: "json",
            success: function (data, status) {
                if (options.success) opts.success(data);
            }
            , error: function () {
                //if(options.error)opts.erro

            },
            data: opts.data
        });
    }
    $.fn.ImageUpload.default = {
        url: '/ImageFile/ImageUpload',
        success: null,
        data: {},
        beforeUpload: function () {

        }
        , imageType: 1
    }

    $.fn.elementMove = function (options) {
        debugger;
        var opts = $.extend({}, $.fn.elementMove.defaults, options);
        this.each(function () {
            if (opts.moveTyp == null) {
                alert("请选择移动类型");
                return;
            }
            var nowElement = $(this);
            var nextElement;
            if (opts.moveTyp == 1) nextElement = nowElement.prev();
            else nextElement = nowElement.next();

            if (!nextElement || nextElement.length == 0) {
                if (opts.moveTyp == 1) alert(opts.error[0]);
                else alert(opts.error[1]);
                return;
            }
            if (opts.beforeMove != null) {
                var _b = opts.beforeMove(nowElement, nextElement);
                if (!_b) return;
            }


            //换位置
            if (opts.moveTyp == 2) {
                nextElement.after(nowElement)
            } else {
                nextElement.before(nowElement)
            }
            //换坐标
            var c_l = nowElement.offset().left;
            var t_l = nextElement.offset().left;
            var dist_l = (t_l > c_l && t_l != c_l) ? t_l - c_l : c_l - t_l;
            var c_t = nowElement.offset().top;
            var t_t = nextElement.offset().top;

            var dist_t = (t_t > c_t && t_t != c_t) ? t_t - c_t : c_t - t_t;
            var anim_l = (t_l > c_l && t_l != c_l) ? "+=" + dist_l + "px" : "-=" + dist_l + "px";
            var anim_t = (t_t > c_t && t_t != c_t) ? "+=" + dist_t + "px" : "-=" + dist_t + "px";
            var anim1_l = (t_l > c_l && t_l != c_l) ? "-=" + dist_l + "px" : "+=" + dist_l + "px";
            var anim1_t = (t_t > c_t && t_t != c_t) ? "-=" + dist_t + "px" : "+=" + dist_t + "px";

            nowElement.animate({
                left: anim_l,
                top: anim_t,
                opacity: 0.4
            },
                0).animate({
                    left: anim1_l,
                    top: anim1_t,
                    opacity: 1
                });
            nextElement.animate({
                left: anim1_l,
                top: anim1_t,
                opacity: 0.4
            },
                0).animate({
                    left: anim_l,
                    top: anim_t,
                    opacity: 1
                });

            if (opts.afterMove != null) {
                var _a = opts.afterMove();
                if (!_a) return;
            }
        });
    };

    $.fn.elementMove.defaults = {
        moveTyp: null,                                  //移动类型  1 往前移 2往后移
        beforeMove: null,                               //移动前执行方法   必须有返回值
        afterMove: null,                                //移动后执行方法   必须有返回值
        error: ["己经是最前面", "己经是最后面"]           //报错内容
    };

})(jQuery);

//遮罩层
function Mask() {
    var mybg = document.createElement("div");
    mybg.setAttribute("id", "mybg");
    mybg.style.background = "#000";
    mybg.style.width = "100%";
    mybg.style.height = "100%";
    mybg.style.position = "absolute";
    mybg.style.top = "0";
    mybg.style.left = "0";
    mybg.style.zIndex = "500";
    mybg.style.opacity = "0.3";
    mybg.style.filter = "Alpha(opacity=30)";
    document.body.appendChild(mybg);

    document.body.style.overflow = "hidden";

    window.onresize = function () {
        resetMask();
    }
    function resetMask() {
        mybg.style.width = window.outerWidth + "px";
        mybg.style.height = window.outerHeight + "px";
    }

    return {
        close: function () {
            $(mybg).remove();
            window.onresize = null;
        }
    }


}


//弹出窗口
function OpenForm(options) {
    var defalultOpts = {
        data: null,
        url: '',
        isMask: true,
        width: 610,
        height: 380,
        left: '50%',
        top: '50%',
        title: '',
        close: null

    }
    var opts = $.extend({}, defalultOpts, options);

    var div = $('<div id="Drag" class="mydiv" style="position:absolute"></div>');
    div.css({ height: opts.hieght + "px", widht: opts.width + "px", left: opts.left, top: opts.top });
    var tollBar = $('<div class="popTitle clearfix"><h3>' + opts.title + '</h3></div>');


    var closebar = $('<a href="javascript:void(0);">X</a>');

    $(closebar).click(function () {
        $(div).remove();
        if (opts.isMask) mask.close();
    });

    tollBar.append(closebar);
    div.append(tollBar);
    var _body = $('<div class="popContent"></div>').appendTo(div);
    var iframId = "iframe_" + new Date().getTime();
    var iframe = $('<iframe  scrolling="no" id="' + iframId + '" src="' + opts.url + '" style="width:100%;height:100%;border:0;"></iframe>');

    iframe.appendTo(_body);

    var mask;
    if (opts.isMask) mask = Mask();
    $("body").append(div);
    document.getElementById(iframId).contentWindow.Api = {
        close: function () {
            $(div).remove();
            if (opts.isMask) mask.close();
        }
    }

}

function keyPressNumber($send) {
    $send.keyup(function () {
        var tmptxt = $(this).val();
        $(this).val(tmptxt.replace(/\D|^0/g, ''));
    }).bind("paste", function () {
        var tmptxt = $(this).val();
        $(this).val(tmptxt.replace(/\D|^0/g, ''));
    }).css("ime-mode", "disabled");
}
//只能输入浮点数
function CheckInputFloat(oInput) {
    if ('' != $(oInput).val().replace(/\d{1,}\.{0,1}\d{0,}/, '')) {
        var lastText = $(oInput).val().match(/\d{1,}\.{0,1}\d{0,}/) == null ? '' : $(oInput).val().match(/\d{1,}\.{0,1}\d{0,}/);
        $(oInput).val(lastText);
    }
}
//只能输入浮点数(包括负数)
function CheckInputFloat2(oInput) {
    if ('' != $(oInput).val().replace(/\-{0,1}\d{1,}\.{0,1}\d{0,}/, '')) {
        var lastText = $(oInput).val().match(/\-{0,1}\d{1,}\.{0,1}\d{0,}/) == null ? '' : $(oInput).val().match(/\-{0,1}\d{1,}\.{0,1}\d{0,}/);
        $(oInput).val(lastText);
    }
}
//只能输入英文和数字
function CheckInputLetterANum(oInput) {
    var textInput = $(oInput).val().replace(/[^\w\.\/]/ig, '');
    //if ('' != textInput) {
    //    //var lastText = $(oInput).val().match(/[^\w\.\/]/ig) == null ? '' : $(oInput).val().match(/[^\w\.\/]/ig);
    //    //$(oInput).val(lastText);
    //    $(oInput).val(textInput);
    //}

    $(oInput).val(textInput);
}
//获取字符串的长度：汉字占两个字符
function getStringLen(Str) {
    var i, len, code;
    if (Str == null || Str == "") return 0;
    len = Str.length;
    for (i = 0; i < Str.length; i++) {
        code = Str.charCodeAt(i);
        if (code > 255) { len++; }
    }
    return len;
}

function fzrgj() {
    $("input[type='text']").attr("title", "不允许输入非法字符 <  >  ' \" ");
    $("input[type='text']").keyup(function (event) {
        var txt = $(this).val();
        var indexof = ""; //记录所包含的非法字符
        var txthtml = txt;
        if (txt.indexOf("<") > -1)
        { indexof = "<"; }
        else if (txt.indexOf(">") > -1)
        { indexof = ">"; }
        else if (txt.indexOf('"') > -1)
        { indexof = '"'; }
        else if (txt.indexOf("'") > -1)
        { indexof = "'"; }
        if (indexof != "") {
            if (txt.indexOf(indexof) > 0) {
                txthtml = txt.substring(0, txt.indexOf(indexof)) + txt.substring(txt.indexOf(indexof) + 1, txt.length);
            }
            else {
                txthtml = txt.substring(1, txt.length);
            }
            $(this).val(txthtml);
        }
    });
}



//全选联动
//ckAll:全选id;ckName:复选框name
function GangedCheckBox(ckAll, ckName) {
    //全选
    $("#" + ckAll).unbind('click').click(function () {
        if (document.getElementById(ckAll).checked == true) {
            $("input[name = " + ckName + "]:checkbox").each(function () {
                this.checked = true;
            })
        }
        else {
            $("input[name = " + ckName + "]:checkbox").removeAttr("checked");
        }
    });
    //复选框
    //查到列表内所有的复选框，并添加单击事件
    $("input[name=" + ckName + "]").unbind('click').click(function () {
        var chkCount = $("input[name=" + ckName + "]").length;//获取列表内所有复选框数量
        if ($("input[name = " + ckName + "]:checked").length == chkCount) {//判断列表内的复选框是否全部选中
            document.getElementById(ckAll).checked = true;//全选复选框选中
        }
        else {
            $("#" + ckAll).removeAttr("checked");//取消全选复选框选中
        }
    });
}

//可输入选择框
//id:文本框的id;<input type="text" data-SelectId="0" id=""/>;data-SelectId:选择项的value
//dataOption: 选择项Json字符串；[{ value: "", text: "" }]
function ImportSelect(id, dataOption) {
    if (dataOption != "") {
        var selectText = "";
        var divStr = new StringBuilder();
        divStr.append('<div id="div_ImportSelect" style="height:40px;">');
        divStr.append('<span class="ImportSelect_span">');
        divStr.append('<select id="IS_SelectList" class="form-control" style="width:175px;margin:0px;margin-left:5px;">');
        $(dataOption).each(function () {
            if (this.value == $("#" + id).attr("data-SelectId")) {
                selectText = this.text;
                divStr.append('<option value="' + this[0] + '" selected="selected">' + this[1] + '</option>');
            }
            else
                divStr.append('<option value="' + this[0] + '">' + this[1] + '</option>');
        });
        divStr.append('</select>');
        divStr.append('<span class="ImportSelect_Input_span">');
        divStr.append('<input type="text" data-SelectId="' + $("#" + id).attr("data-SelectId"));
        divStr.append('" id="' + id);
        divStr.append('" value="' + selectText);
        divStr.append('" class="form-control" style="border-right:0;width:180px;display:inline;" />');
        divStr.append('</span>');
        divStr.append('<div id="IS_divList" class="ImportSelect_divList">');
        divStr.append('<ul id="IS_ulList"></ul>');
        divStr.append('</div>');
        divStr.append('</div>');
        var $div = $("#" + id).parent();
        $div.html("");
        $div.append(divStr.tostring());

        $("#div_ImportSelect").off('change').on('change', "#IS_SelectList", function () {
            var text = $("#IS_SelectList option[value='" + $(this).val() + "']").text();
            $("#" + id).val(text);
            $("#" + id).attr("data-SelectId", $(this).val());
            $("#IS_divList").hide();
        });
        $("#IS_ulList").off('click').on('click', "li", function (e) {
            $("#" + id).val($(e.currentTarget).html());
            $("#" + id).attr("data-SelectId", $(e.currentTarget).attr('id'));
            $("#IS_SelectList option[value='" + $(e.currentTarget).attr('id') + "']").attr("selected", true);
            $(this).html("");
            $("#IS_divList").hide();
        });
        $("#" + id).focus(function () { SelectListShow($(this).val()); });
        $("#" + id).keyup(function () { SelectListShow($(this).val()); });
        $("#" + id).blur(function () {
            var isExist = false;
            $("#IS_SelectList option").each(function () {
                var ids = $(this).attr("value");
                if (values.indexOf(vals) >= 0) {
                    return;
                }
            });
            $(this).val("");
            $(this).attr("data-SelectId", "0");
        });
    }
}
function SelectListShow(vals) {
    if ($.trim(vals) == "") {
        $("#IS_divList").hide();
    }
    else {
        $("#IS_ulList").html("");
        $("#IS_SelectList option").each(function () {
            var values = $(this).text();
            var ids = $(this).attr("value");
            if (values.indexOf(vals) >= 0) {
                $("#IS_ulList").append('<li id="' + ids + '">' + values + "</li>");
            }
        });
        if ($("#IS_ulList").html() != "") { $("#IS_divList").show(); }
    }
}