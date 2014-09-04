App.views.HotelView = Backbone.View.extend({

	tagName : "li",
	className : "item mb10",

	events : {
		
	},


	initialize : function(){
		this.template =  _.template($("#hotel-view-templ").html());
	},


	render : function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});