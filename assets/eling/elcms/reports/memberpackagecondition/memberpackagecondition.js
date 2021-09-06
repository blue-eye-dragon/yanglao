define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var MultiRowGrid=require("multirowgrid");
	var emnu = require("enums");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-printgrid hidden' ></div>";
	var Service = ELView.extend({
		attrs:{
            template:template
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"套餐使用情况",
					items :[{
						id : "search",
						type : "search",
						placeholder : "按姓名或房间号搜索",
						handler : function(str){
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/report/memberpackagecondition",
								data:{
									"sc":str,
									searchProperties:"member.memberSigning.room.number, member.personalInfo.name,pkMember",
									fetchProperties:"*," +
													"name,"+
													"numberName,effectiveDate,expiryDate,packageName," +
													"surplusList.itemName," +
													"surplusList.count," +
													"surplusList.surplus",
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
						}
					},{
						id:"building",
   						tip:"楼宇",
   						type:"buttongroup",
   						keyField : "pkBuilding",
						valueField : "name",
						url : "api/building/query",
						params : function(){
							return {
								"useType":"Apartment",
								fecthProperties:"pkBuilding,name"
							};
						},
   						showAll:true,
   						showAllFirst:true,
   						handler:function(key,element){
   							widget.get("grid").refresh();
   						}
					},{
						 id:"status",
						 type:"buttongroup",
			   			 tip:"状态",
							items:[{
			                    key:"",
			                    value:"全部"
							},{
								key:"Init",
			                    value:"未生效"
							},{
			                    key:"Unarrange",
			                    value:"正常"
							},{
								key:"Unrepaired",
			                    value:"失效"
							}],
							handler:function(key,element){
								widget.get("grid").refresh();
							}
					},{
						id : "effectiveDate",
						tip : "生效日期",
						type : "daterange",
						ranges : {
							"上月": [moment().subtract(1,"month").startOf("year"),moment().subtract(1,"month").endOf("month")],
					        "本月": [moment().startOf("month"), moment().endOf("month")],
					        "本年": [moment().startOf("year"), moment().endOf("year")],
   					 		"去年": [moment().subtract(1,"year").startOf("year"),moment().subtract(1,"year").endOf("year")],
						},
						defaultRange : "本月",
						handler : function(){
							widget.get("grid").refresh();
						},
					},{
   						id:"print",
						type:"button",
						text:"打印",
						handler:function(index,data,rowEL){
							$(".J-grid").addClass("hidden");
							$(".J-grid-title").removeClass("hidden");
							$(".J-printgrid").removeClass("hidden");
							var time = widget.get("subnav").getValue("effectiveDate");
							var build=widget.get("subnav").getText("building");
							var title = moment(time.start).format("YYYY-MM-DD")+"至"+moment(time.end).format("YYYY-MM-DD")+"    楼宇:"+build+"";
							$(".J-printgrid-title").text(title);
							widget.get("subnav").hide(["search","status","effectiveDate","building","print"]);
							var data=widget.get("grid").getData();
							widget.get("printgrid").setData(data);
							window.print();
							$(".J-grid-title").addClass("hidden");
							$(".J-printgrid").addClass("hidden");
							$(".J-grid").removeClass("hidden");
							widget.get("subnav").show(["search","status","effectiveDate","building","print"]);
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var Summary_grid = new MultiRowGrid({
				parentNode:".J-grid",
				url : "api/report/memberpackagecondition",
				params:function(){
					return {
					"effective" : subnav.getValue("status"),
					"start": widget.get("subnav").getValue("effectiveDate").start,
					"end": widget.get("subnav").getValue("effectiveDate").end,
					"pkBuilding":subnav.getValue("building"),
					fetchProperties:"*," +
									"name,"+
									"numberName,effectiveDate,expiryDate,packageName," +
									"surplusList.itemName," +
									"surplusList.count," +
									"surplusList.surplus",
					}
				},
				model : {
					multiField:"surplusList",
					columns : [{
						name : i18ns.get("sale_ship_owner","会员"),
						key : "name",
						className:"oneHalfColumn",
						 format:function(value,row){
	                        	return row.roomNumber+" "+value;
	                        },
					},{
						name : "服务套餐",
						key : "packageName",
					},{
						name : "生效日期",
						key : "effectiveDate",
						format:"date",
					},{
						name : "失效日期",
						key : "expiryDate",
						format:"date",
					},{
						name : "状态",
						key : "status",
						format:function(value,row){
							if(moment(row.effectiveDate).startOf('day').isAfter(moment().valueOf(),"minutes")){
								return '未生效';
							}
							if(moment(moment()).isAfter(row.effectiveDate,"minutes")&&moment(row.expiryDate).endOf('day').isAfter(moment().valueOf(),"minutes")){
								return '正常';
							}else{
								return '失效';
							}
                        },
					},{
						key:"surplusList",
						name:"服务项目",
						multiKey:"itemName",
						isMulti:true,
					},{
						key:"surplusList",
						name:"总量",
						multiKey:"count",
						isMulti:true,
					},{
						key:"surplusList",
						name:"剩余量",
						multiKey:"surplus",
						isMulti:true,
					}]
				}
			});
			this.set("grid",Summary_grid);
			
			var printgrid = new MultiRowGrid({
				parentNode:".J-printgrid",
				isInitPageBar:false,
				model : {
					multiField:"surplusList",
					columns : [{
						name : i18ns.get("sale_ship_owner","会员"),
						key : "name",
						className:"oneHalfColumn",
						 format:function(value,row){
	                        	return row.roomNumber+" "+value;
	                        },
					},{
						name : "服务套餐",
						key : "packageName",
					},{
						name : "生效日期",
						key : "effectiveDate",
						format:"date",
					},{
						name : "失效日期",
						key : "expiryDate",
						format:"date",
					},{
						name : "状态",
						key : "status",
						format:function(value,row){
							if(moment(row.effectiveDate).startOf('day').isAfter(moment().valueOf(),"minutes")){
								return '未生效';
							}
							if(moment(moment()).isAfter(row.effectiveDate,"minutes")&&moment(row.expiryDate).endOf('day').isAfter(moment().valueOf(),"minutes")){
								return '正常';
							}else{
								return '失效';
							}
                        },
					},{
						key:"surplusList",
						name:"服务项目",
						multiKey:"itemName",
						isMulti:true,
					},{
						key:"surplusList",
						name:"总量",
						multiKey:"count",
						isMulti:true,
					},{
						key:"surplusList",
						name:"剩余量",
						multiKey:"surplus",
						isMulti:true,
					}]
				}
			});
			this.set("printgrid",printgrid);
		},
	});
	module.exports = Service;
});
