/**
 * Created by mahfuj on 6/3/16.
 */


(function() {
    'use strict';

    var serverAddress = 'localhost';

    angular
        .module('Etutor')
        .controller('homeCtrl', homeCtrl);

    

    function homeCtrl() {

        console.log('Home controller is running');
    }

})();