App.views.HotelsView = Backbone.View.extend({

	tagName : 'ul',
	className : "hotel-list",


	events : {
		
	},


	initialize : function(){
		
	},


	render : function(){
		this.addAll();
		return this;
	},


	addAll : function(){
		this.collection.each(function(model){
			this.addOne(model);
		}, this);
	},


	addOne : function(model){
		var view = new App.views.HotelView({model : model});
		$(this.el).append(view.render().el);
	}

});