define(function(require, exports, module) {
	 var Dialog=require("dialog-1.0.0");
	    var aw = require("ajaxwrapper");
	    var Form =require("form-2.0.0")
	    var ELView=require("elview");
		var Subnav = require("subnav-1.0.0"); 
		var Grid = require("grid-1.0.0");
		var store = require("store");
		var activeUser = store.get("user");
	    var template="" +
	     "<div class='J-subnav'></div>"+
		 "<div class='J-grid'></div>"+
		 "<div class='J-form hidden'></div>"+
		 "<div class='J-gridDetail hidden'></div>" +
		 "<div class='J-formDetail hidden'></div>" +
		 "<div class='J-formRDetail hidden'></div>" +
		 "<div class='J-gridRDetail hidden'></div>";
	var checkoutrepair = ELView.extend({
		attrs:{
        	template:template
        },
        events : {
			"change .J-form-repair-select-repairClassify":function(e){
				var form=this.get("formDetail");
				var data=form.getData("repairClassify",{
					pk:form.getValue("repairClassify")
				});
				form.setValue("repairClassifyRemark",data ? data.description : "");
			},
        
	        "change .J-form-checkoutrepair-date-expectedDate":function(e){
				var form=this.get("form");
				var expectedDate=form.getValue("expectedDate");
				var memberSigningstopDate = form.getValue("memberSigningstopDate");
				if(expectedDate<moment(memberSigningstopDate)){
					Dialog.alert({
						content:"计划完成日期不能早于退房日期！"
					});
					form.setValue("expectedDate",moment().valueOf());
					return;
				}
			},
			
			"change .J-form-repair-date-createDate":function(e){
				var form=this.get("form");
				var formDetail=this.get("formDetail");
				var createDate = formDetail.getValue("createDate");
				var memberSigningstopDate = form.getValue("memberSigningstopDate");
				if(moment(createDate)<moment(memberSigningstopDate)){
					Dialog.alert({
						content:"报修时间不能早于退房日期！"
					});
					formDetail.setValue("createDate",moment().valueOf());
					return;
				}
			}
		},
        initComponent:function(params,widget){
        	
        	var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"退房维修",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url : "api/checkoutrepair/search",
							data : {
								s : str,
								orderString:"memberSigning.stopDate:desc",
								properties : "memberSigning.room.number,status,description",
								fetchProperties:"*,pkCheckOutRepair," +
								"memberSigning.room.number,memberSigning.pkMemberSigning," +
								"memberSigning.room.pkRoom," +
								"memberSigning.stopDate," +
								"repairs," +
								"version," +
								"repairs.place.name," +
								"repairs.repairClassify.name," +
								"repairs.repairClassify.pkRepairClassify," +
								"repairs.repairClassify.description," +
								"repairs.assetCard.code," +
								"repairs.repairNo," +
								"repairs.pkRepair," +
								"repairs.place.pkPlace," +
								"repairs.repairFrom," +
								"repairs.content," +
								"repairs.ifSignificant," +
								"repairs.flowStatus.value," +
								"repairs.flowStatus," +
								"repairs.repairDetails.createDate," +
								"repairs.repairDetails.operateType," +
								"repairs.repairDetails.user.name" ,
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
							}
						});
					
					},
					buttonGroup:[{
						id:"building",
						showAll:true, 
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id:"flowStatus",
						tip : "维修状态",
						items:[{
							value:"全部"
						},{
							key:"Init",
							value:"初始"
						},{
							key:"Repairing",
							value:"维修中"
						},{
							key:"End",
							value:"完成"
						}],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
					buttons:[{
						id:"return",
        				text:"返回",
						show:false,
						handler:function(){
							widget.get("grid").refresh();
							widget.show([".J-grid"]).hide([".J-form",".J-formDetail",".J-gridDetail"]);
							widget.get("subnav").hide(["return","save"]).show(["building","flowStatus","time","search"]);
							return false;
						}
					},{
						id:"return2",
        				text:"返回",
						show:false,
						handler:function(){
							widget.get("grid").refresh();
							widget.get("subnav").show(["save"]);
							widget.show([".J-form",".J-gridDetail",".J-return"]).hide([".J-grid",".J-gridRDetail",".J-formDetail",".J-return2",".J-formRDetail",".J-gridRDetail","save"]);
							return false;
						}
					},{
						id:"save",
        				text:"保存",
						show:false,
						handler:function(){
			    			aw.saveOrUpdate("api/checkoutrepair/save",$("#checkoutrepair").serialize(),function(data){
			    				widget.get("grid").refresh();
			    			});
			    			widget.get("subnav").show(["building","time","flowStatus","search"]).hide(["return","save"]);
							widget.show([".J-grid"]).hide([".J-form",".J-formDetail",".J-gridDetail"]);
						}
					}],
					time:{
						tip : "退房日期",
					 	ranges:{
					 		"今年": [moment().startOf("year"), moment().endOf("year")] ,
							},
						defaultTime:"今年",
        				click:function(time){
        					widget.get("grid").refresh();
						}
					},
				}
        	});
        	this.set("subnav",subnav);
        	var grid=new Grid({
    			parentNode:".J-grid",
				url:"api/checkoutrepair/query",
				fetchProperties:"*,pkCheckOutRepair," +
				"memberSigning.room.number,memberSigning.pkMemberSigning," +
				"memberSigning.room.pkRoom," +
				"memberSigning.stopDate," +
				"repairs," +
				"version," +
				"repairs.place.name," +
				"repairs.repairClassify.name," +
				"repairs.repairClassify.pkRepairClassify," +
				"repairs.repairClassify.description," +
				"repairs.assetCard.code," +
				"repairs.repairNo," +
				"repairs.pkRepair," +
				"repairs.place.pkPlace," +
				"repairs.repairFrom," +
				"repairs.content," +
				"repairs.ifSignificant," +
				"repairs.flowStatus.value," +
				"repairs.flowStatus," +
				"repairs.repairDetails.createDate," +
				"repairs.repairDetails.operateType," +
				"repairs.repairDetails.user.name" ,
				params:function(){
					return {
						pkCheckOutRepair:params?params.modelId:"",
						"memberSigning.stopDate":widget.get("subnav").getValue("time").start,
						"memberSigning.stopDateEnd":widget.get("subnav").getValue("time").end,
						orderString:"memberSigning.stopDate:desc",
						"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
						status:widget.get("subnav").getValue("flowStatus")
					};
				},
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.get("form").reset();
								data.memberSigningstopDate=moment(data.memberSigning.stopDate).format("YYYY-MM-DD");
								widget.get("form").setData(data);
								widget.get("form").setValue("stat",data.status.value);
								widget.get("form").setValue("memberSigning",data.memberSigning.pkMemberSigning);
								widget.get("gridDetail").setData(data.repairs);
								widget.get("form").setDisabled(true);
								widget.hide([".J-grid",".J-formDetail",".J-flowStatus",".J-grid-head-add"]).show([".J-form",".J-gridDetail"]);
								widget.get("subnav").show(["return"]).hide(["building","flowStatus","time","search"]);
							}
						}]
					},{
							key:"memberSigning.stopDate",
							name:"退房日期 ",
							format:"date"
						},{
						key:"expectedDate",
						name:"计划完成日期 ",
						format:"date"
					},{
							key:"status.value",
							name:"维修状态"
						},{
							key:"description",
							name:"描述",
							col:6
						},{

							key:"operate",
							name:"操作",
							format:function(value,row){
								if(row.status.key =="Init"){
									return "button";
								}else{
									return "";
								}   
								},
							formatparams:[{
								key:"detil",
								icon:"edit",
								handler:function(index,data,rowEle){
									widget.get("form").reset();
									data.memberSigningstopDate=moment(data.memberSigning.stopDate).format("YYYY-MM-DD");
									widget.get("form").setData(data);
									widget.get("form").setValue("stat",data.status.value);
									widget.get("form").setValue("memberSigning",data.memberSigning.pkMemberSigning);
									widget.get("gridDetail").setData(data.repairs);
									widget.hide([".J-grid",".J-formDetail"]).show([".J-form",".J-gridDetail",".J-grid-head-add"]);
									widget.get("subnav").hide(["building","flowStatus","time","search"]).show(["return","save"]);
								}
							},{
								key:"commit",
								text:"提交", 
								handler:function(index,data,rowEle){
									if(data.repairs.length == 0){
										Dialog.alert({
											content:"至少填入一条维修项目才能提交！"
										});
										return false;
									}
									Dialog.confirm({
										setStyle:function(){},
										content:"是否确认提交？提交后数据不可再修改！",
										confirm:function(){
											aw.ajax({
												url:"api/checkoutrepair/commit",
												data:{
													pkCheckOutRepair:data.pkCheckOutRepair,
												},
												dataType:"json",
												success:function(datas){
													widget.get("grid").refresh();
								 				}
											});
										}
									});
								}
							
							}]
						}]
				}
        	});
        	this.set("grid",grid);
        	
        	var form = new Form({
        		parentNode:".J-form",
    			cancelaction:function(){
    				widget.show([".J-grid"]).hide([".J-form",".J-formDetail",".J-gridDetail"]);
    				widget.get("subnav").show(["building","time","flowStatus","search"]).hide(["return"]);
    			},
        		model:{
        			id:"checkoutrepair",
        			defaultButton:false,
        			items:[{
         				name:"pkCheckOutRepair",
         				type:"hidden"
         			},{
         				name:"memberSigning.room.pkRoom",
         				type:"hidden"
         			},{
         				name:"version",
         				type:"hidden"
         			},{
         				name:"memberSigning",
         				type:"hidden"
         			},{
         				name:"memberSigning.room.number",
         				label:"房间号",
         				type:"text",
         				readonly:true,
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"expectedDate",
						label:"计划完成日期 ",
         				type:"date",
         				mode:"Y-m-d",
         				validate:["required"],
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"memberSigningstopDate",
						label:"退房日期 ",
						readonly:true,
         				className:{
							container:"col-md-6",
							label:"col-md-4"
						},
         			},{
         				name:"stat",
						label:"维修状态",
						readonly:true,
						className:{
							container:"col-md-6",
							label:"col-md-4"
						}
         			},{
         				name:"description",
						label:"描述",
						type:"textarea",
						className:{
							container:"col-md-6",
							label:"col-md-4"
						},
         			}]
        		}
        	})
        	this.set("form",form);
        	
        	var formDetail = new Form({
        		parentNode:".J-formDetail",
				saveaction:function(){
					var formDetail=widget.get("formDetail");
					var pkRepairClassify=formDetail.getValue("repairClassify");
					var data=formDetail.getData("repairClassify",{
						pk:pkRepairClassify
					});
					if(data.formDetail && !formDetail.getValue("assetCard")){
						//说明该分类要求必须要有资产卡片
						Dialog.tip({
							title:"必须选择资产卡片"
						});
						return;
					}else{
						var datas = $("#repair").serialize();
						if(datas.indexOf("createDate")<0){
							datas = datas+"&createDate="+formDetail.getValue("createDate");
						}
						if(datas.indexOf("ifSignificant")<0){
							datas = datas+"&ifSignificant="+formDetail.getValue("ifSignificant");
						}
						aw.saveOrUpdate("api/repair/savecheckout",datas,function(data){
							widget.get("form").setValue("version",(parseInt(widget.get("form").getValue("version"))+1));
	    					widget.get("grid").refresh(null,function(datas){
	    						for(var i = 0; i < datas.length ;i ++)
	    							if(datas[i].memberSigning.room.number == widget.get("form").getValue("memberSigning.room.number")){
	    								widget.get("gridDetail").setData(datas[i].repairs);
	    								return false;
	    							}
	    					});
	    				});
					} 
					widget.show([".J-form",".J-gridDetail",".J-return"]).hide([".J-grid",".J-formDetail",".J-gridRDetail"]);
					widget.get("subnav").show(["save"]);
				},
				//取消按钮
  				cancelaction:function(){
  					widget.show([".J-form",".J-gridDetail",".J-return"]).hide([".J-grid",".J-formDetail",".J-gridRDetail", ".J-return2"]);
  					widget.get("subnav").show(["save"]);
  				},
				model:{
					id:"repair",
					items:[{
						name:"pkRepair",
						type:"hidden",
					},{
						name:"repairNo",
						type:"hidden",
					},{
						name:"flowStatus",
						type:"hidden",
					},{
						name:"pkCheckOutRepair",
						type:"hidden",
					},{
						name:"repairFrom",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"place",
						type:"hidden",
					},{
						name:"placeName",
						label:"位置",
						readonly:true
					},{
						name:"repairClassify",
						label:"分类",
						url:"api/repairclassify/query",
						key:"pkRepairClassify",
						value:"name",
						type:"select",
						validate:["required"]
					},{
						name:"repairClassifyRemark",
						label:"分类详情",
						readonly:true,
						placeholder:" "
					},{
						name:"assetCard",
						label:"资产卡片",
						url:"api/assetcard/queryForRepair",
						key:"pkAssetCard",
						value:"code",
						type:"select",
						lazy:true
					},{
						name:"createDate",
						label:"报修时间",
						type:"date",
						mode:"Y-m-d H:i",
						validate:["required"],
						defaultValue:moment()
					},{
						name:"ifSignificant",
						label:"重大维修",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}],
						defaultValue:"false",
						validate:["required"],
					},{
						name:"content",
						label:"内容",
						type:"textarea",
						validate:["required"]
					}]
				}
        	})
        	this.set("formDetail",formDetail);
        	
        	var gridDetail=new Grid({
        		parentNode:".J-gridDetail",
        		model:{
        			head:{
						title:"报修明细", 
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								widget.hide([".J-gridDetail",".J-form",".J-return","save"]).show([".J-formDetail"]);
								widget.get("subnav").hide(["save"]);
								widget.get("formDetail").reset();
								widget.get("formDetail").setValue("placeName",widget.get("form").getValue("memberSigning.room.number"));
								widget.get("formDetail").setValue("pkCheckOutRepair",widget.get("form").getValue("pkCheckOutRepair"));
								widget.get("formDetail").setValue("ifSignificant","false");
								aw.ajax({
									url:"api/place/query",
									data:{
										building:widget.get("subnav").getValue("building"),
										"room.pkRoom":widget.get("form").getValue("memberSigning.room.pkRoom")
									},
									dataType:"json",
									success:function(datas){
										widget.get("formDetail").setValue("place",datas[0].pkPlace);
									}
								});
							}
						}]
					},
				columns:[{
					key:"repairNo",
					name:"报修单号",
					format:"detail",
					formatparams:[{
						key:"detail",
						handler:function(index,data,rowEle){
							widget.get("gridRDetail").refresh({
								"repair.pkRepair":data.pkRepair,
								fetchProperties:"*,user.name,maintainer.name"
							});
							data.repairClassifyRemark=data.repairClassify.description;
							widget.get("formRDetail").reset();
							widget.get("formRDetail").setData(data);
							widget.get("formRDetail").setValue("ifSignificant",data.ifSignificant == "true" ? "是":"否");
							widget.get("formRDetail").setDisabled(true);
							widget.get("subnav").hide(["save"]);
							widget.show([".J-gridRDetail",".J-return2",".J-formRDetail"]).hide([".J-return",".J-toexcel",".J-adds",".J-grid",".J-time",".J-search",".J-building",".J-form",".J-gridDetail"]);
						}
					}]
				},{
					key:"place.name",
					name:"位置"
				},{
					key:"repairClassify.name",
					name:"分类"
				},{
					key:"assetCard.code",
					name:"资产卡片"
				},{
					key:"content",
					name:"内容",
					col:3
				},{
					key:"repairDetails",
					name:"报修时间",
					format:function(value,row){
						var time="";
						for(var i=0;i<value.length;i++){
							if(value[i].operateType.key == "RepairClaiming"){
								time = moment(value[i].createDate).format("YYYY-MM-DD");
								break;
							}
						}
						return time;
 					},
				},{
					key:"ifSignificant",
					name:"重大维修",
					format:function(value,row){
						return value ? "是" : "否";
					}
				},{
					key:"repairFrom.value",
					name:"报修来源"
				},{
					key:"flowStatus.value",
					name:"报修状态"
				},{
					key:"repairDetails",
					name:"报修人",
					format:function(value,row){
						var name="";
						for(var i=0;i<value.length;i++){
							if(value[i].operateType.key == "RepairClaiming"){
								name = value[i].user.name;
								break;
							}
						}
						return name;
 					},
				},{
					key:"flowStatus",
					name:"操作",
					format:function(value,row){
						if(value.key=="Init"){
				          return "button";  
						}else{
							return "";
						}
					},
					formatparams:[{
						key:"edits",
						icon:"edit",
						handler:function(index,data,rowEle){
							data.repairClassifyRemark=data.repairClassify.description;
							widget.get("formDetail").setData(data);
							var time="";
							for(var i=0;i<data.repairDetails.length;i++){
								if(data.repairDetails[i].operateType.key == "RepairClaiming"){
									time = data.repairDetails[i].createDate;
									break;
								}
							}
							widget.get("formDetail").setAttribute("repairClassify","readonly","readonly");
							widget.get("formDetail").setAttribute("ifSignificant","disabled","disabled");
							widget.get("formDetail").setAttribute("createDate","disabled","disabled");
							widget.get("formDetail").setValue("createDate",time);
							widget.get("formDetail").setValue("place",data.place.pkPlace);
							widget.get("formDetail").setValue("placeName",data.place.name);
							widget.get("gridRDetail").refresh({
								"repair.pkRepair":data.pkRepair,
								fetchProperties:"*,user.name,maintainer.name"
							});
							widget.get("subnav").hide(["save"]);
							widget.show([".J-formDetail",".J-gridRDetail"]);
							widget.hide([".J-adds",".J-return",".J-grid",".J-time",".J-form",".J-gridDetail"]);
						}
					},{
						key:"delete",
						icon:"remove",
						handler:function(index,data,rowEle){
							Dialog.confirm({
								setStyle:function(){},
								content:"确认删除？",
								confirm:function(){
									aw.ajax({
		           						url:"api/checkoutrepair/deleterepair",
		           						data:{
		           							pkCheckOutRepair:widget.get("form").getValue("pkCheckOutRepair"),
		           							pkRepair:data.pkRepair,
		           							fetchProperties:"*,pkCheckOutRepair," +
		    								"memberSigning.room.number,memberSigning.pkMemberSigning," +
		    								"memberSigning.room.pkRoom," +
		    								"memberSigning.stopDate," +
		    								"repairs," +
		    								"version," +
		    								"repairs.place.name," +
		    								"repairs.repairClassify.name," +
		    								"repairs.repairClassify.pkRepairClassify," +
		    								"repairs.repairClassify.description," +
		    								"repairs.assetCard.code," +
		    								"repairs.repairNo," +
		    								"repairs.pkRepair," +
		    								"repairs.place.pkPlace," +
		    								"repairs.repairFrom," +
		    								"repairs.content," +
		    								"repairs.ifSignificant," +
		    								"repairs.flowStatus.value," +
		    								"repairs.flowStatus," +
		    								"repairs.repairDetails.createDate," +
		    								"repairs.repairDetails.operateType," +
		    								"repairs.repairDetails.user.name" ,
		           						},
		           						dataType:"json",
		           						success:function(datas){
		           							widget.get("form").setValue("version",(parseInt(widget.get("form").getValue("version"))+1));
		           							widget.get("gridDetail").setData(datas.repairs);
		           						}
		           					});
								}
							});
							
						}
					}]
				}]
        	}
			
        	})
        	this.set("gridDetail",gridDetail);
        	var formRDetail = new Form({
    			parentNode:".J-formRDetail",
    			model:{
    				id:"formRDetail",
    				items:[{
    					name:"place.name",
    					label:"位置",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					},
    				},{
    					name:"repairClassify",
    					label:"分类",
    					url:"api/repairclassify/query",
    					key:"pkRepairClassify",
    					value:"name",
    					type:"select",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"assetCard",
    					label:"资产卡片",
    					url:"api/assetcard/queryForRepair",
    					key:"pkAssetCard",
    					value:"code",
    					type:"select",
    					lazy:true,
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"ifSignificant",
    					label:"重大维修",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					}
    				},{
    					name:"content",
    					label:"内容",
    					type:"textarea",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					},
    				},{
    					name:"flowStatus.value",
    					label:"状态",
    					className:{
    						container:"col-md-6",
    						label:"col-md-4"
    					},
    				}]
    			}
    		})
    		this.set("formRDetail",formRDetail);
        	
        	var gridRDetail=new Grid({
    			parentNode:".J-gridRDetail",
    			autoRender : false,
    			url:"api/repairdetail/query",
    			model:{
    				columns:[{
    					key:"createDate",
    					name:"操作时间",
    					className:"col-md-2",
    					format:"date",
    					formatparams:{
    						mode:"YYYY-MM-DD HH:mm:ss"
    					}
    				},{
    					key:"user.name",
    					className:"col-md-1",
    					name:"经手人"
    				},{
    					key:"operateType.value",
    					className:"col-md-1",
    					name:"操作类型"
    				},{
    					key:"maintainer.name",
    					className:"col-md-1",
    					name:"维修工"
    				},{
    					key:"expectedDate",
    					name:"预计维修日期",
    					className:"col-md-2",
    					format:"date"
    				},{
    					key:"startDate",
    					name:"实际开始日期",
    					className:"col-md-2",
    					format:"date"
    				},{
    					key:"finishDate",
    					name:"实际结束日期",
    					className:"col-md-2",
    					format:"date"
    				},{
    					key:"description",
    					className:"col-md-5",
    					name:"说明"
    				}]
    			},
    		})
    		this.set("gridRDetail",gridRDetail);
        },
	});
	module.exports = checkoutrepair;
});
