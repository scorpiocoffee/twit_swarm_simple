'use strict';

angular.module('webApp').controller('WordsController', function($scope, $location, socket) {
	$scope.wordsForm = {};
	$scope.allnames;
	$scope.resultsshow = 0;
	$scope.wordsBtn = function(wordsForm) {
		var data = new Object();
		data.name = wordsForm.name;
		$scope.allnames = wordsForm.name.replace(/\;/, ' ');
		data.num = wordsForm.num;	
		data.days = wordsForm.days;
		socket.emit('find_hot_words', data);
		wordsForm.name = '';
		wordsForm.num = '';
		wordsForm.days = '';
		$scope.resultsshow++;
	};
	
	socket.on('find_same', function(data) {
		$scope.allwords = data.words;
		$scope.allcounts = data.counts;
	});
    
    
});