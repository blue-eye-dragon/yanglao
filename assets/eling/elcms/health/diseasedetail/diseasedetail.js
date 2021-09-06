define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw=require("ajaxwrapper");
	var form =require("form-2.0.0")
	var DiseaseDetail = BaseView.extend({
		events:{
			"change .J-disease" : function(e){ 
				var  pkDisease = this.get("card").getValue("disease");
				var dataType = this.get("card").getData("disease",{
					pk:pkDisease
				});
				if(dataType){
					this.get("card").setValue("name",dataType.name);
				}
			}
		}, 
		initSubnav:function(widget){
			return {
				model:{
					title:"疾病库",
					search : function(str) {
						widget.get("list").loading();
						aw.ajax({
							url:"api/diseasedetail/search",
							data:{
								s:str,
								properties:"name,disease.name,description",
								fetchProperties:"*,disease.name,disease.pkDisease",
							},
							dataType:"json",
							success:function(data){
								widget.get("list").setData(data);
								
							}
						});
					}
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/diseasedetail/query",
				fetchProperties:"*,disease.name,disease.pkDisease",
				model:{
					columns:[{
						key:"disease.name",
						name:"疾病档案",
						col:"2",
					},{
						key:"name",
						name:"名称",
						col:"2",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								widget.edit("detail",data);
								return false;
							}
						}]
					},
					{
						key:"description",
						name:"描述",
						col:"6",
					},{
						key:"operate",
						name:"操作",
						col:"2",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								widget.edit("edit",data);
								widget.get("card").setAttribute("disease","readonly","readonly");
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								widget.del("api/diseasedetail/" + data.pkDiseaseDetail + "/delete");
								return false;
							}
						}]
					}]
				}
			};
		},
		initCard:function(widget){
			return {
				compType:"form-1.0.0",
				saveaction:function(){
					widget.save("api/diseasedetail/save",$("#diseasedetail").serialize());
				},
				model:{
					id:"diseasedetail",
					items:[{
						name:"pkDiseaseDetail",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"disease",
						label:"疾病档案",
						url:"api/disease/query",
						key:"pkDisease",
						value:"name",
						params:function(){
							return {								
								fetchProperties:"pkDisease,diseaseStatus,name"
							};
					   },
					   type:"select",
					   validate:["required"]
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
						name:"description",
						label:"描述",
						height:"500",
						type:"textarea",
					}]
				}
			};
		}
	});
	module.exports = DiseaseDetail;
});