'use strict';

/* Controllers */

var tutorControllers = angular.module('tutorControllers', []);

tutorControllers.controller('TutorListCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('phones/phones.json').success(function (data) {
            $scope.phones = data;
        });

        $scope.orderProp = 'age';
    }]);

tutorControllers.controller('TutorDetailCtrl', ['$scope', '$routeParams', '$http',
    function ($scope, $routeParams, $http) {
        $http.get('phones/' + $routeParams.tutorId + '.json').success(function (data) {
            $scope.phone = data;
        });
    }]);


// JavaScript Document

tutorControllers.controller('TypeaheadCtrl', function ($scope, $http) {

    var _selected;

    $scope.selected = undefined;
    $scope.$watch('$viewContentLoaded', function () {
        $http.get("http://localhost:3000/api/getavailablesubjects").success(
            function (data) {
                $scope.states = data.availablesubjects;
            });
    });
});



tutorControllers.controller('homeCtrl',
    function () {
        console.log('Home controller is running');
    });





tutorControllers.controller('registerCtrl', [ '$location', 'authentication',
    function ($location, authentication) {
        var vm = this;

        vm.credentials = {
            name : "",
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
    }]);




tutorControllers.controller('loginCtrl', [ '$location', 'authentication',
    function ($location, authentication) {
        var vm = this;

        vm.credentials = {
            email : "",
            password : ""
        };

        vm.onSubmit = function () {
            authentication
                .login(vm.credentials)
                .error(function(err){
                    alert(err);
                })
                .then(function(){
                    $location.url('/profile');
                });
        };
    }]);


tutorControllers.controller('profileCtrl', [ '$location', 'meanData',
    function ($location, meanData) {
        var vm = this;

        vm.user = {};

        meanData.getProfile()
            .success(function(data) {
                vm.user = data;
            })
            .error(function (e) {
                console.log(e);
            });
    }]);

tutorControllers.controller('navigationCtrl', [ '$location', 'authentication',
    function ($location, authentication) {
        var vm = this;

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentUser = authentication.currentUser();
    }]);




// tutorControllers.controller('chatCtrl', function ($scope, $log, $compile,socket) {
//   $scope.all_messages = new Array();
//
//   $scope.chatSend = function(id, name) {
//     var chattext = document.getElementById("chatin"+id).value;
//     document.getElementById("chatin"+id).value='';
//     console.log(" id = " + id + ", with name: " + name + " sent : \n "+chattext);
//     $scope.all_messages[id].push({name: name, msg: chattext});
//   };
//
//   $scope.chatReceive = function () {
//     var username = "";
//     //var myEl = angular.element( document.querySelector( '#divID' ) );
//   };
//
//   $scope.addChatBox = function(id, name){
//     //console.log("addcaht called...." + id);
//     if(!$scope.all_messages[id]){
//       $scope.all_messages[id] = new Array();
//       //console.log("New array created");
//     }
//     var tempclick = '<span class="input-group-btn"><button class="btn btn-primary" type="button" ng-click="chatSend(\''+id+'\', \''+ name+'\')">SEND</button></span>';
//     //'onclick=chatSend(\''+id+'\')';
//     var tmpinput = '<input type="text" class="form-control" placeholder="Enter your text..." id= "chatin'+ id+ '">';
//
//     var tmpfullin = '<div class="well well-sm"><div class="input-group"">'+tmpinput+ tempclick +'</div></div>';
//
//     var repeatel = '<md-list>  <md-list-item class="md-2-line" ng-repeat="item in all_messages[\''+id+'\']"> <div class="md-list-item-text"> <h3>{{item.name}}</h3> <p>{{item.msg}} </p> </div> <md-divider inset></md-divider> </md-list-item> </md-list>';
//
//     var element = '<div class="popup-box chat-popup" id="'+ id +'">';
//     element = element + '<div class="popup-head">';
//     element = element + '<div class="popup-head-left">'+ name +'</div>';
//     element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
//     element = element + '<div style="clear: both"></div></div><div class="popup-messages">'+repeatel+'</div>'+ tmpfullin +'</div>';
//
//     var divElement = angular.element(document.querySelector('#outer'));
//     var appendHtml = $compile(element)($scope);
//     divElement.append(appendHtml);
//   }
// });

tutorControllers.controller('chatCtrl', ['$scope', '$log', '$compile',
    function ($scope, $log, $compile) {



        var socketURL = "http://localhost:3001";
        var options = {
            transports: ['websocket'],
            'force new connection': true
        };

        var c1 = io.connect(socketURL, options);
        var c2 = io.connect(socketURL, options);
        $scope.all_messages = new Array();

        $scope.chatSend = function (id, name) {
            var chattext = document.getElementById("chatin" + id).value;
            document.getElementById("chatin" + id).value = '';
            console.log(" id = " + id + ", with name: " + name + " sent : \n " + chattext);
            $scope.all_messages[id].push({name: name, msg: chattext});

            c1.emit('message', {
                from: 'tamim.tamim1382@gmail.com',
                to: id,
                message: chattext,
                timeStamp: 5

            });
        };

        $scope.chatReceive = function () {
            var username = "";
            //var myEl = angular.element( document.querySelector( '#divID' ) );
        };

        $scope.addChatBox = function (id, name) {
            console.log("addcaht called...." + id);


            c1.emit('create', {user_id: 'tamim.tamim1382@gmail.com'});
            c2.emit('create', {user_id: 'rakib13th@yahoo.com'});


            if (!$scope.all_messages[id]) {
                $scope.all_messages[id] = new Array();
                //console.log("New array created");
            }
            var tempclick = '<span class="input-group-btn"><button class="btn btn-primary" type="button" ng-click="chatSend(\'' + id + '\', \'' + name + '\')">SEND</button></span>';
            //'onclick=chatSend(\''+id+'\')';
            var tmpinput = '<input type="text" class="form-control" placeholder="Enter your text..." id= "chatin' + id + '">';

            var tmpfullin = '<div class="well well-sm"><div class="input-group"">' + tmpinput + tempclick + '</div></div>';

            var repeatel = '<md-list>  <md-list-item class="md-2-line" ng-repeat="item in all_messages[\'' + id + '\']"> <div class="md-list-item-text"> <h3>{{item.name}}</h3> <p>{{item.msg}} </p> </div> <md-divider inset></md-divider> </md-list-item> </md-list>';

            var element = '<div class="popup-box chat-popup" id="' + id + '">';
            element = element + '<div class="popup-head">';
            element = element + '<div class="popup-head-left">' + name + '</div>';
            element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\'' + id + '\');">&#10005;</a></div>';
            element = element + '<div style="clear: both"></div></div><div class="popup-messages">' + repeatel + '</div>' + tmpfullin + '</div>';

            var divElement = angular.element(document.querySelector('#outer'));
            var appendHtml = $compile(element)($scope);
            divElement.append(appendHtml);

            var offset = 'ffffffffffffffffffffffff';
            c1.emit('retrieveMessages', {
                toUserId: 'rakib13th@yahoo.com',
                fromUserId: 'tamim.tamim1382@gmail.com',
                pageSize: 2,
                offset: offset

            });


        };

        // ================
        // var offset = 'ffffffffffffffffffffffff';
        //
        // socket.on('connect', function () {
        //   socket.emit('create', {user_id: 'tamim.tamim1382@gmail.com'});
        // });
        //
        // socket.on('message', function (data) {
        //
        //
        //
        // });


        // $scope.send = function (data) {
        //   socket.emit('message', {
        //     from: 'rakib13th@yahoo.com',
        //     to: 'tamim.tamim1382@gmail.com',
        //     message: "How are you",
        //     timeStamp: 5
        //
        //   });
        //
        //
        // };

        // socket.emit('retrieveMessages', {
        //   toUserId: 'rakib13th@yahoo.com',
        //   fromUserId: 'tamim.tamim1382@gmail.com',
        //   pageSize: 1,
        //   offset: offset
        //
        // });

        c1.on('historyMessages', function (data) {
                console.log(data.messages.length+"\n");
                for(var i=0; i < data.messages.length;i++)
                {
                    $scope.all_messages[data.id.toUserId].push({name:data.messages[i].from, msg:data.messages[i].message});
                    // $scope.all_messages[data.id.toUserId].push({name:data.messages[i].from, msg:data.messages[i].message});
                }
            $scope.$apply();
        });
    }]);