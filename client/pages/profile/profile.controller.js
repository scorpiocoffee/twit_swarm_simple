'use strict';

angular.module('webApp').controller('ProfileController', function($scope, $location, socket) {
	$scope.profileForm = {};
    $scope.profileinfo = [];
    $scope.profileshow = 0;
    $scope.profileBtn = function(profileForm) {
    	var data = new Object();
    	data.name = profileForm.name;
    	socket.emit('profile', data); 
        profileForm.name = '';
        $scope.profileshow++;
    };

    socket.on('profileinfo', function(data) {
        $scope.profileinfo = data;
    });

    socket.on('twinfo', function(data) {
        $scope.imgstatus = true;
        for(var i=0; i<data.length; i++) {
            if(data[i][6] === null || data[i][6] === undefined) {
                $scope.imgstatus = false;
            }
            else {
                $scope.imgstatus = true;
            }
        }
        $scope.twinfo = data;
    });

    socket.on('hotwords', function(data) {       
        $scope.hotwords = data;
    });
});