'use strict';

angular.module('webApp').controller('MainController', function($scope, $location, socket) {

    $scope.searchForm = {};
    $scope.twits = [];  
    $scope.results = 0; 

    $scope.searchClick = function(searchForm) {
        var data = new Object();
        var qs = 0;
        if(searchForm.query == '' || searchForm.query == undefined)
        {
            qs++;
        }
        if(searchForm.tag == '' || searchForm.tag == undefined)
        {
            qs++;
        }
        if(searchForm.name == '' || searchForm.name == undefined) {
            qs++;
        }
        if(searchForm.type == 'AND') {
            if(qs == 0) {
                data = searchForm.query + ' #' + searchForm.tag + ' from:@' + searchForm.name;
            }
            if(qs == 1) {
                if(searchForm.query == '' || searchForm.query == undefined)
                {
                    data = '#' + searchForm.tag + ' from:@' + searchForm.name;
                }
                if(searchForm.tag == '' || searchForm.tag == undefined)
                {
                    data = searchForm.query + ' from:@' + searchForm.name;
                }
                if(searchForm.name == '' || searchForm.name == undefined)
                {
                    data = searchForm.query + ' #' + searchForm.tag;
                }
            }
        }
        if(searchForm.type == 'OR') {
            if(qs == 0) {
                data = searchForm.query + ' OR #' + searchForm.tag + ' OR from:@' + searchForm.name;
            }
            if(qs == 1) {
                if(searchForm.query == '' || searchForm.query == undefined)
                {
                    data = '#' + searchForm.tag + ' OR from:@' + searchForm.name;
                }
                if(searchForm.tag == '' || searchForm.tag == undefined)
                {
                    data = searchForm.query + ' OR from:@' + searchForm.name;
                }
                if(searchForm.name == '' || searchForm.name == undefined)
                {
                    data = searchForm.query + ' OR #' + searchForm.tag;
                }
            }
        }
        if(qs == 3) {
            alert("Please enter some words or people's screen name!");
        }
        if(qs == 2) {
            if(searchForm.query != '' && searchForm.query != undefined) {
                data = searchForm.query;
            }
            if(searchForm.tag != '' && searchForm.tag != undefined) {
                data = '#' +  searchForm.tag;
            }
            if(searchForm.name != '' && searchForm.name != undefined) {
                data = 'from:@' + searchForm.name;
            }
        }
        socket.emit('search_query', data);
        searchForm.name = '';
        searchForm.tag = '';
        searchForm.query = '';  
        $scope.results++;                  
    };

    socket.on('results', function(data) {     
        $scope.twits = data; 
    });

});