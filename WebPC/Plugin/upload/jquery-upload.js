(function ($) {
    var helper = {
        getSizeDesc: function (size) {
            var desc = "";
            if (size < 1024) {
                desc = size + "字节";
            } else {
                if (size < 1024 * 1024) {
                    desc = Math.round(size / 1024, 2) + "K";
                } else {
                    desc = Math.round(size / (1024 * 1024), 2) + "M";
                }
            }
            return desc;
        },
        getAcceptDescArr: function (data) {
            var acceptDescArr = [];
            var acceptArr = data.accept.split(",");
            for (var i = 0; i < acceptArr.length ; i++) {
                var acceptItem = acceptArr[i];
                acceptDescArr.push(acceptItem.split("/")[1]);
            }
            return acceptDescArr;
        },
        buildSingleView: function ($container, data) {
            var initHtml = [];
            initHtml.push('<div class="select_single">' +
                            '<img  class="file-add" data-func="addFile" style="height:200px;width:200px" src="../images/logo.png"/>' +
                          '</div>');
            initHtml.push('<div>' +
                            '<p class="errorMessage" style="font-size: 13px;"></p></div>');
            initHtml.push('<input style="display: none" data-func="selectFile" type="file" size="' + data.size + '" accept="' + data.accept + '" ' + (data.multiple ? ' multiple="multiple"' : "") + ' />' +
                          '</div>');
            $container.html(initHtml.join(""));
        },
        buildUploadView: function ($container, data) {
            var initHtml = [];
            initHtml.push('<div style="float:left;">' +
                                '<img class="file-add" src="../images/add.png" data-func="addFile" title="添加文件">' +
                              '</div>');

            initHtml.push('<div class="file-desc">' +
                            '<p class="errorMessage" style="font-size: 13px;"></p>' +
                            '<p style="color: gray;font-size: 9px;">文件为:' + data.acceptDescArr.join("/") + '类型</p>' +
                          '</div>');
            initHtml.push('<div style="clear:both">' +
                            '<hr>');
            initHtml.push('<div data-func="images">' +
                          '</div>');
            initHtml.push('<input style="display: none" data-func="selectFile" type="file" size="' + data.size + '" accept="' + data.accept + '" ' + (data.multiple ? ' multiple="multiple"' : "") + ' />' +
                          '</div>');
            $container.html(initHtml.join(""));
        },
        buildPreview: function (data) {
            //var ext = data.file.name.substring(data.file.name.lastIndexOf("."));
            //var name = data.file.name.substring(0, data.file.name.lastIndexOf("."));
            //var fileName = name.subLongStr(5, true) + ext;
            var html = [];
            html.push('<div data-key="' + data.fileId + '" class="preview-image">');
            html.push(' <a data-key="' + data.fileId + '" class="close" href="javascript:void(0)">');
            html.push('     <img src="../images/close.png" />');
            html.push(' </a>');
            html.push('<img class="file-img" src="' + data.filePath + '" alt="audio" />');
            html.push('</div>');
            return html.join("");
        },
        buildVideoPreview: function (data) {
            var html = [];
            html.push('<div data-key="' + data.fileId + '" class="preview-image">');
            html.push(' <a data-key="' + data.fileId + '" class="close" href="javascript:void(0)">');
            html.push('     <img src="../images/close.png" />');
            html.push(' </a>');
            html.push('<img class="file-img" src="../images/music.png" />');
            html.push('<audio style="display: none" src="' + data.filePath + '"   controls="controls"> </audio>');
            html.push('<i data-status="pause" class="file-control play"  />');
            html.push('</div>');
            return html.join("");
        },
        postFile: function (url, formData, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var resultData = xhr.responseText;
                    if (xhr.status == 200) {
                        callback(true, resultData);
                    }
                    else {
                        callback(false, resultData);
                    }
                }
            };
        },
        refreshElement: function ($ele, idArr) {
            var oldVal = $ele.val();
            var oldArr = [];
            if (oldVal) {
                oldArr = oldVal.split(';');
            }

            oldArr = oldArr.concat(idArr);
            var newArr = unique(oldArr);
            $ele.val(newArr.join(";"));
        }
    };
    var methods = {
        init: function (options) {
            // 在每个元素上执行方法
            return this.each(function () {
                var $this = $(this);
                var settings = $this.data("Updaload");
                if (typeof settings === "undefined") {
                    var defaults = {
                        enabled: false
                    };
                    settings = $.extend({}, defaults, options);
                    $this.data("Updaload", settings);
                } else {
                    settings = $.extend({}, settings, options);
                    $this.data("Updaload", settings);
                }
                var fileTypes = {
                    ".doc": "../images/filesType/2012112622200086.png",
                    ".html": "../images/filesType/2012112622200086.png",
                    ".txt": "../images/filesType/2012112622200329.png",
                    ".rar": "../images/filesType/2012112622200353.png",
                    ".css": "../images/filesType/2012112622200398.png",
                    ".wmv": "../images/filesType/2012112622200437.png",
                    ".wav": "../images/filesType/2012112622200442.png",
                    ".docx": "../images/filesType/2012112622200539.png",
                    ".zip": "../images/filesType/2012112622200553.png",
                    ".xls": "../images/filesType/2012112622200560.png",
                    ".xlsx": "../images/filesType/2012112622200560.png",
                    ".pdf": "../images/filesType/2012112622195753.png",
                    ".ppt": "../images/filesType/2012112622200266.png",
                    ".pptx": "../images/filesType/2012112622200266.png",
                    ".gif": "../images/filesType/2012112622200596.png",
                    ".chm": "../images/filesType/2015012022013709.png",
                    ".avi": "../images/filesType/2015012022012607.png",
                    ".mp4": "../images/filesType/2015012022013454.png",
                    ".mp3": "../images/filesType/2015012022013459.png",
                }
                //正式开始逻辑代码
                var data = {
                    id: $this.attr("id"),//跨域时容器需要传入id
                    accept: $this.attr("data-accept"),
                    url: $this.attr("data-url"),
                    size: $this.attr("data-size"),
                    callbackEle: $this.attr("data-callback-element"),
                    callbackFunc: $this.attr("data-callback-func"),
                    multiple: $this.attr("data-multiple"),
                    parttern: $this.attr("data-parttern"),
                    path: $this.attr("data-path"),
                    max: parseInt($this.attr("data-max")),
                    imgType: $this.attr("data-image-type"),
                    acceptDescArr: [],
                    crossdomain: $this.attr("data-cross-domain"),
                    crossdomainReceiveUrl: publicConfig.ImgServiceURL+"/receive.html",
                    childDomain: publicConfig.ImgServiceURL
                };
                data.acceptDescArr = data.accept == "notlimit" ? ["不限制文件"] : helper.getAcceptDescArr(data);
                var $callbackEle = $('[name=' + data.callbackEle + ']');
                var callbackEleVal = $callbackEle.val();
                var existFileArr = callbackEleVal ? $callbackEle.val().split(";") : [];
                var crossdomainFrameId = data.id + "_Frame";
                if (data.crossdomain && data.crossdomain == "true") {
                    var height = 240;
                    if (data.imgType == "9" ) {
                        height = 170;
                    }
                    //if (data.parttern == "single") {
                    //    width = 250;
                    //}
                    $this.append('<iframe style="height: ' + height + 'px;border:none;width: 100%;" src="' + data.crossdomainReceiveUrl + '" id="' + data.id + "_Frame" + '"></iframe> ');
                    data.callbackEleVal = callbackEleVal;
                    window.addEventListener("message", function (event) {
                        if (event.data.type == "ready") {
                            document.getElementById(crossdomainFrameId).contentWindow.postMessage(
                                { data: data },
                                data.childDomain);
                        } else if (event.data.type == "remove") {
                            if (event.data.pluginId == data.id) {
                                var oldArr = $('input[name=' + data.callbackEle + ']').val().split(";");
                                for (var i = 0; i < oldArr.length; i++) {
                                    var item = oldArr[i];
                                    if (item == event.data.data) {
                                        oldArr.splice(i, 1);
                                    }
                                }
                                $('input[name=' + data.callbackEle + ']').val(oldArr.join(";"));
                                callback(event.data.status, event.data.data);
                            }

                        } else if (event.data.type == "upload") {
                            if (event.data.pluginId == data.id) {
                                callback(event.data.status, event.data.data);
                            }
                            //返回的file数据

                        }
                    }, false);
                    return;
                }

                if (data.parttern == "single") {
                    //单图模式
                    helper.buildSingleView($this, data);
                }
                else {
                    //多文件模式
                    helper.buildUploadView($this, data);
                }

                //上传完成回调
                function callback(status, result) {
                    if (status) {
                        var jsonResult = JSON.parse(result);
                        var idArr = [];
                        for (var k = 0; k < jsonResult.length; k++) {
                            if (data.crossdomain != "true") {
                                if (data.parttern == "single") {
                                    $this.find('[data-func="addFile"]').attr("src", data.path.format(jsonResult[k].Path));
                                    $('input[name=' + data.callbackEle + ']').val(jsonResult[k].FileKey);
                                } else {
                                    if ($this.find("div[data-key='" + jsonResult[k].FormKey + "']").length == 0) {
                                        continue;;
                                    }
                                    $this.find("div[data-key='" + jsonResult[k].FormKey + "']").attr("data-key", jsonResult[k].Path);
                                    $this.find("div[data-key='" + jsonResult[k].Path + "'] .close").attr("data-key", jsonResult[k].Path);
                                    if (jsonResult[k].IsImage) {
                                        $this.find("div[data-key='" + jsonResult[k].Path + "'] .file-img").attr("src", data.path.format(jsonResult[k].Path));
                                    } else {
                                        var icon = fileTypes[jsonResult[k].Ext];
                                        $this.find("div[data-key='" + jsonResult[k].Path + "'] .file-img").attr("src", icon ? icon : "../images/files.png");
                                        $this.find("div[data-key='" + jsonResult[k].Path + "'] audio").attr("src", data.path.format(jsonResult[k].Path));
                                    }
                                    idArr.push(jsonResult[k].FileKey);
                                }
                                helper.refreshElement($('input[name=' + data.callbackEle + ']'), idArr);
                            } else {
                                if (data.parttern == "single") {
                                    $('input[name=' + data.callbackEle + ']').val(jsonResult[k].FileKey);
                                } else {
                                    idArr.push(jsonResult[k].FileKey);
                                    helper.refreshElement($('input[name=' + data.callbackEle + ']'), idArr);
                                }
                            }
                        }
                    }
                    if (data.callbackFunc && window[data.callbackFunc]) {
                        window[data.callbackFunc](status);
                    }
                }

                for (var j = 0; j < existFileArr.length; j++) {
                    var eData = {
                        fileId: existFileArr[j],
                        filePath: data.path.format(existFileArr[j])
                    }
                    if (data.parttern == "single") {
                        $this.find('[data-func="addFile"]').attr("src", eData.filePath);
                    } else if (data.parttern == "video") {
                        //音频模式
                        $this.find("div[data-func='images']").append(helper.buildVideoPreview(eData));
                    } else {
                        $this.find("div[data-func='images']").append(helper.buildPreview(eData));
                    }
                }

                $this.find("[data-func='addFile']").click(function () {
                    $this.find("[data-func='selectFile']").trigger("click");
                });
                $this.on("change", "[data-func='selectFile']", function () {
                    for (var i = 0; i < this.files.length; i++) {
                        var fileItem = this.files[i];
                        var totalLength = $this.find("div[data-func='images']").find(".preview-image").size() + this.files.length;
                        if (totalLength > data.max) {
                            $this.find(".errorMessage").html("文件超过最大个数，最多为" + data.max + "个!");
                            return;
                        }
                        if (data.accept != "notlimit") {
                            if (!fileItem.type || data.accept.indexOf(fileItem.type) == -1) {
                                $this.find(".errorMessage").html("文件" + fileItem.name + ",类型错误。文件类型必须为:" + data.accept);
                                return;
                            }
                        }
                        if (fileItem.size > parseInt($(this).attr("size") * 1024)) {
                            $this.find(".errorMessage").html("文件" + fileItem.name + ",超过大小限制。文件最大不能超过" + $(this).attr("size") + "K");
                            return;
                        }
                    }
                    $this.find(".errorMessage").html("");
                    var formData = new FormData();
                    var filesObj = [];
                    for (var j = 0; j < this.files.length; j++) {
                        var file = this.files[j];
                        file.id = Guid.NewGuid();
                        filesObj.push({ formKey: file.id, file: file });
                        formData.append(file.id, file);
                        var fileData = {
                            fileId: file.id,
                            filePath: "../images/loading.gif"
                        }
                        if (data.parttern == "single") {
                            $this.find('[data-func="addFile"]').attr("src", '../images/loading.gif');
                        } else if (data.parttern == "video") {
                            $this.find("div[data-func='images']").append(helper.buildVideoPreview(fileData));
                        } else {
                            $this.find("div[data-func='images']").append(helper.buildPreview(fileData));
                        }
                    }


                    //如果是跨域请求
                    if (data.crossdomain && data.crossdomain == "true") {
                        document.getElementById(crossdomainFrameId).contentWindow.postMessage(
                            { url: data.url, files: filesObj },
                            data.childDomain);
                    } else {
                        helper.postFile(data.url, formData, function (status, result) {
                            callback(status, result);
                        });
                    }

                });
                $this.on("click", ".file-control[data-status]", function () {
                    var status = $(this).attr("data-status");
                    if (status == "pause") {
                        $(this).removeClass("play").addClass("pause").attr("data-status", "play");
                        $(this).prev()[0].play();
                    } else {
                        $(this).removeClass("pause").addClass("play").attr("data-status", "pause");
                        $(this).prev()[0].pause();
                    }

                });
                $this.on("click", ".close", function () {
                    var dataKey = $(this).attr("data-key");
                    $this.find("div[data-key='" + dataKey + "']").remove();
                    /*重置input file 防止出现无法选择问题*/
                    var $selectFile = $this.find("[data-func='selectFile']");
                    $selectFile.after($selectFile.clone().val(""));
                    $selectFile.remove();
                    //回调input
                    var oldArr = $('input[name=' + data.callbackEle + ']').val().split(";");
                    for (var i = 0; i < oldArr.length; i++) {
                        var item = oldArr[i];
                        if (item == dataKey) {
                            oldArr.splice(i, 1);
                        }
                    }
                    $('input[name=' + data.callbackEle + ']').val(oldArr.join(";"));
                });
            });
        },
        destroy: function (options) {
            // 在每个元素中执行代码
            return $(this).each(function () {
                var $this = $(this);
                // 执行代码
                // 删除元素对应的数据
                $this.removeData("Upload");
            });
        }
    };
    $.fn.Upload = function () {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof method === "object" || !method) {
            method = methods.init;
        } else {
            $.error("Method" + method + "does not exist on jQuery.Upload");
            return this;
        }

        return method.apply(this, arguments);
    };
})(jQuery);
$(function () {
    $("div[data-url][data-accept][data-callback-element]").Upload("init");
});