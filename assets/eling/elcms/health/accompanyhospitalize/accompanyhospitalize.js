define(function(require, exports, module) {
	var ELView=require("elview");
	var Subnav=require("subnav-1.0.0");
	var aw = require("ajaxwrapper");
	var Form=require("form-2.0.0")
	var Grid=require("grid-1.0.0");
	var week=["日","一","二","三","四","五","六"];
	var store=require("store");
	require("./accompanyhospitalize.css");
	var template=require("./accompanyhospitalize.tpl");
	//多语
	var i18ns = require("i18n");
	var accompanyhospitalize = ELView.extend({
		events:{
			"change .J-form-accompanyhospitalize-select-member":function(e){
				var form=this.get("form");
				var pk=form.getValue("member");
				if(pk){
					aw.ajax({
						url : "api/member/query",
						type : "POST",
						data : {
							pkMember:pk,
							fetchProperties:"*,memberSigning.room.number,personalInfo.sex.value,personalInfo.birthday"
						},
						success:function(data){
							form.setValue("sex",data[0].personalInfo.sex.value);
							form.setValue("age",moment().diff(data[0].personalInfo.birthday, 'years'));
							form.setValue("member",pk);
						}
					});
				}
			}
		}, 
		attrs:{
			template:template
		},
		setGridTitle:function(){
			var length = this.get("grid").getData().length;
			var title="共"+length+"位"+i18ns.get("sale_ship_owner","会员");
			this.get("grid").setTitle(title);
			this.get("printGrid").setTitle(title);
		},
		initComponent:function(params,widget){
			var subnav=new Subnav({
				parentNode:".J-subnav",
				model:{
					title:"集体陪同就医",
					items:[{
						id:"building",
						showAll:true,
						type:"buttongroup",
						handler:function(key,element){
							widget.get("grid").refresh(params,function(){
								widget.setGridTitle();
							});
							widget.get("form").load("member");
						}
					},{
			   			id:"papersStatus",
			   			showAll:true,
			   			showAllFirst:true,
			   			type:"buttongroup",
							items:[{
								key:"NotReceive",
								value:"未收取"
							},{
								key:"Receive",
								value:"已收取"
							},{
								key:"Restore",
								value:"已返还"
							}],
							handler:function(key,element){								
								widget.get("grid").refresh(null,function(){
									widget.setGridTitle();
								});
							}
					},{
						id:"time",
						type:"time",
						handler:function(time){
							widget.get("grid").refresh(null,function(){
								widget.setGridTitle();
							});
						}
					},{
						id:"add",
						text:"新增",
						type:"button",
						handler:function(){
							widget.get("form").reset();
							widget.get("form").setValue("papersStatus","NotReceive");
							widget.get("form").setValue("date",moment());
							$(".el-health-accompanyhospitalize").addClass("form").removeClass("main");
						}
					},{
						id:"return",
						type:"button",
						text:"返回",
						handler:function(){
							var parentNode=$(".el-health-accompanyhospitalize");
							if(parentNode.hasClass("form")){
								parentNode.addClass("main").removeClass("form");
							}
						}
					},{
						id:"print",
						text:"打印",
						type:"button",
						handler:function(){
							var data=widget.get("grid").getData();
							widget.get("printGrid").setData(data);
							var title=moment().format("YYYY.MM.DD");
							title+="（星期"+week[moment().days()]+"）"+i18ns.get("sale_ship_owner","会员")+"就医";
							$(".J-printGrid-title").text(title);
							$(".J-name").text(store.get("user").name);
							$(".J-printtime").text(moment().format("YYYY-MM-DD HH:mm:ss"));
							window.print();
						}
					}]
				}
			});
			this.set("subnav",subnav);
			var grid=new Grid({
				autoRender:false,
				url:"api/accompanyhospitalizemanager/query",
				parentNode:".J-grid",
				params:function(){
					var subnav=widget.get("subnav");
					return {
						date: subnav.getValue("time").start,
				    	dateEnd:  subnav.getValue("time").end,
						papersStatus:subnav.getValue("papersStatus"),
						"member.memberSigning.room.building":subnav.getValue("building"),
						fetchProperties:"*,member.personalInfo.name,handoverPerson.name,handoverPerson.pkUser," +
							"member.memberSigning.room.building.name,papers.pkPaperType,papers.name,hospital.name,"+
							"member.memberSigning.room.number,member.personalInfo.sex,member.personalInfo.birthday"
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
						className:"date",
						formatparams:{
							mode:"YYYY-MM-DD"
						}
					},{
						key:"member.personalInfo.name",
						name:i18ns.get("sale_ship_owner","会员"),
						className:"name",
						format:"detail",
						className:"name",
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
								var form=widget.get("form");
								form.setData(data);
								form.setValue("sex",data.member.personalInfo.sex.value);
								form.setValue("age",moment().diff(data.member.personalInfo.birthday, 'years'));
								form.setDisabled(true);
								$(".el-health-accompanyhospitalize").addClass("form").removeClass("main");
								return false;
							}
						}]
					},{
						key:"member.memberSigning.room.number",
						name:"房间号",
						className:"number",
					},{
						key:"member.personalInfo.birthday",
						name:"年龄",
						format:"age",
						className:"birthday"	
					},{
						key:"member.personalInfo.sex.value",
						className:"sex",
						name:"性别"
					},{
						key:"hospitalDepartment",
						name:"预约科室",
						className:"hospitalDepartment"
					},{
						key:"doctorName",
						name:"专家名称",
						className:"doctorName"
					},{
						key:"papersStatus",
						name:"证件收取状态",
						className:"papersStatus",
						format:function(value,row){
							if(value == "NotReceive"){
								return "未收取";
							}else if(value == "Receive"){
								return "已收取";
							}else if(value == "Restore"){
								return "已返还";
							}
						}
					},{
						key:"description",
						name:"备注",
						className:"description"
					},{
						key:"operate",
						name:"操作",
						className:"operate",
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
								var form=widget.get("form");
								form.setData(data);
								form.setValue("sex",data.member.personalInfo.sex.value);
								form.setValue("age",moment().diff(data.member.personalInfo.birthday, 'years'));
								form.setDisabled(false);
								$(".el-health-accompanyhospitalize").addClass("form").removeClass("main");
								return false;
							}
						},{
							key:"delete",
							icon:"remove",
							handler:function(index,data,rowEle){
								aw.del("api/accompanyhospitalizemanager/" + data.pkAccompanyHospitalize + "/delete",function(){
									widget.get("grid").refresh(params,function(){
										widget.setGridTitle();
									});
								});
								return false;
							}
						}]
					}]
				}
			});
			this.set("grid",grid);
			grid.refresh(this.get("params"));
			
			var form=new Form({
				parentNode:".J-form",
				saveaction:function(){
					aw.saveOrUpdate("api/accompanyhospitalizemanager/save",$("#accompanyhospitalize").serialize(),function(){
						$(".el-health-accompanyhospitalize").addClass("main").removeClass("form");
						widget.get("grid").refresh(params,function(){
							widget.setGridTitle();
						});
					});
				},
				cancelaction:function(){
					$(".el-health-accompanyhospitalize").addClass("main").removeClass("form");
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
						value:"memberSigning.room.number,personalInfo.name",
						params:function(){
							var subnav=widget.get("subnav");
							return {
								"memberSigning.room.building":subnav.getValue("building"),
						    	fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
							};
						},
						type:"select",
						validate:["required"] 
					},{
						name:"age",
						label:"年龄",
						readonly:true
					},{
						name:"sex",
						label:"性别",
						readonly:true
					},{
						name:"hospital",
						label:"医院",
						url:"api/hospital/query",
						key:"pkHospital",
						value:"name",
						type:"select",
						validate:["required"]
					},{
						name:"hospitalDepartment",
						label:"预约科室",
						validate:["required"]
					},{
						name:"doctorName",
						label:"专家名称"
					},{
						name:"date",
						label:"日期",
						type:"date",
						mode:"Y-m-d H:i",
						defaultValue:moment(),
						validate:["required"]
					},{
						name:"papers",
						key:"pkPaperType",
						value:"name",
						label:"证件",
						multi:true,
						url:"api/papertype/query",
						type:"select",
						validate:["required"]
					
					},{
						name:"papersStatus",
						label:"证件收取状态",
						type:"select",
						options:[{
							key:"NotReceive",
							value:"未收取"
						},{
							key:"Receive",
							value:"已收取"
						},{
							key:"Restore",
							value:"已返还"
						}],
						defaultValue:"NotReceive",
						validate:["required"]
					},{
						name:"handoverPerson",
						key:"pkUser",
						label:"移交人",
						value:"name",
						url:"api/users",//TODO 用户角色：wulina
						type:"select",
					},{
						name:"receivePerson",
						label:"接收人"
					},{
						name:"description",
						label:"备注",	
						type:"textarea"
					},{
						name:"invoicePage",
						type:"hidden"
					},{
						name:"invoiceAmount",
						type:"hidden"
					}]
				}
			});
			this.set("form",form);
			
			var printGrid=new Grid({
				parentNode:".J-printGrid",
				autoRender:false,
				isInitPageBar:false,
				model:{
					head:{
						title:""
					},
					columns:[{
						key:"member",
						name:i18ns.get("sale_ship_owner","会员"),
						className:"width_member",
						format:function(value,row){
							return value.memberSigning.room.number + " " +value.personalInfo.name;
						}
					},{
						key:"papers",
						name:"证件",
						className:"width_papers",
						format:function(value,row){
							var ret="";
							if(value){
								for(var i=0;i<value.length;i++){
									ret+=value[i].name+"，";
								}
								return ret.substring(0,ret.length-1);
							}
							return ret;
						}
					},{
						key:"member.personalInfo.sex.value",
						name:"性别",
						className:"width_sex"
					},{
						key:"member.personalInfo.birthday",
						name:"年龄",
						format:"age",
						className:"width_birthday"
					},{
						key:"",
						name:"预约科室/专家",
						format:function(value,row){
							return row.hospitalDepartment+"/"+row.doctorName;
						},
						className:"width_h_d"
					},{
						key:"description",
						name:"备注",
						className:"width_description"
					}]
				}
			});
			this.set("printGrid",printGrid);
		},
		afterInitComponent:function(params,widget){
			aw.ajax({
				url:"api/accompanyhospitalizemanager/query",
				data:{
					fetchProperties:"pkAccompanyHospitalize",
					date: widget.get("subnav").getValue("time").start,
					dateEnd:  widget.get("subnav").getValue("time").end,
					papersStatus:widget.get("subnav").getValue("papersStatus"),
					"member.memberSigning.room.building":widget.get("subnav").getValue("building")
				},
				success:function(data){
					widget.setGridTitle();
				}
			});
		}
	});
	module.exports = accompanyhospitalize;
});