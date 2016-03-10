/**
 * @description {Class} VoiceRecord
 * This is the main class of VoiceRecord.
 */
(function($) {

	$.fn.VoiceRecord = function(settings) {
		var dfop = {
			color: "#2792ff",
			endSecond: 10,
			startRecord: function() {},
			endCallBack: function() {},
			reRecordCallBack: function(){}
		};

		$.extend(dfop, settings);
		var canvas, ctx, W, H;
		var degrees = 0;
		var color = dfop.color;
		var new_degrees = 0;
		var animation_loop, redraw_loop;
		var warp = null;
		var me = $(this);
		var html = [];
		var unitDeg = 360/dfop.endSecond;
		function buildDom() {
			html.push('<div class="voice-cover">');
			html.push('	<div class="voice-loading">');
			html.push('		<canvas id="voiceCanvas" width="186px" height="186px">');
			html.push('</canvas>');
			html.push('		<div class="voice-icon-con">');
			html.push('			<i class="icon-yuyin"></i>');
			html.push('			<span class="second">0&nbsp;&quot;</span>');
			html.push('		</div>');
			html.push('		<a class="re-record" href="javascript:;">重录</a>');
			html.push('	</div>');
			html.push('	<div class="bottons">');
			html.push('		<a class="voice-btn cancel-btn" href="javascript:;">取消</a>');
			html.push('		<a class="voice-btn end-btn" href="javascript:;">结束录音</a>');
			html.push('	</div> ');
			html.push('</div>');
			warp = $(html.join(''));
			me.append(warp);
		}
		function bindEvent(){
			warp.find(".re-record").on("click",function(){
				dfop.reRecordCallBack();
				start();
			});
			warp.find(".cancel-btn").on("click",function(){
				hideRecord();
			});
			warp.find(".end-btn").on("click",function(){
				stop();
			})
		}
		function init() {
			buildDom();
			//调用各个函数，实现动态效果
			bindEvent();
			canvas = document.getElementById("voiceCanvas");
			ctx = canvas.getContext("2d");
			W = canvas.width;
			H = canvas.height;
		}

		function start() {
			if (typeof redraw_loop != undefined) clearInterval(redraw_loop);
			warp.find(".second").html("0&nbsp;&quot;");
			dfop.startRecord();
			ctx.clearRect(0,0,W,H);
			degrees = 0;
			new_degrees = 0;
			draw();
			
			redraw_loop = setInterval(draw, Math.ceil(dfop.endSecond/360*1000));
		}

		function stop() {
			dfop.endCallBack(Math.ceil(degrees / unitDeg));
			clearInterval(redraw_loop);
			hideRecord()
		}

		function draw() {
			//Cancel any movement animation if a new chart is requested
			if (typeof animation_loop != undefined) clearInterval(animation_loop);
			
			new_degrees = new_degrees + 1;
			difference = new_degrees - degrees;
			animate_to();
		}

		function animate_to() {
			if (degrees == new_degrees) {

				clearInterval(animation_loop);
			}

			if (degrees == 360) //如果加载到了360度，就停止
			{
				stop();
				return;
			}
			if (degrees < new_degrees)
				degrees++;
			else
				degrees--;

			ctx.clearRect(0, 0, W, H);
			var radians = degrees * Math.PI / 180;
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = 10; //填充环的宽度
			ctx.arc(W / 2 - 1, H / 2 - 1, (W - 10) / 2, 0 - 90 * Math.PI / 180, radians - 90 * Math.PI / 180, false);
			ctx.stroke();
			var x,y;
			var radius = W/2 -5 ;
			x = W/2+(radius*Math.sin(degrees*(Math.PI/180)));
    		y = W/2-(radius*Math.cos(degrees*(Math.PI/180))) ;
			ctx.beginPath();
			ctx.fillStyle = "#fff";
			ctx.arc(x, y, 5, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
			warp.find(".second").html(Math.ceil(degrees /unitDeg) + "&nbsp;&quot;");
			
		}

		function showRecord() {
			warp.show();
		}

		function hideRecord() {
			if (typeof redraw_loop != undefined) clearInterval(redraw_loop);
			warp.find(".second").html("0&nbsp;&quot;");
			ctx.clearRect(0,0,W,H);
			degrees = 0;
			new_degrees = 0;
			warp.hide();
		}
		init();
		me[0].t = { //对外开放接口
			startRecord: function(id) {
				showRecord();
				start();
			}

		};
		return me;
	};
	$.fn.startRecord = function() {
		if (this[0] && this[0].t) {
			return this[0].t.startRecord();
		}
		return null;
	};

})(jQuery);