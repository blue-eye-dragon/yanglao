 define(function(require,exports,module){
	 var EditGrid=require("editgrid");
	 var aw = require("ajaxwrapper");
	 require("./grid.css");
	var questiongridcon={
			init:function(widget,params,data){
					var items =[{
						key:"true",
						value:"是"
					},{
						key:"false",
						value:"否"
					}]
				   var questiongrid = new EditGrid({
	         		parentNode:".J-dialog-conponent",
	         		autoRender:false,
	  				model:{
	  					id : "questiongrid",
	  					columns:[{
	  						name:"question.name",
	  						label:"问题",
	  						editor : {
								type : "select",
								url : "api/question/query",
								params : function(){
									return {
										questionnaireType:1,
										fetchProperties:
											"pkQuestion," +
											"name,version"
									}
								},
								//代表所选的选项的值是哪一个字段的值
								keyField : "pkQuestion",
								//代表选项下拉框中显示的值
								format : function(data){
									return data.name;
								},
								onAdd : function(plugins){
									var oldDatas = questiongrid.getData();
									
									var question = plugins["question.name"].getData(plugins["question.name"].getValue());
									
									var validateRet = widget.questionValidate(question,oldDatas)
									
									if(validateRet){
										questiongrid.add({
											question : question
										});
										
										var newDatas = questiongrid.getData();
										return true;
									}
									return false;
								},
								onEdit : function(editor,rowIndex,rowData){
									editor.setData(questiongrid.getPlugins()["question.name"].getData());
								},
								onChange : function(editor,rowIndex,rowData){
									//仅进行视图操作
									var question = editor.getData(editor.getValue());
									if(widget.questionValidate(question,questiongrid.getData())){
										//更新模型
										rowData.question = question;
										questiongrid.update(rowIndex,rowData);
									}
								}
							}
	  					},{
	  						name:"orderCode",
	  						label:"序号",
	  						editor : {
								type : "text",
								onEdit : function(plugin,index,rowData){
									plugin.setValue(rowData.orderCode);
								},
								onChange : function(plugin,index,rowData){
									rowData.orderCode = plugin.getValue();
									questiongrid.update(index,rowData);
								}
							}
	  					},{
	  						name:"cond",
	  						label:"是否筛选条件",
	  						format :function(value,row){
	  							if(value){
	  								if(value == "false"){
	  									return "否"
	  								}else{
	  									return "是"
	  								}
	  							}else{
	  								return "否"
	  							}
	  						},
	  						editor : {
								type : "select",
								options:items,
								defaultValue:"false",
								onEdit : function(editor,rowIndex,rowData){
									editor.setValue(rowData.cond);
								},
								onChange : function(editor,rowIndex,rowData){
									rowData.cond = editor.getValue();
									questiongrid.update(rowIndex,rowData);
								}
							}
	  					},{
							name:"gridShow",
	  						label:"是否列表显示",
	  						format :function(value,row){
	  							if(value){
	  								if(value == "false"){
	  									return "否"
	  								}else{
	  									return "是"
	  								}
	  							}else{
	  								return "否"
	  							}
	  						},
	  						editor : {
								type : "select",
								options:items,
								defaultValue:"false",
								onEdit : function(editor,rowIndex,rowData){
									editor.setValue(rowData.gridShow);
								},
								onChange : function(editor,rowIndex,rowData){
									rowData.gridShow =editor.getValue();
									questiongrid.update(rowIndex,rowData);
								}
							}
						},{
	  						name:"operate",
	  						label:"操作", 	
	  						format:"button",
	  						formatparams:[{
	  							id:"del",
	  							text:"删除",
	  							handler:function(index,data,rowEle){
	  								if(data.pkQuestionQuote){
	  									aw.ajax({
	  										url:"api/questionquote/" + data.pkQuestionQuote + "/delete",
	  										dataType:"json",
	  										success:function(data){
		  										questiongrid.remove(rowEle);
		  									}
	  									})
	  								}else{
	  									questiongrid.remove(rowEle);
	  								}
	  							}
	  						}]
	  					}]
	  				}
	         	 });
				questiongrid.setData(data || []);
				widget.set("questiongrid",questiongrid);
				return questiongrid;
			}
		}
	module.exports=questiongridcon  ;
})


