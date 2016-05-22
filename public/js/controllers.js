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
            console.log(response.data);
            console.log(response.data.university);
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



tutorControllers.controller('videoCtrl', [ '$rootScope','$scope',
    function ($rootScope,$scope) {
        $rootScope.mySocket.on('tamim', function (data) {


        });

    }]);



tutorControllers.controller('chatCtrl', ['$rootScope','$scope', '$timeout','$window','$location', '$log', '$compile','authentication','$mdToast','$mdDialog',
    function ($rootScope,$scope,$timeout,$window,$location,$log, $compile,authentication,$mdToast,$mdDialog) {


        console.log('chat control student');
        var vm = this;
        vm.currentUser = authentication.currentUser();
        
        $scope.messages = new Array();


        $scope.showAlert = function(id) {
            $mdDialog.show(
                $mdDialog.alert()
                    //.parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Live Session')
                    .textContent('Your request has been sent!')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .openFrom('#left')
                    // or an element
                    .closeTo(angular.element(document.querySelector('#right')))
                    // .targetEvent(ev)
            );
        
            $rootScope.mySocket.emit('liveSessionOffer', {
                from: vm.currentUser.email,
                to: id
            });
            console.log("Show Alert done");
        };


        // $scope.showSimpleToast = function(id) {
        //     $mdToast.show(
        //         $mdToast.simple()
        //             .textContent('Your request has been sent!')
        //             .parent(angular.element(document.querySelector('#left')))
        //             .hideDelay(5000)
        //     );
        //
        //     $rootScope.mySocket.emit('liveSessionOffer', {
        //         from: vm.currentUser.email,
        //         to: id
        //     });
        // };


        $scope.showConfirm = function(data) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title(' start live session?')
                .ariaLabel('Lucky day')
                .ok('Reject')
                .cancel('Accept');
            $mdDialog.show(confirm).then(function() {
                console.log('Rejected request\n'+data);
                $rootScope.mySocket.emit('liveSessionReply', {
                    from: data.from,
                    to: data.to,
                    reply:0

                });
                
            }, function() {
                console.log('Accepted request\n'+data);
                $rootScope.mySocket.emit('liveSessionReply', {
                    from: data.from,
                    to: data.to,
                    reply:1

                });

            });
        };

        $rootScope.mySocket.on('liveSessionOffer', function (data) {

            $scope.showConfirm(data);
        });

        $rootScope.mySocket.on('initLiveLesson', function (data) {
            $timeout(function(){
                console.log('BEFOREEEE received in tutor from server');
                console.log(data);
                //var url = '../canvas/'+data.liveLessonId;
                //$window.location.href =  url;
                $location.url('/canvas/'+data.liveLessonId);
                console.log('AFTER  reply received in tutor from server');
                console.log(data);
            },2000);

        });


        $scope.chatSend = function (id, name) {
            var chattext = document.getElementById("chatin" + id).value;
            document.getElementById("chatin" + id).value = '';
            console.log(" id = " + id + ", with name: " + name + " sent : \n " + chattext);
            //$scope.chatInit(id);
            $scope.messages[id].push({name: $rootScope.sessionUser.name, msg: chattext});

            $rootScope.mySocket.emit('message', {
                from: vm.currentUser.email,
                to: id,
                message: chattext,
                timeStamp: Date.now(),
                senderName:vm.currentUser.name

            });
        };

        $scope.chatReceive = function (id, name, msg_text, flag) {
            console.log("In receive id= "+id );
            register_popup(id, name);

            $scope.chatInit(id);
            // $rootScope.all_student_messages[id].push({name:data.messages[i].from, msg:data.messages[i].message});
            if(flag) $scope.messages[id].push({name: name, msg: msg_text});
            $scope.$apply();
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
                //$scope.$apply();
            }
            console.log('second '+(typeof $scope.messages[id] === 'undefined'));
        };

        $scope.addChatBox = function (id, name) {
            console.log("addcaht called...." + id);


            var livesession = ' <button type="button" class="btn btn-primary btn-xs" style="margin-right: 5px" ng-click="showAlert(\''+id+'\')"><span class="glyphicon glyphicon-blackboard"></span> </button>';
            var closeChat = '<button type="button" class="btn btn-primary btn-xs" onclick="close_popup(\'' + id + '\')"><span class="glyphicon glyphicon-remove"></span> </button>';

            var tempclick = '<span class="input-group-btn"><button class="btn btn-primary" type="button" ng-click="chatSend(\'' + id + '\', \'' + name + '\')">SEND</button></span>';
            //'onclick=chatSend(\''+id+'\')';
            var tmpinput = '<input type="text" ng-enter="chatSend(\'' + id + '\', \'' + name + '\')" class="form-control" placeholder="Enter your text..." id= "chatin' + id + '">';

            var tmpfullin = '<div class="well well-sm"><div class="input-group"">' + tmpinput  + '</div></div>';

            var repeatel = '<md-list>  <md-list-item class="md-2-line" ng-repeat="item in messages[\'' + id + '\']"> <div class="md-list-item-text"> <h3>{{item.name}}</h3> <p>{{item.msg}} </p> </div> <md-divider inset></md-divider> </md-list-item> </md-list>';

            var element = '<div class="popup-box chat-popup" id="' + id + '">';
            element = element + '<div class="popup-head">';
            element = element + '<div class="popup-head-left">' + name + '</div>';
            element = element + '<div class="popup-head-right">'+livesession+closeChat+'</div>';
            element = element + '<div style="clear: both"></div></div><div class="popup-messages">' + repeatel + '</div>' + tmpfullin + '</div>';




            var divElement = angular.element(document.querySelector('#outer'));
            var appendHtml = $compile(element)($scope);
            divElement.append(appendHtml);

            $scope.chatInit(id);




        };
        
        $rootScope.mySocket.on('message', function (data) {
            console.log("on msg for student\n"+data);
            var flag=1;
            if (!$scope.messages[data.from]) flag = 0;
            $scope.chatReceive(data.from,data.senderName,data.message,flag);

        });
        

        $rootScope.mySocket.on('historyMessages', function (data) {
            console.log(data);
            for(var i=0; i < data.messages.length;i++)
            {
                $scope.messages[data.id.toUserId].push({name:data.messages[i].senderName, msg:data.messages[i].message});
                // $rootScope.all_student_messages[data.id.toUserId].push({name:data.messages[i].from, msg:data.messages[i].message});
            }
            console.log($scope.messages);
            $scope.$apply();
        });
    }]);


