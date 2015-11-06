function uploadImgs(serverId) {
	//
}

function getXY(e) {
	var touch = null;
	var cur = {};
	if (e.touches || e.targetTouches || e.originalEvent.touches) {
		var touches = e.touches || e.targetTouches || e.originalEvent.touches;
		touch = touches[0];
		cur.x = touch.pageX;
		cur.y = touch.pageY;
	} else {
		cur.x = e.pageX;
		cur.y = e.pageY;
	}
	return cur;
}
$(function() {


});
/*
 * 注意：
 * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
 * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
 * 3. 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
 *
 * 如有问题请通过以下渠道反馈：
 * 邮箱地址：weixin-open@qq.com
 * 邮件主题：【微信JS-SDK反馈】具体问题
 * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
 */
wx.ready(function() {
	var touchstart = "ontouchstart" in document ? "touchstart" : "mousedown";
	var touchend = "ontouchend" in document ? "touchend" : "click";
	var touchmove = "ontouchmove" in document ? "touchmove" : "mousemove";

	var delPosition = {};
	var playPosition = {};
	delPosition.X = $(".icon-check").position().left;
	delPosition.X2 = $(".icon-check").position().left + $(".icon-check").width();
	playPosition.X = $(".icon-notification").position().left;
	playPosition.X2 = $(".icon-notification").position().left + $(".icon-notification").width();


	// 1 判断当前版本是否支持指定 JS 接口，支持批量判断

	//  wx.checkJsApi({
	//    jsApiList: [
	//      'getNetworkType',
	//      'previewImage'
	//    ],
	//    success: function (res) {
	//      alert(JSON.stringify(res));
	//    }
	//  });
	// 5 图片接口
	// 5.1 拍照、本地选图
	var images = {
		localId: [],
		serverId: []
	};
	document.querySelector('#chooseImage').onclick = function() {
		wx.chooseImage({
			success: function(res) {
				if (res.localIds.length == 1) {
					images.localId = res.localIds;
					if (images.localId.length == 0) {
						alert('请先使用 chooseImage 接口选择图片');
						return;
					}
					$('#chooseImage').attr("src", images.localId[0]);
					var i = 0,
						length = images.localId.length;
					images.serverId = [];

					function upload() {
						wx.uploadImage({
							localId: images.localId[i],
							success: function(res) {
								i++;
								alert('已上传：' + i + '/' + length);
								images.serverId.push(res.serverId);
								uploadImgs(res.serverId);
								if (i < length) {
									upload();
								}
							},
							fail: function(res) {
								alert(JSON.stringify(res));
							}
						});
					}
					upload();
				} else {
					alert("只能选择一张图片哦~~~");
				}

			}
		});
	};
	// 3 智能接口
	var voice = {
		localId: '',
		serverId: ''
	};
	$(".icon-voice").on(touchstart, function(e) {
		e.stopPropagation();
		if ($(this).parent().hasClass('single')) {
			
			$(this).parent().removeClass("single");
			$("#record .tip").html("点下开始录音");
			wx.stopRecord({
				success: function(res) {
					voice.localId = res.localId;
					
				},
				fail: function(res) {
					alert(JSON.stringify(res));
				}
			});
		} else {
			$(this).parent().addClass("single");
			$("#record .tip").html("点下录音停止");
			wx.startRecord({
				cancel: function() {
					alert('用户拒绝授权录音');
				}
			});
		}



	});
	//	$(".icon-voice").on(touchend, function() {
	//		$(this).parent().removeClass("single");
	//		$("#record .tip").html("按住开始录音");
	//		wx.stopRecord({
	//			success: function(res) {
	//				voice.localId = res.localId;
	//				if (voice.localId == '') {
	//					alert('请先使用 startRecord 接口录制一段声音');
	//					return;
	//				}
	//				wx.uploadVoice({
	//					localId: voice.localId,
	//					success: function(res) {
	//						alert('上传语音成功，serverId 为' + res.serverId);
	//						voice.serverId = res.serverId;
	//					}
	//				});
	//			},
	//			fail: function(res) {
	//				alert(JSON.stringify(res));
	//			}
	//		});
	//	});

	//	$(".record-div").on(touchmove, function(e) {
	//			e.stopPropagation();
	//			var cur = getXY(e);
	//			if (cur.x > delPosition.X && cur.x < delPosition.X2) {
	//				console.log(cur.x);
	//				$(".icon-delete").addClass("icon-touch").removeClass("icon-side");
	//			} else {
	//				$(".icon-delete").removeClass("icon-touch").addClass("icon-side");
	//			}
	//			
	//			if (cur.x > playPosition.X && cur.x < playPosition.X2) {
	//				$(".icon-notification").addClass("icon-touch").removeClass("icon-side");
	//			} else {
	//				$(".icon-notification").removeClass("icon-touch").addClass("icon-side");
	//			}
	//	
	//		});
//	$(".record-div").on(touchend, function(e) {
//		e.stopPropagation();
//		var cur = getXY(e);
//		if (cur.x > delPosition.X && cur.x < delPosition.X2) {
//			if (confirm('上传还是放弃？')){
//				if (voice.localId == '') {
//						alert('请先使用 startRecord 接口录制一段声音');
//						return;
//					}
//					wx.uploadVoice({
//						localId: voice.localId,
//						success: function(res) {
//							alert('上传语音成功，serverId 为' + res.serverId);
//							voice.serverId = res.serverId;
//						}
//					});
//			}else{
//				voice.localId = '';
//			}
////			wx.stopRecord({
////				success: function(res) {
////					voice.localId = '';
////				},
////				fail: function(res) {
////					alert(JSON.stringify(res));
////				}
////			});
//		}
//		if (cur.x > playPosition.X && cur.x < playPosition.X2) {
//			if (voice.localId == '') {
//				alert('请先使用 startRecord 接口录制一段声音');
//				return;
//			}
//			alert("开始播放");
//			wx.playVoice({
//				localId: voice.localId
//			});
//		}
//		//		$(".icon-delete").removeClass("icon-touch").addClass("icon-side");
//		//		$(".icon-notification").removeClass("icon-touch").addClass("icon-side");
//
//	});

	//	// 4.4 监听录音自动停止
		wx.onVoiceRecordEnd({
			complete: function(res) {
				voice.localId = res.localId;
				if (confirm('录音时间已超过一分钟,录音有效吗？')) {
					wx.uploadVoice({
						localId: voice.localId,
						success: function(res) {
							alert('上传语音成功，serverId 为' + res.serverId);
							voice.serverId = res.serverId;
						}
					});
				} else {
					voice.localId = '';
				}
	
				$(".icon-voice").parent().removeClass("single");
			}
		});
	// 8.7 关闭当前窗口
	document.querySelector('#closeWindow').onclick = function() {
		wx.closeWindow();
	};


});

wx.error(function(res) {
	alert(res.errMsg);
});