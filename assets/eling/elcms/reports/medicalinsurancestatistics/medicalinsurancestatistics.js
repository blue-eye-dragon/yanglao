/**
 *	会员医保类型报表
 * 
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var Grid=require("grid-1.0.0");
	require("../../grid_css.css");
	var MedicalInsuranceStatistics = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"
				+"<div class='J-list'></div>"
				+"<div class='J-detail hidden'></div>"
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"医保类型统计",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-list").hide(".J-detail");
							widget.get("subnav").hide(["return"]);
							return false;
						} 
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				parentNode:".J-list",
				autoRender : false,
				url:"api/report/medicalinsurancestatistics",
				model:{
					colHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.name;
							}
						}
					},
					rowHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.name;
							}
						}
					},
					datas : {
						id:"count",
						cols : [{
							className : "text-right",
							format : "defaultZero"
						}],
						click : function(data){
							//点击单元格事件，data就是你查回来的本单元格对应的数据
							console.dir(data);
							widget.show(".J-detail").hide(".J-list");
							widget.get("subnav").show(["return"]);
							widget.get("detail").refresh({
								"pkBuilding" :(data.building.pkBuilding==-1 ? "":data.building.pkBuilding),
								"pkMedicalInsurance" :(data.medicalType.pkMedicalInsurance==-1 ? "":data.medicalType.pkMedicalInsurance)});
						}
					}
				}
			});
			this.set("grid",grid);	
			
			var detail=new Grid({
				parentNode:".J-detail",
				autoRender:false,
				url:"api/healthdata/querymedicalinsurance",
				fetchProperties:"member.personalInfo.name," +
						"member.memberSigning.room.number," +
						"member.personalInfo.birthday," +
						"member.personalInfo.sex," +
						"member.personalInfo.phone," +
						"member.personalInfo.mobilePhone," +
						"memMedicalInsurance.name," +
						"memMedicalInsurance.pkMedicalInsurance," +
						"memberHospitals.name",
				model:{
					columns:[{
						key:"member.personalInfo.name",
						name:"会员",
						className:"twoColumn",
						format:function(value,row){
							return row.member.memberSigning.room.number + " " +row.member.personalInfo.name;
						}
					},{
						key:"member.personalInfo.birthday",
						name:"年龄",
						format:"age",
						className:"oneColumn"
					},{
						key:"member.personalInfo.sex.value",
						name:"性别",
						className:"oneColumn"
					},{
						key:"member.personalInfo.phone",
						name:"电话",
						className:"twoColumn",
						format:function(value,row){
							var str = "";
							if (row.member.personalInfo.phone){
								str += row.member.personalInfo.phone;
							}
							if (row.member.personalInfo.phone&&row.member.personalInfo.mobilePhone){
								str += "/";
							}
							if (row.member.personalInfo.mobilePhone){
								str += row.member.personalInfo.mobilePhone;
							}
							return str;
						}
					},{
						key:"memMedicalInsurance.name",
						name:"医保类型",
						className:"threeColumn"
					},{
						key:"memberHospitals",
						name:"定点医院",
						className:"threeColumn",
						format:function(value,row){
							var str = "";
							if(row.memberHospitals.length>0){
								for(var i=0;i<row.memberHospitals.length;i++){
									if(i==row.memberHospitals.length-1){
										str+=row.memberHospitals[i].name;
									} else {
										str+=row.memberHospitals[i].name+"、";
									}
								}
							}
							return str;
						}
					}]
				}
			});
			this.set("detail",detail);	
		},
		afterInitComponent:function(params,widget){
			widget.get("grid").refresh();
		},

	});
	module.exports = MedicalInsuranceStatistics;
});