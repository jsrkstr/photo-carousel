// you can enter your JS here!

App = {
	models : {},
	views : {},
	collections : {},

	init : function(){
		// initialize caroused
		$("#photo-carousel").carousel();		


		// setup similar hotels 
		var similarHotels = new App.collections.Hotels();
		similarHotels.reset(similar_hotels_json_feed);

		var hotelsView = new App.views.HotelsView({collection : similarHotels });
		$("#similar-hotels-container").append(hotelsView.render().el);

		// setup show more link
		$(".show-more").click(function(){
			var show = false;
			if($(this).hasClass("shown")){
				$(this).text("Show More");
			} else {
				show = true;
				$(this).text("Show Less");
			}
			$(this).toggleClass("shown", show).siblings(".show-more-content").toggleClass("hide", !show);
			return false;
		})
	}
}


// Start here...
$(function(){
	App.init();
});

// underscore template setting
_.templateSettings = {
	interpolate: /\{\{\=(.+?)\}\}/g,
	evaluate: /\{\{(.+?)\}\}/g
};