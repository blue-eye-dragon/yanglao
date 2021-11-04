define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var Profile = require("profile");
	var Subnav = require("subnav-1.0.0"); 
	var Grid = require("grid-1.0.0");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-profile hidden'></div>";
       
	var familycommunicationlist = ELView.extend({
            attrs:{
            	template:template
            },
            initComponent:function(params,widget){
    			var subnav=new Subnav({
    				parentNode:".J-subnav",
                       model:{
    					title:"会员家属沟通记录汇总",
    					buttons:[{
                    		id:"toexcel",
     						text:"导出",
     						handler:function(){ 
     							window.open("api/familycommunication/toexcel?member.memberSigning.room.building="+widget.get("subnav").getValue("building")+"&communicationTime="+widget.get("subnav").getValue("time").start+"&communicationTimeEnd="+widget.get("subnav").getValue("time").end);
     							return false;
     	 					}	
                    	}],
    					buttonGroup:[{
    						id:"building",
    						handler:function(key,element){
    							widget.get("grid").refresh();
    						}
    					}],
    					time:{
    						click:function(time){
    							widget.get("grid").refresh();
    						}
    					},
                    }
    				});
        			this.set("subnav",subnav);
        			
                    var grid=new Grid({
                    	url : "api/familycommunication/query",
                    	fetchProperties:"*,member.memberSigning.room.number,communicationTime,member.personalInfo.name,content",
                        parentNode:".J-grid",
        				params:function(){
        					var subnav=widget.get("subnav");
        					var time=subnav.getValue("time");
        					return {
        						"member.memberSigning.room.building":subnav.getValue("building"),
        					    "member.memberSigning.status":"Normal",
        					    "member.memberSigning.houseingNotIn":false,
        						"member.statusIn":"Normal,Out,Nursing,Behospitalized,NotLive,NursingAndBehospitalized",
        						"communicationTime": time.start,
        						"communicationTimeEnd":time.end,
        					};
        				},
                            model:{
                                columns:[{
                                	key:"communicationTime",
                                	col:1,
            						name:"记录时间",
            						format:"date",
            						formatparams:{
            							mode:"YYYY-MM-DD"
            						}
                                },{
                                	col:1,
            						key:"member",
            						name:"会员姓名",
            						format:function(value,row){
            							var number=value.memberSigning.room.number;
            							var name=value.personalInfo.name;
            							return number+"_"+name;
            						}
            					},{
            						key:"content",
            						name:"记录信息"
            					}]
            				}
                    });
                    
                    this.set("grid",grid); 
            }
        });
        module.exports = familycommunicationlist;
});