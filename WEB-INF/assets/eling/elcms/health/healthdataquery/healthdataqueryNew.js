define(function(require, exports, module) {
	var ElView=require("elview");
    var aw = require("ajaxwrapper");
    var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
		//多语
	var i18ns = require("i18n");
	var template="<div class='el-healthdataquery'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-card '></div>"+
	"<div class='J-list'></div>"+
	"</div>";
	var Healthdataquery = ElView.extend({
		attrs:{
    		template:template
        },
        events:{
        	"change .J-form-healthDataQuery-select-building":function(e){
        		var widget = this;
        		var  pkbuilding  = widget.get("card").getValue("building"); 
        		if(pkbuilding){
        			this.get("card").load("member");
        		}else{
        			widget.get("card").setValue("member",{}); 
        			widget.get("card").setData("member",[]); 
        		}
        	},
        	"change .J-form-healthDataQuery-select-type":function(e){
        		var widget = this;
        		var  pktype  = widget.get("card").getValue("type"); 
        		if(pktype){
        			widget.get("card").load("names");
        		}else{
        			widget.get("card").setValue("names",{});
        			widget.get("card").setData("names",[]); 
        			
        		}
        		widget.get("card").hide(["max","min"]);
    			widget.get("card").setValue("max","");
    			widget.get("card").setValue("min","");
        	},
        	"change .J-form-healthDataQuery-select-names":function(e){
        		var widget = this;
        		var  pknames  = widget.get("card").getValue("names"); 
        		if(pknames){
        			widget.get("card").show(["max","min"]);
        		}else{
        			widget.get("card").hide(["max","min"]);
        			widget.get("card").setValue("max","");
        			widget.get("card").setValue("min","");
        		}
        	},
        	"blur .J-form-healthDataQuery-date-createDateEnd":function(e){
				var form=this.get("card");
				var createDateEnd = form.getValue("createDateEnd");
				if(createDateEnd >= moment()._i){
					Dialog.alert({
						content:"结束日期必须是当前日期之前！"
					});
					form.setValue("createDateEnd",moment().endOf("days").valueOf());
					return false;
				}
				var createDate = form.getValue("createDate");
				if(createDateEnd <= createDate){
					Dialog.alert({
						content:"结束日期必须大于开始日期"
					});
					form.setValue("createDateEnd",moment().endOf("days").valueOf());
				}
			},
			"blur .J-form-healthDataQuery-date-createDate":function(e){
				var form=this.get("card");
				var createDateEnd = form.getValue("createDateEnd");
				var createDate = form.getValue("createDate");
				if(createDateEnd <= createDate){
					Dialog.alert({
						content:"结束日期必须大于开始日期"
					});
					form.setValue("createDate",moment());
				}
			}
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
						title:"健康数据查询",
						buttons:[{
							id:"comfirm",
							text:"确定",
							handler:function(){
			            		var card =widget.get("card");
			            		var inParams=widget.get("params");
			            		var data={};
			            		data.createDate=card.getValue("createDate");
			            		data.createDateEnd=moment(card.getValue("createDateEnd")).endOf("days").valueOf();
			            		if(!data.createDate){
			            			Dialog.alert({
										content:"请输入开始时间！"
						    		});
			            			card.setValue("createDate",moment().subtract(3, 'months').valueOf());
									return;
			            		}
			            		if(!data.createDateEnd){
			            			Dialog.alert({
										content:"请输入结束时间！"
						    		});
			            			card.setValue("createDateEnd",moment().endOf("days").valueOf());
									return;
			            		}
			            		if(moment(data.createDateEnd).diff(data.createDate,"months")>3){
			            			Dialog.alert({
										content:"最多查询3个月区间的数据！"
						    		});
			            			card.setValue("createDate",moment().subtract(3, 'months').valueOf());
			            			card.setValue("createDateEnd",moment().endOf("days").valueOf());
									return;
			            		}
			            		$(".J-card").hide();
			            		data.member={};
			            		data.member.memberSigning={};
			            		data.member.memberSigning.room={};
			            		data.member.memberSigning.room.building={};
			            		data.type={};
			            		if(card.getValue("building")){
			            			if(inParams&&inParams.buildname){
			            				data.member.memberSigning.room.building.pkBuilding=inParams.pkBuilding;
			            			}else{
			            				data.member.memberSigning.room.building.pkBuilding=card.getValue("building");
			            			}
			            		}
			            		if(card.getValue("member")){
			            			if(inParams&&inParams.membername){
			            				data.member.pkMember=inParams.pkMember;
			            			}else{
			            				data.member.pkMember=card.getValue("member");
			            			}
			            		}
			            		data.type.pkHealthExamDataType=card.getValue("type");
			            		var  name = card.getValue("names");
			            		var  names = card.getData("names",{
			            			pk:name
			            			});
			            		if(name=="name1"){
			            			data.type.name1=names.value;
			            			if(card.getValue("max")){
			            				data.value1End=card.getValue("max");
			            			}
			            			if(card.getValue("min")){
			            				data.value1=card.getValue("min");
			            			}
			            		}else if(name=="name2"){
			            			data.type.name2=names.value;
			            			if(card.getValue("max")){
			            				data.value2End=card.getValue("max");
			            			}
			            			if(card.getValue("min")){
			            				data.value2=card.getValue("min");
			            			}
			            		}else if(name=="name3"){
			            			data.type.name3=names.value;
			            			if(card.getValue("max")){
			            				data.value3End=card.getValue("max");
			            			}
			            			if(card.getValue("min")){
			            				data.value3=card.getValue("min");
			            			}
			            		}else if(name=="name4"){
			            			data.type.name4=names.value;
			            			if(card.getValue("max")){
			            				data.value4End=card.getValue("max");
			            			}
			            			if(card.getValue("min")){
			            				data.value4=card.getValue("min");
			            			}
			            		}
			            		else if(name=="name5"){
			            			data.type.name5=names.value;
			            			if(card.getValue("max")){
			            				data.value5End=card.getValue("max");
			            			}
			            			if(card.getValue("min")){
			            				data.value5=card.getValue("min");
			            			}
			            		}
			            		else if(name=="name6"){
			            			data.type.name6=names.value;
			            			if(card.getValue("max")){
			            				data.value6End=card.getValue("max");
			            			}
			            			if(card.getValue("min")){
			            				data.value6=card.getValue("min");
			            			}
			            		}
			            		data.fetchProperties="createDate,description,value1,value2,value3,value4,value5,value6,member.memberSigning.room.number,member.personalInfo.name,type.name",
			            		widget.get("list").loading();
			            		aw.ajax({
			            			url : "api/healthexamdata/healthexamdataquery",
			             			dataType : "json",
			            			data : aw.customParam(data),
			            			success : function(data){
			            					widget.get("list").setData(data);
//			            				}
			            				
			            			}
			            		});
							}
						},{
							id:"toggle",
							text:"条件▲",
							handler:function(){
								 $(".J-card").toggle();
								 if($(".J-btn-toggle").val()=="条件▲"){
									 $(".J-btn-toggle").val("条件▼");
								 }else if($(".J-btn-toggle").val()=="条件▼"){
									 $(".J-btn-toggle").val("条件▲");
								 }
							}
						}]
						}
				});
		this.set("subnav",subnav);
		
		var	list = new Grid({
				parentNode:".J-list",
    			autoRender:false,
 				model : {
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
					},{
						key:"createDate",
						name:"测量日期",
						format:"date"
					},{
						key:"type.name",
						name:"健康数据类型",
					},{
						key:"description",
						name:"测量值",
					}]
 				}
			});
			this.set("list",list);
			
			var card = new Form({
				parentNode:".J-card",
				model:{
					id:"healthDataQuery",
					defaultButton:false,
					items:[{
						name:"building",
						label:"楼号",
						url:"api/building/query",
						key:"pkBuilding",
						value:"name",
						defaultValue:params?params.buildname:"",
						params:function(){
							return {
								"useType":"Apartment",
								fetchProperties:"pkBuilding,name"
							};
						},
						type:params?"text":"select",
						readonly:params?true:false,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/query",
						key:"pkMember",
						value:"personalInfo.name",
						lazy:params?false:true,
						defaultValue:params?params.membername:"",
						params:function(){
							return {
								"memberSigning.room.building.pkBuilding":widget.get("card").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name"
							};
						},
						type:params?"text":"select",
						readonly:params?true:false,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"createDate",
						label:"开始日期",
						type:"date",
						defaultValue:moment().subtract(3, 'months').valueOf(),
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"createDateEnd",
						label:"结束日期",
						type:"date",
						mode:"Y-m-d",
						defaultValue:moment().endOf("days").valueOf(),
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"type",
						label:"健康类别",
						url:"api/healthexamdatatype/query",
						key:"pkHealthExamDataType",
						value:"name",
						params:function(){
							return {
								fetchProperties:"pkHealthExamDataType,name"
							};
						},
						type:"select",
						validate:["required"],
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"names",
						label:"指标",
						url:"api/healthexamdatatype/queryNames",
						key:"name",
						value:"value",
						lazy:true,
						params:function(){
							return {
								pkHealthExamDataType:widget.get("card").getValue("type"),
							};
						},
						type:"select",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"max",
						label:"最大值",
						defaultValue:null,
						show:false,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					},{
						name:"min",
						label:"最小值",
						defaultValue:null,
						show:false,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
					}]
				}
           
			});
			this.set("card",card);
		},
		afterInitComponent:function(params,widget){
			if(params&&params.buildname){
				this.get("subnav").setTitle("健康数据查询："+params.name);
			}
		}
	});
	module.exports = Healthdataquery;
});
