var App = {};
App.global = { //全局变量以及工具函数定义
	browser:function() { //获取浏览器版本信息
		var u = navigator.userAgent.toLowerCase();
		var app = navigator.appVersion.toLowerCase();
		return {
			txt: u, // 浏览器版本信息
			version: (u.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1], // 版本号       
			msie: /msie/.test(u) && !/opera/.test(u), // IE内核
			mozilla: /mozilla/.test(u) && !/(compatible|webkit)/.test(u), // 火狐浏览器
			safari: /safari/.test(u) && !/chrome/.test(u), //是否为safair
			chrome: /chrome/.test(u), //是否为chrome
			opera: /opera/.test(u), //是否为oprea
			uc: /ucbrowser/.test(u), //是否为uc
			presto: u.indexOf('presto/') > -1, //opera内核
			webKit: u.indexOf('applewebkit/') > -1, //苹果、谷歌内核
			gecko: u.indexOf('gecko/') > -1 && u.indexOf('khtml') == -1, //火狐内核
			mobile: !!u.match(/applewebkit.*mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), //ios终端
			android: u.indexOf('android') > -1, //android终端
			iPhone: u.indexOf('iphone') > -1, //是否为iPhone
			iPad: u.indexOf('ipad') > -1, //是否iPad
			webApp: !!u.match(/applewebkit.*mobile.*/) && u.indexOf('safari/') == -1 //是否web应该程序，没有头部与底部
		};
	},
	isMobile:function() { //判断是否是移动设备
		var b = App.global.browser();
		if (b.mobile || b.ios || b.android || b.iPhone || b.iPad) {
			return true;
		}
		return false;
	},
	isAndroid:function(){
		var b = App.global.browser();
		if (b.android) {
			return true;
		}
		return false;
	}
};
$(document).ready(function() {
	var clientHeight = $(window).height();
	var clientWidth = $(window).width();
	var picWidth = parseInt(clientWidth * 0.8);
	var picHeight = (picWidth / 590) * 740;
	var left = parseInt((68 / 590) * picWidth);
	var top = parseInt((253 / 740) * picHeight);
	var bottom = parseInt((477 / 740) * picHeight);
	var itemHeight = bottom - top;
	var curIndex = 1;
	$(".section6-phone").find(".phone-con1").find("img").height(itemHeight);
	$(".section6-phone").find(".phone-con1").attr("data-width", (picWidth - left - left)).css({
		width: (picWidth - left - left) + "px",
		right: left + "px",
		top: top + "px",
		height: itemHeight + "px"
	});
	$(".section6-phone").find(".phone-con2").attr("data-width", (picWidth - left - left)).css({
		width: (picWidth - left - left) + "px",
		right: left + "px",
		top: top + "px",
		height: (itemHeight + 150) + "px"
	});
	$("#content").fullpage({
		slidesColor: ['#ffef54', '#fff', '#fff', '#fff'],
		anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],
		navigation: true,
		continuousVertical: true,
		loopBottom: true,
		scrollingSpeed: 10,
		onLeave: function(index, direction) {

			if (index == 2) {
				var phoneCon = $(".section2-phone").find(".phone-con");
				phoneCon.find(".phone-hand").show();
				$(".phone-con-key").hide();
			}
			if (index == 3) {
				var phoneCon1 = $(".section6-phone").find(".phone-con1");
				var phoneCon2 = $(".section6-phone").find(".phone-con2");
				var width = (parseInt(phoneCon1.attr("data-width")) + 80);
				phoneCon1.attr("data-width", width);
				phoneCon1.animate({
					width: width + "px"
				});
				phoneCon2.attr("data-width", width);
				phoneCon2.animate({
					width: width + "px"
				});
			}
			$(".section2-title:eq(" + (index - 2) + ")").animate({
				"margin-top": "-80px"
			});
			if (index == 2) {

				$(".section2-phone").animate({
					"margin-top": "160px"
				});
			}
			if (index == 3) {
				$(".section6-phone").animate({
					"margin-top": "160px"
				});
			}
			if (index == 4) {
				$(".section3-phone").animate({
					"margin-top": "160px"
				});
			}
			if (index == 5) {
				$(".section4-phone").animate({
					"margin-top": "160px"
				});
			}
//			if (index == 6) {
//				$(".section5-phone").animate({
//					"margin-top": "160px"
//				});
//			}


		},
		afterLoad: function(anchorLink, index) {
			curIndex = index;
			$(".section2-title:eq(" + (index - 2) + ")").animate({
				"margin-top": "0px"
			});

			console.log(index);
			//						$(".section:eq("+index+")").slideDown();
			if (index == 1) {
				$(".section").find(".section1-logo").slideDown();
			}
			if (index == 2) {
				var phoneCon = $(".section2-phone").find(".phone-con");
				$(".section2-phone").animate({
					"margin-top": "0px"
				});
				setTimeout(function() {
					phoneCon.animate({
						top: "34%"
					}, function() {
						phoneCon.animate({
							top: "16%"
						}, function() {
							phoneCon.find(".phone-hand").hide();
							$(".phone-con-key").show();
						});
					});
				}, 600);
			}

			if (index == 3) {
				var phoneCon1 = $(".section6-phone").find(".phone-con1");
				var phoneCon2 = $(".section6-phone").find(".phone-con2");
				var width = phoneCon1.attr("data-width") - 80;
				$(".section6-phone").animate({
					"margin-top": "0px"
				});
				setTimeout(function() {
					phoneCon1.attr("data-width", width);
					phoneCon1.animate({
						width: width + "px"
					});
					phoneCon2.attr("data-width", width);
					phoneCon2.animate({
						width: width + "px"
					});
				}, 600);

			}
			if (index == 4) {
				$(".section3-phone").animate({
					"margin-top": "0px"
				});
			}
			if (index == 5) {
				$(".section4-phone").animate({
					"margin-top": "0px"
				});
			}
//			if (index == 6) {
//				$(".section5-phone").animate({
//					"margin-top": "0px"
//				});
//			}
		}
	});

	function listener(flag) {

		if (flag == "remove") {
			$(".section").find(".add").hide();
			$(".section").find(".remove").show();
		} else {

			$(".section").find(".remove").hide();
			$(".section").find(".add").show();
			$("#content").moveTo(curIndex);
		}
	}

	function orientationChange() {
		switch (window.orientation) {
			//竖屏模式 
			case 0:
			case 180:
				listener('add');
				break;
				//横屏模式 
			case -90:
			case 90:
				listener('remove');
				break;
		}
	}
	listener('add');
	$(window).on("onorientationchange" in window ? "orientationchange" : "resize", orientationChange);
	//以横屏模式进入界面，提示只支持竖屏 
	if (window.orientation == 90 || window.orientation == -90) {
		listener('remove');
	}
});