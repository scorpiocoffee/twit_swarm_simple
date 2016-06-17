'use strict';

/**
 * Identify the post directive's controller function.
 */

angular.module('webApp').directive('post', () => ({
	restrict: 'E',
	templateUrl: 'app/post/post.html',
	controller: function($scope, $location, $route, twitSocket) {
		this.$location = $location;
		$scope.postForm = {};
		$scope.appear = true;
		$scope.postBtn = function(postForm) {
			var data = new Object();
			data.text = postForm.text;
			twitSocket.emit('post', data);
			postForm.text = '';
			$scope.appear = !$scope.appear;
			alert('The message has posted successfully!');
			$location.path('/profile');
			$route.reload();
		}
	},
	controllerAs: 'post'
}));