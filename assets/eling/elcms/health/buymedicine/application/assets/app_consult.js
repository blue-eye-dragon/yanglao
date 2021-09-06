define(function(require,exports,module){
	var Tab=require("tab");
	var Grid=require("grid-1.0.0");
	var aw=require("ajaxwrapper");
	var tab,grid1,grid2;
	
	var Consult={
		consult:function(widget){
			tab=new Tab({
				model:{
					items:[{
						id:"medicine",
						title:"药品档案"
					},{
						id:"history",
						title:"购药历史"
					}]
				}
			});
			
			grid1=new Grid({
		    	url : "api/medicine/query",
		   	 	parentNode:"#medicine",
		   	 	items_per_page:10,
		   	 	model:{
		   	 		isCheckbox:true,
		   	 		columns:[{
						key : "name",
						name : "药品名称",
						format:function(value,row){
							return value + "/"+(row.generalName || "");
						}
					},{
						key : "specification",
						name : "规格"
					}]
				}
		    });
			
			grid2=new Grid({
		    	url : "api/buymedicineitem/historymedicineinformationquery",
		    	params:function(){
		    		return {
		    			fetchProperties:"medicine.pkMedicine,medicine.name,medicine.specification,medicine.generalName",
		    			member:widget.get("form").getValue("member")
		    		};
		    	},
		   	 	parentNode:"#history",
		   	 	items_per_page:10,
		   	 	model:{
		   	 		isCheckbox:true,
		   	 		columns:[{
						key : "medicine",
						name : "药品名称",
						format:function(value,row){
							return value.name + "/"+(value.generalName || "");
						}
					},{
						key : "medicine.specification",
						name : "规格"
					}]
				}
		    });
			return tab;
		},
		getSelectedData:function(){
			var index = tab.getActive();
			if(index==0){
				return grid1.getSelectedData();
			}else{
				return grid2.getSelectedData();
			}
		},
		search:function(str){
			if(str){
				aw.ajax({
					url:"api/medicine/search",
					data:{
						s:str,
						properties:"name,generalName", 
						fetchProperties:"pkMedicine,name,specification,generalName" 
					},
					dataType:"json",
					success:function(data){
						grid1.setData(data);
					}
				});
			}else{
				grid1.refresh();
			}
			tab.setActive(0);
		}
	};
	module.exports=Consult;
});