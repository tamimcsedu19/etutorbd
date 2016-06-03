/**
 * Created by mahfuj on 6/3/16.
 */


(function() {
    'use strict';

    var serverAddress = 'localhost';

    angular
        .module('Etutor')
        .controller('TutorDetailCtrl', TutorDetailCtrl);

    TutorDetailCtrl.$inject = ['$scope', '$routeParams', '$http'];

    function TutorDetailCtrl ($scope, $routeParams, $http) {
        // $http.get('phones/' + $routeParams.tutorId + '.json').success(function (data) {
        //     $scope.phone = data;
        // });
    }

})();
