/**
 * Created by zhouzechen on 16/7/22.
 */
(function ($) {
    $.fn.lineImages = function (mmOptions) {

        var me = $(this);

        var userOptions = $.extend({
            /**
             * 基准高度
             */
            baseHeight: 150,
            /**
             * 图片横向间隔
             */
            baseGapX: 15,
            /**
             * 图片纵向间隔
             */
            baseGapY: 15,
            /**
             *
             */
            images: []
        }, mmOptions);

        var __imgs = [];

        var scrollWidth = 0;

        function getImageDiv(img) {
            var div = $('<div class="im-box" >' +
                    '<a href="' + img.link + '"><img class="box-img" src="' + img.src + '"/>' +
                    '<div class="box-cover"></div><div class="box-desc"></div></a>' +
                    '</div>'),
                im = $('.box-img', div),
                desc = $('.box-desc', div),
                cover = $('.box-cover', div)
                ;
            div.css({
                float: 'left',
                margin: '0',
                padding: '0',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative'
            });
            im.css({
                height: '100%'
            });

            desc.css({
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: '#fff',
                zIndex: 30,
                opacity: '.2'
            });
            desc.hide();

            div.mouseover(function () {
                desc.show();
            });
            div.mouseleave(function () {
                desc.hide();
            });


            return div;
        }

        function getLineDiv() {
            var div = $('<div class="im-line" ></div>');
            div.css({
                overflow: 'auto',
                margin: '0',
                padding: '0',
                clear: 'both'
            });
            return div;
        }

        function lineProcess(line, processInfo, lineIndex) {

            //console.log('开始处理行[' + lineIndex + '],行内有[' + line.images.length + ']个图片');

            var lineDiv = getLineDiv();
            lineDiv.css({
                marginBottom: processInfo.options.baseGapY
            });

            var pW = processInfo.hostDom.width() + processInfo.options.baseGapX - scrollWidth,

                delta = pW - line.totalWidth,

                rate = (pW - line.images.length * processInfo.options.baseGapX) / (line.totalWidth - line.images.length * processInfo.options.baseGapX);
            if (delta < 0) {
                rate = 1 / rate;
            }
            for (var i = 0; i < line.images.length; i++) {
                var im = line.images[i], imDiv = getImageDiv(im),
                    mHeight = rate * processInfo.options.baseHeight;
                imDiv.css({
                    margin: '0 ' + (processInfo.options.baseGapX / 2) + 'px',
                    width: mHeight / im.height * im.width,
                    height: mHeight
                });

                lineDiv.append(imDiv);
            }

            return lineDiv;


        }

        function getLineContainer(processInfo) {
            var container = $('<div class="line-container"></div>');
            container.css({
                width: processInfo.hostDom.width() + processInfo.options.baseGapX,
                height: '100%',
                marginLeft: -processInfo.options.baseGapX / 2,
                padding: '20px 0'

            });
            processInfo.hostDom.css({
                overflowX: 'hidden'
            });
            processInfo.hostDom.append(container);
            return container;
        }

        function startLineProcess(processInfo) {
            processInfo.hostDom.children().remove();

            var pW = processInfo.hostDom.width() + processInfo.options.baseGapX - scrollWidth;
            var lContainer = getLineContainer(processInfo);
            var line = {
                totalWidth: 0,
                images: []
            };
            var lineIndex = 0;
            for (var i = 0, im; i < processInfo.count; i++) {
                im = processInfo.images[i];
                var w = processInfo.options.baseHeight / im.height * im.width + processInfo.options.baseGapX;

                if (line.totalWidth + w > pW) {//超了

                    lContainer.append(lineProcess(line, processInfo, lineIndex++));

                    line = {
                        totalWidth: 0,
                        images: []
                    };
                    line.images.push(im);
                    line.totalWidth = w;

                } else if (line.totalWidth + w == pW) {//刚好
                    line.images.push(im);
                    lContainer.append(lineProcess(line, processInfo, lineIndex++));
                    line = {
                        totalWidth: 0,
                        images: []
                    };
                } else {//还不够
                    line.images.push(im);
                    line.totalWidth += w;
                }

            }


        }

        function loadLineHeightImages(parentDom, imgs, options) {
            if (!parentDom)return;
            options = $.extend({}, userOptions, options);

            var processInfo = {
                hostDom: parentDom,
                images: {},
                currentIndex: -1,
                options: options,
                count: imgs.length
            };

            var l = imgs.length;

            $.each(imgs, function (index, im) {
                var src = im;
                if (typeof im == 'object') {
                    src = im.src;
                }
                src && (getImageInfo(src, function (info) {
                    info = $.extend({
                        width: 0,
                        height: 0,
                        src: '',
                        link: ''
                    }, im, info);
                    processInfo.images[index] = info;
                    l--;

                    //TODO 其实可以不用等到全部加载完再开始处理,只要第一行的图片加载完了就可以开始了

                    if (l == 0) {
                        afterInfoLoad();
                    }
                }));

            });


            function afterInfoLoad() {
                startLineProcess(processInfo);
            }
        }

        function getImageInfo(src, callback) {
            var im = $('<img style="display:none;" src="' + src + '"/>');
            $('body').append(im);


            function loadCallback(info) {
                im.remove();
                callback(info);
            }

            /*im.load(function () {
             var info = {
             src: src,
             width: im.width(),
             height: im.height()
             };
             loadCallback(info);
             });
             return;*/

            //TODO 增加图片加载失败数据的返回
            if (im.complete) {
                var info = {
                    src: src,
                    width: im.width(),
                    height: im.height()
                };
                loadCallback(info);
            } else {
                im.load(function () {
                    var info = {
                        src: src,
                        width: im.width(),
                        height: im.height()
                    };
                    loadCallback(info);
                }).error(function () {
                    var info = {
                        src: src,
                        width: userOptions.baseHeight,
                        height: userOptions.baseHeight
                    };
                    loadCallback(info);
                });
            }


        }

        /*************************************************************/
        /**
         * APi
         */

        /**
         * 加载图片
         * @param imgs
         */
        me.loadImages = function (imgs) {
            __imgs = imgs || [];
            loadLineHeightImages(me, __imgs);

        };

        /**
         * 添加图片
         * @param imgs
         */
        me.appendImages = function (imgs) {
            __imgs = __imgs.concat(imgs);
            loadLineHeightImages(me, __imgs);
        };


        /*************************************************************/

        //加载初始参数中的图片
        if (userOptions.images) {
            me.loadImages(userOptions.images);
        }

        //监听
        if (userOptions.watch) {
            $(window).resize(function () {
                __imgs.length && me.loadImages(__imgs);
            });

        }


        return me;

    };
})(jQuery);