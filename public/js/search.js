var app = angular.module('ui.bootstrap.demo', ['ui.bootstrap']);
app.controller('TypeaheadCtrl', function($scope, $http) {

  var _selected;
  $scope.selected = undefined;
	
  
	$scope.$watch('$viewContentLoaded', function(){
		$http.get("http://localhost:3000/api/getavailablesubjects").success(
		function(data){
		$scope.states = data.availablesubjects;
		}); 
	});
  
});