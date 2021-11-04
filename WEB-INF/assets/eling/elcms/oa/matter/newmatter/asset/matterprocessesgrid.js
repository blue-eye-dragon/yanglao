 define(function(require,exports,module){
	 var EditGrid=require("editgrid");
	 var aw = require("ajaxwrapper");
	var matterprocessesgrid={
			init:function(widget,params,data){
				   var matterprocessesgrid = new EditGrid({
	         		parentNode:".J-dialog-conponent",
	         		autoRender:false,
	  				model:{
	  					id : "matterprocessesgrid",
	  					columns:[{
	  						name:"sequenceNumber",
	  						label:"序号",
	  						col:2,
	  						editor : {
								type : "text",
								onAdd : function(plugins){
									var oldDatas = matterprocessesgrid.getData();
									
									var sequenceNumber = plugins["sequenceNumber"].getValue();
									
									matterprocessesgrid.add({
											sequenceNumber : sequenceNumber,
											user : plugins["user.name"].getData(plugins["user.name"].getValue())
										});
										
										var newDatas = matterprocessesgrid.getData();
										widget.compare(newDatas);
										return true;
									return false;
								},
								onEdit : function(plugin,index,rowData){
									plugin.setValue(rowData.sequenceNumber);
								},
								onChange : function(plugin,index,rowData){
									rowData.sequenceNumber = plugin.getValue();
									matterprocessesgrid.update(index,rowData);
									widget.compare(matterprocessesgrid.getData());
								}
							}
	  					},{
	  						name:"user.name",
	  						label:"处理人",
	  						editor : {
								type : "select",
								url : "api/users/nofreeze",
								params : function(){
									return {
										fetchProperties:
											"pkUser," +
											"name," +
											"version"
									}
								},
								//代表所选的选项的值是哪一个字段的值
								keyField : "pkUser",
								//代表选项下拉框中显示的值
								valueField:"name",
								onEdit : function(editor,rowIndex,rowData){
									editor.setData(matterprocessesgrid.getPlugins()["user.name"].getData());
								},
								onChange : function(editor,rowIndex,rowData){
									//仅进行视图操作
									var user = editor.getData(editor.getValue());
									//更新模型
									rowData.user = user;
									matterprocessesgrid.update(rowIndex,rowData);
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
	  								if(data.pkMatterProcess){
	  									aw.ajax({
	  										url:"api/matterprocess/" + data.pkMatterProcess + "/delete",
	  										dataType:"json",
	  										success:function(data){
	  											matterprocessesgrid.remove(rowEle);
		  									}
	  									})
	  								}else{
	  									matterprocessesgrid.remove(rowEle);
	  								}
	  							}
	  						}]
	  					}]
	  				}
	         	 });
				widget.set("matterprocessesgrid",matterprocessesgrid);
				return matterprocessesgrid;
			}
		}
	module.exports=matterprocessesgrid  ;
})


