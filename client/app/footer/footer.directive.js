'use strict';

/**
 * Identify the footer directive's controller function.
 */

angular.module('webApp').directive('footer', () => ({
	restrict: 'E',
	templateUrl: 'app/footer/footer.html',
	controller: function($scope, $location, $route) {
		this.$location = $location;
	},
	controllerAs: 'footer'
}));