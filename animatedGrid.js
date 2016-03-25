document.addEventListener('DOMContentLoaded', function(){ 

    var a = new SearchAnimatedGrid();
    a.searchAll();

});

function SearchAnimatedGrid(){

	this.listAnimatedGrid = [];

	function drawGrid( grid ){
		var square 	= ( grid.getAttribute("grid-square") ) ? grid.getAttribute("grid-square") : false;
		var num 	= ( grid.getAttribute("grid-num") ) ? grid.getAttribute("grid-num") : "5";
		
		var listElement = grid.getElementsByClassName("grid-elem");

		// itero su tutti gli elementi della griglia
		for( var i=0; i<this.listElement.length; i++ ){
			drawGridElement( listElement[i], num, square );
		}
	}

	function drawGridElement( element, num, square ){

	}

	this.searchAll = function(){

		this.listAnimatedGrid = document.getElementsByClassName("animated-grid");
	    for( var i=0; i<this.listAnimatedGrid.length; i++ ){
	    	var animatedGrid = new AnimatedGrid();
	    	animatedGrid.draw(this.listAnimatedGrid[i]);
	    }

	}
}

function AnimatedGrid(){

	this.parentGrid 	= [];
	this.width 			= 0;
	this.square 		= false;
	this.num 			= 0;
	this.listElement 	= [];
	this.animator 		= [];

	//chiamata 1volta e quando il numero di elementi cambia
	this.draw = function( grid ){

		this.parentGrid = grid;

		this.width   	= grid.offsetWidth;
		this.square 	= ( grid.getAttribute("grid-square") ) ? grid.getAttribute("grid-square") : false;
		this.num 		= ( grid.getAttribute("grid-num") ) ? grid.getAttribute("grid-num") : 5;
		
		var listElement = grid.getElementsByClassName("grid-elem");

		// itero su tutti gli elementi della griglia
		for( var i=0; i<listElement.length; i++ ){
			this.drawElement( listElement[i] );
			listElement[i].addEventListener("mouseenter", this.animate);
			listElement[i].addEventListener("mouseleave", removeAnimate);
		}

		if( this.animator == "" ){
			// se non esiste lo creo
			this.animator = document.createElement('div');
			this.animator.className = "grid-animation";

			// lo inserisco nella griglia
			grid.appendChild( this.animator );
		}
	}

	this.drawElement = function( element ){
		element.style.width  = this.width / this.num + "px";
		if( this.square )
			element.style.height = this.width / this.num + "px";
	}

	self = this;
	this.animate = function(){

		// PROBLEMA: non si ricorda chi è il padre. self.parentGrid è cambiato!
		// quindi ricalcolo il padre.... ovviamente non è corretto, va aggiustato

		var parentGrid = this.parentElement;
		var animator   = parentGrid.getElementsByClassName("grid-animation")[0];

		console.log(animator);

		animator.className 	= "grid-animation";
		// prende la posizione dal padre!
		// TODO: rendere generica (prendere la posizione a partire dalla griglia ovunque essa sia)
		animator.style.left 	= this.offsetLeft+"px";
		animator.style.top 		= this.offsetTop+"px";
		animator.style.height 	= this.offsetHeight+"px";
		animator.style.width 	= this.offsetWidth+"px";

		// aggiusto l'allineamento per i bordi
		var adjustPosition = "";

		console.log(parentGrid);

		var offsetRight 	= parentGrid.offsetWidth - (this.offsetWidth+this.offsetLeft);
		var offsetBottom 	= parentGrid.offsetHeight - (this.offsetHeight+this.offsetTop);

		console.log(offsetBottom);

		adjustPosition += (this.offsetTop==0) 		? " top" 	: "";
		adjustPosition += (this.offsetLeft==0) 		? " left" 	: "";
		adjustPosition += (offsetBottom==0) 		? " bottom" : "";
		adjustPosition += (offsetRight==0) 			? " right" 	: "";

		animator.style.transformOrigin = adjustPosition;

		// carico le informazioni
		animator.innerHTML = this.innerHTML;

		//add animation
		window.setTimeout(function(){
			animator.className += " zoom-me";
		}, 2)
	}

	function removeAnimate(){
		//self.animator.style.left 	= "0px";
		//self.animator.style.top 	= "0px";
		//self.animator.style.height 	= "0px";
		//self.animator.style.width 	= "0px";
	}
}