define(function(require, exports, module) {
    var ELView=require("elview");
    var aw = require("ajaxwrapper");
    var template=require("./livingaloneset.tpl");
    var Subnav = require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
  //多语
	var i18ns = require("i18n");
    var LivingAloneSet = ELView.extend({
        attrs:{
        	template:template
        },
    	events:{
			"click .J-checkbox" : function(e){
				var grid=this.get("grid");
				var pkHealthDate=$(e.target).attr("data-pkHealthData");
				var pkHealthDate=$(e.target).attr("data-version");
				var livingAlone = false;
				if($(e.target).prop("checked")){
					livingAlone = true;
				}
				aw.ajax({
					url:"api/healthdata/add",
					data:{
						pkHealthData:pkHealthDate,
						livingAlone:livingAlone,
						version:version
					}
				});
				
			}
		},
        initComponent:function(params,widget){
        	//初始化subnav
            var subnav=new Subnav({
            	parentNode:".J-subnav",
                model:{
                   title: i18ns.get("sale_ship_owner","会员")+"独居设置",
                   search:function(str) {
	            	   widget.get("grid").loading();
						aw.ajax({
							url:"api/healthdata/search",
							data:{
								s:str,
								properties:"livingAlone,member.status,member.memberSigning.room.number,member.personalInfo.name,member.personalInfo.sex",
							    fetchProperties:"pkHealthData,livingAlone,member.status.value,member.memberSigning.room.number,member.personalInfo.name,member.personalInfo.sex,version"
							},
							dataType:"json",
							success:function(data){
								widget.get("grid").setData(data);
							}
						});
					},
				   buttonGroup:[{
						id:"building",
						showAll:true,
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					},{
						id:"livingAlone",
						items:[{
	                        key:"true",
	                        value:"独居"
	                    },{
	                        key:"false",
	                        value:"不独居"
	                    },{
	                        key:"all",
	                        value:"全部"
	                    }],
						handler:function(key,element){
							widget.get("grid").refresh();
						}
					}]
                }
            });
            this.set("subnav",subnav);
            
            var grid=new Grid({
            	parentNode:".J-grid",
				url:"api/healthdata/livingAlone",
				fetchProperties:"livingAlone,pkHealthData,member.pkMember,member.personalInfo.name,member.status.value,member.personalInfo.sex,member.memberSigning.room.number,version",
				autoRender:false,
				params:function(){
					return {
						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
						"member.statusIn":"Normal,Out,Nursing,Behospitalized,Waitting,NotLive,NursingAndBehospitalized",
						livingAloneStatus:widget.get("subnav").getValue("livingAlone")
					};
				},
				model:{					
					columns:[{
 						key:"member.memberSigning.room.number",
 						name:"房间号"
 					},{
 						key:"member.personalInfo.name",
 						name:"姓名"
 					},{
 						key:"member.personalInfo.sex.value",
 						name:"性别"
 					},{
 						key:"member.status.value",
 						name:  i18ns.get("sale_ship_owner","会员")+"状态"
 					},{
						key:"livingAlone",
						name:"是否独居",
						format:function(value,row){
							if(row.livingAlone==true){
								return "<input class='J-checkbox' checked='true' type='checkbox' data-pkHealthData="+row.pkHealthData+" data-pkHealthData="+row.version+">";
							}else{
								return "<input class='J-checkbox' type='checkbox' data-pkHealthData="+row.pkHealthData+" data-pkHealthData="+row.version+">";
							}
 						}
 					}]
				}
			});
			this.set("grid",grid);
			
        },
        afterInitComponent:function(params,widget){        
			widget.get("grid").refresh();
        }
    });
    module.exports = LivingAloneSet;
});