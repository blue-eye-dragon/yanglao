/**
*值班类型设置
*elview
*/
define(function(require,exports,module){
	var ELView = require("elview");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var aw = require("ajaxwrapper");
	var Form = require("form");
	var Dialog=require("dialog-1.0.0");
	var template="<div class='el-setdutytype'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-Grid'></div>"+
	"<div class='J-Form hidden'></div>"+
	"</div>";
	var setDutyType = ELView.extend({
		attrs:{
			template:template
		},
		initComponent:function(params,widget){
			var subnav = new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"值班类型设置",
					buttons:[{
        				id:"add",
        				text:"新增",
						show:true,
						handler:function(){
							widget.get("form").reset();
							widget.show(".J-Form").hide([".J-Grid"]);
							widget.get("subnav").hide(["add"]).show(["return"]);
						}
        			},{
        				id:"return",
        				text:"返回",
        				show:false,
        				handler:function(){
        					widget.show(".J-Grid").hide([".J-Form"]);
							widget.get("subnav").hide(["return"]).show(["add"]);
							widget.get("grid").refresh();
        				}
        			}]
				},
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-Grid",
				url:"api/dutytype/query",
				params:function(){
					return {
						fetchProperties:"pkDutyType,version,name,fullname,startTime," +
								"ifSummary,endTime,description,color",
					}
				},
				model:{
					columns:[{
						key:"name",
						name:"简称",
						col:2
					},{
						key:"fullname",
						name:"全称",
						col:2
					},{
						key:"startTime",
						name:"开始时间",
						format:"date",
						formatparams:{
							mode:"HH:mm"
						},
					},{
						key:"endTime",
						name:"结束时间",
						format:"date",
						formatparams:{
							mode:"HH:mm"
						},
					},{
						key:"ifSummary",
						name:"是否汇总",
						format:function(value){
							if(value){
								return "是";
							}else{
								return "否";
							}
						}
					},{
						key:"description",
						name:"描述",
						col:3
					},{
						key:"",
						name:"操作",
						format:function(row,value){
							return "button";
						},
						col:1,
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.show(".J-Form").hide([".J-Grid"]);
								widget.get("subnav").hide(["add"]).show(["return"]);
								widget.get("form").reset();
								widget.get("form").setData(data);
								if(data.color==null){
									widget.get("form").setValue("color","#ffffff");
								}
								if(data.pkDutyType==1){
									widget.get("form").setDisabled(["name","startTime","endTime"],true);
								}else if(data.pkDutyType==2){
									widget.get("form").setDisabled(["name"],true);
								}
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							show:function(value,row){
								if(row.pkDutyType==1||row.pkDutyType==2){
									return false;
								}else{
									return true;
								}
							},
							handler:function(index,data,rowEle){
								aw.del("api/dutytype/" + data.pkDutyType + "/delete",function(){
		 	 						widget.get("grid").refresh();
		 	 					});
							}	
						}]
					}]
				}
			});
			this.set("grid",grid);
			
			var form = new Form({
				parentNode:".J-Form",
  				model:{
  					id:"dutytype",
  					saveaction:function(){
  						var newdata=form.getData();
  						aw.ajax({
  							url : "api/dutytype/query",
  							type : "POST",
  							data : {
  								"name":newdata.name,
  							},
  							success : function(datas) {
  								if(datas.length!=0){
  									for(var i=0;i<datas.length;i++){
  										if(newdata.pkDutyType!=null&&datas[i].pkDutyType!=newdata.pkDutyType){
  											Dialog.alert({
  					    						content : "该值班类型已存在!"
  					    					 });
  											return false;
  										}
  									}
  								}
								if(newdata.startTime){
		  							newdata.startTime=moment(moment().format("YYYY-MM-DD")+" "+newdata.startTime+":00").valueOf();
		  						}else{
		  							newdata.startTime=null;
		  						}
		  						if(newdata.endTime){
		  							newdata.endTime=moment(moment().format("YYYY-MM-DD")+" "+newdata.endTime+":00").valueOf();
		  						}else{
		  							newdata.endTime=null;
		  						}
		  						
		  						aw.saveOrUpdate("api/dutytype/save",aw.customParam(newdata),function(data){
		  							var datas = widget.get("form").getData();
		  							widget.get("grid").refresh();
		  							widget.show(".J-Grid").hide([".J-Form"]);
		  							widget.get("subnav").hide(["return"]).show(["add"]);
		  						});
							}
  						});
  						
  						
  					},
  					cancelaction:function(){
  	  					widget.show(".J-Grid").hide(".J-Form");
  						widget.get("subnav").hide(["return"]).show(["add"]);
  						widget.get("grid").refresh();
  	  				},
  					items:[{
  						name:"pkDutyType",
  						type:"hidden",
  					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"简称",
						validate:["required"],
						exValidate: function(value){
							if(value.length>15){
								return "不能超过15个字符";
							}else{
								return true;
							}
						}
					},{
						name:"fullname",
						label:"全称",
						exValidate: function(value){
							if(value.length>510){
								return "不能超过500个字符";
							}else{
								return true;
							}
						}
					},{
						name:"color",
		                label : "颜色",
		                type: "colorpicker",
		                defaultValue : "#ffffff"
					},{
						name:"startTime",
						label:"开始时间",
						type:"date",
						mode:"HH:mm",
						step:30
					},{
						name:"endTime",
						label:"结束时间",
						type:"date",
						mode:"HH:mm",
						step:30
					},{
						name:"ifSummary",
						label:"是否汇总",
						type:"select", 
						options:[{
							key:"true",
							value:"是"
						},{
							key:"false",
							value:"否"
						}]
					},{
						name:"description",
						label:"描述",
						type:"textarea",
						exValidate: function(value){
							if(value.length>510){
								return "不能超过500个字符";
							}else{
								return true;
							}
						}
					}]
  				}
			});
			this.set("form",form);
		},
	});
	module.exports = setDutyType;
});
