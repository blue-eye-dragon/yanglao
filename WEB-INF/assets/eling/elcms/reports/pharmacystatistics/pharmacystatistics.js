/**
 * 用药统计
 */
define(function(require,exports,module){
	//多语
	var i18ns = require("i18n");
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var pkMedicine;
	var toExcelType;
	var flag;
	var fetchProper = "member.memberSigning.room.number,"+
	  "member.personalInfo.name,"+
	  "member.personalInfo.sex,"+
	  "member.personalInfo.birthday,"+
	  "member.memberSigning.checkInDate,"+
	  "diseaseDetails.name,"+
	  "medicine.name,"+
	  "direction,"+
	  "dosage,"+
	  "medicine.generalName," +
	  "startTime," +
	  "endTime"; 
	var pharmacystatistics=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"用药统计",
					//新增按疾病类型查询
					buttonGroup:[{
     				   id:"building",
     				   tip:"楼宇",
    				   showAll:true,
    				   showAllFirst:true,
    				   handler:function(key,element){
    					   widget.get("list").refresh({
							"medicine":pkMedicine,
							"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
							"flag":flag,
							fetchProperties : fetchProper 
    					   });
    				   }  
					},{
						id:"medicine",
						tip:"药品名称",
						showAll:true,
						showAllFirst:true,
						key:"pkMedicine",
						value:"name",
						url:"api/medicine/query",
						handler:function(key,element){
							widget.get("card").refresh();
						}
					},{
						id:"disease",
						tip:"疾病库",
						showAll:true,
						showAllFirst:true,
						key:"pkDiseaseDetail",
						value:"name",
						url:"api/diseasedetail/query",
						handler:function(key,element){
							widget.get("card").refresh();
						}
					}],
					buttons:[{
						id:"return",
						text:"返回",
						handler:function(){
							widget.list2Card(true);
							widget.get("subnav").hide(["return","building","toExcelList"]).show(["toExcelCard","disease","medicine"]);
						}
					},{
						id:"toExcelList",
						text:"导出",
						handler:function(){
							window.open("api/pharmacytakenotes/toexcel?medicine="+pkMedicine+
									"&member.memberSigning.room.building="+widget.get("subnav").getValue("building")+
									"&toExcelType="+toExcelType);
							return false;
						}	
					},{
						id:"toExcelCard",
						text:"导出",
						handler:function(){
							window.open("api/pharmacystatistics/toexcel?pkDiseaseDetail="+widget.get("subnav").getValue("disease")+
									"&pkMedicine="+widget.get("subnav").getValue("medicine"));
							return false;
						}	
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/pharmacytakenotes/querystatistics",
				autoRender : false,
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"member.memberSigning.room.number",
						name:"房间号",
					},{
						key:"member.personalInfo.name",
						name:"姓名"
					},{
						key:"member.personalInfo.sex.value",
						name:"性别",
					},{
						key:"member.personalInfo.birthday",
						name:"年龄",
						format:"age"
					},{
						key:"member.memberSigning.checkInDate",
						name:"入住日期",
						format:"date"
					},{
			        	key: "diseaseDetails" ,
			        	name:"疾病库",
			        	format:function(value,row){
			        		var name= "";
							if(value.length>0){
								for(var i =0 ;i<value.length;i++){
									if(i<value.length-1){
										name+= value[i].name+"、";
									}else{
										name+= value[i].name;
									}
								}
							}else{
								name="无";
							}
							return name;
						}
			        },{
						key:"direction",
						name:"用法"
					},{
						key:"dosage",
						name:"剂量"
					},{
						key:"startTime",
						name:"开始时间",
						format:"date"
					},{
						key:"endTime",
						name:"结束时间",
						format:"date"
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				url:"api/pharmacystatistics/query",
				compType:"grid",
				isInitPageBar:false,
				params : function(){
					var subnav=widget.get("subnav");
					return {
						pkDiseaseDetail:subnav.getValue("disease"),
						pkMedicine:subnav.getValue("medicine"),
						fetchProperties:"*"
					}
				},
				model:{
					columns:[{
						key:"medicineName",
						name:"药品名称",
						col:3
					},{
						key:"specification",
						name:"药品规格",
					},{
						key:"diseaseName",
						name:"疾病库",
						col:4
					},{
						key:"allPharmacy",
						name:"用药"+i18ns.get("sale_ship_owner","会员")+"数",
						className : "text-right",
						format:"detail",
						formatparams:[{
							key:"allPharmacy",
							handler:function(index,data,rowEle,e){
								if(data.allPharmacy == 0){
									return false;
								}
								var list=widget.get("list");
								widget.list2Card(false);
								widget.get("subnav").hide(["toExcelCard","disease","medicine"]).show(["return","building","toExcelList"]);
								widget.get("list").setTitle(data.medicineName+"——用药"+i18ns.get("sale_ship_owner","会员")+"信息");
								pkMedicine=data.pkMedicine;
								toExcelType = "";
								flag = "";
								list.refresh({
									"medicine":data.pkMedicine,
									fetchProperties : fetchProper, 
								});
							}
						}],
					},{
						key:"pharmacying",
						name:"服用中"+i18ns.get("sale_ship_owner","会员")+"数",
						className : "text-right",
						format:"detail",
						formatparams:[{
							key:"pharmacying",
							handler:function(index,data,rowEle,e){
								if(data.pharmacying == 0){
									return false;
								}
								var list=widget.get("list");
								widget.list2Card(false);
								widget.get("subnav").hide(["toExcelCard","disease","medicine"]).show(["return","building","toExcelList"]);
								widget.get("list").setTitle(data.medicineName+"——服用中"+i18ns.get("sale_ship_owner","会员")+"信息");
								pkMedicine=data.pkMedicine;
								toExcelType = "pharmacying";
								flag = "pharmacying";
								list.refresh({
									"medicine":data.pkMedicine,
									"flag":"pharmacying",
									fetchProperties : fetchProper, 
								});
							}
						}],
					},{
						key:"stopPharmacy",
						name:"停用"+i18ns.get("sale_ship_owner","会员")+"数",
						className : "text-right",
						format:"detail",
						formatparams:[{
							key:"stopPharmacy",
							handler:function(index,data,rowEle,e){
								if(data.stopPharmacy == 0){
									return false;
								}
								var list=widget.get("list");
								widget.list2Card(false);
								widget.get("subnav").hide(["toExcelCard","disease","medicine"]).show(["return","building","toExcelList"]);
								widget.get("list").setTitle(data.medicineName+"——停用"+i18ns.get("sale_ship_owner","会员")+"信息");
								pkMedicine=data.pkMedicine;
								toExcelType = "stopPharmacy";
								flag = "stopPharmacy";
								list.refresh({
									"medicine":data.pkMedicine,
									"flag":"stopPharmacy",
									fetchProperties : fetchProper, 
								});
							}
						}],
					}]
				}
			};
		},
		afterInitComponent:function(params,widget){
			widget.get("subnav").hide(["building","toExcelList","return"]);
			aw.ajax({
				url:"api/pharmacystatistics/query",
				data:{
					
					fetchProperties:"*"
				},
				dataType:"json",
				success:function(data){
					if(data){
						widget.get("card").setData(data);
					}
					widget.list2Card(true);
					widget.get("subnav").hide(["return"]);
				}
			})
		},
	});
	
	module.exports=pharmacystatistics;
});