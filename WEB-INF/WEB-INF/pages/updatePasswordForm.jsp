<%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<head>
    <!-- <title><fmt:message key="updatePassword.title"/></title> -->
    <title>修改密码</title>
    <meta name="menu" content="UserMenu"/>
    <!-- / bootstrap [required] -->
    <link href="assets/stylesheets/bootstrap/bootstrap.min.css" media="all" rel="stylesheet" type="text/css" />
    <!-- / theme file [required] -->
    <link href="assets/stylesheets/light-theme.min.css" media="all" id="color-settings-body-color" rel="stylesheet" type="text/css" />
    
    <link href="assets/stylesheets/theme-colors.min.css" media="all" id="color-settings-body-color" rel="stylesheet" type="text/css" />
</head>
<body id="updatePassword">

<div class="col-sm-3">
 	<!--<h2><fmt:message key="updatePassword.heading"/></h2>  -->   
    <h2>修改密码</h2>
    <c:choose>
        <c:when test="${not empty cptoken}">
           <!-- <p><fmt:message key="updatePassword.passwordReset.message"/></p> --> 
            <p class="lead">您申请的一个重置密码请求，下面请输入您的密码</p>
        </c:when>
        <c:otherwise>
            <!-- <p><fmt:message key="updatePassword.changePassword.message"/></p> -->
            <p class="lead">下面请输入您的密码</p>
        </c:otherwise>
    </c:choose>
</div>
<div class="col-sm-5">
	<form method="post" id="updatePassword" action="<c:url value='/updatePassword'/>" class="well" autocomplete="off">
		
        <div class="form-group">
      <!--     <label class="control-label"><fmt:message key="user.username"/></label>
            <input type="text" name="username" class="form-control" id="username" value="<c:out value="${username}" escapeXml="true"/>" required>
        -->   
        <h3>亲爱的${username}，你好！</h3>   
        <input type="hidden" name="username" value="${username}" />
        </div>

	    <c:choose>
	    	<c:when test="${not empty cptoken}">
			    <input type="hidden" name="cptoken" value="<c:out value="${cptoken}" escapeXml="true" />"/>
	    	</c:when>
	    	<c:otherwise>
		        <div class="form-group">
		        	<!-- <label class="control-label"><fmt:message key="updatePassword.currentPassword.label"/></label>
                    <input type="password" class="form-control" name="currentPassword" id="currentPassword" required autofocus>
                     -->
                    <label class="control-label">原密码：</label>
                    <input type="password" class="form-control" name="currentPassword" id="currentPassword" required autofocus>
		        </div>
	    	</c:otherwise>
	    </c:choose>

        <div class="form-group">
        	<!-- <label class="control-label"><fmt:message key="updatePassword.newPassword.label"/></label>
            <input type="password" class="form-control" name="password" id="password" required> 
            -->
            <label class="control-label">新密码：</label>
            <input type="password" class="form-control" name="password" id="password" required>
        </div>
	    
	    <div class="form-group">
		    <button type="submit" class="btn btn-large btn-primary">
		        <!-- <i class="icon-ok icon-white"></i> <fmt:message key='updatePassword.changePasswordButton'/>
		         -->
		         <i class="icon-ok icon-white"></i> 提交
		    </button>
	    </div>
	</form>
</div>	

</body>