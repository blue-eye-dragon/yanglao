define(function(require, exports, module) {
	var ELView=require("elview");
	var aw=require("ajaxwrapper");
	var Subnav = require("subnav-1.0.0");
	var Grid = require("grid-1.0.0");
	var Verform=require("form-2.0.0")
	var Dialog = require("dialog-1.0.0");
	//多语
	var i18ns = require("i18n");
	var template="<div class='J-subnav'></div>"+
		"<div class='J-list'></div>"+
		"<div class='J-card hidden'>"+
		"<div class='J-orgCardownerForm hidden'></div>"+
		"<div class='J-recommendPeopleForm hidden'></div>"+
		"</div>";
	var Organpeople = ELView.extend({
		attrs:{
			template:template
		},
		events : function(){
			var that=this;
			function grid2form(ele,formName,url){
				var form=that.get(formName);
				var f=formName;
				if(url){
					if(f=="recommandForm"){
						aw.ajax({
							url:url,
							data:{
								fetchProperties:"*,community.pkCommunity,community.name,nativePlace.id,nativePlace.name,nativePlace.code,"
							},
							dataType:"json",
							success:function(data){
								data.pkMembershipContract=$(ele.target).attr("data-contract");
								form.setData(data);
								form.setDisabled(true);
								$(".J-card,.J-return,.J-edit").removeClass("hidden");
								$(".J-list").addClass("hidden");
							}
						});
					}
					else{
						aw.ajax({
							url:url,
							dataType:"json",
							success:function(data){
								data.pkMembershipContract=$(ele.target).attr("data-contract");
								form.setData(data);
								form.setDisabled(true);
								$(".J-card,.J-return,.J-edit").removeClass("hidden");
								$(".J-list").addClass("hidden");
							}
						});
					}
				}else{
					var data={
						"pkMembershipContract" : $(ele.target).attr("data-contract")	
					};
					form.setData(data);
					$(".J-card,.J-return,.J-edit").removeClass("hidden");
					$(".J-list").addClass("hidden");
				}
			}
			return {
				"click .J-orgCardowner":function(ele){
					$(".J-orgCardownerForm").removeClass("hidden");
					$(".J-recommendPeopleForm,.J-subnav-search-search").addClass("hidden");
					if($(ele.target).attr("id")){
						grid2form(ele,"orgCardownerForm","api/orgCardowner/queryByPK/"+$(ele.target).attr("id"));
					}else{
						grid2form(ele,"orgCardownerForm","");
					}
					
					return false;
				},
				"click .J-recommendPeople":function(ele){
					$(".J-recommendPeopleForm").removeClass("hidden");
					$(".J-orgCardownerForm,.J-subnav-search-search").addClass("hidden");
					if($(ele.target).attr("id")){
						grid2form(ele,"recommandForm","api/recommendpeople/queryByPK/"+$(ele.target).attr("id"));
					}else{
						grid2form(ele,"recommandForm","");
					}
					return false;
				}
			};
		},
		initComponent : function(params,widget) {
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"机构权益人档案",
					search:true,
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							$(".J-list,.J-subnav-search-search").removeClass("hidden");
							$(".J-card,.J-orgCardownerForm,.J-recommendPeopleForm,.J-return,.J-edit").addClass("hidden");
							return false;
						}
					},{
						id:"edit",
						text:"编辑",
						show:false,
						handler:function(){
							if($(".J-orgCardownerForm").hasClass("hidden")){								//编辑推荐人
								widget.get("recommandForm").setDisabled(false);
							}else{
								//编辑机构权益人
								widget.get("orgCardownerForm").setDisabled(false);
							}
							return false;
						}
					},{
						id:"gotoSign",
						text: i18ns.get("sale_ship_contract","会籍签约"),
						handler:function(){
							widget.openView({
								url:"eling/elcms/sale/membershipcontract/membershipcontract"
							});
						}
					}]
				}
			});
			
			var grid=new Grid({
				autoRender:false,
				url:"api/membershipcontract/query",
				fetchProperties:"*,membershipCards.name,orgCardowner.name,recommendPeople.name",
				params:{
					cardownerType : "ORGANIZATIONAL"
				},
				model:{
					columns:[{
						key:"contractNo",
						name:"合同号"
					},{
						key:"membershipCards",
						name:i18ns.get("sale_card_name","会籍卡号"),
						format:function(value,row){
							var cards=value || [];
							var ret="";
							for(var i=0;i<cards.length;i++){
								ret+="<div>"+cards[i].name+"</div>";
							}
							return ret;
						}
					},{
						key:"orgCardowner",
						name:"权益人",
						format:function(value,row){
							var text=value ? value.name : "待录入";
							var color=value ? "#f34541" : "rgb(141, 128, 128)";
							var key=value ? value.pkOrganizationalCardowner : "";
							var contract=row.pkMembershipContract;
							return "<a id='"+key+"' data-contract='"+contract+"' href='javascript:void(0);' style='color:"+color+";' class='J-orgCardowner'>"+text+"</a>";
						}
					},{
						key:"membershipCards",
						name:"持卡数量",
						format:function(value,row){
							return value.length;
						}
					},{
						key:"recommendPeople",
						name:"推荐人",
						format:function(value,row){
							var text=value ? value.name : "待录入";
							var color=value ? "#f34541" : "rgb(141, 128, 128)";
							var key=value ? value.pkRecommendPeople : "";
							var contract=row.pkMembershipContract;
							return "<a id='"+key+"' data-contract='"+contract+"' href='javascript:void(0);' style='color:"+color+";' class='J-recommendPeople'>"+text+"</a>";
						}
					}]
				}
			});
			var params=this.get("params") || {
				pkMembershipContract:""
			};
			params.cardownerType="ORGANIZATIONAL";
			grid.refresh(params);
			var verform1=new Verform({
				parentNode:".J-orgCardownerForm",
				saveaction:function(){
					aw.saveOrUpdate("api/orgCardowner/save",$("#orgCardownerForm").serialize(),function(){
						widget.hide([".J-return",".J-edit",".J-card"]).show([".grid",".J-list",".J-subnav-search-search"]);
						widget.get("grid").refresh();
					});
					return false;
				},
				//取消按钮
  				cancelaction:function(){
  					$(".J-list,.J-subnav-search-search").removeClass("hidden");
					$(".J-card,.J-orgCardownerForm,.J-recommendPeopleForm,.J-return,.J-edit").addClass("hidden");
					return false;
  				},
				model:{
					id:"orgCardownerForm",
					items:[{
						name:"pkMembershipContract",
						type:"hidden"
					},{
						name:"pkOrganizationalCardowner",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"name",
						label:"机构名称",
						validate:["required"]
					},{
						name:"nature",
						label:"机构性质",
						type:"radiolist",
						list:[{
							key:"AdministritiveOrgans",
							value:"行政机关"
						},{
							key:"Institution",
							value:"事业单位"
						},{
							key:"EnterpriseUnits",
							value:"企业单位"
						},{
							key:"SocialGroup",
							value:"社会团体"
						}],
						validate:["required"]
					},{
						name:"legalRepresentative",
						label:"法人代表",
						validate:["required"]
					},{
						name:"zipCode",
						label:"机构邮编",
						validate:["required","postalcode"]
					},{
						name:"address",
						label:"机构地址",
						type:"textarea",
						validate:["required"]
					},{
						name:"contactName",
						label:"机构联系人",
						validate:["required"]
					},{
						name:"contactPhone",
						label:"机构联系人电话",
						validate:["required"]
					},{
						name:"contactZipCode",
						label:"机构联系人邮编",
						validate:["required","postalcode"]
					},{
						name:"contactEmail",
						label:"机构联系人email",
						validate:["required","email"]
					},{
						name:"contactAddress",
						label:"机构联系人地址",
						validate:["required"],
						type:"textarea"
					}]
				}
			});
			
			var verform2=new Verform({
				parentNode:".J-recommendPeopleForm",
				saveaction:function(){
					var data=$("#recommendPeople").serializeArray();
					var birthday = widget.get("recommandForm").getValue("birthday");	
					if(birthday!=""&&moment(birthday).isAfter(moment(), 'day')){
						Dialog.alert({
							content:"出生年月不能大于当前日期！"
				    	});
						return;
					}
					aw.saveOrUpdate("api/recommendpeople/save",$("#recommendPeople").serialize(),function(){
						widget.hide([".J-return",".J-edit",".J-card"]).show([".grid",".J-list",".J-subnav-search-search"]);
						widget.get("grid").refresh();
					});
					return false;
				},
				//取消按钮
  				cancelaction:function(){
  					$(".J-list,.J-subnav-search-search").removeClass("hidden");
					$(".J-card,.J-orgCardownerForm,.J-recommendPeopleForm,.J-return,.J-edit").addClass("hidden");
					return false;
  				},
				model:{
					id:"recommendPeople",
					items:[{
						name:"pkMembershipContract",
						type:"hidden"
					},{
						name:"pkRecommendPeople",
						type:"hidden"
					},{
						name:"version",
						type:"hidden",
						defaultValue:"0"
					},{
						name:"name",
						label:"姓名",
						validate:["required"]
					},{
						name:"sex",
						label:"性别",
						type:"radiolist",
						list:[{
							key:"MALE",
							value:"男"
						},{
							key:"FEMALE",
							value:"女"
						}]
					},{
						name:"birthday",
						label:"出生年月",
						type:"date",
						mode:"Y-m-d"
					},{
						name:"member",
						label:"是否会员",
						type:"radiolist",
						list:[{
							key:"true",
							value:"是"
						},{
							key:"false",
							value:"否"
						}]
					},{
						name:"community",
						label:"所在社区",
						type:"select",
						url:"api/community/query",
						key:"pkCommunity",
						value:"name"
					},{
						name:"cardnumber",
						label:"卡号"
					},{
						name:"relationship",
						label:"与权益人关系"
					},{
						name:"idnumber",
						label:"身份证号"
					},{
						name:"nativePlace",
						label:"籍贯",
						type:"place"
					},{
						name:"zipcode",
						label:"邮编",
						validate:["postalcode"]
					},{
						name:"phone",
						label:"联系电话",
						validate:["required"]
					},{
						name:"email",
						label:"电子邮件",
						validate:["email"]
					},{
						name:"address",
						label:"通讯地址",
						type:"textarea"
					}]
				}
			});
			
			this.set("subnav",subnav);
			this.set("grid",grid);
			this.set("orgCardownerForm",verform1);
			this.set("recommandForm",verform2);
		}
	});
	module.exports = Organpeople;
});