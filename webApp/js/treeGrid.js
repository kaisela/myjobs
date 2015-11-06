$(function() {
	
	function source(nid, deep, pids , nd) {
		var ht = [];
		ht.push("<div class='row-li' >"+nd.count+"</div>");
		ht.push("<div class='row-li' ><a class='add-btn' class-id='",nid,"' href='javascript:;' >添加子类目</a> <a class='dd-handle' href='javascript:;' >移动</a></div>");
		return ht.join("");
	}
	$("#tree").treeview( {
		data : treeNodes,
		source : source,
		showcheck : false
	});
	
	var updateOutput = function(e)
    {
        var list   = e.length ? e : $(e.target),
            output = list.data('output');
        if (window.JSON) {
            output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
        } else {
            output.val('JSON browser support required for this demo.');
        }
    };

    // activate Nestable for list 1
    $('#nestable').nestable({
        group: 1
    })
    .on('change', updateOutput);
    // output initial serialised data
    updateOutput($('#nestable').data('output', $('#nestable-output')));
	
});
