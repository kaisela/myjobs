//全选
	function allSelect(){
		var allCheck = $(".table tr td input[type='checkbox']");
		if($("#selectall").attr('checked')){
			allCheck.attr('checked',true)
		}else{
			allCheck.removeAttr('checked')
		}
	}