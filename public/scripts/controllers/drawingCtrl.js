/**
 * Created by mahfuj on 6/3/16.
 */


(function() {
    'use strict';

    var serverAddress = 'localhost';

    angular
        .module('Etutor')
        .controller('drawingCtrl', drawingCtrl);

    drawingCtrl.$inject = ['$rootScope','$scope', '$routeParams','$location','$timeout','$http', '$log'];

    function drawingCtrl($rootScope,$scope,$routeParams,$location,$timeout,$http,$log) {

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
            //   console.log('update received');
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

        };

        function send(json_str, canv_indx, func_obj){

            console.log('sent update');
            // console.log(json_str);
            // console.log(canv_indx);
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
            // console.log('sent update done');
        }

        function received(data){

            console.log('data received in function');
            console.log(data);
            if(data.func_obj.addtab == 1){
                $scope.addTab(0);
            }
            else if(data.func_obj.removetab == 1){
                $scope.removeTab(0);
            }
            else if(data.func_obj.nth_tab >= 0){

                $scope.openNthTab(data.func_obj.nth_tab);
                $scope.$apply();
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

        console.log("Controller Init");
        var MAX = 100; //sets maximum amount of undo ad redo operations available
        $scope.canvases = [];
        var canvaslist = [];

        var curcanvas_indx = 0;
        var curpos = new Array(MAX); //current undo-redo position of a canvas
        var lastmodifiedpos = new Array(MAX);
        var undoavail = new Array(MAX); //undo strings

        $scope.selectedIndex = 0;

        $scope.$watch('selectedIndex', function(current, old){
            // previous = $scope.canvases[old];
            // selected = $scope.canvases[current];

            curcanvas_indx = $scope.selectedIndex;
            send(0, 0, {
                addtab: 0,
                removetab: 0,
                nth_tab: curcanvas_indx,
                undo: 0,
                redo: 0,
                obj_changed: 0
            });
            console.log("tab changed to :" + curcanvas_indx);
        });

        $scope.newCanvas = function(){
            $scope.$apply();
            //var newlen = canvaslist.length;
            curcanvas_indx = canvaslist.length;
            canvaslist.push(new fabric.Canvas(("myCanvas"+curcanvas_indx)));
            console.log(curcanvas_indx+ "\n"+canvaslist[curcanvas_indx]);
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
            console.log("created");
        };

        $scope.addTab = function(send_flag){

            console.log("add tab called, send_flag = " + send_flag);
            var newlen = canvaslist.length;
            var title = "Page "+(newlen+1);
            $scope.canvases.push({title: title, tab_index: (newlen), disabled: true});
            setTimeout($scope.newCanvas, 200);
            if(send_flag) {
                send(0, 0, {
                    addtab: 1,
                    removetab: 0,
                    nth_tab: -1,
                    undo: 0,
                    redo: 0,
                    obj_changed: 0
                });
            }
        };

        $scope.addTab(0);
        // $scope.addTab(0);

        $scope.removeTab = function(send_flag){

            if($scope.canvases.length>1) {
                $scope.canvases.pop();
                canvaslist.pop();
                if(send_flag) {
                    send(0, 0, {
                        addtab: 0,
                        removetab: 1,
                        nth_tab: -1,
                        undo: 0,
                        redo: 0,
                        obj_changed: 0
                    });
                }
            }
        };

        $scope.openNthTab = function (n){
            if(n != $scope.selectedIndex) $scope.selectedIndex = n;
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
                        addtab: 0,
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

        $(function() {
            $( "#draggable" ).draggable();
            $( "#draggable" ).hide();
        });


        $scope.videoToggle = function () {
            $("#draggable").toggle();
        };

        var seconds = 0, minutes = 0, hours = 0;
        function showTime() {
            if (document.getElementById("clock-large")) {
                seconds++;
                if (seconds >= 60) {
                    seconds = 0;
                    minutes++;
                    if (minutes >= 60) {
                        minutes = 0;
                        hours++;
                    }
                }
                document.getElementById("clock-large").innerHTML = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
            }
            else {
                seconds = 0; minutes = 0; hours = 0;
            }
        }
        setInterval(showTime, 1000);
    }

})();