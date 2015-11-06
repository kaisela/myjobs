var InterValObj2; //timer变量，控制时间
var count2 = 60; //间隔函数，1秒执行
var curCount2;//当前剩余秒数
function sendmsg() {
        curCount2 = count2;
            //设置button效果，开始计时
                $(".idCode").attr("disabled", "true");
                $(".idCode").css("background-color","#999999");
                $(".idCode").val(""+ curCount2 + "秒后重获");
                InterValObj2 = window.setInterval(SetRemainTime2, 1000); //启动计时器，1秒执行一次
//向后台发送处理数据
             /*  $.ajax({
                    type: "POST", //用POST方式传输
                    dataType: "text", //数据格式:JSON
                    url: 'Login.ashx', //目标地址
                    data: "dealType=" + dealType +"&uid=" + uid + "&code=" + code,
                    error: function (XMLHttpRequest, textStatus, errorThrown) { },
                    success: function (msg){ }
                	});*/
          
//timer处理函数
function SetRemainTime2() {
            if (curCount2 == 0) {                
                window.clearInterval(InterValObj2);//停止计时器
                $(".idCode").removeAttr("disabled");//启用按钮
                $(".idCode").css("background-color","#229cea");
                $(".idCode").val("重新获取");
            }
            else {
                curCount2--;
                $(".idCode").val("" + curCount2 + "秒后重获");
            }
        }}
