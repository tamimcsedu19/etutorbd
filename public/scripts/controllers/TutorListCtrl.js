/**
 * Created by mahfuj on 6/3/16.
 */



(function() {
    'use strict';

    var serverAddress = 'localhost';

    angular
        .module('Etutor')
        .controller('TutorListCtrl', TutorListCtrl);

    TutorListCtrl.$inject = ['$scope', '$routeParams', '$http'];

    function TutorListCtrl ($scope,$routeParams, $http) {
        console.log('searched subject is: '+$routeParams.subject);
        $http({
            url: "http://"+serverAddress+":3000/api/search",
            method: "get",
            params: { subject: $routeParams.subject }
        }).then(function (response) {
            $scope.phones = response.data;
            console.log(response.data);
            console.log(response.data.university);
        });

        $scope.orderProp = 'age';
    }

})();
