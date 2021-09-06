define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Dialog=require("dialog-1.0.0");
	var Subnav = require("subnav-1.0.0");	
	var Tab = require("tab");
	var Grid=require("grid");
	var Verform = require("form-2.0.0")
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-grid1'></div>"+
	 "<div class='J-grid2'></div>"+
	 "<div class='J-verform1 hidden'></div>"+
	 "<div class='J-verform2 hidden'></div>"+
	 "<div class='J-tab hidden'></div>";

    var Medicine = ELView.extend({
        attrs:{
        	template:template
        },
		events:{
			"click .J-edit":function(e){
				//1.拿到这一行的数据
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getData(index);
				//2.verform.setData方法
				this.get("verform").reset();
				this.get("verform").setData(data);
				//3.隐藏列表显示卡片
				$(".J-tab,.J-grid,.J-adds,.J-merge,.J-merges,.J-subnav-search-search,.J-refresh").addClass("hidden");
				$(".J-return,.J-verform1").removeClass("hidden");
			},
			"click .J-delete":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getData(index);
				aw.del("api/medicine/" + data.pkMedicine + "/delete",function(data){
					grid.refresh();
				});
			},
			"click .J-seal":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getData(index);
				//前面的Data是数据库里的数据
				//后面的Data是修改完成后保存在数据库的数据
				aw.saveOrUpdate("api/medicine/" + data.pkMedicine + "/seal",data,function(data){
					grid.refresh();
				});
			},
			"click .J-grid-checkbox":function(e){
				var grid1=this.get("grid1");
				var flag = e.currentTarget.checked;
				var index=grid1.getIndex(e.currentTarget);
				var data=grid1.getData(index);
				if(flag){
					//插入目的表时尽量保证顺序
					this.get("grid2").insert(data.pkMedicine, data);
				}else{
					//去掉多选框勾选时从目的表中移除
					this.get("grid2").remove(e.currentTarget);					
				}
			}
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"药品档案",
					search:true,
					buttons:[{
						id:"merge",
						text:"合并",
						handler:function(){
							$(".J-adds,.J-subnav-search-search,.J-grid,.J-verform1,.J-merge,.J-refresh").addClass("hidden");
							widget.get("grid1").refresh();
							$(".J-tab,.J-return,.J-merges").removeClass("hidden");
							var data2=[];
							widget.get("grid2").setData(data2);
							widget.get("tab").setActive(0);
							return false; 
						}
					},{
						id:"merges",
						text:"确定合并",
						show:false,
						handler:function(){
							var old=widget.get("grid2").getData();
							var pkTypes="";
                         	for(var i=0; i<old.length;i++){
                         		pkTypes+=old[i].pkMedicine+",";
                         	}
   							var news=widget.get("grid2").getSelectedData();
   							var pkType="";
                         	for(var i=0; i<news.length;i++){
                         		pkType=news[i].pkMedicine;
                         	}
                         	if(pkTypes=="" || pkType==""){
                     			Dialog.tip({
									title:"请选择需要合并的药品"
                     			});
                      	    }else{
                                 aw.ajax({
                                     url : "api/medicine/merge", 	
                                     type : "POST",
                                     data : {
                                    	 pkTypes:pkTypes,
                                    	 pkType:pkType
                                     },
                                     success : function(data){
	        							$(".J-verform1,.J-return,.J-tab,.J-merges").addClass("hidden");
	        							$(".J-adds,.J-subnav-search-search,.J-grid,.J-merge,.J-refresh").removeClass("hidden");
	        							widget.get("tab").setActive(0);
	        							widget.get("grid").refresh();
                                     }
                                 });
                      	    }
						}
					},{
						id:"adds",
						text:"新增",
						handler:function(){
							widget.get("verform").reset();
							$(".J-adds,.J-grid,.J-merge,.J-merges,.J-subnav-search-search,.J-refresh").addClass("hidden");
							$(".J-verform1,.J-return").removeClass("hidden");
							return false;
						}
					},{
    					id:"refresh",
    					type:"button",
    					text:"刷新",
    					handler:function(){
    						widget.get("grid").refresh();
    					}
    				},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							if(!$(".J-adds").hasClass("hiddle")){
  								$(".J-grid,.J-adds,.J-merge,.J-subnav-search-search,.J-refresh").removeClass("hidden");
								$(".J-verform1,.J-return,.J-tab,.J-verform2,.J-merges").addClass("hidden");
								return false;
							}else if(!$(".J-merge").hasClass("hidden")){
								$(".J-grid,.J-merge,.J-adds,.J-subnav-search-search,.J-refresh").removeClass("hidden");
								$(".J-tab,.J-return,.J-verform2,.J-merges").addClass("hidden");
								return false;
							}else if(!$(".J-verform2").hasClass("hidden")){
								$(".J-grid,.J-merge,.J-adds,.J-subnav-search-search,.J-refresh").removeClass("hidden");
								$(".J-tab,.J-return,.J-verform2,.J-merges").addClass("hidden");
								return false;
							}  
						}
					}],
					search:function(str) {
						var g={};
						if($(".J-tab").hasClass("hidden")){
							g=widget.get("grid");
						}else{
							g=widget.get("grid1");
						}
						g.loading();
						aw.ajax({
							url:"api/medicine/search",
							data:{
								s:str,
								properties:"code,name,specification,status" ,
								fetchProperties:"*,pkMedicine,creator.name"
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
							}
						});
					}
                }
			});
    		this.set("subnav",subnav);
    		
			var tab=new Tab({
				parentNode:".J-tab",
				model:{
					items:[{
						id:"step1",
						title:"待合并药品"
					},{
						id:"step2",
						title:"目的药品"
					}]
				}
			});
			this.set("tab",tab);
        			
            var grid=new Grid({
            	parentNode:".J-grid",
            	url : "api/medicine/query",
            	fetchProperties:"*,pkMedicine,creator.name",
                model:{
                    columns:[{
                    	key:"code",
                        name:"编码",
                    },{
                        key:"name",
                        name:"药品名称",
                        format:"detail",
                        formatparams:{
                            key:"detail",
                            handler:function(index,data,rowEle){
                            	data.creator=data.creator.name;
                            	if("Seal"==data.status){
                            		data.status="封存";
                            	}else if("Normal"==data.status){
                            		data.status="正常";
                            	}else {
                            		data.status="暂存";
                            	}
                            	
                            	$(".J-verform1,.J-merges,.J-tab,.J-adds,.J-grid,.J-merge,.J-subnav-search-search,.J-refresh").addClass("hidden");
    							$(".J-verform2,.J-return").removeClass("hidden");
                            	widget.get("verform2").setData(data);
                            }
                       }
                    },{
						key:"specification",
						name:"规格",
					},{
						key:"status",
						name:"状态",
						format:function(value,row){
							if(value=="Normal"){
								return "正常";
							}if(value=="Temporary"){
								return "暂存";
							}if(value=="Seal"){
								return "封存";
							}
						}
					},{
						key:"status",
						name:"操作",
						format:function(value,row){
							if(value=="Normal" || value=="Temporary"){
								var ret1 = "<div>" +  
    	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-edit btn btn-xs' ><i class='icon-edit' ></i></a>" +  
    	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-delete btn btn-xs' ><i class='icon-remove' ></i></a>" +  
    	                            "<a style='margin-left:5px;color:white;background:#f34541' href='javascript:void(0);' class='J-seal btn btn-xs' ><i class='icon-briefcase' ></i></a>" +  
    	                            "</div>";
								return ret1;  
							}else{
								 var ret = "<div>" + 
								 	"<a style='margin-left:5px;color:white;background:green' href='javascript:void(0);' class='J-seal btn btn-xs' ><i class='icon-briefcase' ></i></a>" +  
    	                            "</div>"; 
								 return ret;  
							}
    					}
					}]
				}
            });
            this.set("grid",grid);
                    
            var verform = new Verform({
                parentNode:".J-verform1",
                saveaction:function(){
                	aw.saveOrUpdate("api/medicine/save",$("#medicine").serialize(),function(data){
                		widget.get("grid").refresh();
           					$(".J-verform1,.J-return,.J-tab,.J-merges").addClass("hidden");
							$(".J-adds,.J-subnav-search-search,.J-grid,.J-merge,.J-refresh").removeClass("hidden");
                    	});
                    },
                    model:{
    					id:"medicine",
    					items:[{
    						name:"pkMedicine",
    						type:"hidden",
    					},{
    						name:"version",
    						type:"hidden",
    						defaultValue:"0"
    					},{
    						name:"code",
    						label:"药品编码"
    					},{
    						name:"name",
    						label:"药品名称",
    						validate:["required"]
    					},{
    						name:"generalName",
    						label:"通用名"
    					},{
    						name:"specification",
    						label:"规格",
    						validate:["required"]
    					},{
    						name:"manufacturer",
    						label:"厂家"
    					},{
    						name:"status",
    						type:"hidden",
    						defaultValue:"Normal"
    					},{
    						name:"statusText",
    						label:"状态",
    						defaultValue:"正常",
    						readonly:true
    					},{
    						name:"useType",
    						label:"用途",
    						type:"textarea",
    						height:100
    					},{
    						name:"road",
    						label:"途径",
    					    type:"textarea",
    					},{
    						name:"description",
    						label:"描述",
    						type:"textarea",
    					},{
    						name:"creator",
    						value:"pkUser",
    						type:"hidden",
    					}]
    				},
                  //取消按钮
	   				 cancelaction:function(){
	   					$(".J-verform1,.J-return,.J-tab,.J-merges").addClass("hidden");
						$(".J-adds,.J-subnav-search-search,.J-grid,.J-merge,.J-refresh").removeClass("hidden");
	   				 }
            	});
            	this.set("verform",verform);
                    
		        var verform2 = new Verform({
		            parentNode:".J-verform2",
		            model:{
						id:"medicine",
						items:[{
							name:"pkMedicine",
							type:"hidden"
						},{
							name:"code",
							label:"药品编码"
						},{
							name:"name",
							label:"药品名称"
						},{
							name:"specification",
							label:"规格"
						},{
							name:"manufacturer",
							label:"厂家"
						},{
							name:"creator",
							label:"负责人"
						},{
							name:"status",
							label:"状态"
						},{
							name:"useType",
							label:"用途",
							type:"textarea"
						},{
							name:"road",
							label:"途径"
						},{
							name:"description",
							label:"描述"
						}]
					}
		        });
		        verform2.setDisabled(true);
		        this.set("verform2",verform2);
            
			//卡片1
				var grid1=new Grid({
					parentNode:"#step1",
					url : "api/medicine/query",
					fetchProperties:"*,pkMedicine,creator.name",
					model:{
						isCheckbox:true,
						columns:[{
							key : "code",
							name : "药品编号",
						},{
							key : "name",
							name : "药品名称",
						},{
							key:"specification",
							name:"规格",
						},{
							key : "manufacturer",
							name : "厂家",
						},{
							key:"status",
							name:"状态",
							format:function(value,row){
								if(value=="Normal"){
									return "正常";
								}if(value=="Temporary"){
									return "暂存";
								}if(value=="Seal"){
									return "封存";
								}
							}
						}],
					},
				});
				this.set("grid1",grid1);
			
			//卡片2
				var grid2=new Grid({
					parentNode:"#step2",
					model:{
						isRadiobox:true,
						columns:[{
							key : "code",
							name : "药品编号",
						},{
							key : "name",
							name : "药品名称",
						},{
							key:"specification",
							name:"规格",
						},{
							key : "manufacturer",
							name : "厂家",
						},{
							key:"status",
							name:"状态",
							format:function(value,row){
								if(value=="Normal"){
									return "正常";
								}if(value=="Temporary"){
									return "暂存";
								}if(value=="Seal"){
									return "封存";
								}
							}
						}]
					}
				});
				this.set("grid2",grid2);
			}
    	});
    	module.exports = Medicine;
});