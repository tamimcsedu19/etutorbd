'use strict';

/* App Module */

var tutorApp = angular.module('Etutor', [
    'ngRoute',
    'tutorControllers',
    'tutorFilters',
    'ui.bootstrap',
    'ngMaterial',
    'angularUtils.directives.dirPagination'
]);

tutorApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            }).when('/register', {
                templateUrl: 'partials/register.html',
                controller: 'registerCtrl',
                    controllerAs: 'vm'
            }).when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            }).when('/tutor-home', {
                templateUrl: 'partials/tutorHome.html',
                controller: 'tutorChatCtrl'
            }).when('/profile', {
                templateUrl: 'partials/profile.html',
                controller: 'profileCtrl',
                controllerAs: 'vm'
            }).when('/tutors/:subject', {
                templateUrl: 'partials/tutor-list.html',
                controller: 'TutorListCtrl'
            }).when('/tutor/:tutorId', {
                templateUrl: 'partials/tutor-detail.html',
                controller: 'TutorDetailCtrl'
            }).when('/chat', {
                templateUrl: 'partials/chatDemo.html',
                controller: 'chatCtrl'
            }).otherwise({
                redirectTo: '/'
            });
            $locationProvider.html5Mode(true);
        }
]);

tutorApp.run(['$rootScope', '$location', 'authentication',
    function ($rootScope, $location, authentication) {
        $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
            if ($location.path() === '/tutors' && !authentication.isLoggedIn()) {
                $location.path('/');
            }
        });
    }
]);

