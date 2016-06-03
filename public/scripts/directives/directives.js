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

/*
 This directive allows us to pass a function in on an enter key to do what we want.
 */

(function () {

    angular
        .module('Etutor')
        .directive('ngEnter', enter);

    function enter () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    }

})();
