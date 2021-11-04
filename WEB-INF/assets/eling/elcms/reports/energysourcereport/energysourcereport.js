/**
 *	能源月报
 * 
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var ReportGrid=require("reportgrid");
	var EnergySourceReport = ELView.extend({
		attrs:{
			template:"<div class='J-subnav'></div>"
				+"<div class='J-list'></div>"
		},
		_setTitle:function(widget){
			var year = widget.get("subnav").getValue("year");
			var month = widget.get("subnav").getValue("month");
			var monthFirstDay= year + (month?("-" +month):"");
			var title=moment(monthFirstDay).format("YYYY年"+(month?(month+"月"):"")+"能源月报");
			widget.get("subnav").setTitle(title);
		},
		initComponent:function(params,widget){
			var min=moment().format("YYYY年能源月报");
			var model=this.get("model");
			var itemsYear=[];
			for(var i=0;i<=moment().format("YYYY")-2007;i++){
				var obj={};
				obj.key=parseInt(moment().format("YYYY"))-parseInt(i);
				obj.value=parseInt(moment().format("YYYY"))-parseInt(i);
				itemsYear.push(obj);
			}
			var itemsMonth=[{
				key:01,value:"一月"
			},{
				key:02,value:"二月"
			},{
				key:03,value:"三月"
			},{
				key:04,value:"四月"
			},{
				key:05,value:"五月"
			},{
				key:06,value:"六月"
			},{
				key:07,value:"七月"
			},{
				key:08,value:"八月"
			},{
				key:09,value:"九月"
			},{
				key:10,value:"十月"
			},{
				key:11,value:"十一月"
			},{
				key:12,value:"十二月"
			}];
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:min,
					buttonGroup:[{
						   id:"year",
						   items:itemsYear,	
						   handler:function(key,element){
							   widget.get("grid").refresh();
							   widget._setTitle(widget);							   
						   }
					   },{
						   id:"month",
						   items:itemsMonth,
						   showAll:true,
						   showAllFirst:true,	
						   handler:function(key,element){
							   widget.get("grid").refresh();
							   widget._setTitle(widget);
						   }
					   }],
//					buttons:[{
// 						id:"toexcel",
// 						text:"导出",
// 						handler:function(){ 
//						var year = widget.get("subnav").getValue("year");
//						var month = widget.get("subnav").getValue("month");
//						window.open("api/report/energysourcereport/toexcel?year="+year+"&month="+month);
// 							return false;
// 	 					}				
// 					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new ReportGrid({
				parentNode:".J-list",
				autoRender : false,
				url:"api/report/energysourcereport",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						year:subnav.getValue("year"),
						month:subnav.getValue("month"),
						fetchProperties:"*,data.building.name"
					}
				},
				model:{
					colHeaders : {
						format : function(data,level){
							if(level == 0){
								return data.value;
							}else if (level == 1){
								return data.value;
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
						id:"money",
						cols : [{
							className : "text-right",
							format : "thousands",
							formatparams:{
								precision:2
							}
						}],
//						click : function(data){
//							//点击单元格事件，data就是你查回来的本单元格对应的数据
//							console.dir(data);
//							widget.openView({
//								url:"",
//								params:{
//								},
//								isAllowBack:true
//							});
//						}
					}
				}
			});
			this.set("grid",grid);			
		},
		afterInitComponent:function(params,widget){
			var year,month;
			//当页面回调时
			if(params){
				year = params.year;
				month = params.month;
				widget.get("subnav").setValue("year",year);
				widget.get("subnav").setValue("month",month);
				widget._setTitle(widget);
			}else{
				widget.get("subnav").setValue("year",moment().year());
//				widget.get("subnav").setValue("month",moment().month()+1);
				widget._setTitle(widget);
			}
			widget.get("grid").refresh();
		},
		//openview时设置缓存,保存当时所选时间
		setEpitaph : function(){
			return {
				month:this.get("subnav").getValue("month"),
				year:this.get("subnav").getValue("year")
			};
		}
	});
	module.exports = EnergySourceReport;
});