define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav"); 
	var Grid = require("grid");
	var Form =require("form");
	var aw = require("ajaxwrapper");
	require("./grid.css");
	var fetchProperties = "pkQuestionnaireType,name,description,version,precut";
	var template="<div class='el-questionnairetype'>"+
				"<div class='J-subnav'></div>"+
				"<div class='J-grid'></div>"+
				"<div class='J-form hidden'></div>"+
				"</div>";
	var QuestionnaireType = ELView.extend({
		 
		attrs:{
        	template:template
        },
        events:{
		},  
        initComponent:function(params,widget){
        	var subnav=new Subnav({
        		parentNode:".J-subnav",
        		model:{
					title:"题目类型定义",
					items:[{
						id:"add",
						type : "button",
						text:"新增",
						handler:function(){
							widget.get("form").reset();
							widget.hide([".J-grid"]).show([".J-form"]);
							widget.get("subnav").hide(["add"]).show("return");
						}
					},{
						id:"return",
						type : "button",
						text:"返回",
						show:false,
						handler:function(){
							widget.show([".J-grid"]).hide([".J-form"]);
							widget.get("subnav").show(["add"]).hide("return");
						}
					}]
				}
        	});
        this.set("subnav",subnav);
        
        var grid=new Grid({
        	parentNode:".J-grid",
        	url : "api/questionnairetype/query",
			fetchProperties:fetchProperties,
			model:{
				columns:[{
					name:"name",
					label:"名称",
					className:"grid_30"
				},{
					name:"description",
					label:"描述",
					className:"grid_40"
				},{
					name:"operate",
					label:"操作",
					format:"button",
					formatparams:[{
						id:"edit",
						icon:"icon-edit",
						show:function(value,row){
							if(row.precut){
								return false
							}else{
								return true
							}
						},
						handler:function(index,data,rowEle){
							var form =widget.get("form");
							form.reset();
							form.setData(data);
							widget.get("subnav").hide(["add"]).show("return");
							widget.hide([".J-grid"]).show([".J-form"]);
							return false;
						}
					},{
						id:"delete",
						icon:"icon-remove",
						show:function(value,row){
							if(row.precut){
								return false
							}else{
								return true
							}
						},
						handler:function(index,data,rowEle){
							aw.del("api/questionnairetype/" + data.pkQuestionnaireType + "/delete",function(){
	 	 						widget.get("grid").refresh(); 
	 	 					});
							return false;
						}
					}]
				}]
			}
        });
        this.set("grid",grid);
        
        var form=new Form({
    		 parentNode:".J-form",
 			 model:{
				id:"questionnairetype",
				saveaction : function() {
        			aw.saveOrUpdate("api/questionnairetype/save",$("#questionnairetype").serialize(),function(data){
						widget.hide([".J-form"]).show([".J-grid"]);
						widget.get("subnav").show(["add"]).hide(["return"]);
						widget.get("grid").refresh();
						return false;
					});
				 },
				 cancelaction:function(){
					 widget.hide([".J-form"]).show([".J-grid"]);
					 widget.get("subnav").show(["add"]).hide(["return"]);
					return false;
	  			 },
				items:[{
					name:"pkQuestionnaireType",
					type:"hidden"
				},{
					name:"version",
					defaultValue:"0",
					type:"hidden"
				},{
					name:"precut",
					defaultValue:"false",
					type:"hidden"
				},{
					name : "name",
	                label : "名称",
	                validate:["required"]
				},{
	                name : "description",
	                type : "textarea",
	                label : "描述"
		        }]
			 }
        });
        this.set("form",form);
        }
	})
	module.exports = QuestionnaireType;
	});