/*
In order to use the animatedGrid library you have to create the element SearchAnimatedGrid and call the function
createGrids.
Call it when you are ready (you have dynamically created all the elements of the grid) or when the document
is loaded (if you are using a static page) like in the example above.

document.addEventListener('DOMContentLoaded', function(){ 

    var a = new SearchAnimatedGrid();
    a.createGrids();

});

*/


function SearchAnimatedGrid(){

	this.listAnimatedGrid 			= [];

	this.createGrids = function(){

		var listElementAnimatedGrid = document.getElementsByClassName("animated-grid");
	    
		for( var i=0; i < listElementAnimatedGrid.length; i++ ){
	    	var animatedGrid = new AnimatedGrid( listElementAnimatedGrid[i] );
	    	this.listAnimatedGrid[i] = animatedGrid;
	    }

	    this.drawAll();
	    window.addEventListener("resize", this.resizeAll);

	    // controllo se è stata inserita la barra di scrolling
		var body = document.body,
    		html = document.documentElement;
    	var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
		if (documentHeight > screen.height) {
	        this.resizeAll();
	    }
	}

	this.drawAll = function(){
		for( var i=0; i < this.listAnimatedGrid.length; i++ ){
			var animatedGrid = this.listAnimatedGrid[i];
	    	animatedGrid.draw();
	    }
	}

	thisSearchGrid = this;
	this.resizeAll = function(){
		for( var i=0; i < thisSearchGrid.listAnimatedGrid.length; i++ ){
	    	var animatedGrid = thisSearchGrid.listAnimatedGrid[i];
	    	animatedGrid.resize();
	    }
	}
}

