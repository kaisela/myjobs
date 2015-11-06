$.video = function (element, options) {

    var defaults = {
        
    }
    var plugin = this;

    plugin.settings = {}

    var $element = $(element);
    plugin.init = function () {
        plugin.settings = $.extend({}, defaults, options);
        var data= {
            src: $element.attr("data-src")
        }
        $('<audio style="display: none" src="' + data.src + '" controls="controls"> ' +
            '</audio>' + '<i data-status="pause" class="video-control play">' + '</i>').appendTo($element);
        $element.on("click", ".video-control[data-status]", function () {
            var status = $(this).attr("data-status");
            $("span[data-func='video']").not($element).each(function () {
                var $vthis = $(this);
                var $i = $vthis.find("i");
                var istatus = $i.attr("data-status");
                if (istatus == "play") {
                    $i.removeClass("pause").addClass("play").attr("data-status", "pause");
                    $i.prev()[0].pause();
                }
            });
            if (status == "pause") {
                $(this).removeClass("play").addClass("pause").attr("data-status", "play");
                $(this).prev()[0].play();
            } else {
                $(this).removeClass("pause").addClass("play").attr("data-status", "pause");
                $(this).prev()[0].pause();
            }
        });
    }

    plugin.foo_public_method = function () {
        // code goes here
    }

    var method = function () {
        // code goes here
    }

    plugin.init();

}

$.fn.video = function (options) {
    return this.each(function () {
        if (undefined == $(this).data('video')) {
            var plugin = new $.video(this, options);
            $(this).data('video', plugin);
        }
    });

}
$(function() {
    $("[data-func='video'][data-src]").video({});
});