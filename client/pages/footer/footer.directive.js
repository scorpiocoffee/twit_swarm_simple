'use strict';

angular.module('webApp').directive('footer', () => ({
	restrict: 'E',
	templateUrl: 'pages/footer/footer.html',
	controller: function($scope, $location, $route) {
		this.$location = $location;
	},
	controllerAs: 'footer'
}));