define(function(require,exports,module){
	var EditGrid=require("editgrid-1.0.0");
	var aw = require("ajaxwrapper");
	var Dialog = require("dialog-1.0.0");
	
	var utils={
		init:function(params,widget){
			return new EditGrid({
				parentNode:".J-medicine",
				url:"api/buymedicineapplication/medicinequery",
				params:function(){
					return{
						"member.memberSigning.room.building":widget.get("subnav").getValue("building"),
					}
				},
				model:{
					head:{
						title:"核对药品",
						buttons:[{
							id:"add",
							icon:"icon-save",
							handler:function(){
    							var arr=widget.get("grid3").getColumnsData("pkBuyMedicineItem");
    							var pkType="";
    							for(var i=0;i<arr.length;i++){
    								pkType+=arr[i]+",";
    							}
    							var a1=widget.get("grid3").getEditData();
    							var actualquantitys="";
    							for(var i=0;i<a1.length;i++){
    								if(!a1[i].actualQuantity){
    									a1[i].actualQuantity=" ";
    								}
    								actualquantitys+=a1[i].actualQuantity+"、";
    							}
    							Dialog.alert({
	                        		title:"提示",
	                        		showBtn:false,
	                        		content:"正在保存，请稍后……"
	                        	});
								 aw.ajax({
                                     url : "api/buymedicineapplication/medicinechecked",
                                     type : "POST",
                                     data : {
                                    	 pkType:pkType,
                                    	 actualquantitys:actualquantitys
                                     },
                                     success : function(data){
                                    	 Dialog.close();
                                    	 widget.hide([".J-medicine"]).show([".J-grid"]);
                                    	 widget.get("subnav").hide(["return"]).show(["checkticket","checkmedicine","checkpaper","datatype","building"]);
                                    	 widget.get("grid").refresh(null,function(){
                                    		 widget.getTotalMny();
                                    	 });
                                    	 widget.get("grid3").refresh();
                                     }
                                 });
							}
						}]
					},
					columns:[{
                        key:"name",
                        name:"姓名"
					},{
						key:"medicinename",
						name:"药品名称"
					},{
						key:"specification",
						name:"规格"
					},{
						key:"quantity",
						name:"应购数量"
					},{
						key:"actualQuantity",
						name:"实购数量",
						type:"text"
					}]
				}
			});
		}
	};
	
	module.exports=utils;
});