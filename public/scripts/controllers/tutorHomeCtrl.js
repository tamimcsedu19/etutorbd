/**
 * Created by mahfuj on 6/3/16.
 */




(function() {
    'use strict';

    var serverAddress = 'localhost';

    angular
        .module('Etutor')
        .controller('tutorHomeCtrl', tutorHomeCtrl);

    tutorHomeCtrl.$inject = ['$scope','$location', 'meanData'];

    function tutorHomeCtrl($scope,$location, meanData) {

        var vm = this;

        vm.user = {};

        meanData.getProfile()
            .success(function(data) {
                vm.user = data;
                console.log(vm.user);

            })
            .error(function (e) {
                console.log(e);
            });
    }

})();
