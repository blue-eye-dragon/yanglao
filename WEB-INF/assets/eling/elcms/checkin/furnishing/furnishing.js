define(function(require, exports, module) {
	var BaseView=require("baseview");
	var aw = require("ajaxwrapper");
	//多语
	var i18ns = require("i18n");
	var FurnishCollection=require("./collections/furnishing_collection");
	var FurnishGridView=require("./view/furnishing_grid_view");
	
	require("./furnishing.css");
	
	var Company = BaseView.extend({
		initSubnav:function(widget){
			return {
				model:{ 
					title:"入住固定资产确认",
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							$(".J-return").addClass("hidden");
							$(".J-save").addClass("hidden");
							$(".currentGird").removeAttr("data-key");
							$(".el-furnishing").removeAttr("class").addClass("el-furnishing").addClass("list");
							return false;
						}
					},{
						id:"save",
						text:"保存",
						show:false,
						handler:function(){
							$(".J-save").addClass("hidden");
							$(".J-return").addClass("hidden");
							var assetCards = "1=1";
							$("input[name='assetCards']").each(function(){
								if ($(this).is(':checked')) {
									assetCards += "&assetCards=" + $(this).attr("pkAssetCard");
								}
							});
							aw.ajax({
								url:"api/checkinfurnishing/save?" + assetCards,
								data:{
									pkCIFurnishing:$(".currentGird").attr("data-key"),
									version:$(".J-version").attr("data-version")
								},
								success:function(){
									widget.get("list").refresh();
									$(".el-furnishing").removeAttr("class").addClass("el-furnishing").addClass("list");
									return false;
								}
							});
						}
					}],
					buttonGroup:[{
						id:"handle",
						items:[{
							key:"",
		                    value:"全部"
						},{
		                    key:"Confirmed",
		                    value:"已确认"
						},{
		                    key:"UnConfirmed",
		                    value:"未确认"
						}],
						handler:function(key,element){
							widget.get("list").refresh();
						}
					}]
				}
			};
		},
		initList:function(widget){
			return {
				url : "api/checkinfurnishing/query",
				params:function(){
					return {
						status:widget.get("subnav").getValue("handle"),
						fetchProperties:"*,memberSigning.members.personalInfo.name,memberSigning.room.*," +
							"checkInFurinshing.*,checkInFurinshing.confirmUser.*"
					};
				},
				model:{
					columns:[{
						key:"memberSigning.room.number",
						name:"房间号",
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								toGrid(data);
							}
						}]
					},{
						key:"checkInDate",
						name:"入住时间",
						format:"date"
					},{
						key:"memberSigning",
						name:i18ns.get("sale_ship_owner","会员")+"1",
						format:function(value,row){
							if(!value || value.members[0]==null){
								return "";
							}
							return value.members[0].personalInfo.name;
						}
					},{
						key:"memberSigning",
						name:i18ns.get("sale_ship_owner","会员")+"2",
						format:function(value,row){
							if(!value || value.members[1]==null){
								return "";
							}
							return value.members[1].personalInfo.name;
						}
					},{
						key:"checkInFurinshing.confirmUser.name",
						name:"确认人"					},{
						key:"checkInFurinshing.confirmDate",
						name:"确认时间",
						format:"date"
					},{
						name:"操作",
						format:"button",
						formatparams:[{
							key:"operate",
							text:"确认",
							handler:function(index,data,rowEle){
								toGrid(data);
							}
						}]
					}]
				}
			};
		}
	});
	module.exports = Company;
	
	function toGrid(data) {
		var furnish_collection = new FurnishCollection(); 
		var furnish_grid_view = new FurnishGridView(furnish_collection);
		$(".currentGird").attr("data-key", data.checkInFurinshing.pkCIFurnishing);
		$(".J-version").attr("data-version", data.checkInFurinshing.version);
		furnish_collection.fetch({
			reset:true,
			data:{
				"pkRoom":data.memberSigning.room.pkRoom, 
				fetchProperties:"*", 
			},
			success:function(){
				$(".J-return").removeClass("hidden");
				$(".J-save").removeClass("hidden");
				$(".el-furnishing").removeClass("list").addClass("grid");
			}
		});
	}
});