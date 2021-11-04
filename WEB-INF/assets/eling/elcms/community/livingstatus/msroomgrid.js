//1.new Grid()
//2.隐藏这个grid
//3.要提供hide喝show方法
//要提供一个根据参数刷新列表的方法
define(function(require,exports,module){
	var aw = require("ajaxwrapper");
	var Grid = require("grid-1.0.0");
	var comp={};
	var MSRoomGrid={
		init:function(){
            //渲染grid
            //列表
            var grid=new Grid({	 
            	parentNode:".J-msroomGrid",
            	autoRender:false,
                model:{
				 columns:[{
						key: "room.number",
						name : "房间号",
                    },{
						key:"room.telnumber",
						name : "房间电话",
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
	module.exports=MSRoomGrid;
});