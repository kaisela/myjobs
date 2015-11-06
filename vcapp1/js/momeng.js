
/**
 *右侧按钮浮动封装
 */
jQuery.fn.floatright = function(loaded) {
		var obj = this;
		body_height = parseInt($(window).height());
		block_height = parseInt(obj.height());
		top_position = parseInt((body_height/2) - (block_height/2) + $(window).scrollTop());
	if (body_height<block_height) { top_position = 0 + $(window).scrollTop(); };
	if(!loaded) {
		obj.css({'position': 'absolute'});
		obj.css({ 'top': top_position });
		$(window).bind('resize', function() { 
			checkWheel();
			obj.floatright(!loaded);
		});
		$(window).bind('scroll', function() { 
			checkWheel();
			obj.floatright(!loaded);
		});
	} else {
		obj.stop();
		obj.css({'position': 'absolute'});
		obj.animate({ 'top': top_position }, 500, 'linear',function(){checkWheel();});
	}
}


//全局变量
var delta;
var hloc = window.pageYOffset ;
var runflag = 0;
//console.log($(window).width());
$('body').mousewheel(function(event, delta){
//	console.log(hloc);
//	console.log(delta);
});
//页面加载完成
$(document).ready(function(){
	$("#rNavMain").show();
	$("#rNavMain").floatright();

	runflag = 0;
	$("#stage0").show();
	$("#stagei").hide();
	$("#stagea").hide();
	$("#stage1").hide();
	$("#stage2").hide();
	$("#stage3").hide();

	initStage();
	//console.log(runflag);
	$("#download").on("click",function(){
		window.open("https://itunes.apple.com/us/app/mo-meng-liu-lan-qi/id929092372?mt=8","_top")
	});
	$("#download2").on("click",function(){
		window.open("http://api.molemon.com/dl.php?mp=android&edition=official_website","_top")
	});
    stage0GT();
});
//ready 结束


