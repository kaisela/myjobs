var Slider = (function ($) {
    function Slider(opts) {
        this.warp = opts.dom;
        this.list = opts.list;
        this.curNum = opts.current;
        this.index = opts.current;
        this.callBack = opts.callBack;
        //				构造三部曲
        this.init();
        this.index = opts.current;
        this.renderDOM();
        this.bindDOM();
    }
    Slider.prototype.init = function () {
        //				算出窗口的长宽比
        this.radio = window.innerHeight / window.innerWidth;
        this.scaleW = window.innerWidth;
        //				当前图片索引
        //this.index = 0;
    }

    Slider.prototype.renderDOM = function () {
        //		var clientW = $(window).width();
        //		var clientH = $(window).height();
        //		$("#canvas").css({
        //			"width": clientW,
        //			"height": clientH
        //		});
        var radio = this.radio
        var warp = this.warp;
        var data = this.list;
        var len = data.length;
        var scale = this.scaleW;
        //		this.warp.style.overflow = 'hidden';
        //		this.warp.style.position = 'absolute';
        //		this.warp.style.zindex = '1000';
        this.outer = document.createElement('ul');
        this.outer.id = 'plate'
        this.bar = document.createElement('div');
        this.loading = document.createElement('div');
        this.bar.className = 'bar';
        this.loading.className = 'slider-loading';
        this.bar.innerHTML = '<i class="icon-back"></i><p class="pageNum"><span class="curimg"></span><span>/</span><span class="count"></span></p><i class="icon-rubbish"></i>';
        this.loading.innerHTML = '<i class="lft-load"></i><i class="rit-load"></i>';
        for (var i = 0; i < len; i++) {
            var li = document.createElement('li');
            var item = data[i];
            //					var imgWidth = item.wid
            li.style.width = window.innerWidth + 'px';
            if (i == this.curNum) {
                li.style.webkitTransform = 'translate3d(0,0,0)';
            } else if (i < this.curNum) {
                li.style.webkitTransform = 'translate3d(-' + (this.curNum - i) * scale + 'px,0,0)';
            } else if (i > this.curNum) {
                li.style.webkitTransform = 'translate3d(' + (i - this.curNum) * scale + 'px,0,0)';
            }
            li.innerHTML = '<img src=" ' + item['img'] + ' " />';

            if (item) {




                //				if (item['height'] / item['width'] > this.radio) {
                //					li.innerHTML = '<img height="' + window.innerHeight + '" src=" ' + item['img'] + ' " />';
                //				} else {
                //					li.innerHTML = '<img width="' + window.innerWidth + '" src=" ' + item['img'] + ' " />'
                //				}
            }
            this.outer.appendChild(li);

        }
        this.outer.style.width = scale + 'px';
        warp.style.height = window.innerHeight + 'px';
        warp.appendChild(this.outer);
        warp.appendChild(this.bar);
        warp.appendChild(this.loading);
        this.count = this.bar.getElementsByClassName('count');
        this.count[0].innerHTML = len;
        this.curimg = this.bar.getElementsByClassName('curimg');
        this.curimg[0].innerHTML = this.curNum + 1;
        var img = warp.getElementsByTagName('img');
        var outer = this.outer;
        var bar = this.bar;
        var loading = this.loading;
        for (var i = 0; i < len; i++) {
            var naturalWidth;
            var naturalHeight;
            naturalWidth = img[i].naturalWidth;
            naturalHeight = img[i].naturalHeight;
            if (naturalHeight / naturalWidth > radio) {
                img[i].height = window.innerHeight;
            } else {
                img[i].width = window.innerWidth;
            }
            if (i == len - 1) {
                $("#plate li").css({
                    "opacity": "1"
                })
                bar.style.opacity = "1";
                loading.style.display = 'none';
            }
        }

    }
    Slider.prototype.bindDOM = function () {
        var curNum = this.curNum;
        var self = this;
        var scale = self.scaleW;
        var outer = self.outer;
        var len = self.list.length;
        var delBtn = (this.warp.getElementsByClassName("icon-rubbish"))[0];
        var back = (this.warp.getElementsByClassName("icon-back"))[0];
        var startHandler = function (evt) {
            self.startX = evt.touches[0].pageX;
            self.offsetX = 0;
            self.startTime = new Date() * 1;
        };
        var moveHandler = function (evt) {
            evt.preventDefault() //阻止浏览器默认事件
            self.offsetX = evt.touches[0].pageX - self.startX; //移动距离
            var lis = outer.getElementsByTagName('li');
            var i = self.index - 1;
            var m = i + 3;
            for (i; i < m; i++) {
                console.log(i);
                console.log(lis[i]);
                lis[i] && (lis[i].style.webkitTransform = 'translate3d(' + ((i - self.index) * scale + self.offsetX) + 'px,0,0)');
                lis[i] && (lis[i].style.webkitTransition = 'none');
            }
        };

        var endHandler = function (evt) {
            var boundaty = scale / 6;
            var endTime = new Date() * 1;
            var lis = outer.getElementsByTagName('li');
            if (endTime - self.startTime > 800) { //慢滑动
                if (self.offsetX >= boundaty) {
                    //进入上一页
                    self.go('-1');
                } else if (self.offsetX < -boundaty) {
                    //进入下一页
                    self.go('+1');
                } else {
                    //留在本页
                    self.go('0');
                }
            } else { //快速滑动优化
                if (self.offsetX > 50) {
                    self.go('-1')
                } else if (self.offsetX < -50) {
                    self.go('+1')
                } else {
                    self.go('0')
                }
            }

        };
        var delEvent = function (evt) {
            var cur = self.index;
            self.delitem = cur;
            var len = self.list.length;
            if (self.list.length == 1) {
                while (self.warp.hasChildNodes()) //当div下还存在子节点时 循环继续
                {
                    self.warp.removeChild(self.warp.firstChild);
                }
            }
            self.list.splice(cur, 1);
            if (cur == len - 1) {
                self.go('-1');
                outer.removeChild((outer.getElementsByTagName("li"))[cur]);
            } else {
                self.go('+1', true);
                outer.removeChild((outer.getElementsByTagName("li"))[cur]);
                self.index = self.index - 1;
            }
            var callBack = self.callBack();
            self.count = self.bar.getElementsByClassName('count');

            //防止js报错
            if (self.list.length) {
                self.count[0].innerHTML = self.list.length;
            }

        };
        var close = function () {
            while (self.warp.hasChildNodes()) //当div下还存在子节点时 循环继续
            {
                self.warp.removeChild(self.warp.firstChild);
            }
            //			this.warp.removeChild();
        }
        outer.addEventListener('touchstart', startHandler);
        outer.addEventListener('touchmove', moveHandler);
        outer.addEventListener('touchend', endHandler);
        delBtn.addEventListener('click', delEvent);
        back.addEventListener('click', close);
    }
    Slider.prototype.go = function (n, isDel) {
        var idx = this.index;
        var cidx;
        var lis = this.outer.getElementsByTagName('li');
        var len = lis.length;
        var scale = this.scaleW;
        if (typeof n == 'number') {
            cidx = idx;
        } else if (typeof n == 'string') {
            cidx = idx + n * 1;
        }
        //当索引右超出
        if (cidx > len - 1) {
            cidx = len - 1;
        } else if (cidx < 0) {
            cidx = 0;
        }
        this.index = cidx;
        if (isDel) {
            $(".curimg").html(cidx);
        } else {
            $(".curimg").html(cidx + 1);
        }

        lis[cidx].style.webkitTransition = 'all .2s linear';
        lis[cidx - 1] && (lis[cidx - 1].style.webkitTransition = 'all .2s linear');
        lis[cidx + 1] && (lis[cidx + 1].style.webkitTransition = 'all .2s linear');
        lis[cidx].style.webkitTransform = 'translate3d(0,0,0)';
        lis[cidx - 1] && (lis[cidx - 1].style.webkitTransform = 'translate3d(-' + scale + 'px,0,0)');
        lis[cidx + 1] && (lis[cidx + 1].style.webkitTransform = 'translate3d(' + scale + 'px,0,0)');
    }
    return Slider
})(jQuery)