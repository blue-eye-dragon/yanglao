/**
 * 房间状态调整
 */
define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Form=require("form-2.0.0")
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	//多语
	var i18ns = require("i18n");
    var template="<div class='J-subnav'></div>"+
    		"<div class='J-grid' ></div>";
	var RoomStatusChange = ELView.extend({
		attrs:{
			template:template 
		},
		initComponent : function(params,widget) { 
    		 var subnav=new Subnav({
    			 parentNode:".J-subnav",
    			 model:{
 					title:"房间状态调整",
 					items:[{
 						id:"search",
 				       type:"search",
 				       handler:function(str) { 
 	 	            	   widget.get("grid").loading();
 	 						aw.ajax({ 
 	 							url:"api/room/search",
 	 							data:{
 	 								s:str, 
 	 								properties:"number,status.value",         
 	 							    fetchProperties:"pkRoom,number,status,version"          
 	 							},
 	 							dataType:"json", 
 	 							success:function(data){
 	 								widget.get("grid").setData(data);
 	 							}
 	 						});
 	 					}

 					},{
						id:"building",
						type:"buttongroup",
						showAll:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
 						 id:"statusIn", 
 						 type:"buttongroup",
 						 showAll:true,
 						 items:[{
 								key:"InUse",
 								value:"使用中" 	
 							},{
 								key:"OutRoomMaintenance",
 								value:"退房维修"
 							},{
 								key:"Empty",
 								value:"空房"
 							},{
 								key:"Waitting",
 								value:"待入住"
 							},{
 								key:"Occupy",
 								value:i18ns.get("cm_room_control","占用"),
 							},{
 								key:"Appoint",
 								value:"已预约"
 							},{
 								key:"NotLive",
 								value:"选房不住"
 							}],
 							handler:function(key,element){
 								widget.get("grid").refresh(); 
 							}
 					}], 
                 }
    		 });
    		 this.set("subnav",subnav);
    		 
    		 var grid=new Grid({
    			parentNode:".J-grid",
 				url :"api/room/query", 
 				fetchProperties:"pkRoom,number,status,version",
 				params:function(){
 					return { 
 						building:widget.get("subnav").getValue("building"),
 						statusIn:widget.get("subnav").getValue("statusIn"),
					}; 
				},
 				model:{
 					columns:[{
 						key:"number",
 						name:"房间"
 					},{
 						key:"status.value",
 						name:"状态"
 					},{
						key:"operate",
						name:"操作", 	
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								Dialog.showComponent({
									title:"房间状态调整",
									confirm:function(){
										aw.saveOrUpdate("api/room/save",$("#roomstatuschange").serialize(),function(data){
											widget.get("grid").refresh({ 
												pkRoom:data.pkRoom  
											});
										});
									},
									setStyle:function(){
										$(".el-dialog .modal.fade.in").css({
											"top":"10%",
											"width": "50%",
											"left": "20%"
										});
									}
								},
								widget.Form(data)
								);
							}
						}]					
 					}]
 				}
    		 });
    		 this.set("grid",grid);
    	 },
    	 Form:function(data){
				var form =  new Form({
					defaultButton:false,
					model:{
						id:"roomstatuschange",
						defaultButton:false,
						items:[
						{
							name:"nowStatus",
							label:"当前状态",
							readonly:true,
							defaultValue:data.status.value
						},{
							name:"status",
							label:"调整状态",
							type:"select",
							url:"api/enum/com.eling.elcms.community.model.Room.Status",
							validate:["required"]
						},{
							name:"pkRoom",
							defaultValue:data.pkRoom,
							type:"hidden"
						},{
							name:"version",
							defaultValue:data.version,
							type:"hidden"
						}]
					}
				
				});
				this.set("form",form);
				return form;
			},
	});
	module.exports = RoomStatusChange;
});
