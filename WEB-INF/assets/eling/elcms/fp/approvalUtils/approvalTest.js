 define(function(require,exports,module){
	var aw = require("ajaxwrapper");
	var Grid = require("grid-1.0.0");
	var ELView=require("elview"); 
	var approvalUtils = ELView.extend({
		attrs : {
			parentNode : ".J-approval"
		},
        initComponent:function(params,widget){
        	var a  =$("<button></button>");
        	a.addClass("J-test").addClass("btn-danger").css({
        		"margin-left" : "300px"
        	});
        	a.text("审批");
        	$("body").append(a);
        	$(".J-test").on("click",function(){
				aw.ajax({ 
					url:"api/approval/approvalTest",
					data:{
						"modelId":widget.get("params").modelId,
						"modelClass":widget.get("params").modelClass,
					},
					dataType:"json",
					success:function(data){}
				})
			
        	});
        }
	})
	module.exports=approvalUtils;
})


