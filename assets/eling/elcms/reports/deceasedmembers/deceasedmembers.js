define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var Grid=require("grid");
	var aw = require("ajaxwrapper");
	require("../../grid_css.css");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>";
	//多语
	var i18ns = require("i18n");
	var deceasedmembers = ELView.extend({
		attrs:{
            template:template
		},
		events:{
			 "click .J-detail" : function(e){
				 var flg=$(e.target).attr("data-key3");
				 var pkMember=$(e.target).attr("data-key");
					this.openView({
						url:"eling/elcms/membercenter/memberstatus/memberstatus",
						params:{
							pkMember:pkMember,
							roomnumber:$(e.target).attr("data-key2"),
							name:$(e.target).attr("data-key4"),
							flg:"deceasedmembers",
						},
						isAllowBack:true
					});
				}
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"过世"+i18ns.get("sale_ship_owner","会员")+"明细",
					items:[{
						id:"time",
						type:"daterange",
        				tip:"过世日期",
   					 	ranges:{
   					 		"本年": [moment().startOf("year"), moment().endOf("year")],
   					 		"去年": [moment().subtract(1,"year").startOf("year"),moment().subtract(1,"year").endOf("year")],
   							"前年": [moment().subtract(2,"year").startOf("year"),moment().subtract(2,"year").endOf("year")],
   							},
   						defaultRange:"本年",
						minDate: "1990-05-31",
						maxDate: "2050-12-31",
						handler:function(time){
           					widget.get("grid").refresh();
   						}
   					},{
                        id : "toexcel",
   						type:"button",
                        text : "导出",
                        handler : function(){
                        	window.open("api/report/deceasedmembers/toexcel?start="+widget.get("subnav").getValue("time").start
                        			+ "&end="+widget.get("subnav").getValue("time").end); 
                        	return false;
                        }                    
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
				parentNode:".J-grid",
            	autoRender:false,
				model:{
				url : "api/report/deceasedmembers",
				params:function(){
					var subnav=widget.get("subnav");
					var time=subnav.getValue("time");
					return {
						start:time.start,
						end:time.end
					};
				},
				columns:[{						
						key : "date",
                        name : "过世日期",
                        format:"date",
						formatparams :{
							mode : "YYYY-MM-DD",
						},
                        className:"oneColumn"
					},{
						key:"number",
						name : "房号",
                        className:"oneColumn"
                    },{
						key : "name",
						name : "姓名",
						format:function(value,row){
							return "<a href='javascript:void(0);' style='color:red;' class='J-detail' data-key='"+row.pkMember+"'  data-key2='"+row.number+"' data-key3='memberOne' data-key4='"+row.number+" "+value+"' >"+value+"</a>";
						},
                        className:"oneColumn"
                    },{
						key : "sex",
						name : "性别",
						className:"halfColumn"
                    },{ 
						key:"birthday",
						name:"年龄",
						className:"halfColumn"
                    },{
						key : "idNumber",
						name : "证件号码",
                        className:"twoColumn"
                    },{
						key : "address",
						name : "居住地址",
                        className:"oneHalfColumn"
                    },{
						key : "diedPlace",
						name : "过世地点",
                        className:"oneColumn"
                    },{
						key : "causes",
						name : "过世原因",
                        className:"oneColumn"
                    },{
						key : "description",
						name : "备注",
                        className:"twoHalfColumn"
                    }]
				}
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			if(params&&params.start&&params.end){
				var time = {};
				time.start = params.start;
				time.end = params.end;
				widget.get("subnav").setValue("time",time);
			}
			widget.get("grid").refresh();
		},
		//openview时设置缓存,保存当时所选时间
		setEpitaph : function(){
			var time = this.get("subnav").getValue("time");
			return {
				start:time.start,
				end:time.end
			};
		}
	});
	module.exports = deceasedmembers;
});