/**
 * 活动报名补录
 * */
define(function(require, exports, module) {
	var aw = require("ajaxwrapper");
	var EditGrid=require("editgrid");
	var Dialog = require("dialog");
	//多语
	var i18ns = require("i18n");
	var supplementGrid = {
			init:function(widget,params){
				var supplementgrid = new EditGrid({
					autoRender:false,
					parentNode : ".J-dialog-conponent",
					model:{
						id : "supplementgrid",
						columns:[{
							name:"member.personalInfo.name",
							label:i18ns.get("sale_ship_owner","会员"),
							format:function(value,row){
								return row.member.memberSigning.room.number+"-"+row.member.personalInfo.name;
							},
							editor : {
								type : "autocomplete",
								url : "api/member/search",
								params : function(){
									return {
										searchProperties:"personalInfo.name,memberSigning.room.number",
										statusIn:"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized,Waitting",
										fetchProperties:
											"pkMember," +
											"status," +
											"personalInfo.name," +
											"personalInfo.sex,"+
											"personalInfo.birthday," +
											"personalInfo.idType," +
											"personalInfo.idNumber," +
											"personalInfo.phone," +
											"personalInfo.mobilePhone,"+
											"memberSigning.room.number"
									}
								},
								queryParamName : "s",
								//代表所选的选项的值是哪一个字段的值
								keyField : "pkMember",
								//代表选项下拉框中显示的值
								format : function(data){
									return data.memberSigning.room.number + "-" + data.personalInfo.name;
								},
								onAdd : function(plugins){
									var supplementG = widget.get("supplementG");
									var oldDatas = supplementG.getData();
									var curMember = plugins["member.personalInfo.name"].getData();
									var validateRet = widget.memberValidate(curMember,oldDatas)
									if(validateRet){
										supplementG.add({											
											member : curMember
										});
										return true;
									}
									return false;
								},
								onBeforeEdit : function(data){
									var isEdit;
									aw.ajax({
        								url:"api/activityreport/query",
        								//设aw请求为异步，不建议使用
        								async:false,
        								data:{
        									member:data.member.pkMember,
        									activity:data.activity.pkActivity
        								},
        								dataType:"json",
        								success:function(result){ 
        									if(result.length>0){
        										Dialog.alert({
        											id : "second-dialog",
		        									content : "该"+i18ns.get("sale_ship_owner","会员")+"已存在"+i18ns.get("sale_ship_owner","会员")+"活动报告，不能进行修改！",
		        									confirm : function(){
		        										Dialog.close("second-dialog");
		        										return false;
		        									}
		        								});
        										return false;
        									}else{
        										isEdit = true;
        									}
        								}
        							});
									if(isEdit == true){
										return true;
									}
								},
								onEdit : function(editor,rowIndex,rowData){
									editor.setData(rowData.member);
								},
								onChange : function(editor,rowIndex,rowData){
									var supplementG = widget.get("supplementG");
									//仅进行视图操作
									var curMember = editor.getData();
									if(widget.memberValidate(curMember,supplementG.getData())){
										//更新模型
										rowData.member = editor.getData();
										supplementG.update(rowIndex,rowData);
									}else{
										//恢复之前的值
										editor.setData(rowData.member);
									}
								}
							}
						},{
							name:"member.personalInfo.sex.value",
							label:"性别"
						},{
							name:"member.personalInfo.birthday",
							label:"年龄",
							format : "age",
						},{
							name:"member.personalInfo.idType.value",
							label:"证件类型"
						},{
							name:"member.personalInfo.idNumber",
							label:"证件编码"
						},{
							name : "member.personalInfo.phone",
							label : "联系方式",
							format:function(value,row){
								var phone = row.member.personalInfo.phone;
								var mobile = row.member.personalInfo.mobilePhone;
								var str = "";
								if(phone!=""){
									str += phone;
								}
								if (phone!="" && mobile!=""){
									str += "/";
								}
								if(mobile!=""){
									str += mobile;
								}	
								return str;
							}
						},{
							name:"operate",
							label:"操作", 	
							format:"button",
							formatparams:[{
								id:"del",
								text:"删除",
								handler:function(index,data,rowEle){
									var supplementG = widget.get("supplementG");
									aw.ajax({
        								url:"api/activityreport/query",
        								data:{
        									member:data.member.pkMember,
        									activity:data.activity.pkActivity
        								},
        								dataType:"json",
        								success:function(result){ 
        									if(result.length>0){
        										Dialog.alert({
        											id : "second-dialog",
		        									content : "该"+i18ns.get("sale_ship_owner","会员")+"已存在"+i18ns.get("sale_ship_owner","会员")+"活动报告，不能进行删除！",
		        									confirm : function(){
		        										Dialog.close("second-dialog");
		        										return false;
		        									}
		        								});
        										return false;
        									}else{
        										supplementG.remove(rowEle);
        									}
        								}
        							});
								}
							}]
						}]
					}
				});
				widget.set("supplementG",supplementgrid);
				return supplementgrid;
		}
	}

	module.exports = supplementGrid;	
});

