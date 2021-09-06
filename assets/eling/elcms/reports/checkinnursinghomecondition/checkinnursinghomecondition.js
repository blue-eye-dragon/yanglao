define(function(require, exports, module) {
	var BaseView=require("baseview");
	var checkoutroomapproval = BaseView.extend({
		initSubnav:function(){
			return {
				model:{
					title:"颐养院入住情况表",
					buttons:[]
				}
			};
		},
		initList:function(){
			return{
				url:"api/report/checkinnursinghomecondition",
				model:{
					columns:[{
						key:"buildingName",
						name:"楼号"
					},{
						key:"checkOut",
						name:"退房入住人数"
					},{
						key:"buyIngdirect",
						name:"买卡直接入住人数"
					},{
						key:"roomReservaTion",
						name:"房间保留入住人数"
					}]
				}
			};
		}
	});
	module.exports = checkoutroomapproval;
});