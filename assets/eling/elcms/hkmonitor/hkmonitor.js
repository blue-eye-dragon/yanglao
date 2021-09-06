/**
 * 紧急呼救后处理
 */
define(function(require, exports, module) {
	var aw = require("ajaxwrapper");
    var ELView=require("elview");
    var Profile=require("profile");
    var enmu = require("enums");
    var Dialog=require("dialog");
	var Subnav = require("subnav"); 
	var store = require("store");
	var user = store.get("user");
	var Tab = require("tab");
	var DashBoard = require("dashboard");
    var handlebars = require("handlebars");
    var Grid = require("grid");
    var Editgrid = require("editgrid");
    var Form = require("form");
    var Daterange = require("daterange");
    var memberIndex = 0;
    var template=
    "<div class='J-subnav'></div>"+
    "<div class='J-grid'></div>"+
    "<div class='J-form hidden' ></div>"+
	"<div class='J-tab hidden' ></div>";
    var gridFetchProperties="";
	var sosaftertreatment = ELView.extend({
		attrs:{
        	template:template,
        	pkUser:user.pkUser
        },
        events : {
        	"click .nav-responsive li" : function(e){
        		var pkmember=$(e.target).attr("href").substring(7,8);
        		var members = this.get("members");
        		var widget = this;
        		if(members.length>1){
	        		for(var i;i<members.length;i++){
	        			if(pkmember==members[i].pkMember){
	        				widget.get("contactsmsggird").setData(members[i].contacts);
	        			}
	        		}
        		}
        		
        	}
        },
        initTab:function(members,flag){
        	var widget = this;
        	var items =[];
			for(var i = 0;i<members.length;i++){
				items.push({
					id:"member"+members[i].pkMember,
					title:members[i].personalInfo.name
				})
			}
			var tab = new Tab({
				parentNode:".J-tab",
				model:{
					items : items
				}
			});
			this.set("tab",tab);
			for(var i = 0;i<members.length;i++){
				widget.initMemberForm("member"+members[i].pkMember,members[i],flag);
			}
			if(members.length>0)
			{
				widget.get("contactsMsgGird").setData(members[0].contacts);
			}
        },
     
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"摄像头列表",
					items:[
					     ]
				}
			});
			this.set("subnav",subnav);
			//查询video
			var grid =new Grid({
				show:true,
			    parentNode:".J-grid",
			    url : "api/monitor/query",
			    params : function() {
			    	var subnav = widget.get("subnav");
			    	return{
			    		fetchProperties:"monitor.name,monitor.ip,monitor.port,monitor.password,monitor.description,base64Urlmain,serverUrl"
			    	}
			    },
			    model:{
			    	columns : [{
			    		name:"monitor.name",
						label:"摄像头名"
			    	},
			    	{
			    		name:"monitor.description",
						label:"描述"
			    	},{
			    		name:"operate",
						label:"操作",
						format:"button",
						formatparams:[{
							id:"detail",
							text:"查看",
							handler:function(index,data,rowEle){
								//iframe pass 无法最大化
								Dialog.confirm({
				                    title : data.monitor.name,
				                    content : "<iframe allowfullscreen='true' webkitallowfullscreen='true' mozallowfullscreen='true' src='"+data.serverUrl+"/video/player/"+data.base64UrlSub+".do' width='100%' height='300px' frameborder='no'></iframe>",
					                    setStyle : function(){
				                        $(".el-dialog-modal .modal").css({
				                            top : "7%",
				                            /*width:"1200",
				                            height:"900",*/
				                            width : "35%",
				                            left  : "35%"
				                        });

				                        $(".J-dialog-cancel").css({
				                            display : "none"
				                        });

				                        $(".el-dialog-modal .modal-body pre").css({
				                            "padding": "0 9.5px",
				                            "margin-bottom": "0"
				                        });
				                        
				                    }
								
				                });
								$("#videojsframe").attr("allowfullscreen","true");
								$(".J-dialog-confirm").text("关闭");
								$(".J-dialog-confirm").addClass("btn btn-danger J-dialog-confirm");
								}
						}]
			    	}]
			    }
			});
			this.set("grid",grid);
		  },
	});
	module.exports = sosaftertreatment;
});
