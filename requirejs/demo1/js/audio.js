define(function() {
	var g_audio = window.g_audio = new Audio(); //创建一个audio播放器
	var g_event = window.g_event = new function() {
		var events = ['load', 'abort', 'canplay', 'canplaythrough',
			'durationchange', 'emptied', 'ended', 'error',
			'loadeddata', 'loadedmetadata', 'loadstart',
			'pause', 'play', 'playing', 'progress',
			'ratechange', 'seeked', 'seeking', 'stalled',
			'suspend', 'timeupdate', 'volumechange', 'waiting', 'mediachange'
		];
		g_audio.loop = false;
		g_audio.autoplay = true;
		g_audio.isLoadedmetadata = false;
		g_audio.touchstart = false;
		g_audio.audio = true;
		g_audio.elems = [];
		g_audio.flag = true;
		g_audio.curSrc = "";
		g_audio.curPlaySrc = "";
		g_audio.curIndex = 0;
		g_audio.isSupportAudio = function(type) {
			type = type || "audio/mpeg";
			try {
				var r = g_audio.canPlayType(type);
				return g_audio.canPlayType && (r == "maybe" || r == "probably")
			} catch (e) {
				return false;
			}
		};

		function plays(srcs, i, elem) {
			var flag = false;
			for (var k = 0; k < g_audio.elems.length; k++) {
				var item = g_audio.elems[k];
				if (elem.id == item.id) {
					flag = g_audio.elems[k].flag;
				}
			}
			if (flag) {
				if (i < srcs.length) {
					(function(j, srcArray, element) {
						if (g_audio.previousSrc !== g_audio.curSrc || g_audio.flag) {
							//g_audio.curIndex = 0;
							if (g_audio.curPlaySrc != srcArray[j]) {
								g_audio.src = srcArray[j];
								g_audio.previousTime = 0.00;
								g_audio.isLoadedmetadata = false;
								g_audio.autobuffer = true;
								g_audio.currentTime = 0;
								g_audio.load();
								g_audio.curPlaySrc = srcArray[j];
								g_audio.curIndex = j;
							}
							g_audio.flag = false;
							g_audio.play();
							g_audio.addEventListener('ended', function() {
								g_audio.flag = true;
								j++;
								plays(srcArray, j, element)
							}, false);
						} else {
							g_audio.flag = true;
							g_audio.pause();
						}
					})(i, srcs, elem);
				} else {
					(function(element) {
						element.callBack(element.el);
					})(elem);
					// g_audio.src = null;
					g_audio.flag = true;

					return;
				}
			} else {
				return;
			}

		}
		g_audio.push = function(meta) {
			g_audio.previousId = g_audio.id;
			g_audio.id = meta.song_id;
			g_audio.previousSrc = g_audio.curSrc;
			g_audio.curSrc = meta.song_fileUrl;
			var elem = meta.elem;
			var flag = true;
			for (var i = 0; i < g_audio.elems.length; i++) {
				var item = g_audio.elems[i];
				if (elem.id == item.id) {
					flag = false;
					g_audio.elems[i].flag = true;
				} else {
					g_audio.elems[i].flag = false;
				}

			}
			if (flag) {
				g_audio.elems.push(meta.elem);
			}
			var srcs = g_audio.curSrc.split(",");
			if (srcs[srcs.length - 1] == "") {
				srcs.pop();
			}
			if (g_audio.previousSrc !== g_audio.curSrc) {
				g_audio.curIndex = 0;
			}
			plays(srcs, g_audio.curIndex, meta.elem);

		};

		for (var i = 0, l = events.length; i < l; i++) {
			(function(e) {
				var fs = [];
				this[e] = function(fn) {
					if (typeof fn !== 'function') {
						for (var k = 0; k < fs.length; k++) {
							fs[k].apply(g_audio);
						}
						return;
					}
					fs.push(fn);
					g_audio.addEventListener(e, function() {
						fn.apply(this);
					});
				};
			}).apply(this, [events[i]]);
		}

		this.ended(function() { //播放结束
		});

		this.load(function() { //加载
			//this.pause();
			//this.play();
		});

		this.loadeddata(function() {
			//this.pause();
			//this.play();
		});

		this.loadedmetadata(function() {
			this.isLoadedmetadata = true;
		});
		this.error(function() { //请求资源时遇到错误

		});
		this.pause(function() { //歌曲暂停播放
			g_audio.flag = true;
		});
		this.play(function() { //歌曲播放
			g_audio.flag = false;
		});
	};
	return {
		g_audio:g_audio,
		g_event:g_event
	}
});