/**
 * 会员状态调整
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Form=require("form-2.0.0")
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
    var template="<div class='J-subnav'></div>"+
    		"<div class='J-grid' ></div>"+ 
    		"<div class='J-memberstatusadjustform hidden' ></div>";
	var MemberStatusAdjust = ELView.extend({
		attrs:{
			template:template 
		},
		initComponent : function(params,widget) { 
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
 					title:"会员状态调整",
 					items:[{
 						id:"search",
 				       type:"search",
 				       handler:function(str) { 
 	 	            	   widget.get("grid").loading();
 	 						aw.ajax({ 
 	 							url:"api/member/search",
 	 							data:{
 	 								s:str, 
 	 								properties:"pkMember,status,personalInfo.sex,personalInfo.birthday,personalInfo.name,memberSigning.room.number,memberSigning.room.pkRoom",         
 	 							    fetchProperties:"pkMember,status,personalInfo.sex,personalInfo.birthday,personalInfo.name,memberSigning.room.number,memberSigning.room.pkRoom"          
 	 							},
 	 							dataType:"json", 
 	 							success:function(data){
 	 								widget.get("grid").setData(data);
 	 								widget.show(".J-grid").hide(".J-memberstatusadjustform,.J-return"); 
 	 							}
 	 						});
 	 					}

 					}
 					,{
						id:"building",
						type:"buttongroup",
						showAll:true,
//						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh(params,function(){
							});
						}
					}
 					,{ 
 						 id:"return",
 						   text:"返回",
 						   type:"button",
 						   show:false,
 						   handler:function(){
 	 							widget.hide([".J-return",".J-memberstatusadjustform"]).show([".J-grid",".J-statusQuery",".J-search",".J-building"]);
 	 							return false;
 	 						}

 					},{
 						 id:"statusQuery", 
 						 tip :"会员状态",
 						  type:"buttongroup",
 							items:[{
 								key:"Normal",
 								value:"在住" 	
 							},{
 								key:"Out",
 								value:"外出"
 							},{
 								key:"Nursing",
 								value:"颐养" 
 							},{
 								key:"Died",
 								value:"过世" 	
 							},{
 								key:"Checkout",
 								value:"退住"
 							},{
 								key:"Behospitalized",
 								value:"住院" 
 							},{
 								key:"Waitting",
 								value:"预入住" 
 							},{
 								key:"NotLive",
 								value:"选房不住" 
 							},{
 								key:"NursingAndBehospitalized",
 								value:"颐养且住院" 
 							},{
 								value:"全部" 
 							}],
 							handler:function(key,element){
 								widget.get("grid").refresh(); 
 							}
 					}], 
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid",
 				url :"api/member/query", 
 				fetchProperties:"pkMember,status,personalInfo.name,personalInfo.sex,personalInfo.birthday,memberSigning.room.number,memberSigning.room.pkRoom",
 				params:function(){
 					return { 
 						"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
 						status:widget.get("subnav").getValue("statusQuery"),
 						"personalInfo.diedIn":"true,false",
 						"memberSigning.statusIn":"Normal,Termination",
 						"memberSigning.houseingNotIn":false
					}; 
				},
 				model:{
 					columns:[{
 						key:"memberSigning.room.number",
 						name:"房间"
 					},{
 						key:"personalInfo.name",
 						name:"会员"
 					},{
 						key:"personalInfo.sex.value",
 						name:"性别"
 					},{
 						key:"personalInfo.birthday",
 						name:"年龄",
 						format:"age"
 					},{
 						key:"status.value",
 						name:"状态"
 					},{
						key:"operate",
						name:"操作", 	
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								Dialog.showComponent({
									title:"会员状态调整",
									confirm:function(){
										var memberStatus=widget.get("memberStatusAdjustForm").getValue("status");
										var stopDate=widget.get("memberStatusAdjustForm").getValue("stopDate");
										var memberStopReason=widget.get("memberStatusAdjustForm").getValue("stopReason");
										if(memberStatus){
											if(memberStatus=="Checkout"&&stopDate==""){
												$("#memberstatusadjust .J-form-memberstatusadjust-date-stopDate").parent().next().text("会员退住必须输入退住时间");
												return "NotClosed";
											}
											if(memberStatus=="Checkout"&&memberStopReason==""){
												$("#memberstatusadjust select.J-form-memberstatusadjust-select-stopReason").parent().next().text("会员退住必须输入退住原因");
												return "NotClosed";
											}else{
												aw.saveOrUpdate("api/member/statusAdjust",$("#memberstatusadjust").serialize(),function(data){
													var pkRoom=widget.get("memberStatusAdjustForm").getValue("pkRoom");
													widget.get("grid").refresh({ 
//														"memberSigning.room.pkRoom":data.memberSigning.room.pkRoom  
														"memberSigning.room.pkRoom":pkRoom  
													});
												});
											}
										}else{
											//TODO:后续提供统一处理
											$("#memberstatusadjust select.J-form-memberstatusadjust-select-status").parent().next().text("* 请输入调整状态");
											return "NotClosed";
										}
									},
									setStyle:function(){
										$(".el-dialog .modal.fade.in").css({
											"top":"10%",
											"width": "50%",
											"left": "20%"
										});
									}
								},
								widget.memberStatusAdjustForm(data)
								
								);
							}
						}]					
 					}]
 				}
    		 });
    		 this.set("grid",grid);
    	 },
    	 memberStatusAdjustForm:function(data){
				var memberStatusAdjustForm =  new Form({
					defaultButton:false,
					model:{
						id:"memberstatusadjust",
						defaultButton:false,
						items:[
						{
							name:"nowStatus",
							label:"当前状态",
							readonly:true,
							defaultValue:data.status.value
						},{
							name:"status",
							label:"调整状态",
							type:"select",
							url:"api/enum/com.eling.elcms.member.model.Member.Status",
							validate:["required"]
						},{
							name:"stopDate",
							label:"退住时间",
							type:"date",	
							validate:["required"]
						},{
							name:"stopReason",
							label:"退住原因",
							type:"select",
							url:"api/enum/com.eling.elcms.member.model.MemberSigning.StopReason",
							validate:["required"]
						},{
							name:"pkMember",
							defaultValue:data.pkMember, 
							type:"hidden"
						},{
							name:"pkRoom",
							defaultValue:data.memberSigning.room.pkRoom,
							type:"hidden"
						}]
					}
				
				});
				this.set("memberStatusAdjustForm",memberStatusAdjustForm);
				return memberStatusAdjustForm;
			},
	});
	module.exports = MemberStatusAdjust;
});
