define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav=require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
	var Dialog = require("dialog-1.0.0");
	var i18ns = require("i18n");
	var memberconcernTodoList=ELView.extend({
		attrs:{
			template: "<div class='J-subnav'></div><div class='J-grid'></div>"
		},
		events:{
			"click .J-phone-btn " : function(e){
				var grid=this.get("todolist");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				if(data){
					data.phone = moment().valueOf();
					aw.ajax({
						url : "api/action/memberconcern/save",
						type : "POST",
						contentType:"application/json",
						data:JSON.stringify(data),
						dataType : "json",
						success : function(result){
							if("超期" == result.msg){									
								Dialog.alert({
									content:"任务已超期，不能进行操作"
								});
							}else{		
								//TODO:临时解决方案，获得单元格直接赋值
								$(e.target).parents("td").text("完成")
							}
						}
					});		
				}
			},
			"click .J-meet-btn" : function(e){
				var grid=this.get("todolist");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				if(data){
					data.meet = moment().valueOf();
					aw.ajax({
						url : "api/action/memberconcern/save",
						type : "POST",
						contentType:"application/json",
						data:JSON.stringify(data),
						dataType : "json",
						success : function(result){
							if("超期" == result.msg){									
								Dialog.alert({
									content:"任务已超期，不能进行操作"
								});
							}else{	
								//TODO:临时解决方案，获得单元格直接赋值
								$(e.target).parents("td").text("完成")
							}
						}
					});		
				}
		        return false;
		    },
			"click .J-visit-btn" : function(e){
				var grid=this.get("todolist");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				if(data){
					data.visit = moment().valueOf();
					aw.ajax({
						url : "api/action/memberconcern/save",
						type : "POST",
						contentType:"application/json",
						data:JSON.stringify(data),
						dataType : "json",
						success : function(result){
							if("超期" == result.msg){									
								Dialog.alert({
									content:"任务已超期，不能进行操作"
								});
							}else{	
								//TODO:临时解决方案，获得单元格直接赋值
								$(e.target).parents("td").text("完成")
							}
						}
					});		
				}
		        return false;	
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:i18ns.get("sale_ship_owner","会员")+"关注待办任务"
				}
			});
			this.set("subnav",subnav);
			
			//列表
            var todolist=new Grid({	                        
            	parentNode:".J-grid",
			     url:"api/action/memberconcern/queryToDolist",
			     params:params,
			     fetchProperties:"*," +
					"building.name," +
					"building.version," +
					"member.memberSigning.room.number," +
					"member.personalInfo.name",
			     model:{
                    columns:[{
                        key : "date",
                        name : "日期",
                        format:"date"
                    },{
                        key : "member.memberSigning.room.number",
                        name : "房间"
                    },{
                        key : "member.personalInfo.name",
                        name : "姓名"
                    },{
                        key:"phone",
                        name : "电话",
                        format:function(value,row){
                        	if(value){
                        		ret = "<div>完成</div>"; 
                        	}else{
                        		return "button";
                        	}
							return ret; 
                        },
                        formatparams:[{
                        	key:"phone-btn",
                        	text:"完成"
                        }]
                    },{
                        key:"meet",
                        name : "见面",
                        format:function(value,row){
                        	if(value){
                        		ret = "<div>完成</div>"; 
                        	}else{
                        		return "button";
                        	}
							return ret; 
                        },
                        formatparams:[{
                        	key:"meet-btn",
                        	text:"完成"
                        }]
                    },{
                        key:"visit",
                        name : "拜访",
                        format:function(value,row){
                        	if(value){
                        		ret = "<div>完成</div>"; 
                        	}else{
                        		return "button";
                        	}
							return ret;
                        },
                        formatparams:[{
                        	key:"visit-btn",
                        	text:"完成"
                        }]
                    }]
                }
            });
            this.set("todolist",todolist);
		}
	});
	
	module.exports = memberconcernTodoList;
});