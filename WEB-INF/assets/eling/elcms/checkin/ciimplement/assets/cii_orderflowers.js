define(function(require,exports,module){
	var Form=require("form-2.0.0")
	
	var init=function(){
		var oflist=[{
			key:"true",
			value:"是",
			isDefault:true
		},{
			key:"false",
			value:"否",
		}];
		var form=new Form({
			parentNode:"#ciorderflowers",
			model:{
				id:"ciorderflowers",
				defaultButton:false,
				items:[{
					name:"checkInOrderflowers.pkCIOrderFlowers",
					type:"hidden"
				},{
					name:"checkInOrderflowers.version",
					type:"hidden",
					defaultValue:"0"
				},{
					name:"checkInOrderflowers.orderFlowers",
					label:"是否订花",
					type:"radiolist",
					list:oflist,
					type:"hidden",
				},{
					name:"checkInOrderflowers.orderTime",
					readonly:true,
					type:"date",
					label:"订花时间",
					validate:["required"],
					
				},{
					name:"checkInOrderflowers.description",
					label:"备注",
					type:"textarea"
				}]
			}
		});
		seajs.on("el-event-checkinimplement-edit",function(data){
			//订花时间设置
//			var form = widget.get("orderflowers");
			if(data.checkInOrderflowers){
				form.setData(data || {});
			}else {
				if(moment(data.memberSigning.checkInDate).isAfter(moment().add(3, 'days'), 'day')){
					var day = moment(data.memberSigning.checkInDate).subtract(3, 'days').valueOf();
					form.setValue("checkInOrderflowers.orderTime",day);	
				}else{
					form.setValue("checkInOrderflowers.orderTime",moment());
				}
			}
		});
		return form;
	};
	module.exports=init;
});