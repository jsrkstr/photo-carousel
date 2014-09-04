/* ========================================================================
 * Photo Carousel v1.0.0
 * Developer - Sachin (sachin@jsrockstar.in) 
 * Features- 
 *
 * Lazy loading - Intelligent algorithm that preloads only next/prev images of current image. Hence reducing page load time. Also the carousel uses only 3 image elements   and swaps them for next, current, previous. Hence saving HTML code and number of DOM nodes and low in memory.
 * Small jQuery Plugin with supported methods - play, pause, next, prev
 * Automatic slideshow
 * Circular loop - first image comes after last
 * Prev/Next buttons
 * Photo description - contents of the images alt text
 * Pause slideshow when user mouse overs
 * Select image from thumbnail
 * CSS3 Slide Animation with older browsers support
 * Thumbnail indicators
 * ======================================================================== 
 */

+function ($) {

  // Carousel class
  var Carousel = function (elm, options) {

    this.$elm = $(elm);
    this.$active = this.$elm.find('.item.active');
    this.$prev = this.$elm.find('.item.prev');
    this.$next = this.$elm.find('.item.next');
    this.$description = this.$elm.find(".description");
    this.$activeThumb = this.$elm.find('.carousel-thumbnails li.active');

    this.options = options;

    // setup thumbnails
    this.$elm.find('.carousel-thumbnails li').on("click", $.proxy(this.select, this));
    
    // setup left and right arrows
    this.$elm.find('.arrow').on("click", $.proxy(function(e){
      this.pause();
      if($(e.currentTarget).hasClass("right-arrow"))
        this.next();
      else
        this.prev();
    }, this));

    // pause slider on mouse hover on big photo
    var that =  this;
    this.$elm.find('.carousel-inner').hover(function(){
      that.pause();
    }, function(){
      that.play();
    });

  }

  Carousel.DEFAULTS = {
    interval: 4000
  }

  Carousel.prototype.play = function(){
    if(this.interval)
      return;

    var that = this;
    this.interval = window.setInterval(function(){
      that.slide("next");
    }, this.options.interval);

    return this;
  }


  Carousel.prototype.pause = function (e) {
    this.interval = clearInterval(this.interval)
    return this;
  }


  Carousel.prototype.select = function(e){
    if(this.sliding)
      return false;
    
    var thumb = $(e.currentTarget);
    var toIndex = thumb.index();
    var currentIndex = this.$activeThumb.index();
    
    this.pause();

    // find which way to slide & thumb previous to selected thumb
    var type;
    if(toIndex > currentIndex){
      type = "next";
      thumb = thumb.prev();
    } else if( toIndex < currentIndex){
      type = "prev";
      thumb = thumb.next();
    } else {
      return;
    }
    
    // change active thumb to the (thumb previous to selected thumb)
    this.$activeThumb.removeClass("active");
    this.$activeThumb = thumb; 

    this.lazyLoad(type);

    // do slide
    this.slide(type);

    return this;
  }

  Carousel.prototype.next = function () {
    this.slide('next');
    return this;
  }

  Carousel.prototype.prev = function () {
    this.slide('prev');
  }


  Carousel.prototype.lazyLoad = function(type) {

    var thumb, big;

    if(type == "next"){
      thumb = this.$activeThumb.next(); // next thumb
      big = this.$next; // next image
      if(!thumb.length)
        thumb = this.$activeThumb.parent().children().first();

    } else if(type == "prev"){
      thumb = this.$activeThumb.prev();
      big = this.$prev;
      if(!thumb.length)
        thumb = this.$activeThumb.parent().children().last();

    } else {
      thumb = this.$activeThumb;
      big = this.$active;
    }


    if(!thumb.length)
      return;

    // change the src of img
    var src = thumb.find("img").data("big");
    big.find("img").attr("src", src);

    return this;
  }


  Carousel.prototype.pause = function(){
    this.interval = clearInterval(this.interval);
    return this;
  }

  Carousel.prototype.slide = function (type) {
    
    if(this.sliding)
      return;
    else
      this.sliding = true;

    var direction = type == 'next' ? 'move-left' : 'move-right'
    var that = this;

    // find slide elms
    var slideElm, noSlideElm;
    if(type == "next"){
      slideElm = this.$next;
      noSlideElm = this.$prev;
    } else {
      slideElm = this.$prev;
      noSlideElm = this.$next;
    }

    // select transition type (slide or no transition)
    if ($.support.transition) {

      // change no slide img to next img
      if(type == "next"){
        noSlideElm.addClass("no-transition next").removeClass("prev");
      } else {
        noSlideElm.addClass("no-transition prev").removeClass("next");
      }

      slideElm.one($.support.transition.end, $.proxy(onTransitionEnd, this)); 

    } else {
      
      setTimeout($.proxy(function() {
        $.proxy(onTransitionEnd, this)();
      },this), 50);
    }

    // slide the active and incomming img
    slideElm.addClass(direction);
    this.$active.addClass(direction);

    function onTransitionEnd() {

      // reset image elms
      this.$active.removeClass("active move-right move-left");
      this.$next.removeClass("next move-left move-right no-transition");
      this.$prev.removeClass("prev right move-left move-right no-transition");

      var thumb;

      if(type == "next"){
        // swap images in fwd direction
        var tmp = this.$prev;
        this.$prev = this.$active;
        this.$active = this.$next;
        this.$next = tmp;

        // change thumb
        thumb = this.$activeThumb.next();
        if(!thumb.length)
          thumb = this.$activeThumb.parent().children().first();

      } else {
        // swap images in bwd direction
        var tmp = this.$next;
        this.$next = this.$active;
        this.$active = this.$prev;
        this.$prev = tmp;

        // change thumb
        thumb = this.$activeThumb.prev();
        if(!thumb.length)
          thumb = this.$activeThumb.parent().children().last();
      }

      // initialize imgs
      this.$active.addClass("active");
      this.$next.addClass('next');
      this.$prev.addClass("prev");


      // initlialize thumbnail
      this.$activeThumb.removeClass("active");
      this.$activeThumb = thumb;
      this.$activeThumb.addClass("active");

      this.lazyLoad(type);
      this.lazyLoad("curr");

      // change description
      this.$description.text(this.$activeThumb.find("img").attr('alt'));

      this.sliding = false;
    }

    return this
  }


  // Add jQuery plugin
  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this);

      // get created instance
      var carousel = $this.data('custom-carousel');

      var options = $.extend({}, Carousel.DEFAULTS, typeof option == 'object' && options)

      // create new instance
      if (!carousel) {
        carousel = new Carousel(this, options);
        $this.data('custom-carousel', carousel);
      }

      var action  = typeof option == 'string' ? option : "play";

      // execute action
      carousel[action]();
      carousel.lazyLoad("prev");
      carousel.lazyLoad("next");
    })
  }

  $.fn.carousel.Constructor = Carousel


}(jQuery);
