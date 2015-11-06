(function ($) {
    var helper = {
        getPageNum: function (totalCount, pagSize) {
            return Math.ceil(totalCount / pagSize);
        },


    };
    var methods = {
        init: function (totalCount, options) {
            // 在每个元素上执行方法
            return this.each(function () {
                var $this = $(this);

                var href = window.location.href;
                var url = href.indexOf("?") == -1 ? href : href.slice(0, window.location.href.indexOf('?'));
                var params = $.getUrlParams();
                var settings = $this.data("pager");
                if (typeof settings === "undefined") {
                    var defaults = {
                        callback: function () {
                            alert("请传入分页callback函数");
                        },
                        ajax: true,
                        //2015/04/01
                        getparams: function () {
                            return {};
                        },
                        pagesize: 30,
                        showpage: 6,
                        startIndex: 1,
                        ellipse_text: "…"
                    };
                    settings = $.extend({}, defaults, options);
                    $this.data("pager", settings);
                } else {
                    settings = $.extend({}, settings, options);
                    $this.data("pager", settings);
                }
                var currentIndex = settings.startIndex < 1 ? 1 : settings.startIndex;
                //正式开始逻辑代码
                if (!settings.ajax) {
                    var defaultIndexStr = params[settings.pageParam];
                    var defaultIndex = 1;
                    if (defaultIndexStr && !isNaN(defaultIndexStr)) {
                        defaultIndex = parseInt(defaultIndexStr) < 1 ? 1 : parseInt(defaultIndexStr);
                    }
                    currentIndex = defaultIndex;
                }
                var getRegion = function () {
                    var half = Math.ceil(settings.showpage / 2);
                    var num = helper.getPageNum(totalCount, settings.pagesize);
                    var limit = num - settings.showpage;
                    var start = currentIndex > half ? Math.max(Math.min(currentIndex - half, limit), 0) : 0;
                    var end = currentIndex > half ? Math.min(currentIndex + half, num) : Math.min(settings.showpage, num);
                    return [start + 1, end];
                }

                var pageNum = helper.getPageNum(totalCount, settings.pagesize);
                var createPage = function () {
                    $this.empty();
                    var indexChange = function (index) {
                        if (settings.ajax) {
                            return function (event) { return pageSelected(index, event); }
                        }
                        return true;
                    }
                    var interval = getRegion();
                    var paint = function (index, opts) {
                        index = index < 1 ? 1 : (index < pageNum ? index : pageNum);
                        //合并
                        opts = $.extend({ text: index, classes: "" }, opts || {});
                        var link = null;
                        if (index == currentIndex) {
                            link = $("<span class='current'>" + (opts.text) + "</span>");
                        }
                        else {
                            if (settings.ajax) {
                                link = $("<a>" + (opts.text) + "</a>")
                                    .bind("click", indexChange(index))
                                    .attr('href', "javascript:void(0)");
                            } else {
                                if (params && params.hasOwnProperty(settings.pageParam)) {
                                    params[settings.pageParam] = index + 1;
                                }

                                link = $("<a>" + (opts.text) + "</a>")
                                   .bind("click", indexChange(index))
                                   .attr('href', url + "?" + (params ? $.param(params) : (settings.pageParam + "=" + (index + 1))));
                            }


                        }
                        if (opts.classes) { link.addClass(opts.classes); }
                        $this.append(link);
                    }
                    paint(currentIndex - 1, { text: "上一页", classes: "prev" });
                    interval[0] = interval[0] == 0 ? 1 : interval[0];
                    for (var i = interval[0]; i <= interval[1]; i++) {
                        paint(i);
                    }
                    paint(currentIndex + 1, { text: "下一页", classes: "next" });
                }
                var builderCount = function (paramNum, paramCount) {
                    $this.append("<span>共<label style='color:orange;padding:0 3px;font-size:16px'>" + paramNum + "</label>页,<label style='color:orange;padding:0 3px;font-size:16px'>" + paramCount + "</label>条</span>");

                }
                //2015/04/01
                var callbackParams = {};
                if (settings.getparams && settings.getparams()) {
                    callbackParams = settings.getparams();
                }
                var pageSelected = function (index, event) {
                    currentIndex = index;
                    createPage(index);
                    builderCount(pageNum, totalCount);
                    //2015/04/01
                    settings.callback(index, callbackParams);
                }
                createPage();
                builderCount(pageNum, totalCount);
                settings.callback(currentIndex, callbackParams);
                if ( totalCount == 0) {
                    $this.hide();
                } else {
                    $this.show();
                }
            });
        },
        destroy: function (options) {
            // 在每个元素中执行代码
            return $(this).each(function () {
                var $this = $(this);
                // 执行代码
                // 删除元素对应的数据
                $this.removeData("pager");
            });
        }
    };
    $.fn.Pager = function () {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method === "object" || !method) {
            method = methods.init;
        } else {
            $.error("Method" + method + "does not exist on jQuery.pager");
            return this;
        }

        return method.apply(this, arguments);
    };
})(jQuery);
