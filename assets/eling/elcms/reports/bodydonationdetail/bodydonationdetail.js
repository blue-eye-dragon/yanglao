define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Form=require("form");
	var emnu = require("enums");
	var store = require("store");
	var activeUser = store.get("user");
	var Dialog = require("dialog");
	require("../../grid_css.css");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-form hidden' ></div>";
	var Service = ELView.extend({
		attrs:{
            template:template
		},
		initComponent:function(params,widget){
			var subnav = new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"遗体捐赠服务会员名单",
					items : [{
						id:"building",
   						tip:"楼宇",
   						type:"buttongroup",
   						keyField : "pkBuilding",
						valueField : "name",
						url : "api/building/query",
						params : function(){
							return {
								"useType":"Apartment",
								fecthProperties:"pkBuilding,name"
							};
						},
   						showAll:true,
   						showAllFirst:true,
   						handler:function(key,element){
   							
   							widget.get("grid").refresh();
   						}
					},{
						id : "status",
						type:"buttongroup",
						tip : "状态",
						items:[{
							key:"Finish",
							value:"结束"
							
						},{
							key:"Consult",
							value:"咨询"
						},{
							key:"Submitted",
							value:"已提交"
						},{
							key:"Managed",
							value:"已办理"
						},{
							key:"",
							value:"全部"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},
					
					{
						id : "consultDate",
						tip : "咨询日期",
						type : "daterange",
						ranges : {
							"本年": [moment().startOf("year"), moment().endOf("year")],
   					 		"去年": [moment().subtract(1,"year").startOf("year"),moment().subtract(1,"year").endOf("year")],
						},
						defaultRange : "本年",
						minDate: "1930-05-31",
						maxDate: "2020-12-31",
						handler : function(time){
							widget.get("grid").refresh();
						},
						
					},

					
					
					{
                        id : "toexcel",
   						type:"button",
                        text : "导出",
                        handler : function(){
                        	var subnav=widget.get("subnav");
                        	window.open("api/report/bodydonation/toexcel?consultDate="+widget.get("subnav").getValue("consultDate").start
                        			+ "&consultDateEnd="+widget.get("subnav").getValue("consultDate").end+ "&member.memberSigning.room.building.pkBuilding="+subnav.getValue("building")+"&status="+widget.get("subnav").getValue("status")); 

                        	return false;
                        }} ,
                      {
						id : "return",
						type : "button",
						text : "返回",
						show : false,
						handler : function(){
							widget.get("subnav").show(["search","add","building","status","consultDate"]).hide(["return"]);
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("grid").refresh();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url : "api/bodydonation/query",
					params:function(){
						var subnav=widget.get("subnav");
						return{
							"member.memberSigning.room.building.pkBuilding":subnav.getValue("building"),
							"status":subnav.getValue("status"),
							"consultDate": subnav.getValue("consultDate").start,
							"consultDateEnd":subnav.getValue("consultDate").end,
							fetchProperties:
							"pkBodyDonation,"+
							"member.personalInfo.name,"+
							"member.personalInfo.sex,"+
							"member.personalInfo.age,"+
							"member.personalInfo.phone,"+
							"status.value,"+
							"consultDate,"+
							"member.pkMember,"+
							"member.personalInfo.name,"+
							"member.personalInfo.birthday,"+
							"deceasedRegister.deceasedDate,"+								
							"member.memberSigning.room.number,"+
							"firstPerson,"+
							"firstPhone,"+
							"secondPerson,"+
							"secondPhone,"+
							"thirdPerson,"+
							"thirdPhone,"+
							"proxy,"+
							"proxy.value,"+
							"status,"+
							"consultDate,"+
							"processor,"+
							"processDate,"+
							"description,"+
					
							"deceasedRegister.deceasedDate,"+
							"deceasedRegister.pkDeceasedMemberRegistration,"+
							"member.personalInfo.birthdayString,"+
							"member.personalInfo.idNumber,"+
							"version"
							
						}
					},
					columns : [{
						name : "member",
						label : "姓名",
						format:function(value,row){
                        	return value.memberSigning.room.number+" "+value.personalInfo.name;
                        },
                        className:"oneColumn",
						
					},{
						name : "member.personalInfo.sex.value",
						label : "性别",
						className:"halfColumn",
						
					},{
						name : "member.personalInfo.birthday",
						label : "年龄",
						format : "age",
						className:"halfColumn",	
					},
					
					
					{
						name : "consultDate",
						label : "咨询日期",
						format : "date",
						className:"oneColumn",
					},
					
					
					{
						name : "firstPerson",
						label : "第一执行人",						
						className:"oneColumn",
					},
					
					{
						name : "firstPhone",
						label : "联系电话",
						className:"halfColumn",
					},
					
					
					{
						name : "secondPerson",
						label : "第二执行人",						
						className:"oneColumn",
					},
					
					
					{
						name : "secondPhone",
						label : "联系电话",
						className:"halfColumn",
					},
					
					{
						name : "thirdPerson",
						label : "第三执行人",						
						className:"oneColumn",
					},
					
					
					{
						name : "thirdPhone",
						label : "联系电话",
						className:"halfColumn",
					},{
						name : "proxy",
						label : "委托书",
						format:function(value,row){
                        	if(value ==false){
                        		return "无" ;
                        	}else{
                        	return "有";
                        	}
							
                        },
                        className:"halfColumn",
					},{
						name : "deceasedRegister.deceasedDate",
						label : "过世日期",
						format : "date",
						className:"oneColumn",	
					},
					
					{
						name : "status.value",
						label : "状态",			
						className:"halfColumn",	
					},
					
					
					{
						name : "description",
						label : "备注",			
						className:"halfColumn",	
					},
								

				]
				}
			});
			this.set("grid",grid);
			var form = new Form({
				parentNode:".J-form",
					saveaction : function(){
						aw.saveOrUpdate("api/bodydonation/save",aw.customParam(form.getData()),function(data){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").hide(["return"]).show(["search","add","building","status","consultDate"]);
							widget.get("grid").refresh();
						});
                    },
                    cancelaction : function(){
                    	widget.show([".J-grid"]).hide([".J-form"]);
						widget.get("subnav").hide(["return"]).show(["search","add","building","status","consultDate"]);
						widget.get("grid").refresh();
						
						
                    },
                    model : {
    					id : "bodydonation",
                    items : [{
                    	name : "pkBodyDonation",
						type : "hidden"
                    },{
                    	name : "version",
                    	defaultValue : "0",
						type : "hidden"
                    },{
						name:"member",
    					label:"姓名",
    					type:"autocomplete",
    					url:"api/member/query",
						keyField:"pkMember",
						queryParamName : "s",
						useCache:false,
						maxItemsToShow:10,
						params:function(){
							return{
								searchProperties : "personalInfo.name",
								fetchProperties:
										"personalInfo.pkPersonalInfo," +
										"personalInfo.name," +		
								        "personalInfo.sex," +
										"personalInfo.birthdayString,"+
										"personalInfo.idNumber,"+
										"personalInfo.phone,"+
										"pkMember,"	+								
										"memberSigning.room.number",
							}
						},
						
						format : function(data){//格式化返回的结果
							if(data!=null){
								return data.memberSigning.room.number+" "+data.personalInfo.name;
							}
						},
						onItemSelect : function(data){//选择结果后的触发事件
							if(data){
								form.setValue("sex",data.personalInfo.sex.value);
								form.setValue("age",moment().diff(data.personalInfo.birthdayString, 'years'));
								form.setValue("idNumber",data.personalInfo.idNumber);
								form.setValue("phone",data.personalInfo.phone);
								

								
								//form.setValue("deceasedDate",data.deceasedmemberregistration.deceasedDate);
								
								
							}
							aw.ajax({
								url:"api/memberDeceases/query",
								data:{
									"member.pkMember":data.pkMember,
									flowStatus:"Confirm",
							        fetchProperties:"member.pkMember," +
							        "deceasedDate,"+"pkDeceasedMemberRegistration"
								},
								dataType:"json",
								success:function(data){
									if(data[0].deceasedDate!=null){
										form.setValue("deceasedDate",data[0].deceasedDate);
										form.setValue("deceasedRegister",data[0].pkDeceasedMemberRegistration);
										
									}
								}
							});
						},
    			    		validate:["required"],
					},{
						name:"sex",
    					label:"性别",	
    					readonly : true,   	
    					
					},{
						name:"age",
    					label:"年龄",	
    					readonly : true,
					},{
						name:"idNumber",
    					label:"证件号",	
    					readonly : true,
					},{
						name:"phone",
    					label:"会员联系电话",	
    					readonly : true,
					},{
                    	name : "firstPerson",
                    	label : "第一执行人",
                    },{
                    	name : "firstPhone",
						label : "联系电话",
                    },{
                    	name : "secondPerson",
                    	label : "第二执行人",
                    },{
                    	name : "secondPhone",
						label : "联系电话",
                    },{
                    	name : "thirdPerson",
                    	label : "第三执行人",
                    },{
                    	name : "thirdPhone",
						label : "联系电话",
                    },{
                    	name : "proxy",
                    	label : "委托书",	
                    	type : "radio",
                    	  list : [{
                              key : "true",
                              value : "有"
                          },{
                              key : "false",
                              value : "无"
                          }],
                    	validate : ["required"]
                    },{
                    	name : "status",
                    	label : "状态",
                    	type : "select",
                    	defaultValue:{
							key:"Consult",
							value:"咨询"
						},
						readonly : true,
                    },{
                    	name : "consultDate",
						label : "咨询日期",
	                    type : "date",
	                    defaultValue : moment().valueOf(),
                    },{
	                    name:"deceasedDate",
    					label:"过世日期",
    					type:"date",
						mode:"YYYY-MM-DD",
						readonly:"true"
										
                    },{
                    	name : "deceasedRegister",
						type : "hidden"
                    },{
	                    name : "processor",
						label : "处理人",
						keyField : "pkUser",
	    				url : "api/users",
	    				params:{
							fetchProperties:"pkUser,name"
						},
						valueField : "name",
						type : "select",	
						readonly : true,
                    },{
                    	name : "processDate",
						label : "处理时间",
	                    type : "date",
	                    readonly : true,
	                    defaultValue : moment().valueOf(),
						validate : ["required"],
                    },{
	   					name : "description",
						label : "备注",
						type : "textarea",
                    }]
				}
			});
			this.set("form",form);
		},
	});
	module.exports = Service;
});
