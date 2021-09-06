//1.new Grid()
//2.隐藏这个grid
//3.要提供hide喝show方法
//要提供一个根据参数刷新列表的方法
define(function(require,exports,module){
	var aw = require("ajaxwrapper");
	var Grid = require("grid-1.0.0");
	var comp={};
	var MemberGrid={
		init:function(){
            //渲染grid
            //列表
            var grid=new Grid({	 
            	parentNode:".J-memberGrid",
            	autoRender:false,
                model:{
				 columns:[{
						key : "personalInfo",
						name : "姓名",
						format:function(value,row){
							return value ? value.name : "";
						}
                    },{
						key:"memberSigning",
						name : "房号",
						format:function(value,row){
							return value ? value.room.number : "";
						}
                    },{
                    	key:"personalInfo",
						name : "年龄",
						format:function(value,row){
							return value ?moment().diff(value.birthday,"year") : "";
						}
                    },{
						key : "personalInfo",
						name : "电话",
						format:function(value,row){
							return value ? value.phone : "";
						}
                    }]
				}
            });
            grid.loading();
            comp=grid;
		},
		refresh:function(params){
			comp.loading();
			aw.ajax({
			  url:params.url,
			  dataType:"json",
			  data:params.params,
				success:function(data){
					comp.setData(data);
				}
			});
		},
		destroy:function(){
			comp.destroy();
		}
	};
	module.exports=MemberGrid;
});