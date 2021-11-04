define(function(require, exports, module) {
	var BaseView=require("baseview");
	//多语
	var i18ns = require("i18n");
    var memberDeceasesChedule = BaseView.extend({
    	initSubnav:function(widget){
    		var years=[];
			for(var i=0;i<=moment().year()+5-2010;i++){
				var obj={};
				obj.key=2010+i;
				obj.value=2010+i;
				years.push(obj);
			} 
			 return{
				 model:{
					 title:i18ns.get("sale_ship_owner","会员")+"过世查询",
					 buttons:[{
							id:"add",
							text:"新增",
							show:false
						}],
						buttonGroup:[{
							id:"year",
							items:years,
							tip:"年份",
							handler:function(key,element){
							   widget.get("list").refresh();
						   }
						},{
							id:"orderString",
							tip:"排序方式",
							items:[{
								key:"deceasedDate:desc",
								value:"过世日期"
							},{
								key:"member.memberSigning.room.number",
								value:"房间号"
							}],
							handler:function(key,element){
								var year=widget.get("subnav").getValue("year");
									widget.get("list").refresh({
										 flowStatus:"Confirm",
										 "orderString":key,
										 deceasedDate:moment(year).startOf("year").valueOf(),
										 deceasedDateEnd:moment(year).endOf("year").valueOf(),
										 fetchProperties:"*,member.personalInfo.name,member.memberSigning.card.name,member.memberSigning.room.number,member.personalInfo.birthday"
									});
							}
						}]
				 }
			 };
		 },
		 initList:function(widget){
			 return{
				 url:"api/memberDeceases/query",
				 params:function(){
					 var year = widget.get("subnav").getValue("year");
					 return{						 
						 flowStatus:"Confirm",
						 "orderString":widget.get("subnav").getValue("orderString"),
						 deceasedDate:moment(year).startOf("year").valueOf(),
						 deceasedDateEnd:moment(year).endOf("year").valueOf(),
						 fetchProperties:"*,member.personalInfo.name,member.memberSigning.card.name,member.memberSigning.room.number,member.personalInfo.birthday"
					 }
				 },
				 model:{
					 columns:[{
						 col:1,
						 key:"member.personalInfo.name",
						 name:i18ns.get("sale_ship_owner","会员")
					 },{
						 col:1,
						 key:"member.memberSigning.card.name",
						 name:i18ns.get("sale_card_name","卡号")
					 },{
						 col:1,
						 key:"member.memberSigning.room.number",
						 name:"房间号"
					 },{
						 col:1,
						 key:"member.personalInfo.birthday",
						 name:"年龄",
						 format:function(value,row){
							 if(value){
									return moment().year() - moment(value).year();
								}else{
									return ""; 
								}
						}
					 },{
						 col:2,
						 key:"deceasedDate",
						 name:"过世日期",
						 format:"date",
						 formatparams:{
								mode:"YYYY-MM-DD HH:mm"
							}
					 },{
						 col:3,
						 key:"causes",
						 name:"过世原因"
					 },{
						 col:3,
						 key:"description",
						 name:"备注"
					 }]
				 }
			 }
	     },
		 afterInitComponent:function(widget){
			 this.get("subnav").setValue("year",moment().year());
			 this.get("list").refresh();
		 }

    });
	 module.exports = memberDeceasesChedule;
});






