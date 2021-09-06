define(function(require,exports,module){
	var ELView =require("elview");
	var template = require("./salestatus.tpl");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var aw = require("ajaxwrapper");
	require("mixitup");
	
	require("./salestatus.css");
	
	var SaleStatus = ELView.extend({
		attrs:{
			template:template,
			model:{
				datas:[],
				buildingDatas:[],
				status:[{
					key:"Empty",
					value:"空房",
					icon:"icon-lock",
					checked:true
				},{
					key:"Waitting",
					value:"预入住",
					icon:"icon-signin"
				},{
					key:"InUse",
					value:"使用中",
					icon:"icon-user"
				},{
					key:"Occupy",
					value:"占用",
					icon:"icon-ban-circle"
				},{
					key:"Appoint",
					value:"已预约",
					icon:"icon-pushpin"
				},{
					key:"NotLive",
					value:"选房不住",
					icon:"icon-building"
				},{
					key:"OutRoomMaintenance",
					value:"退房维修",
					icon:"icon-gears",
					checked:true
				}]
			}
		},
		events:{
			"mouseover .J-backToRentTag":function(e){
				$(".tip").css('display','block');
			},
			"mouseout .J-backToRentTag":function(e){
				$(".tip").css('display','none');
			},
			"click .J-salestatus-building" : function(e){
				$(window).scrollTop(0);
				this.set("mark",0);
				var pkBuilding = $(e.target).attr("data-key");
				this.get("subnav").setTitle("销售全景："+$(e.target).text());
				this.loadBuildingData({building: pkBuilding},this);
			},
			"click .J-status-check" : function(e){
				//如果勾选的是全部,判断是否全部勾选
				if($(e.target).attr("data-key") == "all"){
					if($(e.target).prop("checked")){
						//全选
						$(".J-status-check").prop("checked","checked");
					}else{
						//全不选	
						$(".J-status-check").removeAttr("checked");
					}
				}else{
					//如果勾选的是单个状态,判断是否全部勾选
					if($(".J-status-item-check:checked").size()==7){
						//全选
						$(".J-status-check[data-key=all]").prop("checked","checked");
					}else{
						//全不选	
						$(".J-status-check[data-key=all]").removeAttr("checked");
					}
				}
				var filter = "";
				$(".J-status-check:checked").each(function(i,el){
					filter+="."+$(el).attr("data-key")+",";
				});
				$('.J-salestatus-content').mixItUp("filter", filter.substring(0,filter.length-1));
			},
			"click .J-status-btn" : function(e){
				var el = $(e.target);
				if(el.is("i")){
					el = el.parents(".J-status-btn");
				}
				el.prev(".J-status-check").click();
			},
			"click .J-salestatus-room" : function(e){
				if(this.get("subnav").getValue("status")!="OutRoomMaintenance"){
					if($(".J-salestatus-content").hasClass("hidden")){
						//如果是某个楼的页面隐藏，证明是从全部的页面跳过来的
						this.set("mark","0");
					}else{
						this.set("mark","1");
					}
					this.show(".J-salestatus-grid").hide([".J-salestatus-content",".J-salestatus-total-content"]);
					this.get("subnav").hide(["status"]).show(["return"]);
					this.loadGridData({
						pkRoom:$(e.target).attr("data-key")
					})
				}
			}
		},
		initComponent:function(params,widget){
			var subnav = new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"销售全景",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							if(widget.get("mark") == "0"){
								//返回到全部页面
								widget.show(".J-salestatus-total-content").hide([".J-salestatus-content",".J-salestatus-grid"]);
								var subnav = widget.get("subnav");
								subnav.show(["status"]).hide(["return"]);
								subnav.setTitle("销售全景");
							}else{
								widget.hide([".J-salestatus-total-content",".J-salestatus-grid"]).show(".J-salestatus-content");
								widget.set("mark","0");
							}
						}
					}],
					buttonGroup:[{
						id:"status",
						items:widget.get("model").status,
						handler:function(key,element){
							widget.loadData(); //TODO 
						}
					}]
				}
			});
			this.set("subnav",subnav);
			
			var grid = new Grid({
				parentNode:".J-salestatus-grid",
				autoRender:false,
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"identity.value",
						name:"身份类型"
					},{
						key:"name",
						name:"姓名"
					},{
						key:"sex",
						name:"性别",
						format:function(value,row){
							if (value == "MALE") {
								return "男";
							} else if (value == "FEMALE") {
								return "女"
							} else {
								return "";
							}
						}
					},{
						key:"birthday",
						name:"年龄",
						format:function(value,row){
							if(value){
								return moment().diff(value, 'years');
							}else{
								return "";
							}
						}
					},{
						key:"tel",
						name:"联系电话"
					}]
				}
			});
			this.set("grid",grid);
		},
		afterInitComponent:function(params,widget){
			this.loadData();
			$('.J-salestatus-content').mixItUp();
		},
		loadData:function(){
			var that = this;
			var subnav = this.get("subnav");
			var status = subnav.getValue("status");
			aw.ajax({
				url:"api/room/query",
				data:{
					fetchProperties : "*,building.pkBuilding,building.name",
					status: status,
					useType:"Apartment"
				},
				success:function(data){
					that.setRoomBackToRentTag(data,1,null);
				}
			});
		},
		setIcon : function(data){
			var status = this.get("model").status;
			var i,map = {};
			for(i = 0;i < status.length;i++){
				map[status[i].key] = status[i].icon;
			}
			for(i = 0;i < data.length;i++){
				var status = data[i].status.key;
				data[i].icon = map[status];
			}
		},
		//为回租的房间设置一个标记
		setRoomBackToRentTag : function(datas,flag,widget){
			var that = this;
			aw.ajax({
				url:"api/membershiproomrecycling/query",
				data:{
					fetchProperties : "room.pkRoom,room.name,room.building.pkBuilding,room.building.name",
				},
				success:function(result){
					//存在回租的房间
					if(result.length>0){
						for(var i=0;i<datas.length;i++){
							for(var j=0;j<result.length;j++){
								if(datas[i].pkRoom==result[j].room.pkRoom){
									datas[i].backToRentTag = true;
								}
							}
						}
					}
					if(flag==1){
						that.setData(datas);
					}
					if(flag==2){
						var model = widget.get("model");
						model.buildingDatas = datas;
						widget.renderPartial(".J-salestatus-content");
						$('.J-salestatus-content').mixItUp('filter', '.Empty,.OutRoomMaintenance');
					}
				}
			});
		},
		setData:function(data){
			var buildingMap = {};
			this.setIcon(data);
			for(var i=0;i<data.length;i++){
				var pkBuilding = data[i].building.pkBuilding;
				if(!buildingMap[pkBuilding]){
					buildingMap[pkBuilding]={
						pkBuilding : pkBuilding,
						name : data[i].building.name,
						items:[]
					};
				}
				buildingMap[pkBuilding].items.push(data[i]);
			}
			this.get("model").datas = buildingMap;
			this.renderPartial(".J-salestatus-total-content");
		},
		loadBuildingData:function(params,widget){
			var param = {
				fetchProperties : "*,building.pkBuilding,building.name"
			}
			if(params){
				param = $.extend(true, param,params);
			}
			aw.ajax({
				url:"api/room/query",
				data:param,
				success:function(data){
					widget.hide([".J-salestatus-total-content",".J-salestatus-grid"]).show(".J-salestatus-content");
					widget.get("subnav").hide(["status"]).show(["return"]);
					widget.setIcon(data);
					widget.setRoomBackToRentTag(data,2,widget);
				}
			});
		},
		loadGridData:function(params){
			var grid=this.get("grid");
			params.fetchProperties = "list",
			grid.loading();
			aw.ajax({
				url:"api/marketingcontrol/query",
				data:params,
				dataType:"json",
				success:function(data){
					var cardNO = data.cardNO ? "会籍卡："+data.cardNO : "";
					var roomNO = data.roomNO ? "房间："+data.roomNO : "";
					var checkInDate = data.checkInDate ? "入住时间："+moment(data.checkInDate).format("YYYY-MM-DD") : "";
					var memberShipContractDate = data.memberShipContractDate ? "会籍签约时间："+moment(data.memberShipContractDate).format("YYYY-MM-DD") : "";
					grid.setTitle(cardNO+"  "+roomNO+"  "+checkInDate+"  "+memberShipContractDate);
					grid.setData(data.list);
				}
			});
		}
	});
	
	module.exports = SaleStatus;
});