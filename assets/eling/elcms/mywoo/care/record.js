define(function(require,exports,module){
    var ELView =require("elview");
    var template = require("./record.tpl");
    var Subnav = require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
    var aw = require("ajaxwrapper");
    var store=require("store");
    var DateEL = require("date-1.0.0");
    var Dialog=require("dialog-1.0.0");

    require("./record.css");

    var SaleStatus = ELView.extend({
        attrs:{
            template:template,
            model:{
                datas:[],
                cardownerList:[],
                careItems:[
                    {name:'打扫卫生'},
                    {name:'理发'},
                    {name:'聊天谈心'},
                    {name:'用药'}
                ],
                careRecToAdd:{careDt:"",careTgt:"",careItem:""}
            }
        },
        events:{
            "click .btn-save-care-record": function () {
                var date = this.get("dateEL").getValue()
                console.log('save date', date)
                this.get("model").careRecToAdd.careDt = new Date(date)
                this.saveCareRecord(this.get("model").careRecToAdd)
            },
            "click .J-user-item": function(e) {
                console.log('userItem.click', e.target)
                $(".J-user-item.active").removeClass("active")
                setTimeout(function () {
                    $(e.target).addClass("active")
                },20)
                this.get("model").careRecToAdd.careTgt = $(e.target).text()
            },
            "click .J-care-item": function(e) {
                console.log('careItem.click', e.target)
                $(".J-care-item.active").removeClass("active")
                setTimeout(function () {
                    $(e.target).addClass("active")
                },20)
                this.get("model").careRecToAdd.careItem = $(e.target).text()
            }
        },
        initComponent:function(params,widget){
            var subnav = new Subnav({
                parentNode:".J-subnav",
                model:{
                    title:"护理记录",
                    buttons:[{
                        id:"add",
                        text:"新增护理记录",
                        show:true,
                        handler:function(){
                            widget.hide([".J-record-grid"]).show(".J-record-add");
                            var subnav = widget.get("subnav");
                            subnav.show(["return"]).hide(["add"]);
                            subnav.setTitle("新增护理记录");
                            $(".active").removeClass("active")
                            $("#choose-care-record-date").empty()
                            var dateEL = new DateEL({
                                parentNode:"#choose-care-record-date",
                                // autoRender:true,
                            })

                            widget.set("dateEL",dateEL);
                            // widget.get("dateEL").initialize()
                            // widget.renderPartial("#choose-care-record-date");
                            // widget.set("mark","0");
                            /*if(widget.get("mark") == "0"){
                                //返回到列表
                                widget.show(".J-record-grid").hide([".J-record-add"]);
                                var subnav = widget.get("subnav");
                                subnav.show(["add"]).hide(["return"]);
                                subnav.setTitle("护理记录");
                            }else{
                                widget.hide([".J-record-add"]).show(".J-record-grid");
                                widget.set("mark","0");
                            }*/
                        }
                    },{
                        id:"return",
                        text:"返回",
                        show:false,
                        handler:function(){
                            widget.hide([".J-record-add"]).show(".J-record-grid");

                            var subnav = widget.get("subnav");
                            subnav.show(["add"]).hide(["return"]);
                            subnav.setTitle("护理记录");
                            // 查询一次
                        }
                    }],
                }
            });
            this.set("subnav",subnav);

            var grid = new Grid({
                parentNode:".J-record-grid",
                autoRender:true,
                model:{
                    // head:{
                    //     title:"护理记录列表"
                    // },
                    columns:[
                       /* {
                        key:"ptyId",
                        name:"护理人",
                        className:"oneHalfColumn",
                         format:function(value,row){
                            if (value == "MALE") {
                                return "男";
                            } else if (value == "FEMALE") {
                                return "女"
                            } else {
                                return "";
                            }
                        }
                    },*/{
                        key:"careDt",
                        className:"oneHalfColumn",
                        name:"护理时间",
                        format:"date"
                    },{
                        key:"careTgt",
                        className:"oneHalfColumn",
                        name:"护理对象",
                        /*format:function(value,row){
                            if (value == "MALE") {
                                return "男";
                            } else if (value == "FEMALE") {
                                return "女"
                            } else {
                                return "";
                            }
                        }*/
                    },{
                        key:"careItem",
                        name:"护理内容",
                        /*format:function(value,row){
                            if(value){
                                return moment().diff(value, 'years');
                            }else{
                                return "";
                            }
                        }*/
                    }]
                }
            });
            this.set("grid",grid);

            // date
            var dateEL = new DateEL({
                parentNode:"#choose-care-record-date",
                // autoRender:true,
            })

            this.set("dateEL",dateEL);
        },
        afterInitComponent:function(params,widget){
            this.loadData();
            widget.hide(['.J-record-add'])
        },
        saveCareRecord(record) {
            // 保存记录
            var that = this
            console.log('saveCareRecord',record)
            if(!record.careTgt){
                Dialog.alert({
                    content:"请选择需要护理的人员"
                });
                return
            }

            if(!record.careItem){
                Dialog.alert({
                    content:"请选择护理项目"
                });
                return
            }
            // return
            var token = store.get("token")
            // console.log('loadGridData token', token)
            params = record || {}
            aw.ajax({
                url:"hws/api/carerec/add",
                type:"POST",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", "Bearer "+token);
                },
                data:JSON.stringify(params),
                contentType:'application/json',
                dataType:"json",
                success:function(data){
                    console.log('list2', data)
                    // grid.setData(data);
                    that.loadData()
                    that.hide([".J-record-add"]).show(".J-record-grid");
                    var subnav = that.get("subnav");
                    subnav.show(["add"]).hide(["return"]);
                    subnav.setTitle("护理记录");

                }
            });
        },
        loadData:function(){
            console.log("loadData")
            var that = this;
            that.loadUserData()
            that.loadGridData({})
        },
        loadUserData: function() {
            var widget = this
            aw.ajax({
                url:"api/personalCardowner/query",
                data:{
                    // pkPersonalCardowner:pkPersonalCardowner,
                    fetchProperties:"*," +
                        "personalInfo.pkPersonalInfo,"+
                        "personalInfo.version,"+
                        "personalInfo.name,"+
                        "personalInfo.nameEn,"+
                        "personalInfo.formerName,"+
                        "personalInfo.idNumber,"+
                        "personalInfo.relationship,"+
                        "personalInfo.sex,"+
                        "personalInfo.maritalStatus,"+
                        "personalInfo.weddingDate,"+
                        "personalInfo.birthday,"+
                        "personalInfo.birthplace,"+
                        "personalInfo.communistParty,"+
                        "personalInfo.otherParty,"+
                        "personalInfo.citizenship.pkCountry,"+
                        "personalInfo.citizenship.name,"+
                        "personalInfo.nationality,"+
                        "personalInfo.nativePlace.id,"+
                        "personalInfo.nativePlace.name,"+
                        "personalInfo.nativePlace.code,"+
                        "personalInfo.residenceAddress,"+
                        "personalInfo.graduateSchool,"+
                        "personalInfo.qualifications,"+
                        "personalInfo.degree,"+
                        "personalInfo.specialty,"+
                        "personalInfo.phone,"+
                        "personalInfo.mobilePhone,"+
                        "personalInfo.email,"+
                        "personalInfo.workUnit,"+
                        "personalInfo.jobTitle,"+
                        "personalInfo.annualIncome,"+
                        "personalInfo.professionalTitle,"+
                        "personalInfo.topJobTitle,"+
                        "personalInfo.overseasExperience.name,"+
                        "personalInfo.overseasExperience.code,"+
                        "personalInfo.overseasExperience.pkCountry,"+
                        "personalInfo.ffl,"+
                        "personalInfo.fflDof,"+
                        "personalInfo.sfl,"+
                        "personalInfo.sflDof,"+
                        "personalInfo.computerDof," +
                        "personalInfo.idType,"+
                        "personalInfo.otherIntroduction,"
                },
                dataType:"json",
                success:function(data){
                    console.log('cardownerlist', data)
                    // data = data[0];
                    var arr = []
                    for(var index = 0;index < data.length;index++){
                        arr.push(data[index].personalInfo)
                    }
                    var model = widget.get("model");
                    model.cardownerList = arr;
                    console.log('model.cardownerList', model.cardownerList)
                    widget.renderPartial(".J-select-user");
                }
            });
        },
        loadGridData:function(params){
            var grid=this.get("grid");
                grid.loading();
                var token = store.get("token")
            // console.log('loadGridData token', token)
            params = params || {}
            aw.ajax({
                url:"hws/api/carerec/list2",
                type:"POST",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", "Bearer "+token);
                },
                data:JSON.stringify(params),
                contentType:'application/json',
                dataType:"json",
                success:function(data){
                    console.log('list2', data)
                    grid.setData(data);
                }
            });
        }
    });

    module.exports = SaleStatus;
});