//窗口变化
$(window).resize(function(){
	initStage();
	//orient();

	//console.log($(window).height() +" // "+$(window).width())
});
function run() {
	runflag = 1;
	//console.log(runflag)
}
//初始化
function initStage(){
	
	$("#swip0").css({"top":0,"left":0});
	$('html,body').animate({scrollTop:$('#stage0').offset().top}, 500)
	// if(runflag == 1){
		$("#btn0").on("click",function(){
			if(runflag == 1) {
				stage0GT();
				$("#footer").animate({bottom:-70},400,function(){$("#fm9").show();});
				runflag = 0;
			}
		});
		$("#btn1").on("click",function(){
			if(runflag == 1) {
				$("#footer").animate({bottom:0},400,function(){$("#fm9").hide();});
				stage0LT();
				runflag = 0;
			}
		});
		$("#btn2").on("click",function(){
			if(runflag == 1) {
				$("#footer").animate({bottom:0},400,function(){$("#fm9").hide();});
				stage1LT();
				runflag = 0;
			}
		});
		$("#btn3").on("click",function(){
			$("#fm9").hide();
			if(runflag == 1) {
				$("#footer").animate({bottom:0},400,function(){$("#fm9").hide();});
				stage2LT();
				runflag = 0;
			}
		});
	// }

	$("#stage0").height($(window).height());
	$("#stagei").height($(window).height());
	$("#stagea").height($(window).height());
	$("#stage1").height($(window).height());
	$("#stage2").height($(window).height());
	$("#stage3").height($(window).height());
	$("#stage4").height($(window).height());

	//宽高适配
	var wrate14 = $(window).width() / 20 + "%";
	var rate14 = $(window).width() / 2000;
	var wrate12 = $(window).width() / 15 + "%";
	var rate12 = $(window).width() / 1500;
	var wrate10 = $(window).width() / 10 + "%";
	var rate10 = $(window).width() / 1000;


/*宽高适配*/


//宽度>1280
	if($(window).width() > 1440){
		$("#stage0").css({"zoom":"100%","width":"100%"});
		$("#stagei").css({"zoom":"100%","width":"100%"});
		$("#stagea").css({"zoom":"100%","width":"100%"});
		$("#stage1").css({"zoom":"100%","width":"100%"});
		$("#stage2").css({"zoom":"100%","width":"100%"});
		$("#stage3").css({"zoom":"100%","width":"100%"});

		$("#s0mo1").css("left",($(window).width() - $("#s0mo1").width()) / 2);
		$("#simo1").css("left",($(window).width() - $("#simo1").width()) / 2);
		$("#samo1").css("left",($(window).width() - $("#samo1").width()) / 2);
		$("#s1mo1").css("left",($(window).width() - $("#s1mo1").width()) / 2);
		$("#s2mo1").css("left",($(window).width() - $("#s2mo1").width()) / 2);
		$("#s3mo1").css("left",($(window).width() - $("#s3mo1").width()) / 2);

		$(".footerbg").width(1000);

		
		if($(window).height() > 770){
			$("#s0mo1").css("top",($(window).height() - $("#s0mo1").height()) / 2 - 20 );
			$("#simo1").css("top",($(window).height() - $("#simo1").height()) / 2 - 20 );
			$("#samo1").css("top",($(window).height() - $("#samo1").height()) / 2 - 20 );
			$("#s1mo1").css("top",($(window).height() - $("#s1mo1").height()) / 2 - 20 );
			$("#s2mo1").css("top",($(window).height() - $("#s2mo1").height()) / 2 - 20 );
			$("#s3mo1").css("top",($(window).height() - $("#s3mo1").height()) / 2 - 20 );
		}
		if($(window).height() <= 770){
			$("#s0mo1").css("top",20 );
			$("#simo1").css("top",20 );
			$("#samo1").css("top",20 );
			$("#s1mo1").css("top",20 );
			$("#s2mo1").css("top",20 );
			$("#s3mo1").css("top",20 );
		}
	}
	//宽度>800
	if($(window).width() > 1024 && $(window).width() <= 1440){
		$("#stage0").css({"zoom":wrate14,"width":"100%"});
		$("#stagei").css({"zoom":wrate14,"width":"100%"});
		$("#stagea").css({"zoom":wrate14,"width":"100%"});
		$("#stage1").css({"zoom":wrate14,"width":"100%"});
		$("#stage2").css({"zoom":wrate14,"width":"100%"});
		$("#stage3").css({"zoom":wrate14,"width":"100%"});

		$("#s0mo1").css("left",($(window).width() - $("#s0mo1").width()*rate12) / 2 + 170/rate14);
		$("#simo1").css("left",($(window).width() - $("#simo1").width()*rate12) / 2 + 170/rate14);
		$("#samo1").css("left",($(window).width() - $("#samo1").width()*rate12) / 2 + 170/rate14);
		$("#s1mo1").css("left",($(window).width() - $("#s1mo1").width()*rate14) / 2 + 120/rate14);
		$("#s2mo1").css("left",($(window).width() - $("#s2mo1").width()*rate14) / 2 + 120/rate14);
		$("#s3mo1").css("left",($(window).width() - $("#s3mo1").width()*rate14) / 2 + 120/rate14);

		
		$("#stage0").height($(window).height() / rate14 + 50);
		$("#stagei").height($(window).height() / rate14);
		$("#stagea").height($(window).height() / rate14);
		$("#stage1").height($(window).height() / rate14);
		$("#stage2").height($(window).height() / rate14);
		$("#stage3").height($(window).height() / rate14);

		$(".footerbg").width(1000);
		
		if($(window).height() > 680){
			$("#s0mo1").css("top",($(window).height() - $("#s0mo1").height()) / 2 + 60 );
			$("#simo1").css("top",($(window).height() - $("#simo1").height()) / 2 + 120 );
			$("#samo1").css("top",($(window).height() - $("#samo1").height()) / 2 + 120 );
			$("#s1mo1").css("top",($(window).height() - $("#s1mo1").height()) / 2 + 120 );
			$("#s2mo1").css("top",($(window).height() - $("#s2mo1").height()) / 2 + 120 );
			$("#s3mo1").css("top",($(window).height() - $("#s3mo1").height()) / 2 + 120 );
		}
		if($(window).height() <= 680){
			$("#s0mo1").css("top",20);
			$("#simo1").css("top",20);
			$("#samo1").css("top",20);
			$("#s1mo1").css("top",20);
			$("#s2mo1").css("top",20);
			$("#s3mo1").css("top",20);
		}
	}
//宽度> 800  && < 1024
	var w = Browser();
	if($(window).width() > 800 && $(window).width() <= 1024){
		
		//alert(v);
		$(".footerbg").width($(window).width());
		if(w == "Mobile"){
			$(".footerbg").css({"marginLeft":$(window).width()/2});
		}
		$("#stage0").css({"zoom":wrate12,"width":"100%"});
		$("#stagei").css({"zoom":wrate12,"width":"100%"});
		$("#stagea").css({"zoom":wrate12,"width":"100%"});
		$("#stage1").css({"zoom":wrate12,"width":"100%"});
		$("#stage2").css({"zoom":wrate12,"width":"100%"});
		$("#stage3").css({"zoom":wrate12,"width":"100%"});

		$("#s0mo1").css("left",($(window).width() - $("#s0mo1").width()*rate12) / 2 + 50/rate12);
		$("#simo1").css("left",($(window).width() - $("#simo1").width()*rate12) / 2 + 80/rate12);
		$("#samo1").css("left",($(window).width() - $("#samo1").width()*rate12) / 2 + 80/rate12);
		$("#s1mo1").css("left",($(window).width() - $("#s1mo1").width()*rate12) / 2 + 80/rate12);
		$("#s2mo1").css("left",($(window).width() - $("#s2mo1").width()*rate12) / 2 + 80/rate12);
		$("#s3mo1").css("left",($(window).width() - $("#s3mo1").width()*rate12) / 2 + 80/rate12);

		
		$("#stage0").height($(window).height() / rate12);
		$("#stagei").height($(window).height() / rate12);
		$("#stagea").height($(window).height() / rate12);
		$("#stage1").height($(window).height() / rate12);
		$("#stage2").height($(window).height() / rate12);
		$("#stage3").height($(window).height() / rate12);

		//ipad safari bug
		if($(window).height() == 692){
			$("#footer").height(110);
			
		}
		
		if($(window).height() > 680){

			$("#s0mo1").css("top",($(window).height() - $("#s0mo1").height()) / 2 + 30 );
			$("#simo1").css("top",($(window).height() - $("#simo1").height()) / 2 + 120 );
			$("#samo1").css("top",($(window).height() - $("#samo1").height()) / 2 + 120 );
			$("#s1mo1").css("top",($(window).height() - $("#s1mo1").height()) / 2 + 120 );
			$("#s2mo1").css("top",($(window).height() - $("#s2mo1").height()) / 2 + 120 );
			$("#s3mo1").css("top",($(window).height() - $("#s3mo1").height()) / 2 + 120 );
		}
		if($(window).height() <= 680){
			$("#s0mo1").css("top",20);
			$("#simo1").css("top",120);
			$("#samo1").css("top",120);
			$("#s1mo1").css("top",120);
			$("#s2mo1").css("top",120);
			$("#s3mo1").css("top",120);
		}
	}
//宽度 > 320 && <=800
	if($(window).width() <= 800 && $(window).width() > 480){
		if(w == "Mobile"){
			$(".footerbg").css({"marginLeft":$(window).width()/2});
		}
		$("#stage0").css({"zoom":wrate10,"width":"100%"});
		$("#stagei").css({"zoom":wrate10,"width":"100%"});
		$("#stagea").css({"zoom":wrate10,"width":"100%"});
		$("#stage1").css({"zoom":wrate10,"width":"100%"});
		$("#stage2").css({"zoom":wrate10,"width":"100%"});
		$("#stage3").css({"zoom":wrate10,"width":"100%"});
		
		$("#s0mo1").css("left",($(window).width() - $("#s0mo1").width()*rate10) / 2);
		$("#simo1").css("left",($(window).width() - $("#simo1").width()*rate10) / 2);
		$("#samo1").css("left",($(window).width() - $("#samo1").width()*rate10) / 2);
		$("#s1mo1").css("left",($(window).width() - $("#s1mo1").width()*rate10) / 2);
		$("#s2mo1").css("left",($(window).width() - $("#s2mo1").width()*rate10) / 2);
		$("#s3mo1").css("left",($(window).width() - $("#s3mo1").width()*rate10) / 2);
		
		$("#stage0").height($(window).height() / rate10 + 50);
		$("#stage1").height($(window).height() / rate10);
		$("#stagei").height($(window).height() / rate10);
		$("#stagea").height($(window).height() / rate10);
		$("#stage2").height($(window).height() / rate10);
		$("#stage3").height($(window).height() / rate10);
		
		$(".footerbg").width($(window).width());

		if($(window).height() >= 480){

			$("#s0mo1").css("top",120 );
			$("#simo1").css("top",20 );
			$("#samo1").css("top",20 );
			$("#s1mo1").css("top",20 );
			$("#s2mo1").css("top",20 );
			$("#s3mo1").css("top",20 );
		}
		
		if($(window).height() < 480){
			
			$("#stage0").css({"zoom":wrate14,"width":"200%"});
			$("#stagei").css({"zoom":wrate14,"width":"200%"});
			$("#stagea").css({"zoom":wrate14,"width":"200%"});
			$("#stage1").css({"zoom":wrate14,"width":"200%"});
			$("#stage2").css({"zoom":wrate14,"width":"200%"});
			$("#stage3").css({"zoom":wrate14,"width":"200%"});

//			$("#stage1").height($(window).height()-70)
	
			$("#s0mo1").css("top",120 );
			$("#simo1").css("top",20 );
			$("#samo1").css("top",20 );
			$("#s1mo1").css("top",20 );
			$("#s2mo1").css("top",20 );
			$("#s3mo1").css("top",20 );

			$("#stage0").height($(window).height() / rate14);
			$("#stagei").height($(window).height() / rate14);
			$("#stagea").height($(window).height() / rate14);
			$("#stage1").height($(window).height() / rate14);
			$("#stage2").height($(window).height() / rate14);
			$("#stage3").height($(window).height() / rate14);
			
			$("#s0mo1").css("left",(($(window).width()/rate14 - $("#s0mo1").width()))/2);
			$("#simo1").css("left",(($(window).width()/rate14 - $("#simo1").width()))/2);
			$("#samo1").css("left",(($(window).width()/rate14 - $("#samo1").width()))/2);
			$("#s1mo1").css("left",(($(window).width()/rate14 - $("#s0mo1").width()))/2);
			$("#s2mo1").css("left",(($(window).width()/rate14 - $("#s0mo1").width()))/2);
			$("#s3mo1").css("left",(($(window).width()/rate14 - $("#s0mo1").width()))/2);

		}
	}
//手机端 适配 宽度 <= 480
	if($(window).width() <= 480){
		//alert(rate10)

		
		if($(window).width() == 320){
			$("#stage0").css({"zoom":wrate14,"width":"100%"});
			$("#stagei").css({"zoom":wrate14,"width":"100%"});
			$("#stagea").css({"zoom":wrate14,"width":"100%"});
			$("#stage1").css({"zoom":wrate14,"width":"100%"});
			$("#stage2").css({"zoom":wrate14,"width":"100%"});
			$("#stage3").css({"zoom":wrate14,"width":"100%"});
			
			$("#stage0").height($(window).height() / rate14);
			$("#stagei").height($(window).height() / rate14);
			$("#stagea").height($(window).height() / rate14);
			$("#stage1").height($(window).height() / rate14);
			$("#stage2").height($(window).height() / rate14);
			$("#stage3").height($(window).height() / rate14);


			$(".footerbg").width(640);

		}
		if($(window).width() == 360){
			$("#stage0").css({"zoom":wrate14,"width":"100%"});
			$("#stagei").css({"zoom":wrate14,"width":"100%"});
			$("#stagea").css({"zoom":wrate14,"width":"100%"});
			$("#stage1").css({"zoom":wrate14,"width":"100%"});
			$("#stage2").css({"zoom":wrate14,"width":"100%"});
			$("#stage3").css({"zoom":wrate14,"width":"100%"});
			
			$("#stage0").height($(window).height() / rate14);
			$("#stagei").height($(window).height() / rate14);
			$("#stagea").height($(window).height() / rate14);
			$("#stage1").height($(window).height() / rate14);
			$("#stage2").height($(window).height() / rate14);
			$("#stage3").height($(window).height() / rate14);


			$(".footerbg").width(720);

		}
		if($(window).width() == 375){
			$("#stage0").css({"zoom":wrate14,"width":"100%"});
			$("#stagei").css({"zoom":wrate14,"width":"100%"});
			$("#stagea").css({"zoom":wrate14,"width":"100%"});
			$("#stage1").css({"zoom":wrate14,"width":"100%"});
			$("#stage2").css({"zoom":wrate14,"width":"100%"});
			$("#stage3").css({"zoom":wrate14,"width":"100%"});
			
			$("#stage0").height($(window).height() / rate14);
			$("#stagei").height($(window).height() / rate14);
			$("#stagea").height($(window).height() / rate14);
			$("#stage1").height($(window).height() / rate14);
			$("#stage2").height($(window).height() / rate14);
			$("#stage3").height($(window).height() / rate14);

			$(".footerbg").width(750);

		}
		if($(window).width() == 414){
			$("#stage0").css({"zoom":wrate14,"width":"100%"});
			$("#stagei").css({"zoom":wrate14,"width":"100%"});
			$("#stagea").css({"zoom":wrate14,"width":"100%"});
			$("#stage1").css({"zoom":wrate14,"width":"100%"});
			$("#stage2").css({"zoom":wrate14,"width":"100%"});
			$("#stage3").css({"zoom":wrate14,"width":"100%"});
			
			$("#stage0").height($(window).height() / rate14);
			$("#stagei").height($(window).height() / rate14);
			$("#stagea").height($(window).height() / rate14);
			$("#stage1").height($(window).height() / rate14);
			$("#stage2").height($(window).height() / rate14);
			$("#stage3").height($(window).height() / rate14);

			$(".footerbg").width(828);

		}

		if($(window).width() < 480){
			$("#stage0").css({"zoom":wrate10,"width":"200%"});
			$("#stagei").css({"zoom":wrate10,"width":"200%"});
			$("#stagea").css({"zoom":wrate10,"width":"200%"});
			$("#stage1").css({"zoom":wrate10,"width":"200%"});
			$("#stage2").css({"zoom":wrate10,"width":"200%"});
			$("#stage3").css({"zoom":wrate10,"width":"200%"});
			
			$("#stage0").height($(window).height() / rate10);
			$("#stagei").height($(window).height() / rate10);
			$("#stagea").height($(window).height() / rate10);
			$("#stage1").height($(window).height() / rate10);
			$("#stage2").height($(window).height() / rate10);
			$("#stage3").height($(window).height() / rate10);

		}else if($(window).width() < 320){
			//ip5
			$("#stage0").css({"zoom":wrate10,"width":"200%"});
			$("#stagei").css({"zoom":wrate10,"width":"200%"});
			$("#stagea").css({"zoom":wrate10,"width":"200%"});
			$("#stage1").css({"zoom":wrate10,"width":"200%"});
			$("#stage2").css({"zoom":wrate10,"width":"200%"});
			$("#stage3").css({"zoom":wrate10,"width":"200%"});
			
			$("#stage0").height($(window).height() / rate10);
			$("#stagei").height($(window).height() / rate10);
			$("#stagea").height($(window).height() / rate10);
			$("#stage1").height($(window).height() / rate10);
			$("#stage2").height($(window).height() / rate10);
			$("#stage3").height($(window).height() / rate10);
		}else {
			//ip4 横屏
			$("#stage0").css({"zoom":wrate14,"width":"200%"});
			$("#stagei").css({"zoom":wrate14,"width":"200%"});
			$("#stagea").css({"zoom":wrate14,"width":"200%"});
			$("#stage1").css({"zoom":wrate14,"width":"200%"});
			$("#stage2").css({"zoom":wrate14,"width":"200%"});
			$("#stage3").css({"zoom":wrate14,"width":"200%"});

			$("#stage0").height($(window).height() / rate14);
			$("#stagei").height($(window).height() / rate14);
			$("#stagea").height($(window).height() / rate14);
			$("#stage1").height($(window).height() / rate14);
			$("#stage2").height($(window).height() / rate14);
			$("#stage3").height($(window).height() / rate14);
		}
		if($(window).height() >= 736){
			//alert(1)
				$("#s0mo1").css("top",($(window).height() - $("#s0mo1").height()) / 2 + 320 );
				$("#simo1").css("top",($(window).height() - $("#simo1").height()) / 2 + 320 );
				$("#samo1").css("top",($(window).height() - $("#samo1").height()) / 2 + 320 );
				$("#s1mo1").css("top",($(window).height() - $("#s1mo1").height()) / 2 + 320 );
				$("#s2mo1").css("top",($(window).height() - $("#s2mo1").height()) / 2 + 320 );
				$("#s3mo1").css("top",($(window).height() - $("#s3mo1").height()) / 2 + 320 );
		}else if($(window).height() >= 500){
			//alert(2)
				$("#s0mo1").css("top",($(window).height() - $("#s0mo1").height()) / 2 + 420 );
				$("#simo1").css("top",($(window).height() - $("#simo1").height()) / 2 + 320 );
				$("#samo1").css("top",($(window).height() - $("#samo1").height()) / 2 + 320 );
				$("#s1mo1").css("top",($(window).height() - $("#s1mo1").height()) / 2 + 320 );
				$("#s2mo1").css("top",($(window).height() - $("#s2mo1").height()) / 2 + 320 );
				$("#s3mo1").css("top",($(window).height() - $("#s3mo1").height()) / 2 + 320 );
		}else if($(window).height() >= 400){
			//alert(3)
				$("#s0mo1").css("top",($(window).height() - $("#s0mo1").height()) / 2 + 420 );
				$("#simo1").css("top",($(window).height() - $("#simo1").height()) / 2 + 320 );
				$("#samo1").css("top",($(window).height() - $("#samo1").height()) / 2 + 320 );
				$("#s1mo1").css("top",($(window).height() - $("#s1mo1").height()) / 2 + 320 );
				$("#s2mo1").css("top",($(window).height() - $("#s2mo1").height()) / 2 + 320 );
				$("#s3mo1").css("top",($(window).height() - $("#s3mo1").height()) / 2 + 320 );
		}else{
			
				$("#s0mo1").css("top",($(window).height() - $("#s0mo1").height()) / 2 + 350 );
				$("#simo1").css("top",($(window).height() - $("#simo1").height()) / 2 + 320 );
				$("#samo1").css("top",($(window).height() - $("#samo1").height()) / 2 + 320 );
				$("#s1mo1").css("top",($(window).height() - $("#s1mo1").height()) / 2 + 320 );
				$("#s2mo1").css("top",($(window).height() - $("#s2mo1").height()) / 2 + 320 );
				$("#s3mo1").css("top",($(window).height() - $("#s3mo1").height()) / 2 + 320 );
		}
	}


//宽高适配 end


	//stage0 下载按钮
	$("#fm8").css("left",$("#s0mo1").width()/2 - $("#fm8").width()/2);
	//底部下载按钮
	if($(window).width() <= 350){
		$("#download").css({backgroundSize:"70%",right:"5px"});
	}
	if($(window).width() > 350){
		$("#download").css({backgroundSize:"100%",right:"25px"});
	}

	if($(window).width() <= 300){
		$("#download").hide();
	}

	if($(window).width() > 300){
		$("#download").show();
	}
//alert(1);
}//初始化完毕

