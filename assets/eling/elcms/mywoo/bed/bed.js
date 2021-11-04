define(function(require, exports, module) {
    var BaseView=require("baseview");
    var aw = require("ajaxwrapper");
    var Dialog=require("dialog-1.0.0");
    var store=require("store");

    require("./bed.css");

    var Room = BaseView.extend({
        events:{
            "click .J-bed-code": function (evt) {
                // console.log('click bed', evt)
                var that = this
                var bedId = $(evt.target).attr("data-id")
                var name = $(evt.target).text()
                // console.log('bed id', bedId)
                Dialog.confirm({
                    title:"提示",
                    content:"是否确认删除床位？",
                    confirm:function(){
                        // Dialog.close();
                        var token = store.get("token")
                        // data.status='Disused';
                        aw.ajax({
                            url : "hws/api/bed/deleteById?id="+bedId,
                            type : "DELETE",
                            beforeSend: function(request) {
                                request.setRequestHeader("Authorization", "Bearer "+token);
                            },
                            success : function(data){
                                // console.log('delete success', data)
                                // console.log(' that', that)
                                that.refreshList(that)
                                Dialog.close();
                                // (typeof successCallback === "function" ? successCallback : function(){})(data);
                            },
                            error : function(jqXHR, textStatus, errorThrown){
                                // console.log('error')
                                Dialog.close();
                                // (typeof errorCallback === "function" ? successCallback : function(){})(jqXHR, textStatus, errorThrown);
                            },
                            complete: function(){
                                // console.log('complete')
                                that.refreshList(that)
                            }
                        });
                        // aw.saveOrUpdate("hws/api/bed/deleteById",data,function(data){
                        //     that.refreshList(that)
                        //
                        // });
                    }
                })
                // var date = this.get("dateEL").getValue()
                // console.log('save date', date)
                // this.get("model").careRecToAdd.careDt = new Date(date)
                // this.saveCareRecord(this.get("model").careRecToAdd)
            },
        },
        initSubnav:function(widget){
            var that=this;
            return {
                model:{
                    title:"床位信息维护",
                    search:function(str) {
                        var g=widget.get("list");
                        g.loading();
                        aw.ajax({
                            url:"api/room/search",
                            data:{
                                s:str,
                                properties:"number,level,type.name,building.name,useType,status,description",
                                fetchProperties:"*,type.name,building.name",
                            },
                            dataType:"json",
                            success:function(data){
                                g.setData(data);
                                widget.list2Card(false);
                            }
                        });
                    },
                    buttons: [{
                        id:"return",
                        text:"返回",
                        type:"button",
                        show:false,
                        handler:function(){
                            that.list2Card(false);
                            return false;
                        }
                    }],
                    buttonGroup:[{
                        id:"buildings",
                        key:"pkBuilding",
                        value:"name",
                        url:"api/building/query",
                        lazy:true,
                        items:[],
                        // all: {show: true, text: "全部", position: "top"},
                        handler:function(key,element){
                            var items = this.items
                            // console.log('buildings',items)
                            // console.log('building query handler',key)
                            // widget.get("list").refresh(null,function (gridData) {
                            //     console.log('gridData', gridData)
                            // });
                            that.refreshList(widget)
                        }
                    },
                        /*{
                            id:"floors",
                            key:"level",
                            value:"name",
                            items:[{name:'1层',level:1}],
                            all: {show:
                                    true, text: "全部",
                                position: "top"},
                            handler:function(key,element){
                                // 筛选出对应楼层的房间
                                // widget.get("list").refresh();
                            }
                        }*/
                    ]
                }
            };
        },
        refreshList: function(widget){
            // console.log('refreshList')
            widget.get("list").refresh(null,function (gridData) {
                // console.log('gridData', gridData)
                if(Array.isArray(gridData) && gridData.length){
                    gridData.forEach(room => {
                        // console.log('pkroom', room.pkRoom)
                        // 根据pkRoom查询床位信息
                        // room.beds = [{"id":1,"room":room.pkRoom,code:"1"},{"id":2,"room":room.pkRoom,code:"2"}]
                        room.beds = []
                        aw.saveOrUpdate('hws/api/bed/list2',JSON.stringify({"room":room.pkRoom}),function(res){
                            // console.log('bed list', res)
                            room.beds = res
                            widget.get("list").setData(gridData)
                        })
                    })

                    // widget.get("list").setData(gridData)
                }
            });
        },
        initList:function(widget){
            return {
                autoRender:false,
                url : "api/room/query",
                params:function(){
                    return {
                        // level: 1,
                        fetchProperties:"*,type.name,building.name",
                        pkBuilding:widget.get("subnav").getValue("buildings")
                    };
                },
                model:{
                    columns:[{
                        key:"building.name",
                        name:"楼宇",
                    },{
                        key:"level",
                        name:"楼层"
                    },{
                        key:"number",
                        name:"房间号",
                        // format:"detail",
                        // formatparams:[{
                        //     key:"detail",
                        //     handler:function(index,data,rowEle){
                        //         widget.edit("detail",data);
                        //         return false;
                        //     }
                        // }]
                    },{
                        key:"type.name",
                        name:"房型"
                    },{
                        key:"beds",
                        name:"床位",
                        format:function(value, record){
                            // console.log('format beds', value)
                            var bed = "<div style='display:flex;flex-direction: row;flex-wrap: wrap;padding:4px;'>"
                            if(Array.isArray(value)){
                                value.forEach(v => {
                                    bed += "<div title='点击删除床位' class='text-theme J-bed-code' data-id='"+v.id+"'>"+v.code+"</div>";
                                    // bed += "<a class='text-theme J-bed-"+v.room+"_"+v.code+" href='javascript:void(0);' style='margin-left: 4px;'>床位"+v.code+"</a>&nbsp;&nbsp;"
                                })
                            }

                            bed += "</div>"
                            return bed;
                        }
                        // format:"detail"
                        // formatparams:[{
                        //     key:"detail",
                        //     handler:function(index,data,rowEle){
                        //         console.log('formatparams bedList', data)
                        //         return false;
                        //     }
                        // }]
                    },{
                        key:"operate",
                        name:"操作",
                        format:"button",
                        formatparams:[{
                            key:"add",
                            icon:"plus",
                            text:'新增床位',
                            handler:function(index,data,rowEle){
                                var card=widget.get("card");
                                widget.edit("edit",data);
                                card.setValue("room",data.pkRoom);
                                card.setValue("roomNumber",data.number)
                                card.setValue("typeName",data.type.name)
                                card.setValue("level",data.level)
                                card.setValue("buildingName",data.building.name)
                                card.setAttribute("roomNumber","readonly","readonly");
                                card.setAttribute("typeName","readonly","readonly");
                                card.setAttribute("level","readonly","readonly");
                                card.setAttribute("buildingName","readonly","readonly");
                                //判断当前房间状态不为空  则让房间状态在下列情况下不可编辑
                                // if(data.status != null &&
                                //     (data.status.key == 'InUse' || data.status.key == 'Appoint' || data.status.key == 'NotLive')){
                                //     card.setValue("status",data.status.key);
                                //     card.setAttribute("status","readonly","readonly");
                                // }else{
                                //     card.setData("status",[{key:"Empty",value:"空房"},{key:"Occupy",value:"占用"}]);
                                //     card.setValue("status",data.status.key);
                                // }
                                return false;
                            }
                        }
                        // ,{
                        //     key:"delete",
                        //     icon:"remove",
                        //     handler:function(index,data,rowEle){
                        //         widget.del("api/room/" + data.pkRoom + "/delete");
                        //         return false;
                        //     }
                        // }
                        ]
                    }]
                }
            };
        },
        initCard:function(widget){
            var that = this
            return {
                compType:"form-2.0.0",
                saveaction:function(){
                    // widget.save("api/room/add",$("#room").serialize());
                    var card=widget.get("card");
                    var bedToAdd = {}
                    bedToAdd.room = card.getValue("room")
                    bedToAdd.code = card.getValue("code")
                    widget.save("hws/api/bed/add",JSON.stringify(bedToAdd),function(res){
                        // console.log('save success', res)
                        that.refreshList(that)
                    });
                },
                model:{
                    id:"bed",
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
                        name:"room",
                        type:"hidden"
                    }, {
                        name:"code",
                        label:"床位号",
                        validate:["required"]
                    }]
                }
            };
        },
        afterInitComponent:function(params){
            var that = this
            var subnav=this.get("subnav");
            var grid=this.get("list");
            grid.loading();
            subnav.load({
                id:"buildings",
                callback:function(data){
                    // console.log('load buildings', data)
                    // 设置楼层数据
                    // if(Array.isArray(data) && data.length){
                    //     var b1 = data[0]
                    //     console.log('floors', b1.floors)
                    //     var floors = []
                    //     for(var i=0){}
                    //     subnav.setData("floors", floors)
                    // }
                    that.refreshList(that)
                    // grid.refresh(null,function (gridData) {
                    //     console.log('gridData', gridData)
                    // });
                }
            });
        }
    });
    module.exports = Room;
});
