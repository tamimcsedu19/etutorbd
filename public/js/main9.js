/**
 * Created by rakib on 5/14/2016.
 */

console.log("Hellllo main8");
var drawingapp = angular.module('drawingapp', ['colorpicker.module', 'ngMaterial','ngAnimate', 'ui.bootstrap']);
drawingapp.controller('drawing_controller', function($scope, $http, $log) {
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
        previous = $scope.canvases[old];
        selected = $scope.canvases[current];
        curcanvas_indx = $scope.selectedIndex;
    });

    function newCanvas(){
        console.log("add tab called");
        var newlen = canvaslist.length;
        var title = "Page "+(newlen+1);
        $scope.canvases.push({title: title, tab_index: (newlen), disabled: true});
        setTimeout(function(){
            curcanvas_indx = newlen;
            canvaslist.push(new fabric.Canvas(("myCanvas"+curcanvas_indx)));
            //console.log(curcanvas_indx+ "\n"+canvaslist[curcanvas_indx]);
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

    window.onload = function() {
        newCanvas();
    };

    $scope.addTab = function(){
        newCanvas();
    };

    $scope.removeTab = function(){
        if($scope.canvases.length>1) {
            $scope.canvases.pop();
            canvaslist.pop();
        }
    };

    $scope.openNthTab = function (n){
        $scope.selectedIndex = n;
    };


//loads canvaslist[curcanvas_indx] data from json object
    function load_from_json(json){
        canvaslist[curcanvas_indx].loadFromJSON(json.data);
        canvaslist[curcanvas_indx].renderAll();
    }

//Tamim: implement this function!
//send: parameters have JSON object or the strings "undo" "redo".
//send: should send this to server
    function send(json){

    }

//Tamim: implement this function!
    function receive(json){

    }

    function init(){
        //for(var i = 0; i<MAX; i++){
        //    curpos[i] = 1;
        //    undoavail[i] = new Array(MAX);
        //    undoavail[i][0] = (JSON.stringify(canvaslist[0]));
        //}
        //console.log("init " + canvaslist[0]+" "+undoavail[0][0]);
    }

    function onObjectModified(e){
        if(e && e.target && e.target.get('type') === 'path') {
            e.target.set('selectable', false);
            //console.log("modified ... ", e.target.get('selectable'));
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
        send(JSON.stringify(canvaslist[curcanvas_indx]));
    }

//the undo and redo operations do not send canvas data!!
//they only send commands for undo and redo
    function undo_operation(){
        var undo_indx;
        if(curpos[curcanvas_indx] > 1) {
            canvaslist[curcanvas_indx].__eventListeners["object:modified"] = [];
            canvaslist[curcanvas_indx].__eventListeners["object:removed"] = [];
            canvaslist[curcanvas_indx].__eventListeners["object:added"] = [];

            undo_indx = curpos[curcanvas_indx]-2;
            canvaslist[curcanvas_indx].loadFromJSON(undoavail[curcanvas_indx][undo_indx]);
            curpos[curcanvas_indx]--;
            canvaslist[curcanvas_indx].renderAll();
            canvaslist[curcanvas_indx].on('object:modified', onObjectModified);
            canvaslist[curcanvas_indx].on('object:removed', onObjectModified);
            canvaslist[curcanvas_indx].on('object:added', onObjectModified);
        }
        //console.log("Undo "+curcanvas_indx +" "+curpos[curcanvas_indx]+" "+ undo_indx+"\n"+undoavail[curcanvas_indx][undo_indx]);
        send("undo");
    }

    function redo_operation(){
        var undo_indx = curpos[curcanvas_indx];
        if(undo_indx < lastmodifiedpos[curcanvas_indx]) {
            canvaslist[curcanvas_indx].__eventListeners["object:modified"] = [];
            canvaslist[curcanvas_indx].__eventListeners["object:removed"] = [];
            canvaslist[curcanvas_indx].__eventListeners["object:added"] = [];

            undo_indx = curpos[curcanvas_indx];
            canvaslist[curcanvas_indx].loadFromJSON(undoavail[curcanvas_indx][undo_indx]);
            curpos[curcanvas_indx]++;
            canvaslist[curcanvas_indx].renderAll();

            canvaslist[curcanvas_indx].on('object:modified', onObjectModified);
            canvaslist[curcanvas_indx].on('object:removed', onObjectModified);
            canvaslist[curcanvas_indx].on('object:added', onObjectModified);
        }
        send("redo");
    }

    function onObjectSelected(e) {
        console.log(e.target.get('type') , e.target.get('selectable'));
    }

    $scope.key_pressed = function($event){
        console.log("keys: "+$event.keyCode+" "+$event.ctrlKey);
        if ($event.keyCode == 46) {
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
            undo_operation();
        }
        else if($event.keyCode == 89 && $event.ctrlKey == true){
            redo_operation();
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
});

var seconds = 0, minutes = 0, hours = 0;
function showTime() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    //document.getElementById("clock-large").innerHTML = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
}
setInterval(showTime, 1000);