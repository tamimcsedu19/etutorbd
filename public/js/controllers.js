'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('phones/phones.json').success(function(data) {
      $scope.phones = data;
    });

    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('phones/' + $routeParams.phoneId + '.json').success(function(data) {
      $scope.phone = data;
    });
  }]);


// JavaScript Document

phonecatControllers.controller('TypeaheadCtrl', function($scope, $http){

  var _selected;

  $scope.selected = undefined;
  $scope.$watch('$viewContentLoaded', function(){
    $http.get("http://localhost:3000/api/getavailablesubjects").success(
        function(data){
          $scope.states = data.availablesubjects;
        });
  });
});