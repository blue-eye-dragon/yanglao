define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");

	var Register = BaseView.extend({
		trans16:function(result){
			//将result转成16进制的数
			var idc = parseInt(result*16);
			idc = idc.toString(16);

			var idcard="";
			var idcard1 = idc.substring(0, 2);
			var idcard2 = idc.substring(2, 4);
			var idcard3 = idc.substring(4, 6);
			var idcard4 = idc.substring(6, 8);
			//转成符合的ID卡
			var idcard = idcard4+idcard3+idcard2+idcard1;
			return idcard;
		},
		events:{
			"keyup .J-grid-td-input-idCardNo" :function(e){
				var result=$(e.target).val();
				var keyCode=window.event ? e.keyCode : e.which;
				//要进行完整的兼容性校验
				if(result.length==8 && keyCode==13){
    				$(e.target).val(result.trim());
    			}else if(result.length==10 && keyCode==13){
					$(e.target).val(this.trans16(result));
				}else if(result.length > 10 && keyCode==13){
					var start=result.length-10;
					result=result.substring(start);
					$(e.target).val(this.trans16(result));
				}
			}
		},
		initSubnav:function(widget){
			var buttonGroup=[{
				id:"building",
				handler:function(key,element){
					widget.get("list").refresh();
				}
			},{
				id:"idcardStatus",
				items:[{
					key:"0",
					value:"未注册"
				},{
					key:"1",
					value:"已注册"
				}],
				handler:function(key,element){
					widget.get("list").refresh();
				}
			}];
			
			return {
				model:{
					title:"一卡通注册",
					buttonGroup:buttonGroup,
					buttons:[],
					search:function(str) {
						var g=widget.get("list");
						g.loading();
						aw.ajax({
							url:"api/member/search",
							data:{
								s:str,
								"statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
								"memberSigning.status":"Normal",
								"memberSigning.houseingNotIn" : false,
								properties:"memberSigning.room.number," +
										"personalInfo.name," +
										"idCardNo",
								fetchProperties:"*,personalInfo.name,memberSigning.room.number",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					}
				}
			};
		},
		initList:function(widget){
			return {
				compType:"editgrid",
				url : "api/member/querybyidcard",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						idcardStatus:subnav.getValue("idcardStatus"),
						pkBuilding:subnav.getValue("building"),
						fetchProperties:"*,personalInfo.name,memberSigning.room.number"
					};
				},
				autoRender:false,
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-save",
							handler:function(){
								var pk=widget.get("list").getColumnsData("pkMember");
								var pks="";
								for(var i=0;i<pk.length;i++){
									pks+=pk[i]+",";
								}
								var idCardNo=widget.get("list").getEditData();
								var idCardNos="";
								for(var i=0;i<idCardNo.length;i++){
									if(!idCardNo[i].idCardNo){
										idCardNo[i].idCardNo="notIdCard";
									}
									idCardNos+=idCardNo[i].idCardNo+";";
								}
								aw.ajax({
									url:"api/member/saveIdCardNo",
									type : "POST",
	                                data : {
	                               	 	pk:pks,
	                               	 	idCardNo:idCardNos,
	                               	 	fetchProperties:"*,personalInfo.name,memberSigning.room.number"
	                                },
	                                success : function(data){
	                                	widget.get("list").setData(data);
	                                }
								});
							}
						}]
					},
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"personalInfo.name",
						name:"姓名"
					},{
						key : "idCardNo",
						name : "卡号",
						type:"text",
						col:"4"
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			if (params && params.pkFather) {
			     aw.ajax({
                     url : "api/member/query",
                     type : "POST",
                     data : {
                    	 pkMember:params.pkFather,
                    	 fetchProperties:"*,personalInfo.name,memberSigning.room.number"
                     },
                    success : function(data){
                    	widget.get("list").setData(data);
                    }
                 });
			}else if(params && params.Member){
				 aw.ajax({
                     url : "api/member/query",
                     type : "POST",
                     data : {
                    	 pkMember:params.Member,
                    	 fetchProperties:"*,personalInfo.name,memberSigning.room.number"
                     },
                    success : function(data){
                    	widget.get("list").setData(data);
                    }
                 });
			} else {
				widget.get("list").refresh();
			}
		} 
	});
	module.exports = Register;
});