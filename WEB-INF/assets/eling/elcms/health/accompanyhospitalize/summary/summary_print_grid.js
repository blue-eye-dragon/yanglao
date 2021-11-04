define(function(require,exports,module){
	//多语
	var i18ns = require("i18n");
	var Grid=require("grid-1.0.0");
	var utils={
		initComponent:function(){
			var grid=new Grid({
				parentNode:".J-printGrid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"member",
						name:i18ns.get("sale_ship_owner","会员"),
						format:function(value,row){
							return value.memberSigning.room.number+" "+value.personalInfo.name;
						}
					},{
						key:"hospital.name",
						name:"医院"
					},{
						key:"hospitalDepartment",
						name:"预约科室"
					},{
						key:"doctorName",
						name:"专家名称"
					},{
						key:"papers",
						name:"证件",
						format:function(value,row){
							var ret="";
							if(value){
								for(var i=0;i<value.length;i++){
									ret+=value[i].name+",";
								}
								return ret.substring(0,ret.length-1);
							}
							return ret;
						}
					},{
						key:"date",
						name:"日期",
						format:"date"
					},{
						key:"flowStatus.value",
						name:"状态"
					},{
						key:"description",
						name:"备注"
					}]
				}
			});
			return grid;
		}
	};
	
	module.exports=utils;
});