//各板块的滚动事件
$('#stage0').mousewheel(function (event, delta){	
	event.preventDefault();
    event.stopPropagation();
	event.cancelBubble=true; 
	

	if(runflag == 1){

		if(delta < 0){
			runflag = 0;
	        stage0LT();
		}
		if(delta > 0){
			runflag = 0;
			//stage0GT();
			$("#fm9").animate({"opacity":0},100);
		}
	}
});
$('#stagei').mousewheel(function (event, delta) {
	event.preventDefault();
	event.stopPropagation();
	event.cancelBubble=true; 
	if(runflag == 1){
		if(delta > 0){
			runflag = 0;
	        stageiGT()
		}
		
		if(delta < 0){
			runflag = 0;
	        stageiLT();
		}
	}
});
$('#stagea').mousewheel(function (event, delta) {
	event.preventDefault();
	event.stopPropagation();
	event.cancelBubble=true; 
	if(runflag == 1){
		if(delta > 0){
			runflag = 0;
	        stageaGT()
		}
		
		if(delta < 0){
			runflag = 0;
	        stageaLT();
		}
	}
});
$('#stage1').mousewheel(function (event, delta) {
	event.preventDefault();
	event.stopPropagation();
	event.cancelBubble=true; 
	if(runflag == 1){
		if(delta > 0){
			runflag = 0;
	        stage1GT()
		}
		
		if(delta < 0){
			runflag = 0;
	        stage1LT();
		}
	}
});
$('#stage2').mousewheel(function (event, delta) {
	event.preventDefault();
	event.stopPropagation();
	event.cancelBubble=true;
	if(runflag == 1){
		if(delta > 0){
			runflag = 0;
			stage2GT()
		}
		if(delta < 0){
			runflag = 0;
			stage2LT()
		}
	}
});

