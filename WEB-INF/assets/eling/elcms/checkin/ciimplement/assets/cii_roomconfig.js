define(function(require,exports,module){
	var Form=require("form-2.0.0")
	
	var utils=function(){
		var form=new Form({
			parentNode:"#ciroomconfig",
			model:{
				id:"ciroomconfigform",
				defaultButton:false,
				items:[{
					name:"checkInRoomConfing.pkCIRoomConfig",
					type:"hidden"
				},{
					name:"checkInRoomConfing.version",
					type:"hidden",
					defaultValue:"0"
				},{
					name:"checkInRoomConfing.individuDemand",
					label:"个性化需求",
					type:"textarea"
				},{
					name:"checkInRoomConfing.bedding",
					label:"床品（套）",
					valiedate:["floor"]
				},{
					name:"checkInRoomConfing.fitmentPosi",
					type:"textarea",
					label:"家具位置"
				},{
					name:"checkInRoomConfing.keyNumber",
					label:"钥匙数量",
					valiedate:["floor"]
				}]
			}
		});
		seajs.on("el-event-checkinimplement-edit",function(data){
			form.setData(data || {});
		});
		return form;
	};
	module.exports=utils;
});