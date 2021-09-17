/*
* tips.js
* 基于JQuery
* @author zq
*/
//CopyRight by HOPPIN&HAZZ ~zq
let opts = [];
let defaultTop, defaultLeft;
var time=750;
$.fn.tips = function (options) {//用以绑定该组件到dom元素上
    let defaults = {
        $element: $(this),
        defaultTipAnim: {
            time: time+'ms',
            type: 'ease'
        }
    };
    $.tips([$.extend({}, options, defaults)]);
};
$.tips = function (tipsOption) {
    "use strict";
    let defaults = {//默认配置项，可拓展
        defaultTipAnim: {
            time: time+'ms',
            type: 'ease'
        }
    };
    let index = 0;
    let $preloader;
    let stageElement = [];
    let options=tipsOption.tips;
    let obj = {
        initCss: function(){
            //用到的css样式
            let thisCss = [];
            thisCss.push('div#zq-tips-page-overlay{opacity:0.75;position:fixed;inset:0px;background:#000;top:0;left:0;bottom:0;right:0;display:none;width:100%;height:100%;zoom:1;filter:alpha(opacity=75);z-index:100002 !important;transition:all .3s}');
            thisCss.push('div#zq-tips-highlighted-element-stage{position:absolute;top:0;left:0;height:50px;width:300px;background:#fff;z-index:100003 !important;display:none;border-radius:2px;transition:all .3s}');
            thisCss.push('.zq-tips-highlighted-element-stage{position:absolute;top:0;left:0;background:#fff;z-index:100003 !important;display:none;border-radius:2px;transition:all .3s}');
            thisCss.push('div#zq-tips-item{display:none;left:440px;top:38px;position:absolute;background:#fff;color:#2d2d2d;margin:0;padding:15px;border-radius:5px;min-width:250px;max-width:300px;box-shadow:0 1px 10px rgb(0 0 0 / 40%);z-index:1000000000}');
            thisCss.push('.zq-tips-fix-stacking{z-index:auto;opacity:1 !important;transform:none !important;-webkit-filter:none !important;filter:none !important;perspective:none !important;transform-style:flat !important;transform-box:border-box !important;will-change:unset !important}');
            thisCss.push('div#zq-tips-item .zq-tips-popover-tip.right{left:-10px;top:10px;border-color:transparent #fff transparent transparent}');
            thisCss.push('div#zq-tips-item .zq-tips-popover-tip.bottom{top:-10px;border-color:transparent transparent #fff}');
            thisCss.push('div#zq-tips-item .zq-tips-popover-tip{border:5px solid #fff;content:"";position:absolute}');
            thisCss.push('div#zq-tips-item .zq-tips-title{font:19px/normal sans-serif;margin:0 0 5px;font-weight:700;display:block;position:relative;line-height:1.5;zoom:1}')
            thisCss.push('div#zq-tips-item .zq-tips-description{margin-bottom:0;font:14px/normal sans-serif;line-height:1.5;color:#2d2d2d;font-weight:400;zoom:1}')
            thisCss.push('div#zq-tips-item .zq-tips-footer{display:block;margin-top:10px}');
            thisCss.push('div#zq-tips-item .zq-tips-footer .zq-tips-btn-group,div#zq-tips-item .zq-tips-footer .driver-close-only-btn{float:right}');
            //装配css样式
            let thisStyle = document.createElement('style');
            thisStyle.innerHTML = thisCss.join('\n'),
                document.getElementsByTagName('head')[0].appendChild(thisStyle);
        },
        bindDom: function () {
            $("<div id='zq-tips-page-overlay'></div>").appendTo('body').show();
            $preloader = $('<div></div>').addClass('zq-tips-highlighted-element-stage').appendTo('body');
            // for(let option of options){
            //     opts.push(option)
            // }
            for (let i = 0; i < options.length; i++) {
                opts.push(options[i])
            }
            //opts = options.slice(0);
            let opt = opts[index];
            defaultTop = opt.$element.offset().top < 10 ? 0 : opt.$element.offset().top - 10;
            defaultLeft = opt.$element.offset().left < 10 ? 0 : opt.$element.offset().left - 10;
            obj.move(opt);
        },
		reDom:function(opt){
			setTimeout(function(){
				let $dom=opt.$element;
				$dom.css("position",opt.pst).removeClass("zq-tips-fix-stacking").css("z-index", 0);
			},time)
		},
        remove: function (opt) {
            $("#zq-tips-item").fadeOut(500,function () {
                $("#zq-tips-item").remove();
                obj.move(opt);
            });
        },
        move: function (opt) {
            opt = $.extend({}, defaults, opt);
            let $dom = opt.$element;
            //let {top, left} = $dom.get(0).getBoundingClientRect();
            let top = $dom.offset().top;
            let left = $dom.offset().left;
            let {scrollTop, scrollLeft} = document.body;
            let dom_width = $dom.width();
            let dom_height = $dom.height();
            let highlighted_width = $preloader.width();
            let highlighted_height = $preloader.height();
            if (highlighted_width === 0 && highlighted_height === 0) {
                $preloader.height((dom_height < window.screen.height - 22 ? dom_height + 20 : dom_height))
                    .width(dom_width < window.screen.width - 22 ? dom_width + 20 : dom_width)
                    .offset({
                        top: (top + scrollTop < 10 ? 0 : top + scrollTop - 10),
                        left: (left + scrollLeft < 10 ? 0 : left + scrollLeft - 10)
                    }).fadeIn();
                stageElement.push($.extend({}, opt, {
                    current: true,
                    index: index
                }, $preloader.get(0).getBoundingClientRect()));
            } else {
                let isE = false;
                for (let i = stageElement.length - 1; i > -1; i--) {
                    if (index === stageElement[i].index) {
                        isE = true;
                        stageElement[i].current = true;
                    } else {
                        delete stageElement[i]["current"];
                    }
                }
                let transformX = (left - 20 < 0 ? 0 : left - 20);
                let transformY = (top - 20 < 0 ? 0 : top - 20);
                let scaleX = (dom_width + 40) / stageElement[0].width;
                let scaleY = (dom_height + 40) / stageElement[0].height;
                if (!isE) {
                    let eleStyle = {
                        top: transformY,
                        left: transformX,
                        width: dom_width + 40,
                        height: dom_height + 40,
                        current: true,
                        index: index
                    };
                    stageElement.push($.extend({}, opt, eleStyle));
                } else {
                    let preElement = stageElement[index];
                    let $preDom = preElement.$element;
                    $preDom.removeClass("zq-tips-fix-stacking").css("z-index", 0);
                }
                //缩放平移动画关键代码css
                $preloader.css("transform-origin", "0 0");
                $preloader.css("transform", "translate(" + (transformX - defaultLeft) + "px," + (transformY - defaultTop) + "px)" +
                    " scale(" + scaleX + "," + scaleY + ")");
                $preloader.css("transition", "transform " + opt.defaultTipAnim.time + " " + opt.defaultTipAnim.type + "");
                //滚动条跟随
                $(document.documentElement).animate({scrollTop: transformY + "px"}, 500);
            }
            //phrase样式的需要转化,你也可以将其转化为块状（display:block）,使其拥有宽高等属性,block样式的不用
            // if (new RegExp(/SPAN/g).test($dom.prop("nodeName"))
            //     || ($dom.prop("nodeName").length === 2 && $dom.prop("nodeName").indexOf("H") === 1)
            //     || $dom.prop("nodeName") === "P"
            //     || $dom.prop("nodeName") === "A") {
            //     $dom.css("position", "relative");
            // }
			if($dom.css("position")!="relative"){
				opt.pst=$dom.css("position");
				$dom.css("position","relative");
			}else{
				opt.pst="relative";
			}
            $dom.addClass("zq-tips-fix-stacking").css("z-index", (parseInt($preloader.css("z-index")) || 9999998) + 1)
                .siblings().removeClass("zq-tips-fix-stacking").css("z-index", 0);//我傻逼了这里
            //该模块可以修改或者作为配置项定制。
            let $tip = $("<div id='zq-tips-item'></div>").append("<div class=\"zq-tips-popover-tip\"></div>\n" +
                "    <div class=\"zq-tips-title\">" + opt.popover.title + "</div>\n" +
                "    <div class=\"zq-tips-description\">" + opt.popover.description + "</div>\n" +
                "    <div class=\"clear zq-tips-footer\" style=\"display: block;\">\n" +
                "      <button class=\" zq-tips-close\">关闭</button>\n" +
                "      <span class=\"zq-tips-btn-group zq-tips-navigation-btns\">\n" +
                "        <button class=\"zq-tips-previous\" style=\"display: inline-block;\">← 上一步</button>\n" +
                "        <button class=\"zq-tips-next\" style=\"display: inline-block;\">下一步 →</button>\n" +
                "        <button class=\"zq-tips-ok\" style=\"display: none;\">确定</button>\n" +
                "      </span>\n" +
                "    </div>");
            if (undefined === opt.popover.position || opt.popover.position === "right") {
                $tip.find(".zq-tips-popover-tip").addClass("right");
                $tip.offset({
                    top: top + scrollTop + 10,
                    left: left + scrollLeft + dom_width + 20
                }).appendTo('body').fadeIn(500);
            } else if (opt.popover.position === "left") {
                $tip.find(".zq-tips-popover-tip").addClass("left");
                $tip.offset({
                    top: top + scrollTop + 10,
                    left: left + scrollLeft - dom_width + 20
                }).appendTo('body').fadeIn(500);
            } else if (opt.popover.position === "top") {
                $tip.find(".zq-tips-popover-tip").addClass("top");
                $tip.offset({
                    top: top + scrollTop - 50,
                    left: left + scrollLeft + 20
                }).appendTo('body').fadeIn(500);
            } else if (opt.popover.position === "bottom") {
                $tip.find(".zq-tips-popover-tip").addClass("bottom");
                $tip.offset({
                    top: top + scrollTop + dom_height + 20,
                    left: left + scrollLeft + 20
                }).appendTo('body').fadeIn(500);
            } else {
                $(".zq-tips-popover-tip").addClass("right");
                $tip.offset({
                    top: top + scrollTop + 10,
                    left: left + scrollLeft + dom_width + 30
                }).appendTo('body').fadeIn(500);
            }
            $(".zq-tips-close,.zq-tips-ok").on("click", function () {
				obj.reDom(opt);
                $("#zq-tips-item").remove();
                $("#zq-tips-page-overlay").remove();
                $(".zq-tips-fix-stacking").removeClass("zq-tips-fix-stacking");
                $(".zq-tips-highlighted-element-stage").remove();
                if($(this).hasClass("zq-tips-close")){
                    if($.isFunction(tipsOption.cancel.cancelFunc)){
                        tipsOption.cancel.cancelFunc();
                    }
                }
                if($(this).hasClass("zq-tips-ok")){
                    if($.isFunction(tipsOption.ok.okFunc)){
                        tipsOption.ok.okFunc();
                    }
                    if($.isFunction(opt.endCallback)){
                        opt.endCallback();
                    }
                }

            });
            if (index === 0) {
                $(".zq-tips-previous").addClass("layui-btn-disabled").attr("disabled", true);
                $(".zq-tips-next").removeClass("layui-btn-disabled").off("click").on("click", function () {
					obj.reDom(opt);
                    index++;
                    obj.remove(opts[index])
                });
            }
            if (index === opts.length - 1) {
                $(".zq-tips-previous").removeClass("layui-btn-disabled").off("click").on("click", function () {
					obj.reDom(opt);
                    index--;
                    obj.remove(opts[index])
                });
                $(".zq-tips-next").addClass("layui-btn-disabled").hide();
                $(".zq-tips-ok").show();
            } else {
                $(".zq-tips-previous").attr("disabled", false).removeClass("layui-btn-disabled").off("click").on("click", function () {
					obj.reDom(opt);
                    index--;
                    obj.remove(opts[index])
                });
                $(".zq-tips-next").removeClass("layui-btn-disabled").show().off("click").on("click", function () {
					obj.reDom(opt);
                    index++;
                    obj.remove(opts[index])
                });
                $(".zq-tips-ok").hide();
            }
        }
    };
    obj.initCss();
    obj.bindDom();
};