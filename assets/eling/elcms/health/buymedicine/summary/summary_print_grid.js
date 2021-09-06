define(function(require,exports,module){
	var MultiRowGrid=require("multirowgrid");
	//多语
	var i18ns = require("i18n");
	var utils={
		initComponent:function(){
			var grid=new MultiRowGrid({
				parentNode:".J-printGrid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					multiField:"items",
					columns:[{
						key:"member",
						name:i18ns.get("sale_ship_owner","会员"),
						format:function(value,row){
							return value.memberSigning.room.number+" "+value.personalInfo.name;
						},
						col:2
					},{
						key:"buyMedicinePapers",
						name:"证件",
						format:function(value,row){
							var ret="";
							if(value){
								for(var i=0;i<value.length;i++){
									ret+=value[i].papertype.name+",";
								}
								return ret.substring(0,ret.length-1);
							}
							return ret;
						},
						col:2
					},{
						key:"items",
						multiKey:"medicine",
						name:"名称",
						isMulti:true,
						format:function(value,row){
                 		   return value.name+"/"+(value.generalName || "");
                 	    },
						col:3
					},{
						key:"items",
						multiKey:"medicine.specification",
						name:"规格",
						isMulti:true,
						col:2
					},{
						key:"items",
						multiKey:"quantity",
						name:"数量",
						isMulti:true,
						col:1
					},{
						key:"description",
						name:"备注",
						col:2
					}]
				}
			});
			return grid;
		}
	};
	
	module.exports=utils;
});