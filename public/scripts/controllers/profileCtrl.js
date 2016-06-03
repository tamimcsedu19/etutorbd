/**
 * Created by mahfuj on 6/3/16.
 */




(function() {
    'use strict';

    var serverAddress = 'localhost';

    angular
        .module('Etutor')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['$rootScope','$scope','$http','$location', 'meanData'];

    function profileCtrl($rootScope,$scope,$http,$location, meanData) {

        var vm = this;
        $scope.date = new Date();

        vm.user = {};
        vm.balance;

        meanData.getProfile()
            .success(function(data) {
                vm.user = data;
                console.log(vm.user);

            })
            .error(function (e) {
                console.log(e);
            });

        $http({
            url: "http://"+serverAddress+":3000/api/findBalance",
            method: "get",
            params: { user_id: $rootScope.sessionUser.email }
        }).then(function (response) {
            vm.balance = response.data.balance;

        });
    }

})();