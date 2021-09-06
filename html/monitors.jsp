<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="org.springframework.security.web.WebAttributes,org.springframework.security.core.AuthenticationException,org.springframework.security.authentication.BadCredentialsException" %>
<%@ page import="com.eling.elcms.monitor.util.Constant" %>

<!DOCTYPE html>
<%

String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String pkPlace = request.getParameter("pkPlace");//用request得到
String coordinate = request.getParameter("coordinate");//用request得到

%>
<html>
  <head>
    <title>摄像头组</title>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    <meta content='text/html;charset=utf-8' http-equiv='content-type'>
	<script type="text/javascript" src="<%=path%>/assets/jquery/jquery-1.7.js"></script>
	
  
	
  </head>
  
 
  <body >
    	<iframe id="monitor" name="monitor"  allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' width='100%' frameborder="no"  ></iframe>
    <script type="text/javascript">
   /*  function iFrameHeight() {

        var ifm= document.getElementById("monitor");
        var subWeb = document.frames ? document.frames["monitor"].document :ifm.contentDocument;
        //console.log(document.getElementById("monitor").document.getElementById("videoLeft"));
        //console.log(window.frames["monitor"].document);
        if(ifm != null && subWeb != null) {
            ifm.height = subWeb.body.scrollHeight;
            console.log(subWeb.body.scrollHeight);
            var dHeight = ifm.contentWindow.document.documentElement.scrollHeight;  
           
        }

    } */
    
 /*    var iframe =  document.getElementById("monitor");
	if (iframe.attachEvent){
		console.log(1111);
		    iframe.attachEvent("onload", function(){
		        alert("Local iframe is now loaded1.");
		    });
		} else {
			console.log(2222);
		    iframe.onload = function(){
		    	//iFrameHeight();
		       // alert("Local iframe is now loaded2.");
		        alert("Local iframe is now loaded2.");
		        var ifm= document.getElementById("monitor");
		        var subWeb = document.frames ? document.frames["monitor"].document :ifm.contentDocument;
		        alert($($("#monitor").contents().get(0)).find("#videoLeft").height());
		        //alert($(window.frames["monitor"].document).find("#videoLeft").html());
		    };
	} */
    <%if(pkPlace!=null){%>
    $.ajax({ 
		url: "<%=path%>/api/monitor/queryUrl", 
		type:"post",
		data:{
			'pkPlace':'<%=pkPlace%>',
			<%-- "monitor.coordinate":'<%=pkPlace%>', --%>
		},
		dataType: "text",
		success: function(data){
			if(data!=null && data!=''){
			 <%-- window.location.href="http://<%=serverUrl%>/video/players/"+data+".do"; --%> 
			 window.location.href=data; 
			// $("#monitor").attr("src","http://123.138.87.178:58080/video/players/"+data+".do");
			/*  if (!iframe.readyState || iframe.readyState == "complete") {  
		            alert("Local iframe is now loaded.");  
		        }  
			 iFrameHeight(); */
			}else{
				alert("范围内无可用摄像头");
				closeWindows();
				//closeWP();
			}
		}
	});
    <%}%>
    <%if(coordinate!=null){%>
    $.ajax({ 
		url: "<%=path%>/api/monitor/queryUrl", 
		type:"post",
		dataType: "text",
		data:{
			"monitor.coordinate":'<%=coordinate%>'
		},
		success: function(data){
			if(data!=null && data!=''){
			/*  window.location.href="http://123.138.87.178:58080/video/players/"+data+".do";  */
			 window.location.href=data; 
			 //$("#monitor").attr("src","http://123.138.87.178:58080/video/players/"+data+".do");
			// iFrameHeight();
			}else{
				alert("范围内无可用摄像头");
				closeWindows();
			}
		}
	});
    <%}%>
    
    function closeWindows() {
        var browserName = navigator.appName;
        var browserVer = parseInt(navigator.appVersion);
        //alert(browserName + " : "+browserVer);

        //document.getElementById("flashContent").innerHTML = "<br>&nbsp;<font face='Arial' color='blue' size='2'><b> You have been logged out of the Game. Please Close Your Browser Window.</b></font>";

        if(browserName == "Microsoft Internet Explorer"){
            var ie7 = (document.all && !window.opera && window.XMLHttpRequest) ? true : false;  
            if (ie7)
            {  
              //This method is required to close a window without any prompt for IE7 & greater versions.
              window.open('','_parent','');
              window.close();
            }
           else
            {
              //This method is required to close a window without any prompt for IE6
              this.focus();
              self.opener = this;
              self.close();
            }
       }else{  
           //For NON-IE Browsers except Firefox which doesnt support Auto Close
           try{
               this.focus();
               self.opener = this;
               self.close();
           }
           catch(e){

           }

           try{
               window.open('','_self','');
               window.close();
           }
           catch(e){

           }
       }
   }
	</script>
  </body>
</html>
