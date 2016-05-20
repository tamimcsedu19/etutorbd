'use strict';

/* Controllers */
var serverAddress = 'localhost';
var tutorControllers = angular.module('tutorControllers', []);

tutorControllers.controller('TutorListCtrl', ['$scope', '$routeParams', '$http',
    function ($scope,$routeParams, $http) {
        console.log('searched subject is: '+$routeParams.subject);
        $http({
            url: "http://"+serverAddress+":3000/api/search",
            method: "get",
            params: { subject: $routeParams.subject }
        }).then(function (response) {
            //$scope.phones = response.data;
            console.log(response.data[0].university);
            console.log(response.data[0]);
        })

        $http.get('phones/phones.json').success(function (data) {
            $scope.phones = data;
            console.log(data);
        });

        $scope.orderProp = 'age';
    }]);

tutorControllers.controller('TutorDetailCtrl', ['$scope', '$routeParams', '$http',
    function ($scope, $routeParams, $http) {
        $http.get('phones/' + $routeParams.tutorId + '.json').success(function (data) {
            $scope.phone = data;
        });
    }]);





tutorControllers.controller('TypeaheadCtrl', [ '$scope','$http', '$window','$location', 'authentication',
    function ($scope,$http,$window,$location,authentication) {

        $scope.selected = undefined;
        $scope.$watch('$viewContentLoaded', function () {
            $http.get("http://"+serverAddress+":3000/api/getavailablesubjects").success(
                function (data) {
                    $scope.subjects = data.availablesubjects;
                });
        });

        $scope.check = function(){

            var isLoggedIn;

            isLoggedIn = authentication.isLoggedIn();
            if(isLoggedIn) {
                $location.url('/tutors/'+$scope.selected);
            }
            else {
                $window.alert("Please Login!");
            }

        };

    }]);





tutorControllers.controller('homeCtrl',
    function () {
        console.log('Home controller is running');
    });