$('#stage3').mousewheel(function (event, delta) {
	event.preventDefault();
	event.stopPropagation();
	event.cancelBubble=true;
	if(runflag == 1){
		if(delta > 0){
			runflag = 0;
			stage3GT()
		}
		if(delta < 0){
			runflag = 0;
			stage3LT ()
		}
	}
});
//end

//初始版 
function stage0GT(){
	
	resetAni();

	$("#stage0").show();
	$("#stagei").hide();
	$("#stagea").hide();
	$("#stage1").hide();
	$("#stage2").hide();
	$("#stage3").hide();

	$("#btn0").css("opacity",1);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",0);	
	
	$("#goAppstore3").on("click",function(){
		window.open("https://itunes.apple.com/us/app/mo-meng-liu-lan-qi/id929092372?mt=8","_blank")
	});
	$("#goAppstore2").on("click",function(){
		window.open("http://api.molemon.com/dl.php?mp=android&edition=official_website","_blank")
	});
/*
	$("#fm1").css({"top":100,"left":280,"opacity":0});
	$("#fm2").css({"top":150,"left":230,"opacity":0});
	$("#fm3").css({"top":100,"left":260,"opacity":0});
	$("#fm4").css({"top":130,"opacity":0,"backgroundSize":180});
	$("#fm5").css({"top":30,"opacity":0,"backgroundSize":110});
	$("#fm6").css({"top":480,"opacity":0});
	$("#fm7").css({"top":580,"opacity":0});
	$("#fm8").css({"top":685,"opacity":0});
*/
	//$('html,body').animate({scrollTop:$('#stage0').offset().top}, 500,function(e){
		$("#stage0").oneTime('110ms',function(){$("#fm1").animate({left:440,top:-70,opacity:1},1000,"easeOutQuint");});
		$("#stage0").oneTime('120ms',function(){$("#fm2").animate({left:310,top:100,opacity:1},1000,"easeOutQuint");});
		$("#stage0").oneTime('130ms',function(){$("#fm3").animate({left:180,top:-100,opacity:1},1000,"easeOutQuint");});

		$("#stage0").oneTime('40ms',function(){$("#fm4").animate({top:30,opacity:1,backgroundSize:300},600,"easeOutQuint");});
		//$("#stage0").oneTime('330ms',function(){$("#fm5").animate({opacity:1,backgroundSize:230},200,"easeInQuint");});
		//$("#stage0").everyTime('1500ms',function(){$("#fm9").animate({"opacity":1},400);});
		$("#fm9").show();
		$("#stage0").everyTime('1500ms','a',function(){
				$("#fm9").css({opacity:0,bottom:100});
					arrDown();				
		});			
		$("#stage0").oneTime('430ms',function(){
			//$("#fm5").animate({opacity:1,backgroundSize:200},200,"easeOutQuint",function(){
				$("#fm4").oneTime('10ms',function(){$("#fm6").animate({top:280,opacity:1},500,"easeOutQuint");});
				$("#fm4").oneTime('100ms',function(){$("#fm7").animate({top:370,opacity:1},500,"easeOutQuint");});
				$("#fm4").oneTime('200ms',function(){$("#fm8").animate({top:510,opacity:1},500,"easeOutQuint");});
			//});			
		});
	//});
}

