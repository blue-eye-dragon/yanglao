//1.new Grid()
//2.隐藏这个grid
//3.要提供hide喝show方法
//要提供一个根据参数刷新列表的方法
define(function(require,exports,module){
	var aw = require("ajaxwrapper");
	var Grid = require("grid-1.0.0");
	var comp={};
	var NewmemberGrid={
		init:function(){
            //渲染grid
            //列表
            var grid=new Grid({	 
            	parentNode:".J-newmemberGrid",
            	autoRender:false,
                model:{
				 columns:[{
						key : "member",
						name : "姓名",
						format:function(value,row){
							return value ? value.personalInfo.name : "";
						}
                    },{
						key:"member",
						name : "房号",
						format:function(value,row){
							return value ? value.memberSigning.room.number : "";
						}
                    },{
                    	key:"member",
						name : "年龄",
						format:function(value,row){
							return value ?moment().diff(value.personalInfo.birthday,"year") : "";
						}
                    },{
						key : "member",
						name : "电话",
						format:function(value,row){
							return value ? value.personalInfo.phone : "";
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
	module.exports=NewmemberGrid;
});