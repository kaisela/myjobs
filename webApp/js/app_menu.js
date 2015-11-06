/**
  * @description {Class} appMenu
  * This is the main class of appMenu.
  */
(function($) {
	
    $.fn.appMenu = function(settings) {
        var dfop =
            {
                method: "POST",
                datatype: "json",
                /**
                 * @description {Config} url  
                 * {String} 远程数据的请求地址ajax
                 */
                url: false,
                /**
                 * @description {Config} data  
                 * {Object} 当url没有时，本地数据结构
                 */
                data: null,
                /**
                 * @description {Config} param  
                 * {Object} ajax请求的额外参数。
                 */
                param:{},
                /**
                 * @description {Config} clickCallBack  
                 * {Function} 点击完二级菜单时的回调函数
                 */
                clickCallBack:function(){
                	
                },
                type:1,
                initData:{}
            };

        $.extend(dfop, settings);
        var clientHeight = $(window).height();
        var clientWidth = $(window).width();
        var type = dfop.type;
        var initData =  dfop.initData;
        var me = $(this);
        me.css({width:clientWidth+"px",height:clientHeight+"px"});
        me.attr("data-flag","in");
       
        var html = [];
		var data = [];
		if(dfop.url){//当设置url参数时，向远程服务器获取数据
			getData();
		}else if(dfop.data){//当设置data时，本地获取数据
			data = dfop.data;
			buildMenu(dfop.data);
		}
		/**
		 * 支持远程获取分类数据
		 */
		function getData(){
			$.ajax({
				url:dfop.url,
				async:true,
				dataType:dfop.datatype,
				data:dfop.param,
				success:function(result){
					if(result.data){
						data = result.data;
						buildMenu();
					}
				},
				error:function(){
				}
			});
		}
		/**
		 * 构建整个菜单
		 */
		function buildMenu(){
			if(type == 2){
				var firstStr = initFirst();
				html.push(firstStr);
			}
			html.push('<div class="category" >');
			if(type == 1){
				var secondStr = initSecond("0");
				html.push('<div class="normal" data-id="0');
				html.push('">');
				html.push("<div class='all-con' load='false'>");
				html.push('<i class="adap-img " ></i>');
				html.push('<a class="first-text all-btn" data-id="0">');
				html.push("全部</a>");
				html.push('</div>');
				html.push(secondStr);
			}
			html.push('</div>');
			me.append(html.join(''));
			clickEvents();
			selectData();
		}
		
		function selectData(){
			if(type == 2){
				if(initData.first){
					$(".first-category a[data-id="+initData.first+"]").click();
					if(initData.second){
						$(".first-con div[data-id="+initData.second+"]").click();
					}else{
						$(".first-con div:eq(0)").click();
					}
				}else{
					$(".first-category a:eq(0)").click();
					$(".first-con div:eq(0)").click();
				}
			}else{
				$(".first-con div:eq(0)").click();
			}
			
		}
		
		/**
		 * 构建一级级菜单
		 * @param {Object} data
		 */
		function initFirst(){
			var firstCategory = [];//用于组装一级分类
			firstCategory.push('<div class="first-category" data-flag="out">');
			for(var i=0;i<data.length;i++){
				var item = data[i];
				if(item.Parentid == "0"){
					firstCategory.push('<a href="javascript:;" data-id="');
					firstCategory.push(item.ID);
					firstCategory.push('">');
					firstCategory.push(item.CName);
					firstCategory.push('</a>');
				}
			}
			firstCategory.push('</div>');
			return firstCategory.join('');
		}
		/**
		 * 构建二级菜单
		 * @param {Object} data
		 */
		function initSecond(pk){
			var firstCategory = [];//用于组装一级分类
			for(var i=0;i<data.length;i++){
				var item = data[i];
				if(item.Parentid == pk){
					firstCategory.push('<div class="normal" data-id="');
					firstCategory.push(item.ID);
					firstCategory.push('">');
					firstCategory.push("<div class='first-con' load='false'>");
					firstCategory.push('<i class="adap-img ',item.icon,'" ></i>');
					firstCategory.push('<a class="first-text">');
					firstCategory.push(item.CName+"</a>");
					firstCategory.push("</div><div class='second-con'></div>");
					firstCategory.push('</div>');
				}
			}
			return firstCategory.join('');
		}
		/**
		 * 构建二级菜单
		 * @param {Object} data
		 * @param {Object} pk
		 */
		function getThrid(pk){
			var secondCategory = [];//用于组装二级分类
        	
			for(var i=0;i<data.length;i++){
				var item = data[i];
				if(item.Parentid == pk){
					secondCategory.push('<a href="javascript:;" data-id="');
					secondCategory.push(item.ID);
					secondCategory.push('">');
					secondCategory.push(item.CName);
					secondCategory.push('</a>');
				}
			}
			return secondCategory.join('');
        }
		
		function showHidden(){
					var category = me.find(".first-category");
					var cateFlag = category.attr("data-flag");
					var flag = me.attr("data-flag");
					if(cateFlag == "out"){
						category.removeClass("first-category-show");
						category.attr("data-flag","in");
					}else{
						if(flag == "in"){
							me.addClass("app-menu-show");
							if(type == 2){
								$(".menu-icon").width(200);
							}
							me.attr("data-flag","out");
						}else{
							me.removeClass("app-menu-show");
							$(".menu-icon").width(50);
							me.attr("data-flag","in");
						}
					}
					
				
		}
		
		function showHiddenFirst(){
					var category = me.find(".first-category");
					var flag = category.attr("data-flag");
					if(flag == "in"){
						category.addClass("first-category-show");
						category.attr("data-flag","out");
					}else{
						category.removeClass("first-category-show");
						category.attr("data-flag","in");
					}
				
		}
		/**
		 * 组件中所有涉及到的事件
		 */
		function clickEvents(){
			me.on("click",".first-con",function(e){//一级菜单点击事件
				e.stopPropagation();
				var $this = $(this);
				var pk = $this.parent().attr("data-id");
				var secondDiv = $this.parent().find(".second-con");
				$(this).parent().siblings().each(function(){
					$(this).find(".first-con").removeClass("open");
					$(this).find(".second-con").hide();
				});
				if($this.attr("load") == "false"){
					var strSecond = getThrid(pk);
					secondDiv.html(strSecond);
					$this.attr("load","true");
				}
				if($this.hasClass("open")){
					$this.removeClass("open");
					secondDiv.css("display","none");
				}else{
					$this.addClass("open");
					secondDiv.css("display","block");
				}
			});
			me.on("click",".second-con a",function(e){//二级菜单点击事件
				e.stopPropagation();
				var $this = $(this);
				var id = $this.attr("data-id");
				showHidden();
				if(typeof(dfop.clickCallBack) === "function"){
					dfop.clickCallBack(id);
				}
				
			});
			
			me.on("click",".all-con a",function(e){//二级菜单点击事件
				e.stopPropagation();
				var $this = $(this);
				var id = $this.attr("data-id");
				showHidden();
				if(typeof(dfop.clickCallBack) === "function"){
					dfop.clickCallBack(id);
				}
				
			});
			me.on("click",".first-category a",function(e){
				e.stopPropagation();
				var $this = $(this);
				var pk = $this.attr("data-id");
				var strSecond = initSecond(pk);
				$(".first-con .normal").removeClass("active");
				$(".first-con .normal:eq(0)").addClass("active");
				me.find(".category .first-con").html(strSecond);
				$(".menu-icon .text").html($this.text());
				showHiddenFirst();
			});
			$("body").on("click",".first-btn",function(e){//显示或者隐藏菜单
				e.stopPropagation();
				showHiddenFirst();
			});
			$("body").on("click",".menu-icon .icon-category",function(e){//显示或者隐藏菜单
				e.stopPropagation();
				showHidden();
			});
			me.on("click",".category",function(e){//控制分类容器点击时，事件冒泡，而导致执行菜单隐藏
				e.stopPropagation();
			});
			me.on("click",function(e){//点击半透明区域，菜单隐藏
				e.stopPropagation();
				//me.animate({left:clientWidth+"px"});
				showHidden();
			});
			me.on("touchstart",function(e){//控制分类容器点击时，事件冒泡，而导致执行菜单隐藏
				e.stopPropagation();
			});
			$(window).on("resize",function(e){//当横屏于竖屏切换时，相关变量值重置
				clientHeight = $(window).height();
      			clientWidth = $(window).width();
			});
		}
		/**
		 * 根据用户传入的id获得单项的所有数据
		 * @param {Object} id
		 */
        function getNodeDataById(id){
        	var item = null;
        	for(var i=0;i<data.length;i++){
				var item = null;
				if(data[i].ID == id){
					item = data[i];
					break;
				}
			}
        	return item;
        }
        me[0].t = {//对外开放接口
            getNodeData: function(id) {
                return getNodeDataById(id)
            }
            
        };
        return me;
    };
    //get all checked nodes, and put them into array. no hierarchy
    $.fn.getNodeDataById = function(id) {
        if (this[0].t) {
            return this[0].t.getNodeData(id);
        }
        return null;
    };
    
})(jQuery);