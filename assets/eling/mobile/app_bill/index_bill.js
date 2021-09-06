define(function(require,exports,module){
	
	// 水电电信收费模型
	var Generafee = require("eling/mobile/app_bill/model_generafee");
	
	// 服务费模型
	var Servicefee = require("eling/mobile/app_bill/model_servicefee");
	
	//引入其他模块（关联人）
	var RelativePerson = require("eling/mobile/relativeperson/relativeperson");
	
	//初始化依赖模块（关联人）
	var relativePerson = new RelativePerson();
	
	//定义自定义模块
	var QueryCondition = Backbone.Model.extend({
		initialize : function(){
			//时间范围
			var pickerRange = [];
			for(var i=2000;i<=2100;i++){
				pickerRange.push(i);
			}
			this.set("pickerRange",pickerRange)
		},
		
		defaults : {
			member : relativePerson.getDefault(),
			start : moment().startOf("year").valueOf()
		},
		
		//@test
		getParams_ServiceFee : function(){
			var start = this.get("start");
			return {
				date : start,
				dateEnd : moment(start).endOf("year").valueOf(),
				pkMember : this.get("member").pkMember
			};
		},
		
		//@test
		getParams_GeneraFee : function(){
			var start = this.get("start");
			return {
				pkMember : this.get("member").pkMember,
				feeMonth : start,
				feeMonthEnd : moment(start).endOf("year").valueOf(),
				fetchProperties:"pkGeneralFees," +
					"feeMonth,payer," +
					"memberSigning.room.number," +
					"memberSigning.room.telnumber," +
					"generalFeesDetails.pkGeneralFeesDetail," +
					"generalFeesDetails.fees," +
					"generalFeesDetails.payStatus," +
					"generalFeesDetails.payType," +
					"generalFeesDetails.payDate," +
					"generalFeesDetails.feeType.number," +
					"generalFeesDetails.feeType.name" 
			};
		}
	});
	
	//framework7工具类
	var fw7 = require("f7");
	// 日期处理
	require("moment");
	
	var ELMView = require("elmview");
	
	//利用Backbone.View进行视图扩展
	var app = new ELMView({
		id : "app_bill",
		model : {
			servicefee : new Servicefee.Collection(),
			generafee : new Generafee.Collection(),
			queryCondition : new QueryCondition()
		},
		listener : {
			"reset generafee" : "render_generafee",
			"reset servicefee" : "render_servicefee",
			"change queryCondition" : "reload"
		},
		
		setup : function(widget){
			this.render("view_billlist.html",this.model.queryCondition.get("member"));
		},
		
		initComponent : function(widget){
			var queryCondition = this.model.queryCondition;
			
			Dom7('.panel-left').on('close', function () {
				queryCondition.set("member",relativePerson.getDefault());
			});
			
			this.myPicker = this.app.picker({
			    input: '.open-picker',
			    toolbarCloseText : "完成",
			    cols: [{
			    	values: queryCondition.get("pickerRange")
			    }],
			    value : [moment(queryCondition.get("start")).format("YYYY")],
			    onClose : function(p){
			    	queryCondition.set("start",moment(p.value[0]).startOf("year").valueOf());
			    }
			});  
		},
		
		afterInitComponent : function(widget){
			this.load();
		},
		
		/******************服务器交互********************* */
		load : function(){
			this.getServicefee();
			this.getGenerafee();
		},
		
		reload : function(){
			this.refresh("view_billlist.html",this.model.queryCondition.get("member"));
			this.load();
		},
		
		//@test
		getServicefee : function(){
			this.model.servicefee.fetch({
				reset : true,
				data : this.model.queryCondition.getParams_ServiceFee()
			});
		},
		
		//@test
		getGenerafee : function(){
			this.model.generafee.fetch({
				reset : true,
				data : this.model.queryCondition.getParams_GeneraFee()
			});
		},
		
		/*************格式化数据****************/
		//@test
		getGenerafeeDetail : function(id){
			var ids = id.split("_");
			
			var generaFee = this.model.generafee.get(ids[0]);
			
			var details = generaFee.get("generalFeesDetails");
			
			var detail = _.findWhere(details,{
				pkGeneralFeesDetail : parseInt(ids[1])
			});
			
			detail.feeMonth = generaFee.get("feeMonth");
			
			if(detail.payStatus.key == "UnPaid"){
				detail.notStatus = true;
				detail.payDate = "-";
				detail.payTypeStr = "-";
			}else{
				detail.status = true;
				detail.payDate = moment(detail.payDate).format("YYYY-MM-DD");
				detail.payTypeStr = detail.payType.value;
			}
			detail.memberSigning = generaFee.get("memberSigning");
			
			return detail;
		},
		
		/*************视图**************/
		render_servicefee : function(){
			this.renderPartial("servicefee","view_servicefee.html",{
				servicefee : this.model.servicefee.toJSON()
			});
		},
		
		render_generafee : function(){
			var generafees = this.model.generafee.toJSON();
			for(var i in generafees){
				var generalFeesDetails = generafees[i].generalFeesDetails || [];
				for(var j in generalFeesDetails){
					if(generalFeesDetails[j].payStatus.key == "UnPaid"){
						generafees[i].waitingNum = true;
						break;
					}
				}
				
			}
			this.renderPartial("generafee","view_generafee.html",{
				generafee : generafees
			});
		},
		
		events : {
			"tap .open-picker" : function(){
				this.myPicker.open();
			},
			"tap .J-goback" : function(){
				this.back({
					url : "view_billlist.html"
				});
			},
			"tap .J-bill-item" : function(e){
				
				var detail = this.getGenerafeeDetail(e.currentTarget.id);
				
				this.switchTo("view_billdetail.html",{
					header : moment(detail.feeMonth).format("YYYY年MM月") + detail.feeType.name,
					detail : detail ? detail : {}
				});
			}
		}
	});
	
	return app;
});