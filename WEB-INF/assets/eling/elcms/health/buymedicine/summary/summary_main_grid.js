define(function(require,exports,module){
	var MultiRowGrid=require("multirowgrid");
	require("./summary_main_grid.css");
	//多语
	var i18ns = require("i18n");
	var utils={
		initComponent:function(widget){
			return new MultiRowGrid({
				parentNode:".J-grid",
				autoRender:false,
				url:"api/buymedicineapplication/query",
				params:function(){
					return params={
						fetchProperties:"*,buyMedicinePapers.papertype.name," +
							"member.personalInfo.name," +
							"member.memberSigning.room.number," +
							"items.medicine.name,items.medicine.generalName," +
							"items.medicine.specification," +
							"items.quantity",
						flowStatus:"Commited"
					};
				},
				model:{
					head:{
						title:""
					},
					multiField:"items",
					isCheckbox:true,
					columns:[{
						key:"member",
						name:i18ns.get("sale_ship_owner","会员"),
						className:"member",
						format:function(value,row){
							return value.memberSigning.room.number+" "+value.personalInfo.name;
						}
					},{
						key:"buyMedicinePapers",
						name:"证件",
						className:"buyMedicinePapers",
						format:function(value,row){
							var ret="";
							if(value){
								for(var i=0;i<value.length;i++){
									ret+=value[i].papertype.name+",";
								}
								return ret.substring(0,ret.length-1);
							}
							return ret;
						}
					},{
						key:"items",
						multiKey:"medicine",
						name:"名称",
						className:"medicine",
						isMulti:true,
						format:function(value,row){
                 		   return value.name+"/"+(value.generalName || "");
                 	    }
					},{
						key:"items",
						multiKey:"medicine.specification",
						name:"规格",
						className:"specification",
						isMulti:true
					},{
						key:"items",
						multiKey:"quantity",
						name:"数量",
						className:"quantity",
						isMulti:true
					},{
						key:"date",
						name:"提交日期",
						className:"date",
						format:"date"
					},{
						key:"flowStatus.value",
						name:"状态",
						className:"flowStatus"
					},{
						key:"description",
						className:"description",
						name:"备注"
					}]
				}
			});
		}
	};
	
	module.exports=utils;
});