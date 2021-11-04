define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Dialog = require("dialog-1.0.0");
    var Form=require("form-2.0.0")
    var Subnav = require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
    var BaseDoc=require("basedoc");
  //多语
	var i18ns = require("i18n");
    var template="<div class='el-TryVisitMember'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-grid'></div>"+
	"<div class='J-form hidden'></div>"+
	"</div>";
    
    var TryVisitMember = ELView.extend({
    	getRegisterForm:function(){
			var registerForm = new Form({
				model:{
					id:"registerForm",
					show:false,
					defaultButton:false,
					items:[{
						name:"idCardNo",
						label:"身份卡号",
						style:{
							label:"width:30%"
						},
						validate:["required"]
					}]
				}
			});
			this.set("registerForm",registerForm);
			
			return registerForm;
		},
		registerSave:function(text,params,widget){
			if ("注册" == text){
				var idCardNo = widget.get("registerForm").getValue("idCardNo");
				if(idCardNo.length>=8){
					idCardNo = idCardNo.trim();
					params.idCardNo = idCardNo;
					Dialog.close();
				}else{
					Dialog.confirm({
						title:text,
						content:"身份卡号应为8位！",
						confirm:function(){
							Dialog.showComponent({
			    				title:text,
			    				confirm:function(){
			    					widget.registerSave(text,params,widget);
			    					return "NotClosed";
			    				},
			    				setStyle:function(){
			    					$(".el-dialog .modal.fade.in").css({
			    						"top":"10%"
			    					});
			    				}
			    			},widget.getRegisterForm());   
			    			$(".J-form-registerForm-text-idCardNo").focus();					
			    			return "NotClosed";
						},
	    				setStyle:function(){
	    					$(".el-dialog .modal.fade.in").css({
	    						"top":"10%"
	    					});
	    				}
					});
				}
			}else{
				params.idCardNo = "";
			}
			aw.ajax({
				url:"api/trylivemember/saveIdCardNo?pkMember="+params.pkMember+"&idCardNo="+params.idCardNo,
				success:function(data){
					widget.get("grid").refresh();
				}
			});
		},
    	register:function(text,params,widget){
    		if ("注册" == text){
    			Dialog.showComponent({
    				title:text,
    				confirm:function(){
    					widget.registerSave(text,params,widget);
    					return "NotClosed";
    				},
    				setStyle:function(){
    					$(".el-dialog .modal.fade.in").css({
    						"top":"10%"
    					});
    				}
    			},widget.getRegisterForm());   
    			$(".J-form-registerForm-text-idCardNo").focus();
    		}else{
    			Dialog.confirm({
					title:text,
					content:"是否确认取消注册身份卡号？",
					confirm:function(){
						widget.registerSave(text,params,widget);					
					},
    				setStyle:function(){
    					$(".el-dialog .modal.fade.in").css({
    						"top":"10%"
    					});
    				}
				});
    		}
    		
    	},
		
    	attrs:{
    		template:template
    	},

    	initComponent:function(params,widget){
    		//初始化subnav
    		var subnav=new Subnav({
    			parentNode:".J-subnav",
    			model:{
    				title:"体验参观"+i18ns.get("sale_ship_owner","会员"),
    				search:function(str) {
    					widget.get("grid").loading();
    					aw.ajax({
    						url:"api/trylivemember/searchMember",
    						data:{
    							s:str,
    							properties:"idCardNo,personalInfo.name,personalInfos.mobilePhone", 
    	    					fetchProperties:"*,card.name,customer.name,personalInfo.*,personalInfo.citizenship.name,personalInfo.nativePlace.id,personalInfo.nativePlace.code,personalInfo.nativePlace.name",
    						},
    						dataType:"json",
    						success:function(data){
    							widget.get("grid").setData(data); 
    						}
    					});
    				},
    				time:{
    					tip:"最新体验日期筛选",
    					defaultTime:"今天",
    					click:function(time){
    						widget.get("grid").refresh();
    					},
    				},
    				buttons:[{
    					id:"return",
    					text:"返回",
    					show:false,
    					handler:function(){
    						widget.show([".J-grid",".J-search",".J-time"]).hide([".J-return",".J-form"]);
    						return false;
    					}
    				}],
    			}
    		});
    		this.set("subnav",subnav);
    		
    		var grid=new Grid({
    			parentNode:".J-grid",
    			url:"api/trylivemember/query",
    			params:function(){
    				var time=widget.get("subnav").getValue("time");
    				return {
    					sourceType:"TryVisit",
    					createDate:time.start,
    					createDateEnd:time.end,
    					fetchProperties:"*,card.name,customer.name,personalInfo.*,personalInfo.citizenship.name,personalInfo.nativePlace.id,personalInfo.nativePlace.code,personalInfo.nativePlace.name",
    				};
    			},
    			model:{	
    				columns:[{
    					key:"personalInfo.name",
    					name:"姓名",
    				},{
    					key:"personalInfo.mobilePhone",
    					name:"手机"
    				},{
    					key:"personalInfo.idType",
    					name:"证件类型" ,
    					format:function(value,row){
    						if(value){
    							return value.value;
    						}else{
    							return "未启用";
    						}
    					}
    				},{
    					key:"personalInfo.idNumber",
    					name:"证件号"
    				},{
    					key:"idCardNo",
    					name:"身份卡号"
    				},{
    					key:"operate",
    					name:"操作",
    					format:"button",
    					formatparams:[{
    						key:"edit",
    						icon:"edit",
    						handler:function(index,data,rowEle){
    							widget.show([".J-return",".J-form"]).hide([".J-grid",".J-search",".J-time"]);
    							widget.get("form").reset();
    							widget.get("form").setData(data);
    							widget.get("form").setValue("customer",data.customer.pkCustomer);
								
								if(data.personalInfo.communistParty==true){
									$("[name='personalInfo.communistParty']").prop("checked",true);
								}
								widget.get("form").setAttribute("card","readonly","readonly");
								widget.get("form").setAttribute("tryLiveSaleReg","readonly","readonly");
								
								trylivememberpk=data.pkMember;
								widget.get("grid").refresh();
								widget.get("form").hide("tryLiveSaleReg");
								widget.get("form").show("trylivecustomer");
								widget.get("form").setAttribute("trylivecustomer","readonly","readonly");
								if(data.customer!=null){
									widget.get("form").setValue("trylivecustomer",data.customer.name);
								}
	   							return false;
    						}	
    					},{
    						key:"register",
    						text:"注册",
    						handler:function(index,data,rowEle){
    							widget.register("注册",data,widget);																
    						}
    					},{
    						key:"cancle",
    						text:"取消注册",
    						handler:function(index,data,rowEle){
    							widget.register("取消注册",data,widget);																
    						}
    					}]
    				}]
    			}
    		});
    		this.set("grid",grid);
    		
    		var form = new Form({
    			parentNode:".J-form",
    			saveaction:function(){
    				aw.saveOrUpdate("api/trylivemember/save",$("#trylivemember").serialize(),function(data){
    					widget.show([".J-grid",".J-search",".J-time"]).hide([".J-return",".J-form"]);
    					widget.get("grid").refresh();    					
    				});
    			},
    			//取消按钮
    			cancelaction:function(){
    				widget.show([".J-grid",".J-search",".J-time"]).hide([".J-return",".J-form"]);
    			},
    			model:{
    				id:"trylivemember",
    				items:[{
    					name:"pkMember",
    					type:"hidden",
    				},{
    					name:"version",
    					defaultValue:"0",
    					type:"hidden"
    				},{
    					name:"sourceType",
    					defaultValue:"TryVisit",
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
    		this.set("form",form);
    	}
    });
    
	module.exports = TryVisitMember;
});
