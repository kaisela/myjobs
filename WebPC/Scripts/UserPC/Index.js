
var index = (function ($) {
    var that = this;
    var pageSize = 5;
    var startIndex = 1;
    var option = {
        callback: function (index,params) {
            startIndex = index;
            var allparams = $.extend({}, params, { pageIndex: index, pageSize: pageSize });
            $("#selectall").removeAttr("checked");
            $.getJSON("/UserPC/GetDataPager", allparams, function (data) {
                var htmlArr = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.AddName==null) {
                        item.AddName = "无";
                    }
                    if (item.RoleID == 0) {
                        htmlArr.push("<tr>" + "<td></td>" +
                            "<td>" + item.UserName + "</td>" +
                            "<td>" + item.RoleName + "</td>" +
                            "<td>" + item.AddName + "</td>" +
                            "<td>" + (new Date(item.AddTime)).Format("yyyy/MM/dd") + "</td>" );
                    } else {
                        htmlArr.push("<tr>" +
                            "<td><div class=\"ckbox ckbox-success\"><input type=\"checkbox\"  name=\"checkthis\" value=\" " + item.UserBasicID + "\" id=\"checkbox" + item.UserBasicID + "\" /> <label for=\"checkbox" + item.UserBasicID + "\"></label></div></td>" +
                                "<td>" + item.UserName + "</td>" +
                                 "<td>" + item.RoleName + "</td>" +
                                  "<td>" + item.AddName + "</td>" +
                                "<td>" + (new Date(item.AddTime)).Format("yyyy/MM/dd") + "</td>" +
                                "<td class=\"btngroup\">" +
                                "<a data-id=" + item.UserBasicID + "  class='change' data-au='AccoPwd'>重置密码</a>&nbsp" +
											"<a data-id=" + item.UserBasicID + " data-name=" + item.UserName + " data-role=" + item.RoleID + " class='edit' data-au='AccoEdit' >编辑</a>&nbsp" +
											"<a data-id=" + item.UserBasicID + "  class='delete' data-au='AccoDel' >删除</a>" +
											"</td>" +
                                "</tr>");
                    }
                    

                }
                $(".table>tbody").html(htmlArr.join(""));
                $("#userTable").find("a[data-func='openWin']").o2owindow("init");
            });
        },
        pagesize: pageSize,
        getparams: function () {
            var name = $("#searchUser").val();
            var roleid = $("#RoleId2").val();
            if (roleid == "") {
               roleid = -1;
            }
            return {
                roleid: roleid,
                name:name
            };
        },
        showpage: 6,
        pageParam: "page",//ajax为true时不用传递
        ajax: true//当为false时callback不用传递,，但是必须传递pageParam
    }
    var init = function () {
        loadDataCount();

        $("#searchClass").on("click", function() {
            loadDataCount();
        });

        $("#deleteAll").on("click", function () {
            var idList = "";
            $("[name='checkthis']").each(function () {
                if ($(this).is(":checked")) {
                    idList = idList + $(this).val() + ",";
                }


            });
            if (idList=="") {
                $.message("请至少选择一项！", false);
                return;
            }
            if (confirm("你确定要删除这些吗？")) {
               
                
                    $.post("/UserPC/DeleteList", {id:idList}, function (data) {

                        if (data=="删除成功！") {

                            // alert(data);
                            $.message(data, true);
                            loadDataCount();

                        } else {
                            //alert(data);
                            $.message(data, false);
                            return;
                        }

                    });


              
            }
           

        });

        $("#RoleId3").change(function() {
            var idList = "";
            var rolename = $("#RoleId3 option:selected").text();
            var roleid = $("#RoleId3").val();
            if (roleid=="") {
                $.message("请选择关联角色！",false);
            }
            $("[name='checkthis']").each(function () {
                if ($(this).is(":checked")) {
                    idList = idList + $(this).val() + ",";
                }


            });
            if (idList == "") {
                $.message("请至少选择一项！", false);
                return;
            }
            if (confirm("确实要为这些账号关联到"+rolename+"角色吗？")) {
                
               
                    $.post("/UserPC/UpdateList", { id: idList,roleid:roleid }, function (data) {

                        if (data == "关联成功！") {

                            $.message(data, true);
                            loadDataCount();
                            $("#RoleId3").val("");
                        } else {
                            $.message(data, false);
                            return;
                        }

                    });


               
            }

        });



        //这里是获取不到this的
        $("#submitAdd").on("click", function () {
            var userName =$.trim( $("input[name='UserName']").val());
            var pwd = $("input[name='Pwd']").val();
            var roleId = $("#RoleId").val();

           
            if (roleId == null) {
                $.message("请选择关联角色！", false);
                return;
            }
            if (userName=="") {
              // alert("用户名不能为空！");
                $.message("用户名不能为空！", false);
                return;
            }
            if (userName.length>16) {
               // alert("用户名必须小于16位！");
                $.message("用户名必须小于16位！", false);
                return;
            }
            if (pwd == "") {
                //alert("密码不能为空！");
                $.message("密码不能为空！", false);
                return;
            }
            if (pwd.length<6&&pwd.length>0) {
               // alert("密码必须大于6位！");
                $.message("密码必须大于6位！", false);
                return;
            }
            if (pwd.length>16) {
               // alert("密码必须小于16位！");
                $.message("密码必须小于16位！", false);
                return;
            }
            var pattern = new RegExp("^[a-zA-Z0-9\u4e00-\u9fa5]+$");
            if (pattern.test(pwd)) {
                $.post("/UserPC/Add", { UserName: userName, PassWord: pwd, RoleID: roleId }, function(returnData) {
                    if (returnData == "添加成功！") {
                        // alert(returnData);
                        $.message(returnData, true);
                        $.closeWindow({
                            status: true,
                            winId: "addNewUserWin"
                        });
                    } else {
                        $.message(returnData, false);
                        return;
                    }

                });
            } else {
               // alert("密码不能含有特殊字符！");
                $.message("密码不能含有特殊字符！", false);
                return;
            }
            
        });

        $("#submitEdit").on("click", function () {
            var userName =$.trim( $("input[name='UserName1']").val());
            var id = $("#PId1").val();
            var roleId = $("#RoleId1").val();

            if (userName == "") {
               // alert("用户名不能为空！");
                $.message("用户名不能为空！", false);
                return;
            }
            if (userName.length > 16) {
                //alert("用户名必须小于16位！");
                $.message("用户名必须小于16位！", false);
                return;
            }
            $.post("/UserPC/Update", { UserName: userName,  RoleID: roleId,UserBasicID:id }, function (returnData) {
                if (returnData == "编辑成功！") {
                    //alert(returnData);
                    $.message(returnData, true);
                    $.closeWindow({
                        status: true,
                        winId: "editThis"
                    });
                } else {
                    //alert(returnData);
                    $.message(returnData, false);
                    return;
                }
               
            });
        });

        $("#submitChange").on("click", function () {
            var pwd = $("#NewPwd").val();
            var pattern = new RegExp("^[a-zA-Z0-9\u4e00-\u9fa5]+$");
            var id = $("#PId").val();
            if (pwd == "") {
                //alert("密码不能为空！");
                $.message("密码不能为空！", false);
                return;
            }
            if (pwd.length < 6 && pwd.length > 0) {
                //alert("密码必须大于6位！");
                $.message("密码必须大于6位！", false);
                return;
            }
            if (pwd.length > 16) {
                //alert("密码必须小于16位！");
                $.message("密码必须小于16位！", false);
                return;
            }

            if (pattern.test(pwd)) {
                $.post("/UserPC/ChangePwd", { id: id, pwd: pwd }, function(returnData) {
                    if (returnData == "重置成功！") {
                       // alert(returnData);
                        $.message(returnData, true);
                        $.closeWindow({
                            status: true,
                            winId: "changePwd"
                        });
                    } else {
                        //alert(returnData);
                        $.message(returnData, false);
                        return;
                    }

                });
            } else {
                //alert("密码不能有特殊字符！");
                $.message("密码不能有特殊字符！", false);
                return;
            }
           
        });
        $("#userTable").on("click", ".delete:not([disabled=disabled])", function () {
            option.startIndex = startIndex;
            var $this = $(this);
            var id = $this.attr("data-id");
            if (confirm("你确定要删除吗？")) {
                $.post("/UserPC/Delete", { id: id }, function (returnData) {
                    if (returnData=="删除成功！") {
                        //alert(returnData);
                        $.message(returnData, true);
                        loadDataCount();
                    } else {
                        //alert(returnData);
                        $.message(returnData, false);
                        return;
                    }
                   

                });
            }
        });
        
        $("#userTable").on("click", ".edit:not([disabled=disabled])", function () {

           // option.startIndex = startIndex;
            var $this = $(this);
            var id = $this.attr("data-id");
            var name = $this.attr("data-name");
            var roleid = $this.attr("data-role");
            
            $("#UserName1").val(name);
            $("#PId1").val(id);
            $("#RoleId1").val(roleid);
           
            $.windowBase({
                    id:"editThis",
                    title: "编辑",
                    isShowBtn: false,
                    callbackStr:"index.editCallback",
                    ele: "EditUser",
                    width: 500,
                    height: 300
            });
        });

        $("#userTable").on("click", ".change:not([disabled=disabled])", function () {
            option.startIndex = startIndex;
            var $this = $(this);
            var id = $this.attr("data-id");
            $("#PId").val(id);
            $.windowBase({
                id: "changePwd",
                title: "重置密码",
                isShowBtn: false,
                callbackStr:"index.changeCallBack",
                ele: "ChangePwdContainer",
                width: 500,
                height: 300
            });
        });


    }
    var loadDataCount = function () {
        var name = $("#searchUser").val();
        var roleid = $("#RoleId2").val();
        if (roleid == "") {
            roleid = -1;
        }
        $.getJSON("/UserPC/GetTotal", {roleid:roleid,info:name}, function (data) {
            var totalCount = parseInt(data);
            $("span.pager").Pager("init", totalCount, option);
        });
    }
    var closeCallback = function (data) {
        if (data.status) {
            option.startIndex = startIndex;
            $("input[name='UserName']").val("");
            $("input[name='Pwd']").val("");
            loadDataCount();
        }
        
        $("input[name='UserName']").val("");
        $("input[name='Pwd']").val("");
    }
    var editCallback = function (data) {
        //  option.startIndex = startIndex;
        if (data.status) {
            $("#UserName1").val("");
            loadDataCount();
        }
        $("#UserName1").val("");
       
    }
    var changeCallBack = function (data) {
        if (data.status) {
            option.startIndex = startIndex;
            $("#NewPwd").val("");
            loadDataCount();
        }
        $("#NewPwd").val("");
    }
    return {
        init: init,
        closeCallback: closeCallback,
        editCallback: editCallback,
        changeCallBack: changeCallBack
    }
})(jQuery);
index.init();