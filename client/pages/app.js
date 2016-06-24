'use strict';

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
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
});
