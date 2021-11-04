define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav = require("subnav"); 
	var Form =require("form");
	var aw = require("ajaxwrapper");
	var Dialog = require("dialog");
	var store = require("store");
	var activeUser = store.get("user");
	var fetchProperties = "pkHotelDisplay,createTime,creator.pkUser,creator.name," +
			"speed," +
			"carousel1," +
			"carousel2," +
			"carousel3," +
			"carousel4," +
			"carousel5," +
			"carousel6," +
			"normalDoubleRoom," +
			"richDoubleRoom," +
			"normalSuite," +
			"richSuite," +
			"presidentialSuite," +
			"version";
	var HotelDisplay = ELView.extend({
		attrs:{
        	template:"<div class='el-hoteldisplay'>" +
        			"<div class='J-subnav'></div>" +
        			"<div class='J-form'></div>" +
        			"</div>"
        },
        events:{
		},  
        initComponent:function(params,widget){
	        	var subnav=new Subnav({
	        		parentNode:".J-subnav",
	        		model:{
						title:"酒店显示屏"
					}
	        	});
	        this.set("subnav",subnav);
	        
	        var form=new Form({
	    		 parentNode:".J-form",
	 			 model:{
					id:"hoteldisplay",
					saveaction : function() {
	        			aw.saveOrUpdate("api/hoteldisplay/save",$("#hoteldisplay").serialize(),function(data){
	        				Dialog.alert({
                        		title:"提示",
                        		content:"保存成功！"
                        	});
							widget.get("form").setData(data);
							return false;
						});
					 },
					 cancelaction:function(){
						 
					 },
					items:[{
						name:"pkHotelDisplay",
						type:"hidden"
					},{
						name:"version",
						defaultValue:"0",
						type:"hidden"
					},{
						name:"creator",
	    				type:"select",
	    				keyField:"pkUser",
	    				valueField:"name",
	    				readonly:true,
	    				options:[activeUser],
	    				defaultValue:activeUser.pkUser+"" ,
	    				label:"创建人"
					},{
						name:"createTime",
						label:"创建时间",
						type:"date",
	    				defaultValue:moment().format("YYYY-MM-DD"),
						validate:["required"]
					},{
						name : "speed",
		                label : "滚屏速度（秒）",
		                placeholder :"有效范围1~3600",
		                validate:["required"],
		                exValidate : function(value){
							if(isNaN(value)){
								return "请输入合适的秒数";
							}else{
								if(value > 3600 || value < 1){
									return "请输入合适的秒数";
								}
								return true;
							}
						}
					},{
						name : "carousel1",
		                label : "轮播1"
					},{
						name : "carousel2",
		                label : "轮播2"
					},{
						name : "carousel3",
		                label : "轮播3"
					},{
						name : "carousel4",
		                label : "轮播4"
					},{
						name : "carousel5",
		                label : "轮播5"
					},{
						name : "carousel6",
		                label : "轮播6"
					},{
		                name : "normalDoubleRoom",
		                label : "标准双人间"
			        },{
		                name : "richDoubleRoom",
		                label : "豪华双人间"
			        },{
		                name : "normalSuite",
		                label : "标准套间"
			        },{
		                name : "richSuite",
		                label : "豪华套间"
			        },{
		                name : "presidentialSuite",
		                label: "总统套"
			        }]
				 }
	        });
	        this.set("form",form);
        },
        afterInitComponent:function(params,widget){
        	aw.ajax({
				url : "api/hoteldisplay/query",
				type : "POST",
				data : {
					fetchProperties:fetchProperties,
				},
				success:function(data){
					var form =widget.get("form");
					if(data.length > 0){
						form.setData(data[0]);
					} 
				}
			})
        }
	})
	module.exports = HotelDisplay;
	});