/**
 * 表扬信管理
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Grid=require("grid-1.0.0");
	var Form=require("form");
	var emnu = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-form hidden' ></div>";
	var praise = ELView.extend({
		attrs:{
            template:template
		},
		events : {
			"change .J-form-praiseform-date-receiveDate" : function(e){
				var form = this.get("form");
				var receiveDate = form.getValue("receiveDate");
				if(receiveDate>moment()){
					Dialog.alert({
						content:"收信时间不能晚于今天！"
					});
					form.setValue("receiveDate",moment().valueOf());
					return;
				}
			}
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"表扬信",
					search : {
						placeholder : "请输入"+i18ns.get("sale_ship_owner","会员")+"/房间号",
						handler : function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/praise/search",
								data:{
									s:str,
									properties:"members.personalInfo.name,members.memberSigning.room.number",
			                        fetchProperties:"members.pkMember,"+
													"members.personalInfo.name,"+
													"members.memberSigning.room.number,"+
													"involvePerson,"+
													"department.pkDepartment,"+
													"department.name,"+
													"supplier.pkSupplier,"+
													"supplier.name,"+
													"synopsis,"+
													"praiseType,"+
													"receiveDate,"+
													"content,"+
													"number,"+
													"description,"+
													"operator.pkUser,"+
													"operator.name,"+
													"writeDate,"+
													"pkPraise,"+
													"version",
				                    
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						},
					},
					buttonGroup:[{
   						id:"building",
   						tip:"楼宇",
   						showAll:true,
   						showAllFirst:true,
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					},{
   						id:"praiseType",
   						tip:"表扬类别",
   						items:[{
   							key:"PraiseLetter,VerbalPraise,Pennants",
                            value:"全部"
                        },{
   		                    key:"PraiseLetter",
   		                    value:"表扬信"
   						},{
   							key:"VerbalPraise",
   							value:"口头表扬"
   						},{
   							key:"Pennants",
   							value:"锦旗"
   						}],
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					},{
   						id:"department",
   						tip:"部门",
   						showAll:true,
   						showAllFirst:true,
   						key:"pkDepartment",
						value:"name",
						url:"api/department/query",
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					},{
   						id:"supplier",
   						tip:"服务商",
   						showAll:true,
   						showAllFirst:true,
   						key:"pkSupplier",
						value:"name",
						url:"api/supplier/query",
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
   					}],
   					time:{
						tip:"收信日期",
						ranges:{
							"本月": [moment().startOf("month"), moment().endOf("month")],
							"本年": [moment().startOf("year"), moment().endOf("year")],
						},
						defaultTime:"本年",
						click:function(time){
							widget.get("grid").refresh();
						}
   					},
   					buttons:[{
   						id:"add",
						text:"新增",
						show:true,
						handler:function(){
							var forms = widget.get("form");
							forms.reset();
							var userSelect=forms.getData("operator","");
							userSelect.push(activeUser);
							forms.setData("operator",userSelect);
							forms.setValue("operator",activeUser);
							forms.setDisabled("operator",true);
							widget.get("subnav").show(["return"]).hide(["toExcel","time","supplier","department","praiseType","building","add","search"]);
							widget.show(".J-form").hide(".J-grid");
						}
   					},{
   						id:"toExcel",
						text:"导出",
						show:true,
						handler:function(){
							var subnav=widget.get("subnav");
							window.open("api/praise/toexcel?praiseTypeIn="+subnav.getValue("praiseType")+
									"&department="+subnav.getValue("department")+
									"&supplier="+subnav.getValue("supplier")+
									"&receiveDate="+subnav.getValue("time").start+
									"&receiveDateEnd="+subnav.getValue("time").end+
									"&pkBuilding="+subnav.getValue("building"));
							return false;
						}
   					},{
   						id:"return",
   						text:"返回",
   						show:false,
   						handler:function(){
   							widget.get("subnav").hide(["return"]).show(["toExcel","time","supplier","department","praiseType","building","add","search"]);
							widget.hide(".J-form").show(".J-grid");
   						}
   					}]
				}
				
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
				url:"api/praise/query",
				fetchProperties:"members.pkMember,"+
								"members.personalInfo.name,"+
								"members.memberSigning.room.number,"+
								"involvePerson,"+
								"department.pkDepartment,"+
								"department.name,"+
								"supplier.pkSupplier,"+
								"supplier.name,"+
								"synopsis,"+
								"praiseType,"+
								"receiveDate,"+
								"content,"+
								"number,"+
								"description,"+
								"operator.pkUser,"+
								"operator.name,"+
								"writeDate,"+
								"pkPraise,"+
								"version",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						"praiseTypeIn":subnav.getValue("praiseType"),
						"department":subnav.getValue("department"),
						"supplier":subnav.getValue("supplier"),
						"receiveDate":subnav.getValue("time").start,
						"receiveDateEnd":subnav.getValue("time").end,
						"pkBuilding":subnav.getValue("building")
					};
				},
				model:{
					columns:[{
						key:"receiveDate",
						name:"收信日期",
						format:"date",
					},{
						key:"members",
						name: i18ns.get("sale_ship_owner","会员")+"姓名",
						format:function(value,row){
							var name= "";
							if(value.length>0){
								for(var i =0 ;i<value.length;i++){
									if(i<value.length-1){
										name+= value[i].memberSigning.room.number+" "+value[i].personalInfo.name+"、";
									}else{
										name+= value[i].memberSigning.room.number+" "+value[i].personalInfo.name;
									}
								}
							}else{
								name="无";
							}
							return name;
						},
						col:2
					},{
						key:"synopsis",
						name:"内容提要",
						col:2
					},{
						key:"involvePerson",
						name:"提及人员",
						col:2
					},{
						key:"department.name",
						name:"所属部门"
					},{
						key:"supplier.name",
						name:"所属服务商"
					},{
						key:"praiseType.value",
						name:"表扬类别"
					},{
						key:"operate",
						className:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								var form = widget.get("form");
								form.setData(data);
								var userSelect=form.getData("operator","");
								userSelect.push(activeUser);
								form.setData("operator",userSelect);
								form.setValue("operator",activeUser); 
								form.setDisabled("operator",true);
								widget.get("subnav").show(["return"]).hide(["toExcel","time","supplier","department","praiseType","building","add","search"]);
								widget.show(".J-form").hide(".J-grid");
							}
						},{
							key:"delete",	
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/praise/" + data.pkPraise + "/delete",function(){
									widget.get("grid").refresh();
								});
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var form = new Form({
				parentNode:".J-form",
				saveaction:function(){
					aw.saveOrUpdate("api/praise/save",aw.customParam(form.getData()),function(data){
						widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("subnav").hide(["return"]).show(["toExcel","time","supplier","department","praiseType","building","add","search"]);
						widget.get("grid").refresh();
					});
				},
				cancelaction:function(){
					widget.get("subnav").hide(["return"]).show(["toExcel","time","supplier","department","praiseType","building","add","search"]);
					widget.hide(".J-form").show(".J-grid");
				},
				model:{
					id:"praiseform",
					items:[{
						name:"pkPraise",
						type:"hidden",
					},{
						name:"version",
						type:"hidden",
						defaultValue:0
						
					},{
						name:"receiveDate",
    					label:"收信日期",
    					type:"date",
    					validate:["required"],
					},{
						name:"members",
    					label: i18ns.get("sale_ship_owner","会员")+"姓名",
    					type:"select",
    					url:"api/member/query",
    					keyField:"pkMember",
//    					valueField:option,
    					multi : true,
    					params : function(){
                            return {
                            	statusIn:"Normal,Out,Nursing,Behospitalized,Waitting,NotLive,NursingAndBehospitalized",
                            	fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number",
                            };
                        },
                        format:function(data,value){
                        	return data.memberSigning.room.number+" "+data.personalInfo.name;
                        },
    					validate:["required"],
					},{
						name:"synopsis",
    					label:"内容提要",
    					type : "textarea",
    					validate:["required"],
    					exValidate: function(value){
							if(value.length>510){
								return "不能超过500个字符";
							}else{
								return true;
							}
						}
					},{
						name:"praiseType",
    					label:"表扬类别",
						options:emnu["com.eling.elcms.life.model.Praise.PraiseType"],
						type:"select",
    					validate:["required"],
					},{
						name:"involvePerson",
    					label:"提及人员",
    					validate:["required"],
					},{
						name:"department",
    					label:"所属部门",
    					type:"select",
    					url : "api/department/query",
    					key:"pkDepartment",
    					value:"name",
                        params : function(){
                            return {
                            	fetchProperties:"pkDepartment,"+"name",
                            };
                        },
					},{
						name:"supplier",
    					label:"所属服务商",
    					type:"select",
    					url : "api/supplier/query",
    					key:"pkSupplier",
    					value:"name",
                        params : function(){
                            return {
                            	fetchProperties:"pkSupplier,"+"name",
                            };
                        },
					},{
						name:"number",
    					label:"存档编号",
    					validate:["required"],
    					exValidate: function(value){
							if(value.length>15){
								return "不能超过15个字符";
							}else{
								return true;
							}
						}
					},{
						name:"content",
    					label:"表扬内容",
    					type : "textarea",
    					validate:["required"],
    					exValidate: function(value){
							if(value.length>510){
								return "不能超过500个字符";
							}else{
								return true;
							}
						}
					},{
						name:"description",
    					type : "textarea",
    					label:"备注",
    					exValidate: function(value){
							if(value.length>510){
								return "不能超过500个字符";
							}else{
								return true;
							}
						}
					},{
						name:"operator",
						label:"记录人",
						type:"select",
						key:"pkUser",
						value:"name",
						readonly:true,
						validate:["required"],
					},{
						name:"writeDate",
    					label:"记录日期",
    					type:"date",
    					defaultValue:moment().valueOf(),
//    					readonly:true
					}]
				}
			});
			this.set("form",form);
		},
		afterInitComponent:function(params,widget){
			
		}
	});
	module.exports = praise;
})