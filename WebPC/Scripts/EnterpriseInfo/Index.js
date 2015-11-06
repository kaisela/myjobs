var index = (function($) {
    
    var init = function () {

        debugger;
            var imgUrl = getImgUrl($("#imgurl").val());
            $("#ShowIMG").attr("src", imgUrl);
        


        $("#submitEdit").on("click", function() {
            var id = $("#ID").val();
            var areas = $("select[name='Areas']").val();
            var p = $("select[name='Province']").val();
            var c = $("select[name='City']").val();
            var address = $("#Address").val();
            var Contact = $("#Contact").val();
            var ContactTel = $("#ContactTel").val();
            var img = $("#infoCallBack").val();
            var img1 = $("#infoCallBack1").val();
            if (address.length<=0) {
               // alert("地址不能为空！");
                $.message("地址不能为空！", false);
                return;
            }
            if (address.length > 100) {
                $.message("地址长度不能超过100位！", false);
                return;
            }
            if (Contact.length<=0) {
                //alert("联系人不能为空！");
                $.message("联系人不能为空！", false);
                return;
            }
            if (Contact.length >10) {
                //alert("联系人不能为空！");
                $.message("联系人长度不能超过10位！", false);
                return;
            }
            if (ContactTel.length <= 0) {
                //alert("联系电话不能为空！");
                $.message("联系电话不能为空！", false);
                return;
            }

            
            var myreg = /^1[3578]\d{9}$/;
            var tel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}$/;

         

            if (areas==-1) {
                //alert("区域不能为空！");
                $.message("区域不能为空！", false);
                return;
            }
            if (p==-1) {
                //alert("区域不能为空！");
                $.message("省不能为空！", false);
                return;
            }
            if (c==-1) {
                //alert("市不能为空！");
                $.message("市不能为空！", false);
                return;
            }
            var pattern = new RegExp("^[a-zA-Z0-9\u4e00-\u9fa5]+$");
            if (!pattern.test(address)) {
                $.message("地址不允许存在特殊字符！", false);
                return;
            }
            if (!pattern.test(Contact)) {
                $.message("联系人不允许存在特殊字符！", false);
                return;
            }
            if (myreg.test(ContactTel)||tel.test(ContactTel)) {
                $.post("/EnterpriseInfo/Edit", { ID: id, AreasID: areas, Address: address, Contact: Contact, ContactTel: ContactTel, EIMG: img ,TitleLogo:img1}, function (data) {
                    if (data == "编辑成功！") {
                        $.message(data, true);
                        //alert(data);
                        $.closeWindow({
                            status: true,
                            winId: "EditInfoWin"
                        });
                        location.reload();
                    } else {
                        // alert(data);
                        $.message(data, false);
                        return;
                    }
                });
            } else {
                $.message("请输入有效的手机号码或者固定电话！", false);
                return;
            }
            

            
        });

    }
    var closeCallback = function (data) {


    }
    return {
        init:init,
        closeCallback: closeCallback
    }

})(jQuery);
index.init();