//向下箭头动画
function arrDown(){
	
	$("#fm9").animate({"opacity":1},600,function(){
		$("#fm9").animate({"bottom":50,"opacity":0},800,function(){
			$("#fm9").css({opacity:0,bottom:100});
		});
	});
}
//版0 下i
function stage0LT(){
	resetAni();
	$("#stage0").hide();
	$("#stagei").show();
	$("#stagea").hide();
	$("#stage1").hide();
	$("#stage2").hide();
	$("#stage3").hide();

	$("#btn0").css("opacity",0);
	$("#btni").css("opacity",1);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",0);	
	
	$("#im1").animate({top:0,opacity:1},300,"easeOutQuint");
	$("#im2").animate({opacity:1,top:140},700,"easeOutQuint",function(){});
	$("#footer").animate({bottom:0},400,function(){$("#fm9").hide();});
	return;
}
//版i 上 0
function stageiGT(){
	resetAni();
    $("#stage0").show();
    $("#stage1").show();  
    $("#stage2").hide();
    $("#stage3").hide();

	$("#btn0").css("opacity",1);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",0);	
	
    $("#footer").animate({bottom:-70},400);
    //$('html,body').animate({scrollTop:$('#stage0').offset().top}, 300,"easeOutQuint",function(){
    	stage0GT()
	//});
return;
}
//版i 下 a
function stageiLT(){
	resetAni();
	$("#stage0").hide();
	$("#stagei").hide();
	$("#stagea").show();
	$("#stage1").hide();
	$("#stage2").hide();
	$("#stage3").hide();

	$("#btn0").css("opacity",0);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",1);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",0);	

	
	$("#am1").animate({top:0,opacity:1},300,"easeOutQuint");
	$("#am2").animate({opacity:1,top:140},700,"easeOutQuint",function(){});
	return;
}
//版a 上 i
function stageaGT(){
	resetAni();
	$("#stage0").hide();
	$("#stagei").show();
	$("#stagea").hide();
	$("#stage1").hide();
	$("#stage2").hide();
	$("#stage3").hide();

	$("#btn0").css("opacity",0);
	$("#btni").css("opacity",1);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",0);	
	
	$("#im1").animate({top:0,opacity:1},300,"easeOutQuint");
	$("#im2").animate({opacity:1,top:140},700,"easeOutQuint",function(){});
	return;
}
//版a 下
function stageaLT(){
    resetAni();
	//$("#stage0").stopTime ('a');

	$("#stage0").hide();
	$("#stagei").hide();
	$("#stagea").hide();
	$("#stage1").show();
	$("#stage2").hide();
	$("#stage3").hide();
 
	$("#btn0").css("opacity",0);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",1);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",0);	
	// $("#fm9").animate({"opacity":0},100);
    //$('html,body').animate({scrollTop:$('#stage1').offset().top}, 300,"easeOutQuint",function(){
		$("#sm1").animate({top:0,opacity:1},300,"easeOutQuint")
			$("#sm5").animate({top:180,left:0,opacity:1},300,"easeOutQuint",function(){
				// $("#sm6").animate({opacity:1},100,"easeOutQuint");
				$("#sm4").animate({top:440,opacity:1},200,"easeOutQuint");
				$("#sm7").animate({opacity:1},300,"easeOutQuint",function(){
					$("#stage1").oneTime('430ms',function(){$("#sm7").animate({top:410,},400);});
					$("#stage1").oneTime('430ms',function(){$("#sm4").animate({top:550},400,"easeOutQuint",function(){
						$("#stage1").oneTime('430ms',function(){$("#sm4").hide()});
						$("#sm7").animate({top:410},210,"easeOutQuint",function(){
							$("#sm7").hide()
							$("#sm9").show()
							$("#sm4").stop().animate({opacity:0},310,"easeOutQuint");
							$("#sm9").animate({top:320,opacity:1},310,"easeOutQuint")
							$("#sm8").animate({top:0,opacity:1},210,function(){
							});
						});
					});});
				});
			});
		
	//});
	
