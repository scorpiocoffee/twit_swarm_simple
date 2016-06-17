'use strict';

/**
 * Identify the navbar directive's controller function.
 */

angular.module('webApp').directive('navbar', () => ({
	restrict: 'E',
	templateUrl: 'app/navbar/navbar.html',
	controller: function($scope, $location, $route) {
		this.$location = $location;
		$scope.home = function() {
			$location.path('/');
			$route.reload();
		};
		$scope.words = function() {
			$location.path('/words');
			$route.reload();
		};
		$scope.profile = function() {
			$location.path('/profile');
			$route.reload();
		};
	},
	controllerAs: 'nav'
}));