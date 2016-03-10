/**
 * @description {Class} appMenu
 * This is the main class of appMenu.
 */
(function($) {

	$.fn.operatePlugin = function(settings) {
		var dfop = {
			title:null,
			texts: [],
			commands: [],
			show:false
		};

		$.extend(dfop, settings);
		
		var me = $(this);
		me.addClass("operate-con");
		var html = [];
		if(dfop.show){
			showOperate();
		}
		
		buildOperate();
		/**
		 * 构建整个菜单
		 */

		function buildOperate() {
			var texts = dfop.texts;
//			html.push('<div class="operate-con-bg"></div>');
			html.push('<div class="operate">');
			if(dfop.title){
				html.push('<div class = "title">',dfop.title,'</div>')
			}
			html.push('		<div class="items">');
			for(var i=0;i<texts.length;i++){
			html.push('	<div class="item-btn">');
			html.push(texts[i]);
			html.push('			</div>');
			}		
			html.push('		</div>');
			html.push('		<button class="cancel">取消</button>');
			html.push('	</div>');
			me.append(html.join(""));
			me.find(".operate-con-bg").css({width:$(window).width()+"px",height:$(window).height()+"px"})
			me.find(".item-btn").on("click",function(e){
				e.stopPropagation();
				var index = $(this).index(".operate .item-btn");
				if(dfop.commands[index] && typeof(dfop.commands[index] == "function"))
				{
					dfop.commands[index](index);
					hideOperate();
				}
			});
			me.on("click",function(e){
				e.stopPropagation();
				hideOperate();
			});
			me.find(".operate").on("click",function(e){
				e.stopPropagation();
			});
			me.find(".cancel").on("click",function(e){
				e.stopPropagation();
				hideOperate();
			})
		}
		
		function setText(i,text){
			me.find(".item-btn:eq("+i+")").html(text);
		}
		
		function showOperate(){
			me.find(".operate").addClass("show");
			me.fadeIn();
		}
		function hideOperate(){
			me.find(".operate").removeClass("show");
			me.fadeOut();
		}
		me[0].t = { //对外开放接口
			showOperate: function() {
				showOperate();
			},
			hideOperate: function(){
				hideOperate();
			},
			setText: function(i,text){
				setText(i,text);
			}

		};
		return me;
	};
	
	
	//get all checked nodes, and put them into array. no hierarchy
	$.fn.showOperate = function() {
	    if (this[0]&&this[0].t) {
			return this[0].t.showOperate();
		}
		return null;
	};
	$.fn.hideOperate = function() {
	    if (this[0]&&this[0].t) {
			return this[0].t.hideOperate();
		}
		return null;
	};
	$.fn.setText = function(i,text) {
	    if (this[0]&&this[0].t) {
			return this[0].t.setText(i,text);
		}
		return null;
	};
})(jQuery);
