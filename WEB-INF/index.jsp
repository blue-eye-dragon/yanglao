<%@ page language="java" errorPage="/error.jsp" pageEncoding="UTF-8" contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@page import="java.util.Date"%>

<!DOCTYPE html>
<html>
	<head>
		<title>养老云平台</title>

		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
		<meta content='text/html;charset=utf-8' http-equiv='content-type'>
		<meta content='养老云平台' name='description'>
		<meta name="apple-mobile-web-app-capable" content="yes" />

		<link rel='shortcut icon' type='image/x-icon' class="J-logo">

		<link href='assets/eling/resources/meta_icons/apple-touch-icon.png' rel='apple-touch-icon-precomposed'>
		<link href='assets/eling/resources/meta_icons/apple-touch-icon-57x57.png' rel='apple-touch-icon-precomposed' sizes='57x57'>
		<link href='assets/eling/resources/meta_icons/apple-touch-icon-72x72.png' rel='apple-touch-icon-precomposed' sizes='72x72'>
		<link href='assets/eling/resources/meta_icons/apple-touch-icon-114x114.png' rel='apple-touch-icon-precomposed' sizes='114x114'>
		<link href='assets/eling/resources/meta_icons/apple-touch-icon-144x144.png' rel='apple-touch-icon-precomposed' sizes='144x144'>

		<!-- 引入自定义css -->
		<link type="text/css" rel="stylesheet" href="assets/eling/component/index.min.css">

		<!-- bootstrap -->
		<link type="text/css" rel="stylesheet" href="assets/bootstrap/bootstrap.css">
		<link type="text/css" rel="stylesheet" href="assets/flatty/light-theme.css">

	</head>

	<body id="body" class="hidden">
		<section class="J-mainframe-container"></section>
		<div class="J-tip-container" style="margin-left: 251px;"></div>

		<%
			String view = request.getParameter("view") != null ? request.getParameter("view") : "mainframe";
			String parameters=request.getParameter("parameters");
			if(view == "mainframe"){
		%>
				<section id="content" class="J-el-content"></section>
		<%
			}else{
		%>
				<section id="content" class="J-el-content" style="margin-left : 0;"></section>
		<%
			}
		%>


		<script type="text/javascript">
	    	localStorage.setItem("ctx","<c:url value='/'/>");
	    	localStorage.setItem("time-diffrence",new Date().getTime()-<%=new Date().getTime()%>);
		</script>

		<script id="seajsnode" type="text/javascript" src="assets/seajs/seajs/2.2.1/sea-debug.js"></script>
		<script type="text/javascript" src="assets/seajs/seajs-text/1.0.2/seajs-text.js"></script>
		<script type="text/javascript" src="assets/seajs/seajs-style/seajs-style.js"></script>
		<script type="text/javascript" src="assets/config/sea_config.js?randomId=<%=Math.random()%>"></script>

		<script type="text/javascript">
			seajs.use(["./assets/eling/app"],function(app){
				app.init({
					name : "<%=view%>",
					parameters : "<%=parameters%>"
				});
			});
		</script>
	</body>
</html>
