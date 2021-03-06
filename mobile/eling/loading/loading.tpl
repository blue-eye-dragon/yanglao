<style>
  .spin{
    position: absolute;
    top: 45%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
    background-color: black;
    border-radius: 15px;
    border:2px solid #a1a1a1;
    width: 100px;
    height: 100px;
    opacity: 0.7;
    text-align: center;
    color: whitesmoke;
}

  #loadingChar{
    margin-top: 15px;
}

  #floatingBarsG{
	position:relative;
	width:32px;
	height:40px;
	left: 33%;
    top: 12%;
}

  .blockG{
	position:absolute;
	background-color:#FFFFFF;
	width:5px;
	height:12px;
	-moz-border-radius:5px 5px 0 0;
	-moz-transform:scale(0.4);
	-moz-animation-name:fadeG;
	-moz-animation-duration:1.04s;
	-moz-animation-iteration-count:infinite;
	-moz-animation-direction:normal;
	-webkit-border-radius:5px 5px 0 0;
	-webkit-transform:scale(0.4);
	-webkit-animation-name:fadeG;
	-webkit-animation-duration:1.04s;
	-webkit-animation-iteration-count:infinite;
	-webkit-animation-direction:normal;
	-ms-border-radius:5px 5px 0 0;
	-ms-transform:scale(0.4);
	-ms-animation-name:fadeG;
	-ms-animation-duration:1.04s;
	-ms-animation-iteration-count:infinite;
	-ms-animation-direction:normal;
	-o-border-radius:5px 5px 0 0;
	-o-transform:scale(0.4);
	-o-animation-name:fadeG;
	-o-animation-duration:1.04s;
	-o-animation-iteration-count:infinite;
	-o-animation-direction:normal;
	border-radius:5px 5px 0 0;
	transform:scale(0.4);
	animation-name:fadeG;
	animation-duration:1.04s;
	animation-iteration-count:infinite;
	animation-direction:normal;
}

#rotateG_01{
	left:0;
	top:15px;
	-moz-animation-delay:0.39s;
	-moz-transform:rotate(-90deg);
	-webkit-animation-delay:0.39s;
	-webkit-transform:rotate(-90deg);
	-ms-animation-delay:0.39s;
	-ms-transform:rotate(-90deg);
	-o-animation-delay:0.39s;
	-o-transform:rotate(-90deg);
	animation-delay:0.39s;
	transform:rotate(-90deg);
}

#rotateG_02{
	left:4px;
	top:5px;
	-moz-animation-delay:0.52s;
	-moz-transform:rotate(-45deg);
	-webkit-animation-delay:0.52s;
	-webkit-transform:rotate(-45deg);
	-ms-animation-delay:0.52s;
	-ms-transform:rotate(-45deg);
	-o-animation-delay:0.52s;
	-o-transform:rotate(-45deg);
	animation-delay:0.52s;
	transform:rotate(-45deg);
}

#rotateG_03{
	left:13px;
	top:2px;
	-moz-animation-delay:0.65s;
	-moz-transform:rotate(0deg);
	-webkit-animation-delay:0.65s;
	-webkit-transform:rotate(0deg);
	-ms-animation-delay:0.65s;
	-ms-transform:rotate(0deg);
	-o-animation-delay:0.65s;
	-o-transform:rotate(0deg);
	animation-delay:0.65s;
	transform:rotate(0deg);
}

#rotateG_04{
	right:4px;
	top:5px;
	-moz-animation-delay:0.78s;
	-moz-transform:rotate(45deg);
	-webkit-animation-delay:0.78s;
	-webkit-transform:rotate(45deg);
	-ms-animation-delay:0.78s;
	-ms-transform:rotate(45deg);
	-o-animation-delay:0.78s;
	-o-transform:rotate(45deg);
	animation-delay:0.78s;
	transform:rotate(45deg);
}

#rotateG_05{
	right:0;
	top:15px;
	-moz-animation-delay:0.9099999999999999s;
	-moz-transform:rotate(90deg);
	-webkit-animation-delay:0.9099999999999999s;
	-webkit-transform:rotate(90deg);
	-ms-animation-delay:0.9099999999999999s;
	-ms-transform:rotate(90deg);
	-o-animation-delay:0.9099999999999999s;
	-o-transform:rotate(90deg);
	animation-delay:0.9099999999999999s;
	transform:rotate(90deg);
}

#rotateG_06{
	right:4px;
	bottom:4px;
	-moz-animation-delay:1.04s;
	-moz-transform:rotate(135deg);
	-webkit-animation-delay:1.04s;
	-webkit-transform:rotate(135deg);
	-ms-animation-delay:1.04s;
	-ms-transform:rotate(135deg);
	-o-animation-delay:1.04s;
	-o-transform:rotate(135deg);
	animation-delay:1.04s;
	transform:rotate(135deg);
}

#rotateG_07{
	bottom:0;
	left:13px;
	-moz-animation-delay:1.1700000000000002s;
	-moz-transform:rotate(180deg);
	-webkit-animation-delay:1.1700000000000002s;
	-webkit-transform:rotate(180deg);
	-ms-animation-delay:1.1700000000000002s;
	-ms-transform:rotate(180deg);
	-o-animation-delay:1.1700000000000002s;
	-o-transform:rotate(180deg);
	animation-delay:1.1700000000000002s;
	transform:rotate(180deg);
}

#rotateG_08{
	left:4px;
	bottom:4px;
	-moz-animation-delay:1.3s;
	-moz-transform:rotate(-135deg);
	-webkit-animation-delay:1.3s;
	-webkit-transform:rotate(-135deg);
	-ms-animation-delay:1.3s;
	-ms-transform:rotate(-135deg);
	-o-animation-delay:1.3s;
	-o-transform:rotate(-135deg);
	animation-delay:1.3s;
	transform:rotate(-135deg);
}

@-moz-keyframes fadeG{
0%{
background-color:#000000}

100%{
background-color:#FFFFFF}

}

@-webkit-keyframes fadeG{
0%{
background-color:#000000}

100%{
background-color:#FFFFFF}

}

@-ms-keyframes fadeG{
0%{
background-color:#000000}

100%{
background-color:#FFFFFF}

}

@-o-keyframes fadeG{
0%{
background-color:#000000}

100%{
background-color:#FFFFFF}

}

@keyframes fadeG{
0%{
background-color:#000000}

100%{
background-color:#FFFFFF}

}
</style>
<div class="J-loading spin">
  <div id="floatingBarsG">
	<div class="blockG" id="rotateG_01">
	</div>
	<div class="blockG" id="rotateG_02">
	</div>
	<div class="blockG" id="rotateG_03">
	</div>
	<div class="blockG" id="rotateG_04">
	</div>
	<div class="blockG" id="rotateG_05">
	</div>
	<div class="blockG" id="rotateG_06">
	</div>
	<div class="blockG" id="rotateG_07">
	</div>
	<div class="blockG" id="rotateG_08">
	</div>
	</div>
  <div id="loadingChar">?????????</div>
</div>
