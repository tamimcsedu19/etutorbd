/**
 * Created by mahfuj on 6/3/16.
 */



(function() {
    'use strict';

    var serverAddress = 'localhost';

    angular
        .module('Etutor')
        .controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['$rootScope','$location', '$route','authentication'];

    function navigationCtrl($rootScope,$location, $route,authentication) {

        var vm = this;

        vm.logOut = function () {
            authentication
                .logout();
            if ($location.path() === '/') {
                $route.reload();
            }
            else {
                $location.url('/');
            }
        };
    }

})();