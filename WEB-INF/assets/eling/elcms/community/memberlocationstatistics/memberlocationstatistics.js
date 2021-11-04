define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Grid=require("grid");
	var Dialog = require("dialog");
	require("../../grid_css.css");
	var template="<div class='J-subnav'></div>"+
	"<div class='J-grid' ></div>"+
	"<div class='J-griditem hidden' ></div>";
	var memberlocationstatistics = ELView.extend({
		attrs:{
            template:template
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"会员定位现状统计",
					items :[{
						id : "refresh",
						type :"button",
						text : "刷新",
						show : true,
						handler : function(){
							widget.get("grid").refresh();
							widget.get("grid").setTitle(moment().format("YYYY年MM月DD日 HH时mm分ss秒"))
						}
					},{
						id : "return",
						type :"button",
						text : "返回",
						show : false,
						handler : function(){
							widget.show(".J-grid").hide(".J-griditem");
							widget.get("subnav").hide("return").show(["refresh"]);
						}
					},{
						id:"toexcel",
						type:"button",
						text:"导出",
						handler:function(){
							if(!$(".J-grid").hasClass("hidden")){
								 window.open("api/location/toexcel/querymemberlocationstatistics");
							}else{
								 window.open("api/location/toexcel/querymemberlocationstatisticsdetail?pkMemberIn="+
	                        	widget.get("pkMembers")+"&title="+widget.get("griditem").getTitle());
							}
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-grid",
				model : {
					url : "api/location/report/querymemberlocationstatistics",
					params:function(){
						return{
							fetchProperties:"building.name,normalCount,outCount,dangerCount,outMembers,dangerMembers"
						}
					},
					head:{
						title:moment().format("YYYY年MM月DD日 HH时mm分ss秒"), 
					},
					columns : [{
						name : "building.name",
						label : "楼栋",
					},{
						name : "normalCount",
						label : "正常",
					},{
						name : "outCount",
						label : "疑似外出",
						format:"detail",
						formatparams:{
							id:"outCount",
                            handler:function(index,data,rowEle){
                            	widget.showDetail(data.building.name=="合计"?"所有":data.building.name+"疑似外出状态的会员",data.outMembers.toString(),widget.get("griditem"),widget);
                            	widget.set("pkMembers",data.outMembers.toString());
                            }
						}
					},{
						name : "dangerCount",
						label : "24小时未外出",
						format:"detail",
						formatparams:{
							id:"dangerCount",
                            handler:function(index,data,rowEle){
                            	widget.showDetail(data.building.name=="合计"?"所有":data.building.name+"24小时未移动状态的会员",data.dangerMembers.toString(),widget.get("griditem"),widget);
                            	widget.set("pkMembers",data.dangerMembers.toString());
                            }
						}
					}]
				}
			});
			this.set("grid",grid);
			
			var griditem = new Grid({
				parentNode:".J-griditem",
					head : {
						title : "",
					},
					model:{
						columns : [{
							name : "personalInfo",
							label : "姓名",
							format:function(value,row){
								return  row.memberSigning.room.number+"-"+row.personalInfo.name
							}
						},{
							name : "personalInfo.birthday",
							label : "年龄",
							format:"age"
						},{
							name : "personalInfo.sex.value",
							label : "性别",
						},{
							name : "personalInfo.phone",
							label : "联系电话",
						},{
							name : "person",
	                        label : "紧急联系人",
	                        format:function(value,row){
	                        	if(row.memberSigning.ecPersons.length > 0){
	                        		var name ="";
	                        		for ( var i in row.memberSigning.ecPersons) {
	                        			name =row.memberSigning.ecPersons[i].personalInfo.name +"," 
									}
	                        		return name.substring(0, name.length-1)
	                        	}else{
	                        		return "";
	                        	}
	                        }
						},{
							name : "personphone",
	                        label : "紧急联系人电话",
	                        format:function(value,row){
	                        	if(row.memberSigning.ecPersons.length > 0){
	                        		var phone ="";
	                        		for ( var i in row.memberSigning.ecPersons) {
	                        			phone =row.memberSigning.ecPersons[i].personalInfo.phone +"," 
									}
	                        		return phone.substring(0, phone.length-1)
	                        	}else{
	                        		return "";
	                        	}
	                        }
						}]
					}
			});
			this.set("griditem",griditem);
		},
		showDetail:function(title,memberpks,griditem,widget){
			aw.ajax({
				url:"api/member/query",
				data:{
					pkMemberIn:memberpks,
					fetchProperties:"memberSigning.room.number," +
							"personalInfo.name," +
							"personalInfo.sex," +
							"personalInfo.birthday," +
							"personalInfo.phone," +
							"memberSigning.ecPersons.personalInfo.name," +
							"memberSigning.ecPersons.personalInfo.phone"
				},
				dataType:"json",
				success:function(data){
					griditem.setData(data);
					griditem.setTitle(title)
					widget.hide(".J-grid").show(".J-griditem");
					widget.get("subnav").show("return").hide(["refresh"]);
				}
			});
		}
	});
	module.exports = memberlocationstatistics;
});
