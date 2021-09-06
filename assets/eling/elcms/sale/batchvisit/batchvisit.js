/**
 * 回访次数追踪
 * */
define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");	
	var Grid=require("grid-1.0.0");
	var Dialog=require("dialog-1.0.0");
	var Form =require("form-2.0.0")
	var store = require("store");
	var activeUser = store.get("user");
	var template="<div class='el-batchvisit'>"+
		"<div class='J-subnav'></div>"+
		"<div class='J-batchGrid'></div>"+
		"<div class='J-card hidden'></div>"+
		"<div class='J-customerGrid hidden'></div>"+
		"<div class='J-ReturnRecordGrid hidden'></div>"+
		"</div>";
	var batchvisit = ELView.extend({
    	attrs:{
    		template:template
        },
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
        			title:"批量回访",
        			search : function(str) {
						var g=widget.get("returnGrid");
						g.loading();
						aw.ajax({
							url:"api/customer/search",
							data:{
								s:str,
								properties:"name,phoneNumber,mobilePhone",
								fetchProperties:"*,cardType.pkMemberShipCardType,cardType.name",
								"orderString":"lastReturnDate:desc"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);								
							}
						});
					},        			
        			buttons:[{
        				id:"return",
        				text:"返回",
						show:false,
						handler:function(){
							
						}
        				
        			},{
        				id:"batch",
        				text:"批量回访",
						show:false,
						handler:function(){
							
						}
        			},{
						id:"toggle",
						text:"条件▲",
						handler:function(){
							 $(".J-card").toggle();
							 if($(".J-btn-toggle").val()=="条件▲"){
								 $(".J-btn-toggle").val("条件▼");
							 }else if($(".J-btn-toggle").val()=="条件▼"){
								 $(".J-btn-toggle").val("条件▲");
							 }
						}
					}],
					
					buttonGroup:[{
        				id:"visitway",
        				tip:"回访方式",
        				key:"pkVisitWay",
        				showAll:true,
        				showAllFirst:true,
        				value:"name",
        				url:"api/visitway/query",
        				handler:function(key,element){
        					   widget.get("grid").refresh();
        				}
        			}],
                }
			});        	
			this.set("subnav",subnav);
			
			var batchGrid = new Grid({
            	parentNode:".J-ReturnGrid",
				url:"",
				fetchProperties:"",
 				params:function(){
 					return { 
 						"visitway":widget.get("subnav").getValue("visitway"), 
 						"orderString":":desc"
 					}; 
				},
				model:{
					columns:[{
						col:1,
						key:"",
						name:"回访时间",
						format:"date",
					},{
						col:1,
						key:"visitway.name",
						name:"回访方式"
					},{
						col:1,
						key:"user.name",
						name:"意向卡类型"
					},{
						col:1,
						key:"returnCount",
						name:"回访人数",
						format:"detail",
						formatparams:[{
							key:"returnCountDetail",
							handler:function(index,data,rowEle){
								
							}
						}]
					},{
						col:8,
						key:"",
						name:"移动电话"
					}]
				}
            });
            this.set("returnGrid",batchGrid);
            this.set("returnrecordGrid",returnrecordGrid.init(this));
            this.set("returnrecordForm",returnrecordForm.init(this)); 
        },
		afterInitComponent:function(params){
			
		}
	});
	module.exports = batchvisit;	
});

