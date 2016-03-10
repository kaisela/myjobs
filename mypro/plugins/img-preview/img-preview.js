/**
 * @description {Class} imgPreview
 * This is the main class of imgPreview.
 */
 (function ($) {
    $.fn.imgPreview = function(settings){
    	var ops = {
    		imgs:[],
    		curIndex:0,
    		delCallback:function(){}
    	};
    	$.extend(ops, settings);
    	var me = $(this);
    	var bar  = null;
    	var imgView = null;
    	var len = ops.imgs.length;
    	var clientWidth = $(window).width();
    	var clientHeight = $(window).height();
    	var rate = clientWidth/clientHeight;
    	function init(){
    		build();
    		Events();
    	}
    	
    	function buildItem(i){
    		var oLi = $('<li></li>');
    			var cssValue = "translate3d("+((i-ops.curIndex)*clientWidth)+"px,0,0)";
    			oLi.css("transform",cssValue);
    			oLi.css("-ms-transform",cssValue);
    			oLi.css("-moz-transform",cssValue);
    			oLi.css("-webkit-transform",cssValue);
    			oLi.css("-o-transform",cssValue);
    			var oImg = $('<img src = "'+ops.imgs[i]+'"/>');
    			(function(oImg){
    				var img = new Image();
					img.src = oImg.attr("src") ;
	    			img.onload = function(){
	    				var imgWidth = img.width;
		    			var imgHeight = img.height;
		    			var realRate = imgWidth/imgHeight;
		    			if(imgWidth > clientWidth && realRate > rate){
		    				oImg.width(clientWidth);
		    			}
		    			if(imgHeight > clientHeight && realRate < rate){
		    				oImg.height(clientHeight);
		    			}
		    			
		    			oImg.parent().find(".loading").hide();
		    			
	    			};
    			})(oImg);
    			var oLoad = $("<img class='loading' src = 'load.gif' />").css({left:(clientWidth/2-15)+"px",top:(clientHeight/2-15)+"px"});
    			oLi.append(oLoad);
    			oLi.append(oImg);
    			imgView.append(oLi);
    			return oLi;
    	}
    	
    	function build(){
    		var barHtml = [];
    		barHtml.push('<div class="bar">');
			barHtml.push('	<a class="back" href="javascript:;"><i class="icon-back"></i></a>');
			barHtml.push('	<div class="num-view"><span class="current-index"></span>/<span class="totle"></span></div>');
			barHtml.push('	<a class="del" href="javascript:;"><i class="icon-rubbish"></i></a>');
			barHtml.push('</div>');
    		bar = $(barHtml.join(""));
    		bar.find(".current-index").html(ops.curIndex+1);
    		bar.find(".totle").html(len);
    		imgView = $("<ul class='img-view'></ul>");
    		var imgs = ops.imgs;
    		for(var i=0;i<len;i++){
    			buildItem(i);
    		}
    		me.append(imgView);
    		me.append(bar);
    	}
    	function go(cum){
    		ops.curIndex = ops.curIndex + cum;
    		if(ops.curIndex < 0){
    			ops.curIndex = 0;
    		}
    		
    		if(ops.curIndex >len-1){
    			ops.curIndex = len-1;
    		}
    		bar.find(".current-index").html(ops.curIndex+1);
    		for(var i=0;i<len;i++){
	    			var oLi = me.find("li:eq("+i+")");
	    			var cssValue = "translate3d("+((i-ops.curIndex)*clientWidth)+"px,0,0)";
	    			oLi.css("transition","all .3s linear");
	    			oLi.css("-moz-transition","all .3s linear");
	    			oLi.css("-webkit-transition","all .3s linear");
	    			oLi.css("-o-transition","all .3s linear");
	    			oLi.css("transform",cssValue);
	    			oLi.css("-ms-transform",cssValue);
	    			oLi.css("-moz-transform",cssValue);
	    			oLi.css("-webkit-transform",cssValue);
	    			oLi.css("-o-transform",cssValue);
	    			
    			}
    	}
    	
    	function Events(){
    		var startX,startY;
    		
    		var del = function(e){
    			var oldIndex = ops.curIndex;
    			if(ops.curIndex == ops.imgs.length - 1){
    				go(-1);
    				ops.curIndex = oldIndex-1;
    			}else{
    				go(1);
    				ops.curIndex = oldIndex;
    			}
    			ops.imgs.splice(oldIndex, 1);
    			
    			bar.find(".current-index").html(ops.curIndex+1);
    			me.find(".img-view").find("li:eq("+oldIndex+")").remove();
    			len = ops.imgs.length;
    			bar.find(".totle").html(len);
    			if(len == 0){
    				me.hide();
    			}
    			ops.delCallback(oldIndex);
    		};
    		var close = function(e){
    			me.hide();
    		};
//  		var touchstart = function(e){
//  			e.stopPropagation();
//  			var touchs = e.originalEvent.changedTouches;
//  			if(touchs.length == 1){
//  				var touch = e.originalEvent.changedTouches[0];
//  				startX = touch.pageX;
//  			}
//  			
//  			
//  		};
//  		var touchend = function(e){
//  			e.stopPropagation();
//  			var touchs = e.originalEvent.changedTouches;
//  			if(touchs.length == 1){
//	    			var touch = e.originalEvent.changedTouches[0];
//	    			var endX = touch.pageX;
//	    			if(endX - startX > 50){
//	    				go(-1);
//	    			}
//	    			if(endX - startX < -50){
//	    				go(1);
//	    			}
//	    			go(0);
//  			}
//  			
//  			
//  		};
//  		var touchmove = function(e){
//  			e.stopPropagation();
//  			var touchs = e.originalEvent.changedTouches;
//  			if(touchs.length == 1){
//	    			var touch = e.originalEvent.changedTouches[0];
//	    			var offset = touch.pageX - startX;
//	    			for(var i=0;i<len;i++){
//		    			var oLi = me.find("li:eq("+i+")");
//		    			var cssValue = "translate3d("+((i-ops.curIndex)*clientWidth+offset)+"px,0,0)";
//		    			oLi.css("transform",cssValue);
//		    			oLi.css("-ms-transform",cssValue);
//		    			oLi.css("-moz-transform",cssValue);
//		    			oLi.css("-webkit-transform",cssValue);
//		    			oLi.css("-o-transform",cssValue);
//		    			oLi.css("transition","none");
//		    			oLi.css("-moz-transition","none");
//		    			oLi.css("-webkit-transition","none");
//		    			oLi.css("-o-transition","none");
//	    			}
//  			}
//  			//alert(1);
//  			return false;
//  		};
    		alert(me.find(".bar").get(0));
    		me.find(".bar").find(".back").on("click",close);
    		me.find(".bar").find(".del").on("click",del);
//  		me.on("touchstart",touchstart);
//  		me.on("touchend",touchend);
//  		me.on("touchmove",touchmove);
    	}
    	
    	init();
    	me[0].t = { //对外开放接口
			setIndex: function(index) {
				go(index-ops.curIndex);
			},
			showView:function(){
				me.show();
			},
			hideView:function(){
				me.hide();
			},
			addImg:function(img){
				ops.imgs.push(img);
				buildItem(ops.imgs.length - 1);
				bar.find(".totle").html(ops.imgs.length);
				len = ops.imgs.length;
			}

		};
		return me;
    };
    $.fn.setIndex = function(index) {
		if (this[0] && this[0].t) {
			return this[0].t.setIndex(index);
		}
		return null;
	};
	$.fn.showView = function(index) {
		if (this[0] && this[0].t) {
			return this[0].t.showView();
		}
		return null;
	};
	$.fn.hideView = function(index) {
		if (this[0] && this[0].t) {
			return this[0].t.hideView();
		}
		return null;
	};
	$.fn.addImg = function(img) {
		if (this[0] && this[0].t) {
			return this[0].t.addImg(img);
		}
		return null;
	};
    
})(jQuery)