tutorControllers.controller('tutorChatCtrl', ['$rootScope','$scope', '$timeout','$location','$log', '$compile','authentication', '$mdDialog',
    function ($rootScope,$scope,$timeout,$location, $log, $compile,authentication,$mdDialog) {


        console.log('chat control student');
        var vm = this;
        vm.currentUser = authentication.currentUser();

        $scope.messages = new Array();

        $scope.showAlert = function(id) {
            $mdDialog.show(
                $mdDialog.alert()
                //.parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Live Session')
                    .textContent('Your request has been sent!')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    // .openFrom('#left')
                    // or an element
                    // .closeTo(angular.element(document.querySelector('#right')))
                // .targetEvent(ev)
            );

            $rootScope.mySocket.emit('liveSessionOffer', {
                from: vm.currentUser.email,
                to: id
            });

        };


        $scope.showConfirm = function(data) {
            // Appending dialog to document.body to cover sidenav in docs app
            console.log('show confirm\n'+data);
            var confirm = $mdDialog.confirm()
                .title(' start live session?')
                .ariaLabel('Lucky day')
                .ok('Reject')
                .cancel('Accept');
            $mdDialog.show(confirm).then(function() {
                console.log('Rejected request\n'+data);
                $rootScope.mySocket.emit('liveSessionReply', {
                    from: data.from,
                    to: data.to,
                    reply:0

                });

            }, function() {
                console.log('Accepted request\n'+data);
                $rootScope.mySocket.emit('liveSessionReply', {
                    from: data.from,
                    to: data.to,
                    reply:1

                });


            });
        };

        $rootScope.mySocket.on('liveSessionOffer', function (data) {
            console.log(data);
            $scope.showConfirm(data);
        });

        $rootScope.mySocket.on('initLiveLesson', function (data) {
            $timeout(function(){
                console.log('BEFOREEEE received in tutor from server');
                console.log(data);
                $location.url('/canvas/'+data.liveLessonId);
                console.log('AFTER  reply received in tutor from server');
                console.log(data);
            },2000);

        });



        $scope.chatSend = function (id, name) {
            var chattext = document.getElementById("chatin" + id).value;
            document.getElementById("chatin" + id).value = '';
            console.log(" id = " + id + ", with name: " + name + " sent : \n " + chattext);
            //$scope.chatInit(id);
            $scope.messages[id].push({name: $rootScope.sessionUser.name, msg: chattext});

            $rootScope.mySocket.emit('message', {
                from: vm.currentUser.email,
                to: id,
                message: chattext,
                timeStamp: Date.now(),
                senderName:vm.currentUser.name

            });
        };

        $scope.chatReceive = function (id, name, msg_text,flag) {
            console.log("In receive id= "+id );
            register_popup(id, name);

            // $scope.chatInit(id);
            // $rootScope.all_student_messages[id].push({name:data.messages[i].from, msg:data.messages[i].message});
            if(flag) $scope.messages[id].push({name: name, msg: msg_text});
            $scope.$apply();
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
               // $scope.$apply();
            }
            console.log('second '+(typeof $scope.messages[id] === 'undefined'));
        };

        $scope.addChatBox = function (id, name) {
            console.log("addcaht called...." + id);


            var livesession = ' <button type="button" class="btn btn-primary btn-xs" style="margin-right: 5px" ng-click="showAlert(\''+id+'\')"><span class="glyphicon glyphicon-blackboard"></span> </button>';
            var closeChat = '<button type="button" class="btn btn-primary btn-xs" onclick="close_popup(\'' + id + '\')"><span class="glyphicon glyphicon-remove"></span> </button>';

            var tempclick = '<span class="input-group-btn"><button class="btn btn-primary" type="button" ng-click="chatSend(\'' + id + '\', \'' + name + '\')">SEND</button></span>';
            //'onclick=chatSend(\''+id+'\')';
            var tmpinput = '<input type="text" ng-enter="chatSend(\'' + id + '\', \'' + name + '\')" class="form-control" placeholder="Enter your text..." id= "chatin' + id + '">';

            var tmpfullin = '<div class="well well-sm"><div class="input-group"">' + tmpinput + '</div></div>';

            var repeatel = '<md-list>  <md-list-item class="md-2-line" ng-repeat="item in messages[\'' + id + '\']"> <div class="md-list-item-text"> <h3>{{item.name}}</h3> <p>{{item.msg}} </p> </div> <md-divider inset></md-divider> </md-list-item> </md-list>';

            var element = '<div class="popup-box chat-popup" id="' + id + '">';
            element = element + '<div class="popup-head">';
            element = element + '<div class="popup-head-left">' + name + '</div>';
            element = element + '<div class="popup-head-right">'+livesession+closeChat+'</div>';
            element = element + '<div style="clear: both"></div></div><div class="popup-messages">' + repeatel + '</div>' + tmpfullin + '</div>';



            var divElement = angular.element(document.querySelector('#outer'));
            var appendHtml = $compile(element)($scope);
            divElement.append(appendHtml);

            $scope.chatInit(id);




        };

        $rootScope.mySocket.on('message', function (data) {
            console.log("on msg for tutor\n"+data);
            var flag=1;
            if (!$scope.messages[data.from]) flag = 0;
            $scope.chatReceive(data.from,data.senderName,data.message, flag);

        });


        $rootScope.mySocket.on('historyMessages', function (data) {
            console.log(data);
            for(var i=0; i < data.messages.length;i++)
            {
                $scope.messages[data.id.toUserId].push({name:data.messages[i].senderName, msg:data.messages[i].message});
                // $rootScope.all_student_messages[data.id.toUserId].push({name:data.messages[i].from, msg:data.messages[i].message});
            }
            console.log($scope.messages);
            $scope.$apply();
        });
    }]);






