/**
 * Created by mahfuj on 6/3/16.
 */




(function() {
    'use strict';

    var serverAddress = 'localhost';

    angular
        .module('Etutor')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$rootScope','$location', 'authentication'];

    function loginCtrl($rootScope,$location, authentication) {

        var vm = this;

        vm.credentials = {
            email : "",
            password : ""
        };

        vm.onSubmit = function () {
            authentication
                .login(vm.credentials)
                .error(function(err){
                    alert(err);
                })
                .then(function(){
                    vm.currentUser = authentication.currentUser();
                    console.log(vm.currentUser);
                    if( vm.currentUser.userType === 'tutor' )
                    {
                        console.log(vm.currentUser);
                        $location.url('/tutor-home');

                    }
                    else
                    {
                        $location.url('/');
                    }
                });
        };
    }

})();