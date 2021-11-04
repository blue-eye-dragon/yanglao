 define(function(require,exports,module){

        var UIComponent = require("uicomponent-2.0.0");

        var template = require("./memberinfoage.tpl");
        
        var Select = require("select");
        
        var age = [];
        for(var i=50;i<=100;i++){
        	age.push({
        		key:i,
        		value:i
        	})
        }

        var CustType = UIComponent.extend({

            attrs : {
                template : template,
                autoRender : true
            },

            setValue : function(value){
            	this.get("startSelect").setValue(value.start);
            	this.get("endSelect").setValue(value.end);
            },
            getValue : function(){
                return{
                	start : $(".J-start .select2-chosen").text(),
                	end : $(".J-end .select2-chosen").text()
                }
            },
            reset : function(){
            	this.get("startSelect").reset();
            	this.get("endSelect").reset();
            },
            setReadonly : function(){
                //必须拥有的接口
            },
            setDisabled : function(){
                //必须拥有的接口
            },
            destroy : function(){
                //可选。如果使用了第三方的插件，则需要在这个方法中销毁
                CustType.superclass.destroy.call(this,arguments);
            },
            afterRender:function(params,widget){
            	var startSelect = new Select({
            		  parentNode : ".J-start",
                      model : {
                          id : "start",
                          type : "select",
                          label : "起始年龄",
                          options : age
                      }
            	});
            	this.set("startSelect",startSelect);
            	
            	var endSelect = new Select({
          		  parentNode : ".J-end",
                    model : {
                        id : "end",
                        type : "select",
                        label : "最大年龄",
                        options : age
                    }
            	});
            	this.set("endSelect",endSelect);
    		}
        });

        module.exports = CustType;
    });
                        