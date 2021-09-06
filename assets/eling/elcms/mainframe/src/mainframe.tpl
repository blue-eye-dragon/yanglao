<div class="el-mainframe">
	<header id="header">
		<nav class="el-headerbar navbar navbar-default">
			<a href="javascript:void(0);" class="J-headerbar-logo navbar-brand">
				<img src="{{this.logo_left}}" class="logo"/>
				<img src="{{this.logo_left_xs}}" class="logo-xs"/>
			</a>
			<a href="javascript:void(0);" class="toggle-nav btn pull-left">
				<i class="icon-reorder"></i>
			</a>
			<ul class="nav">
				<li><a href="javascript:void(0);" class="navbar-brand el-headerbar-datetime J-headerbar-datetime"></a></li>
				<li><a href="javascript:void(0);" class="navbar-brand el-headerbar-datetime J-headerbar-weekday"></a></li>
				<li><a href="javascript:void(0);" class="navbar-brand el-headerbar-weather J-headerbar-weather"></a></li>
				{{#if this.todolist}}
				<li class="dropdown medium only-icon widget J-header-todolist">
					<a class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">
						<i class="icon-rss"></i>
						<div class="label">{{this.todos.length}}</div>
					</a>
					<ul class="dropdown-menu">
						{{#each this.todos}}
						<li>
							<a href="javascript:void(0);" class="J-header-todolist-item" data-url="{{this.pageLink}}" data-params="{{this.pageParameter}}">
								<div class="widget-body">
									<div class="pull-left icon">
										<i class="icon-user text-success"></i>
			                    	</div>
		                    		<div class="pull-left text" >
		                    			{{this.title}}
		                      			<small class="text-muted">{{this.date}}</small>
		                    		</div>
		                 		 </div>
		                	</a>
		              	</li>
		              	<li class="divider"></li>
		              	{{/each}}
		            </ul>
        		</li>
        		{{/if}}
				<li class="dropdown dark user-menu J-username" >
					<a href="javascript:void(0);" data-toggle="dropdown" class="dropdown-toggle" style="background: none;">
						<img width="23" height="23" src="{{this.logo_right}}"/>
						<span class="user-name">{{this.name}}</span><b class="caret"></b>
					</a>
					<ul class="dropdown-menu">
						<li>
							<a class="J-headerbar-openview" data-url="eling/elcms/system/userprofile/userprofile" href="javascript:void(0);">
								<i class="icon-user"></i>
								<span></span>用户配置
							</a>
							<a class="J-headerbar-openview" data-url="eling/elcms/system/feedback/feedback" href="javascript:void(0);">
								<i class="icon-cog"></i>问题报告
							</a>
							<a class="J-changeuser" href="javascript:void(0);">
								<i class="icon-user"></i>切换用户
							</a>
						</li>
						<li class="divider"></li>
						<li><a href="#" target="_blank"><i class="icon-question-sign"></i>帮助</a></li>
						<li><a href="j_spring_security_logout"><i class="icon-signout"></i>退出</a></li>
					</ul>
				</li>
			</ul>
		</nav>
	</header>
	<div id="wrapper">
		<nav id="main-nav">
			<div class="navigation">
	    		<!-- 在手机上显示搜索菜单 -->
				<div class="search">
				    <form>
				        <div class="search-wrapper">
				            <input value="" class="search-query form-control" type="text"/>
				            <button class="btn btn-link icon-search" name="button" type="submit"></button>
				        </div>
				    </form>
				</div>
				<ul class="nav nav-stacked">
				{{#each this.menus}}
					<li>
					   <a data-url="{{path}}" data-params="{{parameter}}" id="{{code}}" class="{{#if subItems}}dropdown-collapse{{else}}isleaf{{/if}}" href="javascript:void(0);">
					       <i class="{{icon}}"></i>
					       <span>{{display}}</span>
					       {{#if subItems}}<i class="icon-angle-down angle-down"></i>{{/if}}
					   </a>
					   {{#if subItems}}
					   <ul class="nav nav-stacked">
					   {{#each subItems}}
					  	   <li>
					  	   		<a data-url="{{path}}" data-params="{{parameter}}" id="{{code}}" class="{{#if subItems}}dropdown-collapse{{else}}isleaf{{/if}}" href="javascript:void(0);">
						        	<i class="{{icon}}"></i>
						        	<span>{{display}}</span>
						        	{{#if subItems}}<i class="icon-angle-down angle-down"></i>{{/if}}
					    		</a>
								{{#if subItems}}
								<ul class="nav nav-stacked">
									{{#each subItems}}
									<li>
									   <a data-url="{{path}}" data-params="{{parameter}}" id="{{code}}" class="{{#if subItems}}dropdown-collapse{{else}}isleaf{{/if}}" href="javascript:void(0);">
									       <i class="{{icon}}"></i>
									       <span>{{display}}</span>
									       {{#if subItems}}<i class="icon-angle-down angle-down"></i>{{/if}}
									   </a>
										{{#if subItems}}
										<ul class="nav nav-stacked">
											{{#each subItems}}
												<li>
												   <a data-url="{{path}}" data-params="{{parameter}}" id="{{code}}" class="{{#if subItems}}dropdown-collapse{{else}}isleaf{{/if}}" href="javascript:void(0);">
												       <i class="{{icon}}"></i>
												       <span>{{display}}</span>
												       {{#if subItems}}<i class="icon-angle-down angle-down"></i>{{/if}}
												   </a>
												</li>
											{{/each}}
										</ul>
										{{/if}}
									</li>
									{{/each}}
								</ul>
								{{/if}}
							</li>
						{{/each}}
					</ul>
					{{/if}}
					</li>
				{{/each}}
				</ul>
            </div>
		</nav>
	</div>
	<!-- 增加一个隐藏的form用于切换用户 -->
	<div class="login hidden">
		<div class="login-container" style="border-radius:25px;">
			<div class="container">
				<div class="row">
					<div class="col-sm-12">
						<h1 class="text-center title">切换用户</h1>
						<form action="{{this.ctx}}j_spring_security_check" class="validate-form" method="post">
							<div class="form-group">
								<div class="controls with-icon-over-input">
									<input placeholder="用户名" class="form-control" data-rule-required="true" name="j_username" id="j_username" type="text">
									<i class="icon-user text-muted"></i>
								</div>
							</div>
							<div class="form-group">
								<div class="controls with-icon-over-input">
									<input placeholder="密码" class="form-control" data-rule-required="true" name="j_password" id="j_password" type="password">
									<i class="icon-lock text-muted"></i>
								</div>
							</div>
							<div class="form-group text-center">
								<button class="btn btn-danger" style="width: 48%;">切换</button>
								<div class="btn J-headerbar-cancel" style="width: 48%;">取消</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="J-mask mask hidden"></div>
