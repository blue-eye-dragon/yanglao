
define(function(require, exports, module) {
	var ElView=require("elview");
    var aw = require("ajaxwrapper");
    var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog");
	var Form =require("form");
	var template=require("./dutySchedulingManagerList.tpl");
	var cache = {};
	
	/*查询用户对应部门*/
	function setTable(model,year,month){
		var months=[];
		var monthsWeek=[];
		var dat=year+"-"+month;
		$(".J-component-time").text(year+"年"+month+"月");
		var start=moment(dat).startOf('month').valueOf();
		var end=moment(dat).endOf('month').valueOf();
		var endMonth=moment(dat).endOf('month').format('Do');
		for(var i=1;i<=parseInt(endMonth.substring(0, endMonth.length-2));i++){
			var obj={};
			obj.key=i;
			obj.value=i;
			var week={};
			week.key=i;
			var date=year+"-"+month+"-"+i;
			var n = moment(date).day();
			switch(n){
			    case 1:
			    	week.wvalue='一';
			        break;
			    case 2:
			    	week.wvalue='二';
			        break;
			    case 3:
			    	week.wvalue='三';
			        break;
			    case 4:
			    	week.wvalue='四';
			        break;
			    case 5:
			    	week.wvalue='五';
			        break;
			    case 6:
			    	week.wvalue='六';
			        break;
			    case 0:
			    	week.wvalue='日';
			        break;
			}
			months.push(obj);
			monthsWeek.push(week);
		}
		model.months=months;
		model.monthsWeek=monthsWeek;
	}
	function setTableData(model,year,month,aw,widget){
		var dat=year+"-"+month;
		var start=moment(dat).startOf('month').valueOf();
		var end=moment(dat).endOf('month').valueOf();
		aw.ajax({
			url : "api/dutyScheduling/queryman",
			type : "POST",
			data : {
				"dutyDate":start,
				"dutyDateEnd":end,
				"schedulType":"DutyManager",
				fetchProperties:"dutylist.pkDutyScheduling,"+
				"user.user.pkUser,user.user.name,user.icon," +
				"summary.dutyType.pkDutyType," +
				"summary.dutyType.name," +
				"summary.count," +
				"dutylist.dutyType.pkDutyType," +
				"dutylist.dutyType.name," +
				"dutylist.dutyType.color," +
				"dutylist.dutyDate,"+
				"dutylist.ifDuty,"+
		        "dutylist.version,"+
				"remark.pkDutySchedulingRemark," +
		        "remark.remark," +
		        "remark.version"
			},
			success : function(datas) {
				var count=[];
				var dat=[];
				if(datas.length!=0){
					for(var i=0;i<datas[0].summary.length;i++){
						var co={
								name:datas[0].summary[i].dutyType.name
						}
						count.push(co);
					}
					var mm={
							type:"值班经理",
							user:datas[0].user,
							dutylist:datas[0].dutylist,
							summary:datas[0].summary,
							remark:datas[0].remark
					}
					dat.push(mm);
					for(var i=1;i<datas.length;i++){
						dat.push(datas[i]);
					}
				}
				model.count=count;
				model.data=dat;
				widget.renderPartial(".J-grid-table");
			}
		});
	}
	
	
	var DutyScheduleManagerConfirm = ElView.extend({
		getReturnForm:function(defaultText){
			var returnForm	=new Form({
				autoRender:false,
				parentNode:".J-gridform",
				model:{
					id:"dutyofday",
					items:[{
						name:"dutytype",
						label:"值班类型",
						type:"select",
						url:"api/dutytype/queryall",
						params : {
							fetchProperties:"pkDutyType,name"
						},
						keyField : "pkDutyType",
						valueField:"name",
						defaultText : defaultText,
					}],
					defaultButton:false
				}
			});
			this.set("returnForm",returnForm);
			return returnForm;
		},
		getRemarkForm:function(defaultText){
			var remarkForm	=new Form({
				autoRender:false,
				parentNode:".J-remarkgridform",
				model:{
					id:"remark",
					items:[{
						name:"remark",
						label:"备注",
						type:"textarea",
						height:50,
						defaultValue : defaultText,
						exValidate: function(value){
							if(value.length>1023){
								return "描述不能超过1023个字";
							}else{
								return true;
							}
						}
					}],
					defaultButton:false
				}
			});
			this.set("remarkForm",remarkForm);
			return remarkForm;
		},
		attrs:{
    		template:template,
    		model : {}
        },
        events:{
        	"click .J-grid-table-dutydate":function(e){
        		var that = this;
        		var editable=that.get("params").editable;
        		if(editable){
        			var model = that.get("model");
    				var datas = model.data;
    				var c=$(e.target).attr("data-index");
            		var b=$(e.target).parents("tr").attr("data-index");
            		var year=that.get("subnav").getValue("year");
    				var month=that.get("subnav").getValue("month");
    				var dat=year+"-"+month;
    				var end=moment(dat).endOf('month');
    				if(end.isBefore(moment())||moment().add('day',-1).isAfter(moment(datas[b].dutylist[c].dutyDate))){
    					Dialog.alert({
    						content : "时间已过不能再修改值班状态!"
    					 });
    					return false;
    				}else{
    					if(datas[b].dutylist[c].ifDuty){
    						var el = $(e.currentTarget);
        	        		var value = el.text();
        					Dialog.showComponent(that.getReturnForm(value),{
        						title:"修改值班类型",
        						setStyle:function(){
        							$(".el-dialog .modal.fade.in").css({
        								"top":"10%"
        							});
        						},
        						confirm:function(){
        							if(that.get("returnForm").getValue("dutytype")){
        								aw.ajax({
            			        			url : "api/dutyScheduling/update",
            			        			type : "POST",
            			        			data : {
            			        				"dutyType":that.get("returnForm").getValue("dutytype"),
                		        				"pkDutyScheduling":datas[b].dutylist[c].pkDutyScheduling,
                		        				"version":datas[b].dutylist[c].version
            			        			},
            			        			success : function(datas) {
            			        				var model=that.get("model");//
            									setTable(model,year,month,aw);
            									setTableData(model,year,month,aw,that);
            									that.show(".J-grid");
            									Dialog.close();
            			        			}
            			        		});
        							}
        			        		
        						}
        					});
    					}else{
    						Dialog.alert({
        						content : "该员工已取消排班，不能再修改值班状态!"
        					 });
        					return false;
    					}
    					
    				}
        		}else{
        			return false;
        		}
        	},
        	"click .J-grid-table-remark":function(e){
	    		var that = this;
	    		var editable=that.get("params").editable;
	    		if(editable){
	    			var model = that.get("model");
    				var datas = model.data;
    				var c=$(e.target).attr("data-index");
            		var b=$(e.target).parents("tr").attr("data-index");
            		var year=that.get("subnav").getValue("year");
    				var month=that.get("subnav").getValue("month");
					var dat=year+"-"+month;
					var start=moment(dat).startOf('month').valueOf();
					var remark=datas[b].remark;
					var el = $(e.currentTarget);
	        		var value = el.text();
					Dialog.showComponent(that.getRemarkForm(value),{
						title:"值班备注",
						setStyle:function(){
							$(".el-dialog .modal.fade.in").css({
								"top":"10%"
							});
						},
						confirm:function(){
							if(that.get("remarkForm").getValue("remark")){
								var model = that.get("model");
								var obj={
    			        				"remark":that.get("remarkForm").getValue("remark"),
				        				"dutyUser.user.pkUser":datas[b].user.user.pkUser,
				        				"schedulType":"DutyManager",
				        				"dutyDate":start
			        			};
								if(remark){
									obj["pkDutySchedulingRemark"]=datas[b].remark.pkDutySchedulingRemark;
									obj["version"]=datas[b].remark.version;
								}
    			        		aw.ajax({
    			        			url : "api/dutyschedulingremark/saveremark",
    			        			type : "POST",
    			        			data : obj,
    			        			success : function(datas) {
    			        				var model=that.get("model");
    									setTable(model,year,month,aw);
    									setTableData(model,year,month,aw,that);
    									that.show(".J-grid");
    									Dialog.close();
    			        			}
    			        		});
							}
							
						}
					});
	    		}
	    	}
        },
		initComponent:function(params,widget){
			var model=this.get("model");
			var items=[];
			items.push({
				key:moment().add('year',1).format("YYYY"),
				value:moment().add('year',1).format("YYYY")
			});
			items.push({
				key:moment().add('year',0).format("YYYY"),
				value:moment().add('year',0).format("YYYY")
			});
			items.push({
				key:moment().add('year',-1).format("YYYY"),
				value:moment().add('year',-1).format("YYYY")
			});
			items.push({
				key:moment().add('year',-2).format("YYYY"),
				value:moment().add('year',-2).format("YYYY")
			});
			var months=[{
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
					title:"行政排班",
					buttonGroup:[{
						id:"year",
						items:items,
						tip:"年份",
						handler:function(key,element){
							var year=widget.get("subnav").getValue("year");
							var month=widget.get("subnav").getValue("month");
							setTable(model,year,month);
							setTableData(model,year,month,aw,widget);
						}
					},{
						id:"month",
						items:months,
						tip:"月份",
						handler:function(key,element){
							var year=widget.get("subnav").getValue("year");
							var month=widget.get("subnav").getValue("month");
							setTable(model,year,month);
							setTableData(model,year,month,aw,widget);
						}
					}],
					buttons:[{
						id:"add",
						text:"排班",
						show:widget.get("params").editable?true:false,
						handler:function(){
							$(".J-btn-add").attr("disabled",true);
							var year=widget.get("subnav").getValue("year");
							var month=widget.get("subnav").getValue("month");
							var dat=year+"-"+month;
							var start=moment(dat).startOf('month').valueOf();
							var end=moment(dat).endOf('month').valueOf();
							if(moment(dat).endOf('month').isBefore(moment())){
								Dialog.alert({
									content : "时间已过不能再排班!"
								 });
								$(".J-btn-add").attr("disabled",false);
								return false;
							}else{
								aw.ajax({
				   					url : "api/dutyScheduling/save",
				   					type : "POST",
				   					data : {
				   						"dutyDate":start,
				   						"dutyDateEnd":end,
				   						"startMonth":start,
				   						"endMonth":end,
				   						"schedulType":"DutyManager"
				   					},
				   					success : function(datas) {
				   						var model=widget.get("model");
				   						setTable(model,year,month,aw);
				   						setTableData(model,year,month,aw,widget);
				   						$(".J-btn-add").attr("disabled",false);
				   					}
				   				});
							}
							
						}
					},{
						id:"toexcel",
						text:"导出",
						handler:function(){ 
							var year=widget.get("subnav").getValue("year");
							var month=widget.get("subnav").getValue("month");
							var dat=year+"-"+month;
							var start=moment(dat).startOf('month').valueOf();
							var end=moment(dat).endOf('month').valueOf();
							window.open("api/dutyScheduling/toexcel?dutyDate="+start+"&dutyDateEnd="+end+"&schedulType=DutyManager" +
									"&startMonth="+start+"&endMonth="+end
									);
								return false;
		 					}				
					}]
					}
				});
			this.set("subnav",subnav);
		},
		afterInitComponent:function(params,widget){
			var params=widget.get("params");
			widget.get("subnav").setValue("year",moment().year());
			widget.get("subnav").setValue("month",moment().month()+1);
			var model=this.get("model");
			var year=widget.get("subnav").getValue("year");
			var month=widget.get("subnav").getValue("month");
			setTable(model,year,month);
			setTableData(model,year,month,aw,widget);
		},
		setEpitaph : function(){
			return this.get("params");
		}
	});
	module.exports = DutyScheduleManagerConfirm;
});
