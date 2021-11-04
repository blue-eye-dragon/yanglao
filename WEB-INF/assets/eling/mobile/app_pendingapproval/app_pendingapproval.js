define(function(require,exports,module){
	
	var types = {
		MemberCheckinAssessment : {
			idAttribute : "pkMemberAssessment",
			model : "eling/mobile/app_pendingapproval/assest/memberassessment",
			template : "text!eling/mobile/app_pendingapproval/assest/membercheckinassessment.html",
			queryParams : {
				fetchProperties:"personalCardowners,room.number,checkInTime,assessmentTime,creator.name"
			},
			parse : function(data){
				data[0].checkInTime=moment(data[0].checkInTime).format("YYYY-MM-DD");
				data[0].assessmentTime=moment(data[0].assessmentTime).format("YYYY-MM-DD");
				return data;
			}
			
		},
		CheckOutRoomApply : {
			idAttribute : "pkCheckOutRoomApply",
			model : "eling/mobile/app_pendingapproval/assest/checkoutroomapply",
			template : "text!eling/mobile/app_pendingapproval/assest/checkoutroomapply.html",
			queryParams : {
				fetchProperties:"memberSigning.annualFee,annualCheckOutFee,memberSigning.room.number,memberSigning.members,personalInfo.name,user.name,checkOutReason,memberSigning.members.personalInfo.name,memberSigning.members.status.value"
			},
			parse : function(data){
				var name="";
				value=data[0].memberSigning.members;
				for(var i=0;i<value.length;i++){
					if(i<value.length-1){
						name+=value[i].personalInfo.name+"("+value[i].status.value+"),";
					}else{
						name+=value[i].personalInfo.name+"("+value[i].status.value+")";
					}
				}
				data[0].name=name;
				return data;
			}
		},
		ChangeRoomApply : {
			idAttribute : "pkChangeRoomApply",
			model : "eling/mobile/app_pendingapproval/assest/changeroomapply",
			template : "text!eling/mobile/app_pendingapproval/assest/changeroomapply.html",
			queryParams : {
				fetchProperties:"room.number,annualFeeNew,memberSigning.room.number,user.name,personalInfo.name,changeDate,changeReason,memberSigning.annualFee,memberSigning.members,memberSigning.members.personalInfo.name,memberSigning.members.status.value"
			},
			parse : function(data){
				var name="";
				if(data[0].memberSigning.members.length != 0){
					var value=data[0].memberSigning.members;
					for(var i=0;i<value.length;i++){
						if(i<value.length-1){
							name+=value[i].personalInfo.name+"("+value[i].status.value+"),";
						}else{
							name+=value[i].personalInfo.name+"("+value[i].status.value+")";
						}
					}
				}else{
					for(var i=0;i<data[0].memberSigningNew.members.length;i++){
						if(i<data[0].memberSigningNew.members.length-1){
							name+= data[0].memberSigningNew.members[i].personalInfo.name+"("+data[0].memberSigningNew.members[i].status.value+"),";
						}else{
							name+= data[0].memberSigningNew.members[i].personalInfo.name+"("+data[0].memberSigningNew.members[i].status.value+")";
						}
					}
				}
				data[0].name=name;
				data[0].changeDate=moment(data[0].changeDate).format("YYYY-MM-DD");
				return data;
			}
		},
		CheckOutLiving : {
			idAttribute : "pkCheckOutLiving",
			model : "eling/mobile/app_pendingapproval/assest/checkoutliving",
			template : "text!eling/mobile/app_pendingapproval/assest/checkoutliving.html",
			queryParams : {
				fetchProperties:"member.memberSigning.annualFee,member.memberSigning.room.number,member.personalInfo.name,personalInfo.name,user.name,checkOutReason.value"
			},
			parse : function(data){
				return data;
			}
		},
		AnnualFeesRefund : {
			idAttribute : "pkAnnualFeesRefund",
			model : "eling/mobile/app_pendingapproval/assest/annualfeesrefund",
			template : "text!eling/mobile/app_pendingapproval/assest/annualfeesrefund.html",
			queryParams : {
				fetchProperties:"refundReason,personalInfo.name,annualFeesRefundFrom.value,annualFees.dueAnnualFees,annualFees.realAnnualFees,annualFees.payer.personalInfo.name"
			},
			parse : function(data){
				return data;
			}
		},
		MemberShipFeesRefund : {
			idAttribute : "pkMembershipContractFeesRefund",
			model : "eling/mobile/app_pendingapproval/assest/membershipcontractfeesrefund",
			template : "text!eling/mobile/app_pendingapproval/assest/membershipfeesrefund.html",
			queryParams : {
				fetchProperties:"refund.name,refundTime,memberShipContractFees.memberShipContract.room.number,memberShipContractFees.memberShipContract.membershipCard.cardType.name,refundAmount,memberShipContractFees.memberShipContract.personalCardowners,memberShipContractFees.memberShipContract.personalCardowners.personalInfo.name"
			},
			parse : function(data){
				var name= "";
				var value=data[0].memberShipContractFees.memberShipContract.personalCardowners;
				if(value.length>0){
					for(var i =0 ;i<value.length;i++){
						if(i<value.length-1){
							name+= value[i].personalInfo.name+"、";
						}else{
							name+= value[i].personalInfo.name;
						}
					}
				}else{
					name="无";
				}
				data[0].name=name;
				data[0].room=data[0].memberShipContractFees.memberShipContract.room!=null?data[0].memberShipContractFees.memberShipContract.room.number:"";
				data[0].refundTime=moment(data[0].refundTime).format("YYYY-MM-DD");
				return data;
			}
		},
		BowOutMembershipContract : {
			idAttribute : "pkBowOutMembershipContract",
			model : "eling/mobile/app_pendingapproval/assest/bowoutmembershipcontract",
			template : "text!eling/mobile/app_pendingapproval/assest/bowoutmembershipcontract.html",
			queryParams : {
				fetchProperties:"applyDate,bowOutReason,bowOutFees,personalCardowner.personalInfo.name,membershipContract.personalCardowners,membershipContract.signDate,membershipContract.memberShipFees"
			},
			parse : function(data){
				var name="";
				for(var i=0;i<data[0].membershipContract.personalCardowners.length;i++){
					if(i<data[0].membershipContract.personalCardowners.length-1){
						name+= data[0].membershipContract.personalCardowners[i].personalInfo.name+",";
					}else{
						name+= data[0].membershipContract.personalCardowners[i].personalInfo.name;
					}
				}
				data[0].name=name;
				data[0].applyDate=moment(data[0].applyDate).format("YYYY-MM-DD");
				data[0].membershipContract.signDate=moment(data[0].membershipContract.signDate).format("YYYY-MM-DD");
				return data;
			}
		},
		DepositRefund : {
			idAttribute : "pkDepositRefundApply",
			model : "eling/mobile/app_pendingapproval/assest/depositrefundapply",
			template : "text!eling/mobile/app_pendingapproval/assest/depositrefund.html",
			queryParams : {
				fetchProperties:"refund.name,deposit.operator.name,deposit.chargeTime,deposit.realDeposit,deposit.room.number,deposit.name"
			},
			parse : function(data){
				data[0].deposit.number=data[0].deposit.room!=null?data[0].deposit.room.number:"";
				data[0].deposit.chargeTime=moment(data[0].deposit.chargeTime).format("YYYY-MM-DD");
				return data;
			}
		},
		ChangeRoomAppointment : {
			idAttribute : "pkChangeRoomAppointment",
			model : "eling/mobile/app_pendingapproval/assest/changeroomappointment",
			template : "text!eling/mobile/app_pendingapproval/assest/changeroomappointment.html",
			queryParams : {
				fetchProperties:"memberSigning.members,memberSigning.members.personalInfo.name,memberSigning.room.number,roomType.name,building.name,floors,user.name,personalInfo.name,changeReason"
			},
			parse : function(data){
				var name="";
				value=data[0].memberSigning.members;
				for(var i=0;i<value.length;i++){
					if(i<value.length-1){
						name+=value[i].personalInfo.name+",";
					}else{
						name+=value[i].personalInfo.name;
					}
				}
				data[0].floors=data[0].floors!=null?data[0].floors:"";
				data[0].name=name;
				return data;
			}
		}
	};
	
	//待审批模型
	var PendingApproval = require("./pendingapproval");
	
	
	//framework7工具类
	var f7 = require("f7");
	require("moment");
	
	var pendingApprovals = new PendingApproval({
		parse: function(datas) {
			for(var i in datas){
				datas[i].commitTimeStr = moment(datas[i].commitTime).format("YYYY-MM-DD HH:mm");
				datas[i].beforeTimeStr = moment(datas[i].beforeTime).format("YYYY-MM-DD HH:mm");
			}
		    return datas;
		}
	});
	
	//定义视图（View）
	var App = Backbone.View.extend({
		
		el : ".view-main",
		
		initialize : function(){
			f7.initialize();
			
			this.viewModels = {
				list : pendingApprovals,
				detail : {
					top : {
						"MemberCheckinAssessment" : null,
						"MemberShipFeesRefund" : null,
						"DepositRefund" : null,
						"ChangeRoomApply" : null,
						"CheckOutRoomApply" : null,
						"CheckOutLiving" : null,
						"ChangeRoomAppointment" : null,
						"AnnualFeesRefund" : null,
					}
				}
			};
			this.listener();
		},
		
		listener : function(){
			this.viewModels.list.on("reset",this.renderList,this);
			this.viewModels.list.on("remove",this.remove,this);
		},
		
		events : {
			"tap .J-detail-item" : function(e){
				//绘制底部
				var datas = this.viewModels.list;
				var index = parseInt($(e.currentTarget).attr("data-index"));
				
				var data = datas.at(index).toJSON();
				this.renderDetailBottom(data);
				
				//绘制头部
				var type = data.serviceType;
				var topModels = this.viewModels.detail.top;
				
				var model = topModels[type];
				
				var idAttribute = types[type].idAttribute;
				var queryParams = types[type].queryParams;
				queryParams[types[type].idAttribute] = data.approvalInstance.modelId;
				
				if(model){
					model.fetch({
						reset : true,
						data : queryParams
					});
				}else{
					var that = this;
					require([types[type].model],function(Module){
						
						var module = topModels[type] = new Module({
							parse : types[type].parse
						});
						module.type = type;
						
						module.on("reset",that.renderDetailTop,that);
						
						module.fetch({
							reset : true,
							data : queryParams
						});
					});
				}
			},
			
			"tap .J-goback-list" : function(e){
				f7.back({
					url : "pendingapproval_list.html"
				});
			},
			"tap .J-notPass" : function(e){
				this.commit("NotPass");
			},
			"tap .J-pass" : function(e){
				this.commit("Pass");
			}
		},
		
		/******************服务器交互**********************/
		
		commit : function(status){
			var list = this.viewModels.list;
			
			$.ajax({
				url:"api/approval/approval",
				data:{
					pkApprovalProcess : f7.getValue("pendingapproval_detail.html","pk"),
					version : f7.getValue("pendingapproval_detail.html","version"),
					note : $(".J-note").val(),
					status : status,
				},
				success:function(data){
					list.remove(list.get(f7.getValue("pendingapproval_detail.html","pk")));
				}
			});
		},
		
		setup : function(){
			f7.loading(true);
			this.viewModels.list.fetch({
				reset : true,
				data : {
					fetchProperties:"pkApprovalProcess,description,serviceType," +
						"commitTime,msg,model,no," +
						"approvalInstance,approvalInstance.modelId,approvalInstance.approvalProcesses," +
						"approvalInstance.approvalProcesses.checkTime," +
						"approvalInstance.approvalProcesses.commitTime," +
						"approvalInstance.approvalProcesses.note," +
						"approvalInstance.approvalProcesses.checker.pkUser," +
						"approvalInstance.approvalProcesses.checker.name," +
						"approvalInstance.approvalProcesses.creator.name," +
						"approvalInstance.approvalProcesses.status.value," +
						"approvalInstance.approvalProcesses.sequenceNumber," +
						"beforeTime," +
						"beforeProcess.checker,beforeProcess.checker.name," +
						"beforeProcess.commitTime,beforeProcess.status.value," +
						"beforeProcess.checkTime," +
						"processes.version"
				},
				success : function(){
					f7.loading(false);
				}
			});
		},
		
		/****************数据*******************/
		
		//数据操作
		getDetailBottomData : function(data){
			var title = data.description;
			var type = {
				type : data.serviceType,
				model : data.model
			}
			var detildatas = data.approvalInstance.approvalProcesses;
			var detil = [];
			var sequenceno = data.no;
			var version=data.processes.version;
			var orgPk=data.pkApprovalProcess;
			for(var j=0;j<=sequenceno;j++){
				for(var i=0;i<detildatas.length;i++){
					var no=detildatas[i].sequenceNumber;
					var name="";
					var time="";
					var status=detildatas[i].status.value!="初始"?detildatas[i].status.value:"";
					var note=detildatas[i].note!=null?detildatas[i].note:"";
					if(no==j && j<sequenceno){//之前的审批人
						if(detildatas[i].creator!=null){
							name=detildatas[i].creator.name;
							time=moment(detildatas[i].commitTime).format("YYYY-MM-DD HH:mm");
						}else{
							name=detildatas[i].checker.name;
							time=moment(detildatas[i].checkTime).format("YYYY-MM-DD HH:mm");
						}
					}else if(no==j && j==sequenceno){//同序审批人
						var pk=data.processes.checker.pkUser;
						if(detildatas[i].status.key!="Initial"){
							name=detildatas[i].checker.name;
							time=moment(detildatas[i].checkTime).format("YYYY-MM-DD HH:mm");
						}
					}
					if(name!=""){
						detil.push({
							no:"序号"+no,
							name:name,
							time:time,
							status:status,
							note:note,
						});
					}
				}
			}
			detil.push({
				no:"序号"+sequenceno,
				name:"自己",
				time:"",
				status:"",
				note:"",
				isEdit : true
			});
			
			return {
				title : title + "审批",
				datas : detil,
				pk:orgPk,
				version:version
			};
		},
		
		/*************视图**************/
		
		renderDetailTop : function(model){
			var type = model.type;
			require([types[type].template],function(tpl){
				$(".J-detail-top").html(Template7.compile(tpl)(model.toJSON()[0]));
				$(".J-note").val("");
			});
		},
		
		//视图操作
		renderList : function(){
			var datas = this.viewModels.list.toJSON();
			f7.render({
				url : "pendingapproval_list.html",
				animatePages : false
			},{
				title : datas.length,
				datas : datas
			});
		},
		
		//视图操作
		renderDetailBottom : function(data){
			f7.setData("pendingapproval_detail.html",this.getDetailBottomData(data),{
				operate : "load"
			});
		},
		//视图操作
		remove : function(){
			f7.setData("pendingapproval_list.html",{
				datas : this.viewModels.list.toJSON()
			},{
				operate : "back",
				force : true
			});
		}
	});
	
	return App;
});
