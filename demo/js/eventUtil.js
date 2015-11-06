var EventUtil = {
	addHandler : function(el,type,handler){
		if(el.addEventListener){
			el.addEventListener(type,handler,false);
		}else if(el.attackEvent){
			el.attackEvent("on"+type,handler);
		}else{
			el["on"+type] = handler;
		}
	},
	getEvent : function(event){
		return event?event:window.event;
	},
	getTarget : function(event){
		return event.target || event.srcElement;
	},
	getRelatedTarget : function(event){
		if(event.relatedTarget){
			return event.relatedTarget;
		}else if(event.fromElement){
			return event.fromElement;
		}else if(event.toElement){
			return event.toElement;
		}else{
			return null;
		}
	},
	getCharCode : function(event){
		if(typeof event.charCode === "number"){
			return event.charCode;
		}else{
			return event.keyCode;
		}
	},
	getButton : function(event){
		if(document.implementation.hasFeature("MouseEvrnts" , "2.0")){
			return event.button;
		}else{
			switch(event.button){
				case 0 :
				case 1 :
				case 3 :
				case 5 :
				case 7 :
					return 0;
				case 2 :
				case 6 :
					return 2;
				case 4 :
					return 1;
			}
		}
	},
	preventDefault : function(event){
		var event = this.getEvent(event);
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	},
	removerHandler : function(){
		if(el.removeEventListener){
			el.removeEventListener(type,handler,false);
		}else if(el.detackEvent){
			el.detackEvent("on"+type,handler);
		}else{
			el["on"+type] = null;
		}
	},
	stopPropagation : function(event){
		var e = this.getEvent(event);
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancelBubble = false;
		}
	}
	
};
