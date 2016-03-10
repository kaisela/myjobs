// plugin definition  
define(["jquery", "iscroll", "imgload"], function($, IScroll) {
	$.fn.Loading = function(options) {
		// iterate and reformat each matched element 
		var defaults = {
			url: null, //列表的链接地址
			ajaxOps: { //链接请求的ajax配置
				type: "get",
				data: {},
				dataType: "json",
				async: true
			},
			callback: function() {}, //请求完成之后的回调函数，可在此函数中追加列表
			curAjaxId: null, //tab页面切换时，保证当前容器在同一时间内，只存在一个请求
			loadType: "load", //默认滚动到底部自动加载，值有："uplaod"下拉加载，"download"上拉加载
			isShowEmpty: true, //没有列表记录时，是否显示空记录页面。为false时，没有数据记录则显示没有更多
			offsetHeight: 0 //页面高度减去此参数，就是列表容器的高度
		};
		var loadAjax = null;
		var ops = $.extend(defaults, options);
		var defer = $.Deferred();
		var oldDef = null;
		return this.each(function() {
			var me = $(this);
			var winHeight = me.height();
			var appendBody = me;
			var scrollDiv = me.children().first();
			var flag = true;
			var ajaxQueue = [];
			var loading = false;
			var _scroll = null;
			var _this = this;
			var startY = -40;
			var loadHtmlType = ops.loadType;
			function init() {
				me.height($(window).height() - ops.offsetHeight);
				if (_scroll == null) {
					if (!(ops.loadType == "upload")) {
						startY = 0;
					}
					_scroll = new IScroll("#" + me.attr("id"), {
						scrollbars: true,
						mouseWheel: true,
						interactiveScrollbars: true,
						shrinkScrollbars: 'scale',
						fadeScrollbars: true,
						probeType: 3,
						startY: startY
					});
					_scroll.on('scrollStart', function() {
						if(ops.loadType == "upload"){
							loadHtmlType = "load-start";
							changeLoad();
						}
						
					});
					_scroll.on('scrollEnd', function() {
						docuHeight = scrollDiv.height();
						winHeight = me.height();
						if (docuHeight + this.y <= winHeight + 55 && ops.loadType == "load") {
							request();
						}
						if (this.y == 0 && ops.loadType == "upload") {
							request();
						}
					});
					_scroll.on('refresh', function() {
						docuHeight = scrollDiv.height();
						winHeight = me.height();
						if (docuHeight <= winHeight && ops.loadType == "upload") {
							me.find(".load").remove();
						}else if(ops.loadType == "upload"){
							_scroll.scrollTo(0,startY,200);
							loadHtmlType = "upload";
							changeLoad();
						}
					});
				}
				me.css("overflow", "hidden");
				$.when(load(true, defer)).done(function(data, isInit) {
					oldDef = defer;
				});
				insertLoad();
			}
			init();

			function _refreshScroll() {
				if (_scroll) {
					_scroll.refresh();
				}
			}

			function scrollToElement(el, time, offsetX, offsetY, easing) {
				if (_scroll) {
					_scroll.scrollToElement(el, time, offsetX, offsetY, easing);
				}
			}

			function request() {

				if (flag) {
					loading = true;
					loadHtmlType = "load";
					changeLoad();
					var defer1 = $.Deferred();
					if (oldDef && oldDef.state() == "resolved") {
						oldDef = defer1;
						console.log(93);
						$.when(load(false, defer1)).done(function(data, isInit) {
							oldDef = defer1;
						});
					}

				}
			}

			function _getloadHtml() {
				var loadHtml = [];
				switch (loadHtmlType) {
					case "load":
						loadHtml.push('<div class="loading">');
						loadHtml.push('<img class="lodImg" src="../img/load.gif" />');
						loadHtml.push('<p>加载中</p>');
						loadHtml.push('</div>');
						break;
					case "upload":
						loadHtml.push('<p class="center">下拉加载更多</p>');
						break;
					case "download":
						loadHtml.push('<p class="center">上拉加载更多</p>');
						break;
					case "load-start":
						loadHtml.push('<p class="center">释放加载</p>');
						break;
					case "no-more":
						loadHtml.push('<p class="center">没有更多了</p>');
						break;
				}
				return loadHtml.join("");
			}

			function insertLoad() {
				var loadDiv = changeLoad();
				switch (loadHtmlType) {
					case "upload":
						scrollDiv.prepend(loadDiv);
						break;
					case "load":
					case "download":
						scrollDiv.append(loadDiv);
						break;
				}
			}

			function changeLoad() {
				var loadHtml = me.find(".load").get(0);
				if (typeof loadHtml != "undefined") {
					loadHtml = me.find(".load");
				} else {
					loadHtml = $("<div class='load'></div>");
				}
				loadHtml.html(_getloadHtml());
				return loadHtml;
			}

			function loadSuccess(data, isInit) {

				var ajaxOps = ops.ajaxOps;
				if (ajaxOps.dataType == "json") {
					if (data.end == "true" || data.end == true || data.End == "true" || data.End) {
						flag = false;
					}
				}

				function imgload() {
					if (!flag) {
						loadHtmlType = "no-more";
						changeLoad();
					}
					if (ajaxOps.dataType == "json" && !flag && (data.data == null || data.data.length == 0) && isInit && ops.isShowEmpty) {

					}
					_refreshScroll();
				}
				if (typeof ops.callback == "function") {
					ops.callback(data, isInit);

					if (me.find("img").length > 0) {
						me.find("img").imgLoad({
							callback: function() {
								imgload();
							}
						});
					} else {
						imgload();
					}

				}
			}

			function load(isInit, dtd) {
				var ajaxOps = ops.ajaxOps;
				if (isInit) {
					ajaxOps.data.pageIndex = 1;
				} else {
					ajaxOps.data.pageIndex = (ajaxOps.data.pageIndex + 1);
				}
				if (ops.curAjaxId && window[ops.curAjaxId] && isInit) {

					window[ops.curAjaxId].abort();
					ajaxOps.data.pageIndex = 1;
				}

				window[ops.curAjaxId] = $.ajax({
					type: ajaxOps.type,
					url: ops.url,
					async: ajaxOps.async,
					data: ajaxOps.data,
					dataType: ajaxOps.dataType,
					loadDiv: appendBody,
					success: function(data) {
						loadSuccess(data, isInit);
						dtd.resolve(data, isInit);
					},
					error: function(data, status, e) {}
				});

				return dtd.promise();
			}

			function setParam(obj) {
				flag = !(obj.end);
				ops.ajaxOps.data = $.extend(ops.ajaxOps.data, obj);
				if (obj.pageIndex == 1) {
					appendBody.find(".load").remove();
					appendBody.append(_getloadHtml());
					_refreshScroll();
				}
				console.log("214")
				$.when(load(true, defer)).done(function(data, isInit) {
					oldDef = defer;
				})
			}

			function reSetHeight(height) {
				me.height(height);
			}

			function reLoading() {
				//load(true);
			}
			me[0].t = {
				setParam: function(values) {
					setParam(values);
				},
				reLoading: function() {
					reLoading();
				},
				refresh: function() {
					_refreshScroll();
				},
				scrollToElement: function(el, time, offsetX, offsetY, easing) {
					scrollToElement(el, time, offsetX, offsetY, easing);
				},
				reSetHeight: function(height) {
					reSetHeight(height);
				}
			};

		});
		return $this;
	};
	//重新设置ajax请求参数，包括url等
	$.fn.setParam = function(values) {
		if (this[0] && this[0].t) {
			return this[0].t.setParam(values);
		}
		return null;
	};
	//刷新scroll列表，内容有变的情况下，需要刷新列表，具体看参详iscroll
	$.fn.refresh = function() {
		if (this[0] && this[0].t) {
			return this[0].t.refresh();
		}
		return null;
	};
	//重新设置列表外围容器的高度
	$.fn.reSetHeight = function(height) {
		if (this[0] && this[0].t) {
			return this[0].t.reSetHeight(height);
		}
		return null;
	};
	//滚动到列表内，某个元素内,具体参详is
	$.fn.scrollToElement = function(el, time, offsetX, offsetY, easing) {
		if (this[0] && this[0].t) {
			return this[0].t.scrollToElement(el, time, offsetX, offsetY, easing);
		}
		return null;
	}

});