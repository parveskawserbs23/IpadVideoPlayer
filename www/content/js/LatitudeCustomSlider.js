﻿/*
* RoyalSlider  v8.1
*
* Copyright 2011-2012, Dmitry Semenov
* 
*/
(function ($) {
    function RoyalSlider(f, g) {
        this.slider = $(f); this._az = ""; this._by = ""; this._cx = ""; var h = this; this.settings = $.extend({}, $.fn.royalSlider.defaults, g);
        this.isSlideshowRunning = false; this._dw = false; this._ev = this.slider.find(".royalSlidesContainer");
        this._fu = this._ev.wrap('<div class="royalWrapper"/>').parent(); this.slides = this._ev.find(".royalSlide");
        this._gt = "<p class='royalPreloader'></p>"; this._hs = false; this._ir = false; if ("ontouchstart" in window) {
            if (!this.settings.disableTranslate3d) { if (('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix())) { this._ev.css({ "-webkit-transform-origin": "0 0", "-webkit-transform": "translateZ(0)" }); this._ir = true } } this.hasTouch = true; this._az = "touchstart.rs"; this._by = "touchmove.rs"; this._cx = "touchend.rs"
        }
        else {
            this.hasTouch = false; if (this.settings.dragUsingMouse) { this._az = "mousedown.rs"; this._by = "mousemove.rs"; this._cx = "mouseup.rs" }
            else { this._ev.addClass('auto-cursor') }
        }
        if (this.hasTouch) { this.settings.directionNavAutoHide = false; this.settings.hideArrowOnLastSlide = true }
        if ($.browser.msie && parseInt($.browser.version, 10) <= 8) { this._jq = true }
        else { this._jq = false } this.slidesArr = [];
        var i, jqSlide, dataSRC, slideImg; this.slides.each(function () {
            jqSlide = $(this); i = {}; i.slide = jqSlide;
            if (h.settings.blockLinksOnDrag) {
                if (!this.hasTouch) {
                    jqSlide.find('a').bind('click.rs', function (e) {
                        if (h._hs) { e.preventDefault(); return false }
                    })
                } else { var c = jqSlide.find('a'); var d; c.each(function () { d = $(this); d.data('royalhref', d.attr('href')); d.data('royaltarget', d.attr('target')); d.attr('href', '#'); d.bind('click', function (e) { e.preventDefault(); if (h._hs) { return false } else { var a = $(this).data('royalhref'); var b = $(this).data('royaltarget'); if (!b || b.toLowerCase() === '_kp') { window.location.href = a } else { window.open(a) } } }) }) }
            }
            if (h.settings.nonDraggableClassEnabled) {
                jqSlide.find('.non-draggable').bind(h._az, function (e) {
                    h._hs = false;
                    e.stopImmediatePropagation()
                })
            } dataSRC = jqSlide.attr("data-src"); if (dataSRC == undefined || dataSRC == "" || dataSRC == "none") { i.preload = false }
            else { i.preload = true; i.preloadURL = dataSRC }
            if (h.settings.captionAnimationEnabled) { i.caption = jqSlide.find(".royalCaption").css("display", "none") } h.slidesArr.push(i)
        }); this._lo = false;
        if (this.settings.removeCaptionsOpacityInIE8) {
            if ($.browser.msie && parseInt($.browser.version, 10) <= 8) { this._lo = true }
        }
        if (this.settings.autoScaleSlider) {
            this.sliderScaleRatio = this.settings.autoScaleSliderHeight / this.settings.autoScaleSliderWidth
        } this.slider.css("overflow", "visible");
        this.slideWidth = 0; this.slideshowTimer = '';
        this.mn = false; this.numSlides = this.slides.length;
        this.currentSlideId = this.settings.startSlideIndex;
        this.lastSlideId = -1; this.isAnimating = true;
        this.wasSlideshowPlaying = false; this._az1 = 0;
        this._by1 = 0; this._cx1 = false; this._dw1 = [];
        this._ev1 = []; this._fu1 = false; this._gt1 = false;
        this._hs1 = 0; this._ir1 = 0; this._jq1 = 0; this._kp1 = 0;
        this._lo1 = 0; this._mn1 = 0; this._az2 = false;
        this._by2 = false; if (this.settings.slideTransitionType === "fade") {
            if (this._ir || ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix())) { this._cx2 = true }
            else { this._cx2 = false } this._dw2 = $("<div class='fade-container'></div>").appendTo(this._fu)
        } if (this.settings.slideshowEnabled && this.settings.slideshowDelay > 0) {
            if (!this.hasTouch && this.settings.slideshowPauseOnHover) { this.slider.hover(function () { h._by2 = true; h._ev2(true) }, function () { h._by2 = false; h._fu2(true) }) } this.slideshowEnabled = true
        } else { this.slideshowEnabled = false } this._gt2();
        if (this.settings.controlNavEnabled) {
            var j; this._hs2Container = ''; var k;
            if (!h.settings.controlNavThumbs) {
                this._hs2Container = $('<div class="royalControlNavOverflow"><div class="royalControlNavContainer"><div class="royalControlNavCenterer"></div></div></div>'); j = this._hs2Container.find('.royalControlNavCenterer')
            } else {
                this.slider.addClass('with-thumbs');
                if (h.settings.controlNavThumbsNavigation) {
                    k = $('<div class="thumbsAndArrowsContainer"></div>');
                    this.thumbsArrowLeft = $("<a href='#' class='thumbsArrow left'></a>");
                    this.thumbsArrowRight = $("<a href='#' class='thumbsArrow right'></a>");
                    k.append(this.thumbsArrowLeft); k.append(this.thumbsArrowRight);
                    var l = parseInt(this.thumbsArrowLeft.outerWidth(), 10);
                    this._hs2Container = $('<div class="royalControlNavOverflow royalThumbs"><div class="royalControlNavThumbsContainer"></div></div>');
                    j = this._hs2Container.find('.royalControlNavThumbsContainer')
                }
                else {
                    this._hs2Container = $('<div class="royalControlNavOverflow royalThumbs"><div class="royalControlNavContainer"><div class="royalControlNavCenterer"></div></div></div>');
                    j = this._hs2Container.find(".royalControlNavCenterer")
                } 
            } var m = 0; this.slides.each(function (a) {
                if (h.settings.controlNavThumbs) { j.append('<a href="#" class="royalThumb" style="background-image:url(' + $(this).attr("data-thumb") + ')">' + (a + 1) + '</a>') }
                else { j.append('<a href="#">' + (a + 1) + '</a>') } m++
            }); this.navItems = j.children(); if (k) { k.append(this._hs2Container); this._fu.after(k) } else { this._fu.after(this._hs2Container) }
            if (h.settings.controlNavThumbs && h.settings.controlNavThumbsNavigation) {
                this._kp2 = true; this._lo2 = false; this._mn2 = j;
                if (this._ir) {
                    this._mn2.css({ '-webkit-transition-duration':
                                                  this.settings.controlNavThumbsSpeed + "ms", '-webkit-transition-property': '-webkit-transform', '-webkit-transition-timing-function': "ease-in-out"
                    })
                }
                this._az3 = m; var n = this.navItems.eq(0);
                this._by3 = n.outerWidth(true);
                this._cx3 = this._by3 * this._az3;
                this._mn2.css("width", this._cx3);
                this._dw3 = parseInt(n.css("marginRight"), 10);
                this._cx3 -= this._dw3; this._ev3 = 0; this._fu3();
                this.thumbsArrowLeft.click(function (e) {
                    e.preventDefault();
                    if (!h._kp2) { h._gt3(h._ev3 + h._hs3 + h._dw3) }
                });
                this.thumbsArrowRight.click(function (e) {
                    e.preventDefault();
                    if (!h._lo2) { h._gt3(h._ev3 - h._hs3 - h._dw3) } 
                })
            } this._ir3()
        } if (this.settings.directionNavEnabled) {
            this._fu.after("<a href='#' class='arrow left'/>");
            this._fu.after("<a href='#' class='arrow right'/>");
            this.arrowLeft = this.slider.find("a.arrow.left");
            this.arrowRight = this.slider.find("a.arrow.right");
            if (this.arrowLeft.length < 1 || this.arrowRight.length < 1) { this.settings.directionNavEnabled = false }
            else if (this.settings.directionNavAutoHide) {
                this.arrowLeft.hide();
                this.arrowRight.hide();
                this.slider.one("mousemove.arrowshover", function () { h.arrowLeft.fadeIn("fast"); h.arrowRight.fadeIn("fast") });
                this.slider.hover(function () { h.arrowLeft.fadeIn("fast"); h.arrowRight.fadeIn("fast") }, function () { h.arrowLeft.fadeOut("fast"); h.arrowRight.fadeOut("fast") })
            } this._jq3()
        }
        this.sliderWidth = 0;
        this.sliderHeight = 0;
        var o;
        this._kp3 = 'onorientationchange' in window ? 'orientationchange.royalslider' : 'resize.royalslider'; $(window).bind(this._kp3, function () {
            if (o) { clearTimeout(o) } o = setTimeout(function () { h.updateSliderSize() }, 100)
        }); this.updateSliderSize(); this.settings.beforeLoadStart.call(this); var p = this.slidesArr[this.currentSlideId];
        if (this.currentSlideId != 0) {
            if (!this._ir) { this._ev.css({ 'left': -this.currentSlideId * this.slideWidth }) }
            else {
                this._ev.css({ '-webkit-transition-duration': '0', '-webkit-transition-property': 'none' });
                this._ev.css({ '-webkit-transform': 'translate3d(' + -this.currentSlideId * this.slideWidth + 'px, 0, 0)' })
            }
        }
        if (this.settings.welcomeScreenEnabled) {
            function hideWelcomeScreen(a) {
                h.settings.loadingComplete.call(h);
                if (a && h.settings.preloadNearbyImages) { h._lo3(h.currentSlideId) } h.slider.find('.royalLoadingScreen').fadeOut(h.settings.welcomeScreenShowSpeed); setTimeout(function () { h._mn3() }, h.settings.welcomeScreenShowSpeed + 100)
            }
            if (p.preload) { this._lo3(this.currentSlideId, function () { hideWelcomeScreen(false) }) }
            else {
                slideImg = p.slide.find('img.royalImage')[0];
                if (slideImg) {
                    if (this._az4(slideImg)) { hideWelcomeScreen(true); $(slideImg).css('opacity', 0); $(slideImg).animate({ "opacity": 1 }, "fast") }
                    else { $(slideImg).css('opacity', 0); $('<img />').load(function () { hideWelcomeScreen(true); $(slideImg).animate({ "opacity": 1 }, "fast") }).attr('src', slideImg.src) }
                } else { hideWelcomeScreen(true) }
            }
        }
        else {
            if (p.preload) {
                this._by4(p, function () {
                    h.settings.loadingComplete.call(h);
                    if (h.settings.preloadNearbyImages) { h._lo3(h.currentSlideId) }
                })
            }
            else {
                slideImg = p.slide.find('img.royalImage')[0];
                if (slideImg) {
                    if (this._az4(slideImg)) { $(slideImg).css('opacity', 0).animate({ "opacity": 1 }, "fast") }
                    else { $(slideImg).css('opacity', 0); $('<img />').load(function () { $(slideImg).animate({ "opacity": 1 }, "fast") }).attr('src', slideImg.src) }
                } this.settings.loadingComplete.call(this)
            } setTimeout(function () { h._mn3() }, 100)
        }
    }
    RoyalSlider.prototype = { goTo: function (a, b, c, d, f) {
        if (!this.isAnimating) { this.isAnimating = true; var g = this; this.lastSlideId = this.currentSlideId; this.currentSlideId = a; this._gt1 = true; this._fu1 = true; if (this.lastSlideId != a) { this._ir3(c); this._lo3(a) } this._jq3(); this.settings.beforeSlideChange.call(this); if (this.slideshowEnabled && this.slideshowTimer) { this.wasSlideshowPlaying = true; this._ev2() } var h = !b ? this.settings.slideTransitionSpeed : 0; if (d || b || this.settings.slideTransitionType === "move") { var i; if (f > 0) { h = f } else { i = this.settings.slideTransitionEasing } if (!this._ir) { if (parseInt(this._ev.css("left"), 10) !== -this.currentSlideId * this.slideWidth) { this._ev.animate({ left: -this.currentSlideId * this.slideWidth }, h, (f > 0 ? "easeOutSine" : this.settings.slideTransitionEasing), function () { g._cx4() }) } else { this._cx4() } } else { if (this._dw4() !== -this.currentSlideId * this.slideWidth) { this._ev.bind("webkitTransitionEnd.rs", function (e) { if (e.target == g._ev.get(0)) { g._ev.unbind("webkitTransitionEnd.rs"); g._cx4() } }); this._ev.css({ '-webkit-transition-duration': h + "ms", '-webkit-transition-property': '-webkit-transform', '-webkit-transition-timing-function': (f > 0 ? "ease-out" : "ease-in-out"), '-webkit-transform': 'translate3d(' + -this.currentSlideId * this.slideWidth + 'px, 0, 0)' }) } else { this._cx4() } } } else { var j = this.slidesArr[this.lastSlideId].slide; var k = j.clone().appendTo(this._dw2); if (!this._cx2) { this._ev.css({ left: -this.currentSlideId * this.slideWidth }); k.animate({ opacity: 0 }, h, this.settings.slideTransitionEasing, function () { k.remove(); g._cx4() }) } else { if (!this._ir) { this._ev.css({ left: -this.currentSlideId * this.slideWidth }) } else { this._ev.css({ '-webkit-transition-duration': '0', '-webkit-transform': 'translate3d(' + -this.currentSlideId * this.slideWidth + 'px, 0, 0)', 'opacity': '1' }) } setTimeout(function () { k.bind("webkitTransitionEnd.rs", function (e) { if (e.target == k.get(0)) { k.unbind("webkitTransitionEnd.rs"); k.remove(); g._cx4() } }); k.css({ '-webkit-transition-duration': h + "ms", '-webkit-transition-property': 'opacity', '-webkit-transition-timing-function': "ease-in-out" }); k.css('opacity', 0) }, 100) } } }
    }, goToSilent: function (a) { this.goTo(a, true) }, prev: function () {
        if (this.currentSlideId <= 0) { this.goTo(this.numSlides - 1) } else { this._ev4() }
    }, next: function () {
        if (this.currentSlideId >= this.numSlides - 1) { this.goTo(0) } else { this._fu4() }
    }, updateSliderSize: function () {
        var a = this; var b; var c;
        if (this.settings.autoScaleSlider) {
            b = this.slider.width();
            if (b != this.sliderWidth) { this.slider.css("height", b * this.sliderScaleRatio) }
        } b = this.slider.width(); c = this.slider.height();
        if (b != this.sliderWidth || c != this.sliderHeight) {
            this.sliderWidth = b;
            this.sliderHeight = c;
            this.slideWidth = this.sliderWidth + this.settings.slideSpacing;
            var d = this.slidesArr.length;
            var e, _hs4;
            for (var i = 0, len = d; i < len; ++i) {
                e = this.slidesArr[i]; _hs4 = e.slide.find("img.royalImage").eq(0);
                if (_hs4 && e.preload == false) { this._ir4(_hs4, this.sliderWidth, this.sliderHeight) }
                if (this.settings.slideSpacing > 0 && i < d - 1) {
                     e.slide.css("cssText", "margin-right:" + this.settings.slideSpacing + "px !important;")
                 } 
                e.slide.css({ height: a.sliderHeight, width: a.sliderWidth })
            } if (!this._ir) { this._ev.css({ "left": -this.currentSlideId * this.slideWidth, width: this.slideWidth * this.numSlides }) }
            else {
                if (!this._gt1) { this._ev.css({ '-webkit-transition-duration': '0', '-webkit-transition-property': 'none' }); this._ev.css({ '-webkit-transform': 'translate3d(' + -this.currentSlideId * this.slideWidth + 'px, 0, 0)', width: this.slideWidth * this.numSlides }) }
            } if (this.settings.controlNavThumbs && this.settings.controlNavThumbsNavigation) { this._fu3() }
        }
    }, stopSlideshow: function () { this._ev2(); this.slideshowEnabled = false; this.wasSlideshowPlaying = false }, resumeSlideshow: function () {
        this.slideshowEnabled = true;
        if (!this.wasSlideshowPlaying) { this._fu2() }
    }, destroy: function () {
        this._ev2(); this._ev.unbind(this._az); $(document).unbind(this._by).unbind(this._cx); $(window).unbind(this._kp3);
        if (this.settings.keyboardNavEnabled) { $(document).unbind("keydown.rs") } this.slider.remove(); delete this.slider
    }, _lo3: function (a, b) {
        if (this.settings.preloadNearbyImages) { var c = this; this._by4(this.slidesArr[a], function () { if (b) { b.call() } c._by4(c.slidesArr[a + 1], function () { c._by4(c.slidesArr[a - 1]) }) }) } else { this._by4(this.slidesArr[a], b) }
    }, _ir3: function (a) {
        if (this.settings.controlNavEnabled) { this.navItems.eq(this.lastSlideId).removeClass('current'); this.navItems.eq(this.currentSlideId).addClass("current"); if (this.settings.controlNavThumbs && this.settings.controlNavThumbsNavigation) { var b = this.navItems.eq(this.currentSlideId).position().left; var c = b - Math.abs(this._ev3); if (c > this._hs3 - this._by3 * 2 - 1 - this._dw3) { if (!a) { this._gt3(-b + this._by3) } else { this._gt3(-b - this._by3 * 2 + this._hs3 + this._dw3) } } else if (c < this._by3 * 2 - 1) { if (!a) { this._gt3(-b - this._by3 * 2 + this._hs3 + this._dw3) } else { this._gt3(-b + this._by3) } } } }
    }, _jq3: function () {
        if (this.settings.directionNavEnabled) { if (this.settings.hideArrowOnLastSlide) { if (this.currentSlideId == 0) { this._lo4 = true; this.arrowLeft.addClass("disabled"); if (this._mn4) { this._mn4 = false; this.arrowRight.removeClass("disabled") } } else if (this.currentSlideId == this.numSlides - 1) { this._mn4 = true; this.arrowRight.addClass("disabled"); if (this._lo4) { this._lo4 = false; this.arrowLeft.removeClass("disabled") } } else { if (this._lo4) { this._lo4 = false; this.arrowLeft.removeClass("disabled") } else if (this._mn4) { this._mn4 = false; this.arrowRight.removeClass("disabled") } } } }
    }, _fu2: function (a) {
        if (this.slideshowEnabled) {
            var b = this;
            if (!this.slideshowTimer) { this.slideshowTimer = setInterval(function () { b.next() }, this.settings.slideshowDelay) }
        }
    }, _ev2: function (a) {
        if (this.slideshowTimer) { clearInterval(this.slideshowTimer); this.slideshowTimer = '' }
    }, _by4: function (a, b) {
        if (a) { if (a.preload) { var c = this; var d = new Image(); var e = $(d); e.css("opacity", 0); e.addClass("royalImage"); a.slide.prepend(e); a.slide.prepend(this._gt); a.preload = false; e.load(function () { c._ir4(e, c.sliderWidth, c.sliderHeight); e.animate({ "opacity": 1 }, 300, function () { a.slide.find(".royalPreloader").remove() }); if (b) { b.call() } }).attr('src', a.preloadURL) } else { if (b) { b.call() } } } else { if (b) { b.call() } }
    }, _fu3: function () {
        this._hs3 = parseInt(this._hs2Container.width(), 10); this._az5 = -(this._cx3 - this._hs3);
        if (this._hs3 >= this._cx3) { this._lo2 = true; this._kp2 = true; this.thumbsArrowRight.addClass("disabled"); this.thumbsArrowLeft.addClass("disabled"); this._cx1 = true; this._by5(0) }
        else { this._cx1 = false; var a = this.navItems.eq(this.currentSlideId).position().left; this._gt3(-a + this._by3) }
    }, _gt3: function (a) {
        if (!this._cx1 && a != this._ev3) { if (a <= this._az5) { a = this._az5; this._kp2 = false; this._lo2 = true; this.thumbsArrowRight.addClass("disabled"); this.thumbsArrowLeft.removeClass("disabled") } else if (a >= 0) { a = 0; this._kp2 = true; this._lo2 = false; this.thumbsArrowLeft.addClass("disabled"); this.thumbsArrowRight.removeClass("disabled") } else { if (this._kp2) { this._kp2 = false; this.thumbsArrowLeft.removeClass("disabled") } if (this._lo2) { this._lo2 = false; this.thumbsArrowRight.removeClass("disabled") } } this._by5(a); this._ev3 = a }
    }, _by5: function (a) {
        if (!this._ir) { this._mn2.animate({ left: a }, this.settings.controlNavThumbsSpeed, this.settings.controlNavThumbsEasing) } else { this._mn2.css({ '-webkit-transform': 'translate3d(' + a + 'px, 0, 0)' }) }
    }, _mn3: function () {
        var a = this; this.slider.find(".royalLoadingScreen").remove();
        if (this.settings.controlNavEnabled) { this.navItems.bind("click", function (e) { e.preventDefault(); if (!a._fu1) { a._cx5(e) } }) }
        if (this.settings.directionNavEnabled) {
            this.arrowRight.click(function (e) {
                e.preventDefault();
                if (!a._mn4 && !a._fu1) { a.next() }
            }); this.arrowLeft.click(function (e) {
                e.preventDefault();
                if (!a._lo4 && !a._fu1) { a.prev() }
            })
        } if (this.settings.keyboardNavEnabled) {
            $(document).bind("keydown.rs", function (e) {
                if (!a._fu1) { if (e.keyCode === 37) { a.prev() } else if (e.keyCode === 39) { a.next() } }
            })
        } this.wasSlideshowPlaying = true; this._cx4(); this._ev.bind(this._az, function (e) {
            if (!a._gt1) { a._dw5(e) } else if (!a.hasTouch) { e.preventDefault() }
        }); if (this.slideshowEnabled && !this.settings.slideshowAutoStart) { this._ev2() } this.settings.allComplete.call(this)
    }, _gt2: function () {
        this._ev.removeClass('grabbing-cursor'); this._ev.addClass('grab-cursor')
    }, _ev5: function () {
        this._ev.removeClass('grab-cursor'); this._ev.addClass('grabbing-cursor')
    }, _fu4: function (a, b) {
        if (this.currentSlideId < this.numSlides - 1) { this.goTo(this.currentSlideId + 1, false, false, a, b) } else { this.goTo(this.currentSlideId, false, false, a, b) }
    }, _ev4: function (a, b) {
        if (this.currentSlideId > 0) { this.goTo(this.currentSlideId - 1, false, false, a, b) } else { this.goTo(this.currentSlideId, false, false, a, b) }
    }, _cx5: function (e) { this.goTo($(e.currentTarget).index(), false, true) }, _dw4: function () {
        var a = window.getComputedStyle(this._ev.get(0), null).getPropertyValue("-webkit-transform"); var b = a.replace(/^matrix\(/i, '').split(/, |\)$/g); return parseInt(b[4], 10)
    }, _dw5: function (e) {
        if (!this._az2) { var a; if (this.hasTouch) { this._fu5 = false; var b = e.originalEvent.touches; if (b && b.length > 0) { a = b[0] } else { return false } } else { a = e; e.preventDefault() } if (this.slideshowEnabled) { if (this.slideshowTimer) { this.wasSlideshowPlaying = true; this._ev2() } else { this.wasSlideshowPlaying = false } } this._ev5(); this._az2 = true; var c = this; if (this._ir) { c._ev.css({ '-webkit-transition-duration': '0', '-webkit-transition-property': 'none' }) } $(document).bind(this._by, function (e) { c._gt5(e) }); $(document).bind(this._cx, function (e) { c._hs5(e) }); if (!this._ir) { this._mn1 = this._jq1 = parseInt(this._ev.css("left"), 10) } else { this._mn1 = this._jq1 = this._dw4() } this._hs = false; this._ir1 = this._jq1; this._hs1 = (e.timeStamp || new Date().getTime()); this._kp1 = a.clientX; this._lo1 = a.clientY } return false
    }, _gt5: function (e) {
        var a;
        if (this.hasTouch) {
            if (this._fu5) { return false } var b = e.originalEvent.touches; if (b.length > 1) { return false } a = b[0];
            if (Math.abs(a.clientY - this._lo1) > Math.abs(a.clientX - this._kp1) + 3) {
                if (this.settings.lockAxis) { this._fu5 = true } return false
            } e.preventDefault()
        } else { a = e; e.preventDefault() }
        this._by1 = this._az1; var c = a.clientX - this._kp1; if (this._by1 != c) { this._az1 = c } if (c != 0) {
            if (this.currentSlideId == 0) {
                if (c > 0) { c = Math.sqrt(c) * 5 }
            } else if (this.currentSlideId == (this.numSlides - 1)) { if (c < 0) { c = -Math.sqrt(-c) * 5 } } if (!this._ir) { this._ev.css("left", this._jq1 + c) } else { this._ev.css({ '-webkit-transform': 'translate3d(' + (this._jq1 + c) + 'px, 0, 0)' }) }
        } var d = (e.timeStamp || new Date().getTime()); if (d - this._hs1 > 350) { this._hs1 = d; this._ir1 = this._jq1 + c } return false
    }, _hs5: function (e) {
        if (this._az2) {
            var a = this; this._az2 = false; this._gt2();
            if (!this._ir) { this.endPos = parseInt(this._ev.css("left"), 10) }
            else { this.endPos = this._dw4() } this.isdrag = false; $(document).unbind(this._by).unbind(this._cx);
            if (this.slideshowEnabled) {
                if (this.wasSlideshowPlaying) {
                    if (!this._by2) { this._fu2() } this.wasSlideshowPlaying = false
                }
            } if (this.endPos == this._mn1) { this._hs = false; return }
            else { this._hs = true }
            var b = (this._ir1 - this.endPos); var c = Math.max(40, (e.timeStamp || new Date().getTime()) - this._hs1); var d = Math.abs(b) / c;
            var f = this.slideWidth - Math.abs(this._mn1 - this.endPos);
            var g = Math.max((f * 1.08) / d, 200); g = Math.min(g, 600);
            function returnToCurrent() { f = Math.abs(a._mn1 - a.endPos); g = Math.max((f * 1.08) / d, 200); g = Math.min(g, 500); a.goTo(a.currentSlideId, false, false, true, g) }
            if (this._mn1 - this.settings.minSlideOffset > this.endPos) { if (this._by1 < this._az1) { returnToCurrent(); return false } this._fu4(true, g) }
            else if (this._mn1 + this.settings.minSlideOffset < this.endPos) {
                if (this._by1 > this._az1) { returnToCurrent(); return false } this._ev4(true, g)
            } else { returnToCurrent() }
        } return false
    }, _cx4: function () {
        var a = this;
        if (this.slideshowEnabled) {
            if (this.wasSlideshowPlaying) { if (!this._by2) { this._fu2() } this.wasSlideshowPlaying = false }
        } this._fu1 = false; this._gt1 = false;
        if (this.settings.captionAnimationEnabled && this.lastSlideId != this.currentSlideId) {
            if (this.lastSlideId != -1) { this.slidesArr[this.lastSlideId].caption.css("display", "none") } a._ir5(a.currentSlideId)
        } this.isAnimating = false;
        this.settings.afterSlideChange.call(this)
    }, _ir5: function (h) {
        var j = this.slidesArr[h].caption;
        if (j && j.length > 0) {
            j.css("display", "block"); var l = this; var m, fadeEnabled, moveEnabled, effectName, effectsObject, moveEffectProperty, currEffects, newEffectObj, moveOffset, delay, speed, easing, moveProp; var n = j.children();
            if (this._dw1.length > 0) { for (var a = this._dw1.length - 1; a > -1; a--) { clearTimeout(this._dw1.splice(a, 1)) } }
            if (this._ev1.length > 0) {
                var o; for (var k = this._ev1.length - 1; k > -1; k--) {
                    o = this._ev1[k];
                    if (o) {
                        if (!this._ir) {
                            if (o.running) { o.captionItem.stop(true, true) } else { o.captionItem.css(o.css) }
                        }
                    } this._ev1.splice(k, 1)
                }
            }
            for (var i = 0; i < n.length; i++) {
                m = $(n[i]); effectsObject = {}; fadeEnabled = false; moveEnabled = false; moveEffectProperty = "";
                if (m.attr("data-show-effect") == undefined) { currEffects = this.settings.captionShowEffects }
                else { currEffects = m.attr("data-show-effect").split(" ") } for (var q = 0; q < currEffects.length; q++) {
                    if (fadeEnabled && moveEnabled) { break } effectName = currEffects[q].toLowerCase(); if (!fadeEnabled && effectName == "fade") { fadeEnabled = true; effectsObject['opacity'] = 1 } else if (moveEnabled) { break } else if (effectName == "movetop") { moveEffectProperty = "margin-top" } else if (effectName == "moveleft") { moveEffectProperty = "margin-left" } else if (effectName == "movebottom") { moveEffectProperty = "margin-bottom" } else if (effectName == "moveright") { moveEffectProperty = "margin-right" } if (moveEffectProperty != "") { effectsObject['moveProp'] = moveEffectProperty; if (!l._ir) { effectsObject['moveStartPos'] = parseInt(m.css(moveEffectProperty), 10) } else { effectsObject['moveStartPos'] = 0 } moveEnabled = true }
                } moveOffset = parseInt(m.attr("data-move-offset"), 10);
                if (isNaN(moveOffset)) { moveOffset = this.settings.captionMoveOffset } delay = parseInt(m.attr("data-delay"), 10);
                if (isNaN(delay)) { delay = l.settings.captionShowDelay * i } speed = parseInt(m.attr("data-speed"), 10);
                if (isNaN(speed)) { speed = l.settings.captionShowSpeed } easing = m.attr("data-easing");
                if (!easing) { easing = l.settings.captionShowEasing } newEffectObj = {};
                if (moveEnabled) {
                    moveProp = effectsObject.moveProp;
                    if (moveProp == "margin-right") { moveProp = "margin-left"; newEffectObj[moveProp] = effectsObject.moveStartPos + moveOffset } else if (moveProp == "margin-bottom") { moveProp = "margin-top"; newEffectObj[moveProp] = effectsObject.moveStartPos + moveOffset }
                    else { newEffectObj[moveProp] = effectsObject.moveStartPos - moveOffset }
                }
                if (!l._lo && fadeEnabled) { m.css("opacity", 0) }
                if (!l._ir) {
                    m.css("visibility", "hidden"); m.css(newEffectObj);
                    if (moveEnabled) { newEffectObj[moveProp] = effectsObject.moveStartPos }
                    if (!l._lo && fadeEnabled) { newEffectObj.opacity = 1 }
                } else {
                    var p = {};
                    if (moveEnabled) { p['-webkit-transition-duration'] = "0"; p['-webkit-transition-property'] = "none"; p["-webkit-transform"] = "translate3d(" + (isNaN(newEffectObj["margin-left"]) ? 0 : (newEffectObj["margin-left"] + "px")) + ", " + (isNaN(newEffectObj["margin-top"]) ? 0 : (newEffectObj["margin-top"] + "px")) + ",0)"; delete newEffectObj["margin-left"]; delete newEffectObj["margin-top"]; newEffectObj["-webkit-transform"] = "translate3d(0,0,0)" } newEffectObj.visibility = "visible"; newEffectObj.opacity = 1;
                    if (!l._lo && fadeEnabled) { p["opacity"] = 0 } p["visibility"] = "hidden"; m.css(p)
                }
                this._ev1.push({ captionItem: m, css: newEffectObj, running: false });
                this._dw1.push(setTimeout((function (a, b, c, d, e, f, g) {
                    return function () {
                        l._ev1[e].running = true;
                        if (!l._ir) {
                            a.css("visibility", "visible").animate(b, c, d, function () {
                                if (l._jq && f) { a.get(0).style.removeAttribute('filter') } delete l._ev1[e]
                            })
                        }
                        else { a.css({ '-webkit-transition-duration': (c + "ms"), '-webkit-transition-property': 'opacity' + (g ? ', -webkit-transform' : ''), '-webkit-transition-timing-function': 'ease-out' }); a.css(b) }
                    }
                })(m, newEffectObj, speed, easing, i, fadeEnabled, moveEnabled), delay))
            }
        }
    }, _ir4: function (f, g, h) {
        var i = this.settings.imageScaleMode;
        var j = this.settings.imageAlignCenter;
        if (j || i == "fill" || i == "fit") {
            var k = false; function scaleImg() {
                var d, vRatio, ratio, nWidth, nHeight; var e = new Image();
                e.onload = function () {
                    var a = this.width; var b = this.height;
                    var c = parseInt(f.css("borderWidth"), 10);
                    c = isNaN(c) ? 0 : c; 
                    if (i == "fill" || i == "fit") {
                        d = g / a; vRatio = h / b;
                        if (i == "fill") { ratio = d > vRatio ? d : vRatio }
                        else if (i == "fit") { ratio = d < vRatio ? d : vRatio }
                        else { ratio = 1 } nWidth = parseInt(a * ratio, 10) - c;
                        nHeight = parseInt(b * ratio, 10) - c;
                        f.attr({ "width": nWidth, "height": nHeight }).css({ "width": nWidth, "height": nHeight })
                    }
                    else {
                        nWidth = a - c;
                        nHeight = b - c;
                        f.attr("width", nWidth).attr("height", nHeight)
                    }
                    if (j) { f.css({ "margin-left": Math.floor((g - nWidth) / 2), "margin-top": Math.floor((h - nHeight) / 2) }) } 
                };
                e.src = f.attr("src") }; f.removeAttr('height').removeAttr('width'); if (!this._az4(f.get(0))) { $('<img />').load(function () {
                     scaleImg()
                }).attr('src', f.attr("src")) } else { scaleImg() } }
    }, _az4: function (a) {
        if (a) {
            if (!a.complete) { return false }
            if (typeof a.naturalWidth != "undefined" && a.naturalWidth == 0) { return false }
        }
        else { return false } return true
    }
    };

    $.fn.royalSlider = function (b) {
        return this.each(function () {
            var a = new RoyalSlider($(this), b); $(this).data("royalSlider", a)
        })
    };
    $.fn.royalSlider.defaults = { lockAxis: true, preloadNearbyImages: true, imageScaleMode: "none",
        imageAlignCenter: false, keyboardNavEnabled: false, directionNavEnabled: true,
        directionNavAutoHide: false,
        hideArrowOnLastSlide: true,
        slideTransitionType: "move",
        slideTransitionSpeed: 400,
        slideTransitionEasing: "easeInOutSine",
        captionAnimationEnabled: true,
        captionShowEffects: ["fade", "moveleft"],
        captionMoveOffset: 20, captionShowSpeed: 400,
        captionShowEasing: "easeOutCubic", captionShowDelay: 200, controlNavEnabled: true,
        controlNavThumbs: false, controlNavThumbsNavigation: true, controlNavThumbsSpeed: 400,
        controlNavThumbsEasing: "easeInOutSine", slideshowEnabled: false, slideshowDelay: 5000,
        slideshowPauseOnHover: true, slideshowAutoStart: true, welcomeScreenEnabled: false,
        welcomeScreenShowSpeed: 500, minSlideOffset: 20, disableTranslate3d: false,
        removeCaptionsOpacityInIE8: false, startSlideIndex: 0, slideSpacing: 0,
        blockLinksOnDrag: true, nonDraggableClassEnabled: true, dragUsingMouse: true,
        autoScaleSlider: false, autoScaleSliderWidth: 960, autoScaleSliderHeight: 400,
        beforeSlideChange: function () { }, afterSlideChange: function () { },
        beforeLoadStart: function () { }, loadingComplete: function () { },
        allComplete: function () { }
    };
    $.fn.royalSlider.settings = {}
})(jQuery);