return;
}

//版1 上
function stage1GT(){
	resetAni();
	$("#stage0").hide();
	$("#stagei").hide();
	$("#stagea").show();
	$("#stage1").hide();
	$("#stage2").hide();
	$("#stage3").hide();

	$("#btn0").css("opacity",0);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",1);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",0);	
	
	$("#am1").animate({top:0,opacity:1},300,"easeOutQuint");
	$("#am2").animate({opacity:1,top:140},700,"easeOutQuint",function(){});
	return;
}

function stage1GT1(){
	resetAni();
    $("#stage0").show();
 	$("#stagei").hide();
	$("#stagea").hide();
    $("#stage1").show();  
    $("#stage2").hide();
    $("#stage3").hide();

	$("#btn0").css("opacity",1);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",0);	
	
    $("#footer").animate({bottom:-70},400);
    //$('html,body').animate({scrollTop:$('#stage0').offset().top}, 300,"easeOutQuint",function(){
    	stage0GT()
	//});
return;
}

//版1 下
function stage1LT(){
	resetAni();
    $("#stage0").hide();
	$("#stagei").hide();
	$("#stagea").hide();
    $("#stage1").hide();
    $("#stage2").show();
    $("#stage3").hide();

	$("#btn0").css("opacity",0);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",1);
	$("#btn3").css("opacity",0);	
	
	$("#tm1").animate({top:0,opacity:1},300,"easeOutQuint");
	$("#tm7").animate({top:140,opacity:1},300,"easeOutQuint",function(){
		$("#tm4").animate({top:480,opacity:1},100,"easeOutQuint");
		$("#tm5").animate({top:480,opacity:1},100,"easeOutQuint");
		$("#tm6").animate({top:480,opacity:1},100,"easeOutQuint",function(){
			$("#tm8").animate({opacity:1},500,function(){
				$("#tm8").animate({left:350},300);
				$("#tm8").oneTime('50ms',function(){$("#tm6").animate({left:630,opacity:1},100,"easeOutQuint");});
				$("#tm8").oneTime('80ms',function(){$("#tm5").animate({left:535,opacity:1},200,"easeOutQuint");});
				$("#tm8").oneTime('100ms',function(){$("#tm4").animate({left:430,opacity:1},300,"easeOutQuint");});
				
			});
		});
	});
	
return;
}


