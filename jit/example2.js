var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
  // init data

  //If a node in this JSON structure  
//has the "$type" or "$dim" parameters  
//defined it will override the "type" and  
//"dim" parameters globally defined in the  
//RGraph constructor.  
var json2 = [{  
    "id": "node9",  
    "name": "NOVI",  
    "data": {  
        "$dim": 16.759175934208628,  
        "xpos": 100, 
		"ypos": 0  
    },  
    "adjacencies": [ {  
        "nodeTo": "node1",  
        "data": {  
            "$type":"arrow",  
            "$color":"#002037",  
            "$dim":20,  
            "weight": 1  
        }  
    }]  
}]; 
var graph = '[{id:"190_0",name:"NOVI", adjacencies:["node0"]}]';
var json = [{  
    "id": "node0",  
    "name": "TASK1",  
    "data": {  
        "$dim": 16.759175934208628,  
		"$type": "start",
        "xpos": -250, 
		"ypos": -50  
    },  
    "adjacencies": [ {  
        "nodeTo": "node1",  
        "data": {  
            "$type":"arrow",  
            "$color":"#002037",  
            "$dim":20,  
            "weight": 1  
        }  
    }]  
}, {  
    "id": "node1",  
    "name": "TASK2",  
    "data": {  
        "$dim": 13.077119090372014,  
        "$type": "square",  
		"xpos": -150, 
		"ypos": 50 
    },  
    "adjacencies": [{  
        "nodeTo": "node3",  
        "data": {   
			"$type":"arrow",  
            "$color":"#002037",  
            "$dim":20,  
            "weight": 1
        }  
    }]  
}, {  
    "id": "node2",  
    "name": "TASK3",  
    "data": {  
        "$dim": 16.759175934208628, 
		"$type": "start",
        "xpos": -250, 
		"ypos": 150   
    },  
    "adjacencies": [{  
        "nodeTo": "node1",  
        "data": {  
            "$type":"arrow",
			"$direction": ["node2", "node1"],
            "$color":"#002037",  
            "$dim":20,  
            "weight": 1  
        }  
    }]  
}, {  
    "id": "node3",  
    "name": "TASK4",  
    "data": {  
        "$dim": 13.077119090372014,
		"$type": "square",
        "xpos": -50, 
		"ypos": 50  
    },  
    "adjacencies": [{  
        "nodeTo": "node4",  
        "data": {  
            "$type":"arrow",  
            "$dim":25,  
            "$color":"#002037",  
            "weight": 1  
        }  
    }]  
}, {  
    "id": "node4",  
    "name": "TASK5",  
    "data": {  
        "$dim": 13.077119090372014,  
        "$type":"square",  
        "xpos": 50, 
		"ypos": 50   
    },  
    "adjacencies": [{  
        "nodeTo": "node5",  
        "data": {  
            "$type":"arrow",  
            "$direction": ["node4", "node3"],  
            "$dim":25,  
            "$color":"#002037",  
            "weight": 1  
        }  
    }]
}, {  
    "id": "node5",  
    "name": "TASK6",  
    "data": {  
        "$dim": 13.077119090372014,  
        "$type": "square",  
        "xpos": 150, 
		"ypos": 50   
    }
}];  
  // end
  // init ForceDirected
  var fd = new $jit.ForceDirected({
    //id of the visualization container
    injectInto: 'infovis',
    //Enable zooming and panning
    //with scrolling and DnD
    Navigation: {
      enable: true,
      type: 'Native',
      //Enable panning events only if we're dragging the empty
      //canvas (and not a node).
      panning: 'avoid nodes',
      zooming: 10 //zoom speed. higher is more sensible
    },
    // Change node and edge styles such as
    // color and width.
    // These properties are also set per node
    // with dollar prefixed data-properties in the
    // JSON structure.
    Node: {
      overridable: true,
      dim: 7
    },
    Edge: {
      overridable: true,
      color: '#23A4FF',
      lineWidth: 0.4
    },
    // Add node events
    Events: {
      enable: true,
      type: 'Native',
      //Change cursor style when hovering a node
      onMouseEnter: function() {
        fd.canvas.getElement().style.cursor = 'move';
      },
      onMouseLeave: function() {
        fd.canvas.getElement().style.cursor = '';
      },
      //Update node positions when dragged
      onDragMove: function(node, eventInfo, e) {
        var pos = eventInfo.getPos();
        node.pos.setc(pos.x, pos.y);
        fd.plot();
      },
      //Implement the same handler for touchscreens
      onTouchMove: function(node, eventInfo, e) {
        $jit.util.event.stop(e); //stop default touchmove event
        this.onDragMove(node, eventInfo, e);
      }
    },
    //Number of iterations for the FD algorithm
    iterations: 200,
    //Edge length
    levelDistance: 130,
    // This method is only triggered
    // on label creation and only for DOM labels (not native canvas ones).
    onCreateLabel: function(domElement, node){
      // Create a 'name' and 'close' buttons and add them
      // to the main node label
      var nameContainer = document.createElement('span'),
          closeButton = document.createElement('span'),
          style = nameContainer.style;
      nameContainer.className = 'name';
      nameContainer.innerHTML = node.name;
      closeButton.className = 'close';
      closeButton.innerHTML = 'x';
      domElement.appendChild(nameContainer);
      domElement.appendChild(closeButton);
      style.fontSize = "0.8em";
      style.color = "#01121e";
      //Fade the node and its connections when
      //clicking the close button
      closeButton.onclick = function() {
        node.setData('alpha', 0, 'end');
        node.eachAdjacency(function(adj) {
          adj.setData('alpha', 0, 'end');
        });
        fd.fx.animate({
          modes: ['node-property:alpha',
                  'edge-property:alpha'],
          duration: 500
        });
      };
      //Toggle a node selection when clicking
      //its name. This is done by animating some
      //node styles like its dimension and the color
      //and lineWidth of its adjacencies.
      nameContainer.onclick = function() {
        //set final styles
        fd.graph.eachNode(function(n) {
          if(n.id != node.id) delete n.selected;
          n.setData('dim', 7, 'end');
          n.eachAdjacency(function(adj) {
            adj.setDataset('end', {
              lineWidth: 0.4,
              color: '#23a4ff'
            });
          });
        });
        if(!node.selected) {
          node.selected = true;
          node.setData('dim', 17, 'end');
          node.eachAdjacency(function(adj) {
            adj.setDataset('end', {
              lineWidth: 3,
              color: '#36acfb'
            });
          });
        } else {
          delete node.selected;
        }
        //trigger animation to final styles
        fd.fx.animate({
          modes: ['node-property:dim',
                  'edge-property:lineWidth:color'],
          duration: 500
        });
        // Build the right column relations list.
        // This is done by traversing the clicked node connections.
        var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>",
            list = [];
        node.eachAdjacency(function(adj){
          if(adj.getData('alpha')) list.push(adj.nodeTo.name);
        });
        //append connections information
        $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
      };
    },
    // Change node styles when DOM labels are placed
    // or moved.
    onPlaceLabel: function(domElement, node){
      var style = domElement.style;
      var left = parseInt(style.left);
      var top = parseInt(style.top);
      var w = domElement.offsetWidth;
      style.left = (left - w / 2) + 'px';
      style.top = (top + 10) + 'px';
      style.display = '';
    }
  });
  // load JSON data.
  fd.loadJSON(json);
  fd.graph.eachNode(function(n) {
	n.getPos().setc(n.data.xpos, n.data.ypos);
	});
	fd.plot();
	
	//Remove edges
    button = $jit.id('remove-edges');
    button.onclick = function() {
        //perform edge removing animation.
        fd.op.removeEdge([['node0', "node1"], ['node1', 'node2']], {
            type: "replot",
            fps: 100,
			hideLabels:false,
        });
    };
	
	//Add a Graph (Sum)
    button = $jit.id('sum');
    button.onclick = function(){
        //create json graph to add.
        var trueGraph = eval('(' + graph + ')');        
        //get animation type.
        
        //perform sum animation.
        fd.op.sum(trueGraph, {
            type: "fade:seq",
            fps: 100,
			duration: 500,
			transition: $jit.Trans.Quart.easeOut , 
			hideLabels:false,
            onComplete: function(){
                Log.write("sum complete!");
            }
        });
    };
  // compute positions incrementally and animate.
  /*fd.computeIncremental({
    iter: 40,
    property: 'end',
    onStep: function(perc){
      Log.write(perc + '% loaded...');
    },
    onComplete: function(){
      Log.write('done');
      fd.animate({
        modes: ['linear'],
        transition: $jit.Trans.Elastic.easeOut,
        duration: 2500
      });
    }
  });*/
  // end
}

//Custom node
$jit.ForceDirected.Plot.NodeTypes.implement({ 
  //// this node type is used for plotting resource types (web)
   'start': 
       { 'render': function(node, canvas) { 
           var ctx = canvas.getCtx(); 
		   
           var img = new Image(); 
		   img.src = 'img/start.png';
					   
           var pos = node.getPos(); 
           img.onload = function(){ 
               ctx.drawImage(img,pos.x-16, pos.y-16); 
           } 
           
       },
            'contains': 
            function(node, pos)
                    { 
                        var npos = node.pos.getc(true), 
                        dim = node.getData('dim'); 
                        return this.nodeHelper.square. contains(npos, pos, dim); 
                    } 
         } 
});