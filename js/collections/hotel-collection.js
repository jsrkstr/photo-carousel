App.collections.Hotels = Backbone.Collection.extend({


	url : "similar-hotels.json",


	model : App.models.Hotel,


	initialize : function(){
	}

	// comparator : function(model){
	// 	return ${6:// some attr...};
	// }


});