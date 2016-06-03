/**
 * Created by mahfuj on 6/3/16.
 */



(function() {
    'use strict';

    var serverAddress = 'localhost';

    angular
        .module('Etutor')
        .controller('registerCtrl', registerCtrl);

    registerCtrl.$inject = ['$location', 'authentication'];

    function registerCtrl($location, authentication) {

        var vm = this;

        vm.credentials = {
            fullName : "",
            email : "",
            password : ""
        };

        vm.onSubmit = function () {
            console.log('Submitting registration');
            authentication
                .register(vm.credentials)
                .error(function(err){
                    alert(err);
                })
                .then(function(){
                    $location.url('/profile');
                });
        }
    }

})();