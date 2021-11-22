define(function (require, exports, module) {

  var store = require("store");
  require("./status.css");
  var MixitupView = require('mixitupview');
  var Dialog = require("dialog-1.0.0");
  // var aw = require("ajaxwrapper");

  var HealthStatus = MixitupView.extend({
    attrs: {
      template: require("./status.tpl"),
      url: "api/room/status",
      // isCloseNav: true,
      model: {}
    },
    events: {
      "click button.filter": function (e) {
        var temp = $(e.target).attr("data-filter");
        if (temp == ".advancedAgememberstatus") {
          //首先获取到图标
          $(".J-pkMember a,.J-pkMember i").addClass("hidden");
          $(".icon-heart").parent().find(".J-member").removeClass("hidden");
          $(".icon-heart").removeClass("hidden");
        } else if (temp == ".isBirthDaymemberstatus") {
          $(".J-pkMember a,.J-pkMember i").addClass("hidden");
          $(".icon-gift").parent().find(".J-member").removeClass("hidden");
          $(".icon-gift").removeClass("hidden");
        } else if (temp == ".isAttentionmemberstatus") {
          $(".J-pkMember a,.J-pkMember i").addClass("hidden");
          $(".icon-star").parent().find(".J-member").removeClass("hidden");
          $(".icon-star").removeClass("hidden");
        } else if (temp == ".nursingHomememberstatus") {
          $(".J-pkMember a,.J-pkMember i").addClass("hidden");
          $(".icon-medkit").parent().find(".J-member").removeClass("hidden");
          $(".icon-medkit").removeClass("hidden");
        } else if (temp == ".hospitalmemberstatus") {
          $(".J-pkMember a,.J-pkMember i").addClass("hidden");
          $(".icon-hospital").parent().find(".J-member").removeClass("hidden");
          $(".icon-hospital").removeClass("hidden");
        } else if (temp == ".nursingHome_hospitalmemberstatus") {
          $(".J-pkMember a,.J-pkMember i").addClass("hidden");
          $(".icon-stethoscope").parent().find(".J-member").removeClass("hidden");
          $(".icon-stethoscope").removeClass("hidden");
        } else if (temp == ".planememberstatus") {
          $(".J-pkMember a,.J-pkMember i").addClass("hidden");
          $(".icon-plane").parent().find(".J-member").removeClass("hidden");
          $(".icon-plane").removeClass("hidden");
        } else if (temp == ".isBirthDaymemberstatus") {
          $(".J-pkMember a,.J-pkMember i").addClass("hidden");
          $(".icon-gift").parent().find(".J-member").removeClass("hidden");
          $(".icon-gift").removeClass("hidden");
        } else {
          $(".J-pkMember a,.J-pkMember i").removeClass("hidden");
        }


      },
      "click .J-wrench": function (e) {
        if ($(e.target).parents(".mix").hasClass("wrenchstatus")) {
          this.openView({
            url: "eling/elcms/property/repair/repair",
            params: {
              "place.room": $(e.target).parents(".mix").attr("data-key"),
              flowStatusIn: "Unarrange,Unrepaired,Unconfirmed",
              fetchProperties: "*,place.name," +
                "repairClassify.name," +
                "repairClassify.description," +
                "assetCard.code," +
                "repairDetails.operateType," +
                "repairDetails.createDate," +
                "repairDetails.user," +
                "repairDetails.user.name," +
                "repairDetails.maintainer.name," +
                "repairDetails.maintainer.pkMaintainer," +
                "repairDetails.maintainer.phone," +
                "repairDetails.maintainer.supplier.name",
            },
            forward: "status"
          });
        } else {
          Dialog.alert({
            title: "提示",
            content: "该房间目前没有报修记录"
          });
        }
      },
      "click .J-group": function (e) {
        if ($(e.target).parents(".mix").hasClass("templivestatus")) {
          var members = [];
          $(e.target).parents(".mix").find(".J-pkMember").each(function () {
            var key = $(this).attr("data-key");
            if (key) {
              members.push(key);
            }
          });
          this.openView({
            url: "eling/elcms/life/shack/shackapply/shackapply",
            params: {
              memberIn: members
            }
          });
        } else {
          Dialog.alert({
            title: "提示",
            content: "该房间目前无暂住人员"
          });
        }
      },
      "click .J-plane": function (e) {
        if ($(e.target).parents(".mix").hasClass("planestatus")) {
          var members = [];
          $(e.target).parents(".mix").find(".J-pkMember").each(function () {
            var key = $(this).attr("data-key");
            if (key) {
              members.push(key);
            }
          });
          this.openView({
            url: "eling/elcms/life/gooutrecord/gooutrecord",
            params: {
              memberIn: members,
              status: 'Out'
            }
          });
        } else {
          Dialog.alert({
            title: "提示",
            content: "该房间目前无会员外出"
          });
        }
      },
      "click .J-member": function (e) {
        var pkMember = $(e.target).parents(".J-pkMember").attr("data-key");
        var pkBuildling = this.get("subnav").getValue("building");
        this.openView({
          url: "eling/elcms/membercenter/memberstatus/memberstatus",
          params: {
            pkMember: pkMember,
            pkBuilding: pkBuildling
          },
          isAllowBack: true
        });
      },
      "click .J-rocket": function (e) {
        var widget = this;
        if ($(e.target).parents(".mix").hasClass("accompanystatus")) {
          var accompany = $(e.target).parents(".mix").attr("data-accompany");
          widget.openView({
            url: "eling/elcms/membercenter/member/member",
            params: {
              accompany: accompany,
            },
            isAllowBack: true
          });
        } else {
          Dialog.alert({
            title: "提示",
            content: "该房间目前没有陪住人"
          });
        };
      }

    },
    initSubnav: function (widget) {
      return {
        parentNode: ".J-subnav",
        model: {
          title: "入住全景",
          buttonGroup: [{
            id: "building",
            handler: function (key, element) {
              //重新查询数据
              widget.refresh({
                building: key,
                useType: "Apartment"
              });
            }
          }]
        }
      };
    },
    _setStatus: function (model) {
      //构建状态
      model.memberstatus = [{
        key: "isAlone",
        text: "独居",
        icon: "icon-asterisk"
      }, {
        key: "advancedAge",
        text: "高龄",
        icon: "icon-heart"
      }, {
        key: "isBirthDay",
        text: "生日",
        icon: "icon-gift"
      }, {
        key: "isAttention",
        text: "关注",
        icon: "icon-star"
      }, {
        key: "nursingHome",
        text: "颐养",
        icon: "icon-medkit"
      }, {
        key: "hospital",
        text: "住院",
        icon: "icon-hospital"
      }, {
        key: "nursingHome_hospital",
        text: "颐养且住院",
        icon: "icon-stethoscope"
      }, {
        key: "plane",
        text: "外出",
        icon: "icon-plane"
      }];
      model.roomstatus = [{
        key: "Empty",
        text: "空房",
        icon: "icon-lock"
      }, {
        key: "InUse",
        text: "使用中",
        icon: "icon-user"
      }, {
        key: "Occupy",
        text: "占用",
        icon: "icon-ban-circle"
      }, {
        key: "NotLive",
        text: "选房不住",
        icon: "icon-building"
      }, {
        key: "wrench",
        text: "维修",
        icon: "icon-wrench"
      }, {
        key: "templive",
        text: "暂住",
        icon: "icon-group"
      }, {
        key: "Waitting",
        text: "预入住",
        icon: "icon-signin"
      }, {
        key: "OutRoomMaintenance",
        text: "退房维修",
        icon: "icon-gears "
      }, {
        key: "Appoint",
        text: "已预约",
        icon: "icon-pushpin "
      }];
      return model;
    },
    //补齐数据
    _replenishData: function (data, model) {
      var results = [];
      var temp = {};
      var levelArray = [];

      var totalColLength = 0;
      var levelData = {};
      var length = data[0].room.number.length;
      for (var i = 0; i < data.length; i++) {
        var number = data[i].room.number;
        var roomNumber = parseInt(number.substring(length - 2));
        var levelNumber = number.substring(0, length - 2);
        if (!temp[roomNumber]) {
          temp[roomNumber] = roomNumber;
          levelArray.push(roomNumber);
          totalColLength += 1;
        }
        if (!levelData[levelNumber]) {
          levelData[levelNumber] = [];
        }
        levelData[levelNumber].push(data[i]);
      }

      //按楼层格式化数据
      for (var l in levelData) {
        var leveldata = levelData[l];
        if (leveldata.length != totalColLength) {
          for (var i in levelArray) {
            if (leveldata[i]) {
              var number = leveldata[i].room.number;
              if (parseInt(number.substring(number.length - 2)) != levelArray[i]) {
                leveldata.splice(i, 0, {
                  roomNumber: i + 1,
                  room: {
                    number: i + 1
                  },
                  show: false
                });
              }
            } else {
              leveldata.push({
                roomNumber: levelArray[i] + "",
                room: {
                  number: levelArray[i] + ""
                },
                show: false
              });
            }
          }
        }
        results = results.concat(leveldata);
      }

      model.items = results;
      model.width = (100 / totalColLength) + "%";
      return model;
    },
    _setRoomMemberStatus: function (model) {
      var data = model.items || [];
      for (var k = 0; k < data.length; k++) {
        if (!data[k].roomNumber) {
          if (data[k].room.status.key == "Empty") {
            data[k].isEmpty = true;
          }
          if (data[k].room.status.key == "InUse") {
            data[k].isInUse = true;
          }
          if (data[k].room.status.key == "NotLive") {
            data[k].isNotLive = true;
          }
          //***************
          if (data[k].room.status.key == "Waitting") {
            data[k].isWaitting = true;
          }
          if (data[k].room.status.key == "OutRoomMaintenance") {
            data[k].isOutRoomMaintenance = true;
          }
          if (data[k].room.status.key == "Appoint") {
            data[k].Appoint = true;
          }
          if (data[k].members && data[k].members.length == 1 && data[k].members[0].accompany === null) {
            //如果只有一个会员，并且，这个会员不带陪住人，才认为该会员是独居
            data[k].isAlone = true;
          }
          var members = data[k].members || [];
          for (var m = 0; m < members.length; m++) {
            //处理性别颜色
            if (members[m].sex.key == "MALE") {
              members[m].sexColor = "#00A2E8";
            } else {
              members[m].sexColor = "#FF538B";
            }
            //生日
            var birthday = moment(members[m].birthday);
            var date = moment();
            if (birthday.format("MM-DD") === date.format("MM-DD")) {
              members[m].isBirthDay = true;
            }
            //颐养且住院
            if (members[m].nursingHome && members[m].hospital) {
              members[m].nursingHome = false;
              members[m].hospital = false;
              members[m].nursingHome_hospital = true;
            }
          }
          if (members.length == 0) {
            members.push({});
            members.push({});
            data[k].members = members;
          } else if (members.length == 1) {
            members.push({});
          }
          data[k].show = true;
        }
      }
      return model;
    },
    _setFilter: function (model) {
      var items = model.items || [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].isAlone) {
          $(".mix").eq(i).addClass("isAlonememberstatus");
        }
        var members = items[i].members || [];
        for (var j = 0; j < members.length; j++) {
          var member = members[j];
          if (member.advancedAge) {
            $(".mix").eq(i).addClass("advancedAgememberstatus");
          }
          if (member.isBirthDay) {
            $(".mix").eq(i).addClass("isBirthDaymemberstatus");
          }
          if (member.concern) {
            $(".mix").eq(i).addClass("isAttentionmemberstatus");
          }
          if (member.goOut) {
            $(".mix").eq(i).find("a.J-plane").addClass("text-green");
            $(".mix").eq(i).addClass("planememberstatus");
          }
          if (member.repair) {
            $(".mix").eq(i).find("a.J-wrench").addClass("text-green");
            $(".mix").eq(i).addClass("wrenchstatus");
          }
          if (member.accompany) {
            $(".mix").eq(i).find("a.J-rocket").addClass("text-green");
            $(".mix").eq(i).addClass("accompanystatus");
            $(".mix").eq(i).attr("data-accompany", member.accompany);
          }
          if (member.shackapply) {
            $(".mix").eq(i).find("a.J-group").addClass("text-green");
            $(".mix").eq(i).addClass("templivestatus");
          }
          if (member.nursingHome) {
            $(".mix").eq(i).addClass("nursingHomememberstatus");
          }
          if (member.hospital) {
            $(".mix").eq(i).addClass("hospitalmemberstatus");
          }
          if (member.nursingHome_hospital) {
            $(".mix").eq(i).addClass("nursingHome_hospitalmemberstatus");
          }
        }
      }
    },
    setData: function (data) {
      var model = this.get("model") || {};
      var currentBuilding = this.get("subnav").getValue("building");
      if (currentBuilding) {
        //构建状态
        model = this._setStatus(model);
        //构建公寓
        model = this._replenishData(data || [], model);
        //设置房间和会员状态
        model = this._setRoomMemberStatus(model);
        this.renderPartial(".J-mixitup-container");
        //设置过滤状态
        this._setFilter(model);
      }
    },
    afterInitComponent: function (params) {
      var subnav = this.get("subnav");
      if (params && params.pkBuilding) {
        subnav.setValue("building", params.pkBuilding);
      }
      this.refresh({
        building: subnav.getValue("building"),
        useType: "Apartment"
      });
    },
    setEpitaph: function () {
      return {
        pkBuilding: this.get("subnav").getValue("building")
      };
    }
  });
  module.exports = HealthStatus;
});












