/**
 * 能源电费收费
 * ELview
 * Subnav
 * Grid
 * @author zp
 */
define(function(require, exports, module) {
	var _ = require("underscore");
	var ELView = require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid = require("grid-1.0.0");
	var MultiRowGrid = require("multirowgrid");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
	var Enum =require("enums");
	var store = require("store"); 
	var activeUser = store.get("user");
	require("jquery.ajaxfileupload");
	require("./generalfees.css");
	var template=require("./generalfees.tpl");
	var generalfeesprint = require("./print/generalfeesprint.tpl");
	
	var Handlebars = require("handlebars");
    // 两个浮点数求和
    function accAdd(num1,num2){
       var r1,r2,m;
       try{
           r1 = num1.toString().split('.')[1].length;
       }catch(e){
           r1 = 0;
       }
       try{
           r2=num2.toString().split(".")[1].length;
       }catch(e){
           r2=0;
       }
       m=Math.pow(10,Math.max(r1,r2));
       // return (num1*m+num2*m)/m;
       return Math.round(num1*m+num2*m)/m;
    }
    
    // 两个浮点数相减  
    function accSub(num1,num2){  
       var r1,r2,m;  
       try{  
           r1 = num1.toString().split('.')[1].length;  
       }catch(e){  
           r1 = 0;  
       }  
       try{  
           r2=num2.toString().split(".")[1].length;  
       }catch(e){  
           r2=0;  
       }  
       m=Math.pow(10,Math.max(r1,r2));  
       n=(r1>=r2)?r1:r2;  
       return (Math.round(num1*m-num2*m)/m).toFixed(n);  
    }  
    
    //获取文件后缀名
    //输入"abc.jpg" 输出".jpg"
    function getFileExt(str){ 
	    var result = /\.[^\.]+$/.exec(str); 
	    return result; 
    }
    //整理grid查回数据
    function gridDataArrange(data){
    	for(var i in data){
			var water = 0;
			var telecom = 0;
			var electricity = 0;
			var carryOver = 0;
			var total = 0;
			var status = 0;
			for(var j in data[i].generalFeesDetails){
				if(data[i].generalFeesDetails[j].feeType.catalog.key == "Water"){
					water += data[i].generalFeesDetails[j].fees + data[i].generalFeesDetails[j].adjustFees;
				}else if(data[i].generalFeesDetails[j].feeType.catalog.key == "Electricity"){
					electricity += data[i].generalFeesDetails[j].fees + data[i].generalFeesDetails[j].adjustFees;
				}else if(data[i].generalFeesDetails[j].feeType.catalog.key == "Telecom"){
					telecom += data[i].generalFeesDetails[j].fees + data[i].generalFeesDetails[j].adjustFees;
				}else if(data[i].generalFeesDetails[j].feeType.catalog.key == "CarryOver"){
					if(data[i].generalFeesDetails[j].feeType.name == "上月转入"){
						carryOver += data[i].generalFeesDetails[j].fees;
					}else if(data[i].generalFeesDetails[j].feeType.name == "本月转出"){
						carryOver -= data[i].generalFeesDetails[j].fees;
					}
				}
				if(data[i].generalFeesDetails[j].payStatus != null && data[i].generalFeesDetails[j].payStatus.key == "UnPaid"){
					status++;
				}
			}
			total = water + telecom + electricity + carryOver;
			data[i].water = water;
			data[i].telecom = telecom;
			data[i].electricity = electricity;
			data[i].carryOver = carryOver;
			data[i].total = total;
			data[i].status = status;
		}
    	
    	//过滤缴费条件
    	var result = [];
    	var chargeStatus = $(".J-btngroup-chargeStatus").attr("data-key");
    	if(chargeStatus == "Payup"){
    		//返回每条数据中，所有的子收费状态都是已缴清的（即本条数据的所有子收费都已缴清，本条数据才算已缴清）
    		result = _.filter(data, function(para){
      			return _.every(para.generalFeesDetails,function(generalFeesDetails){
      				return generalFeesDetails.payStatus.key == "Paid";
      			});
			});
			return result;
		}else if(chargeStatus == "UnPaid"){
			//返回包含未缴费的
			result = _.filter(data, function(para){
				return _.some(para.generalFeesDetails,function(generalFeesDetails){
					return generalFeesDetails.payStatus.key == "UnPaid";
				});
			});
			return result;
		}
    	return data;
    }
    
    //打印多个，整理数据
    function printGridDataArrangeOfMulti(result){
    	var datas=[];
		var sum = 0.0;
		for(var i=0;i<result.generalFeesDetails.length;i++){
			result.generalFeesDetails[i].realfee = Number(result.generalFeesDetails[i].fees).toFixed(2) + Number(result.generalFeesDetails[i].adjustFees).toFixed(2);
			if(result.generalFeesDetails[i].feeType.name != "本月转出"){
				sum += Number(result.generalFeesDetails[i].realfee).toFixed(2);
			}else{
				sum -= Number(result.generalFeesDetails[i].realfee).toFixed(2);
			}
			if(!_.isNull(result.generalFeesDetails[i].curNumber) && !_.isNull(result.generalFeesDetails[i].preNumber)){
				result.generalFeesDetails[i].quantity = Number(result.generalFeesDetails[i].curNumber.toFixed(2) - result.generalFeesDetails[i].preNumber.toFixed(2)).toFixed(2);
			}
			datas.push(result.generalFeesDetails[i]);
		}
		var No = result.generalFeesDetails.length;//序号
		var sumfee ={
				feeType : {
					name : "合计",
					number : No + 1
				}, 
				realfee : sum
		};
		datas.push(sumfee);
		return datas;
    }
    //整理print grid查回来的数据
    function printGridDataArrange(result){
    	var datas=[];
		var sum = 0.0;
		for(var i=0;i<result[0].generalFeesDetails.length;i++){
			result[0].generalFeesDetails[i].realfee = Number(result[0].generalFeesDetails[i].fees).toFixed(2) + Number(result[0].generalFeesDetails[i].adjustFees).toFixed(2);
			if(result[0].generalFeesDetails[i].feeType.name != "本月转出"){
				sum += Number(result[0].generalFeesDetails[i].realfee).toFixed(2);
			}else{
				sum -= Number(result[0].generalFeesDetails[i].realfee).toFixed(2);
			}
			if(!_.isNull(result[0].generalFeesDetails[i].curNumber) && !_.isNull(result[0].generalFeesDetails[i].preNumber)){
				result[0].generalFeesDetails[i].quantity = Number(result[0].generalFeesDetails[i].curNumber.toFixed(2) - result[0].generalFeesDetails[i].preNumber.toFixed(2)).toFixed(2);
			}
			datas.push(result[0].generalFeesDetails[i]);
		}
		var No = result[0].generalFeesDetails.length;//序号
		/*var preMonthIn ={
				feeType : {
					name : "上月转入",
					number : No + 1
				}, 
				realfee : result[0].preMonthIn
		};
		datas.push(preMonthIn);
		var currMonthOut ={
				feeType : {
					name : "本月转出",
					number : No + 2
				}, 
				realfee : result[0].currMonthOut
		};
		datas.push(currMonthOut);*/
		//添加合计
		//sum = sum + result[0].preMonthIn - result[0].currMonthOut;
		var sumfee ={
				feeType : {
					name : "合计",
					number : No + 1
				}, 
				realfee : sum
		};
		datas.push(sumfee);
		return datas;
    }
    
    //打印多个时  new Grid()
    function printNewGrid(data,index,iorder){  // TODO new grid
    	var grid = new Grid({
			parentNode:".J-generalfeesprintgrid-"+index+"-"+iorder,
			isInitPageBar:false,
			model:{
				columns:[{
					key:"feeType.number",
					name:"序号",
					className:"text-center"
				},{
					key:"feeType.name",
					name:"费用项目",
					className:"text-center"
				},{
					key:"curNumber",
					name:"本月表数",
					className:"text-center"
				},{
					key:"preNumber",
					name:"上月表数",
					className:"text-center"
				},{
					key:"quantity",
					name:"实用数量",
					className:"text-center"
				},{
					key:"feeType.price",
					name:"单价",
					className:"text-center"
				},{
					key:"feeType.valuationUnit.value",
					name:"计量单位",
					className:"text-center"
				},{
					key:"realfee",
					name:"金额",
					className:"text-right",
					format:"thousands",
					formatparams:{
						precision:2
					},
				},{
					key:"payType.value",
					name:"付款方式",
					className:"text-center"
				},{
					key:"payDate",
					name:"缴费日期",
					format:"date",
					formatparams:{
						mode:"YYYY-MM-DD"
					},
					className:"text-center"
				}]
			}
		}).setData(data);
    	$(".J-grid-footer .J-grid-total-info").css("margin-top","0");
    	$(".J-grid-footer .J-grid-total-info").css("font-weight","normal");
    	if(iorder==1){
    		$(".J-generalfeesprintgrid-"+index+"-"+iorder+" .J-grid-footer .J-grid-total-info").text("备注或说明:收款后本存根作备查用");
    	}else{
    		$(".J-generalfeesprintgrid-"+index+"-"+iorder+" .J-grid-footer .J-grid-total-info").text("备注或说明:每星期二上午代充天然气，单价3元/立方米");
    	}
    	
    }
    
	var generalfees = ELView.extend({
    	attrs:{
    		template:template,
    		printGrids : []
        },
        events:{
    	   "change #excelImport" : function(e){
				$("#fileName").val(e.target.files[0].name);
			}
        },
        initComponent:function(params,widget){
        	var importFetch = "pkGeneralFeesTemp," +
			"feeMonth,payer," +
			"timestap," +
			"memberSigning.room.number," +
			"memberSigning.pkMemberSigning," +
			"generalFeesDetailsTemp.pkGeneralFeesDetail," +
			"generalFeesDetailsTemp.curNumber," +
			"generalFeesDetailsTemp.beforeCurNumber," +
			"generalFeesDetailsTemp.preNumber," +
			"generalFeesDetailsTemp.beforePreNumber," +
			"generalFeesDetailsTemp.fees," +
			"generalFeesDetailsTemp.beforeFees," +
			"generalFeesDetailsTemp.adjustFees," +
			"generalFeesDetailsTemp.payStatus," +
			"generalFeesDetailsTemp.payType," +
			"generalFeesDetailsTemp.payDate," +
			"generalFeesDetailsTemp.dataType," +
			"generalFeesDetailsTemp.feeType.name";
        	var itemsyear=[];
			for(var i=0;i<=moment().format("YYYY")-2007;i++){
				var obj={};
				obj.key=parseInt(moment().format("YYYY"))-parseInt(i);
				obj.value=parseInt(moment().format("YYYY"))-parseInt(i);
				itemsyear.push(obj);
			}
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
        			title:"能源电信收费",
        			search : {
						placeholder : "房间号",
						handler : function(str){
							var re=/^([0-1]\d)[V|\-](\d[0-1]\d)/;
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/generalfees/search",
								data:{
									s:str,
									"memberSigning.status":"Normal",
									properties : "memberSigning.room.number",
									fetchProperties:"pkGeneralFees," +
													"feeMonth,payer," +
													"memberSigning.room.number," +
													"memberSigning.pkMemberSigning," +
													"generalFeesDetails.pkGeneralFeesDetail," +
													"generalFeesDetails.curNumber," +
													"generalFeesDetails.preNumber," +
													"generalFeesDetails.fees," +
													"generalFeesDetails.adjustFees," +
													"generalFeesDetails.payStatus," +
													"generalFeesDetails.payType," +
													"generalFeesDetails.payDate," +
													"generalFeesDetails.feeType.catalog",
								},
								dataType:"json",
								success:function(data){
										gridDataArrange(data);
										g.setData(data);
									}
								});
						}
					},
        			buttons:[{
        				id:"pay",
        				text:"缴费",
        				show:false,
        				handler:function(){
        					if($(".J-payGrid-checkbox:checked").size() == 0){
        						Dialog.alert({
        							content:"请选中一条数据。"
        						});
        						return false;
        					}
        					var gridData = widget.get("payGrid").getData();
        					//（电+水+电信）已缴清的个数
        					var gridElecWatTelePaidCount = 0;
        					//（电+水+电信）已选中的个数
        					var gridElecWatTeleCheckedCount = 0;
        					//（电+水+电信）总个数
        					var gridElecWatTeleCount = 0;
        					//结转已选中个数
        					var gridCarryOverCheckedCount = 0;
        					
        					
        					//计算出paygrid里面（电+水+电信）已缴清项的个数
        					for(var i in gridData){
        						if(gridData[i].catalog != "结转"){
        							for(var j in gridData[i].feeTypes){
        								gridElecWatTeleCount ++;
        								if(gridData[i].feeTypes[j].feetype.payStatus.key == "Paid"){
        									gridElecWatTelePaidCount++;
        								}
        							}
        						}
        					}
        					var d=$(".J-payGrid-checkbox").valueOf();
        					var c=[];
        					for(var i=0;i<d.length;i++){
        						if(d[i].checked){
        							var checkdata=$(d[i]).attr("data-pkGeneralFeesDetail");
        							var checkIndex=$(d[i]).parents("tr").attr("data-index");
        							var data=widget.get("payGrid").getSelectedData(checkIndex);
        							for(var j=0;j<data.feeTypes.length;j++){
        								if(data.feeTypes[j].feetype.pkGeneralFeesDetail == checkdata){
        									c.push(data.feeTypes[j]);
        								}
        							}
        						}
        					}
        					for(var i in c){
        						if(c[i].feetype.feeType.catalog.key != "CarryOver"){
        							gridElecWatTeleCheckedCount++;
        						}else{
        							gridCarryOverCheckedCount++;
        						}
        					}
        					//最后一次缴费时，要将结转项全选上
        					//如果（电+水+电信）已缴清项个数+选中项中的（电+水+电信）个数==（电+水+电信）总个数 并且 选中项中的结转项的个数不为2 
        					if(gridElecWatTelePaidCount + gridElecWatTeleCheckedCount == gridElecWatTeleCount && gridCarryOverCheckedCount != 2){
        						Dialog.alert({
        							content:"本次操作将会是本账单的最后一次缴费，请将结转项全选。"
        						});
        						return false;
        					}
        					var sumfee=0;
        					var pks="";
        					for(var j=0;j<c.length;j++){
        						//sumfee=sumfee+c[j].realfee;
        						if(c[j].feetype.feeType.name != "本月转出"){
            						sumfee=accAdd(sumfee,c[j].realfee);
        						}else{
            						sumfee=accSub(sumfee,c[j].realfee);
        						}
        						if(j==c.length-1){
									pks+=c[j].feetype.pkGeneralFeesDetail;
								}else{
									pks+=c[j].feetype.pkGeneralFeesDetail+",";
								}
        					}
							Dialog.showComponent({
								title:"缴费",
								setStyle:function(){
									$(".el-dialog .modal.fade.in").css({
										"top":"10%"
									});
								},
								confirm:function(){
									aw.ajax({
										url:"api/generalfeesdetail/pay",
										data:{
											payType:$("#pay .J-form-pay-select-payType").valueOf()[1].value,
											pks:pks
											},
										dataType:"json",
										success:function(data){
											if(data.msg){
			                            		   Dialog.alert({
														content:data.msg
												   });
			                            	   }
											widget.show(".J-Grid").hide([".J-payGrid"]);
											widget.get("subnav").hide(["return","pay"]).show(["search","year","month","building","excelImport","chargeStatus","printall"]);
											widget.get("subnav").setTitle("能源电信收费");
											widget.get("grid").refresh(null,function(data){
												gridDataArrange(data);
												widget.get("grid").setData(data);
											});
										}
									});
								}
							},new Form({
								model:{
									id:"pay",
									items:[{
										name:"roomnumber",
										label:"房间号  :",
										type:"text",
										readonly:true,
										defaultValue:c[0].roomNo,
										style:{
											label:"width:30%"
										}
									},{
										name:"feeMonth",
										label:"缴费周期:",
										readonly:true,
										defaultValue:moment(c[0].feetype.feeMonth).format("YYYY-MM"),
										style:{
											label:"width:30%"
										}
									},{
										name:"sumfee",
										label:"缴费总额:",
										readonly:true,
										defaultValue:sumfee,
										style:{
											label:"width:30%"
										}
									},{
										name:"payType",
										label:"缴费方式:",
										type:"select",
										url:"api/enum/com.eling.elcms.charge.model.GeneralFeesDetail.PayType",
										defaultValue:"Cash",
										style:{
											label:"width:30%"
										}
									}],
									defaultButton:false
								}
							}));
							return;
        				}
        			},{
 						id:"print",
 						text:"打印",
 						show:false,
 						type:"button",
 						handler:function(){
 							$(".pagination").hide;
 							var subnav=widget.get("subnav");
 							subnav.hide(["return","print"]);
 							widget.show([".J-printGrid-title"]);
 							window.print();
 							subnav.show(["return","print"]);
 							widget.hide([".J-printGrid-title"]);
 	 					}				
        			},{
 						id:"printInBill",
 						text:"打印",
 						show:false,
 						type:"button",
 						handler:function(){
 							//var title=widget.get("subnav").getTitle();
        					widget.show([".J-printGrid",".J-printGrid-top",".J-printGrid-title"]).hide([".J-feesDetilsGrid",".J-feesDetilsGrid-top"]);
 							subnav.hide(["return","printInBill"]);
 							window.print();
 							//widget.get("subnav").setTitle(title);
 							subnav.show(["return","printInBill"]);
        					widget.show([".J-feesDetilsGrid",".J-feesDetilsGrid-top"]).hide([".J-printGrid",".J-printGrid-top",".J-printGrid-title"]);

 	 					}				
        			},{
        				id:"confirm",
        				text:"确认修改",
        				show:false,
        				handler:function(){
        					Dialog.alert({
                        		title:"提示",
                        		showBtn:false,
                        		content:"保存中，请稍等……"
                        	});
        					var data = widget.get("importGrid").getData();
        					aw.ajax({
								url:"api/generalfees/modify",
								data:{
									timestap:data[0].timestap
									},
								dataType:"json",
								success:function(data){
									Dialog.close();
									if(data.msg){
	                            		   Dialog.alert({
												content:data.msg
										   });
	                            	   }
									widget.show(".J-Grid").hide([".J-payGrid",".J-feesDetilsGrid",".J-importGrid",".J-importGrid-top"]);
									widget.get("subnav").hide(["return","confirm"]).show(["search","year","month","building","excelImport","chargeStatus"]);
									widget.get("subnav").setTitle("能源电信收费");
									widget.get("grid").refresh(null,function(data){
										gridDataArrange(data);
										widget.get("grid").setData(data);
									});
								},
								error : function(jqXHR, textStatus, errorThrown){
									Dialog.close();
								}
        					});
        				}
        			},{
        				id:"printallstart", //TODO     打印
        				text:"打印",
        				show:false,
        				handler:function(){
        					window.print();
        				}
        			},{
        				id:"return",
        				text:"返回",
        				show:false,
        				handler:function(){
        					widget.show(".J-Grid").hide([".J-feesDetilsGrid",".J-payGrid",".J-printGrid",".J-printGrid-top",".J-importGrid",".J-importGrid-top",".J-feesDetilsGrid-top",".J-generalfeesprintgrid"]);
							widget.get("subnav").show(["search","building","year","month","excelImport","chargeStatus","printall"]).hide(["return","pay","print","confirm","printInBill","printallstart"]);
							widget.get("subnav").setTitle("能源电信收费");
        				}
        			},{
        				id:"excelImport",
        				text:"导入",
        				handler:function(){
        					var form = new Form({
								model:{
									id:"importForm",
									items:[{
										name:"year",
										label:"年",
										type:"select",
										options:itemsyear,
										defaultValue:moment().year()
									},{
										name:"month",
										label:"月份",
										type:"select",
										options:months,
										defaultValue:moment().month()+1
									},{
										name:"chooseFile",
										format : function(){
											return '<button class="btn" id="btnChooseFile" style="color: white;background: #f34541;position:absolute;left:247px;">选择文件</button>' +
												   '<input class="form-control J-annualFeePersonPhone" id="fileName" readonly="true"/>';
										}
									}],
									defaultButton:false
								}
							});
        					Dialog.showComponent({
								title:"Excel导入",
								content:" 请选择导入账单的账期，并选择文件，按确定后开始导入。导入过程较慢，请您耐心等候导入的完成，在导入时请勿刷新页面。",
								setStyle:function(){
									$(".el-dialog .modal.fade.in").css({
										"top":"10%",
										"width":"475px"
									});
								},
								events : {
									"click #btnChooseFile":function(e){
										$("#excelImport").val("");
										$("#excelImport").click();
									}
								},
								confirm:function(){
									var fileName = $("#fileName").val();
									if(fileName == ""){
										Dialog.alert({
			                        		title:"提示",
			                        		content:" 请选择导入文件!"
			                        	});
										return "NotClosed";
									}else if(getFileExt(fileName) != ".xlsx"){
										Dialog.alert({
			                        		title:"提示",
			                        		content:" 请导入后缀名为\"xlsx\"的Excel文件!"
			                        	});
										return "NotClosed";
									}else{
										var feeMonth = moment(form.getValue("year") + "-" +form.getValue("month")).valueOf();
										Dialog.alert({
			                        		title:"提示",
			                        		showBtn:false,
			                        		content:"导入过程较慢，请您耐心等候……"
			                        	});
										$.ajaxFileUpload({
							                url : "api/generalfees/import?feeMonth="+feeMonth+"&fetchProperties="+importFetch, 
							                secureuri:false,
							                fileElementId:'excelImport',
							                dataType: 'json',
							                uploadHttpData:function(data,dataType){
							                	if(data.responseText == ""){
							                		return null;
							                	}else{
							                		var result = data.responseText;
							                		try{
							                			return $.parseJSON(result);
							                		}catch(e){
							                			return result;
							                		}
							                	}
							                },
							                success: function (data){
							                	Dialog.close();
							                	//此处data与后台对应，如果返回null代表不存在同样账期的记录
							                	if(data == null){
							                		Dialog.alert({
														content:"导入成功"
													});
							                		widget.get("grid").refresh(null,function(data){
														gridDataArrange(data);
														widget.get("grid").setData(data);
													});
												//如果返回一个数组，并且长度是0代表导入的数据与原来的数据无差异
							                	}else if(data.length == 0 && data instanceof Array){
							                		Dialog.alert({
														content:"导入数据与原数据相同，忽略处理。"
													});
							                	//如果返回一个数组并且长度不为0代表导入的数据与原数据有差异
							                	}else if(data.length != 0 && data instanceof Array){
													Dialog.alert({
														content:"有数据变更，点击确定后查看详情。"
													});
													
													widget.get("subnav").setTitle(moment(data[0].feeMonth).format("YYYY")+"年"+moment(data[0].feeMonth).format("MM")+"月导入数据处理");
													widget.get("importGrid").setData(data);
													widget.show([".J-importGrid-top",".J-importGrid"]).hide(".J-Grid");
													$(".J-importGrid-top").text("(*)已缴清项的修改、删除操作将会被忽略。");
													widget.get("subnav").show(["confirm","return"]).hide(["building","year","month","pay","search","print","excelImport","chargeStatus"]);

							                	}else if(data != null && data.indexOf("您导入的不是格式为xlsx的Excel(2007/2010)文件!",0) != -1){
							                		Dialog.tip({
														title:"您导入的不是格式为xlsx的Excel(2007/2010)文件!"
													});
							                	}else if(data != null && data.indexOf("您导入的文件格式不正确!",0) != -1){
							                		Dialog.tip({
														title:"您导入的文件排版格式不正确!"
													});
							                	}
							                },
							                error: function (data, status, e){
							                	Dialog.close();
						                    }
							            });
										return "NotClosed";
									}
								}
							},form);
        				}
        			},{
        				id:"printall", //TODO     打印
        				text:"打印",
        				show:true,
        				handler:function(){
        					Dialog.alert({
                        		title:"提示",
                        		showBtn:false,
                        		content:"正在将数据转换为打印的数据格式，请您耐心等候……"
                        	});
        					var printGrids = this.get("printGrids");
        					for(var i in printGrids){
        						printGrids[i].destroy();
        					}
        					var gridData = grid.getData();
        					if(gridData.length<=0){
        						Dialog.alert({
									content : "没有数据，不能打印！"
								 });
								return false;
        					}
        					var gridSelectedData = widget.get("grid").getSelectedData();
        					var pkGeneralFeesIn = "";
        					if(gridSelectedData.length<=0){
        						/*Dialog.alert({
									content : "请勾选需要打印的数据！"
								 });
								return false;*/
        						for(var i =0;i<gridData.length;i++){
        							if(i==gridData.length-1){
        								pkGeneralFeesIn+=gridData[i].pkGeneralFees;
        							}else{
        								pkGeneralFeesIn+=gridData[i].pkGeneralFees+",";
        							}
        						}
        					}else{
        						for(var i =0;i<gridSelectedData.length;i++){
        							if(i==gridSelectedData.length-1){
        								pkGeneralFeesIn+=gridSelectedData[i].pkGeneralFees;
        							}else{
        								pkGeneralFeesIn+=gridSelectedData[i].pkGeneralFees+",";
        							}
        						}
        					}
        					aw.ajax({
        						url:"api/generalfees/queryOrderByFeeTypeNumber",
								data:{
									"pkGeneralFeesIn":pkGeneralFeesIn,
									"memberSigning.status":"Normal",
									fetchProperties:"feeMonth,payer," +
											"memberSigning.room.number," +
											"memberSigning.room.telnumber," +
											"generalFeesDetails.pkGeneralFeesDetail," +
											"generalFeesDetails.curNumber," +
											"generalFeesDetails.preNumber," +
											"generalFeesDetails.fees," +
											"generalFeesDetails.adjustFees," +
											"generalFeesDetails.payStatus," +
											"generalFeesDetails.payType," +
											"generalFeesDetails.payDate," +
											"generalFeesDetails.feeType.catalog,"+
											"generalFeesDetails.feeType.name," +
											"generalFeesDetails.feeType.number,"+
			                                "generalFeesDetails.feeType.meterReading,"+
			                                "generalFeesDetails.feeType.valuationUnit,"+
			                                "generalFeesDetails.feeType.price," +
			                                "generalFeesDetails.operator.name" 
								},
        						success : function(result){
        							var ret = Handlebars.compile(generalfeesprint)(result);
        							$(".J-generalfeesprintgrid").html(ret);
        							for(var i in result){
        								var datas = printGridDataArrangeOfMulti(result[i]);
        								var feeMonth = result[i].feeMonth;
        								var payer = result[i].payer;
        								var roomNo = result[i].memberSigning.room.number;
    									var roomTelNo = result[i].memberSigning.room.telnumber;
//    									var member = result[i].memberSigning.members;
    									//二级标题
    									var array = [];
    									array = roomNo.split("-");
//    									var memberName = "";
//    									if(member.length == 1){
//    										memberName = result[i].memberSigning.members[0].personalInfo.name;
//    									}else if(member.length > 1){
//    										memberName = result[i].memberSigning.members[0].personalInfo.name + " " +result[i].memberSigning.members[1].personalInfo.name;
//    									}
        								$(".J-generalfeesprintgrid-title-"+i+"-"+1).text("亲和源老年公寓"+moment().format("YYYY")+"年"+moment(feeMonth).format("MM")+"月"+"水电费存根");
        								$(".J-generalfeesprintgrid-top-"+i).text(array[0]+"号楼  "+array[1]+"室  " + "付款人:" + payer +" 房间电话:"+ roomTelNo);
        								$(".J-generalfeesprintgrid-bottom-"+i).html("收款日期&nbsp;"+moment(feeMonth).format("YYYY")+"年&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;日");
        								printNewGrid(datas,i,1);
        								$(".J-generalfeesprintgrid-title-"+i+"-"+2).text("亲和源老年公寓"+moment().format("YYYY")+"年"+moment(feeMonth).format("MM")+"月"+"水电费代收据");
        								printNewGrid(datas,i,2);
//        								memberName = "";
        							}
        							widget.show([".J-generalfeesprintgrid"]).hide(".J-Grid");
        							widget.get("subnav").show(["printallstart","return"]).hide(["building","year","month","search","excelImport","chargeStatus","printall"]);
                					Dialog.close();

        						}
        					});
        				}
        			}],
        			buttonGroup:[{
						id:"building",
						tip:"楼号",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh(null,function(data){
								 widget.get("grid").setData(gridDataArrange(data));

							});
						  }
					 	},{
	     				   id:"chargeStatus",
	     				   tip:"缴费状态",
	    				   showAll:true,
	    				   showAllFirst:true,
	    				   items:[{
	    					   key:"UnPaid",
	    					   value:"未缴清"
	    				   },{
	    					   key:"Payup",
	    					   value:"已缴清"  
	    				   }],
	    				   handler:function(key,element){
							   widget.get("grid").refresh(null,function(data){
									 widget.get("grid").setData(gridDataArrange(data));

					        	});
	    				   }
	    			   },{
						//年
						id:"year",
						items:itemsyear,
						tip:"年份",
						handler:function(key,element){
							widget.get("grid").refresh(null,function(data){
								 widget.get("grid").setData(gridDataArrange(data));

							});
						}
					},{
						//月
						   id:"month",
						   items:months,	
						   tip:"月份",
						   handler:function(key,element){
							   widget.get("grid").refresh(null,function(data){
									 widget.get("grid").setData(gridDataArrange(data));
								});
						   }
					}],
                }
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
            	parentNode:".J-Grid",
            	autoRender:false,
            	url:"api/generalfees/query",
				params:function(){
					//把年份和月份拼起来
					var year = widget.get("subnav").getValue("year");
					var month = widget.get("subnav").getValue("month");
					var monthFirstDay= year + "-" +month;
					var lastDayOfMonth = moment(monthFirstDay).daysInMonth();
					var monthLastDay= year + "-" +month + "-" + lastDayOfMonth;
					return {
						"memberSigning.room.building.pkBuilding":widget.get("subnav").getValue("building"),
						"memberSigning.status":"Normal",
						"feeMonth":moment(monthFirstDay,"YYYY-MM-DD").valueOf(),
						"feeMonthEnd":moment(monthLastDay,"YYYY-MM-DD").valueOf(),
						fetchProperties:"pkGeneralFees," +
								"feeMonth,payer," +
								"memberSigning.room.number," +
								"memberSigning.pkMemberSigning," +
								"generalFeesDetails.pkGeneralFeesDetail," +
								"generalFeesDetails.curNumber," +
								"generalFeesDetails.preNumber," +
								"generalFeesDetails.fees," +
								"generalFeesDetails.adjustFees," +
								"generalFeesDetails.payStatus," +
								"generalFeesDetails.payType," +
								"generalFeesDetails.payDate," +
								"generalFeesDetails.feeType.catalog," + 
								"generalFeesDetails.feeType.name",
						orderString :"memberSigning.room.number"
					};
				},
				model:{
					isCheckbox:true,
					columns:[{
						key:"feeMonth",
						name:"年月",
						format:"date",
						formatparams:{
							mode:"YYYY-MM"
						}
					},{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"payer",
						name:"付款人"
					},{
						key:"water",
						name:"水费",
						format:"thousands",
						formatparams:{
							precision:2
						},
						className:"text-right"
					},{
						key:"electricity",
						name:"电费",
						format:"thousands",
						formatparams:{
							precision:2
						},
						className:"text-right"
					},{
						key:"telecom",
						name:"电信",
						format:"thousands",
						formatparams:{
							precision:2
						},
						className:"text-right"
					},{
						key:"carryOver",
						name:"结转",
						format:"thousands",
						formatparams:{
							precision:2
						},
						className:"text-right"
					},{
						key:"total",
						name:"合计",
						format:"thousands",
						formatparams:{
							precision:2
						},
						className:"text-right",
					},{
						key:"status",
						name:"状态",
						format:function(value,row){
							if(value>0){
								return "未缴清";
							}else{
								return "已缴清";
							}
						}
					},{
						key:"operate",
						name : "操作",
						format:function(row,value){
							return "button";
						},
						formatparams:[{
							key:"confirm",
							text:"账单",
							handler:function(index,data,rowEle){
								widget.show([".J-feesDetilsGrid",".J-feesDetilsGrid-top"]).hide(".J-Grid");
								widget.get("subnav").show(["printInBill","return"]).hide(["building","year","month","pay","search","excelImport","chargeStatus","printall"]);
								aw.ajax({
									url:"api/generalfees/queryOrderByFeeTypeNumber",
									data:{
										"pkGeneralFees":data.pkGeneralFees,
										"memberSigning.status":"Normal",
										fetchProperties:"feeMonth,payer," +
												"memberSigning.room.number," +
												"memberSigning.room.telnumber," +
												"generalFeesDetails.pkGeneralFeesDetail," +
												"generalFeesDetails.curNumber," +
												"generalFeesDetails.preNumber," +
												"generalFeesDetails.fees," +
												"generalFeesDetails.adjustFees," +
												"generalFeesDetails.payStatus," +
												"generalFeesDetails.payType," +
												"generalFeesDetails.payDate," +
												"generalFeesDetails.feeType.catalog,"+
												"generalFeesDetails.feeType.name," +
												"generalFeesDetails.feeType.number,"+
				                                "generalFeesDetails.feeType.meterReading,"+
				                                "generalFeesDetails.feeType.valuationUnit,"+
				                                "generalFeesDetails.feeType.price," +
				                                "generalFeesDetails.operator.name" 
									},
									success:function(result){
										var datas=[];
										var map={};
										var feeMonth = result[0].feeMonth;
										var payer = result[0].payer;
										var roomNo = result[0].memberSigning.room.number;
										var roomTelNo = result[0].memberSigning.room.telnumber;
										for(var i=0;i<result[0].generalFeesDetails.length;i++){
											var catalog=result[0].generalFeesDetails[i].feeType.catalog.value;
											if(!map[catalog]){
												map[catalog]=[];
											}
											map[catalog].push(result[0].generalFeesDetails[i]);
											
										}
										for(var j in map){/*遍历对象*/
											var data={
												catalog : j,
											};
											var feeTypes = [];
											for(var z=0;z<map[j].length;z++){/*遍历数组*/
												var realfee=map[j][z].fees+map[j][z].adjustFees;
												if(map[j][z].feeType.name != "电话"){
													var number=map[j][z].curNumber-map[j][z].preNumber;
												}else{
													var number = 0;
												}
												var feeType = {
														feetype : map[j][z],
														realfee : realfee,
														number : number
												}
												feeTypes.push(feeType);
											}
											data.feeTypes = feeTypes;
											datas.push(data);
										}
										
										$(".J-feesDetilsGrid-top").text(" 房间电话："+ roomTelNo);
										widget.get("subnav").setTitle(roomNo+"房间"+moment(feeMonth).format("YYYY")+"年"+moment(feeMonth).format("MM")+"月账单");
										widget.get("feesDetilsGrid").setData(datas);
										//同时为printGrid赋值
										datas = printGridDataArrange(result);
										var member = result[0].memberSigning.members;
										$(".J-printGrid-title").text("亲和源老年公寓"+moment(feeMonth).format("YYYY")+"年"+moment(feeMonth).format("MM")+"月"+"能源电信账单");
										//二级标题
										var array = [];
										array = roomNo.split("-");										
										$(".J-printGrid-top").text(array[0]+"号楼  "+array[1]+"室  " + "付款人:" + payer +" 房间电话:"+ roomTelNo);
										widget.get("printGrid").setData(datas);
									}
								});
							}
						},{
							key:"print",
							text:"打印",
							handler:function(index,data,rowEle){
								widget.show([".J-printGrid",".J-printGrid-top"]).hide(".J-Grid");
								widget.get("subnav").show(["print","return"]).hide(["building","year","month","search","excelImport","chargeStatus","printall"]);
								aw.ajax({
									url:"api/generalfees/queryOrderByFeeTypeNumber",
									data:{
										"pkGeneralFees":data.pkGeneralFees,
										"memberSigning.status":"Normal",
										fetchProperties:"feeMonth,payer," +
												"memberSigning.room.number," +
												"memberSigning.room.telnumber," +
												"generalFeesDetails.pkGeneralFeesDetail," +
												"generalFeesDetails.curNumber," +
												"generalFeesDetails.preNumber," +
												"generalFeesDetails.fees," +
												"generalFeesDetails.adjustFees," +
												"generalFeesDetails.payStatus," +
												"generalFeesDetails.payType," +
												"generalFeesDetails.payDate," +
												"generalFeesDetails.feeType.catalog," +
												"generalFeesDetails.feeType.number,"+
												"generalFeesDetails.feeType.name,"+
				                                "generalFeesDetails.feeType.meterReading,"+
				                                "generalFeesDetails.feeType.valuationUnit,"+
				                                "generalFeesDetails.feeType.price," +
				                                "generalFeesDetails.operator.name" 
				                                
									},
									success:function(result){
										var datas = printGridDataArrange(result);
										var feeMonth = result[0].feeMonth;
										var payer = result[0].payer;
										var roomNo = result[0].memberSigning.room.number;
										var roomTelNo = result[0].memberSigning.room.telnumber;
										var member = result[0].memberSigning.members;
										widget.get("subnav").setTitle("亲和源老年公寓"+moment(feeMonth).format("YYYY")+"年"+moment(feeMonth).format("MM")+"月"+"能源电信账单");
										$(".J-printGrid-title").text("亲和源老年公寓"+moment(feeMonth).format("YYYY")+"年"+moment(feeMonth).format("MM")+"月"+"能源电信账单");
										//二级标题
										var array = [];
										array = roomNo.split("-");
										$(".J-printGrid-top").text(array[0]+"号楼  "+array[1]+"室  " + "付款人:" + payer +" 房间电话:"+ roomTelNo);
										widget.get("printGrid").setData(datas);
									}
								});
							}
						},{
							key:"pay",
							text:"缴费",
							show:function(value,row){
								if(row.status>0){
									return true;
								}else{
									return false;
								}
							},
							handler:function(index,data,rowEle){
								widget.show(".J-payGrid").hide(".J-Grid");
								widget.get("subnav").show(["pay","return"]).hide(["building","year","month","search","excelImport","chargeStatus","printall"]);
								$("#payGridCheckAll").prop("checked",false);
								aw.ajax({
									url:"api/generalfees/queryOrderByFeeTypeNumber",
									data:{
										"pkGeneralFees":data.pkGeneralFees,
										"memberSigning.status":"Normal",
										fetchProperties:"feeMonth,payer," +
												"memberSigning.room.number," +
												"generalFeesDetails.*," +
												"generalFeesDetails.feeType.catalog,"+
												"generalFeesDetails.feeType.name,"+
												"generalFeesDetails.feeType.number,"+
				                                "generalFeesDetails.feeType.meterReading,"+
				                                "generalFeesDetails.feeType.valuationUnit,"+
				                                "generalFeesDetails.feeType.price," +
				                                "generalFeesDetails.operator.name" 
									},
									success:function(result){
										var datas=[];
										var map={};
										var feeMonth = result[0].feeMonth;
										var roomNo = result[0].memberSigning.room.number;
										for(var i=0;i<result[0].generalFeesDetails.length;i++){
											var catalog=result[0].generalFeesDetails[i].feeType.catalog.value;
											if(!map[catalog]){
												map[catalog]=[];
											}
											map[catalog].push(result[0].generalFeesDetails[i]);
											
										}
										for(var j in map){/*遍历对象*/
											var data={
												catalog : j,
											};
											var feeTypes = [];
											for(var z=0;z<map[j].length;z++){/*遍历数组*/
												var realfee=map[j][z].fees+map[j][z].adjustFees;
												var number=map[j][z].curNumber-map[j][z].preNumber;
												var feeType = {
														feetype : map[j][z],
														realfee : realfee,
														number : number,
														roomNo : roomNo
												};
												feeTypes.push(feeType);
											}
											data.feeTypes = feeTypes;
											datas.push(data);
										}
										widget.get("subnav").setTitle(roomNo+"房间"+moment(feeMonth).format("YYYY")+"年"+moment(feeMonth).format("MM")+"月账单");
										widget.get("payGrid").setData(datas);
									}
								});
							}
						}]
					}]
				}
            });
            this.set("grid",grid);
            
            //账单
        	var feesDetilsGrid=new MultiRowGrid({
            	parentNode:".J-feesDetilsGrid",
				autoRender:false,
				model:{
					multiField:"feeTypes",//费用项目
					columns:[{
						key:"catalog",
						name:"费用类别"
					},{
						key:"feeTypes",
						name:"费用项目",
						multiKey : "feetype.feeType.name",
						isMulti:true
					},{
						key:"feeTypes",
						name:"上月数",
						multiKey : "feetype.preNumber",
						isMulti:true,
						format:"thousands",
						formatparams:{
							precision:2
						}
					},{
						key:"feeTypes",
						name:"本月数",
						multiKey : "feetype.curNumber",
						isMulti:true,
						format:"thousands",
						formatparams:{
							precision:2
						}
					},{
						key:"feeTypes",
						name:"使用数量",
						multiKey : "number",
						isMulti:true,
						format:"thousands",
						formatparams:{
							precision:2
						}
					},{
						key:"feeTypes",
						name:"计价单位",
						multiKey : "feetype.feeType.valuationUnit.value",
						isMulti:true
					},{
						key:"feeTypes",
						name:"单价",
						multiKey : "feetype.feeType.price",
						isMulti:true,
						className:"text-right",
						format:"thousands"
					},{
						key:"feeTypes",
						name:"金额",
						multiKey : "feetype.fees",
						isMulti:true,
						className:"text-right",
						format:"thousands",
						formatparams:{
							precision:2
						}
					},{
						key:"feeTypes",
						name:"调整金额",
						multiKey : "feetype.adjustFees",
						isMulti:true,
						className:"text-right",
						format:"thousands",
						formatparams:{
							precision:2
						}
					},{
						key:"feeTypes",
						name:"实际金额",
						multiKey : "realfee",
						isMulti:true,
						className:"text-right",
						format:"thousands",
						formatparams:{
							precision:2
						}
					},{
						key:"feeTypes",
						name:"状态",
						multiKey : "feetype.payStatus.value",
						isMulti:true,
					},{
						key:"feeTypes",
						name:"缴费方式",
						multiKey : "feetype.payType.value",
						isMulti:true,
					},{
						key:"feeTypes",
						name:"缴费日期",
						format:"date",
						multiKey : "feetype.payDate",
						isMulti:true,
					},{
						key:"feeTypes",
						name:"经手人",
						multiKey : "feetype.operator.name",
						isMulti:true,
					}]
				}
        	});
        	this.set("feesDetilsGrid",feesDetilsGrid);
        	
            //支付页
        	var payGrid=new MultiRowGrid({
            	parentNode:".J-payGrid",
				model:{
					multiField:"feeTypes",//费用项目
					columns:[{
						key:"catalog",
						name:"费用类别"
					},{
						key:"feeTypes",
						name:"费用项目",
						multiKey : "feetype.feeType.name",
						isMulti:true
					},{
						key:"feeTypes",
						name:"本月金额",
						multiKey : "feetype.fees",
						isMulti:true,
						className:"text-right",
						format:"thousands",
						formatparams:{
							precision:2
						}
					},{
						key:"feeTypes",
						name:"调整金额",
						multiKey : "feetype.adjustFees",
						isMulti:true,
						className:"text-right",
						format:"thousands",
						formatparams:{
							precision:2
						}
					},{
						key:"feeTypes",
						name:"实际金额",
						multiKey : "realfee",
						isMulti:true,
						className:"text-right",
						format:"thousands",
						formatparams:{
							precision:2
						}
					},{
						 key:"feeTypes",
						 name:"状态",
						 multiKey : "feetype.payStatus.value",
						 isMulti:true
					},{
						key:"feeTypes",
						name:"缴费方式",
						multiKey : "feetype.payType.value",
						isMulti:true
					},{
						key:"feeTypes",
						name:"缴费日期",
						format:"date",
						multiKey : "feetype.payDate",
						isMulti:true
					},{
						key:"feeTypes",
						name:"选择",
						multiKey : "feetype",
						isMulti:true,
						format:function(value,row){
							if(value.payStatus == null || value.payStatus.key=="Paid"){
								return "";
							}else if(value.payStatus.key=="UnPaid"){
								return "<input class='J-payGrid-checkbox'  type='checkbox' data-pkGeneralFeesDetail="+value.pkGeneralFeesDetail+">";
							}
						}
							
					}]
				}
        	});
        	this.set("payGrid",payGrid);
        	
	    	var printGrid=new Grid({
				parentNode:".J-printGrid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					columns:[{
						key:"feeType.number",
						name:"序号",
						className:"text-center"
					},{
						key:"feeType.name",
						name:"费用项目",
						className:"text-center"
					},{
						key:"curNumber",
						name:"本月表数",
						className:"text-center"
					},{
						key:"preNumber",
						name:"上月表数",
						className:"text-center"
					},{
						key:"quantity",
						name:"实用数量",
						className:"text-center"
					},{
						key:"feeType.price",
						name:"单价",
						className:"text-center"
					},{
						key:"feeType.valuationUnit.value",
						name:"计量单位",
						className:"text-center"
					},{
						key:"realfee",
						name:"金额",
						className:"text-right",
						format:"thousands",
						formatparams:{
							precision:2
						},
					},{
						key:"payType.value",
						name:"付款方式",
						className:"text-center"
					},{
						key:"payDate",
						name:"缴费日期",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						},
						className:"text-center"
					}]
				}
			});
	    	
	    	this.set("printGrid",printGrid);
	    	
	    	var importGrid=new MultiRowGrid({
				parentNode:".J-importGrid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					multiField:"generalFeesDetailsTemp",
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号",
						className:"text-center",
					},{
						key:"payer",
						name:"付款人",
						className:"text-center"
					},{
						key:"generalFeesDetailsTemp",
						name:"费用项目",
						className:"text-center",
						multiKey : "feeType.name",
						isMulti:true
					},{
						key:"generalFeesDetailsTemp",
						name:"本月表数",
						className:"text-center",
						multiKey : "curNumber",
						isMulti:true,
						format : function(value,row,subIndex){
							if(row.generalFeesDetailsTemp[subIndex].curNumber == null){
								return "";
							}else if(row.generalFeesDetailsTemp[subIndex].beforeCurNumber != null &&row.generalFeesDetailsTemp[subIndex].beforeCurNumber != row.generalFeesDetailsTemp[subIndex].curNumber){
 								return "从"+"<span style='color:red'>"+row.generalFeesDetailsTemp[subIndex].beforeCurNumber+"</span>"+"到"+"<span style='color:red'>"+row.generalFeesDetailsTemp[subIndex].curNumber+"</span>";
 							}
 							else{
								return row.generalFeesDetailsTemp[subIndex].curNumber;

 							}
 						}
					},{
						key:"generalFeesDetailsTemp",
						name:"上月表数",
						className:"text-center",
						multiKey : "preNumber",
						isMulti:true,
						format : function(value,row,subIndex){
							if(row.generalFeesDetailsTemp[subIndex].preNumber == null){
								return "";
							}else if(row.generalFeesDetailsTemp[subIndex].beforePreNumber != null &&row.generalFeesDetailsTemp[subIndex].beforePreNumber != row.generalFeesDetailsTemp[subIndex].preNumber){
 								return "从"+"<span style='color:red'>"+row.generalFeesDetailsTemp[subIndex].beforePreNumber+"</span>"+"到"+"<span style='color:red'>"+row.generalFeesDetailsTemp[subIndex].preNumber+"</span>";
 							}
 							else{
 								return row.generalFeesDetailsTemp[subIndex].preNumber;
 							}
 						}
					},{
						key:"generalFeesDetailsTemp",
						name:"金额",
						multiKey : "fees",
						isMulti:true,
						className:"text-right",
						format:function(value,row,subIndex){
							if(row.generalFeesDetailsTemp[subIndex].fees == null){
								return "0";
							}else if(row.generalFeesDetailsTemp[subIndex].beforeFees != null && row.generalFeesDetailsTemp[subIndex].beforeFees != row.generalFeesDetailsTemp[subIndex].fees){
 								return "从"+"<span style='color:red'>"+row.generalFeesDetailsTemp[subIndex].beforeFees+"</span>"+"到"+"<span style='color:red'>"+row.generalFeesDetailsTemp[subIndex].fees+"</span>";
 							}else{
 								return row.generalFeesDetailsTemp[subIndex].fees;
 							}
 						}
					},{
						 key:"generalFeesDetailsTemp",
						 name:"缴费状态",
						 className:"text-center",
						 multiKey : "payStatus.value",
						 isMulti:true
					},{
						 key:"generalFeesDetailsTemp",
						 name:"数据状态",
						 className:"text-center",
						 multiKey : "dataType.value",
						 isMulti:true
					}]
				}
			});
	    	
	    	this.set("importGrid",importGrid);
        },
		afterInitComponent:function(params,widget){
			widget.get("subnav").setValue("year",moment().year());
			widget.get("subnav").setValue("month",moment().month()+1);
			widget.get("grid").refresh(null,function(data){
				gridDataArrange(data);
        		widget.get("grid").setData(data);
        	});
			$(".J-payGrid thead tr th:last").append("<input type='checkbox' id='payGridCheckAll' style='margin-left: 10px'/>");
			$("#payGridCheckAll").click(function() {$(".J-payGrid-checkbox").prop("checked", this.checked);});
				  
			$(".J-payGrid-checkbox").click(function() {
				 var $subs = $(".J-payGrid-checkbox");
				 $("#payGridCheckAll").prop("checked" , $subs.length == $subs.filter(":checked").length ? true :false);
			});
		}
	});
	module.exports = generalfees;	
});
