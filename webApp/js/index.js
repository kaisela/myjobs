$(function(){
	var clientHeight = $(window).height();
    var clientWidth = $(window).width();
    $(".container").css({width:clientWidth+"px",height:clientHeight+"px"});
    $(".app-menu-con").css({width:clientWidth+"px",height:clientHeight+"px",overflow: "hidden"});
	$("#appMenu").appMenu({
		url:"data/category1.json",
		type:1,
		clickCallBack:function(id){
			var item = $("#appMenu").getNodeDataById(id);
			$("#title").html(item.name);
		}
	});
});