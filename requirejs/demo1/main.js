require.config({
	paths: {
		jquery: 'jquery-1.10.2',
		a:"audio"
	},
	baseUrl: 'js'
});

require(['jquery', "a"], function($, audio) {
	//audio使用:
	$("input").unbind("click").bind("click", function() {
		//gid 表示歌曲id,只是一个表示，没有值不影响播放
		//song_fileUrl :播放歌曲地址，不能为空，有效地址
		// g_audio.elems["id"] = gid;
		var src = $(this).attr("data-src");
		var index = $(this).index();
		var element = {};
		element.id = $(this).index();
		element.flag = true;
		element.callBack = function() {
		};
		audio.g_audio.push({
			song_fileUrl: src,
			elem: element
		});				  
	}); //绑定事件
	var index = 0;
	window.setInterval(function(){
		index = index % 4;
		$("img").hide();
		$("img:eq("+index+")").show();
		index ++;
	},200);
	
});