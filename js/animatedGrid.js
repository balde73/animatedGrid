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

		var parentGrid = this.parentElement;
		var animator   = parentGrid.getElementsByClassName("grid-animation")[0];

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

		// carico le informazioni
		animator.innerHTML = this.innerHTML;

		//add animation
		window.setTimeout(function(){
			animator.className += " zoom-me";
		}, 2)
	}

	function removeAnimate(){
		// cerco l'animazione
		var animator   		= this.getElementsByClassName("grid-animation")[0];
		animator.className 	+= " zoom-out";

		window.setTimeout(function(){
			animator.className = "grid-animation hide"
		}, 300);
	}
}