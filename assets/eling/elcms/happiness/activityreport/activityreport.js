define(function(require, exports, module){
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Form=require("form");
	var Subnav = require("subnav"); 
	var store =require("store");
	var Dialog=require("dialog");
	var Grid = require("grid");
	var enmu = require("enums");
	
	var template="<div class='J-subnav'></div>" +
			"<div class='J-grid'></div>" +
			"<div class='J-form hidden'></div>" +
			"<div class='J-printform hidden'></div>" 
	
	var activityReport = ELView.extend({
		attrs:{
        	template:template
        },
        events:{
			"change .J-form-activityreport-select-activity":function(e){
				var pk=$(e.target).find("option:selected").attr("value");
				var form=this.get("form");
				var params=this.get("params");
				var version=form.get("version");
				if(pk){
					aw.ajax({
						url : "api/activity/query",
						type : "POST",
						data : {
							type:params ? params.activityreportType : "",
							pkActivity:pk,
							fetchProperties:"theme,activitySite,type,activityStartTime,activityEndTime"
						},
						success:function(data){
							form.setData(data[0]);
							form.setValue("activity",pk);
						}
					});
				}
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
        		parentNode:".J-subnav",
				model : {
					title:"活动报告",
					items : [{
						id:"add",
						text:"新增",
						type:"button",
						show:true,
						handler:function(){
							widget.show([".J-form"]).hide([".J-grid",".J-printform"]);
							widget.get("subnav").hide(["add"]).show(["return"]);
							widget.get("form").reset();
						}
					},{
						id:"return",
						type:"button",
						text:"返回",
						show : false,
						handler:function(){
							widget.get("grid").refresh();
							widget.show([".J-grid"]).hide([".J-form",".J-printform"]);
							widget.get("subnav").hide(["return"]).show(["add"]);
						}
					}]
				}
        	});
        	this.set("subnav",subnav);
        	
        	var grid=new Grid({
        		parentNode:".J-grid",
        		url : "api/activityreport/query",
        		params : function() {
    				return {
    					pkActivityReport:widget.get("params") ? widget.get("params").pkActivityReport : "",
    					type:widget.get("params") ? widget.get("params").activityreportType : "",
						fetchProperties:"*,activity.theme,activity.activitySite,activity.activityStartTime,activity.activityEndTime"
    				}
        		},
        		model : {
        			columns : [{
						name:"activity.theme",
						label:"主题",
						format:"detail",
						formatparams:{
							key:"theme",
                            handler:function(index,data,rowEle){
                            	var form = widget.get("form");
								data.activitySite = data.activity.activitySite;
								data.activityStartTime = data.activity.activityStartTime;
								data.activityEndTime = data.activity.activityEndTime;
								form.reset();
								form.setData(data);
								form.setDisabled(true);
								widget.hide([".J-grid",".J-printform"]).show([".J-form"]);
								widget.get("subnav").show(["return"]).hide(["add"]);
                            }
                       }
					},{
						name:"activity.activitySite",
						label:"活动地点"
					},{
						name:"activity.activityStartTime",
						label:"活动开始时间",
						format:"date"
					},{
						name:"activity.activityEndTime",
						label:"活动结束时间",
						format:"date"
					},{
						name:"operate",
						label:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"icon-edit",
							handler:function(index,data,rowEle){
								var form = widget.get("form");
								data.activitySite = data.activity.activitySite;
								data.activityStartTime =data.activity.activityStartTime;
								data.activityEndTime = data.activity.activityEndTime;
								form.reset();
								form.setData(data);
								widget.hide([".J-grid",".J-printform"]).show([".J-form"]);
								widget.get("subnav").show(["return"]).hide(["add"]);
							}
						},{
							key:"delete",
							icon:"icon-remove",
							handler:function(index,data,rowEle){
								aw.del("api/activityreport/"+data.pkActivityReport+"/delete",function() {
									widget.get("grid").refresh();
								});	
							}
						},{
							key:"print",
							text:"打印",
							handler:function(index,data,rowEle){
								widget.get("grid").refresh();
								var form = widget.get("printForm");
								data.activitySite = data.activity.activitySite;
								data.activityStartTime =data.activity.activityStartTime;
								data.activityEndTime = data.activity.activityEndTime;
								form.reset();
								form.setData(data);
								form.setValue("activity",data.activity.theme);
								var size = $("#description").size();
								if(size>0){
									$("div#description").remove();
									$("div#content").remove();
								}
								$("#print").append("<div id='description'><label>描述</label></div><div id='content'><label>"+data.description+"</label></div>");
								widget.hide([".J-grid",".J-form"]).show([".J-printform"]);
								widget.get("subnav").hide(["add","return"]);
								window.print();
								widget.get("subnav").show(["add"]).hide(["return"]);
								widget.show([".J-grid"]).hide([".J-form",".J-printform"]);
							}
						}]
					}]
        		}
    		 });
    		 this.set("grid",grid);
    		 
        	 var form = new Form({
         		 parentNode:".J-form",
         		 saveaction : function() {
         			var form = widget.get("form");
         			var data = form.getData();
         			var datas = {pkActivityReport:data.pkActivityReport,activity:data.activity,description:data.description,type:data.type,version:data.version};
         			aw.saveOrUpdate("api/activityreport/save",datas,function(data){
         				widget.get("grid").refresh();
         				widget.show([".J-grid"]).hide([".J-form",".J-printform"]);
         				widget.get("subnav").hide(["return"]).show(["add"]);
						return false;
     				});
     			  },
     			  cancelaction:function(){
     				    widget.show([".J-grid"]).hide([".J-form",".J-printform"]);
     				    widget.get("subnav").hide(["return"]).show(["add"]);
     					return false;
     			  },
	  			  model:{
	  				 id:"activityreport",
					 items:[{
							name:"pkActivityReport",
							type:"hidden"
						},{
							name:"version",
							defaultValue:"0",
							type:"hidden"
						},{
							name:"type",
							defaultValue:widget.get("params") ? widget.get("params").activityreportType : "",
							type:"hidden"
						},{
							name:"activity",
							label:"活动主题",
							url:"api/activity/query",
							key:"pkActivity",
							value:"theme",
							params:{
								type:widget.get("params").activityreportType,
								fetchProperties:"pkActivity,theme"
							},
							type:"select",
							validate:["required"]
						},{
							name:"activitySite",
							label:"活动地点",
							readonly:true
						},{
							name:"activityStartTime",
							label:"活动开始时间",
							type:"date",
							mode:"YYYY-MM-DD HH:mm",
							readonly:true
						},{
							name:"activityEndTime",
							label:"活动结束时间",
							type:"date",
							mode:"YYYY-MM-DD HH:mm",
							readonly:true
						},{
							name:"description",
	                        label:"描述",
	                        type:"richtexteditor",
	                        options:{
	            				initialFrameHeight:"500",//设置富文本高度
	            				toolbars: [[
        				            'fullscreen', 'source', '|', 'undo', 'redo', '|',
        				            'bold', 'italic', 'underline', 'strikethrough', 'removeformat', 'blockquote', 'pasteplain', '|', 'forecolor', 'insertorderedlist', 'insertunorderedlist', 'cleardoc', '|',
        				            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
        				            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
        				            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
        				            'simpleupload','insertimage', 'emotion', 'inserttable', 'horizontal', 'spechars','|','preview', 'print'
        				        ]]
	            			},
	                        validate:["required"]
						}]
			       }
        	 });
        	 this.set("form",form);
        	 
        	 var printForm = new Form({
         		  parentNode:".J-printform",
	  			  model:{
	  				 id:"print",
	  				 defaultButton:false,
					 items:[{
							name:"activity",
							label:"活动主题"
						},{
							name:"activitySite",
							label:"活动地点"
						},{
							name:"activityStartTime",
							label:"活动开始时间",
							type:"date",
							mode:"YYYY-MM-DD HH:mm"
						},{
							name:"activityEndTime",
							label:"活动结束时间",
							type:"date",
							mode:"YYYY-MM-DD HH:mm"
						}]
			       }
        	 });
        	 this.set("printForm",printForm);
		},
	});
	module.exports = activityReport;	
});
