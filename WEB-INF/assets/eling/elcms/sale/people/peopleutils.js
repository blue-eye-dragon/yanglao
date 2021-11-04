define(function(require,exports,module){
	var components={};
	var Verform = require("form-1.0.0");
	var Wizard = require("wizard");
	var BaseDoc=require("basedoc");
	var aw=require("ajaxwrapper");
	var Dialog=require("dialog");
	var enmu = require("enums");
	
	var _utils={
		getData:function(){
			return "pkMembershipContract="+($(".J-contract").attr("data-key") || "")+"&"+
				"pkPersonalCardowner="+($(".J-people").attr("data-key") || "")+"&"+
				$("#baseinfoForm").serialize()+"&"+
				$("#othersinfoForm").serialize();
		},
		setData:function(data,mark){
			for(var i in components){
				if(typeof components[i].setData === "function"){
					components[i].setData(data);
				}
			}
		},
		geneWizard:function(){
			var wizard=new Wizard({
				parentNode:".J-card",
				model:{
					id:"personalCardownerForm",
					items:[{
						id:"step1",
						title:"权益人基本信息"
					},{
						id:"step2",
						title:"权益人其他信息"
					}]
				}
			});
			components.wizard=wizard;
		},
		geneBaseInfo:function(){
			var that = this;
			var verform=new Verform({
				parentNode:"#step1",
				saveaction:function(){
					var data=$("#baseinfoForm").serializeArray();
					var nativePlace = data[18].value;
					if(nativePlace == ""){
						Dialog.alert({ 
							content:"请选择籍贯！"
						});
						return false;
					}
					var birthday = moment(data[13].value).valueOf();	
					var now = moment().valueOf();
					if(birthday > now){ 
						Dialog.alert({ 
							content:"出生年月不能大于当前日期！"
						});
           		 	}else{
					aw.saveOrUpdate("api/personalCardowner/save",that.getData(),function(data){
						$(".J-people").attr("data-key",data.pkPersonalCardowner);
						$(".J-pkPersonalInfo").val(data.personalInfo.pkPersonalInfo);
						$(".J-version").val(data.personalInfo.version);
						components.wizard.next();
						seajs.emit("people_grid_refresh");
					});
					return false;
				  }
				},
				cancelaction:function(){
//					$(".J-edit").addClass("hidden");
//					$(".J-return").removeClass("hidden");
					//(1)隐藏卡片,显示列表
					$(".J-list").removeClass("hidden");
					$(".J-card").addClass("hidden");
					//(2)处理subnav上的按钮的隐藏和显示
					$(".J-return,.J-edit").addClass("hidden");
					$(".J-status,.J-cardStatus,.J-toBeStatus,.J-cardType").removeClass("hidden");
					$(".J-subnav-search-search,.J-time,.J-gotoSign").removeClass("hidden");
					return false;
				},
				model:{
					id:"baseinfoForm",
					saveText:"下一步",
					items:[{
						name:"pkPersonalInfo",
						type:"hidden"
					},{
						name:"fetchProperties",
						type:"hidden",
					    defaultValue:"*,personalInfo.version"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"died",
						type:"hidden",
						defaultValue:"false"
					},{
						name:"name",
						label:"姓名(中)",
						validate:["required"]
					},{
						name:"nameEn",
						label:"姓名(英语)"
					},{
						name:"formerName",
						label:"曾用名"
					},{
						name:"idType",
						label:"证件号类型",
						type:"select",
						url:"api/enum/com.eling.elcms.basedoc.model.PersonalInfo.IdType",
						defaultValue:"IdentityCard",
						validate:["required"]
					},{
						name:"idNumber",
						label:"证件号",
						validate:["required"]
					},{
						name:"relationship",
						label:"与会员关系"
					},{
						name:"sex",
						label:"性别",
						type:"radiolist",
						list:[{
							key:"MALE",
							value:"男"
						},{
							key:"FEMALE",
							value:"女"
						}],
						validate:["required"]
					},{
						name:"maritalStatus",
						label:"婚姻状况",
						type:"radiolist",
						validate:["required"],
						list:BaseDoc.maritalStatus
					},{
						name:"weddingDate",
						label:"婚姻登记日期",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"birthday",
						label:"出生年月",
						type:"date",
						mode:"Y-m-d",
						validate:["required"]
					},{
						name:"birthplace",
						label:"出生地",
						validate:["required"],
					},{
						name:"otherParty",
						label:"政治面貌",
						type:"select",
						options:enmu["com.eling.elcms.basedoc.model.OtherParty"],
						defaultValue:"QZ",
						validate:["required"],
//						list:BaseDoc.otherParty
					},{
						name:"citizenship",
						label:"国籍",
						url:"api/country/query",
						key:"pkCountry",
						value:"name",
						type:"select",
						defaultValue:"48",
						validate:["required"]
					},{
						name:"nationality",
						label:"民族",
						type:"select",
						validate:["required"],
						defaultValue:"Han",
						options:BaseDoc.nationality
					},{
						name:"nativePlace",
						label:"籍贯",
						type:"place",
						validate:["required"],
					},{
						name:"residenceAddress",
						label:"户籍地址",
						validate:["required"],
					},{
						name:"graduateSchool",
						label:"毕业院校"
					},{
						name:"qualifications",
						label:"学历",
						type:"radiolist",
						validate:["required"],
						list:BaseDoc.qualifications
					},{
						name:"degree",
						label:"学位"
					},{
						name:"specialty",
						label:"专业"
					},{
						name:"phone",
						label:"联系电话",
						validate:["required","phone"],
					},{
						name:"mobilePhone",
						label:"移动电话"
					},{
						name:"email",
						label:"电子邮件",
						validate:["email"]
					}]
				}
			});
			components.baseinfoForm=verform;
		},
		geneOthersInfo:function(){
			var that=this;
			var verform=new Verform({
				parentNode:"#step2",
				saveaction:function(){
					aw.saveOrUpdate("api/personalCardowner/save",that.getData(),function(){
						//(1)隐藏列表,显示卡片
						$(".J-list").removeClass("hidden");
						$(".J-card").addClass("hidden");
						//(2)处理subnav上的按钮的隐藏和显示
						$(".J-return,.J-edit").addClass("hidden");
						$(".J-status,.J-cardStatus,.J-toBeStatus,.J-cardType").removeClass("hidden");
						$(".J-subnav-search-search,.J-time,.J-gotoSign").removeClass("hidden");
						that.get("gird").refresh();
						seajs.emit("people_grid_refresh",{
							pkMembershipContract:$(".J-contract").attr("data-key"),
						});
					});
					return false;
				},
				cancelaction:function(){
//					$(".J-edit").addClass("hidden");
//					$(".J-return").removeClass("hidden");
					//(1)隐藏卡片,显示列表
					$(".J-list").removeClass("hidden");
					$(".J-card").addClass("hidden");
					//(2)处理subnav上的按钮的隐藏和显示
					$(".J-return,.J-edit").addClass("hidden");
					$(".J-status,.J-cardStatus,.J-toBeStatus,.J-cardType").removeClass("hidden");
					$(".J-subnav-search-search,.J-time,.J-gotoSign").removeClass("hidden");
					return false;
				},
				model:{
					id:"othersinfoForm",
					items:[{
						name:"workUnit",
						label:"工作单位"
					},/*{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},*/{
						name:"jobTitle",
						label:"担任职务"
					},{
						name:"annualIncome",
						label:"年收入情况",
						type:"radiolist",
						list:BaseDoc.annualIncome
					},{
						name:"professionalTitle",
						label:"技术职称",
						type:"radiolist",
						list:BaseDoc.professionalTitle
					},{
						name:"topJobTitle",
						label:"最高职位级别",
						type:"radiolist",
						list:BaseDoc.jobTitle
					},{
						name:"overseasExperience",
						label:"海外经历",
						type:"select",
						url:"api/country/query",
						key:"pkCountry",
						value:"name",
						multi:true
					},{
						name:"ffl",
						label:"第一外语"
					},{
						name:"fflDof",
						label:"第一外语熟练程度",
						type:"radiolist",
						list:[{
							key:"UNTOUCH",
							value:"未接触过"
						},{
							key:"COMMONLY",
							value:"一般"
						},{
							key:"GOOD",
							value:"良好"
						},{
							key:"SKILLED",
							value:"熟练"
						},{
							key:"MASTER",
							value:"精通"
						}]
					},{
						name:"sfl",
						label:"第二外语"
					},{
						name:"sflDof",
						label:"第二外语熟练程度",
						type:"radiolist",
						list:[{
							key:"UNTOUCH",
							value:"未接触过"
						},{
							key:"COMMONLY",
							value:"一般"
						},{
							key:"GOOD",
							value:"良好"
						},{
							key:"SKILLED",
							value:"熟练"
						},{
							key:"MASTER",
							value:"精通"
						}]
					},{
						name:"computerDof",
						label:"计算机能力",
						type:"radiolist",
						list:[{
							key:"UNTOUCH",
							value:"未接触过"
						},{
							key:"COMMONLY",
							value:"一般"
						},{
							key:"GOOD",
							value:"良好"
						},{
							key:"SKILLED",
							value:"熟练"
						},{
							key:"MASTER",
							value:"精通"
						}]
					},{
						name:"otherIntroduction",
						label:"其他介绍",
						type:"textarea"
					}]
				}
			});
			components.othersinfoForm=verform;
		}
	};
	var PeopleUtils={
		init:function(){
			_utils.geneWizard();
			_utils.geneBaseInfo();
			_utils.geneOthersInfo();
		},
		destroy:function(){
			for(var i in components){
				if(typeof components[i].destroy === "function"){
					components[i].destroy();
				}
			}
		},
		setData:function(data){
			_utils.setData(data);
		},
		setDetail:function(){
			$(".wizard").addClass("hidden");
			$(".step-pane").addClass("active");
			for(var i in components){
				if(typeof components[i].setDisabled === "function"){
					components[i].setDisabled(true);
				}
			}
			//特殊处理
			$(".J-button-area").addClass("hidden");
		},
		setEdit:function(){
			$(".wizard").removeClass("hidden");
			$(".step-pane,.step li").removeClass("active");
			$(".step-pane:first").addClass("active");
			$(".step-pane li:first").addClass("active");
			components.wizard.first();
			components.baseinfoForm.setDisabled(false);
			components.othersinfoForm.setDisabled(false);
		},
		reset:function(){
			components.baseinfoForm.reset();
			components.othersinfoForm.reset();
		}
	};
	
	module.exports=PeopleUtils;
});