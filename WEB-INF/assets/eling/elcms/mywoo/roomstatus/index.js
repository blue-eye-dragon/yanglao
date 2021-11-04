define(function(require,exports,module){
    var ELView =require("elview");
    var template = require("./roomstatus.tpl");
    var Subnav = require("subnav-1.0.0");
    var Grid = require("grid-1.0.0");
    var Form_1_0_0 = require("form-1.0.0");
    var aw = require("ajaxwrapper");
    var Dialog=require("dialog-1.0.0");
    require("mixitup");

    require("./roomstatus.css");

    var SaleStatus = ELView.extend({
        attrs:{
            template:template,
            model:{
                datas:[],
                buildingDatas:[],
                personList:[],
                status:[{
                    key:"Empty",
                    value:"空房",
                    icon:"icon-lock",
                    checked:false
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
            "click .J-person-checkbox": function (e) {
                var el = $(e.target)
                console.log('J-person-checkbox', el)
                // $('.J-person-checkbox').attr("checked", false);
                // el.attr("checked", true);
                var pkPersonalCardowner = el.attr('data-pkPersonalCardowner')
                var name = el.attr('data-pkPersonalCardownerName')
                console.log('pkPersonalCardowner', pkPersonalCardowner)
                // el.attr("checked", true);
                var checkedList = $(":checked")
                checkedList.each((index,c) => {
                    console.log("checkList",c)
                    if(pkPersonalCardowner !==$(c).attr('data-pkPersonalCardowner')){
                        $(c).attr("checked", false);
                    }
                })

                // 设置form
                var bindForm = this.get("bindForm")
                bindForm.setValue("person",name)
                bindForm.setValue("tgt",pkPersonalCardowner)
                // bindForm.setAttribute("roomNumber","readonly","readonly");
            },
            "click .J-bed-item" : function(e){
                var el = $(e.target);

                // 数据
                var datas = this.get("model").datas
                console.log('click bed', datas)
                var bedId = el.attr("data-id")
                // 找到bedId对应的楼宇，楼层，房间信息
                var buildingName = ''
                var levelNumber = ''
                var typeName = ''
                var roomNumber = ''
                var code = ''
                var version = ''
                Object.getOwnPropertyNames(datas).forEach(key => {
                    var building = datas[key]
                    var levels = building.levels
                    Object.getOwnPropertyNames(levels).forEach(k => {
                        var level = levels[k]
                        // var levelNumber = level.level
                        var rooms = level.rooms
                        rooms.forEach(m => {
                            var beds = m.beds
                            var tempBed = beds.find(b => b.id === bedId)
                            if(tempBed){
                                buildingName = building.name
                                typeName = m.type.name
                                roomNumber = m.number
                                code = tempBed.code
                                levelNumber = level.level
                                version = tempBed.v
                            }
                        })
                    })

                })
                var tgt = el.attr("data-tgt")


                if(tgt){
                    var tgtName = ''
                    var personList = this.get("model").personList
                    console.log('personList', personList)
                    console.log('tgt', tgt)
                    var person = personList.find(p => `${p.pkPersonalCardowner}` === `${tgt}`)
                    console.log('person', person)
                    if(person){
                        tgtName = person.name
                    }

                    // 显示解绑
                    this.hide(['.J-salestatus-total-content'])
                    this.show('.J-salestatus-unBindPeronToBed')
                    var subnav = this.get("subnav");
                    subnav.show(["return"]).hide(["status"]);
                    subnav.setTitle("解绑床位与权益人");

                    // 设置form数据
                    // 设置form数据
                    var bindForm = this.get("unBindForm")
                    bindForm.setValue("buildingName",buildingName)
                    bindForm.setValue("level",levelNumber)
                    bindForm.setValue("typeName",typeName)
                    bindForm.setValue("roomNumber",roomNumber)
                    bindForm.setValue("code",code)
                    bindForm.setValue("person",tgtName) // 权益人名称
                    bindForm.setValue("bedId",bedId)
                    bindForm.setValue("v",version)

                    bindForm.setAttribute("buildingName","readonly","readonly");
                    bindForm.setAttribute("level","readonly","readonly");
                    bindForm.setAttribute("typeName","readonly","readonly");
                    bindForm.setAttribute("roomNumber","readonly","readonly");
                    bindForm.setAttribute("code","readonly","readonly");
                    bindForm.setAttribute("person","readonly","readonly");

                    /*
                    * {
                        name:"buildingName",
                        label:"楼宇",
                    },{
                        name:"level",
                        label:"楼层",
                    },{
                        name:"typeName",
                        label:"房型",
                    },{
                        name:"roomNumber",
                        label:"房间号",
                    }, {
                        name:"code",
                        label:"床位号",
                    }, {
                        name:"person",
                        label:"权益人",
                    },{
                        name:"bedId",
                        type:"hidden"
                    },{
                        name:"v",
                        type:"hidden"
                    }
                    * */


                }else{
                    // 显示绑定form
                    this.hide(['.J-salestatus-total-content'])
                    this.show('.J-salestatus-bindPeronToBed')
                    var subnav = this.get("subnav");
                    subnav.show(["return"]).hide(["status"]);
                    subnav.setTitle("绑定床位与权益人");

                    // 设置form数据
                    var bindForm = this.get("bindForm")
                    bindForm.setValue("buildingName",buildingName)
                    bindForm.setValue("level",levelNumber)
                    bindForm.setValue("typeName",typeName)
                    bindForm.setValue("roomNumber",roomNumber)
                    bindForm.setValue("code",code)
                    bindForm.setValue("v",version)
                    bindForm.setValue("bedId",bedId)

                    bindForm.setAttribute("buildingName","readonly","readonly");
                    bindForm.setAttribute("level","readonly","readonly");
                    bindForm.setAttribute("typeName","readonly","readonly");
                    bindForm.setAttribute("roomNumber","readonly","readonly");
                    bindForm.setAttribute("code","readonly","readonly");
                    bindForm.setAttribute("person","readonly","readonly");

                    /*
                    *  items:[{
                        name:"buildingName",
                        label:"楼宇",
                    },{
                        name:"level",
                        label:"楼层",
                    },{
                        name:"typeName",
                        label:"房型",
                    },{
                        name:"roomNumber",
                        label:"房间号",
                    },{
                        name:"bedId",
                        type:"hidden"
                    }, {
                        name:"code",
                        label:"床位号",
                    }, {
                        name:"person",
                        label:"权益人",
                    },{
                        name:"tgt",
                        type:"hidden"
                    }]
                    * */
                }

                this.set("mark","0");

            },
        },
        initComponent:function(params,widget){
            var subnav = new Subnav({
                parentNode:".J-subnav",
                model:{
                    title:"房间状态",
                    buttons:[{
                        id:"return",
                        text:"返回",
                        show:false,
                        handler:function(){
                            if(widget.get("mark") == "0"){
                                //返回到全部页面
                                widget.show(".J-salestatus-total-content").hide([".J-salestatus-bindPeronToBed",".J-salestatus-unBindPeronToBed"]);
                                var subnav = widget.get("subnav");
                                subnav.show(["status"]).hide(["return"]);
                                subnav.setTitle("房间状态");
                            }else{
                                widget.hide([".J-salestatus-total-content",".J-salestatus-grid"]).show(".J-salestatus-content");
                                widget.set("mark","0");
                            }
                        }
                    }],
                     buttonGroup:[{
                        id:"status",
                        items:[{
                            key:"-1",
                            value:"全部",
                            icon:"icon-lock",
                            checked:false
                        }].concat(widget.get("model").status),
                        handler:function(key,element){
                            console.log('buttonGroup handler',key)
                            if(key == "-1"){
                                //TODO
                                widget.loadData();
                            }else {
                                widget.loadData(key);
                            }

                        }
                    }]
                }
            });
            this.set("subnav",subnav);

           // J-salestatus-bindPeronAndRoom
            var bindForm = new Form_1_0_0({
                parentNode:".J-salestatus-bindPeronToBed-form",
                cancelaction:function(){
                    widget.show(".J-salestatus-total-content").hide([".J-salestatus-bindPeronToBed",".J-salestatus-unBindPeronToBed"]);
                    var subnav = widget.get("subnav");
                    subnav.show(["status"]).hide(["return"]);
                    subnav.setTitle("房间状态");
                },
                saveaction:function(){
                    // widget.save("api/room/add",$("#room").serialize());
                    var card=widget.get("bindForm");
                    var bedToAdd = {}
                    bedToAdd.id = card.getValue("bedId")
                    bedToAdd.v = card.getValue("v")
                    bedToAdd.tgt = card.getValue("tgt")

                    if(!bedToAdd.tgt){
                        Dialog.alert({
                            content:"请选择权益人后绑定！"
                        })
                    }else{
                        aw.saveOrUpdate("hws/api/bed/book",JSON.stringify(bedToAdd),function(res){
                            console.log('save success', res)
                            // that.refreshList(that)
                            widget.show(".J-salestatus-total-content").hide([".J-salestatus-bindPeronToBed",".J-salestatus-unBindPeronToBed"]);
                            var subnav = widget.get("subnav");
                            subnav.show(["status"]).hide(["return"]);
                            subnav.setTitle("房间状态");
                            widget.loadData()
                        });
                    }

                },model:{
                    id:"bindPersonToBed",
                    saveText: '绑定权益人',
                    items:[{
                        name:"buildingName",
                        label:"楼宇",
                    },{
                        name:"level",
                        label:"楼层",
                    },{
                        name:"typeName",
                        label:"房型",
                    },{
                        name:"roomNumber",
                        label:"房间号",
                    },{
                        name:"bedId",
                        type:"hidden"
                    }, {
                        name:"code",
                        label:"床位号",
                    }, {
                        name:"person",
                        label:"权益人",
                    },{
                        name:"tgt",
                        type:"hidden"
                    },{
                        name:"v",
                        type:"hidden"
                    }]
                }
            })

            this.set("bindForm",bindForm);

            var unBindForm = new Form_1_0_0({
                parentNode:".J-salestatus-unBindPeronToBed",
                cancelaction:function(){
                    widget.show(".J-salestatus-total-content").hide([".J-salestatus-bindPeronToBed",".J-salestatus-unBindPeronToBed"]);
                    var subnav = widget.get("subnav");
                    subnav.show(["status"]).hide(["return"]);
                    subnav.setTitle("房间状态");
                },
                saveaction:function(){
                    var card=widget.get("unBindForm");
                    var bedToAdd = {}
                    bedToAdd.id = card.getValue("bedId")
                    bedToAdd.v = card.getValue("v")
                    // bedToAdd.tgt = card.getValue("tgt")
                    Dialog.confirm({
                        title:"提示",
                        content:"是否确认接触权益人绑定的床位？",
                        confirm:function(){
                            aw.saveOrUpdate("hws/api/bed/unbook",JSON.stringify(bedToAdd),function(res){
                                console.log('save success', res)
                                // that.refreshList(that)
                                widget.show(".J-salestatus-total-content").hide([".J-salestatus-bindPeronToBed",".J-salestatus-unBindPeronToBed"]);
                                var subnav = widget.get("subnav");
                                subnav.show(["status"]).hide(["return"]);
                                subnav.setTitle("房间状态");
                                widget.loadData()
                            });
                        }
                    })
                },model:{
                    id:"bindPersonToBed",
                    saveText: '解除绑定',
                    items:[{
                        name:"buildingName",
                        label:"楼宇",
                    },{
                        name:"level",
                        label:"楼层",
                    },{
                        name:"typeName",
                        label:"房型",
                    },{
                        name:"roomNumber",
                        label:"房间号",
                    }, {
                        name:"code",
                        label:"床位号",
                    }, {
                        name:"person",
                        label:"权益人",
                    },{
                        name:"bedId",
                        type:"hidden"
                    },{
                        name:"v",
                        type:"hidden"
                    }]
                }
            })

            this.set("unBindForm",unBindForm);

           var grid = new Grid({
                parentNode:".J-salestatus-bindPeronToBed-cardOwnerGrid",
                autoRender:false,
                model:{
                    head:{
                        title:"选择权益人"
                    },
                    columns:[
                        {
                        key:"operator",
                        name:"",
                        format:function(value,row){
                            // console.log('format',row)
                            return "<input class='J-person-checkbox' type='checkbox' data-pkPersonalCardownerName='"+row.name+"' data-pkPersonalCardowner='"+row.pkPersonalCardowner+"'/>";
                        }
                    },{
                        key:"name",
                        name:"姓名"
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
                        key:"phone",
                        name:"联系电话"
                    }]
                }
            });
            this.set("grid",grid);
        },
        afterInitComponent:function(params,widget){
            this.loadData();
            this.loadUserData()
            $('.J-salestatus-content').mixItUp();
        },
        loadData:function(status){
            var that = this;
            // var subnav = this.get("subnav");
            // status = status || subnav.getValue("status");
            var queryData = {
                fetchProperties : "*,building.pkBuilding,building.name,type.name",
                // useType:"Apartment"
            }
            // var status = false
            if(status){
                console.log('loadData', status)
                queryData.status = status
            }
            aw.ajax({
                url:"api/room/query",
                data:queryData,
                success:function(data){
                    console.log('api/room/query', data)
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
            if(flag==1){
                that.setData(datas);
            }
            if(flag==2){
                var model = widget.get("model");
                model.buildingDatas = datas;
                widget.renderPartial(".J-salestatus-content");
                $('.J-salestatus-content').mixItUp('filter', '.Empty,.OutRoomMaintenance');
            }
        },
        setData:function(data){
            // console.log('rooms', data)
            var buildingMap = {};
            this.setIcon(data);
            var that = this
            for(var i=0;i<data.length;i++){
                var item = data[i];
                var pkBuilding = item.building.pkBuilding;
                var level =  item.level;
                item.beds = [];
                if(!buildingMap[pkBuilding]){
                    buildingMap[pkBuilding] = {
                        "pkBuilding" : pkBuilding,
                        "name" : data[i].building.name,
                        "levels":{}}
                    buildingMap[pkBuilding].levels[level] = {"level":level,rooms:[item]}
                    //
                    /*buildingMap[pkBuilding]={
                        pkBuilding : pkBuilding,
                        name : data[i].building.name,
                        items:[]
                    };*/
                }else if(buildingMap[pkBuilding] && !buildingMap[pkBuilding].levels[level]) {
                    buildingMap[pkBuilding].levels[level] = {"level":level,rooms:[item]}
                }else{
                    buildingMap[pkBuilding].levels[level].rooms.push(item)
                }
                // buildingMap[pkBuilding].items.push(data[i]);


                // 查询床位信息
                // setTimeout(function () {
                    aw.saveOrUpdate('hws/api/bed/list2', JSON.stringify({"room": item.pkRoom}), function (res) {
                        console.log('bed list', res)
                        if(Array.isArray(res) && res.length > 0){
                            var bed = res[0]
                            var pkRoom = parseInt(bed.room)
                            var find = data.find(d => d.pkRoom === pkRoom)
                            find.beds = res
                            that.renderPartial(".J-salestatus-total-content");
                        }
                        // console.log('buildingMap', buildingMap)
                        console.log('room data', data)
                    })
                // },10)

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
                    // widget.hide([".J-salestatus-total-content",".J-salestatus-grid"]).show(".J-salestatus-content");
                    widget.get("subnav").hide(["status"]).show(["return"]);
                    widget.setIcon(data);
                    widget.setRoomBackToRentTag(data,2,widget);
                }
            });
        },
        // 查询权益人信息
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
                        data[index].personalInfo.pkPersonalCardowner = data[index].pkPersonalCardowner
                        arr.push(data[index].personalInfo)
                    }
                    var grid = widget.get("grid");
                    grid.setData(arr)
                    widget.get("model").personList = arr
                }
            });
        },
    });

    module.exports = SaleStatus;
});
