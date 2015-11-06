$(function () {
    fzrgj();
    //选择可视分组
    $("#selectGG").on("click", function () {
        var checkbox = $("#ulGG");
        // checkbox.toggle();
        if (checkbox.is(":hidden")) {
            if ($.trim(checkbox.html()) == "") $.message("没有可视分组可选",false);
            else {
                $(this).val("确定选择");
                checkbox.show();
            }
        } else {
            $("input[id^='checkGG_'").each(function () {
                var ggid = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
                if ($(this).is(":checked")) {
                    $("#divGG").append("<span class='tag'><span>" + $(this).val()
                        + "</span><a id='delgGroup_" + ggid + "'  title='删除'>X</a></span>");
                    $(this).parent("li").remove();
                }
            });
            checkbox.hide();
            $(this).val("选择可视分组");
            if ($.trim($("#divGG").html()) != "") {
                $("#selectGG").O2OtipsHide({ eleid: "selectGG" });
            }
        }
    });
    //删除可视分组
    $("#divGG").on("click", "a[id^='delgGroup_']", function () {
        var span = $(this).parent('span');
        var gid = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
        var gname = $(this).siblings("span").html();
        span.remove();
        $("#ulGG").append('<li> <input type="checkbox" id="checkGG_' + gid
            + '" value="' + gname + '"><label for="select_' + gid
        + '">' + gname + '</label></li>');
    });
    //商品名称限制字符
    $("#GESnapshot_GName").blur(function () {
        if (parseInt(getStringLen($.trim($("#GESnapshot_GName").val()))) > parseInt($("#GESnapshot_GName").attr("data-val-length-max"))) {
            $("#GESnapshot_GName").O2OtipsShow({
                eleid: "GESnapshot_GName",
                content: $("#GESnapshot_GName").attr("data-val-length")
            });
            mark = false;
        }
        else {
            $("#GESnapshot_GName").O2OtipsHide({ eleid: "GESnapshot_GName" });
        }
    });
    //根据品牌联动一级类目
    $("#BrandID").change(function () {
        $("#gClassP option").remove();
        $("#gClass option").remove();
        $("#gClassP").append('<option value="0">请选择一级类目</option>');
        $("#gClass").append('<option value="0">请选择二级类目</option>');
        if ($(this).val() != "0" && $(this).val() != "") {
            $.getJSON("/GoodsBasic/GetListByB", { bid: $(this).val() }
                   , function (data) {
                       var htmlBuilder = [];
                       $(data).each(function (item) {
                           htmlBuilder.push('<option value="' + data[item].ID + '">' + data[item].CName + '</option>');
                       });
                       $("#gClassP").append(htmlBuilder.join(""));
                       if ($("#hidGClassP").val() != "0") {
                           $("#gClassP").val($("#hidGClassP").val());
                           $("#hidGClassP").val("0");
                           $("#gClassP").trigger('change');
                       }
                   });
        }
    });
    //根据一级联动二级类目、属性名
    $("#gClassP").change(function () {
        $("#gClass option").remove();
        $("#ulAV").html("");
        $("#gClass").append('<option value="0">请选择二级类目</option>');
        if ($(this).val() != "0" && $(this).val() != "") {
            $.getJSON("/GoodsBasic/GetListByPB", { bid: $("#BrandID").val(), pid: $(this).val() }
                   , function (data) {
                       var htmlBuilder = [];
                       $(data).each(function (item) {
                           htmlBuilder.push('<option value="' + data[item].ID + '">' + data[item].CName + '</option>');
                       });
                       $("#gClass").append(htmlBuilder.join(""));
                       if ($("#GoodsClassID").val() != "" && $("#GoodsClassID").val() != "0") {
                           $("#gClass").val($("#GoodsClassID").val());
                           $("#GoodsClassID").val("");
                       }
                   });

            //根据一级联动属性名
            $.getJSON("/GoodsBasic/GetAttrListByP", { gcid: $(this).val() }
                   , function (data) {
                       var htmlBuilder = [];
                       $(data).each(function (item) {
                           htmlBuilder.push(' <li><a href="javascript:void(0);" id="' + data[item].ID + '">' + data[item].AName + '</a></li>');
                       });
                       $("#ulAV").append(htmlBuilder.join(""));
                   });
        }
    });

    //属性规格
    $("#btnAddAV").click(function () {
        var gAttr = $.trim($("#txtgAttr").val()) + ":";
        var gAttrValue = $.trim($("#txtgAV").val());
        gAttr = gAttr.DeXml();
        gAttrValue = gAttrValue.DeXml();
        var errorMsg = "";
        if (gAttr == ":") {
            $(this).O2OtipsShow({ eleid: "btnAddAV", content: "属性名不能为空！" });
        }
        else {
            var mark = true;
            $("#divGAV p label").each(function () {
                if (gAttr == $(this).html()) {
                    mark = false;
                }
            });
            if (!mark) {
                $(this).O2OtipsShow({ eleid: "btnAddAV", content: "该属性名已存在！" });
            }
            else {
                if (gAttrValue == "") {
                    $(this).O2OtipsShow({ eleid: "btnAddAV", content: "属性值不能为空！" });
                }
                else {
                    $(this).O2OtipsHide({ eleid: "btnAddAV" });
                    var htmlAttr = [];
                    htmlAttr.push('<p><label>' + gAttr + '</label><span>' + gAttrValue + '</span>');
                    htmlAttr.push('<a href="#0" style="display: inline-block; float: right;">删除</a></p>');
                    $("#divShowAttr").append(htmlAttr.join(""));
                    $("#txtgAttr").val("");
                    $("#txtgAV").val("");
                }
            }
        }
    });
    //属性删除
    $("#divShowAttr").on("click", "p a", function () {
        $(this).parent("p").remove();
    });
    //属性名
    $("#txtgAttr").focus(function () { liIsShow($(this), $("#ulAV"), 1); });
    $("#txtgAttr").click(function () {
        liIsShow($(this), $("#ulAV"), 1);       
    });
    //$("#txtgAttr").blur(function () {
    //    $("#ulAV").unbind("mouseleave").mouseleave(function () {
    //        $(this).hide();
    //    });
    //});
    $("#txtgAttr").keyup(function () { liIsShow($(this), $("#ulAV"), 2); });
    $("#txtgAttr").unbind("mouseleave").mouseleave(function () {
        $("#ulAV").unbind("mouseleave").mouseleave(function () {
            $(this).hide();
        });
    });
    $("#ulAV").on("click", "li a", function () {
        $("#txtgAttr").val($(this).html());
        $("#ulAV").hide();
        $("#ulVV").html("");
        var aid = $(this).attr("id");
        //根据属性名联动属性值
        $.getJSON("/GoodsBasic/GetAVListByP", { aid: aid }
               , function (data) {
                   var htmlBuilder = [];
                   $(data).each(function (item) {
                       htmlBuilder.push(' <li><a href="javascript:void(0);" id="' + data[item].ID + '">' + data[item].VName + '</a></li>');
                   });
                   $("#ulVV").append(htmlBuilder.join(""));
               });
    });
    //属性值
    $("#txtgAV").focus(function () { liIsShow($(this), $("#ulVV"), 1); });
    $("#txtgAV").click(function () { liIsShow($(this), $("#ulVV"), 1); });
    $("#txtgAV").keyup(function () { liIsShow($(this), $("#ulVV"), 2); });
    $("#txtgAV").unbind("mouseleave").mouseleave(function () {
        $("#ulVV").unbind("mouseleave").mouseleave(function () {
            $(this).hide();
        });
    });
    $("#ulVV").on("click", "li a", function () {
        $("#txtgAV").val($(this).html());
        $("#ulVV").hide();
    });
    //条形码  只能输入字母与数字
    $("#BarCode").keyup(function () {
        CheckInputLetterANum($(this));
    });
    //价格区间联动
    if ($("#ID").val() == "0") $("#RType").val("2");
    if ($("#RType").val() == "1") {
        if ($(".worth02").attr("data-isp") != "0") {
            $(".worth02").show();
            $(".worth02").css('display', 'inline-block');
        }
    }
    $("#RType").change(function () {
        var one = $(this).find("option:eq(0)");
        console.log(one);
        if (one.is("option:selected")) {
            if ($(".worth02").attr("data-isp") != "0") {
                $(".worth02").show();
                $(".worth02").css('display', 'inline-block');
                //InitPriceRange($("#Price").val(), 1);
                //InitPriceRange($("#Price").val(), 2);
            }
        } else {
            $(".worth02").hide();
        }
    });
    $("#Price").blur(function () { if ($(this).val() == "") $(this).val("0"); });
    $("#Price").change(function () {
        if ($.trim($(this).val()) == "") { $(this).val("0"); }
        InitPriceRange($(this).val(), 1);
        InitPriceRange($(this).val(), 2);
    });
    $("#Price").keyup(function () {
        CheckInputFloat($(this));
    });
    $("#txtPriceLower").keyup(function () {
        CheckInputFloat($(this));
    });
    $("#txtPriceUpper").keyup(function () {
        CheckInputFloat($(this));
    });   
    $("#txtPriceLower").blur(function () {
        var pr =parseFloat($("#Price").val());
        var low = parseFloat($(this).val());
        var upper =parseFloat( $("#txtPriceUpper").val());
        if (low > pr) { $.message("价格必须在价格区间范围内！", false); InitPriceRange(pr, 1); }
        else if (low > upper) { $.message("最小价格必须小于最大价格！", false); InitPriceRange(pr, 1); }
    });
    $("#txtPriceUpper").blur(function () {
        var pr = parseFloat($("#Price").val());
        var low = parseFloat($("#txtPriceUpper").val());
        var upper =parseFloat($(this).val());
        if (upper < pr) { $.message("价格必须在价格区间范围内！", false); InitPriceRange(pr, 2); }
        else if (low > upper) { $.message("最大价格必须大于最小价格！", false); InitPriceRange(pr, 2); }
    });

    $("#btnSave").click(function () {
        var gGroup = "";
        $("a[id^='delgGroup_']").each(function () {
            gGroup = gGroup + "," + $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
        });
        if (gGroup != "")
            gGroup = gGroup.substr(1);
        $("#hidGG").val(gGroup);
        var gAttr = "";
        var i = 0;
        $("#divGAV p label").each(function () {
            var aName = $(this).html().substr(0, $(this).html().length - 1);
            var vName = $(this).next("span").html();
            gAttr = gAttr + ',{"aName":"' + aName + '","vName":"' + vName + '"}';
        });
        $("#hidGAV").val("[" + gAttr.substr(1) + "]");
        $("#EContentEditor").val(editor.getData());

        var mark = true;
        if ($("#hidGEImg").val() == "") {
            $("#uploadContainer1").O2OtipsShow({
                eleid: "uploadContainer1",
                content: $("#uploadContainer1").attr("data-val-autovalidate")
            });
            mark = false;
        }
        else {
            $("#uploadContainer1").O2OtipsHide({ eleid: "uploadContainer1" });
        }
        if ($("#GoodsIMG").val() == "") {
            $("#uploadContainer2").O2OtipsShow({
                eleid: "uploadContainer2",
                content: $("#uploadContainer2").attr("data-val-autovalidate")
            });
            mark = false;
        }
        else {
            $("#uploadContainer2").O2OtipsHide({ eleid: "uploadContainer2" });
        } 
        if ($.trim($("#EContentEditor").val()) == "") {
            $("#cke_EContentEditor").O2OtipsShow({
                eleid: "cke_EContentEditor",
                content:"商品详情不能为空"
            });
            mark = false;
        }
        else {
            $("#cke_EContentEditor").O2OtipsHide({ eleid: "cke_EContentEditor" });
        }
        if (parseInt(getStringLen($.trim($("#GESnapshot_GName").val()))) > parseInt($("#GESnapshot_GName").attr("data-val-length-max"))) {
            $("#GESnapshot_GName").O2OtipsShow({
                eleid: "GESnapshot_GName",
                content: $("#GESnapshot_GName").attr("data-val-length")
            });
            mark = false;
        }
        else {
            $("#GESnapshot_GName").O2OtipsHide({ eleid: "GESnapshot_GName" });
        }
        if (mark)
            $("#formList").submit();
    });

    if ($("#BrandID").val() != "") {
        $("#BrandID").trigger("change");
    };
    if ($("#divGG span").length > 0) {
        $("#divGG span a").each(function () {
            var ggid = $(this).attr("id").substr($(this).attr("id").indexOf('_') + 1);
            $("#checkGG_" + ggid).parent("li").remove();
        });
    };
    $("#btnCancel").click(function () {
        if ($("#IsSale").val() == "1")
            window.top.location.href = "/GoodsBasic/Index/1";
        else
            window.top.location.href = "/GoodsBasic/Index";
    });
    keyPressNumber($("#SaleNum"));
    keyPressNumber($("#CommentNum"));
    $("#SaleNum").blur(function () {
        if ($.trim($(this).val()) == "")
            $(this).val("0");
    });
    $("#CommentNum").blur(function () {
        if ($.trim($(this).val()) == "")
            $(this).val("0");
    });
});
//动态显示属性名
function liIsShow(av,ul, mark) {
    if ($.trim($(ul).html()) != "") {
        $(ul).show();
        var attrName = $.trim((av).val());
        var i = 0;
        $(ul).find("li a").each(function () {
            var values = $(this).html();
            if (values.indexOf(attrName) >= 0 || attrName == "" || mark == 1) {
                $(this).parent("li").show();
                i++;
            }
            else {
                $(this).parent("li").hide();
            }
        });
        if (i == 0)
        {
            $(ul).hide();
        }
    }
}
//初始化价格区间，pc:价格；mark:1 最小区间，2：最大区间
function InitPriceRange(pc, mark) {
    if (mark == 1)
        $("#txtPriceLower").val((parseFloat(pc) * (1 - (parseFloat($("#txtPriceLower").attr("data-pricelower")) / 100))).toFixed(2));
    else
        $("#txtPriceUpper").val((parseFloat(pc) * (1 + (parseFloat($("#txtPriceUpper").attr("data-priceUpper")) / 100))).toFixed(2));
}
//提交前手动验证
function autovalidate(value, con) {
    //debugger;
    if ($(con).attr("id") == "gClass") {
        if ($("#gClass").val() == "0") {
            return false;
        }
        else {
            return true;
        }
    }
    //else if ($(con).attr("id") == "selectGG") {
    //    if ($("a[id^='delgGroup_']").length <= 0) {
    //        return false;
    //    }
    //    else {
    //        return true;
    //    }
    //}
    else if ($(con).attr("id") == "btnAddAV") {
        if ($("#divShowAttr p label").length <= 0) {
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}
var GoodsSave = function (hxr) {
    if (hxr.Status == true) {
        $.message("操作成功", true);
        setTimeout(function () {
            if (hxr.Data == "1")
                window.top.location.href = "/GoodsBasic/Index/1";
            else
                window.top.location.href = "/GoodsBasic/Index";
        }, 1 * 1000);
    }
}
function callbackImg(values) {
    if (values) {
        $("#uploadContainer1").O2OtipsHide({ eleid: "uploadContainer1" });
    }
}
function callbackImg1(values) {
    if (values) {
        $("#uploadContainer2").O2OtipsHide({ eleid: "uploadContainer2" });
    }
}