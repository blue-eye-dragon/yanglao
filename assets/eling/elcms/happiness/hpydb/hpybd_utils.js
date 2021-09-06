define(function(require,exports,module){
	var components={};
	var aw = require("ajaxwrapper");
	var Wizard=require("wizard");
	var Form=require("form-1.0.0");
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog");
	var _utils={
		geneWizard:function(){
			var wizard=new Wizard({
				parentNode:".J-card",
				model:{
					items:[{
						id : "step1",
						title : "基本信息"
					},{
						id : "step2",
						title : "所重视的家庭纪念日"
					}]
				}
			});
			components.wizard=wizard;
		},
		geneHpyBase:function(){
			var baseinfoForm = new Form({
				parentNode : "#step1",
				saveaction : function() {
					var pkMember = $(".J-member").attr("data-key");
					aw.saveOrUpdate("api/member/" + pkMember + "/happiness/datas/update", $("#baseinfo").serialize(), function(data){
						components.wizard.next();
					});
				},
       		    cancelaction:function()  {
 				   $(".J-list,.J-building,.J-search").removeClass("hidden");
 				   $(".J-card,.J-return").addClass("hidden");
 					return false;
 			  },
				model : {
					id : "baseinfo",
					items : [{
						name : "LITERATUREANDART",
						label : "文艺类爱好",
						type : "select",
						multi:true,
						url:"api/interest/query?interesttype=LITERATUREANDART",
						key:"pkInterest",
						value:"name",
						params:{
							fetchProperties:"name,pkInterest"
						}
					},{
						name : "SPORT",
						label : "体育类爱好",
						type : "select",
						multi:true,
						url:"api/interest/query?interesttype=SPORT",
						key:"pkInterest",
						value:"name",
						params:{
							fetchProperties:"name,pkInterest"
						}
					},{
						name : "OTHER",
						label : "其他爱好",
						type : "select",
						multi:true,
						url:"api/interest/query?interesttype=OTHER",
						key:"pkInterest",
						value:"name",
						params:{
							fetchProperties:"name,pkInterest"
						}
					},{
						name : "followHoliday",
						label : "重视的节日",
						type : "select",
						multi:true,
						url:"api/hoilday/query",
						key:"pkHoilday",
						value:"name",
						params:{
							fetchProperties:"name,pkHoilday"
						}
					},{
						name : "amusement",
						label : "休闲娱乐",
						type : "select",
						multi:true,
						url:"api/amusement/query",
						key:"pkAmusementType",
						value:"name",
						params:{
							fetchProperties:"name,pkAmusementType"
						}
					}]
				}
			});
			components.baseinfo=baseinfoForm;
		},
		geneHpyFamilyDay:function(){
			var familyDayGrid=new Grid({
				autoRender:false,
				parentNode:"#step2",
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								$("#step2").children().eq(0).addClass("hidden");
								$("#step2").children().eq(1).removeClass("hidden");
								components.familyDayForm.reset();
							}
						}]
						
					},
					columns:[{
						key:"name",
						name:"节日名称"
					},{
						key:"attentionDegree",
						name:"重视程度",
						format:function(value,row){
							if(value=="UNIMPORTANT"){
								return "不重视";
							}else if(value=="COMMONLY"){
								return "一般";
							}else{
								return "重视";
							}
						}
					},{
						key:"congratulations",
						name:"庆祝方式",
						format:function(value,row){
							var ret="";
							var congratulations=value || [];
							for(var i=0;i<congratulations.length;i++){
								ret+=congratulations[i].name+"，";
							}
							return ret.substring(0, ret.length-1);
						}
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								$("#step2").children().eq(0).addClass("hidden");
								$("#step2").children().eq(1).removeClass("hidden");
								components.familyDayForm.setData(data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.ajax({
									url:"api/familyanniversary/"+data.pkFamilyAnniversary+"/delete",
									dataType:"json",
									success:function(data){
										components.familyDayGrid.refresh({
											fetchProperties:"*,congratulations.name"
										});
									}
								});
							}
						}]
					}]
				}
			});
			
			var familyDayForm=new Form({
				parentNode : "#step2",
				saveaction : function() {
					var pkMember = $(".J-member").attr("data-key");
					if($("div.J-name .select2-chosen").text()!="请选择" && $(".J-otherFamilyDayName").val()){
						 Dialog.alert({
							 content:"不能同时填写基本纪念日和其他纪念日"
						 });
						 return;
					}
					aw.saveOrUpdate("api/familyanniversary/save", "member="+pkMember+"&"+$("#familyDay").serialize() , function(data){
						components.familyDayGrid.refresh({
							fetchProperties:"*,congratulations.name"
						});
						$("#step2").children().eq(0).removeClass("hidden");
						$("#step2").children().eq(1).addClass("hidden");
					});
				},
				cancelaction:function(){
					$("#step2").children().eq(0).removeClass("hidden");
					$("#step2").children().eq(1).addClass("hidden");
				},
				model : {
					id : "familyDay",
					items : [{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"pkFamilyAnniversary",
						type:"hidden"
					},{
						name:"name",
						label:"基本纪念日",
						type:"select",
						options:[{
							key:"结婚纪念日",
							value:"结婚纪念日"
						},{
							key:"自己的生日",
							value:"自己的生日"
						},{
							key:"配偶的生日",
							value:"配偶的生日"
						},{
							key:"父亲节",
							value:"父亲节"
						},{
							key:"母亲节",
							value:"母亲节"
						},{
							key:"子女的生日",
							value:"子女的生日"
						},{
							key:"孙辈的生日",
							value:"孙辈的生日"
						},{
							key:"兄弟姐妹的生日",
							value:"兄弟姐妹的生日"
						}]
					},{
						name:"otherFamilyDayName",
						label:"其他纪念日"
					},{
						name:"date",
						label:"日期",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"attentionDegree",
						label:"重视程度",
						type:"radiolist",
						list:[{
							key:"IMPORTANT",
							value:"重视"
						},{
							key:"COMMONLY",
							value:"一般"
						},{
							key:"UNIMPORTANT",
							value:"不重视"
						}]
					},{
						name:"congratulations",
						label:"庆祝方式",
						type:"select",
						multi:true,
						url:"api/congratulations",
						key:"pkCongratulation",
						value:"name",
						params:{
							fetchProperties:"name,pkCongratulation"
						}
					}]
				}
			});
			
			components.familyDayForm=familyDayForm;
			components.familyDayGrid=familyDayGrid;
			
			$("#step2").children().eq(1).addClass("hidden");
		}
	};
	
	var HpyUtils={
		init:function(){
			_utils.geneWizard();
			_utils.geneHpyBase();
			_utils.geneHpyFamilyDay();
		},
		destroy:function(){
			for(var i in components){
				if(typeof components[i].destroy==="function"){
					components[i].destroy();
				}
			}
		},
		setData:function(data){
			components.wizard.first();
			$("#step2").children().eq(0).removeClass("hidden");
			$("#step2").children().eq(1).addClass("hidden");
			components.baseinfo.setData(data);
			components.familyDayGrid.set("url","api/familyanniversary/queryByMemberPK/"+$(".J-member").attr("data-key"));
			components.familyDayGrid.refresh({
				fetchProperties:"*,congratulations.name"
			},this.hideEDbutton);
		},
		showDetail:function(){
			$(".wizard").addClass("hidden");
			$(".step-pane").addClass("active");
			for(var i in components){
				if(typeof components[i].setDisabled === "function"){
					components[i].setDisabled(true);
				}
			}
			//特殊处理
			$(".J-button-area").addClass("hidden");
			$(".el-grid .box-header").addClass("hidden");
		},
		hideEDbutton:function(data){
			$("#step2  .J-edit,.J-delete").addClass("hidden");
		},
		showEdit:function(){
//			$(".wizard").removeClass("hidden");
//			$(".step-pane,.step li").removeClass("active");
//			$(".step-pane:first").addClass("active");
////			$(".step-pane li:first").addClass("active");
			
			components.wizard.reset();
			for(var i in components){
				if(typeof components[i].setDisabled === "function"){
					components[i].setDisabled(false);
				}
			}
			//特殊处理
			$(".J-button-area").removeClass("hidden");
			$(".el-grid .box-header").removeClass("hidden");
		}
	};
	
	module.exports=HpyUtils;
});