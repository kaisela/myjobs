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
	}
};
App.localstorage = { //html5本地存储
	setValue: function(key, value) { //存储数据
		if (value != undefined) {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			if (localStorage.getItem(key)) {
				return JSON.parse(localStorage.getItem(key));
			} else {
				return null;
			}
		}
	},
	getValue: function(key) { //根据关键字得到数据
		if (localStorage.getItem(key)) {
			return JSON.parse(localStorage.getItem(key));
		} else {
			return null;
		}
	}
};