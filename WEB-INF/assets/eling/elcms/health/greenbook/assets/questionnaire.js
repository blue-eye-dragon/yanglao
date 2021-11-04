define(function(require,exports,module){
	var aw=require("ajaxwrapper");
	
	var Questionnaire={
		getData:function(){
			var data = [{
				type:"1﹑健康(含既往史)状况",
				questions:[{
					id:"answer01",
					question:"（1）您目前或曾经是否患有以下心脑血管系统疾病？",
					answers:["高血压","脑血栓","冠心病","肺心病","先心病","高血压性心脏病","其他"]
				},{
					id:"answer02",
					question:"（2）您目前或曾经是否患有以下消化系统疾病？",
					answers:["慢性胃炎","胃溃疡","慢性肠炎","粘液血便","结肠息肉","习惯性便秘","肝炎","脂肪肝","其他"]
				},{
					id:"answer03",
					question:"（3）您目前或曾经是否患有以下呼吸系统疾病？",
					answers:["慢性支气管炎","肺气肿","肺结核","哮喘","反复呼吸道感染"]
				},{
					id:"answer04",
					question:"（4）您目前或曾经是否患有以下内分泌疾病？",
					answers:["Ⅰ型糖尿病","Ⅱ型糖尿病"]
				},{
					id:"answer05",
					question:"（5）如果您目前或曾经患有以下妇科疾病？",
					answers:["宫颈糜烂","乳腺疾病","其他"]
				},{
					id:"answer06",
					question:"（6）如果您目前或曾经患有以下男性疾病？",
					answers:["前列腺炎","前列腺增生","其他"]
				},{
					id:"answer07",
					question:"（7）您目前或曾经是否患有以下过敏性疾病或出现过以下症状？",
					answers:["过敏性皮炎(接触性)","过敏性鼻炎","过敏性哮喘","过敏性紫癜","过敏性休克","药物过敏","食物过敏","其他"]
				},{
					id:"answer08",
					question:"（8）是否属过敏体质或对某些特殊物质（如食物、花粉等）易发生过敏情况？",
					answers:["是","否"]
				},{
					id:"answer09",
					question:"（9）您在过去的3个月内，有没有体重明显下降的情况发生？",
					answers:["没有","1~3公斤","大于3公斤"]
				},{
					id:"answer10",
					question:"（10）您目前是否能独立生活？",
					answers:["是","否"]
				},{
					id:"answer11",
					question:"（11）您目前的日常活动能力情况怎样？",
					answers:["卧床或者依靠轮椅","可下床但是不能外出活动","可外出活动"]
				},{
					id:"answer12",
					question:"（12）您最近自我感觉营养状况怎样？",
					answers:["营养不良","不能确定","没有问题"]
				},{
					id:"answer13",
					question:"（13）您与同龄人相比，自我感觉健康状况怎样？",
					answers:["没别人好","不知道","基本一样","比别人更好"]
				},{
					id:"answer14",
					question:"（14）您目前的神经或精神状况怎样？",
					answers:["严重抑郁或者痴呆","轻度抑郁或者痴呆","基本正常"]
				},{
					id:"answer15",
					question:"（15）您的关节、韧带、肌肉等是否有损伤或疼痛？",
					answers:["是","否"]
				},{
					id:"answer16",
					question:"（16）您的脊柱、骨骼是否有损伤或疼痛？",
					answers:["是","否"]
				},{
					id:"answer17",
					question:"（17）您目前是否存在有头痛或偏头痛的问题？",
					answers:["是","否"]
				},{
					id:"answer18",
					question:"（18）您在过去6-9个月内，是否曾接受过手术治疗？",
					answers:["是","否"]
				},{
					id:"answer19",
					question:"（19）您的体内是否有心脏起搏器等金属类物品？",
					answers:["是","否"]
				}]
			},{
				type:"2﹑家族遗传状况",
				questions:[{
					id:"answer20",
					question:"（20）您的直系家族成员中（父母、兄弟姐妹及子女）是否有人曾患有如下相关疾病？",
					answers:["高血压","冠心病","脑中风","糖尿病","恶性肿瘤","偏头痛","抑郁症","慢性阻塞性肺疾病","无"]
				},{
					id:"answer21",
					question:"（21）您的旁系家族成员中【（外）祖父母、叔舅、姑姨、侄子（女）、外甥（女）】是否有人曾患有如下相关疾病，请在相应的选项前“□”处划勾，可多选：",
					answers:["高血压","冠心病","脑中风","糖尿病","恶性肿瘤","偏头痛","抑郁症","慢性阻塞性肺疾病","无"]
				},{
					id:"answer22",
					question:"（22）您的父亲或母亲是否有骨质疏松或骨折史？",
					answers:["是","否"]
				}]
			},{
				type:"3﹑日常饮食状况",
				questions:[{
					id:"answer23",
					question:"（23）您1天平均用几餐？",
					answers:["1餐","2餐","3餐","3餐以上"]
				},{
					id:"answer24",
					question:"（24）在下列的选项中，符合您日常饮食习惯的有几项？",
					answers:["每天至少喝1杯牛奶或1杯酸奶，或者进食1份奶酪","每周至少吃2次大豆或者豆制品、禽蛋类食品","每天吃肉、鱼或禽类食品"]
				},{
					id:"answer25",
					question:"（25）您是否每餐都吃蔬菜或者水果？",
					answers:["少于2餐/日","每餐都吃"]
				},{
					id:"answer26",
					question:"（26）您现在每天喝的饮料种类以下列的那一种为主？",
					answers:["白开水","茶","果汁、碳酸饮料","其他"]
				},{
					id:"answer27",
					question:"（27）您每天喝多少饮料（包括水、果汁、茶、牛奶等，每杯饮料约为200ml左右）",
					answers:["少于3杯","3^5杯","5杯以上"]
				},{
					id:"answer28",
					question:"（28）您是否能自己独立进食？",
					answers:["需要别人辅助喂食","有些不便","完全能够自己完成"]
				},{
					id:"answer29",
					question:"（29）您在过去的3个月内，有没有饮食量减少的情况发生？",
					answers:["没有","轻度减少","严重减少"]
				},{
					id:"answer30",
					question:"（30）您是否经常食用高脂食品（如肥肉、蛋黄、猪脑、蟹黄等高胆固醇类食物）？",
					answers:["从不","偶尔","经常"]
				},{
					id:"answer31",
					question:"（31）您是否经常食用富含膳食纤维的食物吗（如粗杂粮、蔬菜类及新鲜瓜果）？",
					answers:["从不","偶尔","经常"]
				},{
					id:"answer32",
					question:"（32）您平时喜欢下列的那些食物类型？（可多选）",
					answers:["高热量的甜食（如糕点、饼干、冰淇淋等）","烟熏、油炸类食品（如烤肉串、炸鸡腿、烤鸭、熏肉）","比较烫的食物（如热烫饭菜、热烫饮品、汤羹类食品）","比较硬的食物（如粗杂粮加工的干粮、干豆、硬果、干果等坚硬食品）","比较咸的食物（如榨菜/泡菜/咸鱼/腊肉等）","口味咸淡适中的食物","质地软硬适中的食物"]
				},{
					id:"answer33",
					question:"（33）您是否饮酒？",
					answers:["从不","偶尔","经常"]
				},{
					id:"answer34",
					question:"（34）每天正常的晚餐后，您是否会常常加餐或进食夜宵？",
					answers:["是","否"]
				},{
					id:"answer35",
					question:"（35）您目前的食欲状况怎样？",
					answers:["良好","一般","明显增加","明显减少"]
				},{
					id:"answer36",
					question:"（36）您是否有明确的食物禁忌？",
					answers:["是","否"]
				},{
					id:"answer37",
					question:"（37）您目前是否服用保健品？",
					answers:["是","否"]
				}]
			},{
				type:"4、日常生活状况",
				questions:[{
					id:"answer38",
					question:"（38）您现在吸烟吗?",
					answers:["是","戒烟半年以上","否"]
				},{
					id:"answer39",
					question:"（39）和您一起工作的同事或一起生活的家人中是否有人吸烟？",
					answers:["是","否"]
				},{
					id:"answer40",
					question:"（40）您平均每天吸多少只香烟？",
					answers:["5支以下","5支以上","从不吸烟"]
				},{
					id:"answer41",
					question:"（41）您平时的生活是否经常接触阳光？",
					answers:["是","否"]
				},{
					id:"answer42",
					question:"（42）您平时是否喜欢户外活动？",
					answers:["是","否"]
				},{
					id:"answer43",
					question:"（43）您的日常生活是否有缺少运动的情况？",
					answers:["是","否"]
				},{
					id:"answer44",
					question:"（44）您最常用的减压方式是那些？",
					answers:["运动","睡觉","聊天","上网","其他"]
				},{
					id:"answer45",
					question:"（45）您平时作息是否有规律？",
					answers:["是","否"]
				},{
					id:"answer46",
					question:"（46）您每天的睡眠时间通常是多少？",
					answers:["是","否"]
				},{
					id:"answer47",
					question:"（47）您的日常生活是否有压力过大的情况？",
					answers:["1^3小时","3^6小时","6^9小时","9小时以上"]
				}]
			},{
				type:"5、体力运动状况",
				questions:[{
					id:"answer48",
					question:"（48）您通常选择什么项目进行锻炼？",
					answers:["球类","游泳","舞蹈","跑步","散步","拳操类","器械","跳绳","其他"]
				},{
					id:"answer49",
					question:"（49）您平均每周进行主动锻炼的频率？",
					answers:["5～7次/周","3～4次/周","1～2次/周","偶尔（每周少于1次）"]
				},{
					id:"answer50",
					question:"（50）您平均每次进行运动锻炼，持续的时间是多少分钟？",
					answers:[">60分钟/次","41～60分钟/次","21～40分钟/次","≤20分钟/次"]
				},{
					id:"answer51",
					question:"（51）您每次运动时或运动后的感觉是下列那一种？",
					answers:["轻松","较累","非常累","其他"]
				},{
					id:"answer52",
					question:"（52）是否曾有健康护理专家（如医生、理疗师等）建议您不要参加运动？",
					answers:["是","否"]
				}]
			},{
				type:"6、心理（精神）状况",
				questions:[{
					id:"answer53",
					question:"（53）您目前是否经常出现情绪不稳定的情况？",
					answers:["是","否"]
				},{
					id:"answer54",
					question:"（54）在过去的一年里，您是否出现过以下情绪不稳定的症状？",
					answers:["情绪低落","紧张","烦燥","失眠","自我评价下降","日常兴趣显著减退甚至丧失"]
				},{
					id:"answer55",
					question:"（55）您认为您的行为具有以下行为特征吗？",
					answers:["争强好胜，对自已寄予极大的希望","以事业上的成功与否，作为评价人生价值的标准","工作日程排的满满的，紧紧张张，不知道放松自己","都没有"]
				},{
					id:"answer56",
					question:"（56）您的性格是否偏于内向？",
					answers:["是","否"]
				}]
			}];
			var letters=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o"];
			for(var i=0;i<data.length;i++){
				var questions=data[i].questions;
				for(var j=0;j<questions.length;j++){
					var answers=questions[j].answers;
					for(var k=0;k<answers.length;k++){
						var obj={
							id:letters[k],
							name:answers[k]
						};
						answers[k]=obj;
					}
				}
			}
			return data;
		},
		queryQuestionnaireanswer:function(pkMember){
			aw.ajax({
				url:"api/questionnaireanswer/query",
				data:{
					member:pkMember
				},
				success:function(data){
					//隐藏所有答案的勾
					$(".J-answer").addClass("icon-unchecked").removeClass("icon-ok");
					data=data[0];
					for(var i in data){
						if(data[i] && data[i].split && data[i].split(",").length>1){
							//证明是用，隔开的值
							var datas=data[i].split(",");
							for(var j=0;j<datas.length;j++){
								$(".J-"+i).find(".J-answer-"+datas[j]).removeClass("icon-unchecked").addClass("icon-ok");
							}
						}else{
							$(".J-"+i).find(".J-answer-"+data[i]).removeClass("icon-unchecked").addClass("icon-ok");
						}
					}
				}
			});
		}
	};
	
	module.exports=Questionnaire;
});