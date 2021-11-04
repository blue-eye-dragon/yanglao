/**
 * 服务费分摊
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form");
	var EditGrid=require("editgrid");
	var store = require("store");
	var activeUser = store.get("user");
	require("./annualfeeapportion.css");
	var template="<div class='el-annualfeeapportion'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-Grid'></div>"+
		"<div class='J-Form hidden'></div>"+
		"<div class='J-subList hidden' style='width:30%'></div>"+
		"</div>";
	var annualfeesearch = ELView.extend({
		events : {
			"blur .J-form-annualfeeapportion-date-beginDate":function(e){
				var form = this.get("form");
				var beginDate1=form.getValue("annualFees.beginDate");
				var endDate1=form.getValue("annualFees.endDate");
				
				var beginDate=form.getValue("beginDate");
				var endDate=form.getValue("endDate");
				
				var realAnnualFees=form.getValue("annualFees.realAnnualFees");
				var annualCheckOutFee=form.getValue("annualFeesRefund.annualCheckOutFee");
				var refunddate=moment(form.getValue("annualFeesRefund.createDate"));
				
				
				if(moment(beginDate).format("YYYY-MM")<moment(beginDate1).format("YYYY-MM")){
					Dialog.alert({
							content : "分摊开始月份不能小于服务费起始月份!"
						 });
					form.setValue("beginDate",beginDate1);
     				return false;
				}
				if(moment(beginDate).format("YYYY-MM")>moment(endDate1).format("YYYY-MM")){
					Dialog.alert({
							content : "分摊开始月份不能大于服务费到期月份!"
						 });
					form.setValue("beginDate",beginDate1);
     				return false;
				}
				if(moment(beginDate).format("YYYY-MM")>moment(endDate).format("YYYY-MM")){
					Dialog.alert({
							content : "分摊开始月份必须小于分摊结束月份!"
						 });
					form.setValue("beginDate",beginDate1);
     				return false;
				}
				
				var result=[];
				var year1 = moment(beginDate).format("YYYY");
	            var year2 = moment(endDate).format("YYYY");
	            var month1 = moment(beginDate).format("MM");
	            var month2 = moment(endDate).format("MM");
	            var len = (year2 - year1) * 12 + (month2 - month1)+1;
	            form.setValue("apportionFrequency",len);
	            this.arrayEditGrid(this,len,parseInt(realAnnualFees),beginDate,parseInt(annualCheckOutFee),refunddate);
			},
			"blur .J-form-annualfeeapportion-date-endDate":function(e){
				var form = this.get("form");
				var endDate1=form.getValue("annualFees.endDate");
				var beginDate1=form.getValue("annualFees.beginDate");
				var realAnnualFees=form.getValue("annualFees.realAnnualFees");
				
				var beginDate=form.getValue("beginDate");
				var endDate=form.getValue("endDate");
				
				var annualCheckOutFee=form.getValue("annualFeesRefund.annualCheckOutFee");
				var refunddate=moment(form.getValue("annualFeesRefund.createDate"));
				if(moment(endDate).format("YYYY-MM")>moment(endDate1).format("YYYY-MM")){
					Dialog.alert({
						content : "分摊结束月份不能大于服务费结束月份!"
					 });
					form.setValue("endDate",endDate1);
					return false;
				}
				if(moment(beginDate).format("YYYY-MM")>=moment(endDate).format("YYYY-MM")){
					Dialog.alert({
							content : "分摊结束月份必须大于分摊开始月份!"
						 });
					form.setValue("endDate",endDate1);
     				return false;
				}
				
				var result=[];
				var year1 = moment(beginDate).format("YYYY");
	            var year2 = moment(endDate).format("YYYY");
	            var month1 = moment(beginDate).format("MM");
	            var month2 = moment(endDate).format("MM");
	            var len = (year2 - year1) * 12 + (month2 - month1)+1;
	            form.setValue("apportionFrequency",len);
	            this.arrayEditGrid(this,len,parseInt(realAnnualFees),beginDate,parseInt(annualCheckOutFee),refunddate);
			}
		},
    	attrs:{
    		template:template
        },
        thousand:function(data){
			var precision = data && data.precision !== undefined ? data.precision : 2;
			var value =  parseFloat(data);
			if(value !== undefined && value !== null && !isNaN(value)){
				value = value.toFixed(precision);
				value = value+"";
				return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
			}else{
				return "0.00";
			}
		},
		arrayEditGrid:function(widget,len,realAnnualFees,beginDate,annualCheckOutFee,refunddate){
			var result=[];
			var sum=0;
			for(var i=0;i<len;i++){
				if(i!=len-1){
					var apportionMoney=parseInt(realAnnualFees/len);
					sum+=apportionMoney;
					result.push({
						chargeApportion:apportionMoney,
						refundApportion:0,
						date:moment(beginDate).add("month",i).valueOf(),
						operator:activeUser.pkUser,
					});
				}else{
					result.push({
						chargeApportion:realAnnualFees-sum,
						refundApportion:0,
						date:moment(beginDate).add("month",i).valueOf(),
						operator:activeUser.pkUser,
					});
				}
			}
			
			//有对应年费退款记录
			if(annualCheckOutFee&&annualCheckOutFee>0){
				
				var refundSum=0;
				if(moment(result[0].date).isAfter(refunddate,'month')){//退费月份早于分摊开始月份
					//按分摊月份倒序排序
					result= result.sort(function(a,b){
		        		return b.date- a.date;
		        	 });
					for(var j=0;j<result.length;j++){
						if(j!=(result.length-1)){
							if(annualCheckOutFee>=(refundSum+result[j].chargeApportion)){
								result[j].refundApportion=result[j].chargeApportion;
								refundSum+=result[j].chargeApportion;
							}else if(annualCheckOutFee-refundSum>=0){
								result[j].refundApportion=(annualCheckOutFee-refundSum);
								refundSum+=(annualCheckOutFee-refundSum);
							}else{
								result[j].refundApportion=0;
							}
						}else{//退费当月
							if(annualCheckOutFee<refundSum){
								result[j].refundApportion=0;
							}else{
								result[j].refundApportion=(annualCheckOutFee-refundSum);
							}
						}
					}
				}else{
					//按分摊月份倒序排序
					result= result.sort(function(a,b){
		        		return b.date- a.date;
		        	 });
					for(var j=0;j<result.length;j++){
						if(moment(result[j].date).isAfter(refunddate,'month')){
							if(annualCheckOutFee>=(refundSum+result[j].chargeApportion)){
								result[j].refundApportion=result[j].chargeApportion;
								refundSum+=result[j].chargeApportion;
							}else if(annualCheckOutFee-refundSum>=0){
								result[j].refundApportion=(annualCheckOutFee-refundSum);
								refundSum+=(annualCheckOutFee-refundSum);
							}else{
								result[j].refundApportion=0;
							}
						}else if(moment(result[j].date).isSame(refunddate,'month')){//退费当月
							if(annualCheckOutFee<refundSum){
								result[j].refundApportion=0;
							}else{
								result[j].refundApportion=(annualCheckOutFee-refundSum);
							}
						}
					}
				}
				//按分摊月份正序排序
				result= result.sort(function(a,b){
	        		return a.date- b.date;
	        	 });
			}
			// 分摊结束日期
			var shareEndDate = moment(widget.get("form").getValue("endDate")).valueOf();
			// 退费日期
			var refunddates = moment(refunddate).valueOf();
			if(refunddates>shareEndDate){
				var annualCheckOutFeeShow = 0.00;
				var apportionMoneyShow = realAnnualFees;
			} else {
				var annualCheckOutFeeShow = annualCheckOutFee;
				var apportionMoneyShow = (realAnnualFees-annualCheckOutFee);
			}
			// 分摊结束日期
			var shareEndDate = moment(widget.get("form").getValue("endDate")).valueOf();
			// 退费日期
			var refunddates = moment(refunddate).valueOf();
			if(refunddates>shareEndDate){
				var annualCheckOutFeeShow = 0.00;
				var apportionMoneyShow = realAnnualFees;
			} else {
				var annualCheckOutFeeShow = annualCheckOutFee;
				var apportionMoneyShow = (realAnnualFees-annualCheckOutFee);
			}
			widget.get("editGrid").setData(result);
			widget.element.find(".J-grid-table").append("<tr data-idattribute>" +
					"<td class='J-date'><pre>合计</pre></td>" +
					"<td class='J-chargeApportion text-right'><pre>"+widget.thousand(realAnnualFees)+"</pre></td>" +
					"<td class='J-refundApportion text-right'><pre>"+widget.thousand(annualCheckOutFeeShow)+"</pre></td></tr>" );
			if(annualCheckOutFee){
				widget.element.find(".J-grid-table .J-refundApportion").after("<td class='J-apportionMoney text-right'><pre>"+widget.thousand(apportionMoneyShow)+"</pre></td>");
			}else{
				widget.element.find(".J-grid-table .J-refundApportion").after("<td class='J-apportionMoney text-right'><pre>"+widget.thousand((realAnnualFees))+"</pre></td>" );
			}
					
		},
		editGridData:function(widget,realAnnualFees,beginDate,annualCheckOutFee,refunddate){
			var result=widget.get("editGrid").getData();
			//有对应年费退款记录
			if(annualCheckOutFee&&annualCheckOutFee>0){
				
				var refundSum=0;
				if(moment(result[0].date).isAfter(refunddate,'month')){//退费月份早于分摊开始月份
					//按分摊月份倒序排序
					result= result.sort(function(a,b){
		        		return b.date- a.date;
		        	 });
					for(var j=0;j<result.length;j++){
						if(j!=(result.length-1)){
							if(annualCheckOutFee>=(refundSum+result[j].chargeApportion)){
								result[j].refundApportion=result[j].chargeApportion;
								refundSum+=result[j].chargeApportion;
							}else if(annualCheckOutFee-refundSum>=0){
								result[j].refundApportion=(annualCheckOutFee-refundSum);
								refundSum+=(annualCheckOutFee-refundSum);
							}else{
								result[j].refundApportion=0;
							}
							
						}else{//退费当月
							if(annualCheckOutFee<refundSum){
								result[j].refundApportion=0;
							}else{
								result[j].refundApportion=(annualCheckOutFee-refundSum);
							}
						}
					}
				}else{
					//按分摊月份倒序排序
					result= result.sort(function(a,b){
		        		return b.date- a.date;
		        	 });
					for(var j=0;j<result.length;j++){
						if(moment(result[j].date).isAfter(refunddate,'month')){
							if(annualCheckOutFee>=(refundSum+result[j].chargeApportion)){
								result[j].refundApportion=result[j].chargeApportion;
								refundSum+=result[j].chargeApportion;
							}else if(annualCheckOutFee-refundSum>=0){
								result[j].refundApportion=(annualCheckOutFee-refundSum);
								refundSum+=(annualCheckOutFee-refundSum);
							}else{
								result[j].refundApportion=0;
							}
						}else if(moment(result[j].date).isSame(refunddate,'month')){//退费当月
							if(annualCheckOutFee<refundSum){
								result[j].refundApportion=0;
							}else{
								result[j].refundApportion=(annualCheckOutFee-refundSum);
							}
						}
					}
				}
				//按分摊月份正序排序
				result= result.sort(function(a,b){
	        		return a.date- b.date;
	        	 });
			}
			// 分摊结束日期
			var shareEndDate = moment(widget.get("form").getValue("endDate")).valueOf();
			// 退费日期
			var refunddates = moment(refunddate).valueOf();
			if(refunddates>shareEndDate){
				var annualCheckOutFeeShow = 0.00;
				var apportionMoneyShow = realAnnualFees;
			} else {
				var annualCheckOutFeeShow = annualCheckOutFee;
				var apportionMoneyShow = (realAnnualFees-annualCheckOutFee);
			}
			// 分摊结束日期
			var shareEndDate = moment(widget.get("form").getValue("endDate")).valueOf();
			// 退费日期
			var refunddates = moment(refunddate).valueOf();
			if(refunddates>shareEndDate){
				var annualCheckOutFeeShow = 0.00;
				var apportionMoneyShow = realAnnualFees;
			} else {
				var annualCheckOutFeeShow = annualCheckOutFee;
				var apportionMoneyShow = (realAnnualFees-annualCheckOutFee);
			}
			widget.get("editGrid").setData(result);
			widget.element.find(".J-grid-table").append("<tr data-idattribute>" +
					"<td class='J-date'><pre>合计</pre></td>" +
					"<td class='J-chargeApportion text-right'><pre>"+widget.thousand(realAnnualFees)+"</pre></td>" +
					"<td class='J-refundApportion text-right'><pre>"+widget.thousand(annualCheckOutFeeShow)+"</pre></td></tr>" );
			if(annualCheckOutFee){
				widget.element.find(".J-grid-table .J-refundApportion").after("<td class='J-apportionMoney text-right'><pre>"+widget.thousand(apportionMoneyShow)+"</pre></td>");
			}else{
				widget.element.find(".J-grid-table .J-refundApportion").after("<td class='J-apportionMoney text-right'><pre>"+widget.thousand((realAnnualFees))+"</pre></td>" );
			}
					
		},
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"服务费收款明细",
        			//按钮组
        			search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/annualfees/searchbyapportion",
							data:{
								s:str,
								properties:"payer.memberSigning.room.number," +
											"payer.personalInfo.name,realAnnualFees",
								fetchProperties:"*," +
								"annualFees.payer.memberSigning.room.number," +
								"annualFees.payer.personalInfo.name," +
								"annualFees.operator.name," +
								"annualFees.confirm.name," +
								"annualFees.invoice.name," +
								"annualFees.payer.personalInfo.mobilePhone," +
								"annualFees.payer.personalInfo.phone," +
								"annualFees.beginDate," +
								"annualFees.endDate," +
								"annualFees.realAnnualFees," +
								"annualFees.chargeTime," +
								"annualFeesRefund.annualCheckOutFee," +
								"annualFeesRefund.createDate",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
							}
						});
					},
        			
        			buttons:[{
        				id:"return",
        				text:"返回",
						show:false,
						handler:function(){
							widget.hide([".J-Form",".J-subList"]).show([".J-Grid"]);
							widget.get("subnav").hide(["return","save"]).show(["search","building","time"]);
							widget.get("grid").refresh();
							return false;
						}
        			},{
        				id:"save",
        				text:"保存",
        				show:false,
        				handler:function(){
        					var form=widget.get("form");
        					if(isNaN(form.getValue("apportionFrequency"))){
		         				Dialog.alert({
		   							content : "请输入有效的分摊次数!"
		   						 });
		         				return false;
		         			}
        					var editData=widget.get("editGrid").getData();
							var formData=widget.get("form").getData();
							var charge=0;
							var refund=0;
							for(var i=0;i<editData.length;i++){
								if(isNaN(editData[i].chargeApportion)||isNaN(editData[i].refundApportion)){
									Dialog.alert({
			   							content : "请输入有效的分摊金额!"
			   						 });
			         				return false;
								}
								charge+=parseInt(editData[i].chargeApportion==""?"0":editData[i].chargeApportion);
								refund+=parseInt(editData[i].refundApportion==""?"0":editData[i].refundApportion);
							}
							var orgcharge=form.getValue("annualFees.realAnnualFees");
							var orgrefund=form.getValue("annualFeesRefund.annualCheckOutFee");
							if(parseInt(orgcharge)!=charge||refund!=parseInt(orgrefund==""?"0":orgrefund)){
								Dialog.alert({
									content : "分摊费用与实收服务费和实退服务费的和不等!"
								 });
			     				return false;
							}else{
								var chargemonth=moment(form.getValue("annualFees.beginDate")).format("DD");
								var begindata=form.getValue("beginDate");
								var enddata=form.getValue("endDate");
								formData.beginDate=moment(begindata).add('day',(chargemonth-1)).valueOf();
								formData.endDate=moment(enddata).add('day',(chargemonth-1)).valueOf();
								formData.itemsList=editData;
								Dialog.alert({
	                        		title:"提示",
	                        		showBtn:false,
	                        		content:"正在保存，请稍后……"
	                        	});
								aw.saveOrUpdate("api/annualfeeapportion/save",aw.customParam(formData),function(data){
									Dialog.close();
									if(params.father=="annualfeeapportionedit"){
										widget.openView({
											url:"eling/elcms/charge/annualfeeapportion/annualfeeapportion"
										});
									}else{
										widget.hide([".J-Form",".J-subList"]).show([".J-Grid"]);
										widget.get("subnav").hide(["return","save"]).show(["search","building","time"]);
										widget.get("grid").refresh();
									}
								});
							}
        				}
        			}],
        			
        			buttonGroup:[{
        				   id:"building",
        				   showAll:true,
        				   showAllFirst:true,
        				   handler:function(key,element){
        					   widget.get("subnav").setValue("search","");
   							   widget.get("grid").refresh();
   						   }  
        			   }],
        			   time:{
        				   tip:"收费日期或退费日期",
        				   click:function(time){
        					   widget.get("subnav").setValue("search","");
        					   widget.get("grid").refresh();
        				   },
        			   }
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-Grid",
				model:{
					url:"api/annualfees/querybyapportion",
					params:function(){
						return {
						"payer.memberSigning.room.building":widget.get("subnav").getValue("building"),
						"chargeStatus":"Receiving",
						"chargeTime":widget.get("subnav").getValue("time").start,
						"chargeTimeEnd":widget.get("subnav").getValue("time").end,
						"annualFees.payer.memberSigning.room.building":widget.get("subnav").getValue("building"),
						"createDate":widget.get("subnav").getValue("time").start,
						"createDateEnd":widget.get("subnav").getValue("time").end,
						fetchProperties:"*," +
							"annualFees.payer.memberSigning.room.number," +
							"annualFees.payer.personalInfo.name," +
							"annualFees.operator.name," +
							"annualFees.confirm.name," +
							"annualFees.invoice.name," +
							"annualFees.payer.personalInfo.mobilePhone," +
							"annualFees.payer.personalInfo.phone," +
							"annualFees.beginDate," +
							"annualFees.endDate," +
							"annualFees.realAnnualFees," +
							"annualFees.chargeTime," +
							"annualFeesRefund.annualCheckOutFee," +
							"annualFeesRefund.createDate",
						};
					},
					columns:[{
						name:"annualFees.payer.memberSigning.room.number",
						label:"房间号",
						issort: true,
					},{
						name:"annualFees.payer.personalInfo.name",
						label:"付款人"
					},{
						name:"annualFees.endDate",
						label:"到期日期",
						issort: true,
						format:"date"
					},{
						name:"annualFees.realAnnualFees",
						label:"实收服务费",
						className: "text-right",
						format:function(value,row){
							if(value){
								return Number(value).toFixed(2);
							}else{
								return Number(0).toFixed(2);  
							}
						},
					},{
						name:"annualFees.chargeTime",
						label:"收费日期",
						format:"date"
					},{
						name:"annualFeesRefund.annualCheckOutFee",
						label:"实退服务费",
						className: "text-right",
						format:function(value,row){
							if(value){
								return Number(value).toFixed(2);
							}else{
								return Number(0).toFixed(2);  
							}
						},
					},{
						name:"annualFeesRefund.createDate",
						label:"退费日期",
						format:"date"
					},{
						name:"operate",
						label : "操作",
						format:"button",
						formatparams:[{
							key:"apportion",
							text:"分摊",
							handler:function(index,data,rowEle){
								var form = widget.get("form");
								if(data.annualFees.beginDate==null||data.annualFees.endDate==null){
									Dialog.alert({
										content : "该服务费付款单没有起始日期或结束日期！"
									 });
									return false;
								}
								aw.ajax({
									url : "api/annualfeeapportion/query",
									type : "POST",
									data : {
										annualFees : data.annualFees.pkAnnualFees,
										"createDate":null,
										"createDateEnd":null,
										fetchProperties:"annualFees.payer.personalInfo.name,annualFees.payer.memberSigning.room.number,annualFees.beginDate,annualFees.endDate,annualFees.realAnnualFees,annualFees.pkAnnualFees,pkAnnualFeesApportion,apportionFrequency,version,endDate,beginDate,operator.pkUser,annualFees"
									},
									success : function(result) {
										if(result.length>0){
											aw.ajax({
												url : "api/annualfeeapportiondetail/query",
												type : "POST",
												data : {
													annualfeeApportion : result[0].pkAnnualFeesApportion,
													fetchProperties:"*,annualfeeApportion.pkAnnualFeesApportion" +
															",apportionMoney" +
															",operator.pkUser" +
															",version" +
															",date"
												},
												success : function(datas) {
													widget.get("editGrid").setData(datas);
													//服务费退款情况
													result[0].annualFeesRefund=data.annualFeesRefund;
													form.setData(result[0]);
													form.setValue("annualFees",result[0].annualFees.pkAnnualFees);
													form.setValue("annualFeesRefund",result[0].annualFeesRefund.pkAnnualFeesRefund);
													form.setValue("operator",result[0].operator.pkUser);
//													form.setValue("annualFeesRefund.createDate",data.annualFeesRefund.createDate);
//													form.setValue("annualFeesRefund.annualCheckOutFee",data.annualFeesRefund.annualCheckOutFee);
													
													form.setDisabled(["annualFees.beginDate","annualFees.endDate","annualFeesRefund.createDate"],true);

													var refunddate ;
										            var annualCheckOutFee;
										            if(data.annualFeesRefund&&data.annualFeesRefund.createDate){
										            	refunddate = moment(data.annualFeesRefund.createDate);
										            	annualCheckOutFee = data.annualFeesRefund.annualCheckOutFee;
										            }
										           
										            var realAnnualFees = data.annualFees.realAnnualFees;
										            var beginDate = data.annualFees.beginDate;
										            
										            widget.editGridData(widget,realAnnualFees,beginDate,annualCheckOutFee,refunddate);
												}
											});
										}else{
											form.setData(data);
											form.setValue("annualFees",data.annualFees.pkAnnualFees);
											form.setValue("beginDate",data.annualFees.beginDate);
											form.setValue("endDate",moment(data.annualFees.beginDate).add("month",11));
											
											form.setDisabled(["annualFees.beginDate","annualFees.endDate","annualFeesRefund.createDate"],true);

								            var refunddate ;
								            var annualCheckOutFee;
								            if(data.annualFeesRefund&&data.annualFeesRefund.createDate){
								            	form.setValue("annualFeesRefund",data.annualFeesRefund.pkAnnualFeesRefund);
								            	refunddate = moment(data.annualFeesRefund.createDate);
								            	annualCheckOutFee = data.annualFeesRefund.annualCheckOutFee;
								            }
								           
								            var realAnnualFees = data.annualFees.realAnnualFees;
								            var beginDate = data.annualFees.beginDate;
								            
								            //默认的年费分摊：12月
								            var len = 12;
								            form.setValue("apportionFrequency",len);
								            widget.arrayEditGrid(widget,len,realAnnualFees,beginDate,annualCheckOutFee,refunddate);
										}
									}
								});
								widget.show([".J-Form",".J-subList"]).hide([".J-Grid"]);
								widget.get("subnav").hide(["search","building","time"]).show(["return","save"]);
							}
						}]
					}]
				}
            });
            this.set("grid",grid);
            
            var form=new Form({
            	show:false,
        		parentNode:".J-Form",
        		model:{
        			id:"annualfeeapportion",
        			defaultButton:false,
        			items:[{
        				name:"pkAnnualFeesApportion",
        				type:"hidden"
        			},{
        				name:"version",
        				type:"hidden",
        				defaultValue:0
        			},{
        				name:"operator",
        				type:"hidden",
        				defaultValue:activeUser.pkUser
        			},{
        				name:"annualFees",
        				type:"hidden",
        			},{
        				name:"annualFeesRefund",
        				type:"hidden",
        			},{
        				id:"annualFees",
        				name:"annualFees.payer.memberSigning.room.number",
        				label:"房间",
        				readonly:true,
    					className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				id:"annualFees",
        				name:"annualFees.payer.personalInfo.name",
        				label:"付款人",
        				readonly:true,
    					className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				id:"annualFees",
        				name:"annualFees.beginDate",
        				label:"缴费起始日期",
        				type:"date",
        				readonly:true,
						mode:"YYYY-MM-DD",
    					className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				id:"annualFees",
        				name:"annualFees.endDate",
        				label:"缴费到期日期",
        				type:"date",
        				readonly:true,
						mode:"YYYY-MM-DD",
    					className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				id:"annualFees",
        				name:"annualFees.realAnnualFees",
        				label:"实收服务费",
        				readonly:true,
    					className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"apportionFrequency",
        				label:"分摊次数",
        				type:"text",
        				readonly:true,
        				validate:["required"],
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				id:"annualFeesRefund",
        				name:"annualFeesRefund.createDate",
        				label:"退费日期",
        				type:"date",
        				readonly:true,
						mode:"YYYY-MM-DD",
    					className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				id:"annualFeesRefund",
        				name:"annualFeesRefund.annualCheckOutFee",
        				label:"退费金额",
        				readonly:true,
    					className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"beginDate",
        				label:"分摊开始月份",
        				type:"date",
        				mode:"YYYY-MM",
        				validate:["required"],
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			},{
        				name:"endDate",
        				label:"分摊结束月份",
        				type:"date",
        				mode:"YYYY-MM",
        				validate:["required"],
        				className:{
							container:"col-md-6",
							label:"col-md-4"
						}
        			}]
        		}
        	});
        	this.set("form",form);
        	
        	var editGrid=new EditGrid({
				parentNode:".J-subList",
				isInitPageBar:false,
				url:"api/annualfeeapportiondetail/query",
				autoRender:false,
				model:{
					onAdd : function(editors){
						editgrid.add({
							text : editors["text"].getValue(),
						});
					},
					columns:[{
						name : "date",
						label : "分摊月份",
						className:"one",
						format:function(value){
								return moment(value).format("YYYY-MM");
						}
					},{
						name : "chargeApportion",
						className:"oneColumn",
						format:"thousands",
						label : "收费分摊金额",
						editor : {
							type : "text",
							onChange : function(plugin,index,rowData){
								rowData.chargeApportion = plugin.getValue();
								editGrid.update(index,rowData);
							}
						},
						format:function(value,row){
							if(value){
								return Number(value).toFixed(2);
							}else{
								return Number(0).toFixed(2);  
							}
						},
					},{
						name : "refundApportion",
						className:"oneColumn",
						format:"thousands",
						label : "退费分摊金额",
						editor : {
							type : "text",
							onChange : function(plugin,index,rowData){
								rowData.refundApportion = plugin.getValue();
								editGrid.update(index,rowData)
							}
						},
						format:function(value,row){
							if(value){
								return Number(value).toFixed(2);
							}else{
								return Number(0).toFixed(2);  
							}
						},
					},{
						name : "apportionMoney",
						className:"oneColumn",
						format:"thousands",
						label : "分摊金额",
						format:function(value,row){
							if(row.chargeApportion||row.refundApportion){
								row.apportionMoney=row.chargeApportion-row.refundApportion;
								return Number(row.chargeApportion-row.refundApportion).toFixed(2);
							}else{
								return Number(0).toFixed(2);  
							}
						},
					}]
					
				}
			});
        	this.set("editGrid",editGrid);
        },
		afterInitComponent:function(params,widget){
			if(params && params.father!="annualfeeapportion"){
				aw.ajax({
					url : "api/annualfeeapportiondetail/query",
					type : "POST",
					data : {
						annualfeeApportion : params.annualFeesApportion.pkAnnualFeesApportion,
						fetchProperties:"*,annualfeeApportion.pkAnnualFeesApportion" +
								",apportionMoney" +
								",operator.pkUser" +
								",version" +
								",date"
					},
					success : function(datas) {
						widget.show([".J-Form",".J-subList"]).hide([".J-Grid"]);
						
						widget.get("editGrid").setData(datas);
						var form =widget.get("form"); 
						form.setData(params.annualFeesApportion);
						form.setValue("annualFees",params.annualFeesApportion.annualFees.pkAnnualFees);
						form.setValue("operator",params.annualFeesApportion.operator.pkUser);
						
						var realAnnualFees=params.annualFeesApportion.annualFees.realAnnualFees;
						var annualCheckOutFee=0;
						if(params.annualFeesApportion.annualFeesRefund){
							form.setValue("annualFeesRefund",params.annualFeesApportion.annualFeesRefund.pkAnnualFeesRefund);
							annualCheckOutFee=params.annualFeesApportion.annualFeesRefund.annualCheckOutFee;
						}
						
						widget.element.find(".J-grid-table").append("<tr data-idattribute>" +
								"<td class='J-date'><pre>合计</pre></td>" +
								"<td class='J-chargeApportion text-right'><pre>"+widget.thousand(realAnnualFees)+"</pre></td>" +
								"<td class='J-refundApportion text-right'><pre>"+widget.thousand(annualCheckOutFee)+"</pre></td></tr>" );
						if(annualCheckOutFee&&annualCheckOutFee>0){
							widget.element.find(".J-grid-table .J-refundApportion").after("<td class='J-apportionMoney text-right'><pre>"+widget.thousand((realAnnualFees-annualCheckOutFee))+"</pre></td>");
						}else{
							widget.element.find(".J-grid-table .J-refundApportion").after("<td class='J-apportionMoney text-right'><pre>"+widget.thousand((realAnnualFees))+"</pre></td>" );
						}
						
						if(params&&params.father=="annualfeeapportionedit"){
							widget.get("subnav").hide(["search","building","time"]).show(["save"]);
						}else if(params&&params.father=="annualfeeapportiondetail"){
							widget.get("subnav").hide(["search","building","time","save"]);
							form.setDisabled(true);
							widget.get("editGrid").setDisabled(true);
						}
					}
				});
			}
			$(".J-subList .J-grid-footer .J-editgrid-edit-td ").css('display','none');
		},
	});
	module.exports = annualfeesearch;	
});
