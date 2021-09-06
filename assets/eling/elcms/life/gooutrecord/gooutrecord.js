define(function(require, exports, module) {
	var ElView=require("elview");
    var aw = require("ajaxwrapper");
    var Dialog=require("dialog-1.0.0");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Form=require("form-2.0.0")
	var template="<div class='el-gooutrecord'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-list'></div>"+
	"<div class='J-card hidden'></div>"+
	"</div>";
	var Goout = ElView.extend({
		attrs:{
    		template:template
        },
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
						title:"外出记录",
						search : function(str) {
							var g=widget.get("list");
							g.loading();
							aw.ajax({
								url:"api/gooutrecord/search",
								data:{
									s:str,
									properties:"member.personalInfo.name,member.memberSigning.room.number,recordPerson.name",
									fetchProperties:"*,recordPerson.name,member.personalInfo.name,member.memberSigning.room.number",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
									
								}
							});
						},
						buttonGroup:[{
							id:"building",
							handler:function(key,element){
								widget.get("list").refresh();
								widget.get("card").load("member");
							}
						},{
							id:"status",
							items:[{
			                    key:"Out",
			                    value:"出行"
							},{
								key:"back",
								value:"已返回"
							}],
							handler:function(key,element){
								widget.get("list").refresh();
							}
						}],
						buttons:[{
	        				id:"return",
	        				text:"返回",
							show:false,
							frist:true,
							handler:function(){
								widget.show(".J-list").hide(".J-card");
								widget.get("subnav").hide(["return"]).show(["search","add","status"]);
								return false;
							}
	        				
	        			},{
	     				   id:"add",
	    				   text:"新增",
	    				   handler:function(key,element){
	    						widget.get("card").reset();
								widget.show(".J-card").hide(".J-list");
								widget.get("subnav").hide(["search","add","status"]).show(["return"]);
								card.setAttribute("status","readonly",true);
						   }  
	    			   }],
	                }
				});
		this.set("subnav",subnav);
		
		var	list = new Grid({
				parentNode:".J-list",
    			autoRender:false,
    			url:"api/gooutrecord/query",
 				params:function(){
 					return {
 						"member.memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
 						statusIn:widget.get("subnav").getValue("status")
 					};
 				},
 				fetchProperties:"*,recordPerson.name,member.personalInfo.name,member.memberSigning.room.number",
 				model : {
					columns:[{
						key:"member.personalInfo.name",
						name:"会员",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.show(".J-card").hide(".J-list");
								widget.get("subnav").hide(["search","add","status"]).show(["return"]);
								widget.get("card").setData(data);
								widget.get("card").setDisabled(true);
							}
						}]
					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"outDate",
						name:"出行日期",
						format:"date"
					},{
						key:"backDate",
						name:"返回日期",
						format:"date"
					},{
						key:"status",
						name:"状态",
						format:function(value,row){
							if(value == "Out"){
								return "出行";
							}else if(value == "back"){
								return "已返回";
							}else{
								return "";
							}
						}
					},{
						key:"accompanyPerson",
						name:"同行人员"
					},{
						key:"recordPerson.name",
						name:"记录人"
					},{
						key:"operate",
						name:"操作",
						format:function(row,value){
							if(value.status=="back"){
								return "已返回";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.get("card").reset();
								widget.get("card").setData(data);
								widget.show(".J-card").hide(".J-list");
								widget.get("subnav").hide(["search","add","status"]).show(["return"]);
								var  card =widget.get("card");
								card.setAttribute("member","readonly",true);
								card.setAttribute("status","readonly",true);
							}
						},{
							key:"memberreturn",
							text:"回园",
							handler:function(index,data,rowEle){
								Dialog.showComponent({
									title:"返回时间",
									confirm:function(){
										var backDate= widget.get("returnForm").getValue("backDate");
										//TODO:加入校验
										if(moment(backDate).isAfter(moment())){
											$("#returnForm .J-form-returnForm-date-backDate").parent().parent().next().text("返回时间不能大于今天");
											return "NotClosed";
										}else{
											aw.saveOrUpdate("api/gooutrecord/save",$("#returnForm").serialize(),function(data){
												Dialog.alert({
													content:"成功"
												});
												widget.get("list").refresh({
													pkGoOutRecord:data.pkGoOutRecord
												}
														);
											});
										}
									},
									setStyle:function(){
										$(".el-dialog .modal.fade.in").css({
											"top":"10%"
										});
									}
								},widget.getReturnForm(data));
							}
						}]
					}]
 				}
			});
			this.set("list",list);
			
			var card = new Form({
				parentNode:".J-card",
            	saveaction:function(){
    				var data=$("#gooutrecord").serializeArray();
					var outDate =  moment(data[4].value).valueOf();
					var backDate = moment(data[5].value).valueOf();
					if(backDate <= outDate){
						Dialog.tip({
							title:"会员返回时间需大于出行时间"
						});
					}
					else{
						aw.saveOrUpdate("api/gooutrecord/save",$("#gooutrecord").serialize(),function(data){
	 						if(data.msg == "会员有未完成的外出申请"){
	 							Dialog.tip({
	 								title:"会员有未完成的外出申请"
	 							});
	 						}else{
	 							widget.get("list").refresh();
	 							widget.show(".J-list").hide(".J-card");
								widget.get("subnav").hide(["return"]).show(["search","add","status"]);
	 						}
						});
					}
 				},
 				//取消按钮
  				cancelaction:function(){
  					widget.show(".J-list").hide(".J-card");
					widget.get("subnav").hide(["return"]).show(["search","add","status"]);
  				},
				model:{
					id:"gooutrecord",
					items:[{
						name:"pkGoOutRecord",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"member",
						label:"会员",
						url:"api/member/query",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
								"memberSigning.room.building":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
						validate:["required"]
					},{
						name:"outDate",
						label:"出行日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"backDate",
						label:"返回日期",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"status",
						label:"状态",
						type:"select",
						options:[{
							key:"Out",
							value:"出行"
						},{
							key:"back",
							value:"已返回"
						}],
						defaultValue:"Out",
						validate:["required"]
					},{
						name:"accompanyPerson",
						label:"同行人员"
					}]
				}
           
			});
			this.set("card",card);
		},
		getReturnForm:function(data){
			var returnForm	=new Form({
				model:{
					id:"returnForm",
					defaultButton:false,
					items:[{
						name:"pkGoOutRecord",
						type:"hidden",
						defaultValue:data.pkGoOutRecord,
					},{
						name:"version",
						type:"hidden",
						defaultValue:data.version,
					},{
						name:"status",
						type:"hidden",
						defaultValue:"back",
					},{
						name:"backDate",
						label:"返回时间",
						type:"date",
						mode:"Y-m-d",
						style:{
							label:"width:30%"
						},
						defaultValue:data.backDate?data.backDate:moment().valueOf(),
						validate:["required"]
					}]
				}
			});
			this.set("returnForm",returnForm);
			return returnForm;
		},
		afterInitComponent : function(params,widget) {
			if (params && params.pkFather) {
				widget.get("subnav").setValue("building",params.pkBuilding);
				widget.get("card").load("member",{
					callback:function(){
						if(params && params.member){
							widget.get("card").setValue("member",params.member);
						}
					}
				});
				aw.ajax({
					url : "api/gooutrecord/query",
					type : "POST",
					data : {
						pkGoOutRecord : params.pkFather,
						fetchProperties:"*,recordPerson.name,member.personalInfo.name,member.memberSigning.room.number"
					},
					success : function(result) {
						widget.get("list").setData(result);
					}
				});
			} else {
				widget.get("list").refresh(params);
			}
    	 }
	});
	module.exports = Goout;
});
