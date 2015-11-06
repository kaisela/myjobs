/**
 * @description {Class} wdTree
 * This is the main class of wdTree.
 */
(function($) {
	$.fn.swapClass = function(c1, c2) {
		return this.removeClass(c1).addClass(c2);
	};
	$.fn.switchClass = function(c1, c2) {
		if (this.hasClass(c1)) {
			return this.swapClass(c1, c2);
		} else {
			return this.swapClass(c2, c1);
		}
	};
	$.fn.treeview = function(settings) {
		var dfop = {
			method: "POST",
			datatype: "json",
			/**
			 * @description {Config} url
			 * {String} Url for child nodes retrieving.
			 */
			url: false,
			/**
			 * @description {Config} cbiconpath
			 * {String} Checkbox image path.
			 */
			cbiconpath: "./css/images/icons/",
			icons: ["checkbox0.png", "checkbox1.png", "checkbox2.png"],
			/**
			 * @description {Config} showcheck
			 * {Boolean} Whether to show check box or not.
			 */
			showcheck: false,
			/**
			 * @description {Event} oncheckboxclick:function(tree, item, status)
			 * Fired when check box is clicked on.
			 * @param {Object} tree This tree object.
			 * @param {Object} item Node item clicked on.
			 * @param {Number} status 1 for checked, 0 for unchecked.
			 */
			oncheckboxclick: false,
			/**
			 * @description {Event} onnodeclick:function(tree, item)
			 * Fired when a node is clicked on.
			 * @param {Object} tree This tree object.
			 * @param {Object} item Ndde item clicked on.
			 */
			onnodeclick: false,
			/**
			 * @description {Config} cascadecheck
			 * {Boolean} Whether node being seleted leads to parent/sub node being selected.
			 */
			cascadecheck: true,
			/**
			 * @description {Config} data
			 * {Object} Tree theme. Three themes provided. 'bbit-tree-lines' ,'bbit-tree-no-lines' and 'bbit-tree-arrows'.
			 * @sample
			 * data:[{
			 * id:"node1", //node id
			 * text:"node 1", //node text for display.
			 * value:"1", //node value
			 * showcheck:false, //whether to show checkbox
			 * checkstate:0, //Checkbox checking state. 0 for unchecked, 1 for partial checked, 2 for checked.
			 * hasChildren:true, //If hasChildren and complete set to true, and ChildNodes is empty, tree will request server to get sub node.
			 * isexpand:false, //Expand or collapse.
			 * complete:false, //See hasChildren.
			 * ChildNodes:[] // child nodes
			 * }]
			 *  */
			data: null,
			/**
			 * @description {Config} clicktoggle
			 * {String} Whether to toggle node when node clicked.
			 */
			clicktoggle: true,
			source: null,
			searchData: [],
			/**
			 * @description {Config} theme
			 * {String} Tree theme. Three themes provided. 'bbit-tree-lines' ,'bbit-tree-no-lines' and 'bbit-tree-arrows'.
			 */
			theme: "bbit-tree-arrows" //bbit-tree-lines ,bbit-tree-no-lines,bbit-tree-arrows
		};

		$.extend(dfop, settings);
		var treenodes = dfop.data;
		dfop.searchData = dfop.data;
		var me = $(this);
		var id = me.attr("id");
		if (id == null || id == "") {
			id = "bbtree" + new Date().getTime();
			me.attr("id", id);
		}
		var pids = [];
		var html = [];
		buildtree(dfop.data, html, dfop.source);
		me.addClass("bbit-tree").html(html.join(""));
		InitEvent(me);
		html = null;
		//pre load the icons
		if (dfop.showcheck) {
			for (var i = 0; i < 3; i++) {
				var im = new Image();
				im.src = dfop.cbiconpath + dfop.icons[i];
			}
		}

		//region 
		function buildtree(data, ht, source) {
				ht.push('<div class="dd" id="nestable">'); // Wrap ;
				ht.push('<ol class="dd-list ',dfop.theme,'">'); // body ;
				if (data && data.length > 0) {
					var l = data.length;
					for (var i = 0; i < l; i++) {
						buildnode(data[i], ht, 0, i, i == l - 1, source);
					}
				} else {
					asnyloadc(null, false, function(data) {
						if (data && data.length > 0) {
							treenodes = data;
							dfop.data = data;
							var l = data.length;
							for (var i = 0; i < l; i++) {
								buildnode(data[i], ht, 0, i, i == l - 1, source);
							}
						}
					});
				}
				ht.push("</ol>"); // root and;
				ht.push("</div>"); // body end;
			}
			//endregion

		function buildnode(nd, ht, deep, path, isend, source, pid) {
			if (nd.udbuild) {
				return;
			}
			var nid = nd.id.replace(/[^\w]/gi, "_");
			var pid;
			if (nd.parent && nd.parent != -1) {
				pid = nd.parent.id.replace(/[^\w]/gi, "_");
			}
			ht.push('<li class="dd-item" data-id="',nid,'">');
			var itemMargin = 0;
			var pids = [];
			if (deep > 0) {
				for (var j = 0; j < deep; j++) {
					itemMargin = itemMargin + 30;
				}
				getParents(nd, pids, function(item) {
					return item.id
				})
			}

			ht.push("<div pid='", pid, "', id='", id, "_", nid, "' tpath='",
				path, "' unselectable='on' title='", nd.text, "'");
			//ht.push(' style="margin-left:',itemMargin,'px;"');

			var cs = [];
//			cs.push("bbit-tree-node-el");
//			if (nd.hasChildren) {
//				cs.push(nd.isexpand ? "bbit-tree-node-expanded" : "bbit-tree-node-collapsed");
//			} else {
//				cs.push("bbit-tree-node-leaf");
//			}
//			if (nd.classes) {
//				cs.push(nd.classes);
//			}

			ht.push(" class='node-row ", cs.join(" "), "'>");

		//	ht.push('<div class="node-row" >');
			ht.push('<div class="row-li">');

			cs.length = 0;
			if (nd.hasChildren) {
				if (nd.isexpand) {
					cs.push(isend ? "bbit-tree-elbow-end-minus" : "bbit-tree-elbow-minus");
				} else {
					cs.push(isend ? "bbit-tree-elbow-end-plus" : "bbit-tree-elbow-plus");
				}
			} else {
				cs.push(isend ? "bbit-tree-elbow-end" : "bbit-tree-elbow");
			}
			ht.push("<img class='bbit-tree-ec-icon ", cs.join(" "), "' src='" + dfop.cbiconpath + "s.gif'/>");
			
			if (dfop.showcheck && nd.showcheck) {
				if (nd.checkstate == null || nd.checkstate == undefined) {
					nd.checkstate = 0;
				}
				ht.push("<img  id='", id, "_", nid,
					"_cb' class='bbit-tree-node-cb' src='",
					dfop.cbiconpath, dfop.icons[nd.checkstate], "'/>");
			}
			//a
			ht
				.push("<a hideFocus class='bbit-tree-node-anchor' tabIndex=1 href='javascript:void(0);'>");
			ht.push("<span unselectable='on'>", nd.text, "</span>");
			ht.push("</a>");
			ht.push("</div>");

			if (dfop.source != null) {
				ht.push(dfop.source(nid, deep, pids, nd));
			}
			ht.push("<div class='clearfix'></div>");
			ht.push("</div>");
			

			//ht.push("</div>");
			//Child
			if (nd.hasChildren) {
				if (nd.isexpand) {
					ht
						.push("<ol  class='dd-list bbit-tree-node-ct' >");
					if (nd.ChildNodes) {
						var l = nd.ChildNodes.length;
						for (var k = 0; k < l; k++) {
							nd.ChildNodes[k].parent = nd;
							buildnode(nd.ChildNodes[k], ht, deep + 1, path + "." + k, k == l - 1, source);
						}
					}
					ht.push("</ol>");
				} else {
					ht.push("<ol style='display:none;'></ol>");
				}
			}
			ht.push("</li>");
			nd.render = true;
		}

		function getItem(path) {
			var ap = path.split(".");
			var t = treenodes;
			for (var i = 0; i < ap.length; i++) {
				if (i == 0) {
					t = t[ap[i]];
				} else {
					t = t.ChildNodes[ap[i]];
				}
			}
			return t;
		}

		function check(item, state, type) {
				var pstate = item.checkstate;
				if (type == 1) {
					item.checkstate = state;
				} else { // go to childnodes
					var cs = item.ChildNodes;
					var l = cs.length;
					var ch = true;
					for (var i = 0; i < l; i++) {
						if ((state == 1 && cs[i].checkstate != 1) || state == 0 && cs[i].checkstate != 0) {
							ch = false;
							break;
						}
					}
					if (ch) {
						item.checkstate = state;
					} else {
						item.checkstate = 2;
					}
				}
				//change show
				if (item.render && pstate != item.checkstate) {
					var nid = item.id.replace(/[^\w]/gi, "_");
					var et = $("#" + id + "_" + nid + "_cb");
					if (et.length == 1) {
						et.attr("src", dfop.cbiconpath + dfop.icons[item.checkstate]);
					}
				}
			}
			//iterate all children nodes

		function cascade(fn, item, args) {
				if (fn(item, args, 1) != false) {
					if (item.ChildNodes != null && item.ChildNodes.length > 0) {
						var cs = item.ChildNodes;
						for (var i = 0, len = cs.length; i < len; i++) {
							cascade(fn, cs[i], args);
						}
					}
				}
			}
			//bubble to parent

		function bubble(fn, item, args) {
			var p = item.parent;
			while (p) {
				if (fn(p, args, 0) === false) {
					break;
				}
				p = p.parent;
			}
		}

		function nodeclick(e) {
			var path = $(this).attr("tpath");
			var et = e.target || e.srcElement;
			var item = getItem(path);
			if (et.tagName == "IMG") {
				//+ if collapsed, expend it 
				if ($(et).hasClass("bbit-tree-elbow-plus") || $(et).hasClass("bbit-tree-elbow-end-plus")) {
					var ul = $(this).next(); //"bbit-tree-node-ct"
					if (ul.hasClass("bbit-tree-node-ct")) {
						ul.show();
					} else {
						var deep = path.split(".").length;
						if (item.complete) {
							item.ChildNodes != null && asnybuild(item.ChildNodes, deep, path,
								ul, item);
						} else {
							$(this).addClass("bbit-tree-node-loading");
							asnyloadc(item, true, function(data) {
								item.complete = true;
								item.ChildNodes = data;
								asnybuild(data, deep, path, ul, item);
							});
						}
					}
					if ($(et).hasClass("bbit-tree-elbow-plus")) {
						$(et).swapClass("bbit-tree-elbow-plus",
							"bbit-tree-elbow-minus");
					} else {
						$(et).swapClass("bbit-tree-elbow-end-plus",
							"bbit-tree-elbow-end-minus");
					}
					$(this).swapClass("bbit-tree-node-collapsed",
						"bbit-tree-node-expanded");
				}
				//if expended, collapse it
				else if ($(et).hasClass("bbit-tree-elbow-minus") || $(et).hasClass("bbit-tree-elbow-end-minus")) {
					$(this).next().hide();
					if ($(et).hasClass("bbit-tree-elbow-minus")) {
						$(et).swapClass("bbit-tree-elbow-minus",
							"bbit-tree-elbow-plus");
					} else {
						$(et).swapClass("bbit-tree-elbow-end-minus",
							"bbit-tree-elbow-end-plus");
					}
					$(this).swapClass("bbit-tree-node-expanded",
						"bbit-tree-node-collapsed");
				} else if ($(et).hasClass("bbit-tree-node-cb")) // click on checkbox
				{
					var s = item.checkstate != 1 ? 1 : 0;
					var r = true;
					if (dfop.oncheckboxclick) {
						r = dfop.oncheckboxclick.call(et, item, s);
					}
					if (r != false) {
						if (dfop.cascadecheck) {
							cascade(check, item, s);
							bubble(check, item, s);
						} else {
							check(item, s, 1);
						}
					}
				}
			} else {
				if (dfop.citem) {
					var nid = dfop.citem.id.replace(/[^\w]/gi, "_");
					$("#" + id + "_" + nid).find(".bg-node").removeClass(
						"bbit-tree-selected");
				}
				dfop.citem = item;
				$(this).find(".bg-node").addClass("bbit-tree-selected");
				if (dfop.onnodeclick) {
					if (!item.expand) {
						item.expand = function() {
							expandnode.call(item);
						};
					}
					dfop.onnodeclick.call(this, item);
				}
			}
		}

		function expandnode() {
			var item = this;
			var nid = item.id.replace(/[^\w]/gi, "_");
			var img = $("#" + id + "_" + nid + " img.bbit-tree-ec-icon");
			if (img.length > 0) {
				img.click();
			}
		}

		function asnybuild(nodes, deep, path, ul, pnode) {
			var l = nodes.length;
			if (l > 0) {
				var ht = [];
				for (var i = 0; i < l; i++) {
					nodes[i].parent = pnode;
					//					if (deep <= pids.length) {
					//						pids.pop();
					//					}
					//	pids.push(pnode.id);

					buildnode(nodes[i], ht, deep, path + "." + i, i == l - 1);
				}
				ul.html(ht.join(""));
				ht = null;
				InitEvent(ul);
			}
			ul.addClass("bbit-tree-node-ct").css({
				"z-index": 0,
				position: "static",
				visibility: "visible",
				top: "auto",
				left: "auto",
				display: ""
			});
			ul.prev().removeClass("bbit-tree-node-loading");
		}

		function asnyloadc(pnode, isAsync, callback) {
			if (dfop.url) {
				if (pnode && pnode != null)
					var param = builparam(pnode);
				$.ajax({
					type: dfop.method,
					url: dfop.url,
					data: param,
					async: isAsync,
					dataType: dfop.datatype,
					success: callback,
					error: function(e) {
						alert("error occur!");
					}
				});
			}
		}

		function builparam(node) {
			var p = [{
				name: "id",
				value: encodeURIComponent(node.id)
			}, {
				name: "text",
				value: encodeURIComponent(node.text)
			}, {
				name: "value",
				value: encodeURIComponent(node.value)
			}, {
				name: "checkstate",
				value: node.checkstate
			}];
			return p;
		}

		function bindevent() {
			$(this).hover(function() {
				$(this).find(".bg-node").addClass("bbit-tree-node-over");
			}, function() {
				$(this).find(".bg-node").removeClass("bbit-tree-node-over");
			}).click(nodeclick).find("img.bbit-tree-ec-icon").each(function(e) {
				if (!$(this).hasClass("bbit-tree-elbow")) {
					$(this).hover(function() {
						$(this).parent().addClass("bbit-tree-ec-over");
					}, function() {
						$(this).parent().removeClass("bbit-tree-ec-over");
					});
				}
			});
		}

		function InitEvent(parent) {
			var nodes = $("li.bbit-tree-node>div", parent);
			nodes.each(bindevent);
		}

		function reflash(itemId) {
			var nid = itemId.replace(/[^\w-]/gi, "_");
			var node = $("#" + id + "_" + nid);
			if (node.length > 0) {
				node.addClass("bbit-tree-node-loading");
				var isend = node.hasClass("bbit-tree-elbow-end") || node.hasClass("bbit-tree-elbow-end-plus") || node.hasClass("bbit-tree-elbow-end-minus");
				var path = node.attr("tpath");
				var deep = path.split(".").length;
				var item = getItem(path);
				if (item) {
					asnyloadc(item, true, function(data) {
						item.complete = true;
						item.ChildNodes = data;
						item.isexpand = true;
						if (data && data.length > 0) {
							item.hasChildren = true;
						} else {
							item.hasChildren = false;
						}
						var ht = [];
						buildnode(item, ht, deep - 1, path, isend);
						ht.shift();
						ht.pop();
						var li = node.parent();
						li.html(ht.join(""));
						ht = null;
						InitEvent(li);
						bindevent.call(li.find(">div"));
					});
				}
			} else {
				//node not created yet
			}
		}

		function _getSearchData(items, key, c) {
			for (var i = 0, l = items.length; i < l; i++) {
				if (items[i].ChildNodes != null && items[i].ChildNodes.length > 0) {
					getSearchData(items[i].ChildNodes, key, c);
				}
				if (items[i].pinyin.indexOf(key) == -1) {
					if (!items[i].ChildNodes || items[i].ChildNodes.length == 0) {
						items.splice(i, 1);
						i--;
						l--;
					}
				}
			}
		}

		function getParents(node, c, fn) {

			if (node.parent != -1 && typeof(node.parent) != "undefined") {
				c.push(fn(node.parent));
				getParents(node.parent, c, fn);
			}
		}

		function isPartentFlag(item, parent, flags) {

			if (item == parent.id) {
				flags.push(true);
			} else {
				if (parent != -1) {
					isPartentFlag(item, parent.parent, flags);
				}
			}
		}

		function isContain(item, parents, flags) {
			//	for(var i=0 ;i<parents.length;i++){
			if (parents.length > 0) {
				isPartentFlag(item, parents[0], flags);
			}
			//	}
		}

		function getSearchData(items, key, c, parent, pid) {

			for (var i = 0, l = items.length; i < l; i++) {
				if (parent) {
					items[i].parent = parent;
				}
				if (pid) {
					items[i].udbuild = false;
					if (items[i].ChildNodes != null && items[i].ChildNodes.length > 0) {
						getSearchData(items[i].ChildNodes, key, c, items[i],
							pid);
					}
				} else {
					if (items[i].pinyin == key || items[i].text == key || items[i].jianpin == key) {
						c.push(parent);
						items[i].isexpand = true;
						if (items[i].ChildNodes != null && items[i].ChildNodes.length > 0) {
							getSearchData(items[i].ChildNodes, key, c,
								items[i], items[i].id);
						}
					} else if (items[i].ChildNodes != null && items[i].ChildNodes.length > 0) {
						getSearchData(items[i].ChildNodes, key, c, items[i]);
					}
					var flags = [],
						flag = false;
					isContain(items[i].id, c, flags);
					if (flags.length > 0) {
						flag = true;
					}
					if (items[i].pinyin != key && items[i].text != key && items[i].jianpin != key && !flag) {
						//  	if(!items[i].ChildNodes || items[i].ChildNodes.length == 0){
						items[i].udbuild = true;
						//	}
					} else {
						items[i].udbuild = false;
					}
				}

			}
		}

		function reBuildTree(items) {
			for (var i = 0, l = items.length; i < l; i++) {
				items[i].udbuild = false;
				if (items[i].ChildNodes != null && items[i].ChildNodes.length > 0) {
					reBuildTree(items[i].ChildNodes);
				}
			}
		}

		function clickSearch(searchData, c) {
			for (var i = 0, l = searchData.length; i < l; i++) {
				var flag = true;
				for (var j = 0; j < c.length; j++) {
					if (searchData[i].id == c[j].id) {
						flag = false;
						break;
					}
				}
				me.find("#tree_" + searchData[i].id).find(
					".bbit-tree-elbow-plus").click();
				me.find("#tree_" + searchData[i].id).find(
					".bbit-tree-elbow-end-plus").click();
				if (flag) {
					if (searchData[i].ChildNodes != null && searchData[i].ChildNodes.length > 0) {
						clickSearch(searchData[i].ChildNodes, c);
					}
				}

			}
		}

		function reload() {
			me.html("");
			pids = [];
			var html = [];
			buildtree(dfop.searchData, html, dfop.source);
			me.addClass("bbit-tree").html(html.join(""));
			InitEvent(me);
			html = null;
			//pre load the icons
			if (dfop.showcheck) {
				for (var i = 0; i < 3; i++) {
					var im = new Image();
					im.src = dfop.cbiconpath + dfop.icons[i];
				}
			}
		}

		function getck(items, c, fn) {
			for (var i = 0, l = items.length; i < l; i++) {
				(items[i].showcheck == true && items[i].checkstate == 1) && c.push(fn(items[i]));
				if (items[i].ChildNodes != null && items[i].ChildNodes.length > 0) {
					getck(items[i].ChildNodes, c, fn);
				}
			}
		}

		function getParentCk(items, deep, c, fn) {
			for (var i = 0, l = items.length; i < l; i++) {
				items[i].deep = deep;
				(items[i].showcheck == true && items[i].checkstate == 1) && c.push(fn(items[i]));
				if (items[i].ChildNodes != null && items[i].ChildNodes.length > 0 && items[i].checkstate == 2) {
					getParentCk(items[i].ChildNodes, (deep + 1), c, fn);
				}
			}
		}

		function getCkAndHalfCk(items, c, fn) {
			for (var i = 0, l = items.length; i < l; i++) {
				(items[i].showcheck == true && (items[i].checkstate == 1 || items[i].checkstate == 2)) && c.push(fn(items[i]));
				if (items[i].ChildNodes != null && items[i].ChildNodes.length > 0) {
					getCkAndHalfCk(items[i].ChildNodes, c, fn);
				}
			}
		}
		me[0].t = {
			getSelectedNodes: function(gethalfchecknode) {
				var s = [];
				if (gethalfchecknode) {
					getCkAndHalfCk(treenodes, s, function(item) {
						return item;
					});
				} else {
					getck(treenodes, s, function(item) {
						return item;
					});
				}
				return s;
			},
			getSelectedValues: function() {
				var s = [];
				getck(treenodes, s, function(item) {
					return item.value;
				});
				return s;
			},
			getCurrentItem: function() {
				return dfop.citem;
			},
			reflash: function(itemOrItemId) {
				var id;
				if (typeof(itemOrItemId) == "string") {
					id = itemOrItemId;
				} else {
					id = itemOrItemId.id;
				}
				reflash(id);
			},
			reload: function() {
				reload();
			},
			getParentCk: function() {
				var s = [];
				getParentCk(treenodes, 1, s, function(item) {
					return item;
				});
				return s;
			},
			getParentCkValue: function(onlyValue) {
				var s = [];
				getParentCk(treenodes, 1, s, function(item) {
					if (onlyValue) {
						return item.value;
					} else {
						return item.value + "," + item.deep;
					}
				});
				return s;
			},
			search: function(key) {
				var flag = false;
				var c = [];
				if (key && $.trim(key) != "") {
					var s = treenodes;
					getSearchData(s, key, c, -1);
					dfop.searchData = s;
					flag = true;
				} else {
					var s = treenodes;
					reBuildTree(s);
					dfop.searchData = s;
				}
				reload();
				if (flag) {
					clickSearch(dfop.searchData, c);
				}
			}
		};
		return me;
	};
	//get all checked nodes, and put them into array. no hierarchy
	$.fn.getCheckedNodes = function() {
		if (this[0].t) {
			return this[0].t.getSelectedValues();
		}
		return null;
	};
	$.fn.getTSNs = function(gethalfchecknode) {
		if (this[0].t) {
			return this[0].t.getSelectedNodes(gethalfchecknode);
		}
		return null;
	};
	$.fn.getCurrentNode = function() {
		if (this[0].t) {
			return this[0].t.getCurrentItem();
		}
		return null;
	};
	$.fn.reflash = function(ItemOrItemId) {
		if (this[0].t) {
			return this[0].t.reflash(ItemOrItemId);
		}
	};
	$.fn.reload = function() {
		if (this[0].t) {
			return this[0].t.reload();
		}
	};
	$.fn.getParentCkNodes = function() {
		if (this[0].t) {
			return this[0].t.getParentCk();
		}
	}
	$.fn.getParentCkValue = function(onlyValue) {
		if (this[0].t) {
			return this[0].t.getParentCkValue(onlyValue);
		}
	}
	$.fn.searchData = function(key) {
		if (this[0].t) {
			return this[0].t.search(key);
		}
	}
})(jQuery);