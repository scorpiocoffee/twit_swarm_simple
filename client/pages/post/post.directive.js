'use strict';

angular.module('webApp').directive('post', () => ({
	restrict: 'E',
	templateUrl: 'pages/post/post.html',
	controller: function($scope, $location, $route, socket) {
		this.$location = $location;
		$scope.postForm = {};
		$scope.appear = true;
		$scope.postBtn = function(postForm) {
			var data = new Object();
			data.text = postForm.text;
			socket.emit('post', data);
			postForm.text = '';
			$scope.appear = !$scope.appear;
			alert('The message has posted successfully!');
			$location.path('/profile');
			$route.reload();
		}
	},
	controllerAs: 'post'
}));