function AnimatedGrid( gridElement ){

	this.grid 			= gridElement;
	this.width 			= 0;
	this.square 		= false;
	this.perspective 	= false;
	this.num 			= 0;
	this.num_mob 		= 0;
	this.listElement 	= [];
	this.animator 		= [];

	//chiamata la prima volta e quando il numero di elementi cambia
	this.draw = function(){

		this.width   	= Math.floor(this.grid.offsetWidth-0.5);
		this.square 	= ( this.grid.getAttribute("grid-square") ) 	? this.grid.getAttribute("grid-square") 	: false;
		this.num 		= ( this.grid.getAttribute("grid-num") ) 	? this.grid.getAttribute("grid-num") 	: 5;
		this.num_mob	= ( this.grid.getAttribute("grid-num-mob") ) ? this.grid.getAttribute("grid-num-mob") : this.num;

		this.perspective = ( this.grid.getAttribute("grid-3d")=="true" ) ? true : false;
		this.listElement = this.grid.getElementsByClassName("grid-elem");

		// itero su tutti gli elementi della griglia
		for( var i=0; i<this.listElement.length; i++ ){
			this.drawElement( this.listElement[i] );
			this.listElement[i].removeEventListener("mouseenter", animate);
			this.listElement[i].addEventListener("mouseenter", animate);
		}

		// rimuovo l'animazione quando si esce dalla griglia
		this.grid.addEventListener("mouseleave", removeAnimate);

		if( this.animator == "" ){
			// se non esiste lo creo
			this.animator = document.createElement('div');
			this.animator.className = "grid-animation";

			// lo inserisco nella griglia
			this.grid.appendChild( this.animator );
		}


		// aggiungo l'handler del resize
		this.grid.addEventListener("resize", this.redraw);
	}

	this.resize = function(){
		// aggiorno la width
		this.width = Math.floor(this.grid.offsetWidth-0.5);
		// itero su tutti gli elementi della griglia
		for( var i=0; i<this.listElement.length; i++ ){
			this.drawElement( this.listElement[i] );
		}
	}

	this.drawElement = function( element ){

		var tab_num 	= (this.width > 540) ? this.num : this.num_mob;

		var dimension  	= Math.floor(this.width / tab_num) + "px";
		element.style.width = dimension;
		if( this.square )
			element.style.height = dimension;
	}

	function animate(){

		// PROBLEMA: non si ricorda chi è il padre. self.parentGrid è cambiato!
		// quindi ricalcolo il padre.... ovviamente non è corretto, va aggiustato

		// rimuovo la classe activated e la aggiungo all'elemento corrente
		var cardActivated  = document.getElementsByClassName("grid-activated");
		for(var i=0; i<cardActivated.length; i++)
			cardActivated[i].className = cardActivated[i].className.replace(" grid-activated", "");
		this.className = this.className + " grid-activated";
		

		var parentGrid = this.parentElement;
		var animator   = parentGrid.getElementsByClassName("grid-animation")[0];
		animator.addEventListener("click", clicked);

		animator.className 	= "grid-animation";
		// prende la posizione dal padre!
		// TODO: rendere generica (prendere la posizione a partire dalla griglia ovunque essa sia)
		animator.style.left 	= this.offsetLeft+"px";
		animator.style.top 		= this.offsetTop+"px";
		animator.style.height 	= this.offsetHeight+"px";
		animator.style.width 	= this.offsetWidth+"px";

		// aggiusto l'allineamento per i bordi
		var adjustPosition = "";

		var offsetRight 	= parentGrid.offsetWidth - (this.offsetWidth+this.offsetLeft);
		var offsetBottom 	= parentGrid.offsetHeight - (this.offsetHeight+this.offsetTop);

		adjustPosition += (this.offsetTop==0) 		? " top" 	: "";
		adjustPosition += (this.offsetLeft==0) 		? " left" 	: "";
		adjustPosition += (offsetBottom < 10) 		? " bottom" : "";
		adjustPosition += (offsetRight < 10) 		? " right" 	: "";

		animator.style.transformOrigin = adjustPosition;

		// carico le informazioni e l'animazione se grid-3d
		if( parentGrid.getAttribute("grid-3d")=="true" ){
			//inserisco un layer di prospettiva se voglio l'effetto 3d
			var perspective = document.createElement("div");
			perspective.className = "grid-effect-3d card-2";
			perspective.innerHTML = this.innerHTML;
			perspective.addEventListener("mousemove", cardAnimation);

			animator.innerHTML = "";
			animator.className += " grid-perspective";
			animator.appendChild(perspective);
		}
		else
			animator.innerHTML = this.innerHTML;

		//add animation
		window.setTimeout(function(){
			animator.className += " zoom-me";
		}, 2)
	}

	function removeAnimate(){

		// rimuovo la classe activated
		var cardActivated  = document.getElementsByClassName("grid-activated");
		for(var i=0; i<cardActivated.length; i++)
			cardActivated[i].className = cardActivated[i].className.replace(" grid-activated", "");

		// cerco l'animazione
		var animator   		= this.getElementsByClassName("grid-animation")[0];
		animator.className 	+= " zoom-out";

		window.setTimeout(function(){
			animator.className = "grid-animation hide"
		}, 300);
	}

	function cardAnimation(event){
		// TODO: utilizzare i prefissi!

		browserPrefix = "";
    	usrAg = navigator.userAgent;
		if(usrAg.indexOf("Chrome") > -1 || usrAg.indexOf("Safari") > -1) {
		    browserPrefix = "-webkit-";
		} else if (usrAg.indexOf("Opera") > -1) {
		    browserPrefix = "-o";
		} else if (usrAg.indexOf("Firefox") > -1) {
		    browserPrefix = "-moz-";
		} else if (usrAg.indexOf("MSIE") > -1) {
		    browserPrefix = "-ms-";
		}

		var posY = event.layerY;
		var posX = event.layerX;

		var dimX = Math.ceil(this.offsetWidth / 2.0);
		var dimY = Math.ceil(this.offsetHeight / 2.0);

		dx = posX - dimX;
        dy = posY - dimY;

        tiltx = (dy / dimY);
        tilty = - (dx / dimX);
        radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2));
        degree = (radius * 15);

        shadx = degree*tiltx/1.3;   /*horizontal shadow*/
        shady = degree*tilty/1.3;   /*vertical shadow*/

    	this.style.transform = 'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)';

    	if( dx>dimX ){
            //this.style.boxShadow = (-shady) + 'px ' + (-shadx) +'px 8px rgba(0,0,0,.2)';
    	}
        else {
        	//this.style.boxShadow = (shady) + 'px ' + (-shadx) +'px 8px rgba(0,0,0,.2)';
        }

	}

	function clicked(){
		var parentGrid 	= this.parentElement;
		var callback 	= parentGrid.getAttribute("on-click-grid");

		// http://stackoverflow.com/questions/30028331/pass-javascript-function-as-data-attribute-and-execute
		var x = eval(callback);
	    if (typeof x == 'function') {
	        x( this.innerHTML );
	    }
	}
}