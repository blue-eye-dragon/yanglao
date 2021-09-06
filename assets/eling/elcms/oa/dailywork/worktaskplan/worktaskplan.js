/**
 * 周报设置
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Form=require("form")
	var Dialog=require("dialog-1.0.0");
	var Grid=require("grid-1.0.0");
	var store = require("store");
	var activeUser = store.get("user");
	var template = require("./worktaskplan.tpl");
	require("./worktaskplan.css");
	var PrintDetilGrid1 = require("./assest/printdetilgrid1");
	var PrintDetilGrid2 = require("./assest/printdetilgrid2");
	var Properties=require("./assest/properties");
	var weekStart;
	var thisMonday;
	var thisSunday;
	
	var lastMonday;
	var lastSunday;
	
	var worktaskplan = ELView.extend({
		events:{
			"change .J-form-worktaskplan-date-startDate ":function(e){
				var form=this.get("form");
				if(form.getValue("no")!=null ){
					if(form.getValue("no")=="1"){
						var start_1=moment($(".J-weektimestart1")[0].innerText);
						var end_1=moment($(".J-weektimeend1")[0].innerText);
						if(form.getValue("startDate")!=null){
							if(moment(form.getValue("startDate")).isAfter(end_1,'day')
									||moment(form.getValue("startDate")).isBefore(start_1,'day')){
								Dialog.alert({
									content : "只能设置"+start_1.format('YYYY-MM-DD')+"~"+end_1.format('YYYY-MM-DD')+"周任务！"
								 });
								form.setValue("startDate","");
		     				    return false;
							}
						}
					}else if(form.getValue("no")=="2"){
						var start_2=moment($(".J-weektimestart2")[0].innerText);
						var end_2=moment($(".J-weektimeend2")[0].innerText);
						if(form.getValue("startDate")!=null){
							if(moment(form.getValue("startDate")).format('YYYY-MM-DD')>end_2.format('YYYY-MM-DD')
									||moment(form.getValue("startDate")).format('YYYY-MM-DD')<start_2.format('YYYY-MM-DD')){
								Dialog.alert({
									content : "只能设置"+start_2.format('YYYY-MM-DD')+"~"+end_2.format('YYYY-MM-DD')+"周任务！"
								 });
								form.setValue("startDate","");
		     				    return false;
							}
						}
					}
				} 
			},
			"blur .J-form-worktaskplan-text-ratio ":function(e){
				var form=this.get("form");
				if(form.getValue("ratio")!="100"){
					form.setValue("finishDate","");
				}
				if(form.getValue("ratio")==""){
					form.setValue("ratio","0");
				}
			},
			"click .J-nextweek ":function(e){/*下周按钮*/
				var start_1=moment($(".J-weektimestart1")[0].innerText);
				var end_1=moment($(".J-weektimeend1")[0].innerText);
				
				var start_2=moment($(".J-weektimestart2")[0].innerText);
				var end_2=moment($(".J-weektimeend2")[0].innerText);
				
				var userpk=$(".J-userpk")[0].innerText;
				
				var start1=moment(start_1).add(7,'day');
				var end1=moment(end_1).add(7,'day');
				var week1=moment(start1).weeks();
				this.get("subnav").setValue("time",{
					start:start1,
					end:end1
				});
						
				var start2=moment(start_2).add(7,'day');
				var end2=moment(end_2).add(7,'day');
				
				Properties.sethiddentime(start1,end1,week1,start2,end2,userpk);
				title1=end1.format('YYYY')+"年第"+week1+"周工作"+start1.format('MM月DD日')+"~"+end1.format('MM月DD日');
				title2=end2.format('YYYY')+"年第"+(moment(start2).weeks())+"周工作"+start2.format('MM月DD日')+"~"+end2.format('MM月DD日');
				Properties.setdetilgridtitle1(this,start1,end1,title1,thisMonday,thisSunday);
				Properties.setdetilgridtitle2(this,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday);
				//到本周时隐藏下一周按钮
				if(start1.isSame(thisMonday,'day')&&end1.isSame(thisSunday,'day')){
					this.get("griddetail1").show(["detilgridadd1"]);
					this.get("griddetail2").show(["detilgridadd2"]);
					$(".J-nextweek").addClass("hidden");
				}
				var edgeM;
				var edgeS;
				if(this.get("subnav").getValue("user")==activeUser.pkUser){
					edgeM=thisMonday;//本人只能修该自己本周任务
					edgeS=thisSunday;
				}else{
					edgeM=lastMonday;
					edgeS=lastSunday;
				}
				//上一周本人不能修该
				if(start1.isBefore(edgeM,'day')&&end1.isBefore(edgeS,'day')){
					Properties.loaddetilgrid1(this,start1,end1,userpk,"detil");
				}else{
					Properties.loaddetilgrid1(this,start1,end1,userpk,"edit");
				}
				//上一周本人不能修该
				if(start2.isBefore(edgeM,'day')&&end2.isBefore(edgeS,'day')){
					Properties.loaddetilgrid2(this,start2,end2,userpk,"detil");
				}else{
					Properties.loaddetilgrid2(this,start2,end2,userpk,"edit");
				}
			},
			"click .J-lastweek ":function(e){
				
				var start_1=moment($(".J-weektimestart1")[0].innerText);
				var end_1=moment($(".J-weektimeend1")[0].innerText);
				
				var start_2=moment($(".J-weektimestart2")[0].innerText);
				var end_2=moment($(".J-weektimeend2")[0].innerText);
				
				var userpk=$(".J-userpk")[0].innerText;
				var type=$(".J-type")[0].innerText;
				
				var start1=moment(start_1).subtract(7,'day');
				var end1=moment(end_1).subtract(7,'day');
				var week1=moment(start1).weeks();
				this.get("subnav").setValue("time",{
					start:start1,
					end:end1
				});
				var start2=moment(start_2).subtract(7,'day');
				var end2=moment(end_2).subtract(7,'day');
				
				Properties.sethiddentime(start1,end1,week1,start2,end2,userpk);
				//控制只能编辑上周的任务
				var edgeM;
				var edgeS;
				if(this.get("subnav").getValue("user")==activeUser.pkUser){
					edgeM=thisMonday;//本人只能修该自己本周任务
					edgeS=thisSunday;
				}else{
					edgeM=lastMonday;
					edgeS=lastSunday;
				}
				
				var title1=end1.format('YYYY')+"年第"+(week1)+"周工作"+start1.format('MM月DD日')+"~"+end1.format('MM月DD日');
				var title2=end2.format('YYYY')+"年第"+(moment(start2).weeks())+"周工作"+start2.format('MM月DD日')+"~"+end2.format('MM月DD日');
				Properties.setdetilgridtitle1(this,start1,end1,title1,thisMonday,thisSunday);
				Properties.setdetilgridtitle2(this,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday);
				if(start1.isBefore(thisMonday,'day')&&end1.isBefore(thisSunday,'day')){
					this.get("griddetail1").hide(["detilgridadd1"]);
					this.get("griddetail2").hide(["detilgridadd2"]);
					$(".J-nextweek").removeClass("hidden");
				}
				if(start1.isBefore(edgeM,'day')&&end1.isBefore(edgeS,'day')){
					Properties.loaddetilgrid1(this,start1,end1,userpk,"detil");
				}else{
					Properties.loaddetilgrid1(this,start1,end1,userpk,"edit");
				}
				if(start2.isBefore(edgeM,'day')&&end2.isBefore(edgeS,'day')){
					Properties.loaddetilgrid2(this,start2,end2,userpk,"detil");
				}else{
					Properties.loaddetilgrid2(this,start2,end2,userpk,"edit");
				}
			},
		}, 
		attrs:{
			template:template
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				 parentNode:".J-subnav",
				 model:{
						title:"工作任务安排",
						items : [{
						id : "user",
						type : "buttongroup",
						tip:"用户",
						keyField : "pkUser",
						valueField : "name",
						url:"api/worktaskplan/queryReport",
						fetchProperties:"pkUser,name,department.pkDepartment,department.name,department.pkDepartment",
						handler:function(key,value){
							var subnav=widget.get("subnav");
							var da=subnav.getData("user");
							var department="";
							for(var i=0;i<da.length;i++){
								if(da[i].pkUser==key){
									department = da[i].department!=null?da[i].department.pkDepartment:"";
								}
							}
							if(department){
								Properties.querydepartment(department);
							}else{
								$(".J-worktaskplan-department").text("无");
							}
							$(".J-worktaskplan-userCreate").text(subnav.getText("user"));
							Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
						}
					},{
						id:"time",
	                    type:"daterange",
	                    tip :"任务开始时间",
						singleDatePicker:true,
						showDropdowns : false,
						startDate:moment(),
						handler:function(time){
		    					//获取选中日期
		    					var clickTime=widget.get("subnav").getValue("time").start;
		    					//计算选中日期所在周的周一和周日
		    					var startClick;
		    					var endClick;
		    					
		    					if((moment(clickTime).weekday() == 0 && weekStart!=0)||(moment(clickTime).weekday() < (weekStart)) ){//今天是周日
		    						startClick = moment(clickTime).weekday(weekStart-7);
		    						endClick = moment(clickTime).weekday(weekStart-1);
		    					}else{
		    						startClick=moment(clickTime).weekday(weekStart);
		    						endClick=moment(clickTime).weekday(weekStart+6);
		    					}
		    					//赋值
		    					widget.get("subnav").setValue("time",{
			 	    						start:startClick,
			 	    						end:endClick,
		    						});
		    					//刷新grid
		    					Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
							}
					},{
						id:"return",
						text:"返回",
						show:false,
						type:"button",
						handler:function(){
							widget.get("subnav").show(["time","user","print"]).hide(["return"]);
							widget.show([".J-griddetail1,.J-griddetail2,.J-worktaskplan-start"]).hide([".J-form"]);
							Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
							return false;
						}
					},{
						id:"print",
						text:"打印",
						show:false,
						type:"button",
						handler:function(index,data,rowEL){
							var subnav=widget.get("subnav");
							widget.get("subnav").hide(["time","user","print","return"]);
							$(".J-lastweek").addClass("hidden");
							$(".J-nextweek").addClass("hidden");
							widget.hide([".J-griddetail1,.J-griddetail2"]).show([".J-printgriddetail1",".J-printgriddetail2",".J-worktaskplan-start"]);
							var data1=widget.get("griddetail1").getData();
							var data2=widget.get("griddetail2").getData();
							var title1=widget.get("griddetail1").getTitle();
							var title2=widget.get("griddetail2").getTitle();
							
							widget.get("printgriddetail1").setData(data1);
							widget.get("printgriddetail2").setData(data2);
							widget.get("printgriddetail1").setTitle(title1);
							widget.get("printgriddetail2").setTitle(title2);
							
							window.print();
							
							if(widget.get("params")){
								widget.get("subnav").hide(["time","user","return"]).show(["print"]);
							}else{
								widget.get("subnav").show(["time","user","print"]).hide(["return"]);
								$(".J-lastweek").removeClass("hidden");
	 							$(".J-nextweek").removeClass("hidden");
							}
							widget.hide([".J-printgriddetail1",".J-printgriddetail2"]).show([".J-griddetail1,.J-griddetail2,.J-worktaskplan-start"]);
						}
					}],
	             }
			 });
			this.set("subnav",subnav);
    		 
       
    		 //新增修改form表单
 			 var form = new Form({
				parentNode:".J-form",
			   	saveaction:function(){
			   		var ratio = widget.get("form").getValue("ratio");
			   		var finishDate = widget.get("form").getValue("finishDate");
			   		if(isNaN(ratio)||!(0 <= Number(ratio) &&  Number(ratio) <= 100)){
	     				Dialog.alert({
								content : "完成比例只能为0-100的数字！"
							 });
	     				return false;
	     			}
					if((0 <= Number(ratio) &&  Number(ratio) < 100)){
						if(finishDate!=""){
							Dialog.alert({
								content : "完成比例未达100%，实际完成时间不能填！"
							 });
							return false;
						}
					}
					if(Number(ratio)==100 && finishDate==""){
						Dialog.alert({
							content : "完成比例为100%，实际完成时间不能为空！"
						 });
						return false;
					}
					var start =widget.get("form").getValue("start");
					var end = widget.get("form").getValue("end");
					var start2=thisMonday;
					var end2=thisSunday;
					var edgeM=moment(start2).subtract(7,'day');
					var edgeS=moment(end2).subtract(7,'day');;
					if(start&&end &&moment.unix(start/1000).isSame(edgeM,"days")&&moment.unix(end/1000).isSame(edgeS,"days")){
							aw.saveOrUpdate("api/worktaskplan/editlastweek",$("#worktaskplan").serialize(),function(){
								widget.show([".J-worktaskplan-start,.J-griddetail1,.J-griddetail2"]).hide(".J-form");
								widget.get("subnav").hide("return").show(["time","user","print"]);
								Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
		           		 		});
					}else{
						aw.saveOrUpdate("api/worktaskplan/save",$("#worktaskplan").serialize(),function(){	
							//刷新双周报
							widget.show([".J-worktaskplan-start,.J-griddetail1,.J-griddetail2"]).hide(".J-form");
							widget.get("subnav").hide("return").show(["time","user","print"]);
							Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
	           		 		});
					}
					},
				//取消按钮
  				cancelaction:function(){
					widget.get("subnav").show(["time","user","print"]).hide(["return"]);
					widget.show([".J-worktaskplan-start,.J-griddetail1,.J-griddetail2"]).hide([".J-form"]);
					Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
  				},
				model:{
					id:"worktaskplan",
					items:[{
						name:"content",
						label:"工作内容",
						type :"textarea",
						validate:["required"],
					},{
						name:"startDate",
						label:"开始时间",
						type:"date",
						mode:"YYYY-MM-DD",
						validate:["required"],
					},{
						name:"endDate",
						label:"结束时间",
						type:"date",
						mode:"YYYY-MM-DD",
						validate:["required"],
					},{
						name:"priority",
						label:"优先级",
						type:"select",
        				options:[{
        					key:"High",
        					value:"高"
        				},{
        					key:"middle",
            				value:"中"
        				},{
        					key:"low",
            				value:"低"
        				}],
						validate:["required"]
					},{
						name:"ratio",
						label:"完成比例",
						defaultValue:"0"
					},{
						name:"finishDate",
						label:"实际完成时间",
						type:"date",
						mode:"YYYY-MM-DD",
					},{
						name:"reason",
						label:"备注",
						type :"textarea",
					},{
						name:"version", 
						defaultValue:"0",
						type:"hidden"
					},{
						name:"user",
						type:"hidden"
					},{
						name:"pkWorkTaskPlan",
						type:"hidden"
					},{
						name:"no",
						type:"hidden"
					},{
						name:"start",
						type:"hidden"
					},{
						name:"end",
						type:"hidden"
					}]
				}
			});
			this.set("form",form); 
			
			var griddetail1=new Grid({
    			parentNode:".J-griddetail1",
    			autoRender:false,
 				url :"api/worktaskplan/query",
 				params:function(){
					return {
					fetchProperties:"content," +
						"user.name,user.pkUser," +
						"startDate," +
						"endDate," +
						"ratio," +
						"finishDate," +
						"overTime," +
						"reason," +
						"userCreate.name,userCreate.pkUser," +
						"userTo.name,userTo.pkUser," +
						"version," +
						"pkWorkTaskPlan",
					};
				},
 				model:{
 					head:{
						title:"本周工作", 
						buttons:[{
							id:"detilgridadd1",
							icon:"icon-plus",
							handler:function(){
								if(activeUser.department==null){
 	 								Dialog.alert({
 	 									content : "请确认您所在的部门！！"
 	 								});
 	 				     		    return false;
 	 							}
								widget.get("subnav").hide(["time","user","print"]).show("return");
 	 							widget.hide([".J-worktaskplan-start,.J-griddetail1,.J-griddetail2"]).show([".J-form"]);
 	 							widget.get("form").reset();
 	 							widget.get("form").setValue("no","1");
 	 							if(widget.get("subnav").getValue("user")){
 	 								widget.get("form").setValue("user",widget.get("subnav").getValue("user"));
 	 							}else{
 	 								widget.get("form").setValue("user",activeUser.pkUser);
 	 							}
 	 							
 	 							
							}
						}]
					},
 					columns:[{
 						key:"ggg",
 						name:"序号",
 						className:"ggg"
 					},{
 						key:"content",
 						name:"工作内容",
 						className:"content"
 					},{
 						key:"startDate",  
 						name:"开始日期",
 						format:"date",
 						className:"startDate"
 					},{
 						key:"endDate",  
 						name:"结束日期",
 						format:"date",
 						className:"endDate"
 					},{
 						key:"priority.value",  
 						name:"优先级",
 						className:"priority"
 					},{
 						key:"ratio",  
 						name:"完成程度",
 						className:"ratio",
 						format:function(value,row){
 							return value+"%";
 						},
 					},{
 						key:"finishDate",  
 						name:"实际完成时间",
 						format:"date",
 						className:"finishDate"
 					},{
 						name:"是否超期",
 						className:"outTime",
 						format:function(value,row){
 							var end_1;
 							var start_1;
 							if(params){
 								end_1=moment(params.Sunday);
 								start_1=moment(params.Monday);
 							}else if(moment($(".J-weektimeend1")[0].innerText)){
 								end_1=moment($(".J-weektimeend1")[0].innerText);
 								start_1=moment($(".J-weektimestart1")[0].innerText);
 							}
 							if(end_1.isBefore(moment(row.endDate),"day")){//预计结束时间在本周之后
 								return "否";
 							}
 							if(end_1.isAfter(moment(row.endDate),"day")||end_1.isSame(moment(row.endDate),"day")){//预计结束时间在本周之内
 								 if((start_1.isBefore(moment(row.endDate),"day")||start_1.isSame(moment(row.endDate),"day"))&&(moment().isBefore(end_1,"day")||moment().isSame(end_1,"day"))){//本周之内
 									return "否";
 								}else if(start_1.isAfter(moment(row.endDate),"day")){
 									return "是";
 								}else{
 									if(row.finishDate==null||moment(row.finishDate).isAfter(end_1,"day")){
 										return "是";
 									}else{
 										return "否";
 									}
 								}
 							}
						}
 							
 					},{
 						key:"reason",  
 						name:"备注",
 						className:"reason"
 					},{
 						key:"operate",
 						className:"operate",
 						name:"操作",
 						format:"button",
 						formatparams:[{
 							key:"gridedit",	
							icon:"edit",
							show:function(value,row){
								var end1=moment($(".J-weektimeend1")[0].innerText);
								if(end1.isBefore(moment(),'day')&&row.finishDate==null){
 									return false;
 								}else{
 									return true;
 								}
 							},
 							handler:function(index,data,rowEle){
 								widget.get("subnav").hide(["time","user","print"]).show(["return"]);
 								widget.hide([".J-worktaskplan-start,.J-griddetail1,.J-griddetail2"]).show([".J-form"]);
 								var form = widget.get("form");
 								form.setData(data);
 								form.setValue("no","1");
 								form.setValue("user",data.user.pkUser);
 								var start_1=moment($(".J-weektimestart1")[0].innerText);
 								var end_1=moment($(".J-weektimeend1")[0].innerText);
 								form.setValue("start",start_1.valueOf());
 								form.setValue("end",end_1.valueOf());
 								if(end_1.isBefore(moment())){
 									form.setDisabled(["content","startDate","endDate","priority"],true);
 								}else{
 									form.setDisabled(["content","startDate","endDate","priority"],false);
 								}
 								var leader=$(".J-leader")[0].innerText;
 								if(data.user.pkUser==activeUser.pkUser && leader=="true"){
 									form.setDisabled(["startDate","endDate"],true);
 								}else{
 									form.setDisabled(["startDate","endDate"],false);
 								}
 								
 							}
 						},{
 							key:"edituser1",
 							text:"修改负责人",
 							show:function(value,row){
 								var leader=$(".J-leader")[0].innerText;
 								if(row.user.pkUser!=activeUser.pkUser){
	 								return true;
	 							}else if(row.user.pkUser==activeUser.pkUser&&leader=="false"){
	 								return true;
	 							}
 							},
 							handler:function(index,data,rowEle){
 								Dialog.showComponent({
 									title:"修改负责人",
 									setStyle:function(){
 										$(".el-dialog .modal.fade.in").css({
 											"top":"10%"
 										});
 									},
 									confirm:function(){
 										aw.ajax({
 											url:"api/worktaskplan/changeuser",
 											data:{
 												user:$("#edituser select[name='user']").find("option:selected").val(),
 												pkWorkTaskPlan:data.pkWorkTaskPlan,
 												version:data.version
 												},
 											dataType:"json",
 											success:function(data){
 												widget.show(".J-worktaskplan-start,.J-griddetail1,.J-griddetail2");
 												widget.get("subnav").hide("return").show(["print","time","user"]);
 												Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
 											}
 										});
 									}
 								},new Form({
 									model:{
 										id:"edituser",
 										items:[{
 											name:"user",
 											label:"负责人",
 											type:"select",
 						    				key:"pkUser",
 						    				defaultValue:data.user.pkUser+"",
 						    				url:"api/worktaskplan/queryReport",//TODO 用户角色：wulina
 						    				params:{
 												fetchProperties:"pkUser,name"
 											},
 											value:"name",
 											style:{
 												label:"width:30%"
 											}
 										}],
 										defaultButton:false
 									}
 								}));
 							}
 						},{
 							key:"delete1",	
							icon:"remove",
 							handler:function(index,data,rowEle){
								aw.del("api/worktaskplan/"+data.pkWorkTaskPlan+"/delete",function(){
									Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
									widget.get("subnav").hide("return").show(["print","time","user"]);
	 								widget.show([".J-worktaskplan-start,.J-griddetail1,.J-griddetail2"]);
								})
							}
 						
 						}]
 					}]
 				}
    		 });
    		 this.set("griddetail1",griddetail1);
    		 
    		 var griddetail2=new Grid({
     			parentNode:".J-griddetail2",
     			autoRender:false,
  				url :"api/worktaskplan/query",
  				params:function(){
 					return {
 					fetchProperties:"content," +
 						"user.name,user.pkUser," +
 						"startDate," +
 						"endDate," +
 						"ratio," +
 						"finishDate," +
 						"overTime," +
 						"reason," +
 						"userCreate.name,userCreate.pkUser," +
 						"userTo.name,userTo.pkUser," +
 						"version," +
 						"pkWorkTaskPlan",
 					};
 				},
  				model:{
  					head:{
 						title:"本周工作:"+"年"+"第"+"周", 
 						buttons:[{
 							id:"detilgridadd2",
 							icon:"icon-plus",
 							handler:function(){
 								if(activeUser.department==null){
 	 								Dialog.alert({
 	 									content : "请确认您所在的部门！！"
 	 								});
 	 				     		    return false;
 	 							}
 								widget.get("subnav").hide(["time","user","print"]).show("return");
 	 							widget.hide([".J-worktaskplan-start,.J-griddetail1,.J-griddetail2"]).show([".J-form"]);
 	 							widget.get("form").reset();
 	 							widget.get("form").setValue("no","2");
 	 							if(widget.get("subnav").getValue("user")){
 	 								widget.get("form").setValue("user",widget.get("subnav").getValue("user"));
 	 							}else{
 	 								widget.get("form").setValue("user",activeUser.pkUser);
 	 							}
 							}
 						}]
 					},
  					columns:[{
 						key:"ggg",
 						name:"序号",
 						className:"ggg"
 					},{
 						key:"content",
 						name:"工作内容",
 						className:"content"
 					},{
 						key:"startDate",  
 						name:"开始日期",
 						format:"date",
 						className:"startDate"
 					},{
 						key:"endDate",  
 						name:"结束日期",
 						format:"date",
 						className:"endDate"
 					},{
 						key:"priority.value",  
 						name:"优先级",
 						className:"priority"
 					},{
 						key:"ratio",  
 						name:"完成程度",
 						className:"ratio",
 						format:function(value,row){
 							return value+"%";
 						},
 					},{
 						key:"finishDate",  
 						name:"实际完成时间",
 						format:"date",
 						className:"finishDate"
 					},{
 						name:"是否超期",
 						className:"outTime",
 						format:function(value,row){
 							var end_2;
 							var start_2;
 							if(params){
 								end_2=moment(params.Sunday).add(7,'day');
 								start_2=moment(params.Monday).add(7,'day');
 							}else if(moment($(".J-weektimeend2")[0].innerText)){
 								end_2=moment($(".J-weektimeend2")[0].innerText);
 								start_2=moment($(".J-weektimestart2")[0].innerText);
 							}
 							if(end_2.isBefore(moment(row.endDate),'day')){//预计结束时间在本周之后
 								return "否";
 							}
 							if(end_2.isAfter(moment(row.endDate),'day')||end_2.isSame(moment(row.endDate),'day')){//预计结束时间在本周之内
 								 if((start_2.isBefore(moment(row.endDate),"day")||start_2.isSame(moment(row.endDate),"day"))&&(moment().isBefore(end_2,"day")||moment().isSame(end_2,"day"))){//本周之内
  									return "否";
  								}else if(start_2.isAfter(moment(row.endDate),"day")){
  									return "是";
  								}else{
 									if(row.finishDate==null||moment(row.finishDate).isAfter(end_2,'day')){
 										return "是";
 									}else{
 										return "否";
 									}
 								}
 							}
						}
 							
 					},{
 						key:"reason",  
 						name:"备注",
 						className:"reason"
 					},{
 						key:"operate",
 						name:"操作",
 						className:"operate",
 						format:"button",
 						formatparams:[{
 							key:"edit2",	
							icon:"edit",
							show:function(value,row){
								var end2=moment($(".J-weektimeend2")[0].innerText);
								if(end2.isBefore(moment(),'day')&&row.finishDate==null){
 									return false;
 								}else{
 									return true;
 								}
 							},
 							handler:function(index,data,rowEle){
 								var form = widget.get("form");
 								widget.get("subnav").hide(["time","user","print"]).show(["return"]);
 								widget.hide([".J-worktaskplan-start,.J-griddetail1,.J-griddetail2"]).show([".J-form"]);
 	 							
 								form.setData(data);
 								form.setValue("no","2");
 								form.setValue("user",data.user.pkUser);
 								var start_2=moment($(".J-weektimestart2")[0].innerText);
 								var end_2=moment($(".J-weektimeend2")[0].innerText);
 								form.setValue("start",start_2.valueOf());
 								form.setValue("end",end_2.valueOf());
 								
 								if(end_2.isBefore(moment())){
 									form.setDisabled(["content","startDate","endDate","priority"],true);
 								}else{
 									form.setDisabled(["content","startDate","endDate","priority"],false);
 								}
 								var leader=$(".J-leader")[0].innerText;
 								if(data.user.pkUser==activeUser.pkUser && leader=="true"){
 									form.setDisabled(["startDate","endDate"],true);
 								}else{
 									form.setDisabled(["startDate","endDate"],false);
 								}
 							}
 						},{
 							key:"edituser2",
 							text:"修改负责人",
 							show:function(value,row){
 								if(row.user.pkUser!=activeUser.pkUser){
	 								return true;
	 							}
 							},
 							handler:function(index,data,rowEle){
 								Dialog.showComponent({
 									title:"修改负责人",
 									setStyle:function(){
 										$(".el-dialog .modal.fade.in").css({
 											"top":"10%"
 										});
 									},
 									confirm:function(){
 										aw.ajax({
 											url:"api/worktaskplan/changeuser",
 											data:{
 												user:$("#edituser select[name='user']").find("option:selected").val(),
 												pkWorkTaskPlan:data.pkWorkTaskPlan,
 												version:data.version
 												},
 											dataType:"json",
 											success:function(data){
 												widget.show(".J-griddetail1,.J-griddetail2,.J-worktaskplan-start");
 												widget.get("subnav").hide("return").show(["time","user","print"]);
 												Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
 											}
 										});
 									}
 								},new Form({
 									model:{
 										id:"edituser",
 										items:[{
 											name:"user",
 											label:"负责人",
 											type:"select",
 						    				key:"pkUser",
 						    				defaultValue:data.user.pkUser+"",
 						    				url:"api/worktaskplan/queryReport",
 						    				params:{
 												fetchProperties:"pkUser,name"
 											},
 											value:"name",
 											style:{
 												label:"width:30%"
 											}
 										}],
 										defaultButton:false
 									}
 								}));
 							}
 						},{
 							key:"delete2",	
							icon:"remove",
 							handler:function(index,data,rowEle){
								aw.del("api/worktaskplan/"+data.pkWorkTaskPlan+"/delete",function(){
									Properties.refreshdetilgrid(widget,thisMonday,thisSunday,lastMonday,lastSunday);
									widget.show([".J-worktaskplan-start,.J-griddetail1,.J-griddetail2"]).hide(".J-form");
	 								widget.get("subnav").hide("return").show(["time","user","print"]);
								})
							}
 						
 						}]
 					}]
  				}
     		 });
     		 this.set("griddetail2",griddetail2);
	 		this.set("printgriddetail1",PrintDetilGrid1.init(this,{
	 			startDate :(widget.get("params")&&widget.get("params").Monday)?widget.get("params").Monday:$(".J-weektimestart1")[0].innerText,
	 		    endDate : (widget.get("params")&&widget.get("params").Sunday)?widget.get("params").Sunday:$(".J-weektimeend1")[0].innerText,
				parentNode : ".J-printgriddetail1",
			}));
     		this.set("printgriddetail2",PrintDetilGrid2.init(this,{
     			startDate :(widget.get("params")&&widget.get("params").Monday)?widget.get("params").Monday:$(".J-weektimestart1")[0].innerText,
     			 endDate : (widget.get("params")&&widget.get("params").Sunday)?widget.get("params").Sunday:$(".J-weektimeend1")[0].innerText,
				parentNode : ".J-printgriddetail2",
			}));
     		 
    	 },
    	 
    	 afterInitComponent:function(params,widget){
    		 if(params){/*从周报执行情况页面跳转过来*/    			 
    			 if(params.department){
    				 $(".J-worktaskplan-department").text(params.department);
    			 }
    			 if(params.name){
    				 $(".J-worktaskplan-userCreate").text(params.name);
    			 }
				widget.get("subnav").show("print").hide(["return","time","user"]);
				widget.show([".J-worktaskplan-start,.J-griddetail1,.J-griddetail2"]).hide(".J-form");
				widget.get("griddetail1").hide(["detilgridadd1"]);
				widget.get("griddetail2").hide(["detilgridadd2"]);
				var start1=moment(params.Monday);
				var end1=moment(params.Sunday);
				var week1=moment(start1).weeks();
				var start2=moment(params.Monday).add(7,'day');
				var end2=moment(params.Sunday).add(7,'day');
				
				var title1=end1.format('YYYY')+"年第"+week1+"周"+start1.format('MM月DD日')+"~"+end1.format('MM月DD日');
				var title2=end2.format('YYYY')+"年第"+(moment(start2).weeks())+"周工作"+start2.format('MM月DD日')+"~"+end2.format('MM月DD日');
				Properties.setdetilgridtitle1(widget,start1,end1,title1,thisMonday,thisSunday);
				Properties.setdetilgridtitle2(widget,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday);
				Properties.loaddetilgrid1(widget,start1,end1,params.pkUser,'detil');
				Properties.loaddetilgrid2(widget,start2,end2,params.pkUser,'detil');
				$(".J-lastweek").addClass("hidden");
				$(".J-nextweek").addClass("hidden");
    		 }else{
				 aw.ajax({
	    				url : "api/sysparameter/worktaskplan_weekstart",
	    				type : "POST",
	    				data : {
	    					fetchProperties:"value"
	    				},
	    				success : function(datas) {
	    					if(datas!=null){
	    						weekStart=datas;
	    					}
	    					//计算本周日期范围
	    					if((moment().weekday() == 0 && weekStart!=0 )||(moment().weekday() < (weekStart))){
	    						thisMonday = moment().weekday(weekStart-7);
	        					thisSunday = moment().weekday(weekStart-1);
	        					lastMonday = moment().weekday(weekStart-7).add(-7,'day');
		    					lastSunday = moment().weekday(weekStart-1).add(-7,'day');
	    					}else{
	    						thisMonday=moment().weekday(weekStart);
	        					thisSunday=moment().weekday(weekStart+6);
	        					lastMonday=moment().weekday(weekStart).add(-7,'day');
		    					lastSunday=moment().weekday(weekStart+6).add(-7,'day');
	    					}
	    					//给日期控件设置最大值
	    					var checkinDatePlugin = widget.get("subnav").getPlugin("time");
							var instance = checkinDatePlugin.getInstance("time");
							instance.daterangepicker.maxDate = moment(thisSunday).add(7,'day');
							instance.daterangepicker.updateCalendars();//更新
	    					//默认显示本周
	    	    			widget.get("subnav").setValue("time",{
	    							start:thisMonday,
	    							end:thisSunday,
	    					});
	    	    			Properties.queryleader();
	    	    			
							if(activeUser.department){
								Properties.querydepartment(activeUser.department.pkDepartment);
								$(".J-worktaskplan-userCreate").text(activeUser.name);
							}else{
								$(".J-worktaskplan-department").text("无");
								$(".J-worktaskplan-userCreate").text(activeUser.name);
							}
    	    			    $(".J-worktaskplan-start").removeClass("hidden");
    	    				
    	    			    widget.get("subnav").hide(["return"]).show(["print","time","user"]);
	    					widget.show([".J-griddetail1,.J-griddetail2"]);
	    					$(".J-type").text("edit");
	    					$(".J-userpk").text(activeUser.pkUser);
	    	    			
	    					var start1=moment(thisMonday);
	    					var end1=moment(thisSunday);
	    					var week1=moment(start1).weeks();
	    					
	    					var start2=moment(thisMonday).add(7,'day');
	    					var end2=moment(thisSunday).add(7,'day');
	    					var userpk=activeUser.pkUser;
	    					Properties.sethiddentime(start1,end1,week1,start2,end2,userpk);
	    					
	    					var title1=end1.format('YYYY')+"年第"+week1+"周工作"+start1.format('MM月DD日')+"~"+end1.format('MM月DD日');
	    					var title2=end2.format('YYYY')+"年第"+(moment(start2).weeks())+"周工作"+start2.format('MM月DD日')+"~"+end2.format('MM月DD日');
	    					Properties.setdetilgridtitle1(widget,start1,end1,title1,thisMonday,thisSunday);
	    					Properties.setdetilgridtitle2(widget,start1,end1,title2,thisMonday,thisSunday,lastMonday,lastSunday);
	    					Properties.loaddetilgrid1(widget,start1,end1,userpk,"edit");
	    					Properties.loaddetilgrid2(widget,start2,end2,userpk,"edit");
	    					widget.get("griddetail1").show(["detilgridadd1"]);
	    					widget.get("griddetail2").show(["detilgridadd2"]);
    	        		 }
	    			});
    		 }
    	 },
	});
	module.exports = worktaskplan;
});
