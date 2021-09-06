<%@ page language="java" errorPage="/error.jsp" pageEncoding="UTF-8" contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    
	<link type="text/css" rel="stylesheet" href="../../../../eling/component/index.min.css">
	
	<!-- bootstrap -->
	<link type="text/css" rel="stylesheet" href="../../../../bootstrap/bootstrap.css">
	<link type="text/css" rel="stylesheet" href="../../../../flatty/light-theme.css">
	
	<link type="text/css" rel="stylesheet" href="../../../../eling/theme/eling/theme-color.css">
	
	<script type="text/javascript">
		localStorage.setItem("ctx","<c:url value='/'/>");
	</script>
		
</head>

<body>
</body>

	<script id="seajsnode" type="text/javascript" src="../../../../seajs/seajs/2.2.1/sea-debug.js"></script>
	<script type="text/javascript" src="../../../../seajs/seajs-text/1.0.2/seajs-text-debug.js"></script>
	<script type="text/javascript" src="../../../../seajs/seajs-style/seajs-style.js"></script>
	<script type="text/javascript" src="../../../../config/sea_config.js"></script>
	
	<script type="text/javascript" src="../../../../jquery/jquery/jquery-debug.js"></script>
	
	<script type="text/javascript" src="../../../../moment/moment-2.1.0.js"></script>
	
	<script type="text/javascript">
		seajs.use(["./displayscreenpreview"],function(View){
			var parameters = window.location.search.substr(1).match(new RegExp("parameters=([^&]*)"))[1].replace(/\\%22/g,"\"")
			var params = JSON.parse(parameters);
			params.token = window.location.search.substr(1).match(new RegExp("token=([^&]*)"))[1];
			new View({
				parentNode: "body",
				params: params
			}).render();
		});
	</script>

</html>