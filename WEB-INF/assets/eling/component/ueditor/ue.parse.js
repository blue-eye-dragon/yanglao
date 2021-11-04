define(function(require,exports,module){
	require("eling.ueditor.parse");
	
	var UEditorUtil={
	    //替换背景图片
		locationHostCtx: "{{location_host_ctx}}",
		
		setContent:function(selector){
			var contents;
            if(document.querySelectorAll){
                contents = document.querySelectorAll(selector)
            }else{
                if(/^#/.test(selector)){
                    contents = [document.getElementById(selector.replace(/^#/,''))]
                }else if(/^\./.test(selector)){
                    var contents = [];
                    utils.each(document.getElementsByTagName('*'),function(node){
                        if(node.className && new RegExp('\\b' + selector.replace(/^\./,'') + '\\b','i').test(node.className)){
                            contents.push(node)
                        }
                    })
                }else{
                    contents = document.getElementsByTagName(selector);
                }
            }
            
            contents[0].innerHTML = this.replaceContent(contents[0].innerHTML);
            
		},
		
	    replaceContent: function(contentHtml) {
	        var ctx = localStorage.getItem("ctx");
			ctx = location.protocol + "//" + location.host + ctx;
			var contentHtml = contentHtml.replace(this.locationHostCtx, ctx);
			return contentHtml;
	    },
		UEParse : function(selector,options){
			this.setContent(selector);
			uParse(selector,options);
		}
	};
	
	module.exports = UEditorUtil;
});