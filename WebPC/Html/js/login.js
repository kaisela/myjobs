$(function(){
//	登录动画
	$(".enroll").click(function(){
		$(".content").addClass("flyOut");
		$(".validateBox").addClass("flyIn");
	})
	
	
	$(".enroll2").click(function(){
		$(".tittle").html("重置密码");
		$(".content").addClass("flyOut");
		$(".validateBox").addClass("flyIn");
	})
	
//	input密码tips
	$(".row4 input").focus(function(){
		$(".tips").fadeIn();
	})
	
	$(".row4 input").blur(function(){
		$(".tips").fadeOut();
	})
	
})




	function changeFile(obj){
			var objUrl = getObjectURL(obj.files[0]) ;
	//		console.log("objUrl = "+objUrl) ;
		if (objUrl) {
//				$("<img src='objUrl' />").appendTo(".imgBox");
				$("#img3").attr("src", objUrl);
			}
	}


	//建立一个可存取到该file的url
	function getObjectURL(file) {
	var url = null ; 
	if (window.createObjectURL!=undefined) { // basic
		url = window.createObjectURL(file) ;
	} else if (window.URL!=undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file) ;
	} else if (window.webkitURL!=undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file) ;
	}
	return url ;
	}
	

	
//	增加利润
	function addOneNum(obj) {
        var num =$(obj).prev().val();
        //alert(num)
        num = parseInt(num) + 10 + "%";
        $(obj).prev().val(num);
        $(obj).parents(".contentBox").prev().children().find(".conut").text(num);
        
        
    }
	
	
//	减少利润
    function minusOneNum(obj) {
        var num =$(obj).next().val();
        //alert(num)
        num = parseInt(num) - 10 + "%";
        $(obj).next().val(num);
        $(obj).parents(".contentBox").prev().children().find(".conut").text(num);
        if(num<=10+"%"){
        	$(obj).next().val(10+"%");
        	$(obj).parents().find(".contentBox").prev().children().find(".conut").text(10+"%");
        }
    }