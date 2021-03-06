define(function(require,exports,module){
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	
	var HealthQuestionnaire=BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{
					title:"健康调查问卷",
					buttonGroup:[{
						id:"building",
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}],
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.list2Card(false);
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url:"api/member/query",
				params:function(){
					return {
						"memberSigning.room.building" : widget.get("subnav").getValue("building"),
						fetchProperties : "pkMember,personalInfo.name,memberSigning.room.number"
					};
				},
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号"
					},{
						key:"personalInfo.name",
						name:"姓名"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEL){
								var pk=data.pkMember;
								aw.ajax({
									url:"api/questionnaireanswer/query",
									data:{
										member:data.pkMember
									},
									success:function(data){
										if(data && data.length!=0){
											data=data[0];
											for(var i in data){
												if(data[i] && data[i].split && data[i].split(",").length>1){
													//证明是用，隔开的值
													var datas=data[i].split(",");
													data[i]=datas;
												}
											}
											widget.edit("edit",data);
										}else{
											widget.get("card").reset();
											widget.get("card").setValue("member",pk);
										}
										widget.list2Card(true);
									}
								});
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				saveaction:function(){
					var params="";
					var data=$("#healthquestionnaire").serializeArray();
					var results={};
					for(var i=0;i<data.length;i++){
						var name=data[i].name;
						var value=data[i].value;
						if(results[name]){
							results[name]+=value+",";
						}else{
							results[name]="";
							results[name]+=value+",";
						}
					}
					for(var j in results){
						params+=j+"="+(results[j].substring(0,results[j].length-1))+"&";
					}
					params=params.substring(0,params.length-1);
					widget.save("api/questionnaireanswer/save",params);
				},
				model:{
					id:"healthquestionnaire",
					items:[{
						title:"健康(含既往史)状况",
						children:[{
							name:"pkQuestionnaireAnswer",
							type:"hidden"
						},{
							name:"member",
							value:"pkMember",
							type:"hidden"
						},{
							name:"answer01",
							label:"1.您目前或曾经是否患有以下心脑血管系统疾病？",
							type:"checklist",
							list:[{key:"a",value:"高血压"},{key:"b",value:"脑血栓"},{key:"c",value:"冠心病"},{key:"d",value:"肺心病"},
							      {key:"e",value:"先心病"},{key:"f",value:"高血压性心脏病"},{key:"g",value:"其他"}]
						},{
							name:"answer02",
							label:"2. 您目前或曾经是否患有以下消化系统疾病？",
							type:"checklist",
							list:[{key:"a",value:"慢性胃炎"},{key:"b",value:"胃溃疡"},{key:"c",value:"慢性肠炎"},{key:"d",value:"粘液血便"},
							      {key:"e",value:"结肠息肉"},{key:"f",value:"习惯性便秘"},{key:"g",value:"肝炎"},{key:"h",value:"脂肪肝"},
							      {key:"i",value:"其他"}]
						},{
							name:"answer03",
							label:"3.您目前或曾经是否患有以下呼吸系统疾病？",
							type:"checklist",
							list:[{key:"a",value:"慢性支气管炎"},{key:"b",value:"肺气肿"},{key:"c",value:"肺结核"},{key:"d",value:"哮喘"},{key:"e",value:"反复呼吸道感染"}]
						},{
							name:"answer04",
							label:"4.您目前或曾经是否患有以下内分泌疾病？",
							type:"checklist",
							list:[{key:"a",value:"Ⅰ型糖尿病"},{key:"b",value:"Ⅱ型糖尿病"}]
						},{
							name:"answer05",
							label:"5.如果您目前或曾经患有以下妇科疾病？",
							type:"checklist",
							list:[{key:"a",value:"宫颈糜烂"},{key:"b",value:"乳腺疾病"},{key:"c",value:"其他"}]
						},{
							name:"answer06",
							label:"6.如果您目前或曾经患有以下男性疾病？",
							type:"checklist",
							list:[{key:"a",value:"前列腺炎"},{key:"b",value:"前列腺增生"},{key:"c",value:"其他"}]
						},{
							name:"answer07",
							label:"7.您目前或曾经是否患有以下过敏性疾病或出现过以下症状？",
							type:"checklist",
							list:[{key:"a",value:"过敏性皮炎(接触性)"},{key:"b",value:"过敏性鼻炎"},{key:"c",value:"过敏性哮喘"},{key:"d",value:"过敏性紫癜"},
							      {key:"e",value:"过敏性休克"},{key:"f",value:"药物过敏"},{key:"g",value:"食物过敏"},{key:"h",value:"其他"}]
						},{
							name:"answer08",
							type:"radiolist",
							label:"8.是否属过敏体质或对某些特殊物质（如食物、花粉等）易发生过敏情况？",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer09",
							type:"radiolist",
							label:"9.您在过去的3个月内，有没有体重明显下降的情况发生？",
							list:[{key:"a",value:"没有"},{key:"b",value:"1~3公斤"},{key:"c",value:"大于3公斤"}]
						},{
							name:"answer10",
							type:"radiolist",
							label:"10.您目前是否能独立生活？",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer11",
							type:"radiolist",
							label:"11.您目前的日常活动能力情况怎样？",
							list:[{key:"a",value:"卧床或者依靠轮椅"},{key:"b",value:"可下床但是不能外出活动"},{key:"c",value:"可外出活动"}]
						},{
							name:"answer12",
							label:"12.您最近自我感觉营养状况怎样？",
							type:"radiolist",
							list:[{key:"a",value:"营养不良"},{key:"b",value:"不能确定"},{key:"c",value:"没有问题"}]
						},{
							name:"answer13",
							type:"radiolist",
							label:"13.您与同龄人相比，自我感觉健康状况怎样？",
							list:[{key:"a",value:"没别人好"},{key:"b",value:"不知道"},{key:"c",value:"基本一样"},{key:"d",value:"比别人更好"}]
						},{
							name:"answer14",
							type:"radiolist",
							label:"14.您目前的神经或精神状况怎样？",
							list:[{key:"a",value:"严重抑郁或者痴呆"},{key:"b",value:"轻度抑郁或者痴呆"},{key:"c",value:"基本正常"}]
						},{
							name:"answer15",
							type:"radiolist",
							label:"15.您的关节、韧带、肌肉等是否有损伤或疼痛？",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer16",
							type:"radiolist",
							label:"16.您的脊柱、骨骼是否有损伤或疼痛？",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer17",
							type:"radiolist",
							label:"17.您目前是否存在有头痛或偏头痛的问题？",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer18",
							type:"radiolist",
							label:"18.您在过去6-9个月内，是否曾接受过手术治疗？",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer19",
							type:"radiolist",
							label:"19.您的体内是否有心脏起搏器等金属类物品？",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						}]
					},{
						title:"二、家族遗传状况",
						children:[{
							name:"answer20",
							type:"checklist",
							label:"20.您的直系家族成员中（父母、兄弟姐妹及子女）是否有人曾患有如下相关疾病？",
							list:[{key:"a",value:"高血压"},{key:"b",value:"冠心病"},{key:"c",value:"脑中风"},{key:"d",value:"糖尿病"},{key:"e",value:"恶性肿瘤"},
							      {key:"f",value:"偏头痛"},{key:"g",value:"抑郁症"},{key:"h",value:"慢性阻塞性肺疾病"},{key:"i",value:"无"}]
						},{
							name:"answer21",
							type:"checklist",
							label:"21.您的旁系家族成员中【（外）祖父母、叔舅、姑姨、侄子（女）、外甥（女）】是否有人曾患有如下相关疾病，请在相应的选项前“□”处划勾，可多选：",
							list:[{key:"a",value:"高血压"},{key:"b",value:"冠心病"},{key:"c",value:"脑中风"},{key:"d",value:"糖尿病"},{key:"e",value:"恶性肿瘤"},
							      {key:"f",value:"偏头痛"},{key:"g",value:"抑郁症"},{key:"h",value:"慢性阻塞性肺疾病"},{key:"i",value:"无"}]
						},{
							name:"answer22",
							type:"radiolist",
							label:"22.您的父亲或母亲是否有骨质疏松或骨折史？",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						}]
					},{
						title:"三、日常饮食状况",
						children:[{
							name:"answer23",
							label:"23.您1天平均用几餐？",
							type:"radiolist",
							list:[{key:"a",value:"1餐"},{key:"b",value:"2餐"},{key:"c",value:"3餐"},{key:"d",value:"3餐以上"}]
						},{
							name:"answer24",
							label:"24.在下列的选项中，符合您日常饮食习惯的有几项？",
							type:"checklist",
							list:[{key:"a",value:"每天至少喝1杯牛奶或1杯酸奶，或者进食1份奶酪"},{key:"b",value:"每周至少吃2次大豆或者豆制品、禽蛋类食品"},{key:"c",value:"每天吃肉、鱼或禽类食品"}]
						},{
							name:"answer25",
							label:"25.您是否每餐都吃蔬菜或者水果？",
							type:"radiolist",
							list:[{key:"a",value:"少于2餐/日"},{key:"b",value:"每餐都吃"}]
						},{
							name:"answer26",
							label:"26.您现在每天喝的饮料种类以下列的那一种为主？",
							type:"checklist",
							list:[{key:"a",value:"白开水"},{key:"b",value:"茶"},{key:"c",value:"果汁、碳酸饮料"},{key:"d",value:"其他"}]
						},{
							name:"answer27",
							label:"27.您每天喝多少饮料（包括水、果汁、茶、牛奶等，每杯饮料约为200ml左右）",
							type:"radiolist",
							list:[{key:"a",value:"少于3杯"},{key:"b",value:"3^5杯"},{key:"c",value:"5杯以上"}]
						},{
	
							name:"answer28",
							label:"28.您是否能自己独立进食？",
							type:"radiolist",
							list:[{key:"a",value:"需要别人辅助喂食"},{key:"b",value:"有些不便"},{key:"c",value:"完全能够自己完成"}]
						},{
							name:"answer29",
							label:"29.您在过去的3个月内，有没有饮食量减少的情况发生？",
							type:"radiolist",
							list:[{key:"a",value:"没有"},{key:"b",value:"轻度减少"},{key:"c",value:"严重减少"}]
						},{
							name:"answer30",
							label:"30.您是否经常食用高脂食品（如肥肉、蛋黄、猪脑、蟹黄等高胆固醇类食物）？",
							type:"radiolist",
							list:[{key:"a",value:"从不"},{key:"b",value:"偶尔"},{key:"c",value:"经常"}]
						},{
							name:"answer31",
							label:"31.您是否经常食用富含膳食纤维的食物吗（如粗杂粮、蔬菜类及新鲜瓜果）？",
							type:"radiolist",
							list:[{key:"a",value:"从不"},{key:"b",value:"偶尔"},{key:"c",value:"经常"}]
						},{
							name:"answer32",
							label:"32.您平时喜欢下列的那些食物类型？（可多选）",
							type:"checklist",
							list:[{key:"a",value:"高热量的甜食（如糕点、饼干、冰淇淋等）"},{key:"b",value:"烟熏、油炸类食品（如烤肉串、炸鸡腿、烤鸭、熏肉）"},
							      {key:"c",value:"比较烫的食物（如热烫饭菜、热烫饮品、汤羹类食品）"},{key:"d",value:"比较硬的食物（如粗杂粮加工的干粮、干豆、硬果、干果等坚硬食品）"},
							      {key:"e",value:"比较咸的食物（如榨菜/泡菜/咸鱼/腊肉等）"},{key:"f",value:"口味咸淡适中的食物"},{key:"g",value:"质地软硬适中的食物"}]
						},{
							name:"answer33",
							label:"33.您是否饮酒？",
							type:"radiolist",
							list:[{key:"a",value:"从不"},{key:"b",value:"偶尔"},{key:"c",value:"经常"}]
						},{
							name:"answer34",
							label:"34.每天正常的晚餐后，您是否会常常加餐或进食夜宵？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer35",
							label:"35.您目前的食欲状况怎样？",
							type:"radiolist",
							list:[{key:"a",value:"良好"},{key:"b",value:"一般"},{key:"c",value:"明显增加"},{key:"d",value:"明显减少"}]
						},{
							name:"answer36",
							label:"36.您是否有明确的食物禁忌？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer37",
							label:"37.您目前是否服用保健品？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						}]
					},{
						title:"四、日常生活状况",
						children:[{
							name:"answer38",
							label:"38.您现在吸烟吗?",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"戒烟半年以上"},{key:"c",value:"否"}]
						},{
							name:"answer39",
							label:"39.和您一起工作的同事或一起生活的家人中是否有人吸烟？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer40",
							label:"40.您平均每天吸多少只香烟？",
							type:"radiolist",
							list:[{key:"a",value:"5支以下"},{key:"b",value:"5支以上"},{key:"c",value:"从不吸烟"}]
						},{
							name:"answer41",
							label:"41.您平时的生活是否经常接触阳光？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer42",
							label:"42.您平时是否喜欢户外活动？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer43",
							label:"43.您的日常生活是否有缺少运动的情况？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer44",
							label:"44.您最常用的减压方式是那些？",
							type:"checklist",
							list:[{key:"a",value:"运动"},{key:"b",value:"睡觉"},{key:"c",value:"聊天"},{key:"d",value:"上网"},{key:"e",value:"其他"}]
						},{
							name:"answer45",
							label:"45.您平时作息是否有规律？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer46",
							label:"46.您每天的睡眠时间通常是多少？",
							type:"radiolist",
							list:[{key:"a",value:"1^3小时"},{key:"b",value:"3^6小时"},{key:"c",value:"6^9小时"},{key:"d",value:"9小时以上"}]
						},{
							name:"answer47",
							label:"47.您的日常生活是否有压力过大的情况？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						}]
					},{
						title:"五、体力运动状况",
						children:[{
							name:"answer48",
							label:"48.您通常选择什么项目进行锻炼？ ",
							type:"checklist",
							list:[{key:"a",value:"球类"},{key:"b",value:"游泳"},{key:"c",value:"舞蹈"},{key:"d",value:"跑步"},{key:"e",value:"散步"},
							      {key:"f",value:"拳操类"},{key:"g",value:"器械"},{key:"h",value:"跳绳"},{key:"i",value:"其他"}]
						},{
							name:"answer49",
							label:"49.您平均每周进行主动锻炼的频率：",
							type:"radiolist",
							list:[{key:"a",value:"5～7次/周"},{key:"b",value:"3～4次/周"},{key:"c",value:"1～2次/周"},{key:"d",value:"偶尔（每周少于1次）"}]
						},{
							name:"answer50",
							label:"50.您平均每次进行运动锻炼，持续的时间是多少分钟？",
							type:"radiolist",
							list:[{key:"a",value:">60分钟/次"},{key:"b",value:"41～60分钟/次"},{key:"c",value:"21～40分钟/次"},{key:"d",value:"≤20分钟/次"}]
						},{
							name:"answer51",
							label:"51.您每次运动时或运动后的感觉是下列那一种？",
							type:"radiolist",
							list:[{key:"a",value:"轻松"},{key:"b",value:"较累"},{key:"c",value:"非常累"},{key:"d",value:"其他"}]
						},{
							name:"answer52",
							label:"52.是否曾有健康护理专家（如医生、理疗师等）建议您不要参加运动？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						}]
					},{
						title:"六、心理（精神）状况",
						children:[{
							name:"answer53",
							label:"53.您目前是否经常出现情绪不稳定的情况？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						},{
							name:"answer54",
							label:"54.在过去的一年里，您是否出现过以下情绪不稳定的症状？",
							type:"checklist",
							list:[{key:"a",value:"情绪低落"},{key:"b",value:"紧张"},{key:"c",value:"烦燥"},
							      {key:"d",value:"失眠"},{key:"e",value:"自我评价下降"},{key:"f",value:"日常兴趣显著减退甚至丧失"}]
						},{
							name:"answer55",
							label:"55.您认为您的行为具有以下行为特征吗？",
							type:"checklist",
							list:[{key:"a",value:"争强好胜，对自已寄予极大的希望"},{key:"b",value:"以事业上的成功与否，作为评价人生价值的标准"},
							      {key:"c",value:"工作日程排的满满的，紧紧张张，不知道放松自己"},{key:"d",value:"都没有"}]
						},{
							name:"answer56",
							label:"56.您的性格是否偏于内向？",
							type:"radiolist",
							list:[{key:"a",value:"是"},{key:"b",value:"否"}]
						}]
					}]
				}
			};
		}
	});
	
	module.exports=HealthQuestionnaire;
});