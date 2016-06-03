/* App Module */


(function () {

    'use strict';
    angular.module('Etutor', [
        'ngRoute',
        'tutorFilters',
        'ui.bootstrap',
        'ngMaterial',
        'colorpicker.module',
        'ngAnimate',
        'angularUtils.directives.dirPagination'
    ]);


    function config($routeProvider, $locationProvider) {
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
                controller: 'tutorHomeCtrl',
                controllerAs: 'vm'
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
            }).when('/canvas/:liveLessionId', {
                templateUrl: 'partials/canvas.html'
            }).otherwise({
                redirectTo: '/'
            });
            $locationProvider.html5Mode(true);
    }


    function run($rootScope, $location, authentication) {
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            var serverAddress = 'localhost';
            $rootScope.sessionUser = authentication.currentUser();
            $rootScope.loginCheck = authentication.isLoggedIn();
            console.log('inside app.js' + $rootScope.loginCheck);
            var socketURL = "http://" + serverAddress + ":3001";
            var options = {
                transports: ['websocket'],
                'force new connection': true
            };

            clearAllPopUps();


            if ($location.path() === '/' && authentication.isLoggedIn() && $rootScope.sessionUser.userType === 'tutor') {
                if (typeof $rootScope.mySocket === 'undefined' || $rootScope.mySocket === null) {
                    $rootScope.mySocket = io.connect(socketURL, options);
                    $rootScope.mySocket.emit('create', {user_id: $rootScope.sessionUser.email});
                }
                $location.path('/tutor-home');
            }


            if (($location.path() === '/profile' || $location.path() === '/tutor-home') && !authentication.isLoggedIn()) {
                $location.path('/');
            }
            else if (($location.path() === '/login' || $location.path() === '/register') && authentication.isLoggedIn()) {

                if (typeof $rootScope.mySocket === 'undefined' || $rootScope.mySocket === null) {
                    $rootScope.mySocket = io.connect(socketURL, options);
                    $rootScope.mySocket.emit('create', {user_id: $rootScope.sessionUser.email});
                }

                $location.path('/');
            }
            if (authentication.isLoggedIn()) {
                if (typeof $rootScope.mySocket === 'undefined' || $rootScope.mySocket === null) {
                    $rootScope.mySocket = io.connect(socketURL, options);
                    $rootScope.mySocket.emit('create', {user_id: $rootScope.sessionUser.email});
                }

            }

        });
    }

    angular
        .module('Etutor')
        .config(['$routeProvider', '$locationProvider', config])
        .run(['$rootScope', '$location', 'authentication', run]);

})();

