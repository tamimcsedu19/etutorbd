/**
 * Created by mahfuj on 6/3/16.
 */



(function() {
    'use strict';

    var serverAddress = 'localhost';

    angular
        .module('Etutor')
        .controller('chatCtrl', chatCtrl);

    chatCtrl.$inject = ['$rootScope','$scope', '$timeout','$window','$location', '$log', '$compile','authentication','$mdToast','$mdDialog'];

    function chatCtrl($rootScope,$scope,$timeout,$window,$location,$log, $compile,authentication,$mdToast,$mdDialog) {


        console.log('chat control student');
        var vm = this;
        vm.currentUser = authentication.currentUser();

        $scope.messages = new Array();
        $scope.onlineList = new Array();

        if(vm.currentUser.userType === 'student') {

            $scope.updateOnlineList = function(){
                // $scope.onlineList = data;
                $scope.onlineList.push({email: 'mahfujhowlader@gmail.com', name: 'Mahfuj'});
                $scope.onlineList.push({email: 'rakib.13th@gmail.com', name: 'Rakib'});
                $scope.onlineList.push({email: 'mithilazz@gmail.com', name: 'Ishita'});
                $scope.onlineList.push({email: 'zahinzawad@gmail.com', name: 'Zahin'});
                $scope.onlineList.push({email: 'sayeed@gmail.com', name: 'Sayeed'});
            };

            $scope.updateOnlineList();


        }
        else {

            $scope.updateOnlineList = function(){
                // $scope.onlineList = data;
                $scope.onlineList.push({email: 'maruf@gmail.com', name: 'Maruf'});
                $scope.onlineList.push({email: 'towhid@gmail.com', name: 'Towhidul'});
                $scope.onlineList.push({email: 'amifa@gmail.com', name: 'Amifa Raj'});
                $scope.onlineList.push({email: 'jony@gmail.com', name: 'Jony Ahmed'});
            };

            $scope.updateOnlineList();



        }


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
        $scope.showConfirm = function(data) {
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
            $scope.register_popup(id, name);

            $scope.chatInit(id);
            if(flag) $scope.messages[id].push({name: name, msg: msg_text});
            $scope.$apply();
        };

        $scope.chatInit = function(id){
            console.log('first '+(typeof $scope.messages[id] === 'undefined'));
            if (!$scope.messages[id]) {
                $scope.messages[id] = new Array();
                console.log("New array created "+(typeof $scope.messages[id] === 'undefined'));

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

        $scope.close_popup = function (id)
        {
            for(var iii = 0; iii < popups.length; iii++)
            {
                if(id == popups[iii])
                {
                    Array.remove(popups, iii);

                    document.getElementById(id).style.display = "none";

                    calculate_popups();

                    return;
                }
            }
        };

        $scope.register_popup = function (id, name)
        {
            console.log('in register pop up '+ id);
            for(var iii = 0; iii < popups.length; iii++)
            {
                //already registered. Bring it to front.
                if(id == popups[iii])
                {
                    Array.remove(popups, iii);

                    popups.unshift(id);

                    calculate_popups();


                    return;
                }
            }

            $scope.addChatBox(id, name);

            popups.unshift(id);

            calculate_popups();

        };

        $scope.addChatBox = function (id, name) {
            console.log("addcaht called...." + id);


            var livesession = ' <button type="button" class="btn btn-primary btn-xs" style="margin-right: 5px" ng-click="showAlert(\''+id+'\')"><span class="glyphicon glyphicon-blackboard"></span> </button>';
            var closeChat = '<button type="button" class="btn btn-primary btn-xs" onclick="close_popup(\'' + id + '\')"><span class="glyphicon glyphicon-remove"></span> </button>';

            var tempclick = '<span class="input-group-btn"><button class="btn btn-primary" type="button" ng-click="chatSend(\'' + id + '\', \'' + name + '\')">SEND</button></span>';
            //'onclick=chatSend(\''+id+'\')';
            var tmpinput = '<input type="text" ng-enter="chatSend(\'' + id + '\', \'' + name + '\')" class="form-control" placeholder="Enter your text..." id= "chatin' + id + '">';

            var tmpfullin = '<div class="well well-sm"><div class="input-group"">' + tmpinput +tempclick + '</div></div>';

            var repeatel = '<md-list>  <md-list-item class="md-2-line" ng-repeat="item in messages[\'' + id + '\']"> <div class="md-list-item-text"> <h3>{{item.name}}</h3> <pre>{{item.msg}} </pre> </div> <md-divider inset></md-divider> </md-list-item> </md-list>';

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
    }

})();