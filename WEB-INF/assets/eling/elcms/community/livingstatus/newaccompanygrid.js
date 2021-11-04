//1.new Grid()
//2.隐藏这个grid
//3.要提供hide喝show方法
//要提供一个根据参数刷新列表的方法
		// 新陪住人界面
define(function(require,exports,module){
	var aw = require("ajaxwrapper");
	var Grid = require("grid-1.0.0");
	var comp={};
	var NewAccompanyGrid={
		init:function(){
            //渲染grid
            //列表
            var grid=new Grid({	 
            	parentNode:".J-newaccompanyGrid",
            	autoRender:false,
                model:{
				 columns:[{
						key : "accompanyPeople",
						name : "新陪住人姓名",
						format:function(value,row){
							return value ? value.personalInfo.name : "";
						}
                    },{
						key:"room",
						name : "房号",
						format:function(value,row){
							return value ? value.number : "";
						}
                    },{
						key : "accompanyPeople",
						name : "手机",
						format:function(value,row){
							return value ? value.personalInfo.mobilePhone : "";
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
	module.exports=NewAccompanyGrid;
});