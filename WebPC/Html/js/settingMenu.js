$(function(){
	var json = [1,2,3,4,5,6,7];
	$("body").on("click","#build",function(){
		build();
	});
	
	function build(){
		var len = json.length;
		var percent = parseInt(100/len);
		for(var i=0;i<len;i++){
			$.ajax({
				url:"../data/build.json",
				type:"json",
				success:function(data){
					var curWidth = $(".progress-bar-info").css("width");
					var width = parseInt(curWidth)+percent;
					$(".progress-bar-info").css("width",width+"%");
				}
				});
				
		}

		
	}
});
