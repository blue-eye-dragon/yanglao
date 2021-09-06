 define(function(require,exports,module){
	var Grid = require("grid");
	var detailgrid={
			init:function(widget,params){
				return new Grid({
					autoRender : false,
					parentNode:params.parentNode,
					model:{
						id:params.id,
						url:"api/diseasehistory/query",
						head:{
							title:"",
							buttons : [{
	                            id : "return",
	                            text : "返回",
	                            handler : function(){
	                                if(params.id == "disdetgrid" ){
	                                	$("#disgrid").removeClass("hidden");
										$("#disdetgrid").addClass("hidden");
	                                }else{
	                                	$("#impdisgrid").removeClass("hidden");
										$("#impdisdetgrid").addClass("hidden");
	                                }
	                                if($("li.active").text().trim()=="重大疾病统计"){
	                                	widget.get("subnav").show(["impdisease","search"]).hide(["building"]);
	                                }else{
	                                	widget.get("subnav").show(["disease"]).hide(["building"]);
	                                }
	                                
	                            }
	                        }]
						},
						columns:[{
							name:"member.memberSigning.room.number",
							label:"房间号",
						},{
							name:"member.personalInfo.name",
							label:"姓名"
						},{
							name:"member.personalInfo.sex.value",
							label:"性别",
						},{
							name:"member.personalInfo.birthday",
							label:"年龄",
							format:"age"
						},{
							name:"member.memberSigning.checkInDate",
							label:"入住日期",
							format:"date"
						},{
							name:"diseaseTime",
							label:"患病时间",
							format:"date",
							format:function(row,value){
								if(value.diseaseTime!=null){
									return moment(value.diseaseTime).format("YYYY-MM-DD");
								}else{
									return "";
								}
							},
						},{
							name:"cureTime",
							label:"治愈时间",
							format:"date",
							format:function(row,value){
								if(value.cureTime!=null){
									return moment(value.cureTime).format("YYYY-MM-DD");
								}else{
									return "";
								}
							},
						},{
							name:"diseaseStatus.value",
							label:"疾病状态"
						}]
					}
				});
			}
		}
	module.exports=detailgrid  ;
})


