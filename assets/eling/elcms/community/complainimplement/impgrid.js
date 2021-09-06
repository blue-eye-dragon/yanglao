 define(function(require,exports,module){
	var EditGrid=require("editgrid");
	var Dialog=require("dialog");
	var impgrid={
			init:function(widget,params){
				var instimpgrid =new EditGrid({
	         		parentNode:params.parentNode,
	         		autoRender:false,
	  				model:{
	  					id : "impgrid",
	  					head :{
	  						title:"落实跟进"
	  					},
	  					columns:[{
							name : "followUser.name",
							label : "跟进人",
							editor : {
								type : "select",
								url:"api/users/nofreeze",//TODO 用户角色：wulina
		        				params:{
									fetchProperties:"pkUser,name",
									seal:false
								}, 
								keyField : "pkUser",
								valueField : "name",
								onAdd : function(editors){
									var editor = editors["followUser.name"];
									instimpgrid.add({
										followUser : editor.getData(editor.getValue()),
										implementDate :editors["implementDate"].getValue(),
										context :editors["context"].getValue(),
									});
								},
								onEdit : function(plugin,index,rowData){
									plugin.setValue(rowData.followUser.pkUser);
								},
								onChange : function(plugin,index,rowData){
									if(plugin.getValue()){
										rowData.followUser = plugin.getData(plugin.getValue());
										instimpgrid.update(index,rowData);
										widget.compare(instimpgrid.getData());
									}else{
										instimpgrid.remove(index);
									}
								}	
							}
						},{
	  						name:"implementDate",
	  						label:"时间",
	  						format : "date",
	  						editor : {
								type : "date",
								onChange : function(plugin,index,rowData){
									if(plugin.getValue()){
										rowData.implementDate = plugin.getValue();
										instimpgrid.update(index,rowData);
										widget.compare(instimpgrid.getData());
									}else{
										
									}
								}
							}
						},{
	  						name:"context",
	  						label:"内容",
	  						editor : {
								type : "textarea",
								onChange : function(plugin,index,rowData){
									if(plugin.getValue()){
									rowData.context = plugin.getValue();
									instimpgrid.update(index,rowData);
									widget.compare(instimpgrid.getData());
									}else{
										Dialog.alert({
											content : "内容不可为空!"
										 });
										return false;
									}
								}
							}
						}]
	  				}
	         	 });
				return instimpgrid
			}
		}
	module.exports=impgrid  ;
})


