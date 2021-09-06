define(function(require, exports, module) {
	var BaseView=require("baseview");
	
	var DiseaseList=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"疾病史",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							var subnav=widget.get("subnav");
							//点击楼宇，切换会员
							subnav.load({
								id:"defaultMembers",
								params:{
									fetchProperties:"personalInfo.name,pkMember,memberSigning.room.number",
									"memberSigning.room.building.pkBuilding":key
								},
								callback:function(){
									widget.get("list").refresh();
								}
							});
						}
					},{
						id:"defaultMembers",
						handler:function(key,element){
							widget.get("list").refresh();
						}
					},{
						id:"disease",
						items:[{
							key:"BEILL",
							value:"患病中"
						},{
							key:"RECURE",
							value:"已康复"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
			      buttons:[{
			    	  	id:"return",
						text:"返回",
						show:false,	
						handler:function(){
							widget.show(".J-list").hide(".J-card");
							widget.get("subnav").show(["et","building","disease","defaultMembers"]).hide(["return"]);
						}
					},{
						id:"et",
						text:"新增",
						handler:function(){
							widget.get("card").reset();
							var data ={
								diseaseDegree:{key:"COMMONLY",value:"一般"},
								diseaseStatus:{key:"BEILL",value:"患病中"},
								critical:{key:true,value:"是"},
								inherited:{key:true,value:"是"}
		 					};
							widget.get("card").setData(data);
							widget.hide(".J-list").show(".J-card");
							widget.get("subnav").hide(["et","building","disease","defaultMembers"]).show(["return"]);
							widget.get("card").hide("cureTime");
						}
					}],
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/diseasehistory/diseasequery",
				autoRender:false,
				params:function(){
					var subnav=widget.get("subnav");
					return {
						pkDisease:subnav.getValue("disease"),
						pkMember:subnav.getValue("defaultMembers"),
						fetchProperties:"*,diseaseDetail.name,diseaseDetail.pkDiseaseDetail"
					};
				},
				model:{
					columns:[{
						key:"diseaseDetail.name",
						name:"疾病"
					},{
						key:"diseaseTime",
						name:"患病时间",
						format:"date"
					},{
						key:"cureTime",
						name:"治愈时间",
						format:"date"
					},{
						key:"diseaseStatus.value",
						name:"状态"
					},{
						key:"critical",
						name:"重大疾病",
						format:function(value,row){
							return value ? "是" : "否";
						}
					},{
						key:"inherited",
						name:"遗传病",
						format:function(value,row){
							return value ? "是" : "否";
						}
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								var card=widget.get("card");
								card.reset();
								widget.edit("edit",data);
								if(data.diseaseStatus.key=="RECURE"){
									card.show("cureTime");
									card.setValue("cureTime",(data.cureTime || moment()));
								}else{
									card.hide("cureTime");
								}
								widget.hide(".J-list").show(".J-card");
								widget.get("subnav").hide(["et","building","disease","defaultMembers"]).show(["return"]);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/diseasehistory/"+data.pkDiseaseHistory+"/delete");
							}
						}]
					}]
				}
			};
		},
		
		events:{
			"click .J-form-diseasehistoryForm-radiolist-diseaseStatus" : function(e) {
				var widget=this;
				var card =  widget.get("card");
				var index = e.target.defaultValue;
				if(index!="RECURE"){
					card.hide("cureTime");
					card.setValue("cureTime","");
				}else{
					card.show("cureTime");
				}
			},
		},
		initCard:function(widget){
			var subnav=this.get("subnav");
			return {
				compType:"form1",
				saveaction:function(){
					widget.save("api/diseasehistory/add","member.pkMember="+subnav.getValue("defaultMembers")+"&"+$("#diseasehistoryForm").serialize(),function(){
						widget.get("list").refresh();
						widget.show(".J-list").hide(".J-card");
						subnav.show(["et","building","disease","defaultMembers"]).hide(["return"]);
					});
				},
				//取消按钮
				 cancelaction:function(){
					 widget.show(".J-list").hide(".J-card");
					 subnav.show(["et","building","disease","defaultMembers"]).hide(["return"]);
				 },
				model:{
					id:"diseasehistoryForm",
					items:[{
						name:"pkDiseaseHistory",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"diseaseDetail",
						key:"pkDiseaseDetail",
						url:"api/diseasedetail/query",
						value : "name",
						type : "select",
						validate:["required"],
						label:"疾病",
					},{
						name:"diseaseTime",
						label:"患病时间",
						type:"date",
						mode:"Y-m-d",
					},{
						name:"attentions",
						label:"备注",
						type:"textarea"
					},{
						name:"diseaseStatus",
						label:"状态",
						type:"radiolist",
						list:[{
							key:"BEILL",
							value:"患病中"
						},{
							key:"RECURE",
							value:"已治愈"
						}],
						validate:["required"]
					},{
						name:"cureTime",
						label:"治愈时间",
						type : "date",
						mode : "Y-m-d",
					},{
						name:"critical",
						label:"重大疾病",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}]
					},{
						name:"inherited",
						label:"遗传病",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}]
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			//加载会员
			var subnav=this.get("subnav");
			var grid=this.get("list");
			grid.loading();
			subnav.load({
				id:"defaultMembers",
				params:{
					fetchProperties:"personalInfo.name,pkMember,memberSigning.room.number",
					"memberSigning.room.building":subnav.getValue("building")
				},
				callback:function(data){
					grid.refresh();
				}
			});
		}
	});
	module.exports=DiseaseList;
});