tutorControllers.controller('registerCtrl', [ '$location', 'authentication',
    function ($location, authentication) {
        var vm = this;

        vm.credentials = {
            fullName : "",
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




tutorControllers.controller('loginCtrl', [ '$rootScope','$location', 'authentication',
    function ($rootScope,$location, authentication) {
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
                    vm.currentUser = authentication.currentUser();
                    console.log(vm.currentUser);
                    if( vm.currentUser.userType === 'tutor' )
                    {
                        console.log(vm.currentUser);

                        // var socketURL = "http://"+serverAddress+":3001";
                        // var options = {
                        //     transports: ['websocket'],
                        //     'force new connection': true
                        // };
                        //
                        // $rootScope.mySocket = io.connect(socketURL, options);
                        // $rootScope.mySocket.emit('create', {user_id: vm.currentUser.email});

                        $location.url('/tutor-home');
                        
                    }
                    else
                    {
                        // var socketURL = "http://"+serverAddress+":3001";
                        // var options = {
                        //     transports: ['websocket'],
                        //     'force new connection': true
                        // };
                        //
                        // $rootScope.mySocket = io.connect(socketURL, options);
                        // $rootScope.mySocket.emit('create', {user_id: vm.currentUser.email});
                        $location.url('/');
                    }
                });
        };
    }]);


tutorControllers.controller('profileCtrl', [ '$scope','$location', 'meanData',
    function ($scope,$location, meanData) {
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
    }]);

tutorControllers.controller('tutorHomeCtrl', [ '$scope','$location', 'meanData',
    function ($scope,$location, meanData) {
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
    }]);

tutorControllers.controller('navigationCtrl', [ '$rootScope','$location', '$route','authentication',
    function ($rootScope,$location, $route,authentication) {
        var vm = this;

        // vm.isLoggedIn = authentication.isLoggedIn();
        //
        // vm.currentUser = authentication.currentUser();
        // if(vm.isLoggedIn){
        //     vm.userType = vm.currentUser.userType;
        // }


        vm.logOut = function () {
            authentication
                .logout();
            if ($location.path() === '/') {
                $route.reload();
            }
            else {
                $location.url('/');
            }
        };
    }]);





tutorControllers.controller('chatCtrl', ['$rootScope','$scope', '$log', '$compile','authentication',
    function ($rootScope,$scope, $log, $compile,authentication) {


        console.log('chat control student');
        var vm = this;
        vm.currentUser = authentication.currentUser();
        
        $scope.messages = new Array();

        $scope.chatSend = function (id, name) {
            var chattext = document.getElementById("chatin" + id).value;
            document.getElementById("chatin" + id).value = '';
            console.log(" id = " + id + ", with name: " + name + " sent : \n " + chattext);
            $scope.chatInit(id);
            $scope.messages[id].push({name: name, msg: chattext});

            $rootScope.mySocket.emit('message', {
                from: vm.currentUser.email,
                to: id,
                message: chattext,
                timeStamp: Date.now(),
                senderName:vm.currentUser.name

            });
        };

        $scope.chatReceive = function (id, name, msg_text) {
            console.log("In receive id= "+id );
            register_popup(id, name);

            $scope.chatInit(id);
            // $rootScope.all_student_messages[id].push({name:data.messages[i].from, msg:data.messages[i].message});
            $scope.messages[id].push({name: name, msg: msg_text});
            //$scope.$apply();
        };

        $scope.chatInit = function(id){
            console.log('first '+(typeof $scope.messages[id] === 'undefined'));
            if ( !$scope.messages[id]) {
                $scope.messages[id] = new Array();
                console.log("New array created");

                var offset = 'ffffffffffffffffffffffff';
                $rootScope.mySocket.emit('retrieveMessages', {
                    toUserId: id,
                    fromUserId: vm.currentUser.email,
                    pageSize: 30,
                    offset: offset

                });
            }
            console.log('second '+(typeof $scope.messages[id] === 'undefined'));
        };

        $scope.addChatBox = function (id, name) {
            console.log("addcaht called...." + id);




            var tempclick = '<span class="input-group-btn"><button class="btn btn-primary" type="button" ng-click="chatSend(\'' + id + '\', \'' + name + '\')">SEND</button></span>';
            //'onclick=chatSend(\''+id+'\')';
            var tmpinput = '<input type="text" class="form-control" placeholder="Enter your text..." id= "chatin' + id + '">';

            var tmpfullin = '<div class="well well-sm"><div class="input-group"">' + tmpinput + tempclick + '</div></div>';

            var repeatel = '<md-list>  <md-list-item class="md-2-line" ng-repeat="item in messages[\'' + id + '\']"> <div class="md-list-item-text"> <h3>{{item.name}}</h3> <p>{{item.msg}} </p> </div> <md-divider inset></md-divider> </md-list-item> </md-list>';

            var element = '<div class="popup-box chat-popup" id="' + id + '">';
            element = element + '<div class="popup-head">';
            element = element + '<div class="popup-head-left">' + name + '</div>';
            element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\'' + id + '\');">&#10005;</a></div>';
            element = element + '<div style="clear: both"></div></div><div class="popup-messages">' + repeatel + '</div>' + tmpfullin + '</div>';

            var divElement = angular.element(document.querySelector('#outer'));
            var appendHtml = $compile(element)($scope);
            divElement.append(appendHtml);

            $scope.chatInit(id);




        };
        
        $rootScope.mySocket.on('message', function (data) {
            console.log(data);
            $scope.chatReceive(data.from,data.senderName,data.message);

        });
        

        $rootScope.mySocket.on('historyMessages', function (data) {
            console.log(data);
            for(var i=0; i < data.messages.length;i++)
            {
                $scope.messages[data.id.toUserId].push({name:data.messages[i].from, msg:data.messages[i].message});
                // $rootScope.all_student_messages[data.id.toUserId].push({name:data.messages[i].from, msg:data.messages[i].message});
            }
            console.log($scope.messages);
            $scope.$apply();
        });
    }]);


tutorControllers.controller('tutorChatCtrl', ['$rootScope','$scope', '$log', '$compile','authentication',
    function ($rootScope,$scope, $log, $compile,authentication) {


        console.log('chat control student');
        var vm = this;
        vm.currentUser = authentication.currentUser();

        $scope.messages = new Array();

        $scope.chatSend = function (id, name) {
            var chattext = document.getElementById("chatin" + id).value;
            document.getElementById("chatin" + id).value = '';
            console.log(" id = " + id + ", with name: " + name + " sent : \n " + chattext);
            $scope.chatInit(id);
            $scope.messages[id].push({name: name, msg: chattext});

            $rootScope.mySocket.emit('message', {
                from: vm.currentUser.email,
                to: id,
                message: chattext,
                timeStamp: Date.now(),
                senderName:vm.currentUser.name

            });
        };

        $scope.chatReceive = function (id, name, msg_text) {
            console.log("In receive id= "+id );
            register_popup(id, name);

            $scope.chatInit(id);
            // $rootScope.all_student_messages[id].push({name:data.messages[i].from, msg:data.messages[i].message});
            $scope.messages[id].push({name: name, msg: msg_text});
            //$scope.$apply();
        };

        $scope.chatInit = function(id){
            console.log('first '+(typeof $scope.messages[id] === 'undefined'));
            if ( !$scope.messages[id]) {
                $scope.messages[id] = new Array();
                console.log("New array created");

                var offset = 'ffffffffffffffffffffffff';
                $rootScope.mySocket.emit('retrieveMessages', {
                    toUserId: id,
                    fromUserId: vm.currentUser.email,
                    pageSize: 30,
                    offset: offset

                });
            }
            console.log('second '+(typeof $scope.messages[id] === 'undefined'));
        };

        $scope.addChatBox = function (id, name) {
            console.log("addcaht called...." + id);




            var tempclick = '<span class="input-group-btn"><button class="btn btn-primary" type="button" ng-click="chatSend(\'' + id + '\', \'' + name + '\')">SEND</button></span>';
            //'onclick=chatSend(\''+id+'\')';
            var tmpinput = '<input type="text" class="form-control" placeholder="Enter your text..." id= "chatin' + id + '">';

            var tmpfullin = '<div class="well well-sm"><div class="input-group"">' + tmpinput + tempclick + '</div></div>';

            var repeatel = '<md-list>  <md-list-item class="md-2-line" ng-repeat="item in messages[\'' + id + '\']"> <div class="md-list-item-text"> <h3>{{item.name}}</h3> <p>{{item.msg}} </p> </div> <md-divider inset></md-divider> </md-list-item> </md-list>';

            var element = '<div class="popup-box chat-popup" id="' + id + '">';
            element = element + '<div class="popup-head">';
            element = element + '<div class="popup-head-left">' + name + '</div>';
            element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\'' + id + '\');">&#10005;</a></div>';
            element = element + '<div style="clear: both"></div></div><div class="popup-messages">' + repeatel + '</div>' + tmpfullin + '</div>';

            var divElement = angular.element(document.querySelector('#outer'));
            var appendHtml = $compile(element)($scope);
            divElement.append(appendHtml);

            $scope.chatInit(id);




        };

        $rootScope.mySocket.on('message', function (data) {
            console.log(data);
            $scope.chatReceive(data.from,data.senderName,data.message);

        });


        $rootScope.mySocket.on('historyMessages', function (data) {
            console.log(data);
            for(var i=0; i < data.messages.length;i++)
            {
                $scope.messages[data.id.toUserId].push({name:data.messages[i].from, msg:data.messages[i].message});
                // $rootScope.all_student_messages[data.id.toUserId].push({name:data.messages[i].from, msg:data.messages[i].message});
            }
            console.log($scope.messages);
            $scope.$apply();
        });
    }]);