define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Form=require("form-1.0.0");
	var Grid=require("grid-1.0.0");
	//多语
	var i18ns = require("i18n");
//	require("./accompanyhospitalize.css"); 
	var template="<div class='el-health-accompanyhospitalizecostrecords main'>"+
	"<div class='J-subnav'></div>"+
	"<div class='J-grid'></div>"+
	"<div class='J-form hidden'></div>"+
	"<div class='J-editForm hidden'></div>"+
	"</div>";
	
	var accompanyhospitalizecostrecords = ELView.extend({ 
		events:{
			"change .J-member":function(e){
				var pk=$(e.target).find("option:selected").attr("value");
				if(pk){
					aw.ajax({
						url : "api/member/query",
						type : "POST",
						data : {
							pkMember:pk,
							fetchProperties:"*,memberSigning.room.number,personalInfo.sex.value,personalInfo.birthday"
						},
						success:function(data){
							$(".J-sex").val(data[0].personalInfo.sex.value);
							$(".J-age").val(moment().diff(data[0].personalInfo.birthday, 'years'));
							var number=data[0].memberSigning.room.number;
							$(".J-member").val(pk);
							$(".J-number").val(number);								
						}
					});
				}
			}
		},
		attrs:{
			template:template
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"集体陪同就医费用记录",
					search : function(str) {
						var g=widget.get("grid");
						g.loading();
						aw.ajax({
							url:"api/accompanyhospitalizecostrecords/search",
							data:{
								s:str,
								properties:"member.memberSigning.room.number,member.personalInfo.name",
								fetchProperties:"pkAccompanyHospitalize,date,invoicePage,invoiceAmount,papersStatus," +
								"member.personalInfo.name," + 
								"handoverPerson.name," +
								"handoverPerson.pkUser," +
								"member.memberSigning.room.building.name," +
								"papers.name,hospital.name,"+
								"member.memberSigning.room.number,"+
								"member.personalInfo.sex,"+
								"member.personalInfo.birthday," +
								"member.pkMember",
							},
							dataType:"json",
							success:function(data){
								g.setData(data);
								
							}
						});
					},
					buttonGroup:[{
						id:"building",
						showAll:true,
						handler:function(key,element){
							widget.get("grid").refresh(null,function(){
								widget.getTotalMny();
							});
							widget.get("form").load("member");
							widget.get("editForm").load("member");
						}
					},{
			   			 id:"notes",
							items:[{
								key:"0",
								value:"未记录"
							},{
								key:"1",
								value:"已记录"
							}],
							handler:function(key,element){								
								widget.get("grid").refresh(null,function(){
									widget.getTotalMny();
								});
							}
					}],
					time:{
						click:function(time){
							widget.get("grid").refresh(null,function(){
								widget.getTotalMny();
							});
						}
					},
					buttons:[{
						id:"return",
						text:"返回",
						show:false,
						handler:function(){
							widget.hide(".J-form,.J-editForm").show(".J-grid");
							widget.get("subnav").hide(["return"]).show(["notes","building","search","time"]);
//							var parentNode=$(".el-health-accompanyhospitalizecostrecords");
//							if(parentNode.hasClass("form")){
////								parentNode.addClass("main").removeClass("form");
//								widget.hide(".J-form").show(".J-grid");
//							}
//							else if(parentNode.hasClass("editform")){
////								parentNode.addClass("main").removeClass("editform");
//								widget.hide(".J-editform").show(".J-grid");
//							}
						}
					}]
				}
			});
			this.set("subnav",subnav);
			var grid=new Grid({
				autoRender:false,
				url:"api/accompanyhospitalizecostrecords/query",
				fetchProperties:"pkAccompanyHospitalize,date,invoicePage,invoiceAmount,papersStatus,version," +
						"member.personalInfo.name," +  
						"handoverPerson.name," +
						"handoverPerson.pkUser," +
						"member.memberSigning.room.building.name," +
						"papers.name,hospital.name,"+
						"member.memberSigning.room.number,"+
						"member.personalInfo.sex,"+
						"member.personalInfo.birthday,member.pkMember",
				parentNode:".J-grid",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						start: subnav.getValue("time").start,
				    	end:  subnav.getValue("time").end,
				    	notes:subnav.getValue("notes"),
						"member.memberSigning.room.building":subnav.getValue("building")
					};
				},
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"date",
						name:"日期",
						format:"date",
						formatparams:{
							mode:"YYYY-MM-DD HH:mm"
						}
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						format:"detail",
						formatparams:[{
							key:"detail",
							handler:function(index,data,rowEle){
								if(data.papersStatus=="NotReceive"){
									data.papersStatus={key:"NotReceive",value:"未收取"};
								}
								else if(data.papersStatus=="Receive"){
									data.papersStatus={key:"Receive",value:"已收取"};
								}
								else if(data.papersStatus=="Restore"){
									data.papersStatus={key:"Restore",value:"已返还"};
								}
								widget.get("editForm").setData(data);
								widget.show(".J-editForm").hide(".J-grid");
								widget.get("subnav").show(["return"]).hide(["notes","building","search","time"]);
//								$(".el-health-accompanyhospitalizecostrecords").addClass("editform").removeClass("main");
								return false;
							}
						}]
					},{
						key:"member.memberSigning.room.number",
						name:"房间号"
					},{
						key:"invoicePage",
						name:"发票张数"
					},{
						key:"invoiceAmount",
						name:"金额"
					},{
						key:"operate",
						name:"操作",
						format:"button",
						formatparams:[{
							key:"edit",
							icon:"edit",
							handler:function(index,data,rowEle){
								if(data.papersStatus=="NotReceive"){
									data.papersStatus={key:"NotReceive",value:"未收取"};
								}
								else if(data.papersStatus=="Receive"){
									data.papersStatus={key:"Receive",value:"已收取"};
								}
								else if(data.papersStatus=="Restore"){
									data.papersStatus={key:"Restore",value:"已返还"};
								}
								widget.get("form").setData(data);
								widget.get("form").setAttribute("member","readonly",true);
								widget.show(".J-form").hide(".J-grid");
								widget.get("subnav").show(["return"]).hide(["notes","building","search","time"]);
//								$(".el-health-accompanyhospitalizecostrecords").addClass("form").removeClass("main");
								$(".J-date").attr({readonly:'true'});
								$(".J-member").attr({readonly:'true'});
								return false;
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			grid.refresh(this.get("params"),function(){
				widget.getTotalMny();
			});
			
			var form=new Form({
				parentNode:".J-form",
				saveaction:function(){
					aw.saveOrUpdate("api/accompanyhospitalizemanager/save",$("#accompanyhospitalizecostrecords").serialize(),function(){
//						$(".el-health-accompanyhospitalizecostrecords").addClass("main").removeClass("form");
						widget.hide(".J-form").show(".J-grid");
						widget.get("grid").refresh(null,function(){
							widget.getTotalMny();
						});
					});
				},
				cancelaction:function(){
					widget.hide(".J-form").show(".J-grid");
//					$(".el-health-accompanyhospitalizecostrecords").addClass("main").removeClass("form");
				},
				model:{
					id:"accompanyhospitalizecostrecords",
					items:[{
						name:"pkAccompanyHospitalize",
						type:"hidden"
					},{
						name:"version",
						type:"hidden"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/query",
						key:"pkMember",
						readonly:true,
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							var subnav=widget.get("subnav");
							var time=subnav.getValue("time");
							return {
								"memberSigning.room.building":subnav.getValue("building"),
								start: time.start,
						    	end:  time.end,
//						    	papersStatus:subnav.getValue("papersStatus"),
						    	notes:subnav.getValue("notes"),
						    	fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
						validate:["required"]
					},{
						name:"date",
						label:"日期",
						type:"date",
						mode:"Y-m-d H:i",
						readonly:true
					},{
						name:"invoicePage",
						label:"发票张数"
					},{
						name:"invoiceAmount",
						label:"金额"
					}]
				}
			});
			this.set("form",form);
			
			var editForm=new Form({
				parentNode:".J-editForm",
				saveaction:function(){
					aw.saveOrUpdate("api/accompanyhospitalizemanager/save",$("#accompanyhospitalize").serialize(),function(){
//						$(".el-health-accompanyhospitalizecostrecords").addClass("main").removeClass("form");
						widget.hide(".J-form").show(".J-grid");
						widget.get("grid").refresh(null,function(){
							widget.getTotalMny();
						});
					});
				},
				cancelaction:function(){
//					$(".el-health-accompanyhospitalizecostrecords").addClass("main").removeClass("form");
					widget.hide(".J-form").show(".J-grid");
				},
				model:{
					id:"accompanyhospitalize",
					items:[{
						name:"pkAccompanyHospitalize",
						type:"hidden"
					},{
						name:"version",
						type:"hidden"
					},{
						name:"member",
						label:i18ns.get("sale_ship_owner","会员"),
						url:"api/member/query",
						key:"pkMember",
						readonly:true,
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							var subnav=widget.get("subnav");
							var time=subnav.getValue("time");
							return {
								"member.memberSigning.room.building":subnav.getValue("building"),
								start: time.start,
						    	end:  time.end,
//						    	papersStatus:subnav.getValue("papersStatus"),
						    	notes:subnav.getValue("notes"),
						    	fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select"
					},{
						name:"date",
						label:"日期",
						type:"date",
						mode:"Y-m-d H:i",
						readonly:true
					},{
						name:"invoicePage",
						label:"发票张数"
					},{
						name:"invoiceAmount",
						label:"金额"
					}]
				}
			});
			editForm.setDisabled(true);
			this.set("editForm",editForm);
		},
		getTotalMny:function(){
			//重新计算金额
			var grid=this.get("grid");
			var totalMny=0;
			var data=grid.getData() || [];
			for(var i=0;i<data.length;i++){
				totalMny+=data[i].invoiceAmount || 0;
			}
			totalMny=Math.round(totalMny*100)/100;
			grid.setTitle("合计金额："+totalMny+"元");
		}
	});
	module.exports = accompanyhospitalizecostrecords;
});