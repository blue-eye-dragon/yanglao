define(function(require, exports, module) {
	var ELView=require("elview");
	var aw = require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");
	var Grid=require("grid-1.0.0");
	var Verform=require("form");
	var template="<div class='J-subnav'></div>"+
	 "<div class='J-grid'></div>"+
	 "<div class='J-verform hidden'></div>";

    var accompanyhospitalize = ELView.extend({
        attrs:{
                template:template
        },
		events:{
			"click .J-edit":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				this.get("verform").setData(data);
				$(".J-grid,.J-add").addClass("hidden");
				$(".J-verform,.J-return").removeClass("hidden");
			},
			"click .J-delete":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				aw.del("api/accompanyhospitalizeflowderfine/" + data.pkAccompanyHospitalizeFlowdeFine + "/delete",function(data){
					grid.refresh();
				});
			},
			"click .J-seal":function(e){
				var grid=this.get("grid");
				var index=grid.getIndex(e.target);
				var data=grid.getSelectedData(index);
				aw.saveOrUpdate("api/accompanyhospitalizeflowderfine/" + data.pkAccompanyHospitalizeFlowdeFine + "/seal",data,function(data){
					grid.refresh();
				});
			}
		},
        initComponent:function(params,widget){
            var subnav=new Subnav({
            	parentNode:".J-subnav",
            	model:{
					title:"集体陪同就医流程设置",
					buttons:[{
						id:"add",
						text:"新增",
						handler:function(){
							widget.get("verform").reset();
							$(".J-add,.J-grid").addClass("hidden");
							$(".J-verform,.J-return").removeClass("hidden");
							return false;
						}
					},{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							$(".J-return,.J-verform").addClass("hidden");
							$(".J-grid,.J-add").removeClass("hidden");
							return false;
						}
					}]
                }
			});
			this.set("subnav",subnav);
    			
            var grid=new Grid({
            	 parentNode:".J-grid",
            	 url : "api/accompanyhospitalizeflowderfine/query",
            	 fetchProperties:"*,role.name,returnPerson.name",
            	 model:{
            		 columns:[{
						key:"name",
						name:"名称"
					},{
						key:"role.name",
						name:"角色"
					},{
						key:"returnPerson.name",
						name:"回退人"
					},{
						key:"ranking",
						name:"流程順序"
					},{
						key:"sealed",
						name:"操作",
						format:function(value,row){
							if(value==false){
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
                parentNode:".J-verform",
                saveaction:function(){
                	aw.saveOrUpdate("api/accompanyhospitalizeflowderfine/save",$("#accompanyhospitalizeflowderfine").serialize(),function(data){
                		widget.get("grid").refresh();
       					$(".J-verform,.J-return").addClass("hidden");
						$(".J-add,.J-grid").removeClass("hidden");
                	});
                },
                //取消按钮
  				cancelaction:function(){
  					$(".J-verform,.J-return").addClass("hidden");
  					$(".J-add,.J-grid").removeClass("hidden");
  				},
                model:{
                	id:"accompanyhospitalizeflowderfine",
					items:[{
						name:"pkAccompanyHospitalizeFlowdeFine",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"sealed",
						defaultValue:"false",
						type:"hidden"
					},{
						name:"name",
						label:"名称",
						validate:["required"]
					},{
						name:"role",
						label:"参与角色",
						type:"select",
						url:"api/role/query",
						key:"pkRole",
						value:"name",
						validate:["required"]
					},{
						name:"returnPerson",
						label:"回退人",
						type:"select",
						url:"api/user/role",//TODO 用户角色：wulina 社区管理、健康管理
						params:{
        					roleIn:"4,12",
							fetchProperties:"pkUser,name"
						},
						key:"pkUser",
						value:"name",
						validate:["required"]
					},{
						name:"ranking",
						label:"顺序",
						//验证只能输入数字
						validate:["required","floor"]
					}]
                }
            });
            this.set("verform",verform);
        }
    });
    module.exports = accompanyhospitalize;
});