/**
 * 新建事项
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav");
	var aw = require("ajaxwrapper");
	var Form=require("form")
	var Dialog=require("dialog");
	var enums  = require("enums");
	var Grid=require("grid");
	var store = require("store");
	var activeUser = store.get("user");
	require("../../../grid_css.css");
	var MatterProcessesGrid = require("./asset/matterprocessesgrid");
	var formtpl = require("../form.tpl");
	var mplist = [];
	var fetchProperties ="pkMatter," +
		"version," +
			"title," +
			"createTime," +
			"beginTime," +
			"sender.pkUser," +
			"sender.name," +
			"planFinishTime," +
			"finishTime," +
			"importance," +
			"processDuration," +
			"matterType," +
			"matterStatus," +
			"matterResult," +
			"content," +
			"fileName," +
			"richTextEditor," +
			"matterProcesses.pkMatterProcess," +
			"matterProcesses.sequenceNumber," +
			"matterProcesses.finishTime," +
			"matterProcesses.user.pkUser," +
			"matterProcesses.user.name," +
			"matterProcesses.user.version," +
			"matterProcesses.content," +
			"matterProcesses.status," +
			"matterProcesses.version";
	
	
    var template="<div class= 'el-newmatter'>" +
    		"<div class='J-subnav'></div>"+
    		"<div class='J-grid ' ></div>"+
    		"<div class='J-form hidden' ></div>" +
    		"</div>";
	
	var newmatter = ELView.extend({
		events:{
			"click .J-MatterProcesses":function(e){
				//阻止冒泡
				 e.stopPropagation();
				 e.preventDefault();
				var  widget = this;
				var form = widget.get("form");
				
				Dialog.confirm({
	 				title : "流程配置",
	 				setStyle : function(){
	 					$(".modal").css({
							"height":" 620px",
						    "width": "80%",
							"margin-left":" -20%",
							"top":" 15%",
						});
						$(".modal-body").css({
							"overflow-y": "auto",
							"height":" 500px",
						});
					},
					confirm : function(){
						//将没有整体保存的数据缓存起来
 						mplist = widget.get("matterprocessesgrid").getData();
 						Dialog.close();
					},
					cancel : function(){
						Dialog.close();
					}
	 			});
				MatterProcessesGrid.init(widget);
				var matterprocessesgrid =widget.get("matterprocessesgrid")
				if(mplist.length >0){
					matterprocessesgrid.setData(mplist);
				}else{
					var  pk  = form.getValue("pkMatter")
					if(pk){
						aw.ajax({
							url : "api/matterprocess/query",
							type : "POST",
							data : {
								matter :pk,
								fetchProperties:"pkMatterProcess,sequenceNumber," +
										"user.pkUser," +
										"user.name," +
										"user.version," +
										"version",
							},
							success:function(data){
								matterprocessesgrid.setData(data);
							}
						})
					}
				}
				return false
			},
			"change .J-form-matterform-file-file":function(e){
				var fileName = e.target.files[0].name;
				var form =this.get("form"); 
				form.setValue("fileName",fileName)
			}
		}, 
		 compare:function(datas){
	        	datas= datas.sort(function(a,b){
	        		return a.sequenceNumber- b.sequenceNumber;
	        	 });
	        	this.get("matterprocessesgrid").setData(datas);
	         },
		attrs:{
			template:template
		},
		initComponent : function(params,widget) {
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
 					title:"新建事项",
 					items:[{
 						id:"search",
 						type:"search",
 						placeholder : "搜索",
 						handler:function(str){
							var g = widget.get("grid");
							aw.ajax({
								url:"api/matter/search",
								data:{
									s:str,
									searchProperties:"title,send.name,fileName,matterResult,matterType,importance",
									fetchProperties:fetchProperties
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
								}
							});
 						}
 					},{
	   					 id : "matterResult",
						 type : "buttongroup",
						 tip : "优先级",
						 items:enums["com.eling.elcms.oa.matter.model.Matter.MatterResult"],
						 all : {
								show : true,
								text : "全部"
							 },
						 handler : function(key,value){
							widget.get("grid").refresh();
						 }
 					},{
	   					 id : "importance",
						 type : "buttongroup",
						 tip : "重要程度",
						 items:enums["com.eling.elcms.oa.matter.model.Matter.Importance"],
						 all : {
								show : true,
								text : "全部"
							 },
						 handler : function(key,value){
							widget.get("grid").refresh();
						 }
 					},{
	   					 id : "matterType",
						 type : "buttongroup",
						 tip : "事项类型",
						 items:enums["com.eling.elcms.oa.matter.model.Matter.MatterType"],
						 all : {
								show : true,
								text : "全部"
							 },
						 handler : function(key,value){
							widget.get("grid").refresh();
						 }
 					},{
						id : "time",
						type : "daterange",
						tip :"创建时间",
						ranges : {
							"今天": [moment().startOf("days"),moment().endOf("days")],
							"本周": [moment().startOf("week"),moment().endOf("week")],
							"本月": [moment().startOf("month"), moment().endOf("month")]
						},
						defaultRange : "本周",
						minDate: "1930-05-31",
						maxDate: "2020-12-31",
						handler : function(time){
							widget.get("grid").refresh();
						}
 					},{
						id:"add",
						text:"新增",
						type:"button",
						handler:function(){
							widget.get("subnav").hide(["add","search","matterResult","importance","matterType","time"]).show(["return","save"]);
							widget.hide([".J-grid"]).show([".J-form"]);
							form.reset();
							widget.get("form").getPlugin("richTextEditor").setHeight(300);
							return false;
						}
 					}
 					,{
						id:"save",
						text:"保存",
						show:false,
						type:"button",
						handler:function(){
							var form = widget.get("form");
							if(!form.valid()){
								return  false
							};
							var  data =form.getData();
							data.list =widget.get("matterprocessesgrid")?widget.get("matterprocessesgrid").getData() : [];
							for ( var i in data.list) {
								//给流程明细设置初始值
								data.list[i].status= "Initial"
							}
							Dialog.alert({
                        		title:"提示",
                        		defaultButton : false,
                        		content:"正在保存，请稍后……"
                        	});
							aw.saveOrUpdate("api/matter/save",aw.customParam(data),function(data){
								Dialog.close();
								//上传附件
								mplist=[]
								form.upload("file","api/attachment/matter/file/"+data.pkMatter,function(data){},function(data){});
								widget.get("grid").refresh();
								widget.get("subnav").show(["add","search","matterResult","importance","matterType","time"]).hide(["return","save"]);
								widget.show([".J-grid"]).hide([".J-form"]);
							},function(data){
								Dialog.close();
							})
						}
 					},{
 						id:"return",
 						text:"返回",
 						show:false,
 						type:"button",
 						handler:function(){
 							mplist=[],
 							$(".J-MatterProcesses").removeClass("hidden");
 							widget.get("subnav").show(["add","search","matterResult","importance","matterType","time"]).hide(["return","save"]);
							widget.show([".J-grid"]).hide([".J-form"]);
 						}
 					}]
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid", 
 				url :"api/matter/query",
				params:function(){
					var subnav =widget.get("subnav");
					return {
						fetchProperties:fetchProperties,
						matterResult:subnav.getValue("matterResult"),
						importance:subnav.getValue("importance"),
						matterType:subnav.getValue("matterType"),
						createTime:subnav.getValue("time").start,
						createTimeEnd:subnav.getValue("time").end
					};
				},
 				model:{
 					columns:[{
 						name:"title",
 						label:"标题",
 						className:"oneColumn",
 						format:"detail",
						formatparams:{
							id:"title",
                            handler:function(index,data,rowEle){
 								widget.get("subnav").hide(["add","search","matterResult","importance","matterType","time","save"]).show(["return"]);
 								widget.hide([".J-grid"]).show([".J-form"]);
 								var form = widget.get("form");
 								widget.get("form").getPlugin("richTextEditor").setHeight(300);
 								form.reset();
 								form.setData(data);
 								form.setDisabled(true);
 								$(".J-form-matterform-file-file .form-control").val(data.fileName);
 								$(".J-MatterProcesses").addClass("hidden");
 								form.download("file","api/attachment/matter/file/"+data.pkMatter);
 							
                            }
						}
 					},{
 						name:"fileName",
 						label:"附件",
						className:"twoColumn",
						format:"detail",
						formatparams:{
                            handler:function(index,data,rowEle){
                            	var url = "api/attachment/matter/file/"+data.pkMatter ;
                            	var el = document.createElement("a");
                            	document.body.appendChild(el);
                            	el.href = url; //url 是你得到的连接
                            	el.target = '_new'; //指定在新窗口打开
                            	el.click();
                            	document.body.removeChild(el);
                            }
						}
 						
 					},{
 						name:"createTime",  
 						label:"创建时间",
 						format:"date",
 						className:"oneColumn"
 					},{
 						name:"beginTime",  
 						label:"发送时间",
 						format:"date",
 						className:"oneColumn"
 					},{
 						name:"importance.value",  
 						label:"重要程度",
 						className:"oneColumn"
 					},{
 						name:"processDuration.value",  
 						label:"流程期限",
 						className:"oneColumn"
 					},{
 						name:"matterType.value",  
 						label:"事项类型",
 						className:"oneColumn"
 					},{
 						name:"matterStatus.value",  
 						label:"事项状态",
 						className:"oneColumn"
 					},{
 						name:"matterResult.value",  
 						label:"处理结果",
 						className:"oneColumn"
 					},{
 						name:"operate",
 						label:"操作",
 						format:"button",
 						formatparams:[{
 							key:"send",
 							text:"发送",
 							show:function(value,row){
								if(row.matterStatus.key == "Set"){
									return true
								}else{
									return false
								}
							}, 
 							handler:function(index,data,rowEle){
 								aw.ajax({
 									url : "api/matter/send",
 									dataType:"json",
 									data : {
 										pkMatter :data.pkMatter,
 										matterStatus:"Undo",
 										sender:activeUser.pkUser,
 										beginTime:moment().valueOf(),
 										version:data.version
 									},
 									success:function(data){
 										widget.get("grid").refresh();
 									}
 								})
 								
 							}
 						},{
 							key:"detil", 
 							icon:"icon-edit",
 							show:function(value,row){
								if(row.matterStatus.key == "Set"){
									return true
								}else{
									return false
								}
							},
 							handler:function(index,data,rowEle){
 								widget.get("subnav").hide(["add","search","matterResult","importance","matterType","time"]).show(["return","save"]);
 								widget.hide([".J-grid"]).show([".J-form"]);
 								var form = widget.get("form");
 								widget.get("form").getPlugin("richTextEditor").setHeight(300);
 								form.reset();
 								form.setData(data);
 								$(".J-form-matterform-file-file .form-control").val(data.fileName);
 								MatterProcessesGrid.init(widget);
 								var matterprocessesgrid =widget.get("matterprocessesgrid")
 								matterprocessesgrid.setData(data.matterProcesses);
 								form.download("file","api/attachment/matter/file/"+data.pkMatter);
 							}
 						},{
 							key:"delete",
 							icon:"icon-remove",
 							show:function(value,row){
								if(row.matterStatus.key == "Set"){
									return true
								}else{
									return false
								}
							},
 							handler:function(index,data,rowEle){
 								aw.del("api/matter/" + data.pkMatter + "/delete",function(data) {
 									  widget.get("grid").refresh();
 								});
 							}
 						}]
 					}]
 				}
    		 });
    		 this.set("grid",grid);
       
    		 //form表单
 			 var form = new Form({
				parentNode:".J-form",
				model:{
					id:"matterform",
					defaultButton:false,
					layout:formtpl,
					items:[{
						name:"pkMatter",
						type:"hidden"
					},{
						name:"fileName",
						type:"hidden"
					},{
						name:"version",
						defaultValue:0,
						type:"hidden"
					},{
						name:"title",
						validate:["required"]
					},{
						name:"importance",
	    				type:"select",
	    				options:enums["com.eling.elcms.oa.matter.model.Matter.Importance"],
	    				defaultValue:"Normal",
						validate:["required"]
					},{
						name:"button",
					},{
						name:"processDuration",
	    				type:"select",
	    				options:enums["com.eling.elcms.oa.matter.model.Matter.ProcessDuration"],
						validate:["required"]
					},{
						name:"matterType",
	    				type:"select",
	    				options:enums["com.eling.elcms.oa.matter.model.Matter.MatterType"],
						validate:["required"]
					},{
						name:"matterStatus",
						type:"select",
	    				options:enums["com.eling.elcms.oa.matter.model.Matter.MatterStatus"],
	    				defaultValue:"Set",
	    				readonly:true,
						validate:["required"]
					},{
						name:"createUser",
	    				type:"select",
	    				keyField:"pkUser",
	    				valueField:"name",
	    				readonly:true,
	    				options:[activeUser],
	    				defaultValue:activeUser.pkUser+"" ,
						validate:["required"]
					},{
						name:"createTime",
						type:"date",
	    				defaultValue:moment().format("YYYY-MM-DD"),
						validate:["required"],
						readonly:true
					},{
						name:"sendTime",
						type:"date",
						readonly:true
					},{
						name:"file",
						type:"file",
						placeholder : "不能大于50M",
		                maxSize : 50
					},{ 
						name:"content",
						type:"textarea" 
					},{ 
						name:"richTextEditor",
						type:"richtexteditor"
					}]
				}
			});
			this.set("form",form); 
    	 },
	});
	module.exports = newmatter;
});
