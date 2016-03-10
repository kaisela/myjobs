/*global jQuery*/
/*global ctx*/
/*jslint unparam: true */
(function( $ ) {
    "use strict";
    var AddressPicker = function(element, options) {
        var that = this;

        this.element = $(element);

        this.isInline = false;
        this.isInput = this.element.is('input');

        this.autoclose = false;
        if ('autoclose' in options) {
            this.autoclose = options.autoclose;
        }

        if ('pickerLevel' in options) {
            this.pickerLevel = options.pickerLevel;
        }
        if ('lastLevelMultiple' in options) {
            this.lastLevelMultiple = options.lastLevelMultiple;
        }
        if("addressPickerRender" in options){ 
        	this.appendRender = options.addressPickerRender;
        }else{
        	this.appendRender = $("body");
        }
        if("requireCallback" in options){
        	this.requireCallback = options.requireCallback;
        }
        if("onChange" in options){
        	this.onChange = options.onChange;
        }
        if("callBack" in options){
        	this.callBack = options.callBack;
        }
       //if (this.pickerLevel >=3) {
//               APTemplate.headTemplateTemp = APGlobal.headTemplateCounty;
//       }
//       if (this.pickerLevel >=4) {
//           APTemplate.headTemplateTemp += APGlobal.headTemplateTown;
//       }
		this.selectedValue={};

        this._attachEvents();
        
        this.picker = $(getTemplate())
            .appendTo(this.isInline ? this.element : this.appendRender)
            .on({
                click: $.proxy(this.click, this),
                mousedown: $.proxy(this.mousedown, this)
            });
        APTemplate.headTemplateTemp = "";
		this.headerTmpl = this.picker.find(".address-tabs");
        this.fillProvPane();

        if(this.isInline) {
            this.picker.addClass('datepicker-inline');
        } else {
            this.picker.addClass('datepicker-dropdown dropdown-menu');
        }


        $(document).on('mousedown', function (e) {
            // Clicked outside the datepicker, hide it
            if ($(e.target).closest('.address-picker, .datepicker.datepicker-dropdown').length === 0) {
                that.hide();
            }
        });
        function touchendEvent(e){
        	 if ($(e.target).closest('.address-picker, .datepicker.datepicker-dropdown').length === 0) {
                 that.hide();
             }
        }
        var sUserAgent = navigator.userAgent.toLowerCase();  
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";  
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";  
        if(bIsIpad || bIsIphoneOs){
        	$("body").get(0).addEventListener("touchend", touchendEvent, false);
        }
        
        this.viewAddress = [];
        this.addressLevel = this.viewAddress.length;
		this.showLevel = this.viewAddress.length;
		this.showPickerMax = 4;
		this.loadData=function(initData){
			this.initData=initData;
			this.init();
		}
		this.requireLevelIn = function(isAlert){
			var flag = true;
			flag = this.requireLevel(true,isAlert);
			
			return flag;
		}
		this.clearData = function(){
			this.reInit();
		}
		this.getSelectedValue = function(){
			if(this.selectedValue){
				return this.selectedValue;
			}
			return {};
		}
		if("initData" in options){
        	this.initData = options.initData;
        	this.init();
        }
        if(this.isInline) {
            this.show();
        }
    };

    AddressPicker.prototype = {
        constructor: AddressPicker,

        _events: [],
        _attachEvents: function(){
            this._detachEvents();
            if (this.isInput) { // single input
                this._events = [
                    [this.element, {
                        click: $.proxy(this.show, this),
                        keyup: $.proxy(this.update, this),
                        keydown:$.proxy(this.update, this)
                    }]
                ];
            }
            else if (this.component && this.hasInput){ // component: input + button
                this._events = [
                    // For components that are not readonly, allow keyboard nav
                    [this.element.find('input'), {
                        click: $.proxy(this.show, this),
                        keyup: $.proxy(this.update, this),
                        keydown:$.proxy(this.update, this)
                    }],
                    [this.component, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
            else if (this.element.is('div')) {  // inline datepicker
                this.isInline = true;
            }
            else {
                this._events = [
                    [this.element, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
            for (var i=0, el, ev; i<this._events.length; i++){
                el = this._events[i][0];
                ev = this._events[i][1];
                el.on(ev);
            }
        },
        _detachEvents: function(){
            for (var i=0, el, ev; i<this._events.length; i++){
                el = this._events[i][0];
                ev = this._events[i][1];
                el.off(ev);
            }
            this._events = [];
        },
        init:function(){
        	var initDta = this.initData;
        	if(initDta.countyId){
        		var html = $.ajax({
    				url:  addrJsonUrl+initDta.countyId+".json?time="+((new Date()).getTime()),
    				//url:  "addressJson/"+initDta.countyId+".json",
    				async: false
    			}).responseText;
    			var jsonData= $.parseJSON(html).data;
    			var eleText ="";
    			if(jsonData.provinceId){
    				this.picker.find("div.tab-pane").find("button[value="+jsonData.provinceId+"]").click();
    			}
    			if(jsonData.cityId)	{
    				this.picker.find("div.tab-pane").find("button[value="+jsonData.cityId+"]").click();
    			}
    			if(jsonData.countyId)	{
    				this.picker.find("div.tab-pane").find("button[value="+jsonData.countyId+"]").click();
    			}
    			if(initDta.townId){
    				this.picker.find("div.tab-pane").find("button[value="+initDta.townId+"]").click();
    			}
        	}
        },
        show: function(e) {
           // this.picker.append('<div class="message-loading-overlay"><i class="icon-spin icon-spinner orange2 bigger-160"></i></div>');
            this.picker.show();
            this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
          //  this.update();
            this.place();
            $(window).on('resize', $.proxy(this.place, this));
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.element.trigger({
                type: 'show',
                date: this.date
            });
        },
        hide: function(){
            if(this.isInline) {
                return;
            }
            if (!this.picker.is(':visible')) {
                return;
            }
            
            this.picker.hide();
            $(window).off('resize', this.place);
            this.viewMode = this.startViewMode;
          //  this.showMode();
            if (!this.isInput) {
                $(document).off('mousedown', this.hide);
            }

            if (
                this.forceParse &&
                    (
                        this.isInput && this.element.val() ||
                            this.hasInput && this.element.find('input').val()
                        )
                ) {
                this.setValue();
            }
            this.element.trigger({
                type: 'hide',
                date: this.date
            });
            var reLevel = this.element.attr("data-requireLevel");
            if(reLevel){
            	this.requireLevel();
            }
            
        },

        getFormattedAddress: function() {
			var level = this.showLevel >= this.showPickerMax?this.showPickerMax:this.showLevel;
            if (this.showLevel < this.viewAddress.length) {
                var len = this.viewAddress.length - this.showLevel;
                 while(len-- > 0) {
                     this.viewAddress.pop();
                 }
            }
			var lenght=this.viewAddress.length
			for(var i=0;i<lenght;i++)
			{
				if(this.viewAddress[i] == undefined){
					this.viewAddress.splice(i,1);
				}
			}
			
             return this.viewAddress.join("-");
        },

        setValue: function() {
            var formatted = this.getFormattedAddress();
            if (!this.isInput) {
                if (this.component){
                    this.element.find('input').val(formatted);
                }
                this.element.data('date', formatted);
            } else {
                this.element.val(formatted);
            }
        },
		
		requireLevel: function(flag,isAlert) {
            var reLevel = this.element.attr("data-requireLevel");
			var addressid = this.element.attr("addressid");
			var reL = this.element.attr("requireLevel");
			if(!addressid && !flag){
				return true;
			}
			if(reL){
				reLevel = reL;
			}
			if(isAlert == undefined){
				isAlert = true;
			}
			
			//console.log(isAlert);
			var addLen = 0;
			if(addressid){
				addLen = addressid.length;
			}
			
			reLevel = reLevel - 0;
			if(reLevel == 1 && addLen < 2){
				if(this.requireCallback){
					this.requireCallback();
					return false;
				}
				if(isAlert){
					alert("请选择到省份！");
					this.element.css("border-color","#FF0000");
				}
				
				return false;
			}
			if(reLevel == 2 && addLen < 4){
				if(this.requireCallback){
					this.requireCallback();
					return false;
				}
				if(isAlert){
					alert("请选择到城市！");
					this.element.css("border-color","#FF0000");
				}
				
				return false;
			}
			 var currentBtnText = this.picker.find("div.tab-pane").find("button[value="+addressid+"]").html();
	         var isCantX = /县$/.test($.trim(currentBtnText));
	         if (!(this.selectedValue.prov == "71" && isCantX)){
	        	 if(reLevel == 3 && addLen < 6){
	 				if(this.requireCallback){
	 					this.requireCallback();
	 					return false;
	 				}
	 				if(isAlert){
	 					alert("请选择到区县！");
		 				this.element.css("border-color","#FF0000");
	 				}
	 				return false;
	 			}
	 			if(reLevel == 4 && addLen < 7){
	 				if(this.requireCallback){
	 					this.requireCallback();
	 					return false;
	 				}
	 				if(isAlert){
	 					alert("请选择到乡镇！");
		 				this.element.css("border-color","#FF0000");
	 				}
	 				return false;
	 			}
	         }
			
			this.element.css("border-color","#D5D5D5");
			return true;
        },
		
        place: function(){
            if(this.isInline) {
                return;
            }
            var zIndex = 3000; /*parseInt(this.element.parents().filter(function() {
                return $(this).css('z-index') != 'auto';
            }).first().css('z-index'))+10;*/
            var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var renderOffset = this.appendRender.offset();
            var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(true);
			var offsetLeft = 0;
			if($(window).width() - 322 <= 0){
				offsetLeft = 0;
			}else if($(window).width() - 480 <= 0){
				offsetLeft = Math.floor(($(window).width()-322)/2);
			}else{
				offsetLeft = (offset.left-renderOffset.left)
			}
            this.picker.css({
                top: (offset.top-renderOffset.top) + height,
                left: offsetLeft,
                zIndex: zIndex
            });
        },

        update: function(e){
           // alert("key up");
           // this.fill();
        	 
            if (this.element.val() === "") {
                this.element.attr("addressId", "");
                if(this.onChange){
 					this.onChange();
 				}
            }
			if(e.keyCode == 8 || e.keyCode == 46)
			{
				this.reInit();
			}
			e.preventDefault();
			e.stopPropagation();
        },
        reInit: function(){
        	 this.element.val("");
			 this.element.attr("addressId", "");
			 if(this.onChange){
 					this.onChange();
 				}
			 this.selectedValue = {};
			 this.selectBtn();
			 this.moveLevel('prov');
			 var tabLi = this.picker.find(".address-tabs").find("li");
			 tabLi.each(function(i){
				 if(i!=0)
				 {
					 $(this).remove();
				 }
			 });
        },
        fill: function() {
            // alert(this.viewAddress.join("-"));
            if (//this.addressLevel == this.pickerLevel &&
                this.element.attr("addressId") !==  this.currentAddressId){
                this.element.attr("addressId", this.currentAddressId);
                if(this.onChange){
 					this.onChange();
 				}
                this.element.attr("addressLevel", this.addressLevel);
				this.element.attr("sLevel", this.showLevel);
                this.element.change();
            }
            this.setValue();
        },
        fillProvPane: function() {
           // alert("length: " + APGlobal.provJSON);
            if (APGlobal.provJSON === null) {
                var html = $.ajax({
                   // url:  ctx +"/dwrAction.aspx?method=getDicArea&parentId=10",
                    url:  "addressJson/"+APGlobal.provId+".json",
                    async: false
                }).responseText;
                var json = $.parseJSON(html);
                 //  alert(json.data);
                APGlobal.provJSON = json.data;
                this.fillProvPane();

            }  else {
               // alert(" else " + APGlobal.provJSON);
                var pane = this.picker.find("div.tab-pane:eq(0)");
                //alert(pane.html());

                var strA_G = "", strH_K = "", strL_S = "", strT_Z = "",strZX="",strGAT="";
                var rexAG = /^[A-G]$/, rexHK = /^[H-K]$/, rexLS = /^[L-S]$/, rexTZ = /^[T-Z]$/;

                $.each(APGlobal.provJSON, function(index, value) {
                    //'<button class="btn-link" addressId="10001" level="0">北京市</button>'+
                    if (typeof value.addressNum !== "undefined") {
                        var prefix = value.addressNum.charAt(0);
                        var str = '<button class="btn-link"  value="'+ value.id +'" level="0" iszx="0" slevel="0">'+ value.name +'</button>';

                        if (rexAG.test(prefix)) {
                            strA_G += str;
                        } else if (rexHK.test(prefix)) {
                            strH_K += str;
                        } else if (rexLS.test(prefix)) {
                            strL_S += str;
                        } else if (rexTZ.test(prefix)) {
                            strT_Z += str;
                        }else if(prefix == "0"){
							str = '<button class="btn-link"  value="'+ value.id +'" level="0" iszx="1" slevel="0">'+ value.name +'</button>';
							strZX +=str;
						}else if(prefix == "1"){
							strGAT +=str;
						}
                    }

                });

                var provTemplate = '<table>'+
					'<tr>'+
                        '<td class="tr-label">直辖市</td>'+
                        '<td>'+ strZX + '</td>' +
                    '</tr>'+
                    '<tr>'+
                        '<td class="tr-label">A-G</td>'+
                        '<td>'+ strA_G + '</td>' +
                    '</tr>' +
                    '<tr>' +
                         '<td class="tr-label">H-K</td>'+
                         '<td>' + strH_K+ '</td>'+
                    '</tr>'+
                    '<tr>' +
                        '<td class="tr-label">L-S</td>'+
                        '<td>' + strL_S+ '</td>'+
                    '</tr>'+
                    '<tr>' +
                        '<td class="tr-label">T-Z</td>'+
                        '<td>' + strT_Z+ '</td>'+
                    '</tr>'+
					'<tr style="border-bottom:0px;">' +
                        '<td class="tr-label"  >港澳台</td>'+
                        '<td>' + strGAT+ '</td>'+
                    '</tr>'+
                '</table>';
                pane.html(provTemplate);
            }
        },
        fillTabPane: function(slevel) {
            var html = $.ajax({
                url:  addrJsonUrl+this.currentAddressId+".json?time="+((new Date()).getTime()),
			  	//url:  ctx +"/nfs_data/json/"+this.currentAddressId+".json",
                async: false
            }).responseText;
			
            var jsonData = {};
			var data = {};
			var lastLevelMultiple = this.lastLevelMultiple;
			if(html){
				data= $.parseJSON(html).data;
				if(data.cityList){
					jsonData = data.cityList;
					this.headerTmpl.find(".city").parent().remove();
					this.headerTmpl.find(".county").parent().remove();
					this.headerTmpl.find(".town").parent().remove();
					this.headerTmpl.append(APGlobal.headTemplateCity);
					this.addressLevel = 1;
				}else if (data.countyList){
					jsonData = data.countyList;
					if((this.addressLevel-1) == 0){
						this.headerTmpl.find(".city").parent().remove();
					}
					this.headerTmpl.find(".county").parent().remove();
					this.headerTmpl.find(".town").parent().remove();
					this.headerTmpl.append(APGlobal.headTemplateCounty);
					
					if(this.pickerLevel==3){
						lastLevelMultiple = true;
					}
					this.addressLevel = 2;
				}else if(data.townList){
					jsonData = data.townList;
					if((this.addressLevel-1) == 1){
						this.headerTmpl.find(".county").parent().remove();
					}
					this.headerTmpl.find(".town").parent().remove();
					this.headerTmpl.append(APGlobal.headTemplateTown);
					if(this.pickerLevel==4){
						lastLevelMultiple = true;
					}
					this.addressLevel = 3;
				}
				var pane = this.picker.find("div.tab-pane:eq("+ this.addressLevel +")");
				var paneTemplate = "";
				var level = this.addressLevel;
				var parentId =  this.currentAddressId;
//				if (lastLevelMultiple) {
//					paneTemplate = '<div><label><input type="checkbox" class="ace" name="selectAll"><span class="lbl">全选</span></label>' +
//						'<button class="ok pull-right btn" name="ok">确定</button>' +
//						'</div>';
//				}
				///if(parent.attr("szs"))
				var parent = this.picker.find("div.tab-pane").find("button[value="+parentId+"]");
				$.each(jsonData, function(index, value) {
					//if (lastLevelMultiple) {
//						paneTemplate +=  '<label><input type="checkbox" class="ace" name="town-checkbox" value="'+value.id+'"><span class="lbl">'+value.name+'</span></label>';
//					}  else {
					var szs = "N",iszx = parent.attr("iszx");
					if(value.szs){
						szs = value.szs;
					}
					
					paneTemplate +=  '<button class=" btn-link" value="'+value.id+'" level="'+level+'" iszx = "'+iszx+'" parentId = "'+parentId+'" szs = "'+szs+'" slevel="'+slevel+'">'+value.name+'</button>';
				//	}
	
				});
				pane.html(paneTemplate);
			}			
			
			
        },
        moveLevel: function(level) {
            if (level > this.addressLevel) {
                return;
            }

            this.picker.find("li.active").removeClass("active");
            this.picker.find("a."+level).parent().addClass("active");

            this.picker.find("div.tab-pane.active").removeClass("active");
            this.picker.find("div."+level).addClass("active");
            //this.picker.find("div.tab-pane:eq("+ level +")").addClass("active");
        },
		selectBtn:function(){
			var selectedVal = this.selectedValue;
			var provDiv = this.picker.find("div.tab-pane.prov");
			var cityDiv = this.picker.find("div.tab-pane.city");
			var countyDiv = this.picker.find("div.tab-pane.county");
			var townDiv = this.picker.find("div.tab-pane.town");
			if(selectedVal.prov){
				provDiv.find("button").removeClass("active");
				provDiv.find("button[value="+selectedVal.prov+"]").addClass("active");
			}else{
				provDiv.find("button").removeClass("active");
			}
			if(selectedVal.city){
				cityDiv.find("button").removeClass("active");
				cityDiv.find("button[value="+selectedVal.city+"]").addClass("active");
			}else{
				cityDiv.find("button").removeClass("active");
			}
			if(selectedVal.county){
				countyDiv.find("button").removeClass("active");
				countyDiv.find("button[value="+selectedVal.county+"]").addClass("active");
			}else{
				countyDiv.find("button").removeClass("active");
			}
			if(selectedVal.town){
				townDiv.find("button").removeClass("active");
				townDiv.find("button[value="+selectedVal.town+"]").addClass("active");
			}else{
				townDiv.find("button").removeClass("active");
			}
		},
        moveNextLevel: function() {
            this.showLoading();
            var curContent = $("button[value="+this.currentAddressId+"]").html();
            var szs = $("button[value="+this.currentAddressId+"]").attr("szs");
            var isCantX = /县$/.test($.trim(curContent));
            if ((this.addressLevel === this.pickerLevel)||(this.selectedValue.prov == "71" && isCantX)){
            	if(this.callBack){
            		this.callBack(szs,this.currentAddressId);
            	}else{
            		this.fill();
            	}
                
                this.hide();
                this.hideLoading();
				this.selectedValue.town = this.currentAddressId;
                return;
            }

            this.fillTabPane(this.showLevel);


            var lis = this.picker.find("li");
            $(lis).removeClass("active");
            $(lis[this.showLevel]).addClass("active");

            var tab_panes =this.picker.find("div.tab-pane");
            $(tab_panes).removeClass("active");
            $(tab_panes[this.addressLevel]).addClass("active");
            if(!this.callBack){
            	this.setValue();
                this.fill();
            }
            this.hideLoading();
        },
        showLoading: function() {
            this.picker.append('<div class="message-loading-overlay"><i class="icon-spin icon-spinner orange2 bigger-160"></i></div>');
        },
        hideLoading: function() {
            this.picker.find('.message-loading-overlay').remove();
        },
        selectAll: function(selectAllBtn) {
            var checked = selectAllBtn.is(":checked");
            this.picker.find("div.tab-pane.active input:checkbox").each(function () {
                this.checked = checked;
            });
        },
        getAllCheckedIds: function() {
            var addressIds = [];
            this.picker.find("div.tab-pane.active  input[name=town-checkbox]:checked").each(function () {
                addressIds[addressIds.length] = $(this).val();
            });

            this.element.attr("addressId",addressIds.join(","));
            if(this.onChange){
					this.onChange();
				}
            this.hide();
        },
        click: function(e) {
            var target = $(e.target).closest('a, button, input');
            var $this = $(target);
            if (target.length === 1) {
                switch(target[0].nodeName.toLowerCase()) {
                    case 'a':
                        e.preventDefault();
                        this.moveLevel(target[0].className);
//                        switch(target[0].className) {
//                            case 'prov':
//                                this.moveLevel(0);
//                                break;
//                            case 'city':
//                                this.moveLevel(1);
//                                break;
//                            case 'county':
//                                this.moveLevel(2);
//                                break;
//                            case 'town':
//                                this.moveLevel(3);
//                               // this._setDate(date, which);
//                                break;
//                        }
                        break;
                    case 'button':

                        switch(target[0].name) {
                            case 'ok':
                                this.getAllCheckedIds();
                                break;
                            default:
                                e.preventDefault();
                                var addressContent =   $this.html();
                                this.addressLevel =  $this.attr("level");
                                var isCantX = /县$/.test($.trim(addressContent));
                                if ((this.selectedValue.prov == "71" && isCantX)){
                                	this.addressLevel = 3;
                                }
                                this.currentAddressId =  $this.val();
                                if(this.addressLevel == 0){
                                	this.selectedValue.prov = this.currentAddressId;
                                }
                                if(this.addressLevel == 1){
                                	this.selectedValue.city = this.currentAddressId;
                                }
                                if(this.addressLevel == 2){
                                	this.selectedValue.county = this.currentAddressId;
                                }
                                if(this.addressLevel == 3){
                                	this.selectedValue.town = this.currentAddressId;
                                }
								var parent = this.picker.find("div.tab-pane").find("button[value="+$this.attr("parentId")+"]");
								if(parent.attr("szs")=="Y" || parent.attr("iszx") == "1" ){
									this.showLevel =this.addressLevel -1; 
									
								}else if((parent.val() == "71" && isCantX)){
									this.showLevel =this.addressLevel -2; 
								}else{
									this.showLevel =this.addressLevel ;
								}
								if(!(addressContent == "县城" || addressContent == "城区")){
									this.viewAddress[this.showLevel++] =  addressContent;
								}
//								if(parent.attr("szs")=="Y"){
//									this.addressLevel--;
//								}
								this.addressLevel++;
								if(((this.addressLevel == 2)&& (this.pickerLevel==3) && $this.attr("szs")=="Y") || (this.pickerLevel == 2 && $this.attr("iszx") == "1")){
									this.addressLevel++;
                                }
                                
                                this.moveNextLevel();
								this.selectBtn();
                                break;
                        }
                        break;
                    case 'input':
                        switch(target[0].name) {
                            case 'selectAll':
                                this.selectAll($this);
                                //console.log("click allSelect " + $this.is(":checked"));
                                break;
                            case 'town-checkbox':
                                break;
                        }
                        break;

                }
            }
        }
    };



    $.fn.addresspicker = function ( option ) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
                data = $this.data('addresspicker'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('addresspicker', ( new AddressPicker(this, $.extend({}, $.fn.addresspicker.defaults,options))));
            }
            /*if (typeof option == 'string' && typeof data[option] == 'function') {
                data[option].apply(data, args);
            }*/
        });
    };

    $.fn.addresspicker.defaults = {
        pickerLevel:4,
        lastLevelMultiple: false
    };
    $.fn.addresspicker.Constructor = AddressPicker;

    var APTemplate = {
        headTemplateTemp: "",
        contTemplateTemp: ""
    };
	
	var province = [{"id":"11","name":"北京","addressNum":"0"},{"id":"50","name":"重庆","addressNum":"0"},{"id":"31","name":"上海","addressNum":"0"},{"id":"12","name":"天津","addressNum":"0"},{"id":"21","name":"辽宁","addressNum":"LN"},{"id":"15","name":"内蒙古","addressNum":"NMG"},{"id":"64","name":"宁夏","addressNum":"NX"},{"id":"63","name":"青海","addressNum":"QH"},{"id":"37","name":"山东","addressNum":"SD"},{"id":"14","name":"山西","addressNum":"SX"},{"id":"61","name":"陕西","addressNum":"SX"},{"id":"51","name":"四川","addressNum":"SC"},{"id":"34","name":"安徽","addressNum":"AH"},{"id":"35","name":"福建","addressNum":"FJ"},{"id":"44","name":"广东","addressNum":"GD"},{"id":"45","name":"广西","addressNum":"GX"},{"id":"46","name":"海南","addressNum":"HN"},{"id":"13","name":"河北","addressNum":"HB"},{"id":"41","name":"河南","addressNum":"HN"},{"id":"23","name":"黑龙江","addressNum":"HLJ"},{"id":"42","name":"湖北","addressNum":"HB"},{"id":"43","name":"湖南","addressNum":"HN"},{"id":"22","name":"吉林","addressNum":"JL"},{"id":"32","name":"江苏","addressNum":"JS"},{"id":"36","name":"江西","addressNum":"JX"},{"id":"52","name":"贵州","addressNum":"GZ"},{"id":"54","name":"西藏","addressNum":"XZ"},{"id":"65","name":"新疆","addressNum":"XJ"},{"id":"53","name":"云南","addressNum":"YN"},{"id":"33","name":"浙江","addressNum":"ZJ"},{"id":"62","name":"甘肃","addressNum":"GS"},{"id":"81","name":"香港","addressNum":"1"},{"id":"82","name":"澳门","addressNum":"1"},{"id":"71","name":"台湾","addressNum":"1"}];


    var APGlobal = {
        provJSON: province,
		provId:null,
        provTemplate: "",
        headTemplate :  '<ul class="address-tabs  padding-12 tab-color-blue">'+
                            '<li  class="active"><a  class="prov" > 省份 </a></li>'+
                          '</ul>',
		headTemplateCity:'<li> <a class="city" > 城市 </a></li>',
        headTemplateCounty: '<li> <a class="county" > 区县 </a></li>',
        headTemplateTown:  '<li> <a class="town" > 乡镇 </a></li>',

        contTemplate:
                '<div class="address-content">'+
                    '<div class="tab-pane active prov" ></div>'+
                    '<div class="tab-pane pane city"></div>'+
                    '<div class="tab-pane pane county"></div>'+
                    '<div class="tab-pane pane town"></div>'+
                '</div>'
    };


    APGlobal.template = '<div class="address-picker " style="width: 300px;">'+
                              APGlobal.headTemplate +
                              APGlobal.contTemplate +
                         '</div>';

    function getHeadTemplate() {
        return  '<ul class="nav nav-tabs address-tabs  padding-12 tab-color-blue">'+
                     '<li  class="active"><a  class="prov" > 省份 </a></li>'+
                    APTemplate.headTemplateTemp  +
                '</ul>';
    }
    function getTemplate() {
         return  '<div class="address-picker " style="width: 300px;">'+
                     getHeadTemplate() +
                     APGlobal.contTemplate +
                 '</div>';
    }

    $.fn.addresspicker.APGlobal = APGlobal;

}(jQuery));