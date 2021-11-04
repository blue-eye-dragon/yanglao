define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	var Hospital = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"合作医院",
					search :{
						placeholder : "医院名称",
						handler : function(str){
							var g=widget.get("list");
							g.loading();
							aw.ajax({
								url:"api/hospital/search",
								data:{
									s:str,
									searchProperties:"name",
							        fetchProperties:"pkHospital," +
	                    				"name," +
	                    				"description," +
	                    				"isCommunityHospital," +
	                    				"version," +
	                    				"hospitalGrade",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
									
								}
							});
						},
						
					},
					buttons:[{
        				id:"add",
        				text:"新增",
						show:true,
						handler:function(){
							widget.get("card").reset();
							widget.list2Card(true);
							widget.get("subnav").hide(["search","add"]).show(["return"]);
						}
        			},{
        				id:"return",
        				text:"返回",
        				show:false,
        				handler:function(){
							widget.get("subnav").show(["add","search"]).hide(["return"]);
							widget.get("subnav").setValue("search","");
							widget.list2Card(false);
							widget.get("list").refresh();
							return false;
        				}
        			}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/hospital/query",
				model:{
					columns:[{
						key:"name",
						name:"医院名称",
					},{
						key:"description",
						name:"描述"
					},{
						key:"isCommunityHospital",
						name:"是否本社区医院",
						format:function(row,value){
							if(value.isCommunityHospital == true){
								return "是";
							}else{
								return "否";
							}
						}
					},{
						key:"hospitalGrade.value",
						name:"医院等级"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
								widget.get("subnav").hide(["search","add"]).show(["return"]);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/hospital/" + data.pkHospital + "/delete");
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-2.0.0",
				saveaction:function(){
					widget.save("api/hospital/save",$("#hospital").serialize(),function(){
						widget.list2Card(false);
						widget.get("list").refresh();
						widget.get("subnav").show(["add","search"]).hide(["return"]);
						return false;
					});
				},
				cancelaction:function(){
					widget.list2Card(false);
					widget.get("list").refresh();
					widget.get("subnav").show(["add","search"]).hide(["return"]);
					return false;
				},
				model:{
					id:"hospital",
					items:[{
						name:"pkHospital",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"医院名称",
						validate:["required"],
    					exValidate: function(value){
							if(value.length>30){
								return "不能超过30个字符";
							}else{
								return true;
							}
						}
					},{
                        name : "isCommunityHospital",
                        type : "radiolist",
                        label : "是否本社区医院",
                        list : [{
                            key : "true",
                            value : "是"
                        },{
                            key : "false",
                            value : "否"
                        }],
                        validate:["required"]
                    },{
                    	name:"hospitalGrade",
						label:"医院等级",
						url:"api/enum/com.eling.elcms.health.model.Hospital.HospitalGrade",
						type:"select",
						validate:["required"]
					},{
						name:"description",
						label:"描述",
						type:"textarea"
					}]
				}
			};
		}
	});
	module.exports = Hospital;
});