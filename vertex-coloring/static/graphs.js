var adjacent = [];
var i,j;

var a_canvas;
var a_context;
var draw_canvas = function() {
        a_canvas = document.getElementById("a");
        a_context = a_canvas.getContext("2d");
	a_canvas.addEventListener("dblclick", draw_nodes, false);
	a_canvas.addEventListener("mousedown",mousedown,true);
	a_canvas.addEventListener("mouseup",mouseup,true);
	a_context.fillStyle = "white";
        a_context.fillRect(0,0,850,450);
	
        a_context.strokeStyle = "#f0c";
        a_context.stroke();     
}

//var list_nodes=new Array();
var list_nodes=[];
var node_no=0;
var node={};


function Cell(x,y)
{

	this.x=x;
	this.y=y;
}			

function getPosition(e)
{
	var x;
	var y;
	if(e.pageX != undefined && e.pageY!=undefined)
	{
		x=e.pageX;
		y=e.pageY;
	}
	else
	{
		x=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
		y=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
	}
	x-=a_canvas.offsetLeft;
	y-=a_canvas.offsetTop;

	var cell=new Cell(x,y);
	return cell;
}

function draw_nodes(e) {

	var cell = getPosition(e);
	x=cell.x-10;
	y=cell.y-10;
	node = new Object();
	node.name=node_no;
	node.x=x;
	node.y=y;	
	list_nodes[node_no]=[node.x,node.y];
	adjacent[node_no]=[]
	a_context.beginPath();
	a_context.arc(x,y,17,0,Math.PI*2,true);
	a_context.closePath();
	a_context.fillStyle="red";
	a_context.fill();
	a_context.strokeStyle="#000";
	a_context.lineWidth=1;
	a_context.stroke();
	a_context.font="10px sans-serif";
	if (node_no<10)
	{
		a_context.fillText("V"+node_no,x-7,y-27);
	}
	else
	{
		a_context.fillText("V"+node_no,x-10,y-23);
	}
	node_no++;

}

var x1=0,x2=0,y1=0,y2=0,n1,i,n2;

function mousedown(e)
{
    var cell = getPosition(e);
    for(i=0;i<list_nodes.length;i++) {
        if(cell.x>=list_nodes[i][0]-10 && cell.x<=list_nodes[i][0]+10 && cell.y>=list_nodes[i][1]-10 && cell.y<=list_nodes[i][1]+10)  {
            x1 = list_nodes[i][0];
    	    y1 = list_nodes[i][1];
    	    for(j=0;j<list_nodes.length;j++)  {
    		if(x1==list_nodes[j][0] && y1==list_nodes[j][1]) {
    		    n1=j;
    		}
    	    }
       	}
    }
}

function mouseup(e)
{
    var cell = getPosition(e);
    for(i=1;i<=list_nodes.length;i++) {
    	if(cell.x>=list_nodes[i][0]-10 && cell.x<=list_nodes[i][0]+10 && cell.y>=list_nodes[i][1]-10 && cell.y<=list_nodes[i][1]+10) {
    	    x2 = list_nodes[i][0];
    	    y2 = list_nodes[i][1];
    	    a_context.strokeStyle = "black";
	    a_context.moveTo(x1,y1);
    	    a_context.lineTo(x2,y2);
    	    a_context.stroke(); 
            for(j=0;j<list_nodes.length;j++) {
		if(x2==list_nodes[j][0] && y2==list_nodes[j][1]){
                    n2=j;
    		    adjacent[n1].push(n2);
    		    adjacent[n2].push(n1);
		  // alert(adjacent); 
			coloring();
    		}
    	    }   		
    	}  	
    } 
}



var color = {
				0 :"red",
				1 :"blue",
				2 :"green",
				3 :"yellow",
				4 :"orange",
				5 :"magenta",
				6 :"#00FF00",
				7 :"#33FFFF",
				8 :"black",
				9 :"pink"
		};

function coloring() {		

			var j = 0;
			var y = '[';
			while(j < list_nodes.length) {
				if(j == ((list_nodes.length))) {
					y = y + '[' + adjacent[j] + ']' ;
					break;
				}
				y = y + '[' + adjacent[j] + ' ] '+ ',';
				j = j+ 1;
			}
			y = y + ']';
			//alert(y);
			$(document).ready(function() {
			   $.post("/posted", {name : y}, function(data){ 
							 var res_colors = data;
			   for(i = 0;i <= res_colors.length;i += 1) {
					a_context.beginPath();
		 	                a_context.arc(list_nodes[i][0],list_nodes[i][1],17,0,Math.PI * 2,true);
                                        a_context.fillStyle = color[res_colors[i]]
                                        a_context.fill();
					}
			   },"json");
			});
		}
