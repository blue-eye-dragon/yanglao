define({
	title : "系统管理工作台",
	dependencies : ["searchMemberByRoomNameCardNO","building","finishStatus","time"],
	top : [{
		id:"usermaintain",
		color:"blue",
		icon:"icon-ok-circle ",
		text:"用户维护",
		url:"eling/elcms/system/usermaintain/usermaintain"
	},{
		id:"resetpassword",
		color:"green",
		icon:"icon-cog ",
		text:"重置密码",
		url:"eling/elcms/system/resetuserpwd/resetuserpwd"
	},{
		id:"communitydetail",
		color:"orange",
		icon:"icon-key",
		text:"社区信息",
		url:"eling/elcms/community/communityinfo/communityinfo"
	},{
		id:"userfreeze",
		color:"purple",
		icon:"icon-briefcase",
		text:"用户封存",
		url:"eling/elcms/system/userfreeze/userfreeze"
	}]
//	,
//	bottom : [{
//		icon:"icon-lock",
//		title:"状态",
//		columnClass:"col-sm-12 col-md-6",
//		columns:[{
//			columnClass:"col-sm-6",
//			items:[{
//				key:"",
//				title:"在线会员",
//				icon:"icon-user",
//				textClass:"text-error"
//			},{
//				key:"",
//				title:"在线员工",
//				icon:"icon-laptop",
//				textClass:"text-warning"
//			},{
//				key:"",
//				title:"当日访问数",
//				icon:"icon-star",
//				textClass:"text-purple"
//			}]
//		}]
//	}]
});