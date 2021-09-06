define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav-1.0.0"); 
	var Grid=require("grid-1.0.0");
	var aw = require("ajaxwrapper");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-gridPrint'></div>";
	var Birthday = ELView.extend({
		attrs:{
        	template:template
        },
        setGridTitle:function(){
			var length = this.get("grid").getData().length;
			var title="共"+length+"人";
			this.get("gridPrint").setTitle(title);
		},
		initComponent:function(params,widget){
//			var monthNames=[{key:1,value:"一月"},{key:2,value:"二月"},{key:3,value:"三月"},{key:4,value:"四月"},{key:5,value:"五月"},{key:6,value:"六月"},{key:7,value:"七月"},{key:8,value:"八月"},{key:9,value:"九月"},{key:10,value:"十月"},{key:11,value:"十一月"},{key:12,value:"十二月"}];
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会员生日",
					time:{
						tip:"生日范围",
						click:function(time){
     					   widget.get("grid").refresh();
     				   },
     				   minDate: moment().startOf("year"),
     				   maxDate: moment().endOf("year"),
     				   ranges : {
     					  "今天": [moment().startOf("days"),moment().endOf("days")],
     				      "本月": [moment().startOf("month"), moment().endOf("month")]
     				   }
					},
					buttonGroup:[{
						id:"orderString",
						tip:"排序",
						items:[{
		                    key:"day",
		                    value:"生日"
						},{
		                    key:"roomNumber",
		                    value:"房间"
						}],
						handler:function(key,element){
							widget.get("grid").refresh({
								pkBuilding:widget.get("subnav").getValue("building"),
								starttime:widget.get("subnav").getValue("time").start,
								endtime:widget.get("subnav").getValue("time").end,
								orderString:key,
							})
						}
					},{
						id:"building",
						tip:"楼宇",
						showAll:true,
						showAllFirst:true,
						handler:function(key,element){
							widget.get("grid").refresh(params,function(){
//								var length = widget.get("list").getData().length;
//								if(length != 0){
//									var title="共"+length+"位会员";
//									widget.get("list").setTitle(title);
//									//widget.get("printGrid").setTitle(title);
//								}else{
//									var title="共0位会员";
//									widget.get("list").setTitle(title);
//									//widget.get("printGrid").setTitle(title);
//								}
							});
						}
					}
//					,{
//						id:"today",
//						items:monthNames,
//						handler:function(key,element){
//							widget.get("grid").refresh(params,function(){
////								var length = widget.get("list").getData().length;
////								if(length != 0){
////									var title="共"+length+"位会员";
////									widget.get("list").setTitle(title);
////									//widget.get("printGrid").setTitle(title);
////								}else{
////									var title="共0位会员";
////									widget.get("list").setTitle(title);
////									//widget.get("printGrid").setTitle(title);
////								}
//							});
//						}
//					}
					,{
						id:"out",
						tip:"导出",
						items:[{
		                    key:"print",
		                    value:"打印"
						},{
		                    key:"toexcel",
		                    value:"导出excel"
						}],
						handler:function(key,element){
							if(key=="print"){
								var subnav=widget.get("subnav");
								subnav.hide(["out","time","building","orderString"]);
								widget.hide([".J-grid"]);
								widget.show([".J-gridPrint"]);
								var data=widget.get("grid").getData();
								widget.get("gridPrint").setData(data);
								widget.setGridTitle();
								window.print();
								subnav.show(["out","time","building","orderString"]);
								widget.hide([".J-gridPrint"]).show([".J-grid"]);
							}else{
								var subnav=widget.get("subnav");
								window.open("api/birthday/toexcel?pkBuilding="+subnav.getValue("building")+"&starttime="+subnav.getValue("time").start+"&endtime="+subnav.getValue("time").end+"&orderString="+subnav.getValue("orderString"));
							}
						}
					}],
				}
			});
			this.set("subnav",subnav);
			
				var grid=new Grid({
					url:"api/report/querymemberwithroom",		
					autoRender:false,
					params:function(){
						return {
							pkBuilding:widget.get("subnav").getValue("building"),
							starttime:widget.get("subnav").getValue("time").start,
							endtime:widget.get("subnav").getValue("time").end,
							orderString:widget.get("subnav").getValue("orderString"),
						};
					},
					parentNode:".J-grid",
					model:{
						head:{
							title:""
						},
						columns:[{
							key : "birthdayString",
	                        name : "生日"
						},{
							key:"pbirthday",
							name:"年龄",
							format:function(row,value){
								if(value.birthday){
									return moment().year() - moment(value.birthday).year();
								}else{
									return ""; 
								}
							}
						}
//						,{
//							key:"memberSigning.room.building.name",
//							name:"楼号"
//						}
						,{
							key:"number",
							name : "房间"
	                    },{
							key : "name",
							name : "姓名"
	                    },{
							key : "sex",
							name : "性别"
	                    },{
							key : "phone",
							name : "电话"
	                    }]
					}
				});
				 this.set("grid",grid);
				 
				var gridPrint=new Grid({
					isInitPageBar:false,
					autoRender:false,
					parentNode:".J-gridPrint",
					model:{
						head:{
							title:""
						},
						columns:[{
							key : "birthdayString",
	                        name : "生日",
						},{
							key:"pbirthday",
							name:"年龄",
							format:function(row,value){
								if(value.birthday){
									return moment().diff(value.birthday, 'years');
								}else{
									return "";
								}
							}
						},{
							key:"number",
							name : "房号"
	                    },{
							key : "name",
							name : "姓名"
	                    },{
							key : "sex",
							name : "性别"
	                    },{
							key : "phone",
							name : "电话"
	                    }]
					}
			
			});
				 this.set("gridPrint",gridPrint);
			
		},
		afterInitComponent:function(params,widget){
//			var myDate = moment().valueOf();
//			var month=moment().month().valueOf()+1;
//			var subnav=widget.get("subnav");
//			subnav.setValue("time",myDate);
			widget.hide([".J-gridPrint"]);
			widget.get("grid").refresh();
//			aw.ajax({
//				url:"api/report/querymemberwithroom",
//				data:{
//					fetchProperties:"personalInfo.birthday,personalInfo.name,personalInfo.phone,memberSigning.room.building.name,memberSigning.room.number",
//					today:widget.get("subnav").getValue("today"),
//					"member.memberSigning.room.building":widget.get("subnav").getValue("building")
//				},
//				success:function(data){
//					if(data && data.length != 0){
//						var title="共"+data.length+"位会员";
//						widget.get("list").setTitle(title);
//						//widget.get("printGrid").setTitle(title);
//					}else{
//						var title="共0位会员";
//						widget.get("list").setTitle(title);
//						//widget.get("printGrid").setTitle(title);
//					}
//				}
//			});
		}
	});
	module.exports = Birthday;
});