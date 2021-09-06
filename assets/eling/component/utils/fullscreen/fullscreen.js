define(function(require,exports,module){
	var FullScreen={
		requestFullscreen:function(){
			var documentEL=document.documentElement;
			if(documentEL.requestFullscreen){
				documentEL.requestFullscreen();
			}else if(documentEL.mozRequestFullscreen){
				documentEL.mozRequestFullscreen();
			}else if(documentEL.webkitRequestFullscreen){
				documentEL.webkitRequestFullscreen();
			}else if(documentEL.msRequestFullscreen){
				documentEL.msRequestFullscreen();
			}
		},
		exitFullscreen:function(){
			if(document.exitFullscreen){
				document.exitFullscreen();
			}else if(document.mozCancelFullScreen){
				document.mozCancelFullScreen();
			}else if(document.webkitCancelFullScreen){
				document.webkitCancelFullScreen();
			}else if(document.msExitFullscreen){
				document.msExitFullscreen();
			}
		}
	};
	
	module.exports=FullScreen;
});