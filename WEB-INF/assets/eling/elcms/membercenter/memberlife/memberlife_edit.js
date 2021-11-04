define(function(require,exports,module){
	var Wizard = require("wizard");
	var Verform = require("form-1.0.0");
	var components={};
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog");
	var aw=require("ajaxwrapper");
	
	var _utils={
		geneWizard:function(){
			var wizard=new Wizard({
				parentNode:".J-card",
				model:{
					items:[{
						id:"step1",
						title:"基本信息"
					},{
						id:"step5",
						title:"其它信息"
					},{
						id:"step4",
						title:"报刊订阅"
					},{
						id:"step3",
						title:"牛奶订购"
					},{
						id:"step2",
						title:"饮食习惯"
					}]
				}
			});
			components.wizard=wizard;
		},
		geneBaseInfo:function(){
			var form=new Verform({
				saveaction:function(){
					aw.saveOrUpdate("api/lifedata/add","member="+$(".J-member").attr("data-key")+"&"
							+$("#baseinfo").serialize()+"&"+$("#hobbyForm").serialize(),function(data){
						components.wizard.next();
						$(".J-pkLifeData").val(data.pkLifeData);
					});
				},
				parentNode:"#step1",
				model:{
					id:"baseinfo",
					items:[{
						name:"pkLifeData",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"regular",
						label:"作息规律性",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}]
					},{
						name:"getUp",
						label:"起床时间",
						format:function(){
							var ret="";
							ret+="<select name='hour' style='display:inline-block;width:20%;' class='J-hour form-control'>";
							ret+="<option value=''>请选择</option>";
							for(var i=5;i<10;i++){
								ret+="<option value='"+i+"'>"+i+"</option>";
							}
							ret+="</select>";
							ret+="时";
							ret+="<select name='min' style='display:inline-block;width:20%;' class='J-min form-control'>";
							ret+="<option value='00'>00</option>";
							for(var j=10;j<70;j=j+10){
								ret+="<option value='"+j+"'>"+j+"</option>";
							}
							ret+="</select>";
							ret+="分";
							return ret;
						}
					},{
						name:"lunchBreak",
						label:"午休时间",
						format:function(){
							var ret="";
							ret+="<select name='hour' style='display:inline-block;width:20%;' class='J-hour form-control'>";
							ret+="<option value=''>请选择</option>";
							for(var i=11;i<15;i++){
								ret+="<option value='"+i+"'>"+i+"</option>";
							}
							ret+="</select>";
							ret+="时";
							ret+="<select name='min' style='display:inline-block;width:20%;' class='J-min form-control'>";
							ret+="<option value='00'>00</option>";
							for(var j=10;j<70;j=j+10){
								ret+="<option value='"+j+"'>"+j+"</option>";
							}
							ret+="</select>";
							ret+="分";
							return ret;
						}
					},{
						name:"lunchBreaklength",
						label:"午休时间长度(小时)",
						type:"radiolist",
						list:[{
							key:"0.5",
							value:"0.5"
						},{
							key:"1",
							value:"1"
						},{
							key:"1.5",
							value:"1.5"
						},{
							key:"2",
							value:"2"
						}]
					},{
						name:"sleepClock",
						label:"睡觉时间",
						format:function(){
							var ret="";
							ret+="<select name='hour' style='display:inline-block;width:20%;' class='J-hour form-control'>";
							ret+="<option value=''>请选择</option>";
							for(var i=20;i<24;i++){
								ret+="<option value='"+i+"'>"+i+"</option>";
							}
							ret+="</select>";
							ret+="时";
							ret+="<select name='min' style='display:inline-block;width:20%;' class='J-min form-control'>";
							ret+="<option value='00'>00</option>";
							for(var j=10;j<70;j=j+10){
								ret+="<option value='"+j+"'>"+j+"</option>";
							}
							ret+="</select>";
							ret+="分";
							return ret;
						}
					},{
						name:"sleepDuration",
						label:"每日平均睡眠时间",
						type:"radiolist",
						list:[{
							key:"ONETOTHREE",
							value:"1-3小时"
						},{
							key:"THREETOFIVE",
							value:"3-5小时"
						},{
							key:"FIVETOSIX",
							value:"5-6小时"
						},{
							key:"SIXTONINE",
							value:"6-9小时"
						},{
							key:"MORETHANNINE",
							value:"9小时以上"
						}]
					}]
				}
			});
			components.baseinfoForm=form;
		},
		geneDiet:function(){
			function getPreferFoodParams(label,key){
				return {
					name:key,
					label:label,
					type:"radiolist",
					list:[{
						key:"FAVOURITE",
						value:"非常"
					},{
						key:"RIGHTNESS",
						value:"一般"
					},{
						key:"DISRELISH",
						value:"不喜欢"
					}]
				};
			}
			function getPreferFoodData(){
				var ret="";
				ret+="member="+$(".J-member").attr("data-key")+"&";
				ret+=$("#baseinfo").serialize()+"&";
				ret+=$("#hobbyForm").serialize();
				return ret;
			}
			var form=new Verform({
				parentNode:"#step2",
				saveaction:function(){
					if(!$(".J-pkLifeData").val()){
						Dialog.alert({
							title:"提示",
							content:"请先输入生活基本信息"
						});
						return false;
					}
					aw.saveOrUpdate("api/lifedata/saveDietHabits",getPreferFoodData(),function(){
//						components.wizard.next();
						$(".J-list").removeClass("hidden");
						$(".J-card,.J-return").addClass("hidden");
					});
				},
				model:{
					id:"hobbyForm",
					items:[{
						name:"dinningFrequency",
						label:"社区餐厅选择频率",
						type:"radiolist",
						list:[{
							key:"UNTOUCH",
							value:"不涉及"
						},{
							key:"ALITTLE",
							value:"很少"
						},{
							key:"RIGHTNESS",
							value:"适中"
						},{
							key:"OFTEN",
							value:"经常"
						},{
							key:"GREATMANY",
							value:"很多"
						}]
					},{
						name:"appetite",
						label:"食量",
						type:"radiolist",
						list:[{
							key:"ALITTLE",
							value:"很少"
						},{
							key:"RIGHTNESS",
							value:"适中"
						},{
							key:"GREATMANY",
							value:"很多"
						}]
					},{
						name:"memTaste",
						label:"味道喜好",
						type:"checklist",
//						key:"memTaste",
						list:[{
							key:"SOUR",
							value:"酸"
						},{
							key:"SWEET",
							value:"甜"
						},{
							key:"PUNGENT",
							value:"辣"
						},{
							key:"NUMB",
							value:"麻"
						},{
							key:"SALT",
							value:"咸"
						},{
							key:"TASTELESS",
							value:"淡"
						},{
							key:"RIGHTNESS",
							value:"适中"
						}]
					},{
						name:"loveFoods",
						label:"食物偏好",
						validate:["comma_split_5"]
					},{
						name:"tatooFoods",
						label:"食物禁忌",
						validate:["comma_split_5"]
					},{
						name:"smoke",
						label:"是否吸烟",
						type:"radiolist",
						list:[{
							key:true,
							value:"是"
						},{
							key:false,
							value:"否"
						}]
					},getPreferFoodParams("奶制品","MILK")
						,getPreferFoodParams("豆制品","BEAN")
						,getPreferFoodParams("茶类","TEA")
						,getPreferFoodParams("酒类","LIQUOR")
						,getPreferFoodParams("面食类","FLOUR")
						,getPreferFoodParams("糕点类","COOKIE")
						,getPreferFoodParams("粗粮类","ROUGHAGE")
						,getPreferFoodParams("蔬菜类","VEGETABLE")
						,getPreferFoodParams("水果类","FRUIT")
						,getPreferFoodParams("海鲜类","SEAFOOD")
						,getPreferFoodParams("禽肉类","POULTRY")
						,getPreferFoodParams("鱼肉类","FISH")
						,getPreferFoodParams("蛋类","EGG")
						,getPreferFoodParams("坚果类","NUT")
						,getPreferFoodParams("腌制类","PICKLE")
						,getPreferFoodParams("油炸类","FRY")
					]
				}
			});
			components.perferfoodForm=form;
		},
		geneMilkInfo:function(){
			var form=new Verform({
				parentNode:"#step3",
				saveaction:function(){
					aw.saveOrUpdate("api/milk/add","member="+$(".J-member").attr("data-key")+"&"+$("#milkform").serialize(),function(){
						$("#step3").children().eq(0).addClass("hidden");
						$("#step3").children().eq(1).removeClass("hidden");
						components.milkGrid.refresh();
					});
				},
				cancelaction:function(){
					$("#step3").children().eq(0).addClass("hidden");
					$("#step3").children().eq(1).removeClass("hidden");
				},
				model:{
					id:"milkform",
					items:[{
						name:"pkMilk",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"volume",
						label:"容量（ml）",
						validate:["required"]
					},{
						name:"type",
						label:"类别",
						type:"radiolist",
						list:[{
							key:"无糖",
							value:"无糖"
						},{
							key:"脱脂",
							value:"脱脂"
						},{
							key:"高钙",
							value:"高钙"
						},{
							key:"酸奶",
							value:"酸奶"
						}],
						validate:["required"]
					},{
						name:"shape",
						label:"形状",
						type:"radiolist",
						list:[{
							key:"瓶",
							value:"瓶"
						},{
							key:"袋",
							value:"袋"
						},{
							key:"杯",
							value:"杯"
						}],
						validate:["required"]
					},{
						name:"number",
						label:"数量",
						validate:["required"]
					},{
						name:"startTime",
						label:"订购开始日期",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"endTime",
						label:"订购结束日期",
						type:"date",
						mode:"Y-m-d"
					}]
				}
			});
			
			var grid=new Grid({
				parentNode:"#step3",
				autoRender:false,
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								$("#step3").children().eq(1).addClass("hidden");
								$("#step3").children().eq(0).removeClass("hidden");
								components.milkForm.reset();
							}
						}]
					},
					columns:[{
						key:"volume",
						name:"容量"
					},{
						key:"type",
						name:"类别"
					},{
						key:"shape",
						name:"形状"
					},{
						key:"number",
						name:"数量"
					},{
						key:"startTime",
						name:"订购开始日期",
						format:"date"
					},{
						key:"endTime",
						name:"订购结束日期",
						format:"date"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								$("#step3").children().eq(1).addClass("hidden");
								$("#step3").children().eq(0).removeClass("hidden");
								components.milkForm.setData(data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/milk/"+data.pkMilk+"/delete",function(){
									components.milkGrid.refresh();
								});
							}
						}]
					}]
				}
			});
			components.milkForm=form;
			components.milkGrid=grid;
			$("#step3").children().eq(0).addClass("hidden");
		},
		geneNewspaperInfo:function(){
			var form=new Verform({
				parentNode:"#step4",
				saveaction:function(){
					aw.saveOrUpdate("api/newspaper/add","member="+$(".J-member").attr("data-key")+"&"+$("#newspaperform").serialize(),function(){
						$("#step4").children().eq(0).addClass("hidden");
						$("#step4").children().eq(1).removeClass("hidden");
						components.newspaperGrid.refresh();
					});
				},
				cancelaction:function(){
					$("#step4").children().eq(0).addClass("hidden");
					$("#step4").children().eq(1).removeClass("hidden");
				},
				model:{
					id:"newspaperform",
					items:[{
						name:"pkNewspaper",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"name",
						label:"报刊名称",
						validate:["required"]
					},{
						name:"periodType",
						label:"周期类型",
						type:"radiolist",
						list:[{
							key:"天",
							value:"天"
						},{
							key:"周",
							value:"周"
						},{
							key:"月",
							value:"月"
						},{
							key:"季",
							value:"季"
						}]
					},{
						name:"contentType",
						label:"内容类型"
					},{
						name:"startTime",
						label:"订阅开始日期",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"endTime",
						label:"订阅结束日期",
						type:"date",
						mode:"Y-m-d"
					}]
				}
			});
			var grid=new Grid({
				parentNode:"#step4",
				autoRender:false,
				model:{
					head:{
						buttons:[{
							id:"add",
							icon:"icon-plus",
							handler:function(){
								$("#step4").children().eq(1).addClass("hidden");
								$("#step4").children().eq(0).removeClass("hidden");
								components.newspaperForm.reset();
							}
						}]
					},
					columns:[{
						key:"name",
						name:"报刊名称"
					},{
						key:"periodType",
						name:"周期类型"
					},{
						key:"contentType",
						name:"内容类型"
					},{
						key:"startTime",
						name:"订阅开始日期",
						format:"date"
					},{
						key:"endTime",
						name:"订阅结束日期",
						format:"date"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								$("#step4").children().eq(1).addClass("hidden");
								$("#step4").children().eq(0).removeClass("hidden");
								components.newspaperForm.setData(data);
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/newspaper/"+data.pkNewspaper+"/delete",function(){
									components.newspaperGrid.refresh();
								});
							}
						}]
					}]
				}
			});
			components.newspaperForm=form;
			components.newspaperGrid=grid;
			$("#step4").children().eq(0).addClass("hidden");
		},
		geneOtherInfo:function(){
			var form=new Verform({
				parentNode:"#step5",
				saveaction:function(){
					aw.saveOrUpdate("api/lifedata/saveothers","member="+$(".J-member").attr("data-key")+"&"+$("#otherform").serialize(),function(){
						components.wizard.next();
					});
				},
				model:{
					id:"otherform",
					items:[{
						name:"memTravelTools",
//						key:"memTravelTool",
						label:"日常出行方式",
						type:"checklist",
						list:[{
							key:"REGULARBUS",
							value:"园区班车"
						},{
							key:"SUBWAYANDBUS",
							value:"公共交通"
						},{
							key:"TAXIS",
							value:"出租车"
						},{
							key:"CAR",
							value:"自驾车 "
						}]
					},{
						name:"memPreferColors",
						label:"颜色偏好",
//						key:"memPreferColor",
						type:"checklist",
						list:[{
							key:"RED",
							value:"红"
						},{
							key:"ORANGE",
							value:"橙"
						},{
							key:"YELLOW",
							value:"黄"
						},{
							key:"GREEN",
							value:"绿 "
						},{
							key:"BLUEORGREEN",
							value:"青 "
						},{
							key:"BLUE",
							value:"蓝  "
						},{
							key:"PURPLE",
							value:"紫 "
						},{
							key:"BLACK",
							value:"黑"
						},{
							key:"WHITE",
							value:"白"
						}]
					},{
						name:"memMoneyManages",
						label:"理财方式偏好",
//						key:"memMoneyManage",
						type:"checklist",
						list:[{
							key:"REALESTATE",
							value:"房产投资"
						},{
							key:"BANK",
							value:"银行储蓄"
						},{
							key:"SHARE",
							value:"股票"
						},{
							key:"MANAGEMONEYMATTER",
							value:"理财产品 "
						},{
							key:"INSURANCE",
							value:"保险 "
						},{
							key:"OTHER",
							value:"其他 "
						}]
					},{
						name:"memFeeSources",
						label:"服务费来源",
						type:"checklist",
//						key:"memFeeSource",
						list:[{
							key:"SAVINGS",
							value:"个人储蓄"
						},{
							key:"PENSION",
							value:"退休金"
						},{
							key:"SALEHOME",
							value:"售房"
						},{
							key:"CHILDREN",
							value:"子女 "
						},{
							key:"OTHER",
							value:"其他 "
						}]
					}]
				}
			});
			components.otherinfoForm=form;
		}
	};
	
	var MemberEdit={
		init:function(){
			//(1)生成wizard
			_utils.geneWizard();
			//(2)生成饮食界面
			_utils.geneDiet();
			//(3)生成基本信息编辑界面
			_utils.geneBaseInfo();
			//(4)  生成牛奶界面
			_utils.geneMilkInfo();
			//(5)  生成报刊界面
			_utils.geneNewspaperInfo();
			//(6) 生成其他信息界面
			_utils.geneOtherInfo();
		},
		showEdit:function(params){
			components.wizard.first();
			components.baseinfoForm.reset();
			components.perferfoodForm.reset();
			components.otherinfoForm.reset();
			$(".wizard").removeClass("hidden");
			$(".step-pane,.step li").removeClass("active");
			$(".step-pane:first").addClass("active");
			$(".step-pane li:first").addClass("active");
			for(var i in components){
				if(typeof components[i].setDisabled === "function"){
					components[i].setDisabled(false);
				}
			}
			//特殊处理
			$(".J-button-area").removeClass("hidden");
			$(".el-grid .box-header").removeClass("hidden");
			aw.ajax({
				url:"api/lifedata/queryByMemberPK/"+$(".J-member").attr("data-key"),
				data:{
					fetchProperties:"lifedata.pkLifeData," +
							"lifedata.regular," +
							"lifedata.getUp," +
							"lifedata.lunchBreak," +
							"lifedata.lunchBreaklength," +
							"lifedata.sleepClock," +
							"lifedata.sleepDuration," +
							"lifedata.dinningFrequency," +
							"lifedata.appetite," +
							"lifedata.tabooFoods.foodName," +
							"lifedata.smoke," +
							"lifedata.member.pkMember," +
							"preAndTabooFood.pkPreferFood,"+
							"preAndTabooFood.memFoodDegree,"+
							"preAndTabooFood.foodName," +
							"preAndTabooFood.member.pkMember," +
							"preTaste.pkPreferTaste," +
							"preTaste.memTaste," +
							"preTaste.member.pkMember," +
							"others.memTravelTools.memTravelTool," +
							"others.memTravelTools.pkTravelTool," +
							"others.memPreferColors.memPreferColor," +	
							"others.memPreferColors.pkPreferColor," +
							"others.memMoneyManages.memMoneyManage," +
							"others.memMoneyManages.pkMoneyManage," +
							"others.memFeeSources.memFeeSource," +
							"others.memFeeSources.pkFeeSource," +
							"others.memTaste.memTaste," +
							"others.memTaste,pkPreferTaste," +
							"others.memFood.foodName," +
							"others.memFood.memFoodDegree," +
							"others.memFood.pkPreferFood," +
							"preferFood.MILK," +
							"preferFood.BEAN," +
							"preferFood.TEA," +
							"preferFood.LIQUOR," +
							"preferFood.FLOUR," +
							"preferFood.COOKIE," +
							"preferFood.ROUGHAGE," +
							"preferFood.VEGETABLE," +
							"preferFood.FRUIT," +
							"preferFood.SEAFOOD," +
							"preferFood.POULTRY," +
							"preferFood.FISH," +
							"preferFood.EGG," +
							"preferFood.NUT," +
							"preferFood.PICKLE," +
							"preferFood.FRY"
				},
				dateType:"json",
				success:function(result){
					//处理后台返回的数据
					var lifeData=result.lifedata || {};
					var preferFoods=result.preferFood || [];
					for(var i in preferFoods){
						var key=i;
						var value=preferFoods[i];
						lifeData[key]=value;
					}
					//处理三个时间
					var getUp=lifeData.getUp;
					if(getUp){
						var temp=getUp.split(":");
						$(".J-hour").eq(0).val(temp[0]);
						$(".J-min").eq(0).val(temp[1]);
					}
					var lunchBreak=lifeData.lunchBreak;
					if(lunchBreak){
						var temp=lunchBreak.split(":");
						$(".J-hour").eq(1).val(temp[0]);
						$(".J-min").eq(1).val(temp[1]);
					}
					var sleepClock=lifeData.sleepClock;
					if(sleepClock){
						var temp=sleepClock.split(":");
						$(".J-hour").eq(2).val(temp[0]);
						$(".J-min").eq(2).val(temp[1]);
					}
					//处理饮食偏好和饮食禁忌
					var loveFoods="";
					var tatooFoods="";
					var preAndTabooFood=result.preAndTabooFood || [];
					for(var j=0;j<preAndTabooFood.length;j++){
						if(preAndTabooFood[j].memFoodDegree=="FAVOURITE"){
							loveFoods+=preAndTabooFood[j].foodName+"，";
						}else{
							tatooFoods+=preAndTabooFood[j].foodName+"，";
						}
					}
					lifeData.loveFoods=loveFoods.slice(0, loveFoods.length-1);
					lifeData.tatooFoods=tatooFoods.slice(0, tatooFoods.length-1);
					lifeData.memTaste=result.preTaste || {};
					components.baseinfoForm.setData(lifeData);
					//处理味道喜好数据
					var items5=[];
					var map5={};
					for(var i = 0;i<result.others.memTaste.length;i++){
						map5[result.others.memTaste[i].memTaste]=[];
						map5[result.others.memTaste[i].memTaste].push(result.others.memTaste[i].memTaste);
					}
					for (var key in map5) {  
							var data={};
							data.key=key;
							items5.push(data);
						}
					lifeData.memTaste=items5;
					components.perferfoodForm.setData(lifeData);
					
					//处理日常出行方式数据
					var items=[];
					var map={};
					for(var i = 0;i<result.others.memTravelTools.length;i++){
						map[result.others.memTravelTools[i].memTravelTool]=[];
						map[result.others.memTravelTools[i].memTravelTool].push(result.others.memTravelTools[i].memTravelTool);
					}
					for (var key in map) {  
							var data={};
							data.key=key;
							items.push(data);
						}
					//处理颜色偏好数据
					var items2=[];
					var map2={};
					for(var i = 0;i<result.others.memPreferColors.length;i++){
						map2[result.others.memPreferColors[i].memPreferColor]=[];
						map2[result.others.memPreferColors[i].memPreferColor].push(result.others.memPreferColors[i].memPreferColor);
					}
					for (var key in map2) {  
							var data={};
							data.key=key;
							items2.push(data);
						}
					//处理理财方式偏好数据
					var items3=[];
					var map3={};
					for(var i = 0;i<result.others.memMoneyManages.length;i++){
						map3[result.others.memMoneyManages[i].memMoneyManage]=[];
						map3[result.others.memMoneyManages[i].memMoneyManage].push(result.others.memMoneyManages[i].memMoneyManage);
					}
					for (var key in map3) { 
							var data={};
							data.key=key;
							items3.push(data);
						}
					//处理服务费来源数据
					var items4=[];
					var map4={};
					for(var i = 0;i<result.others.memFeeSources.length;i++){
						map4[result.others.memFeeSources[i].memFeeSource]=[];
						map4[result.others.memFeeSources[i].memFeeSource].push(result.others.memFeeSources[i].memFeeSource);
					}
					for (var key in map4) {  
							var data={};
							data.key=key;
							items4.push(data);
						}

					result.others.memTravelTools=items;
					result.others.memPreferColors=items2;
					result.others.memMoneyManages=items3;
					result.others.memFeeSources=items4;
					components.otherinfoForm.setData(result.others);
				}
			});
			components.milkGrid.set("url","api/milk/queryByMemberPK/"+$(".J-member").attr("data-key"));
			if(params == "details"){
				components.milkGrid.refresh(null,this.hideEDbutton);
			}else{
				components.milkGrid.refresh();
			}
			components.newspaperGrid.set("url","api/newspaper/queryByMemberPK/"+$(".J-member").attr("data-key"));
			if(params == "details"){
				components.newspaperGrid.refresh(null,this.hideEDbutton);
			}else{
				components.newspaperGrid.refresh();
			}
			$("#step3").children().eq(0).addClass("hidden");
			$("#step4").children().eq(0).addClass("hidden");
			
			$("#step3").children().eq(1).removeClass("hidden");
			$("#step4").children().eq(1).removeClass("hidden");
		},
		hideEDbutton:function(data){
			$("#step3  .J-edit,.J-delete").addClass("hidden");
			$("#step4  .J-edit,.J-delete").addClass("hidden");
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
		destroy:function(){
			for(var i in components){
				if(typeof components[i].destroy ==="function"){
					components[i].destroy();
				}
			}
		}
	};
	
	module.exports=MemberEdit;
});