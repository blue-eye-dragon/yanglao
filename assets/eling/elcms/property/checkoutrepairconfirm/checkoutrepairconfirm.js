/**
 * 退房维修确认
 * J-subnav
 * grid
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var template="<div class='el-checkoutrepairconfirm'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-grid'></div>"+
		"</div>";
		
	
	var checkoutrepairconfirm = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"退房维修确认",
                }
			});
			this.set("subnav",subnav);
			
			var grid=new Grid({
            	parentNode:".J-grid",
				url:"api/room/query",
				params:function(){
					return {
					"status":"OutRoomMaintenance",
					fetchProperties:"pkRoom,number,type.name,type,telnumber"
					};
				},
				model:{
					columns:[{
						key:"number",
						name:"房间号"
						
					},{
						key:"type.name",
						name:"房型"
					},{
                        key:"telnumber",
                        name : "房间电话"
                    },{
						key:"operate",
						name : "操作",
						format:"button",
						formatparams:[{
							key:"edit",
							text:"确认",
							handler:function(index,data,rowEle){
								aw.ajax({
									url:"api/checkoutrepair/confirm",
									data:{
										pkRoom:data.pkRoom,
										fetchProperties:"pkRoom,number,type.name,type"
									},
									dataType:"json",
									success:function(data){
										if(data){
											Dialog.alert({
												content:"确认成功！"
											});
											widget.get("grid").refresh();
										}else{
											Dialog.alert({
												content:"确认失败！"
											});
										}
									}
								})
							}
						}]
					}]
				}
            });
            this.set("grid",grid);
        }
	});
	module.exports = checkoutrepairconfirm;	
});