define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog");
	var Subnav = require("subnav");
	var store=require("store");
	var Grid = require("grid");
	var Form =require("form");
	var enmu = require("enums");
	var QuestionareaGrid=require("./questionareagrid");
	var QuestionGrid=require("./questiongrid");
	require("./grid.css");
	var fetchProperties="pkQuestionnaire," +
			"name," +
			"description," +
			"status," +
			"version," +
			"questionAreas.pkQuestionArea," +
			"questionAreas.sequence," +
			"questionAreas.name," +
			"questionAreas.version," +
			"questionAreas.questionQuotes.pkQuestionQuote," +
			"questionAreas.questionQuotes.orderCode," +
			"questionAreas.questionQuotes.question.pkQuestion," +
			"questionAreas.questionQuotes.question.name," +
			"questionAreas.questionQuotes.question.version," +
			"questionAreas.questionQuotes.cond," +
			"questionAreas.questionQuotes.gridShow," +
			"questionAreas.questionQuotes.version";
	
	
	var template="<div class='el-questionnaire'><div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+ 
		"<div class='J-form hidden'></div>"+
		"<div class='J-questionareagrid hidden'></div>" +
		"</div>";
	var Questionnaire = ELView.extend({
		 attrs:{
         	template:template
         },
         initComponent:function(params,widget){
        	 var subnav=new Subnav({
 				parentNode:".J-subnav",
 				model:{
					title:widget.get("params").title || "问卷设置",
					items:[{
						id:"search",
						type:"search",
						placeholder : "搜索",
						handler:function(str) {
							var g=widget.get("grid");
							g.loading();
							aw.ajax({
								url:"api/questionnaire/search",
								data:{
									s:str,
									type:widget.get("params").type || "VisitRecordTrack",
									searchProperties:
											"name," +
											"description",
									fetchProperties:fetchProperties
								},
								dataType:"json",
								success:function(data){
									g.setData(data);
									
								}
							});
						}
					},{
						id:"add",
						text:"新增",
						type:"button",
						show:true,
						handler:function(){
							widget.get("form").reset();
							widget.get("questionareagrid").setData([]);
							widget.show([".J-questionareagrid",".J-form"]).hide([".J-grid"]);
							widget.get("subnav").hide(["add","search"]).show(["return","save"]);
							
						}
					},{
    					id:"return",
						text:"返回",
						type:"button",
						show:false,
						handler:function(){
							widget.hide([".J-questionareagrid",".J-form"]).show([".J-grid"]);
							widget.get("subnav").show(["add","search"]).hide(["return","save"]);
							widget.get("form").setDisabled(false);
							widget.get("questionareagrid").setDisabled(false);
							$(".J-grid-questionareagrid-out").removeClass("hidden");
							$(".J-grid-questionareagrid-del").removeClass("hidden");
							
						}
					},{

    					id:"save",
						text:"保存",
						type:"button",
						show:false,
						handler:function(){
							var form = widget.get("form")
							var data =form.getData();
							//默认停用
							data.status ="BlockUp";
							data.type=widget.get("params").type;
							if(!data.name){
								Dialog.alert({
									content : "请输入名称!"
								 });
								return false;
							}
							var datas =widget.get("questionareagrid").getData();
							var falg = false;
							if(datas.length == 0){
								Dialog.alert({
									content : "请添加问题区域!"
								 });
								return false;
							}
//							var list = [{
//								sequence:1,
//								questionQuotes:[1,3]
//							},{
//								sequence:1,
//								questionQuotes:[2]
//							}];
//								});
//							}
							for ( var i in datas) {
								var questionQuotes =[];
								for ( var j in datas[i].questionQuotes) {
									questionQuotes.push(datas[i].questionQuotes[j].pkQuestionQuote)
								}
								datas[i].questionQuotes=questionQuotes;
							}
							data.list = datas;
						//	data.fetchProperties =fetchProperties;
							Dialog.alert({
                        		title:"提示",
                        		defaultButton : false,
                        		content:"正在保存，请稍后……"
                        	});
							aw.saveOrUpdate("api/questionnaire/save",aw.customParam(data),function(data){
								Dialog.close();
								widget.get("grid").refresh();
								widget.hide([".J-questionareagrid",".J-form"]).show([".J-grid"]);
								widget.get("subnav").show(["add","search"]).hide(["return","save"]);
							},function(data){
								Dialog.close();
							});
						}
					
					}]
				}
        	 });
        	 this.set("subnav",subnav);
        	 
        	 var grid=new Grid({
        		parentNode:".J-grid",
 				model:{
 					url : "api/questionnaire/query",
 	 				params:function(){
 	 					return{
 	 						type:widget.get("params").type || "VisitRecordTrack",
 	 						fetchProperties:fetchProperties
 	 					}
 	 				},
 					columns:[{
 						name:"name",
 						label:"问卷名称",
 						className:"grid_20"
 					},{
 						name:"description",
 						label:"描述",
 						className:"grid_40"
 					},{
						key:"blockup",
						name:"停用",
						format:"button",
						formatparams:[{
							key:"blockupbtn",
							text:"停用",
							show:function(value,row){
 								if(row.status.key=="Setting"){
 									return  true;
 								}else{
 									return "停用中";
 								}
 							},
							handler:function(index,data,rowEle){
								Dialog.confirm({
									title:"提示",
									content:"是否停用当前问卷？",
									confirm:function(){
										aw.ajax({
											url:"api/questionnaire/save",
											data:{
												pkQuestionnaire:data.pkQuestionnaire,
												status:"BlockUp",
												version:data.version
												},
											dataType:"json",
											success:function(data){
												widget.get("grid").refresh();
											}
										});
										
									}
								});
							}
						}]
 					},{
 						name:"operate",
 						label:"操作", 	
 						format:"button",
 						formatparams:[{
 							id:"edit",
 							icon:"icon-edit",
 							show:function(value,row){
 								if(row.status.key=="Setting"){
 									return "使用中";
 								}else{
 									return  true;
 								}
 							},
 							handler:function(index,data,rowEle){
 								var cloneData = $.extend(true,{},data);
 								widget.show([".J-questionareagrid",".J-form"]).hide([".J-grid"]);
 								widget.get("subnav").hide(["add","search"]).show(["return","save"]);
 								widget.get("questionareagrid").setDisabled(false);
 								widget.get("form").setData(cloneData);
								widget.compare(cloneData.questionAreas);
 								widget.get("questionareagrid").setData(cloneData.questionAreas);
 							}
 						},{
 							id:"delete",
 							icon:"icon-remove",
 							show:function(value,row){
 								if(row.status.key=="Setting"){
 									return false;
 								}else{
 									return true;
 								}
 							},
 							handler:function(index,data,rowEle){
 								aw.del("api/questionnaire/" + data.pkQuestionnaire + "/delete",function(data){
 									widget.get("grid").refresh();
 								});
 							}
 						},{
							key:"setup",
							text:"启用",
							show:function(value,row){
 								if(row.status.key=="Setting"){
 									return false;
 								}else{
 									return true;
 								}
 							},
							handler:function(index,data,rowEle){
								if (widget.changeStatusValidate(widget.get("grid").getData(),"Setting")) {
									Dialog.confirm({
										title:"提示",
										content:"是否启用当前问卷？",
										confirm:function(){
											
											aw.ajax({
												url:"api/questionnaire/save",
												data:{
													pkQuestionnaire:data.pkQuestionnaire,
													status:"Setting",
													version:data.version,
												},
												dataType:"json",
												success:function(data){
													widget.get("grid").refresh();
												}
											});
										}
									});
								}else{
									Dialog.alert({
										content : "当前有正在使用的问卷，请先停用!"
									 });
								}
							}
						}]
 					}]
 				}
        	 });
        	this.set("grid",grid);
        	
        	var form=new Form({
        		parentNode:".J-form",
				model:{
					id:"questionnaireform",
					defaultButton:false,
					items:[{
						name:"pkQuestionnaire",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
						name:"description",
						label:"描述",
						type:"textarea"
					}]
				  }
        	});
        	this.set("form",form);
        	var questionareagrid=QuestionareaGrid.init(widget,params);
        	this.set("questionareagrid",questionareagrid);
         },
         changeStatusValidate:function(datas,status){
        	 for ( var i in datas) {
					if(status  == datas[i].status.key){
						return false;
					}
				}
				return true;
          },
         compare:function(datas){
        	datas= datas.sort(function(a,b){
        		return a.sequence- b.sequence;
        	 });
        	this.get("questionareagrid").setData(datas);
         },
         validate:function(sequence,same,datas){
				for ( var i in datas) {
					if(sequence  == datas[i].sequence && same!=sequence ){
						Dialog.alert({
							content : "该序号已存在!"
						 });
						return false
					}
				}
				return true
         },
         questionValidate:function(question,datas){
 			for ( var i in datas) {
 				if(question.pkQuestion  == datas[i].question.pkQuestion){
 					Dialog.alert({
 						content : "该问题已存在!",
 						confirm : function(){
 							$(".el-dialog-mask")[$(".el-dialog-mask").length-1].remove();
 							$(".el-dialog-modal")[$(".el-dialog-modal").length-1].remove()
 							return false;
 						}
 					});
 					return false;
 				}
 			}
 			return true;
 		},
         _showQuestionDialog : function (widget,index,data){
        	$(".J-questionareagrid").attr("questionareagridIndex",index);
 			Dialog.confirm({
 				title : "问题库",
 				defaultButton : false,
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
 				buttons : [{
 					id : "save",
 					text : "保存",
 					className : "btn-primary",
 					handler : function(){
 						 var questiongrid = widget.get("questiongrid");
 						 var questionArea = widget.get("questionareagrid").getData($(".J-questionareagrid").attr("questionareagridIndex"));
 						 var qi={};
 						 qi.qilist =questiongrid.getData();
 						 for ( var i in qi.qilist) {
							qi.qilist[i].cond = qi.qilist[i].cond?qi.qilist[i].cond:false
							qi.qilist[i].gridShow = qi.qilist[i].gridShow?qi.qilist[i].gridShow:false
						}
 						 qi.fetchProperties ="pkQuestionQuote,question.pkQuestion,question.version,question.name,version,cond,gridShow,orderCode";
 						 aw.ajax({
 							url:"api/questionquote/saves",
 							data : aw.customParam(qi),
 							dataType:"json",
 							success:function(data){ 
 								questionArea.questionQuotes =data;
 								Dialog.close();
 							}
 						})
 					}        							
 				},{
 					id : "cancle",
 					text : "取消",
 					handler : function(){
 						Dialog.close();
 					}        							
 				}]
 			});
 			QuestionGrid.init(widget,null,data.questionQuotes)
 		},
	});		
	module.exports = Questionnaire;
});