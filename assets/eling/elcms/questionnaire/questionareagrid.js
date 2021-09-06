define(function(require,exports,module){
	 var EditGrid=require("editgrid");
	 require("./grid.css");
	var questionareagrid={
			init:function(widget,params){
				return new EditGrid({
	         		parentNode:".J-questionareagrid",
	         		autoRender:false,
	  				model:{
	  					id : "questionareagrid",
	  					columns:[{
	  						name:"sequence",
	  						label:"序号",
	  						className:"grid_20",
	  						editor : {
	  							type : "text",
	  							onAdd : function(plugins){
	  								var  questionareagrid =widget.get("questionareagrid");
									var oldDatas = questionareagrid.getData();
									
									var sequence = plugins["sequence"].getValue();
									
									var validateRet = widget.validate(sequence,null,oldDatas)
									
									if(validateRet){
										questionareagrid.add({
											sequence : sequence,
											name : plugins["name"].getValue()
										});
										
										var newDatas = questionareagrid.getData();
										widget.compare(newDatas);
										return true;
									}
									return false;
								},
								onEdit : function(editor,rowIndex,rowData){
									editor.setValue(rowData.sequence);
								},
								onChange : function(plugin,index,rowData){
									var  questionareagrid =widget.get("questionareagrid");
									var sequence = plugin.getValue();
									var oldDatas = questionareagrid.getData();
									if(!sequence){
										return false;
									}
									var validateRet = widget.validate(sequence,rowData.sequence,oldDatas)
									if(validateRet){
										rowData.sequence =sequence;
										questionareagrid.update(index,rowData)
										var newDatas = questionareagrid.getData();
										widget.compare(newDatas);
										return true;
									}
									return false;
								}
							}
	  					},{
	  						name:"name",
	  						label:"名称",
	  						className:"grid_20",
	  						editor : {
								type : "text",
								onEdit : function(plugin,index,rowData){
									plugin.setValue(rowData.name);
								},
								onChange : function(plugin,index,rowData){
									rowData.name = plugin.getValue();
									widget.get("questionareagrid").update(index,rowData);
								}
							}
	  					},{
	  						name:"questionQuotes",
	  						label:"问卷题目", 	
	  						format:"button",
	  						formatparams:[{
	  							id:"choose",
	  							text:"选题",
	  							handler:function(index,data,rowEle){
	  								widget._showQuestionDialog(widget,index,data);
	  							}
	  						}]
	  					},{
	  						name:"operate",
	  						label:"操作", 	
	  						format:"button",
	  						formatparams:[{
	  							id:"del",
	  							text:"删除",
	  							handler:function(index,data,rowEle){
	  								widget.get("questionareagrid").remove(rowEle);
	  							}
	  						}]
	  					}]
	  				}
	         	 });
			}
		}
	module.exports=questionareagrid  ;
})