tutorControllers.controller('drawing_controller', [ '$rootScope','$scope', '$routeParams','$location','$timeout','$http', '$log',
    function ($rootScope,$scope,$routeParams,$location,$timeout,$http,$log) {
        var vm = this;

        var user1;
        var user2;
        vm.liveLessionId = $routeParams.liveLessionId;


        $rootScope.mySocket.emit('getById', {
            liveLessonId : vm.liveLessionId

        });


        $rootScope.mySocket.on('liveLessonData', function (data) {
            // console.log(data);
            if(data.from === $rootScope.sessionUser.email) {
                user1 = data.from;
                user2 = data.to;
            }
            else {
                user1 = data.to;
                user2 = data.from;
            }
            //console.log(user1);
            //console.log(user2);

        });

        $rootScope.mySocket.on('update', function (data) {
           //data.pages will carry the changes of canvas of other user . so you have to use it
             console.log('update received');
            // console.log(data);
            received(data.pages);
        });
        //
        // $rootScope.mySocket.emit('update', {
        //             from : user1,
        //            to    : user2,
        //     liveLessonId : vm.liveLessionId,
        //            pages : //you have to put your canvas update object here
        //
        // });


        // $rootScope.mySocket.emit('endLiveLesson', {
        //     liveLessonId : vm.liveLessionId,
        //     from : user1,
        //       to : user2
        //
        // });


        $rootScope.mySocket.on('endLiveLesson', function (data) {
            $timeout(function(){
                console.log('end live lesson received');
                $location.url('/');
            },2000);

        });

        $scope.endLesson = function(){

            $rootScope.mySocket.emit('endLiveLesson', {
                liveLessonId : vm.liveLessionId,
                from : user1,
                to : user2

            });
            console.log('End live lesson sent');

        }
        console.log("Controller Init");
        var MAX = 100; //sets maximum amount of undo ad redo operations available
        $scope.canvases = [];
        var canvaslist = [];

        var curcanvas_indx = 0;
        var curpos = new Array(MAX); //current undo-redo position of a canvas
        var lastmodifiedpos = new Array(MAX);
        var undoavail = new Array(MAX); //undo strings

        var objModifiedSendFlag = 1;



        $scope.selectedIndex = 0;

        function newCanvas(){
            console.log("add tab called");
            var newlen = canvaslist.length;
            var title = "Page "+(newlen+1);
            $scope.canvases.push({title: title, tab_index: (newlen), disabled: true});
            setTimeout(function(){
                curcanvas_indx = newlen;
                canvaslist.push(new fabric.Canvas(("myCanvas"+curcanvas_indx)));
                console.log("in new canvas : " + curcanvas_indx+ "\n"+canvaslist[curcanvas_indx]);
                var viewportWidth = 2000;
                var viewportHeight = 1800;
                canvaslist[curcanvas_indx].setWidth(viewportWidth);
                canvaslist[curcanvas_indx].setHeight(viewportHeight);
                canvaslist[curcanvas_indx].isDrawingMode = true;
                canvaslist[curcanvas_indx].on('object:selected', onObjectSelected);
                canvaslist[curcanvas_indx].on('object:modified', onObjectModified);
                canvaslist[curcanvas_indx].on('object:removed', onObjectModified);
                canvaslist[curcanvas_indx].on('object:added', onObjectModified);

                curpos[curcanvas_indx] = 1;
                lastmodifiedpos[curcanvas_indx] = 1;
                undoavail[curcanvas_indx] = new Array(MAX);
                undoavail[curcanvas_indx][0] = (JSON.stringify(canvaslist[curcanvas_indx]));
                //console.log("created")
            }, 100);
        }


        newCanvas();

        function send(json_str, canv_indx, func_obj){

            console.log('sent update');
            console.log(json_str);
            console.log(canv_indx);
            console.log(func_obj);
            $rootScope.mySocket.emit('update', {
                from : user1,
                to    : user2,
                liveLessonId : vm.liveLessionId,
                pages : {
                    json_str : json_str,
                    canv_indx : canv_indx,
                    func_obj : func_obj
                }

            });
            console.log('data sent to server');
        }

        function received(data){

            console.log('data received in function');
            console.log(data);
            if(data.func_obj.addtab == 1){
                $scope.addTab();
            }
            else if(data.func_obj.removetab == 1){
                $scope.removeTab();
            }
            else if(data.func_obj.nth_tab >= 0){
                $scope.openNthTab(data.func_obj.nth_tab);
            }
            else if(data.func_obj.undo == 1){
                undo_operation(0);
            }
            else if(data.func_obj.redo == 1){
                redo_operation(0);
            }
            else if(data.func_obj.obj_changed == 1){
                var canv_indx = data.canv_indx;

                disableCanvasListeners(canv_indx);

                canvaslist[canv_indx].loadFromJSON(data.json_str);

                if(curpos[canv_indx] == MAX){
                    undoavail[canv_indx].shift();
                    undoavail[canv_indx].push(JSON.stringify(canvaslist[canv_indx]));
                }
                else {
                    undoavail[canv_indx][curpos[canv_indx]] = (JSON.stringify(canvaslist[canv_indx]));
                    // console.log(JSON.stringify(canvaslist[curcanvas_indx]).length);
                    curpos[canv_indx]++;
                }
                lastmodifiedpos[canv_indx] = curpos[canv_indx];

                removePathSelected(canv_indx);

                canvaslist[canv_indx].renderAll();

                enableCanvasListeners(canv_indx);
            }
        }

        $scope.$watch('selectedIndex', function(current, old){
            curcanvas_indx = $scope.selectedIndex;
            send(0, 0, {
                addtab: 0,
                removetab: 0,
                nth_tab: curcanvas_indx,
                undo: 0,
                redo: 0,
                obj_changed: 0
            });

        });

        $scope.addTab = function(){
            newCanvas();
            send(0, 0, {
                addtab: 1,
                removetab: 0,
                nth_tab: -1,
                undo: 0,
                redo: 0,
                obj_changed: 0
            });
        };

        $scope.removeTab = function(){

            if($scope.canvases.length>1) {
                $scope.canvases.pop();
                canvaslist.pop();
            }
            send(0, 0, 0, {
                addtab: 0,
                removetab: 1,
                nth_tab: -1,
                undo: 0,
                redo: 0,
                obj_changed: 0
            });
        };

        $scope.openNthTab = function (n){
            $scope.selectedIndex = n;
        };

        function removePathSelected(canv_indx){
            var elements = [];
            elements = canvaslist[canv_indx].getObjects('path');

            for(var i = 0; i<elements.length; i++){
                // console.log(elements[i]);
                // console.log(elements[i].type);
                if(elements[i].type === 'path'){
                    elements[i].selectable = false;
                }
            }

        }


        function onObjectModified(e){
            if(e && e.target && e.target.get('type') === 'path') {
                // e.target.set('selectable', false);
                e.target.selectable = false;
                console.log("modified ... ", e.target.selectable);
            }
            if(curpos[curcanvas_indx] == MAX){
                undoavail[curcanvas_indx].shift();
                undoavail[curcanvas_indx].push(JSON.stringify(canvaslist[curcanvas_indx]));
            }
            else {
                undoavail[curcanvas_indx][curpos[curcanvas_indx]] = (JSON.stringify(canvaslist[curcanvas_indx]));
                // console.log(JSON.stringify(canvaslist[curcanvas_indx]).length);
                curpos[curcanvas_indx]++;
            }
            lastmodifiedpos[curcanvas_indx] = curpos[curcanvas_indx];

            send(JSON.stringify(canvaslist[curcanvas_indx]), curcanvas_indx, {
                addtab: 0,
                removetab: 0,
                nth_tab: -1,
                undo: 0,
                redo: 0,
                obj_changed: 1
            });
        }

        function disableCanvasListeners(canv_indx) {
            canvaslist[canv_indx].__eventListeners["object:modified"] = [];
            canvaslist[canv_indx].__eventListeners["object:removed"] = [];
            canvaslist[canv_indx].__eventListeners["object:added"] = [];
        }

        function enableCanvasListeners(canv_indx) {
            canvaslist[canv_indx].on('object:modified', onObjectModified);
            canvaslist[canv_indx].on('object:removed', onObjectModified);
            canvaslist[canv_indx].on('object:added', onObjectModified);
        }

        function undo_operation(send_flag){
            var undo_indx;
            if(curpos[curcanvas_indx] > 1) {
                disableCanvasListeners(curcanvas_indx);

                undo_indx = curpos[curcanvas_indx]-2;
                canvaslist[curcanvas_indx].loadFromJSON(undoavail[curcanvas_indx][undo_indx]);
                curpos[curcanvas_indx]--;

                removePathSelected(curcanvas_indx);

                canvaslist[curcanvas_indx].renderAll();

                enableCanvasListeners(curcanvas_indx);

                if(send_flag === 1) {
                    console.log('inside undo operation ');
                    send(0, 0, {
                        addtab: 0,
                        removetab: 0,
                        nth_tab: -1,
                        undo: 1,
                        redo: 0,
                        obj_changed: 0
                    });
                }

            }
            //console.log("Undo "+curcanvas_indx +" "+curpos[curcanvas_indx]+" "+ undo_indx+"\n"+undoavail[curcanvas_indx][undo_indx]);
        }

        function redo_operation(send_flag){
            var undo_indx = curpos[curcanvas_indx];
            if(undo_indx < lastmodifiedpos[curcanvas_indx]) {
                disableCanvasListeners(curcanvas_indx);
                undo_indx = curpos[curcanvas_indx];
                canvaslist[curcanvas_indx].loadFromJSON(undoavail[curcanvas_indx][undo_indx]);
                curpos[curcanvas_indx]++;

                removePathSelected(curcanvas_indx);
                canvaslist[curcanvas_indx].renderAll();

                enableCanvasListeners(curcanvas_indx);

                if(send_flag == 1) {
                    send(0, 0, {
                        addtab: 1,
                        removetab: 0,
                        nth_tab: -1,
                        undo: 0,
                        redo: 1,
                        obj_changed: 0
                    });
                }
            }
        }

        function onObjectSelected(e) {
            console.log("1 : "+e.target.get('type') , e.target.get('selectable'));
            if(e && e.target && e.target.get('type') === 'path') {
                // e.target.set('selectable', false);
                e.target.selectable = false;
                //console.log("modified ... ", e.target.get('selectable'));
            }
            console.log("2: "+e.target.get('type') , e.target.get('selectable'));
        }

        $scope.key_pressed = function($event){
            console.log("keys: "+$event.keyCode+" "+$event.ctrlKey);
            if ($event.keyCode == 46) {
                //delete Key pressed
                var activeObject = canvaslist[curcanvas_indx].getActiveObject(),
                    activeGroup = canvaslist[curcanvas_indx].getActiveGroup();
                if (activeGroup) {
                    var objectsInGroup = activeGroup.getObjects();
                    canvaslist[curcanvas_indx].discardActiveGroup();
                    objectsInGroup.forEach(function (object) {
                        canvaslist[curcanvas_indx].remove(object);
                    });
                }
                else if (activeObject) {
                    canvaslist[curcanvas_indx].remove(activeObject);
                }
            }
            else if($event.keyCode == 90 && $event.ctrlKey == true){
                //CTRL-Z
                undo_operation(1);
            }
            else if($event.keyCode == 89 && $event.ctrlKey == true){
                //CTRL-Y
                redo_operation(1);
            }
        };

        $scope.pencil_button = function(){
            canvaslist[curcanvas_indx].isDrawingMode = true;
            if (!canvaslist[curcanvas_indx].freeDrawingBrush || canvaslist[curcanvas_indx].freeDrawingBrush.color === '#FFFFFF') {
                canvaslist[curcanvas_indx].freeDrawingBrush.color = '#000000';
                canvaslist[curcanvas_indx].freeDrawingBrush.width = 2;
            }
        };

        $scope.eraser_button = function(){
            //console.log("eraser");
            canvaslist[curcanvas_indx].isDrawingMode = true;
            canvaslist[curcanvas_indx].freeDrawingBrush.color = '#FFFFFF';
            canvaslist[curcanvas_indx].freeDrawingBrush.width = 6;

        };

        $scope.circle_button = function(){
            canvaslist[curcanvas_indx].selection = true;
            canvaslist[curcanvas_indx].isDrawingMode = false;
            var circle = new fabric.Circle();
            circle.set({radius: 50, fill: 'white', left: 100, top: 100, stroke: 'red'});
            circle.set({
                cornerColor: 'green',
                cornerSize: 7
            });
            canvaslist[curcanvas_indx].add(circle);
            //console.log("Circle created");
        };

        $scope.rect_button = function(){
            canvaslist[curcanvas_indx].isDrawingMode = false;
            var rect = new fabric.Rect();
            rect.set({height: 100, width: 100, fill: 'white', left: 100, top: 100, stroke: 'red'});
            rect.set({
                cornerColor: 'green',
                cornerSize: 7
            });
            canvaslist[curcanvas_indx].add(rect);
        };

        $scope.tri_button = function () {
            canvaslist[curcanvas_indx].isDrawingMode = false;
            var tri = new fabric.Triangle();
            tri.set({height: 100, width: 100, fill: 'white', left: 700, top: 300, stroke: 'red'});
            tri.set({
                cornerColor: 'green',
                cornerSize: 7
            });
            canvaslist[curcanvas_indx].add(tri);
        };

        $scope.line_button = function () {
            canvaslist[curcanvas_indx].isDrawingMode = false;
            var line = new fabric.Line();
            line.set({height: 100, width: 100, fill: 'white', left: 100, top: 100, stroke: 'red', strokeWidth: 2});
            //line.selectable = false;
            line.set({
                cornerColor: 'green',
                cornerSize: 7
            });
            line.setControlVisible("bl", false);
            line.setControlVisible('mb', false);
            line.setControlVisible('bl', false);
            line.setControlVisible('tr', false);
            line.setControlVisible('mt', false);
            line.setControlVisible('ml', false);
            line.setControlVisible('mr', false);
            line.hasBorders = false;
            canvaslist[curcanvas_indx].add(line);
        };

        $scope.bring_fwd = function(){
            var activeObject = canvaslist[curcanvas_indx].getActiveObject(),
                activeGroup = canvaslist[curcanvas_indx].getActiveGroup();
            if (activeGroup) {
                var objectsInGroup = activeGroup.getObjects();
                objectsInGroup.forEach(function (object) {
                    object.bringForward();
                });
                canvaslist[curcanvas_indx].renderAll();
                onObjectModified();
            }
            else if (activeObject) {
                activeObject.bringForward();
                canvaslist[curcanvas_indx].renderAll();
                onObjectModified();
            }
        };

        $scope.send_back = function(){
            var activeObject = canvaslist[curcanvas_indx].getActiveObject(),
                activeGroup = canvaslist[curcanvas_indx].getActiveGroup();
            if (activeGroup) {
                var objectsInGroup = activeGroup.getObjects();
                objectsInGroup.forEach(function (object) {
                    object.sendBackwards();
                });
                canvaslist[curcanvas_indx].renderAll();
                onObjectModified();
            }
            else if (activeObject) {
                activeObject.sendBackwards();
                canvaslist[curcanvas_indx].renderAll();
                onObjectModified();
            }
        };
        $scope.drawing_mode = function () {
            canvaslist[curcanvas_indx].isDrawingMode = false;
        };

        $scope.changeFillColor = function () {
            //console.log("chageFill color");
            var chosenColor = this.hexPicker.color;
            if (canvaslist[curcanvas_indx].isDrawingMode == true) {
                canvaslist[curcanvas_indx].freeDrawingBrush.color = chosenColor;
            }
            else {
                var activeObject = canvaslist[curcanvas_indx].getActiveObject(),
                    activeGroup = canvaslist[curcanvas_indx].getActiveGroup();
                if (activeGroup) {
                    var objectsInGroup = activeGroup.getObjects();
                    objectsInGroup.forEach(function (object) {
                        object.setFill(chosenColor);
                    });
                }
                else if (activeObject) {
                    activeObject.setFill(chosenColor);
                }
                canvaslist[curcanvas_indx].renderAll();
                onObjectModified();
            }
        };

        $scope.changeBorderColor = function () {
            var chosenColor = this.hexPicker.color;
            if (canvaslist[curcanvas_indx].isDrawingMode == true) {
                canvaslist[curcanvas_indx].freeDrawingBrush.color = chosenColor;
            }
            else {
                var activeObject = canvaslist[curcanvas_indx].getActiveObject(),
                    activeGroup = canvaslist[curcanvas_indx].getActiveGroup();
                if (activeGroup) {
                    var objectsInGroup = activeGroup.getObjects();
                    objectsInGroup.forEach(function (object) {
                        object.setStroke(chosenColor);
                    });
                }
                else if (activeObject) {
                    activeObject.setStroke(chosenColor);
                }
                canvaslist[curcanvas_indx].renderAll();
                onObjectModified();
            }
        };

        $scope.changeBorderWidth = function () {
            var chosenWidth = this.line_width;
            if (canvaslist[curcanvas_indx].isDrawingMode == true) {
                canvaslist[curcanvas_indx].freeDrawingBrush.width = chosenWidth;
            }
            else {
                var activeObject = canvaslist[curcanvas_indx].getActiveObject(),
                    activeGroup = canvaslist[curcanvas_indx].getActiveGroup();
                if (activeGroup) {
                    var objectsInGroup = activeGroup.getObjects();
                    objectsInGroup.forEach(function (object) {
                        object.strokeWidth = chosenWidth;
                    });
                }
                else if (activeObject) {
                    activeObject.strokeWidth = chosenWidth;
                }
                canvaslist[curcanvas_indx].renderAll();
                onObjectModified();
            }
        };

        $scope.clear_canvas = function () {
            canvaslist[curcanvas_indx].clear();
            onObjectModified();
        };


    }]);