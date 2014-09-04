App.models.Hotel = Backbone.Model.extend({

	// defaults : {

	// },


	// validate : function(attrs){
	// 	${3: // check attrs... return error to fail validation..}
	// },


	initialize : function(args){
		this.set({
			url : "/hotel/" + this.id
		}, {silent : true});
	}

});