//版2 上
function stage2GT(){
	resetAni();
	$("#stage0").hide();
	$("#stagei").hide();
	$("#stagea").hide();
	$("#stage1").show();
	$("#stage2").hide();
	$("#stage3").hide(); 

	$("#btn0").css("opacity",0);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",1);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",0);	
	
	 //$('html,body').animate({scrollTop:$('#stage1').offset().top}, 300,"easeOutQuint",function(){
		$("#sm1").animate({top:0,opacity:1},300,"easeOutQuint")
			$("#sm5").animate({top:180,left:0,opacity:1},300,"easeOutQuint",function(){
				$("#sm4").animate({top:440,opacity:1},200,"easeOutQuint");
				$("#sm7").animate({opacity:1},300,"easeOutQuint",function(){
					$("#stage1").oneTime('430ms',function(){$("#sm7").animate({top:410,},400);});
					$("#stage1").oneTime('430ms',function(){$("#sm4").animate({top:550},400,"easeOutQuint",function(){
						$("#stage1").oneTime('430ms',function(){$("#sm4").hide()});
						$("#sm7").animate({top:410},210,"easeOutQuint",function(){
							$("#sm7").hide()
							$("#sm9").show()
							$("#sm4").stop().animate({opacity:0},310,"easeOutQuint");
							$("#sm9").animate({top:320,opacity:1},310,"easeOutQuint")
							$("#sm8").animate({top:0,opacity:1},210,function(){
							});
						});
					});});
				});
			});
		
		
	//});
return;
}

//版2 下
function stage2LT(){
	resetAni();
	$("#stage0").hide();
	$("#stagei").hide();
	$("#stagea").hide();
	$("#stage1").hide();
	$("#stage2").hide();
	$("#stage3").show();

	$("#btn0").css("opacity",0);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",1);	
	
	$("#hm1").animate({top:0,opacity:1},300,"easeOutQuint");
	$("#hm5").animate({opacity:1,top:140},700,"easeOutQuint",function(){});
	return;
}

