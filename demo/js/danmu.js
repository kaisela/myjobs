(function($){
	var data = [{
		name: "[10-29回访]花**酱",
		text: "大大的表扬一下老板的售后服务，十分给力。"
	}, {
		name: "[10-29评价]陈先生",
		text: "赠品也收到了！"
	}, {
		name: "[10-29回访]H**y",
		text: "大大的表扬一下老板的售后服务，很给力。大大的表扬一下老板的售后服务，很给力。赠品也收到了收到了收到了，重要的事情说三遍。"
	}, {
		name: "[10-29回访]花**酱1",
		text: "大大的表扬一下老板的售后服务，十分给力。"
	}, {
		name: "[10-29评价]陈先生1",
		text: "赠品也收到了！"
	}, {
		name: "[10-29回访]H**y	1",
		text: "大大的表扬一下老板的售后服务，很给力。大大的表扬一下老板的售后服务，很给力。赠品也收到了收到了收到了，重要的事情说三遍。"
	}]
	var flag = true;
	var index = 3;
	var moveCount = 0;

	function setTop(item) {
		var html = [];
		html.push('<li>');
		html.push('<p class="name">', item.name, '</p>');
		html.push('<p class="text">', item.text, '</p>');
		html.push('</li>');
		$("#danmuList").append(html.join(''));
		var last = $("#danmuList li").last();
		var per = last.prev();
		if (per.get(0)) {
			var perTop = parseFloat(per.css("top"));
			var perHeight = per.height();
			last.css({
				"top": (perTop + perHeight + 30) + "px"
			});
		} else {
			last.css({
				"top": "150px"
			});
		}
	}

	function init() {
		for (var i = 0; i < 3; i++) {
			var item = data[i];
			setTop(item);
		}
	}

	function moveFun() {
		$("#danmuList li").each(function() {
			var oldTop = parseFloat($(this).css("top"));
			$(this).css({
				"top": oldTop - 1
			});
		});
		moveCount++;
		var firstHeight = ($("#danmuList li").first().height() + 30);
		if (moveCount >= firstHeight) {
			var item = data[index];
			$("#danmuList li").first().fadeOut(function() {
				$(this).remove();
			});
			if (index >= data.length - 1) {
				index = 0;
			} else {
				index++;
			}
			setTop(item);
			moveCount = 0;
		}
	}
	init();
	var danmuTimer = window.setInterval(function() {
		moveFun();
	}, 20);
	$(".danmu .switch-div").on("click", function() {
		var flag = $(this).attr("flag");
		if (flag == "0") {
			$("#danmuList").hide();
			window.clearInterval(danmuTimer);
			$(this).attr("flag", "1");
			$(this).find(".close-line").show();
		} else {
			$("#danmuList").show();
			danmuTimer = window.setInterval(function() {
				moveFun();
			}, 20);
			$(this).attr("flag", "0");
			$(this).find(".close-line").hide();
		}
	});
})(jQuery);
