define(function(require, exports, module) {
	var BaseView=require("baseview");
	var Form=require("form-2.0.0")
	var aw = require("ajaxwrapper");
    var Dialog=require("dialog-1.0.0");
  //多语
	var i18ns = require("i18n");
	var confirm = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"入住时间确认",
					search : function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/checkinimplement/search",
							data:{
								s:str,
								properties:"*,memberSigning.room.number,memberSigning.checkInDate,memberSigning.members.personalInfo.name",
								fetchProperties:"memberSigning.checkInDate,pkCIImplement,status,memberSigning.room.number,memberSigning.room.pkRoom" +
								",memberSigning.members.personalInfo.name,memberSigning.members.personalInfo.mobilePhone" +
								",memberSigning.members.personalInfo.phone"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					},
					buttons:[],
					buttonGroup:[{
						id:"building",
						showAll:true,
						handler:function(key,element){
							widget.get("list").refresh();					
						}
					}],
					time:{
						ranges:{
							 "本月": [moment().startOf("month"), moment().endOf("month")], 
						     "今年": [moment().startOf("year"), moment().endOf("year")] 
						},
						defaultTime:"今年",
						click:function(time){
							widget.get("list").refresh();
						}
					}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/checkInImplement/query",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						status:"Doing",
						"memberSigning.checkInDate":time.start, 
						"memberSigning.checkInDateEnd":time.end,
						"memberSigning.room.building":subnav.getValue("building"),
						fetchProperties:"memberSigning.checkInDate,pkCIImplement,status,memberSigning.room.number,memberSigning.room.pkRoom" +
							",memberSigning.members.personalInfo.name,memberSigning.members.personalInfo.mobilePhone" +
							",memberSigning.members.personalInfo.phone"
					};
				},
				autoRender:false,
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"memberSigning.checkInDate",
						name:"入住日期",
						format:"date"
					},{
						key:"memberSigning.members.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						format:function(row,value){
							var name="";
							for(var i in value.memberSigning.members){
								name+=value.memberSigning.members[i].personalInfo.name+",";
							}
							return name.substr(0,name.length-1);
						}
					},{
						key:"memberSigning.members.personalInfo.mobilePhone",
						name:"手机",
						format:function(row,value){
							var mobilePhone="";
							for(var i in value.memberSigning.members){
								mobilePhone+=value.memberSigning.members[i].personalInfo.mobilePhone+",";
							}
							return mobilePhone.substr(0,mobilePhone.length-1);
						}
					},{
						key:"memberSigning.members.personalInfo.phone",
						name:"电话",
						format:function(row,value){
							var phone="";
							for(var i in value.memberSigning.members){
								phone+=value.memberSigning.members[i].personalInfo.phone+",";
							}
							return phone.substr(0,phone.length-1);
						}
					},{
						key:"status.value",
						name:"入住准备状态"
					},{
						key:"change",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"detail",
							text:"确认",
							handler:function(index,data,rowEle){
								var pkCIImplement = data.pkCIImplement;
								Dialog.showComponent({
									title:"入住时间",
									confirm:function(){
										aw.saveOrUpdate("api/checkInImplement/modifyCheckInDate",$("#timeform").serialize(),function(data){
											Dialog.alert({
												content:"确认成功"
											});
											widget.get("list").refresh({
													pkCIImplement:pkCIImplement,
													fetchProperties:"memberSigning.checkInDate,pkCIImplement,status,memberSigning.room.number,memberSigning.room.pkRoom" +
													",memberSigning.members.personalInfo.name,memberSigning.members.personalInfo.mobilePhone" +
													",memberSigning.members.personalInfo.phone"
												});
												
										});
									},
									setStyle:function(){
										$(".el-dialog .modal.fade.in").css({
											"top":"10%"
										});
									}
								},widget.getTimeForm(data));
							}
						}]
					}]
				}
			};
		},
		getTimeForm:function(data){
			return new Form({
				defaultButton:false,
				model:{
					id:"timeform",
					defaultButton:false,
					items:[{
						name:"pkCIImplement",
						type:"hidden",
						defaultValue:data.pkCIImplement,
					},{
						name:"newCheckInDate",
						label:"入住时间",
						type:"date",
						mode:"Y-m-d",
						defaultValue:data.memberSigning.checkInDate,
						validate:["required"]
					}]
				}
			});
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("list").refresh({
			    	pkCIImplement:params.pkFather,
			    	fetchProperties:"memberSigning.checkInDate,pkCIImplement,status,memberSigning.room.number,memberSigning.room.pkRoom" +
					",memberSigning.members.personalInfo.name,memberSigning.members.personalInfo.mobilePhone" +
					",memberSigning.members.personalInfo.phone"
			    });
			}else if(params && params.CheckInImplement){
				widget.get("list").refresh({
					pkCIImplement:params.CheckInImplement,
					fetchProperties:"memberSigning.checkInDate,pkCIImplement,status,memberSigning.room.number,memberSigning.room.pkRoom" +
					",memberSigning.members.personalInfo.name,memberSigning.members.personalInfo.mobilePhone" +
					",memberSigning.members.personalInfo.phone"
				});
			} else {
				widget.get("list").refresh();
			}
		} 
	});
	
	
	module.exports = confirm;
});