//版3 上
function stage3GT(){
	resetAni();
	$("#stage0").hide();
	$("#stagei").hide();
	$("#stagea").hide();
	$("#stage1").hide();
	$("#stage2").show();
	$("#stage3").hide();

	$("#btn0").css("opacity",0);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",1);
	$("#btn3").css("opacity",0);	
	
	$("#tm1").animate({top:0,opacity:1},300,"easeOutQuint");
		$("#tm7").animate({top:140,opacity:1},300,"easeOutQuint",function(){
			$("#tm4").animate({top:480,opacity:1},100,"easeOutQuint");
			$("#tm5").animate({top:480,opacity:1},100,"easeOutQuint");
			$("#tm6").animate({top:480,opacity:1},100,"easeOutQuint",function(){
				$("#tm8").animate({opacity:1},200,function(){
					$("#tm8").animate({left:350},300);
					$("#tm8").oneTime('50ms',function(){$("#tm6").animate({left:630,opacity:1},100,"easeOutQuint");});
					$("#tm8").oneTime('80ms',function(){$("#tm5").animate({left:535,opacity:1},200,"easeOutQuint");});
					$("#tm8").oneTime('100ms',function(){$("#tm4").animate({left:430,opacity:1},300,"easeOutQuint");});
					
				});
			});
		});
	
	return;
	
}
//版3 下
function stage3LT () {
	resetAni();
	$("#stage0").hide();
	$("#stagei").hide();
	$("#stagea").hide();
	$("#stage1").hide();
	$("#stage2").hide();
	$("#stage3").show();
	$("#stage4").show();

	$("#btn0").css("opacity",1);
	$("#btni").css("opacity",0);
	$("#btna").css("opacity",0);
	$("#btn1").css("opacity",0);
	$("#btn2").css("opacity",0);
	$("#btn3").css("opacity",0);	

	$("#footer").animate({bottom:-70},400,function(){$("#fm9").show();});
	//$("#stage3").css("opacity",0);
	$("#stage3").oneTime('50ms',function(){$("#stage0").show();$("#stage4").hide();});
	// $("#stage3").oneTime('350ms',function(){console.log(2)});
	// $("#stage3").oneTime('550ms',function(){console.log(3)});
	// $("#stage3").oneTime('750ms',function(){console.log(4)});
	
	
	stage0GT();
	

return;
}

//重设动画初始状态
function  resetAni(){
	$("#fm1").css({"top":100,"left":280,"opacity":0});
	$("#fm2").css({"top":150,"left":230,"opacity":0});
	$("#fm3").css({"top":100,"left":260,"opacity":0});
	$("#fm4").css({"top":130,"opacity":0,"backgroundSize":180});
	//$("#fm5").css({"top":30,"opacity":0,"backgroundSize":110});
	$("#fm6").css({"top":380,"opacity":0});
	$("#fm7").css({"top":480,"opacity":0});
	$("#fm8").css({"top":585,"opacity":0});

	$("#sm1").css({"top":-60,"left":80,"opacity":0});
	$("#sm2").css({"top":20,"left":340,"opacity":0});
	$("#sm3").css({"top":80,"left":340,"opacity":0});
	$("#sm4").css({"top":440,"left":0,"opacity":0,"display":"block"});
	$("#sm5").css({"top":220,"left":0,"opacity":0});
	$("#sm6").css({"top":277,"left":0,"opacity":0});
	$("#sm7").css({"top":320,"left":0,"opacity":0,"display":"block"});
	$("#sm8").css({"top":100,"left":0,"opacity":0});
	$("#sm9").css({"top":370,"left":0,"opacity":1,"display":"none"});

	$("#tm1").css({"top":-60,"left":80,"opacity":0});
	$("#tm2").css({"top":20,"left":340,"opacity":0});
	$("#tm3").css({"top":80,"left":340,"opacity":0});
	$("#tm4").css({"top":520,"left":310,"opacity":0});
	$("#tm5").css({"top":520,"left":460,"opacity":0});
	$("#tm6").css({"top":527,"left":610,"opacity":0});
	$("#tm7").css({"top":180,"left":0,"opacity":0});
	$("#tm8").css({"top":550,"left":210,"opacity":0});

	$("#hm1").css({"top":-60,"left":80,"opacity":0});
	$("#hm2").css({"top":20,"left":340,"opacity":0});
	$("#hm3").css({"top":80,"left":340,"opacity":0});
	$("#hm5").css({"top":180,"left":0,"opacity":0});

	$("#im1").css({"top":-60,"left":80,"opacity":0});
	$("#im5").css({"top":180,"left":0,"opacity":0});

	$("#am1").css({"top":-60,"left":80,"opacity":0});
	$("#am5").css({"top":180,"left":0,"opacity":0});
}

/**
 * 横屏自适应
 **/
function orient() {
    if (window.orientation == 0 || window.orientation == 180){
    	//initStage();
    	window.location.reload();
		orientation = 'portrait';
        return false;
    }else if(window.orientation == 90 || window.orientation == -90){
    	//initStage();
    	window.location.reload();
        orientation = 'landscape';
        return false;
    };
};
