define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var Subnav = require("subnav-1.0.0");
	var store=require("store");
	var Grid = require("grid");
	var Form =require("form-2.0.0");
	var enmu = require("enums");
	require("../../grid_css.css");
	var tools = require("tools");
	//多语
	var i18ns = require("i18n");
	var EditGrid=require("editgrid");
	var template="<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+ 
		"<div class='J-form hidden'></div>"+
		"<div class='J-membergrid hidden'></div>";
	var interestgroup = ELView.extend({
		events:{
			"click .J-memberInterestGroups-detail":function(e){
				var widget = this;
				widget.show([".J-membergrid",".J-form"]).hide([".J-grid"]);
				widget.get("subnav").hide(["add","type","search"]).show(["return"]);
				
				var grid = this.get("grid");
				var index = grid.getIndex(e.target);
				var data = grid.getData(index);
				
				//设置主表
				widget.get("form").setData(data);
				widget.get("form").setDisabled(true);
				
				//设置子列表
				widget.get("membergrid").setDisabled(true);
				widget.compare(data.memberInterestGroups);
				widget.get("membergrid").setData(data.memberInterestGroups);
				widget.setTitle(widget.get("membergrid").getData());
				
				$(".J-grid-membergrid-join").addClass("hidden");
				$(".J-grid-membergrid-out").addClass("hidden");
				$(".J-grid-membergrid-del").addClass("hidden");
			}
		},
		 attrs:{
         	template:template
         },
         initComponent:function(params,widget){
        	 var subnav=new Subnav({
 				parentNode:".J-subnav",
 				model:{
					title:"兴趣小组",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/interestgroup/search",
							data:{
								s:str,
								searchProperties:
										"name," +
										"memberInterestGroups.member.personalInfo.name," +
										"type," +
										"users.name",
								fetchProperties:"pkInterestGroup," +
		 								"name," +
		 								"type," +
		 								"users.pkUser," +
		 								"users.name," +
		 								"version," +
		 								"memberInterestGroups.pkMemberInterestGroup," +
		 								"memberInterestGroups.member.pkMember," +
		 								"memberInterestGroups.member.personalInfo.name," +
		 								"memberInterestGroups.member.personalInfo.birthday," +
	 	 								"memberInterestGroups.member.personalInfo.sex," +
	 	 								"memberInterestGroups.member.status," +
		 								"memberInterestGroups.member.memberSigning.room.number," +
		 								"memberInterestGroups.memRole," +
		 								"memberInterestGroups.status,"+
		 								"remarks",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
								
							}
						});
					},
					buttons:[{
    					id:"add",
						text:"新增",
						show:true,
						handler:function(){
							widget.get("form").reset();
							widget.get("membergrid").setData([]);
							widget.setTitle([]);
							widget.show([".J-membergrid",".J-form"]).hide([".J-grid"]);
							widget.get("subnav").hide(["add","type"]).show(["return","save"]);
							widget.get("subnav").setValue("search","");
							$(".J-subnav-search-search").addClass("hidden");
						}
					},{
    					id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide([".J-membergrid",".J-form"]).show([".J-grid"]);
							widget.get("subnav").show(["add","type"]).hide(["return","save"]);
							widget.get("form").setDisabled(false);
							widget.get("membergrid").setDisabled(false);
							$(".J-subnav-search-search").removeClass("hidden");
							$(".J-grid-membergrid-out").removeClass("hidden");
							$(".J-grid-membergrid-del").removeClass("hidden");
							
						}
					},{
    					id:"save",
						text:"保存",
						show:false,
						handler:function(){
							var data = widget.get("form").getData();
							if(!data.name){
								Dialog.alert({
									content : "请输入名称!"
								 });
								return false;
							}
							if(!data.type){
								Dialog.alert({
									content : "请输入类型!"
								 });
								return false;
							}
							if(data.users.length == 0){
								Dialog.alert({
									content : "请选择秘书负责人!"
								 });
								return false;
							}
							var datas =widget.get("membergrid").getData();
							var falg = false;
							if(datas.length == 0){
								Dialog.alert({
									content : "请添加成员!"
								 });
								return false;
							}else{
								for ( var i in datas) {
									if(datas[i].memRole.key == "Headman"){
										falg = true;
									}
								}
							}
							if(!falg){
								Dialog.alert({
									content : "请设置一位组长!"
								 });
								return false;
							}
							
							var list = [];
							for(var i in datas){
								list.push({
									pkMemberInterestGroup: datas[i].pkMemberInterestGroup || "",
									member : datas[i].member.pkMember,
									status : datas[i].status.key,
									memRole : datas[i].memRole.key,
									version : datas[i].version || ""
								});
							}
							data.list = list;
							aw.saveOrUpdate("api/interestgroup/save",aw.customParam(data),function(datas){
								widget.get("subnav").setValue("type",datas.type.key);
								$(".J-subnav-search-search").removeClass("hidden");
								widget.hide([".J-membergrid",".J-form"]).show([".J-grid"]);
								widget.get("subnav").show(["add","type"]).hide(["return","save"]);
								
								widget.get("grid").refresh({
									pkInterestGroup:datas.pkInterestGroup,
									fetchProperties:"pkInterestGroup," +
 	 								"name," +
 	 								"type," +
 	 								"users.pkUser," +
 	 								"users.name," +
 	 								"version," +
 	 								"memberInterestGroups.pkMemberInterestGroup," +
 	 								"memberInterestGroups.member.pkMember," +
 	 								"memberInterestGroups.member.personalInfo.name," +
 	 								"memberInterestGroups.member.personalInfo.birthday," +
 	 								"memberInterestGroups.member.personalInfo.sex," +
 	 								"memberInterestGroups.member.personalInfo.idType.value," +
 	 								"memberInterestGroups.member.personalInfo.idNumber," +
 	 								"memberInterestGroups.member.status," +
 	 								"memberInterestGroups.member.memberSigning.room.number," +
 	 								"memberInterestGroups.memRole," +
 	 								"memberInterestGroups.status,"+
 	 								"remarks"
									});
							});
						}
					}],
					buttonGroup:[{
    					id:"type",
    					tip:"类型",
    					showAll:true,
						showAllFirst:true,
    					items:enmu["com.eling.elcms.happiness.model.InterestGroup.Type"],
    					handler:function(key,element){
    						widget.get("subnav").setValue("search","");
    						widget.get("grid").refresh();
    					}
					}]
				}
        	 });
        	 this.set("subnav",subnav);
        	 var grid=new Grid({
        		parentNode:".J-grid",
 				model:{
 					url : "api/interestgroup/query",
 	 				params:function(){
 	 					return{
 	 						type:widget.get("subnav").getValue("type"),
 	 						fetchProperties:"pkInterestGroup," +
 	 								"name," +
 	 								"type," +
 	 								"users.pkUser," +
 	 								"users.name," +
 	 								"version," +
 	 								"memberInterestGroups.pkMemberInterestGroup," +
 	 								"memberInterestGroups.member.pkMember," +
 	 								"memberInterestGroups.member.personalInfo.name," +
 	 								"memberInterestGroups.member.personalInfo.birthday," +
 	 								"memberInterestGroups.member.personalInfo.sex," +
 	 								"memberInterestGroups.member.personalInfo.idType.value," +
 	 								"memberInterestGroups.member.personalInfo.idNumber," +
 	 								"memberInterestGroups.member.status," +
 	 								"memberInterestGroups.member.memberSigning.room.number," +
 	 								"memberInterestGroups.memRole," +
 	 								"memberInterestGroups.status,"+
 	 								"remarks"
 	 					}
 	 				},
 					columns:[{
 						name:"name",
 						label:"兴趣小组名称",
 						className:"twoColumn"
 					},{
 						name:"type.value",
 						label:"类型",
 						className:"oneHalfColumn"
 					},{
 						name:"memberInterestGroups",
 						label:"成员数",
 						className:"oneHalfColumn",
 						format:function(value,row){
 							var number = 0 ;
 							for ( var i in value) {
 								if(value[i].status.key =="Normal"){
 									number++;
 								}
							}
 							return "<a class='J-memberInterestGroups-detail' style='color:red;' data-key='"+row.pkInterestGroup+"' href='javascript:void(0);'>"+number+"</a>";
 						}
 					},{
 						name:"memberleader",
 						label:i18ns.get("sale_ship_owner","会员")+"负责人",
 						className:"twoColumn",
 						format:function(value,row){
 							var names = "";
 							for (var i in row.memberInterestGroups ) {
 								if (row.memberInterestGroups[i].memRole.key == "Headman") {
									names += row.memberInterestGroups[i].member.personalInfo.name+",";
								}
							}
 							return names.substr(0, names.length-1);
 						}
 					},{
 						name:"users",
 						label:"秘书负责人",
 						className:"twoColumn",
 						format:function(value,row){
 							var names = "";
 							for (var i in value ) {
									names += value[i].name+",";
							}
 							return names.substr(0, names.length-1);
 						}
 					},{
						name : "remarks",
						label : "备注",
						className:"twoColumn",	
						
					},{
 						name:"operate",
 						label:"操作", 
 						className:"twoColumn",
 						format:"button",
 						formatparams:[{
 							id:"edit",
 							icon:"icon-edit",
 							handler:function(index,data,rowEle){
 								var cloneData = $.extend(true,{},data);
 								widget.show([".J-membergrid",".J-form"]).hide([".J-grid"]);
 								widget.get("subnav").hide(["add","type"]).show(["return","save"]);
 								$(".J-subnav-search-search").addClass("hidden");
 								widget.get("membergrid").setDisabled(false);
 								widget.get("form").setData(cloneData);
 								widget.setTitle(cloneData.memberInterestGroups);
								widget.compare(cloneData.memberInterestGroups);
 								widget.get("membergrid").setData(cloneData.memberInterestGroups);
 							}
 						},{
 							id:"delete",
 							icon:"icon-remove",
 							handler:function(index,data,rowEle){
 								aw.del("api/interestgroup/" + data.pkInterestGroup + "/delete",function(data){
 									widget.get("grid").refresh();
 								});
 							}
 						}]
 					}]
 				}
        	 });
        	this.set("grid",grid);
        	
        	var form=new Form({
        		parentNode:".J-form",
				model:{
					id:"interestgroupform",
					defaultButton:false,
					items:[{
						name:"pkInterestGroup",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"兴趣小组名称",
						validate:["required"],
						exValidate: function(value){
							if(value.length>15){
								return "不能超过15个字符";
							}else{
								return true;
							}
						}
					},{
						name:"type",
						label:"类型",
						type:"select",
						options:enmu["com.eling.elcms.happiness.model.InterestGroup.Type"],
						validate:["required"]
					},{
						name:"users",
						label:"秘书负责人",
						key:"pkUser",
						value:"name",
						url:"api/users/nofreeze",//TODO 用户角色：wulina
        				params:{
							fetchProperties:"pkUser,name",
						}, 
						type:"select",
						validate:["required"],
						multi:true
					},{
						name : "remarks",
						label : "备注",
						className:"twoColumn",	
						type:"textarea"
					}]
				  }
        	});
        	this.set("form",form);
        	
        	var membergrid=new EditGrid({
         		parentNode:".J-membergrid",
         		autoRender:false,
  				model:{
  					id : "membergrid",
  					columns:[{
  						name:"member.personalInfo.name",
  						label:i18ns.get("sale_ship_owner","会员"),
  						format:function(value,row){
  							return row.member.personalInfo.name+"-"+row.member.memberSigning.room.number
  						},
  						editor : {
							type : "autocomplete",
							// url : "api/member/search",
                            url : "api/lifemodelmember/querymember",
							params : function(){
								return {
									searchProperties:"personalInfo.name,memberSigning.room.number",
									statusIn:"Normal,Out,Nursing,Behospitalized,NursingAndBehospitalized",
									fetchProperties:
										"pkMember," +
										"status," +
										"personalInfo.name," +
										"personalInfo.sex," +
										"personalInfo.idType.value," +
										"personalInfo.idNumber,"+
										"personalInfo.birthday,"+
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
								var oldDatas = membergrid.getData();
								
								var curMember = plugins["member.personalInfo.name"].getData();
								
								var validateRet = widget.memberValidate(curMember,oldDatas)
								
								if(validateRet){
									membergrid.add({
										memRole : {
											key : "Leaguer",
											value : "成员"
										},
										status : {
											key : "Normal",
											value : "已加入"
										},
										member : curMember
									});
									
									var newDatas = membergrid.getData();
									widget.setTitle(newDatas);
									widget.compare(newDatas);
									return true;
								}
								return false;
							},
							onEdit : function(editor,rowIndex,rowData){
								editor.setData(rowData.member);
							},
							onChange : function(editor,rowIndex,rowData){
								//仅进行视图操作
								var curMember = editor.getData();
								if(widget.memberValidate(curMember,membergrid.getData())){
									//更新模型
									rowData.member = editor.getData();
									membergrid.update(rowIndex,rowData);
								}else{
									//恢复之前的值
									editor.setData(rowData.member);
								}
								widget.compare(membergrid.getData());
							}
						}
  					},{
  						name:"member.personalInfo.sex.value",
  						label:"性别"
  					},{
  						name:"member.personalInfo.idType.value",
  						label:"证件类型"
  					},{
  						name:"member.personalInfo.idNumber",
  						label:"证件号码"
  					},{
  						name:"member.personalInfo.birthday",
  						label:"年龄",
  						format : "age",
  					},{
  						name:"member.status.value",
  						label:i18ns.get("sale_ship_owner","会员")+"状态"
  					},{
						name : "memRole.value",
						label : "角色",
						editor : {
							name : "memRole",
							type : "select",
							options :enmu["com.eling.elcms.happiness.model.MemberInterestGroup.MemRole"],
							onBeforeEdit : function(data){
								if(data.status.key =="Close"){
									Dialog.alert({
										content : "该"+i18ns.get("sale_ship_owner","会员")+"已退出，不能修改角色!"
									 });
									return false;
								}else{
									return true;
								}
							},
							onEdit : function(editor,rowIndex,rowData){
								editor.setValue(rowData.memRole.key);
							},
							onChange : function(editor,rowIndex,rowData){
								if(editor.getValue()){
									membergrid.setText(rowIndex,"memRole.value",editor.getText());
									rowData.memRole = {
											key : editor.getValue(),
											value : editor.getText()
										}
									widget.compare(membergrid.getData());
									
								}else{
									Dialog.alert({
										content : "请选择角色!"
									 });
									return false;
								}
							}
						}
					},{
						name:"status.value",
  						label:"状态"
					},{
  						name:"operate",
  						label:"操作", 	
  						format:"button",
  						formatparams:[{
  							id:"out",
  							text:"退出",
  							show:function(value,row){
  								if(row.status.value == "已加入"){
  									return true;
  								}else{
  									return false;
  								}
  							},
  							handler:function(index,data,rowEle){
  								//更改数据集
  								data.status = {
  									key : "Close",
  									value : "已退出"
  								};
  								data.memRole = {
  	  									key : "Leaguer",
  	  									value : "成员"
  	  								};
  								//设置单元格
  								membergrid.setText(index,"status.value","已退出");
  								//隐藏和显示对应按钮
  								rowEle.find(".J-grid-membergrid-join").show();
  								rowEle.find(".J-grid-membergrid-out").hide();
  								widget.compare(membergrid.getData());
  								widget.setTitle(membergrid.getData());
  							}
  						},{
  							id:"join",
  							text:"加入",
  							show:function(value,row){
  								if(row.status.value == "已退出"){
  									return true;
  								}else{
  									return false;
  								}
  							},
  							handler:function(index,data,rowEle){
  								//更改数据集
  								data.status = {
  									key : "Normal",
  									value : "已加入"
  								};
  								//设置单元格
  								membergrid.setText(index,"status.value","已加入");
  								//隐藏和显示对应按钮
  								rowEle.find(".J-grid-membergrid-out").show();
  								rowEle.find(".J-grid-membergrid-join").hide();
  								//统计
  								widget.compare(membergrid.getData());
  								widget.setTitle(membergrid.getData());
  							}
  						},{
  							id:"del",
  							text:"删除",
  							handler:function(index,data,rowEle){
  								membergrid.remove(rowEle);
  								widget.setTitle(membergrid.getData());
  							}
  						}]
  					}]
  				}
         	 });
         	this.set("membergrid",membergrid);
        	
         },
         setTitle:function(datas){
         	var normal = 0;
         	var out = 0;
 			for(var  i in datas){
 				if(datas[i]){
 					if(datas[i].status.value =="已加入"){
 						normal++;
 					}
 				}
 			}
 			this.get("membergrid").setTitle("成员名单："+normal+"人");
 		
         },
         compare:function(datas){
        	 for ( var i in datas) {
        		 if(datas[i].status.key =="Normal"){
        			 datas[i].compare = 1;
        		 }else{
        			 datas[i].compare = 2;
        		}
        		 if(datas[i].memRole.key =="Headman") {
        			datas[i].compare += 1
         		}else if(datas[i].memRole.key =="DeputyHeadman"){
         			datas[i].compare += 2
         		}else if(datas[i].memRole.key =="Leaguer"){
         			datas[i].compare += 3
         		}
			}
        	datas= datas.sort(function(a,b){
        		return a.compare- b.compare;
        	 });
        	this.get("membergrid").setData(datas);
         },
         memberValidate:function(member,datas){
				for ( var i in datas) {
					if(member.pkMember  == datas[i].member.pkMember){
						Dialog.alert({
							content : "该"+i18ns.get("sale_ship_owner","会员")+"已存在!"
						 });
						return false;
					}
				}
				return true;
         },
	});		
	module.exports = interestgroup;
});