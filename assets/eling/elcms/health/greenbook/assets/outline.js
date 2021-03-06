define(function(require,exports,module){
	//多语
	var i18ns = require("i18n");
	var GreenBook_outline={
		getData:function(){
			return [{
				main:"健康汇总信息",
				sub:["一、"+i18ns.get("sale_ship_owner","会员")+"健康信息问卷","二、"+i18ns.get("sale_ship_owner","会员")+"健康体检信息"]
			},{
				main:"主要疾病信息及健康指导",
				sub:["一、体检相关信息汇总","二、主要疾病与健康指导"]
			},{
				main:"营养专项信息汇总及健康指导",
				sub:["一、营养问卷信息汇总","二、营养健康专项指导","三、推荐热量摄取","四、健康食谱推荐","五、同类食物互换表"]
			},{
				main:"运动专项评估及健康指导",
				sub:["一、运动问卷信息汇总","二、运动健康专项评估","三、运动健康专项指导","四、运动健康专项建议","五、居家活动方案推荐","六、推荐健身项目","七、运动健身需要警惕的危险信号"]
			},{
				main:"健康常识",
				sub:["一、健康、亚健康与健康管理","二、健康自测十项指标","三、合理膳食指导介绍","四、十五种常见的饮食禁忌",
				     "五、中药应用注意点","六、老年人适度健身运动的意义","七、养生健身活动益处多","八、养生健身活动小提示"]
			},{
				main:"健康巡检档案",
				sub:["一、健康巡检方案","二、健康日志"]
			}];
		}	
	};
	
	module.exports=GreenBook_outline;
});