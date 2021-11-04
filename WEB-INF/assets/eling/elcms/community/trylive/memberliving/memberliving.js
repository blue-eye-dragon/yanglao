define(function(require, exports, module) {
    var ELView=require("elview");
    var aw = require("ajaxwrapper");
    var template=require("./memberliving.tpl");
    var Form=require("form-2.0.0")
    var Subnav = require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
    var Tab=require("tab");
    var Dialog=require("dialog-1.0.0");
    var BaseDoc=require("basedoc");
	//多语
	var i18ns = require("i18n");
    //tempcard={},当点击待录入或者会员时缓存体验会员卡号
    var tempcard={};
    var trylivememberpk={};

    var MemberLiving = ELView.extend({
        attrs:{
        	template:template
        },
		events:{
	    	"click .J-personalInfo":function(e){
	    		this.show(".J-return,.J-grid1").hide(".J-verform,.J-grid,.J-search,.J-tryLiveProduct,.J-tryLiveBatch");
	    		var grid1=this.get("grid1");
	    		var form=this.get("verform");
	    		aw.ajax({
					url:"api/trylivemember/querybycard",
					data:{
						pkMemberShipCard:$(e.target).attr("data-key"),
					    fetchProperties:"*,card.name,customer.name,personalInfo.name,personalInfo.citizenship.name,personalInfo.*,personalInfo.otherParty.key,personalInfo.nativePlace.code,personalInfo.nativePlace.name"
					},
					dataType:"json",
					success:function(data){
						//tempcard={},当点击待录入或者会员时缓存体验会员卡号
						tempcard = $(e.target).attr("data-key"),
						grid1.setData(data);
						form.load("tryLiveSaleReg");
					}
				});
	    	},
	    	"change .J-form-trylivemember-select-tryLiveSaleReg":function(e){
	    		var form=this.get("verform");
				var pk=form.getValue("tryLiveSaleReg");
				if(pk){
					aw.ajax({
						url : "api/trylivesalereg/query",
						type : "POST",
						data : {
							pkTryLiveSaleReg:pk,
							fetchProperties:"*,customer.*"
						},
						success:function(data){	
							form.setValue("personalInfo.name",data[0].customer.name);
							form.setValue("personalInfo.mobilePhone",data[0].customer.phoneNumber);
							form.setValue("customer",data[0].customer.pkCustomer);
						}
					});
				}
			}
	    },
        initComponent:function(params,widget){
        	//初始化subnav
            var subnav=new Subnav({
            	parentNode:".J-subnav",
                model:{
                   title:"体验"+i18ns.get("sale_ship_owner","会员")+"档案",
//                   search:function(str) {
//	            	   widget.get("grid").loading();
//						aw.ajax({
//							url:"api/trylivemember/search",
//							data:{
//								s:str,
//								properties:"card.name,personalInfo.name", 
//							    fetchProperties:"*,card.name,personalInfos.name"
//							},
//							dataType:"json",
//							success:function(data){
//								widget.get("grid").setData(data); 
//								widget.show(".J-grid").hide(".J-tab,.J-return");
//							}
//						});
//					},
                   buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.show(".J-grid,.J-search,.J-tryLiveProduct,.J-tryLiveBatch").hide(".J-tab,.J-return,.J-grid1");
							return false;
						}
					}],
					buttonGroup:[{
						id:"tryLiveProduct",
						showAll:true,
						showAllFirst:true,
						tip:"体验产品",
						key:"pkTryLiveProduct",
						value:"name",
						url:"api/tryliveproducts/query",
						handler:function(key,element){
							widget.get("subnav").load({
								id:"tryLiveBatch",
								callback:function(data){						
									widget.get("grid").refresh();
								}
							});
						}
					},{
						id:"tryLiveBatch",
						showAll:true,
						showAllFirst:true,
						tip:"体验批次",
						key:"pkTryLiveBatch",
						value:"batchcode",
						url:"api/trylivebatch/query",
						params:function(){
							return {
								tryLiveProduct:widget.get("subnav").getValue("tryLiveProduct")
							};
						},
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}],
//					time:{
//						click:function(time){
//							widget.get("grid").refresh();
//						}
//					}
					
                }
            });
            this.set("subnav",subnav);
            
            var grid=new Grid({
            	parentNode:".J-grid",
				url:"api/trylivemember/queryOfCard",
				params:function(){
					return {
						tryLiveProduct:widget.get("subnav").getValue("tryLiveProduct"),
						tryLiveBatch:widget.get("subnav").getValue("tryLiveBatch"),
//						createDate:widget.get("subnav").getValue("time").start,
//						createDateEnd:widget.get("subnav").getValue("time").end,
						pkMemberShipCard:tempcard,
						fetchProperties:"*,card.name,personalInfos.name"
					};
				},
				model:{					
					columns:[{
						col:4,
						key:"card.name",
						name:"体验"+i18ns.get("sale_ship_owner","会员")+i18ns.get("sale_card_name","卡号")
					},{
						col:8,
						key:"personalInfos",
						name:i18ns.get("sale_ship_owner","会员"),
						format:function(value,row){
							if(value && value.length!=0){
								var text="";
								for(var i=0;i<value.length;i++){
									text+=value[i].name+"，";
								}
								return "<a href='javascript:void(0);' style='color:red;' class='J-personalInfo' data-key='"+row.card.pkMemberShipCard+"' data-value='"+row.card.name+"'>"+text.substring(0,text.length-1)+"</a>";
							}else{
								return "<a href='javascript:void(0);' style='color:rgb(141, 128, 128);' class='J-personalInfo' data-key='"+row.card.pkMemberShipCard+"' data-value='"+row.card.name+"'>待录入</a>";
							}
						}
					}]
				}
			});
			this.set("grid",grid);
			
		     var grid1=new Grid({
					parentNode:".J-grid1",
					url:"api/trylivemember/querybycard",
					fetchProperties:"*,card.name,customer.name,personalInfo.communistParty,personalInfo.name,personalInfo.citizenship.name,personalInfo.*,personalInfo.nativePlace.id,personalInfo.nativePlace.code,personalInfo.nativePlace.name",
					params:function(){
						return {
							pkMemberShipCard:tempcard
						};
					},
					model:{
						head:{
							buttons:[{
								id:"add",
								icon:"icon-plus",
								handler:function(){
									widget.get("verform").reset();
									widget.get("grid2").setData([]);
									var data={
											nationality:{key:"Han",value:"汉族"},
											qualifications:{key:"RegularCollegeCourse",value:"本科"},
											idType:{key:"IdentityCard",value:"身份证"},
											citizenship:"48"
									};	
									widget.get("verform").setValue("personalInfo.qualifications",data.qualifications);
									widget.get("verform").setValue("personalInfo.nationality",data.nationality);
									widget.get("verform").setValue("personalInfo.citizenship",data.citizenship);
									widget.get("verform").setValue("personalInfo.idType",data.idType);
									widget.get("verform").setValue("card",tempcard);
									widget.get("verform").removeAttribute("tryLiveSaleReg","readonly","readonly");
									widget.get("verform").setAttribute("card","readonly","readonly");
									widget.get("verform").show("tryLiveSaleReg");
									widget.get("verform").hide("trylivecustomer");
									widget.show(".J-tab").hide(".J-grid1");
								}
							}]
						},
						columns:[{
							col:4,
							key:"card.name",
							name:"体验"+i18ns.get("sale_ship_owner","会员")+i18ns.get("sale_card_name","卡号")
						},{
							col:3,
							key:"personalInfo.name",
							name:"姓名"
						},{
							col:3,
							key:"createDate",
							name:"创建日期",
							format:"date"
						},{
							col:2,
							key:"operate",
							name:"操作", 	
							format:"button",
							formatparams:[{
								key:"edit",
								icon:"edit",
								handler:function(index,data,rowEle){
									widget.get("verform").reset();
									widget.get("verform").setData(data);
									widget.get("verform").setValue("customer",data.customer.pkCustomer);
									if(data.personalInfo.communistParty==true){
										$("[name='personalInfo.communistParty']").prop("checked",true);
									}
									widget.get("verform").setAttribute("card","readonly","readonly");
									widget.get("verform").setAttribute("tryLiveSaleReg","readonly","readonly");
									
									widget.get("verform1").setData(data);
									
									trylivememberpk=data.pkTryLiveMember;
									widget.get("grid2").refresh();
									widget.get("verform").hide("tryLiveSaleReg");
									widget.get("verform").show("trylivecustomer");
									widget.get("verform").setAttribute("trylivecustomer","readonly","readonly");
									if(data.customer!=null){
										widget.get("verform").setValue("trylivecustomer",data.customer.name);
									}
									//var trylivemember = widget.get("verform").getValue("tryLiveSaleReg");
									widget.show(".J-tab,.J-return").hide(".J-grid1");
									widget.hide("#verform1 .el-form").show("#verform1 .el-grid");
									return false;
								}
							},{
								key:"delete",
								icon:"remove",
								handler:function(index,data,rowEle){
									aw.del("api/trylivemember/" + data.pkTryLiveMember + "/delete",function(){
										widget.get("grid1").refresh();
										widget.get("grid").refresh();
										return false;
									});
								}
							}]
						}]
					}
				});
				this.set("grid1",grid1);
				
				var tab = new Tab({
					parentNode:".J-tab",
					autoRender:true,
					model:{
						items:[{
							id:"verform",
							title:"体验"+i18ns.get("sale_ship_owner","会员")+"基本信息"
						},{
							id:"verform1",
							title:"体验"+i18ns.get("sale_ship_owner","会员")+"关注事项"
						}]
					}
				});
				this.set("tab",tab);
				

			
			var verform = new Form({
            	parentNode:"#verform",
            	saveaction:function(){
            		aw.saveOrUpdate("api/trylivemember/save",$("#trylivemember").serialize(),function(data){
            			widget.show(".J-grid1").hide(".J-tab,.J-search");
            			widget.get("grid").refresh();
            			widget.get("grid1").refresh();
			   			
					});
            	},
 				//取消按钮
  				cancelaction:function(){
  					widget.get("grid2").refresh();
  					widget.show(".J-grid1").hide(".J-tab,.J-grid");
  				},
  				model:{
					id:"trylivemember",
					items:[{
						name:"pkTryLiveMember",
						type:"hidden",
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"personalInfo.version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"personalInfo.died",
						type:"hidden",
						defaultValue:false
					},{
						name:"card",
						key : "pkMemberShipCard",
						label : "体验"+i18ns.get("sale_ship_owner","会员")+i18ns.get("sale_card_name","卡号"),
						value : "name",
						type : "select",
						url : "api/card/query",		
						validate : [ "required" ]
					},{
						name:"tryLiveSaleReg",
						label:"体验"+i18ns.get("sale_ship_owner","会员"),
						key:"pkTryLiveSaleReg",
						url :"api/trylivesalereg/query",
						lazy:true,
						params:function(){
							return {
								pk:tempcard,
								fetchProperties:"pkTryLiveSaleReg,customer.name"
							};
						},
						value:"customer.name",	
						type:"select"
					},{
						name:"customer",
						type:"hidden",
					},{
						name:"personalInfo.pkPersonalInfo",
						type:"hidden"
					},{
						name:"trylivecustomer",
						label:"体验"+i18ns.get("sale_ship_owner","会员")
					},{
						name:"personalInfo.name",
						label:"姓名(中)",
						validate:["required"]
					},{
						name:"personalInfo.sex",
						label:"性别",
						type:"radiolist",
						list:[{
							key:"MALE",
							value:"男"
						},{
							key:"FEMALE",
							value:"女"
						}]
					},{
						name:"personalInfo.birthday",
						label:"出生年月",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"personalInfo.nameEn",
						label:"姓名(英语)"
					},{
						name:"personalInfo.formerName",
						label:"曾用名"
					},{
						name:"personalInfo.birthplace",
						label:"出生地"
					},{
						name:"personalInfo.nativePlace",
						label:"籍贯",
						type:"place"
					},{
						name:"personalInfo.citizenship",
						label:"国籍",
						url:"api/country/query",
						key:"pkCountry",
						value:"name",
						type:"select",
						validate:["required"]
					},{
						name:"personalInfo.residenceAddress",
						label:"户籍地址 "
					},{
						name:"personalInfo.otherParty",
						label:"政治面貌",
						type:"radiolist",
						list:[{
							key:true,
							value:"共产党",
							type:"checkbox",
							name:"personalInfo.communistParty"
						},{
							key:"GMDGMWYH",
							value:"中国国民党革命委员会"
						},{
							key:"MZTM",
							value:"中国民主同盟"
						},{
							key:"MZJGH",
							value:"中国民主建国会"
						},{
							key:"MZCJH",
							value:"中国民主促进会"
						},{
							key:"NGMZD",
							value:"中国农工民主党"
						},{
							key:"ZGD",
							value:"中国致公党"
						},{
							key:"JSXS",
							value:"九三学社"
						},{
							key:"TWMZZZTM",
							value:"台湾民主自治同盟"
						},{
							key:"OTHER",
							value:"其他"
						}]
					},{
						name:"personalInfo.nationality",
						label:"民族",
						type:"select",
						options:BaseDoc.nationality
					},{
						name:"personalInfo.maritalStatus",
						label:"婚姻状况",
						type:"radiolist",
						list:BaseDoc.maritalStatus
					},{
						name:"personalInfo.weddingDate",
						label:"婚姻登记日期",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"personalInfo.idType",
						label:"证件类型",
						type:"select",
						url:"api/enum/com.eling.elcms.basedoc.model.PersonalInfo.IdType",
					},{
						name:"personalInfo.idNumber",
						label:"证件号码"
					},{
						name:"personalInfo.phone",
						label:"电话"
					},{
						name:"personalInfo.mobilePhone",
						label:"移动电话"
					},{
						name:"personalInfo.email",
						label:"电子邮件",
						validate:["email"]
					},{
						name:"personalInfo.address",
						label:"通信地址"
					},{
						name:"personalInfo.annualIncome",
						label:"年收入情况",
						type:"radiolist",
						list:BaseDoc.annualIncome
					},{
						name:"personalInfo.qualifications",
						label:"学历",
						type:"select",
						options:BaseDoc.qualifications
					}]
				}
             });
    		 this.set("verform",verform);
    		 
    			var verform1 = new Form({
    				parentNode:"#verform1",
    			   	saveaction:function(){
    			   			var trylivemember = widget.get("verform").getValue("pkTryLiveMember");
    			   			aw.saveOrUpdate("api/trylivecaution/save","trylivemember.pkTryLiveMember="+trylivemember+"&"+$("#trylivecaution").serialize(),function(data){			 
        						
        						widget.get("grid2").refresh();
        						//widget.show(".J-grid1").hide(".J-tab,.J-return");
        						widget.hide("#verform1 .el-form").show("#verform1 .el-grid");
        					});
    			   		
    					
    					
     				},
    				//取消按钮
      				cancelaction:function(){
      					//widget.show(".J-grid").hide(".J-tab,.J-grid");
      					widget.hide("#verform1 .el-form").show("#verform1 .el-grid");
      				},
    				model:{
    					id:"trylivecaution",
    					items:[{
    						name:"pkTryLiveCaution",
    						type:"hidden",
    					},{
    						name:"version",
    						defaultValue:"0",
    						type:"hidden"
    					},{
    						name:"category",
    						label:"事项分类",						
    						type:"select",
    						options:[{
    							key:"Health",
    							value:"健康"
    						},{
    							key:"Eating",
    							value:"饮食"
    						},{
    							key:"Cleaning",
    							value:"保洁"
    						},{
    							key:"Hoppy",
    							value:"喜好"
    						},{
    							key:"Other",
    							value:"其他"
    						}],
    					    validate:["required"]
    					},{
    						name:"attentionContent",
    						label:"注意事项描述",
    						type:"textarea",
    						validate:["required"]	
    					},{
    						name:"level",
    						label:"重要程度",						
    						type:"radiolist",
    						list:[{
    							key:"Common",
    							value:"一般"
    						},{
    							key:"Important",
    							value:"重要"
    						}],
    					    validate:["required"]
    					},{
    						name:"description",
    						label:"备注",
    						type:"textarea"
    					}]
    				}
    		
    			});
        		 this.set("verform1",verform1);
        		 
			     var grid2=new Grid({
						parentNode:"#verform1",
						url:"api/trylivecaution/query",				
						params:function(){
							return {
								pkTryLiveMember:trylivememberpk
							};
						},	
						model:{
							head:{
								buttons:[{
									id:"add",
									icon:"icon-plus",
									handler:function(){
										var trylivemember = widget.get("verform").getValue("pkTryLiveMember");
				    			   		if(trylivemember==""||trylivemember==null){
				    			   			Dialog.alert({
				    							content:"请先保存"+i18ns.get("sale_ship_owner","会员")+"信息，再填写"+i18ns.get("sale_ship_owner","会员")+"注意事项"
				    			    		});
				    			   			return;
				    			   		}
										widget.get("verform1").reset();
										
										//widget.get("verform2").setValue("card",tempcard);
										//widget.get("verform2").setAttribute("card","readonly","readonly");
										widget.hide("#verform1 .el-grid").show("#verform1 .el-form");
									}
								}]
							},
							columns:[{
								key:"category.value",
								name:"事项分类"									
							},{
								key:"attentionContent",
								name:"注意事项描述"									
							},{
								key:"level.value",
								name:"重要程度"
							},{
								key:"description",
								name:"备注"
							},{
								key:"operate",
								name:"操作", 	
								format:"button",
								formatparams:[{
									key:"edit",
									icon:"edit",
									handler:function(index,data,rowEle){
										widget.get("verform1").reset();
										widget.get("verform1").setData(data);
										widget.hide("#verform1 .el-grid").show("#verform1 .el-form");
										return false;
									}
								},{
									key:"delete",
									icon:"remove",
									handler:function(index,data,rowEle){
										aw.del("api/trylivecaution/" + data.pkTryLiveCaution + "/delete",function(){
											widget.get("grid2").refresh();
				 	 					});
									}
								}]
							}]
						}
					});
					this.set("grid2",grid2);
					this.$("#verform1 .el-form").addClass("hidden");
    	
        },
        afterInitComponent:function(params,widget){        
			widget.get("grid").refresh(params);			
        }
    });
    module.exports = MemberLiving;
});