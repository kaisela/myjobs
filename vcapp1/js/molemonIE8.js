//ready开始
$(document).ready(function(){
	initStage();
});
//ready结束

//窗口变化
$(window).resize(function(){
	initStage();
});

//初始化
function initStage(){
	$("#stage0").css({"zoom":"100%","width":"100%"});
	$("#stage1").css({"zoom":"100%","width":"100%"});
	$("#stagei").css({"zoom":"100%","width":"100%"});
	$("#stagea").css({"zoom":"100%","width":"100%"});
	$("#stage2").css({"zoom":"100%","width":"100%"});
	$("#stage3").css({"zoom":"100%","width":"100%"});

	$("#s0mo1").css("left",($(window).width() - $("#s0mo1").width()) / 2);
	$("#s1mo1").css("left",($(window).width() - $("#s1mo1").width()) / 2);
	$("#simo1").css("left",($(window).width() - $("#s1mo1").width()) / 2);
	$("#samo1").css("left",($(window).width() - $("#s1mo1").width()) / 2);
	$("#s2mo1").css("left",($(window).width() - $("#s2mo1").width()) / 2);
	$("#s3mo1").css("left",($(window).width() - $("#s3mo1").width()) / 2);

	if($(window).height() >= 800){
		$("#s0mo1").css("top",($(window).height() - $("#s0mo1").height()) / 2 - 40 );
		$("#simo1").css("top",($(window).height() - $("#s1mo1").height()) / 2 + 20 );
		$("#samo1").css("top",($(window).height() - $("#s1mo1").height()) / 2 + 20 );
		$("#s1mo1").css("top",($(window).height() - $("#s1mo1").height()) / 2 + 20 );
		$("#s2mo1").css("top",($(window).height() - $("#s2mo1").height()) / 2 + 20 );
		$("#s3mo1").css("top",($(window).height() - $("#s3mo1").height()) / 2 + 20 );
	}
	if($(window).height() <= 800){
		$("#s0mo1").css("top",20 );
		$("#s1mo1").css("top",20 );
		$("#simo1").css("top",20 );
		$("#samo1").css("top",20 );
		$("#s2mo1").css("top",20 );
		$("#s3mo1").css("top",20 );
	}
	$("#download").on("click",function(){
		window.open("https://itunes.apple.com/us/app/mo-meng-liu-lan-qi/id929092372?mt=8")
	});
	$("#download2").on("click",function(){
		window.open("http://api.molemon.com/dl.php?mp=android&edition=official_website")
	});
	$("#fm8").css("left",($("#s0mo1").width() - $("#fm8").width()) / 2);

	$("#goAppstore2").on("click",function(){
		window.open("http://api.molemon.com/dl.php?mp=android&edition=official_website")
	});
	$("#goAppstore3").on("click",function(){
		window.open("https://itunes.apple.com/us/app/mo-meng-liu-lan-qi/id929092372?mt=8")
	});
}