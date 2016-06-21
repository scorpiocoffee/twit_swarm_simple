'use strict';

/** Provide the routes and service of socket.io */
angular.module('webApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'pages/main/main.html',
        controller: 'MainController'
      })
      .when('/profile', {
        templateUrl: 'pages/profile/profile.html',
        controller: 'ProfileController'
      })
      .when('/words', {
        templateUrl: 'pages/words/words.html',
        controller: 'WordsController'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
})
  .factory('socket',function($rootScope) {
    var socket = io();
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if(callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });
