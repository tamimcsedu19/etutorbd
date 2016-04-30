'use strict';

/* Directives */
(function () {

    angular
        .module('Etutor')
        .directive('navigation', navigation);

    function navigation () {
        return {
            restrict: 'EA',
            templateUrl: '../partials/navigationTemplate.html',
            controller: 'navigationCtrl as navvm'
        };
    }

})();