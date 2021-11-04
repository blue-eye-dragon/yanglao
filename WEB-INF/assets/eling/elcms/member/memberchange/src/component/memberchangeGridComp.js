
define(function(require, exports, module) {
	var props = require("../constant/memberchangeProps");
	var Grid = require("grid");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	
    var memsleepsenorGridComp = {
    	init:function(params,widget){
        	var grid=new Grid({
				parentNode:".J-grid",
				url:"api/changemember/query",
				params:function(){
					var  subnav =widget.get("subnav");
					return{
						status:subnav.getValue("status"),
						changeDate:subnav.getValue("time").start,
						changeDateEnd:subnav.getValue("time").end,
						fetchProperties:props.getProperties("fetchProperties")
					}
				},
				model:{
					columns:[{
						name:"memberSigning.room.number",
						label:"房间",
						format:"link",
						formatparams:{
							id: "detail",
			                handler: function(index, data, rowEL) {
			                	var form = widget.get("form");
	                        	var personalCardowners ="";
	                    		for ( var i in data.memberSigning.membershipContract.personalCardowners) {
	                    			personalCardowners += data.memberSigning.membershipContract.personalCardowners[i].personalInfo.name+ ",";
	            				}
	                        	data.personalCardowners=personalCardowners;
								form.setData(data);
								form.setDisabled(true);
								widget.get("membergrid").setData(data.changeMemberItems);
								widget.get("membergrid").get("model").allowEdit=false
								props.list2Card(widget,true);
								widget.get("subnav").hide(["save"]);
			                }
						},
						className:"room"
					},{
						name:"memberSigning.membershipContract.membershipCard.name",
						label:"会籍卡",
						className:"card"
					},{
						name:"bmember",
						label:"变更前会员",
						format:function(value,row){
							var name ="";
							for ( var i in row.changeMemberItems) {
								name += row.changeMemberItems[i].member?(row.changeMemberItems[i].member.personalInfo.name+","):""
							}
							return name.substring(0, name.length-1);
						},
						className:"bmember"
					},{
						name:"amember",
						label:"变更后会员",
						format:function(value,row){
							var name ="";
							for ( var i in row.changeMemberItems) {
								if(row.changeMemberItems[i].assessmentDetail){
									name +=row.changeMemberItems[i].assessmentDetail.personalInfo.name+",";
								}else{
									name +=row.changeMemberItems[i].member?(row.changeMemberItems[i].member.personalInfo.name+","):"";
								}
							}
							return name.substring(0, name.length-1);
						},
						className:"amember"
					},{
						name:"changeDate",
						label:"变更日期",
						format:"date",
						className:"changeDate"
					},{
						name:"carOverFees",
						label:"结转金额",
						className:"caroverFees"
					},{
						name:"operate",
						label:"操作",
						className:"operate",
						format : "button",
						className:"operate",
						formatparams : [{
							id : "change",
	                        text : "变更",
	                        show:function(value,row){
	                        	return row.status.key == "UnChange"
	                        },
	                        handler:function(index,data,rowEL){
	    							Dialog.confirm({
	    								setStyle:function(){},
	    								content:"确认变更?",
	    								confirm:function(){
	    									Dialog.alert({
	    										title:"提示",
	    										showBtn:false,
	    										content:"正在处理，请稍后……"
	    									});
	    									aw.ajax({
	    										url:"api/changemember/change",
	    										data:{
	    											pkChangeMember:data.pkChangeMember,
	    											version:data.version
	    										},
	    										dataType:"json",
	    										success:function(data){
	    						                	Dialog.close();
	    											widget.get("grid").refresh();
	    											widget.get("form").load("memberSigning");
	    										},
	    						                error: function (data){
	    						                	Dialog.close();
	    					                    }
	    									});
	    									return "NotClosed";
	    								}
	    							})
								
	                        }
							
						},{
	                        id : "edit",
	                        icon : "icon-edit",
	                        show:function(value,row){
	                        	return row.status.key == "UnChange"
	                        },
	                        handler:function(index,data,rowEL){
	                        	widget.get("membergrid").get("model").allowEdit=true;
	                        	var form = widget.get("form");
	                        	form.setDisabled(false);
	                        	var personalCardowners ="";
	                    		for ( var i in data.memberSigning.membershipContract.personalCardowners) {
	                    			personalCardowners += data.memberSigning.membershipContract.personalCardowners[i].personalInfo.name+ ",";
	            				}
	                        	data.personalCardowners=personalCardowners;
                        		form.setReadonly("carOverFees",!data.carryOver);
								form.setData(data);
								form.setReadonly("memberSigning",true);
								widget.get("membergrid").setData(data.changeMemberItems);
								props.list2Card(widget,true);
								
	                        }
						 },{
	                        id : "remove",
	                        icon : "icon-remove",
	                        show:function(value,row){
	                        	return row.status.key == "UnChange"
	                        },
	                        handler:function(index,data,rowEL){
	                        	aw.del("api/changemember/" + data.pkChangeMember + "/delete",function(data){
 									widget.get("grid").refresh();
 								});
	                        }
						 }]
					}]
				}
			})
			return grid;
        }
    };
    module.exports = memsleepsenorGridComp;
});