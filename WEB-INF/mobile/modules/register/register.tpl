<div class="el-register">
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<h1 class="pull-left"><span>注册</span></h1>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<form class="form form-horizontal" id="register">
					<input name="openid" class="J-openid" type="hidden" value="{{this.openid}}"/>
					<div class="row margin_top_20">
						<div class="col-xs-12">
							<label>手机号码</label>
						</div>
						<div class="col-xs-12">
							<input name="phone" class="form-control J-phone" placeholder="请输入手机号码"/>
						</div>
					</div>
					<div class="row margin_top_20">
						<div class="col-xs-12">
							<label>社区</label>
						</div>
						<div class="col-xs-12">
							<select name="communityCode" class="form-control J-community" style="width: 157px;"></select>
						</div>
					</div>
					<div class="row margin_top_20">
						<div  class="col-xs-12">
							<label>验证码</label>
						</div>
						<div class="col-xs-6">
							<input name="validatecode" class="form-control J-validatacode" placeholder="请输入验证码">
						</div>
						<div class="col-xs-6">
							<div class="btn btn-danger getvailcode J-getvailcode">获取验证码</div>
						</div>
					</div>
            	</form>
             </div>
         </div>
         <div class="row margin_top_20">
			<div class="col-xs-12">
				<div class="text-center">
					<button class="J-save btn btn-lg btn-block btn-danger">提交</button>
				</div>
			</div>
		 </div>
     </div>
 </div>
