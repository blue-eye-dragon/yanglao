define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
    var Dialog=require("dialog-1.0.0");
	var deceasedmemberregistration = BaseView.extend({
		events:{
			"change .J-member":function(e){
				var pk=this.get("card").getValue("member");
				if(pk){
					aw.ajax({
						url : "api/member/query",
						type : "POST",
						data : {
							pkMember:pk,
							fetchProperties:"*,memberSigning.room.number"
						},
						success:function(data){
							$(".J-room").val(data[0].memberSigning.room.number);
						}
					});
				}
			},
		"change .J-deceasedDate":function(e){
    			var deceasedDate=this.get("card").getValue("deceasedDate");
    			var currentDate=moment().format("YYYY-MM-DD")
				if(moment(deceasedDate).format("YYYY-MM-DD")>currentDate){
					Dialog.alert({
							content : "过世日期不得在当前日期之后。"
						 });
					this.get("card").setValue("deceasedDate",currentDate);
     				return false;
				}
    		}
		},
		initSubnav:function(widget){
			return {
				model:{
					//title:"过世会员登记",
					title : "过世"+i18ns.get("sale_ship_owner","会员")+"登记",
					buttonGroup:[{
						id:"building",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("list").refresh();
							widget.get("card").load("member");
						}
					},{
						id:"flowStatus",
						showAll:true,
						showAllFirst:true,
						tip:"是否确认",
						items:[{
							key:"NotConfirm",
							value:"未确认"
						},{
							key:"Confirm",
							value:"已确认"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					
					},{
						id:"orderString",
						tip : "查询条件",
						items:[{
							key:"deceasedDate:desc",
							value:"过世日期"
						},{
							key:"member.memberSigning.room.number",
							value:"房间号"
						}],
						handler:function(key,element){
							widget.get("list").refresh({
								pkBuilding:widget.get("subnav").getValue("building"),
								"flowStatus":widget.get("subnav").getValue("flowStatus"),
								"orderString":key,
								fetchProperties:"*," +
								"member.personalInfo.name," +
								"member.memberSigning.room.number,"+
								"member.memberSigning.room.pkRoom",
							});
						}
					}],
			    //写button
			  buttons:[{
				id:"adds",
				text:"新增",
				handler:function(){
					widget.get("card").reset();
					widget.hide(".J-list").show(".J-card");
					widget.get("subnav").show(["building","return"]).hide(["adds","flowStatus","orderString"]);
				}
			    },{
					id:"return",
					text:"返回",
					show:false,
					handler:function(){
						widget.hide(".J-card").show(".J-list");
						widget.get("subnav").show(["adds","building","flowStatus","orderString"]).hide("return");
						return false;
					}
				}],
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/deceasedmemberregistration/query",
				params:function(){
					return {
						pkBuilding:widget.get("subnav").getValue("building"),
						"flowStatus":widget.get("subnav").getValue("flowStatus"),
//						"orderString":widget.get("subnav").getValue("orderString"),
						fetchProperties:"*," +
						"member.personalInfo.name," +
						"member.memberSigning.room.number," +
						"member.memberSigning.room.pkRoom",
					};
				}, 
				model:{
					columns:[{
						col:1,
						key:"member.personalInfo.name",
					    //name:"会员",
						name:i18ns.get("sale_ship_owner","会员"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								data.room=data.member.memberSigning.room.number;
								widget.edit("edit",data);
								var card = widget.get("card");
								var memberSelect=card.getData("member","");
								memberSelect.push(data.member);
								card.setModel("member",memberSelect);
								card.setValue("member",data.member);
								card.setDisabled(true);
								widget.get("subnav").hide(["adds","building","flowStatus","orderString"]).show("return");
								return false;
							
							}
						}]
					},{
						col:1,
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						col:1,
						key:"deceasedDate",
						name:"过世日期",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
						col:2,
						key:"diedPlace",
						name:"过世地点  "
					},{
						col:2,
						key:"causes",
						name:"过世原因  "
					},{
						col:3,
						key:"description",
						name:"备注"
					},{
						col:1,
						key:"operate",
						name:"操作",
						format:function(row,value){
							if(value.flowStatus.key=="Confirm"){
								return  "已确认";
							}else{
								return "button";
							}
						},
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								data.room=data.member.memberSigning.room.number;
								widget.edit("edit",data);
								var card = widget.get("card");
								var memberSelect=card.getData("member","");
								memberSelect.push(data.member);
								card.setModel("member",memberSelect);
								card.setValue("member",data.member);
								widget.get("subnav").hide(["flowStatus","orderString","adds"]);
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/deceasedmemberregistration/" + data.pkDeceasedMemberRegistration + "/delete");
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					widget.save("api/deceasedmemberregistration/save",$("#deceasedmemberregistration").serialize(),function(data){
						if(data.msg == "该"+i18ns.get("sale_ship_owner","会员")+"已登记过世"){
							Dialog.alert({
								content:"该"+i18ns.get("sale_ship_owner","会员")+"已登记过世"
							});
							return {
								forward:false
							};
						}
						else{
							widget.get("list").refresh();
							widget.get("subnav").show(["adds","building","flowStatus","orderString"]).hide("return");
						}
					});
				},
				cancelaction:function(){
					widget.hide(".J-card").show(".J-list");
					widget.get("subnav").show(["adds","building","flowStatus","orderString"]).hide("return");
				},
				model:{
					id:"deceasedmemberregistration",
					items:[{
						name:"pkDeceasedMemberRegistration",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"member",
						//label:"会员",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/query",
						key:"pkMember",
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							return {
								"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
								fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
						validate:["required"]
					},{
						name:"deceasedDate",
						label:"过世日期",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"diedPlace",
						label:"过世地点 ",
						type:"textarea"
					},{
						name:"causes",
						label:"过世原因",
						type:"textarea"
					},{
						name:"description",
						label:"备注",
						type:"textarea"
					}]
				}
			};
			this.set("card",card);
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			    widget.get("list").refresh({
			    	DeceasedMemberRegistration:params.pkFather,
			    	fetchProperties:"*," +
					"member.personalInfo.name," +
					"member.memberSigning.room.number," +
					"member.memberSigning.room.pkRoom", 	
			 });
			}else if(params && params.DeceasedMemberRegistration){
				  widget.get("list").refresh({
					  DeceasedMemberRegistration:params.DeceasedMemberRegistration,
				    	fetchProperties:"*," +
						"member.personalInfo.name," +
						"member.memberSigning.room.number," +
						"member.memberSigning.room.pkRoom",
				 });
			} else {
				widget.get("list").refresh();
			}
		},
	});
	module.exports = deceasedmemberregistration;
});
