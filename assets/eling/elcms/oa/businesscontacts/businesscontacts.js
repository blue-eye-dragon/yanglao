/**
 * 商业通讯录
 */
define(function(require, exports, module) {
	var ELView = require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav");	
	var Grid = require("grid");
	var Profile = require("profile");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
	require("jquery.ajaxfileupload");
	var template=require("./businesscontacts.tpl");
	require("./businesscontacts.css");
	
    //获取文件后缀名
    //输入"abc.jpg" 输出".jpg"
    function getFileExt(str){ 
	    var result = /\.[^\.]+$/.exec(str); 
	    return result; 
    }

	var BusinessContacts = ELView.extend({
    	attrs:{
    		template:template
        },
        events:{
        	"change #excelImport" : function(e){
				$("#fileName").val(e.target.files[0].name);
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"商业通讯录",
					items : [{
						id : "search",
						type : "search",
						placeholder : "姓名/单位名称/移动电话",
						handler : function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/businesscontacts/search",
								data:{
									s:str,
//									properties:"name,company,mobile",
									fetchProperties:"*",
									
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						},
					},{
						id:"all",
						text : "全部",
						type : "button",
						show:true,
						handler:function(){
							widget.get("grid").refresh();
						}
					},{
						id:"add",
						text : "新增",
						type : "button",
						show:true,
						handler:function(){
							var profile = widget.get("profile");
							profile.reset();
							widget.get("subnav").show(["return"]).hide(["excelImport","all","add","search"]);
							widget.show(".J-profile").hide(".J-grid");
						}
					},{
						id:"excelImport",
						text : "导入",
						type : "button",
						show:true,
						handler:function(){
							var form = new Form({
								model:{
									id:"importForm",
									items:[{
										name:"chooseFile",
										format : function(){
											return '<button class="btn" id="btnChooseFile" style="color: white;background: #f34541;position:absolute;left:247px;">选择文件</button>' +
											'<input class="form-control J-excelImportFileName" id="fileName" readonly="true"/>';
										}
									}],
									defaultButton:false
								}
							});
							Dialog.showComponent({
								title:"Excel导入",
								content:" 请选择文件，按确定后开始导入。导入过程较慢，请您耐心等候导入的完成，在导入时请勿刷新页面。",
								setStyle:function(){
									$(".el-dialog .modal.fade.in").css({
										"top":"10%",
										"width":"475px"
									});
								},
								events : {
									"click #btnChooseFile":function(e){
										$("#excelImport").val("");
										$("#excelImport").click();
									}
								},
								confirm:function(){
									var fileName = $("#fileName").val();
									if(fileName == ""){
										Dialog.alert({
											title:"提示",
											content:" 请选择导入文件!"
										});
										return "NotClosed";
									}else if(getFileExt(fileName) != ".xlsx"){
										Dialog.alert({
											title:"提示",
											content:" 请导入后缀名为\"xlsx\"的Excel文件!"
										});
										return "NotClosed";
									}else{
										Dialog.alert({
											title:"提示",
											showBtn:false,
											content:"导入过程较慢，请您耐心等候……"
										});
										$.ajaxFileUpload({
											url : "api/businesscontacts/import", 
											secureuri:false,
											fileElementId:'excelImport',
											dataType: 'json',
											uploadHttpData:function(data,dataType){
												if(data.responseText == ""){
													return null;
												}else{
													var result = data.responseText;
													try{
														return $.parseJSON(result);
													}catch(e){
														return result;
													}
												}
											},
											success: function (data){
												Dialog.close();
												Dialog.alert({
													content:"导入成功"
												});
												widget.get("grid").refresh();
											},
											error: function (data, status, e){
												Dialog.close();
											}
										});
										return "NotClosed";
									}
								}
							},form);
						}
					},{
						id : "return",
						text : "返回",
						type : "button",
						show:false,
						handler:function(){
							widget.get("subnav").hide(["return"]).show(["excelImport","all","add","search"]);
							widget.show(".J-grid").hide(".J-profile");
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				url:"api/businesscontacts/query",				
				params:function(){
					return {
						fetchProperties:"*",
					};
				},
				model:{
					columns:[{
						key:"name",
						name:"姓名",
						className:"name",
						format:"detail",
						formatparams:{
							key:"detail",
							handler:function(index,data,rowEle){
								var profile =widget.get("profile");
								profile.reset();
								profile.loadPicture("api/attachment/businesscontactsphoto/"+data.pkBusinessContacts);
								profile.setData(data);
								profile.setDisabled(true);
								widget.get("subnav").hide(["excelImport","all","add","search"]).show(["return"]);
								widget.show(".J-profile").hide(".J-grid");
							}
						}
					},{
						key:"title",
						name:"称谓",
						className:"title"
					},{
						key:"company",
						name:"单位名称",
						className:"company"
					},{
						key:"telephone",
						name:"电话",
						className:"telephone"
					},{
						key:"electrograph",
						name:"传真",
						className:"electrograph"
					},{
						key:"mobile",
						name:"移动电话",
						className:"mobile"
					},{
						key:"email",
						name:"电子邮件",
						className:"email"
					},{
						key:"operate",
						className:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"icon-edit",
							handler:function(index,data,rowEle){
								var profile=widget.get("profile");
								profile.reset();
								profile.loadPicture("api/attachment/businesscontactsphoto/"+data.pkBusinessContacts);
								profile.setData(data);
								widget.get("subnav").hide(["excelImport","all","add","search"]).show(["return"]);
								widget.show(".J-profile").hide(".J-grid");
							}
						},{
							key:"delete",	
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								aw.del("api/businesscontacts/" + data.pkBusinessContacts + "/delete",function(){
									widget.get("grid").refresh();
								});
							}
						}],
						col:1
					}]
				}
			});
			this.set("grid",grid);
			
			var profile=new Profile({
				parentNode:".J-profile",
				saveaction:function(){
					aw.saveOrUpdate("api/businesscontacts/save",$("#businessProfile").serialize(),function(data){
						widget.show(".J-grid").hide(".J-profile");
						widget.get("subnav").hide(["return"]).show(["excelImport","all","add","search"]);
						widget.get("grid").refresh();
						if(data.pkBusinessContacts){
							widget.get("profile").upload("api/attachment/businesscontactsphoto/"+data.pkBusinessContacts);
							
						}
					});
				},
				cancleaction:function(){
					widget.show(".J-grid").hide(".J-profile");
					widget.get("subnav").hide(["return"]).show(["excelImport","all","add","search"]);
				},
				model:{
					id:"businessProfile",
					items:[{
						title:"商业通讯录",
						img:{
							idAttribute:"pkBusinessContacts",
							url:"api/attachment/businesscontactsphoto/",
						},
						children:[{
							name:"pkBusinessContacts",
							type:"hidden"
						},{
							name:"version",
							defaultValue:"0",
							type:"hidden"
						},{
							name:"name",
							label:"姓名",
							validate:["required"]
						},{
							name:"title",
							label:"称谓"
						},{
							name:"company",
							label:"单位名称"
						},{
							name:"department",
							label:"部门"
						},{
							name:"job",
							label:"职务"
						},{
							name:"address",
							label:"邮政地址"
						},{
							name:"zipCode",
							label:"邮政编码"
						},{
							name:"telephone",
							label:"电话"
						},{
							name:"electrograph",
							label:"传真"
						},{
							name:"code",
							label:"统一编码"
						},{
							name:"otherphone",
							label:"其他电话"
						},{
							name:"other",
							label:"单位其他"
						},{
							name:"mobile",
							label:"移动电话",
							validate:["required"]
						},{
							name:"teleCall",
							label:"呼机"
						},{
							name:"email",
							label:"电子邮件"
						},{
							name:"mainpage",
							label:"主页"
						},{
							name:"description",
							label:"备注",
							type:"textarea",
							height:"200"
						}]
					}]
				}
			});
			this.set("profile",profile);
		}
	});
	module.exports = BusinessContacts;
})