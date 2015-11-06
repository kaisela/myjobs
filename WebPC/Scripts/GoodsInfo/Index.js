
var $ctype = 0;
$(function () {
    //$("body").on("touchstart", 'p', function () {
      //  alert(2);
    //});
    $("#owl-demo").owlCarousel({
        items: 1,
        lazyLoad: true,
        navigation: true
    });
    var data = {
        goodsId: $("#ID").val()
    };
    
    var buildHtml = {
        buildReturnView: function (result) {
            var html = [];
            //拼装html
            for (var i = 0; i < result.length; i++) {
                var item = result[i];
                //按照feedback中的单项模板写
                //结果是json数据
                //要一句一句拼接 写缩进来确保标签成对
                html.push('<div class="list">');
                html.push('     <div class="back_view-title">');
                html.push('         <p class="title-fist">购买产品：</p>');
                html.push('         <p class="title_child">' + item.ReturnVisit.GoodsName + '</p>');
                html.push('     </div>');
                html.push('     <div class="tabs-list">');
                html.push('         <p class="number">');
                html.push('             购买时间：');
                html.push('             <span class="time">' + (new Date(item.ReturnVisit.BuyTime)).Format("yyyy-MM") + '</span>');
                html.push('         </p>');
                html.push('         <p class="muns">');
                html.push('             <span class="id">' + item.ReturnVisit.Consumer + '</span>');
                //如果是字符串可以用 if(变量)来判断是否有值
                if (item.ReturnVisit.AreasDesc) {
                    html.push('         <span class="from">·' + item.ReturnVisit.AreasDesc + '</span>');
                }
                html.push('         </p>');
                html.push('     </div>');
                html.push('     <div class="dec-textbox">');
                html.push('         <p class="dec-text radios">');
                //需要显示换行
                html.push(replaceEnter(item.ReturnVisit.Remarks));
                html.push('         <span data-status="pause" data-src="' + getAviUrl(item.ReturnVisit.Recording) + '" data-key="' + item.ReturnVisit.Recording + '" class="icon-radio">&#xe613;</span>');
                html.push('         <span class="radios-text">听语音</span>');
                //html.push("<embed  data-key='" + item.ReturnVisit.Recording + "' style='display:none' src='" + getAviUrl(item.ReturnVisit.Recording) + "' />");
              //  html.push('         <audio hidden="hidden"  data-key="' + item.ReturnVisit.Recording + '" style="display:none" controls="controls">');
             //   html.push("             <source src='" + getAviUrl(item.ReturnVisit.Recording) + "' type=\"audio/mpeg\" />");
             //   html.push('         </audio>');
                html.push('         </p>');
                html.push('     </div>');
                html.push('     <p class="record">');
                html.push('         <span>' + (new Date(item.ReturnVisit.VisitTime)).Format("yyyy-MM-dd") + '</span>');
                html.push('         <span>' + item.ReturnVisit.ShopName + '</span>');
                html.push('     </p>');
                html.push('</div>');
            }
            return html.join("");
        },
        buildSellingPoint: function (result) {
            var html = [];
            //拼装html
            //获取当前页码用来计算序号
            var $this = $("#sellingPointCheckMore");
            var index = parseInt($this.attr("data-index"));
            for (var i = 0; i < result.length; i++) {
                var item = result[i];
                //按照feedback中的单项模板写
                //结果是json数据
                html.push('<div class="query">');
                html.push('     <span>' + ((index - 1) * 10 + i + 1) + '</span>');
                html.push('     <p>' + item.SellPoint.Title + '</p>');
                html.push('</div>');
                html.push('<div class="answerBox">');
                //p标签内不能嵌套p标签和其它标签 用div包含销售卖点的内容
                html.push('     <div class="answer">' + item.SellPoint.Content + '</div>');
                html.push('</div>');
            }
            return html.join("");
        },
        buildFeedback: function (result) {
            var html = [];
            for (var i = 0; i < result.length; i++) {
                var item = result[i];
                html.push(' <div class="list">');
                html.push('     <div class="area">');
                html.push('         <div class="id">');
                if (item.CName == "") {
                    html.push('         <span>***</span>');
                }
                else {
                    html.push('         <span>' + (item.CName).substr(0, 1) + "***" + (item.CName).substr(item.CName.length - 1, 1) + '</span>');
                }
                if (item.AreasDesc) {
                    html.push('         <span>（' + item.AreasDesc + '）</span>');
                }
                html.push('         </div>');
                html.push('         <div class="data">' + (new Date(item.CommentTime)).Format("yyyy-MM-dd") + '</div>');
                html.push('      </div>');
                //当全部或者语音时显示语音

                if (($ctype == 0 || $ctype == 3) && item.Recording) {
                    var arrayR = item.Recording.split(';');
                    html.push(' <p class="dec-text radios">' + replaceEnter(item.Translation));
                    for (var j = 0; j < arrayR.length; j++) {
                        html.push('     <span data-status="pause" data-src="' + getAviUrl(arrayR[j]) + '" data-key="' + arrayR[j] + '" class="icon-radio">&#xe613;</span>');
                        html.push('     <span class="radios-text">听语音</span>');
                       // html.push('         <audio hidden="hidden" data-key="' +arrayR[j]+ '" style="display:none" controls="controls">');
                       // html.push("             <source src='" + getAviUrl(arrayR[j]) + "' type=\"audio/mpeg\" />");
                       // html.push('         </audio>');
                    }
                    html.push(' </p>');
                }
                //当全部或者有图时显示有图
                if (($ctype == 0 || $ctype == 2) && item.Picture) {
                    var arrayR = item.Picture.split(';');
                    html.push(' <div class="picBox">');
                    for (var m = 0; m < arrayR.length; m++) {
                        html.push('     <a><img src="' + getImgUrl(arrayR[m]) + '" /></a>');
                    }
                    html.push('  </div>');
                }
                if (item.Remarks) {
                    html.push('  <p class="dec-text">' + replaceEnter(item.Remarks) + '</p>');
                }
                if (item.Reply) {
                    html.push(' <div class="explain"><p>[解释]：</p>');
                    html.push('     <p>' + replaceEnter(item.Reply) + '</p>');
                    html.push(' </div>');
                }
                html.push(' </div>');
            }
            return html.join("");
        }
    };
    var operation = {
        loadFeedback: function (pageIndex) {
            //累计评价
            $.getJSON("/GoodsInfo/GetFeedback" + "?pageIndex=" + pageIndex + "&pageSize=" + publicConfig.PageComment + "&goodsID=" + data.goodsId + "&ctype=" + $ctype, { EnterpriseID: $("#EnterpriseID").val() }, function (result) {
                //如果没有数据了说明不用再去添加html了 json格式用length来判断
                if (result.length > 0) {
                    var html = buildHtml.buildFeedback(result);
                    //debugger;
                    //显示全部
                    if ($ctype == 0) {
                        $("#feedbackListContent").html($("#feedbackListContent").html() + html);
                        if (result.length < 10) {
                            $("#FeedbackMore").unbind("click");
                        }
                        else {
                            $("#FeedbackMore").attr("data-index", pageIndex + 1);
                        }
                    }
                        //显示有图
                    else if ($ctype == 2) {
                        $("#feedbackListPictureContent").html($("#feedbackListPictureContent").html() + html);

                        if (result.length < 10) {
                            $("#FeedbackMorePicture").unbind("click");
                        }
                        else {
                            $("#FeedbackMorePicture").attr("data-index", pageIndex + 1);
                        }
                    }
                        //显示语音
                    else if ($ctype == 3) {
                        $("#feedbackListRecordingContent").html($("#feedbackListRecordingContent").html() + html);

                        if (result.length < 10) {
                            $("#FeedbackMoreRecording").unbind("click");
                        }
                        else {
                            $("#FeedbackMoreRecording").attr("data-index", pageIndex + 1);
                        }
                    }
                }
            });
        },
        loadReturnView: function (pageIndex) {
            //客户回访
            $.getJSON("/GoodsInfo/GetReturnVisit" + "?pageIndex=" + pageIndex + "&pageSize=" + publicConfig.PageReturnVisit + "&goodsID=" + data.goodsId, { EnterpriseID: $("#EnterpriseID").val() }, function (result) {
                //如果没有数据了说明不用再去添加html了
                if (result.length > 0) {
                    //始终是追加内容
                    var html = buildHtml.buildReturnView(result);
                    $("#returnViewlist").html($("#returnViewlist").html() + html);
                    //如果当前不满10行
                    //debugger;
                    if (result.length < 10) {
                        //肯定是点击更多失效
                        $("#returnViewCheckMore").unbind("click");
                    }
                    else {
                        //点击更多去加载更多数据
                        $("#returnViewCheckMore").attr("data-index", pageIndex + 1);
                    }
                }
            });
        },
        loadSellingPoint: function (pageIndex) {
            //产品卖点
            $.getJSON("/GoodsInfo/GetSellPoint" + "?pageIndex=" + pageIndex + "&pageSize=" + publicConfig.PageSallingPoint + "&goodsID=" + data.goodsId, { EnterpriseID: $("#EnterpriseID").val() }, function (result) {
                //如果没有数据了说明不用再去添加html了
                if (result.length > 0) {
                    //始终是追加内容
                    var html = buildHtml.buildSellingPoint(result);
                    $("#sellingPointlist").html($("#sellingPointlist").html() + html);
                    //如果当前不满10行
                    if (result.length < 10) {
                        //肯定是点击更多失效
                        $("#sellingPointCheckMore").unbind("click");
                    }
                    else {
                        //点击更多去加载更多数据
                        $("#sellingPointCheckMore").attr("data-index", pageIndex + 1);
                    }
                }
            });
        }
    };

    $(".right").toggle(function () {
        $(".listMenu").fadeOut();
    }, function () {
        $(".listMenu").fadeIn();
    });

    $(".shopKind").click(function () {
        $(".shopKind").click(function () {
            $(this).next().slideToggle();
            $(this).children(".arrowRight").toggleClass("rotateAr");
        });
        $(this).next().slideToggle();
        $(this).children(".arrowRight").toggleClass("rotateAr");
    });
    var all_appraiseH = $(".all_appraise").height();
    var back_viewH = $(".back_view").height();
    var clinch_recordH = $(".clinch_record").height();

    //注册更多累计评价
    $("#FeedbackMore").click(function () {
        var $this = $(this);
        var index = parseInt($this.attr("data-index"));
        operation.loadFeedback(index);

    });

    //注册更多有图的累计评价
    $("#FeedbackMorePicture").click(function () {
        var $this = $(this);
        var index = parseInt($this.attr("data-index"));
        operation.loadFeedback(index);

    });


    //注册更多语音的累计评价
    $("#FeedbackMoreRecording").click(function () {
        var $this = $(this);
        var index = parseInt($this.attr("data-index"));
        operation.loadFeedback(index);

    });

    //注册自定义评价的tab事件
    $("#divCtype a").click(function () {
        $ctype = $(this).attr("data-type");
        $(this).find("p").addClass("btnActive");
        $(this).siblings("a").find("p").removeClass("btnActive");
        //debugger;
        //要保留切换过的数据 使用div的显示和隐藏来控制
        if ($ctype == 0) {
            $("#feedbackList").show();
            $("#feedbackListPicture").hide();
            $("#feedbackListRecording").hide();
            //页码是动态的
            var pageIndex = $("#FeedbackMore").attr("data-index");
            //切换时不会默认去加载数据 只有当没数据是才要去加载内容 点击更多是才去加载
            if ($("#feedbackListContent").html().trim() == "") {
                operation.loadFeedback(pageIndex);
            }
        }
        else if ($ctype == 2) {
            $("#feedbackListPicture").show();
            $("#feedbackList").hide();
            $("#feedbackListRecording").hide();
            //页码是动态的
            var pageIndex = $("#FeedbackMorePicture").attr("data-index");
            //切换时不会默认去加载数据 只有当没数据是才要去加载内容 点击更多是才去加载
            if ($("#feedbackListPictureContent").html().trim() == "") {
                operation.loadFeedback(pageIndex);
            }
        }
        else if ($ctype == 3) {
            $("#feedbackListRecording").show();
            $("#feedbackList").hide();
            $("#feedbackListPicture").hide();
            //页码是动态的
            var pageIndex = $("#FeedbackMoreRecording").attr("data-index");
            //切换时不会默认去加载数据 只有当没数据是才要去加载内容 点击更多是才去加载
            if ($("#feedbackListRecordingContent").html().trim() == "") {
                operation.loadFeedback(pageIndex);
            }
        }
    });

    //注册更多老客户回访
    $("#returnViewCheckMore").click(function () {
        var $this = $(this);
        var index = parseInt($this.attr("data-index"));
        operation.loadReturnView(index);

    });
    //注册更多销售卖点
    $("#sellingPointCheckMore").click(function () {
        var $this = $(this);
        var index = parseInt($this.attr("data-index"));
        operation.loadSellingPoint(index);

    });
    //注册自定义评价，老客户回访，销售卖点tab事件
    $(".tabTittle").on("click", "li", function () {
        var $this = $(this);
        var dataKey = $this.attr("data-key");
        $(".tabTittle li").removeClass("activeTab");
        $(".tabTittle p").removeClass("textActive");
        $this.addClass("activeTab");
        $this.children().find("p").addClass("textActive");
        $(".detailBox").removeClass("rslt1");
        $(".detailBox").removeClass("rslt2");
        switch (dataKey) {
            case 'feedback':
                //如果页面上已加载过内容了就不需要重新去加载页面
                //没有加载过内容就去加载 要用trim方法去掉空格
                if ($("#feedbackList").html().trim() == "") {
                    operation.loadFeedback(1);
                }
                break;
            case 'returnView':
                $(".detailBox").addClass("rslt1");
                //如果页面上已加载过内容了就不需要重新去加载页面
                //没有加载过内容就去加载 要用trim方法去掉空格
                if ($("#returnViewlist").html().trim() == "") {
                    operation.loadReturnView(1);
                }
                break;
            case 'sellingPoint':
                $(".detailBox").addClass("rslt2");
                //如果页面上已加载过内容了就不需要重新去加载页面
                //没有加载过内容就去加载 要用trim方法去掉空格
                if ($("#sellingPointlist").html().trim() == "") {
                    operation.loadSellingPoint(1);
                }
                break;
        }
    });
    //自定义评价的语音 用on的方式是为了等页面加载完后再去注册click事件
    //注册全部的语音事件
    //点击语音时只允许播放一个语音
    function clickAudio($this) {
        //$this  变量前加$ 是标准的jquery对象命名规则

        
        var key = $this.attr("data-key");
        //要实现点击语音 就播放 再点击就关闭 用html5参数值判断方法
        var status = $this.attr("data-status");
        //.not(this)不是当前的语音对象

        $('span[data-key][data-status]').not(this).each(function () {
            /*
            
            var avkey = $avthis.attr("data-key");
            var avstatus = $avthis.attr("data-status");
           
            var curaudio = $("audio[data-key='" + avkey + "']")[0];
            console.log(curaudio.paused);
            if (!curaudio.paused) {
                curaudio.pause();
            }*/
            //改变值
            var $avthis = $(this);
            $avthis.attr("data-status", "pause");
            $avthis.html("&#xe613;");
        });

        if (status == "pause") {
            //改变值
            $this.html("&#xe614;");
            //赋值参数值用下次点击判断
            $this.attr("data-status", "play");
            //语音文件只支持js方法
            //jquery对象转成js对象 加[0] 
            //  $("audio[data-key='" + key + "']")[0].play();
            //alert($(this).attr("data-src"));
           
        }
        else {
            //改变值
            $this.html("&#xe613;");
            //赋值参数值用下次点击判断
            $this.attr("data-status", "pause");
            //语音文件只支持js方法
            //jquery对象转成js对象 加[0]
            //   $("audio[data-key='" + key + "']")[0].pause();
        }
        g_audio.push({ song_fileUrl: $this.attr("data-src") });

        g_audio.addEventListener('ended', function () {
            $('span[data-key][data-status]').not(this).each(function () {
                //改变值
                var $avthis = $(this);
                $avthis.attr("data-status", "pause");
                $avthis.html("&#xe613;");
            });
        }, false);
        
    }
    if (g_audio.touchstart) {
        $("body").off("touchstart", '.icon-radio');
        $("body").on("touchstart", '.icon-radio', function () {
            var $this = $(this);
            clickAudio($this);
        });
    } else {
        $("body").off("click", '.icon-radio');
        $("body").on("click", '.icon-radio', function () {
            var $this = $(this);
            clickAudio($this);
        });
    }
    
    $(".arrow_down").click(function () {
        $(".little-pro-list").slideUp();
        $(".large-pro-list").slideDown();
    });
    $(".arrow_up").click(function () {
        $(".little-pro-list").slideDown();
        $(".large-pro-list").slideUp();
    });


    $(".store").toggle(function () {
        $(".star").addClass("starAttr");
        $(".starfull").addClass("starfullAttr");
    }, function () {
        $(".star").removeClass("starAttr");
        $(".starfull").removeClass("starfullAttr");
    });
    //默认加载第一项
    operation.loadFeedback(1);
});