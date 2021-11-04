define("eling/component/ui/date/1.0.0/dist/date",["jquery/jquery-plugins/datetimepicker/jquery.datetimepicker","eling/component/core/uicomponent/2.0.0/src/uicomponent","base","tools","handlebars","templatable","bootstrap","eling/component/utils/tools/tools","./date.tpl"],function(a,b,c){a("jquery/jquery-plugins/datetimepicker/jquery.datetimepicker");var d=a("eling/component/core/uicomponent/2.0.0/src/uicomponent"),e=a("eling/component/utils/tools/tools"),f=a("./date.tpl"),g=d.extend({attrs:{autoRender:!0,template:f,curReadonly:!1,curDisabled:!1,model:{id:null,className:null,style:null,name:null,placeholder:null,readonly:!1,disabled:!1,mode:"YYYY-MM-DD",triggerType:"button"}},initCustAttr:function(){var a=this.get("model");"button"==a.triggerType?(a.innerClassName="btn btn-theme",a.defaultValue=a.defaultDate?a.defaultDate:moment().format("YYYY-MM-DD")):a.innerClassName="form-control"},events:function(){var a=this.get("model"),b={},c=this.get("model").events;for(var d in c)b[d+" #"+a.id]=c[d];return b},afterRender:function(){var a=this,b=this.get("model"),c=this._transMode(b.mode),d=$.extend(!0,{closeOnDateSelect:!0,onSelectDate:function(a,c){if("function"==typeof b.handler){var d=moment(a).startOf("days").valueOf(),e=moment(a).endOf("days").valueOf();b.handler(d,e)}},lang:"zh",scrollInput:!1,scrollMonth:!1,defaultDate:!1,defaultTime:!1},b);d.onShow=function(){return a.get("curReadonly")||a.get("curDisabled")?!1:void(e.isFunction(b.onShow)&&b.onShow())},d.format=c,d.datepicker=-1!=c.indexOf("Y")?!0:!1,d.timepicker=-1!=c.indexOf("H")?!0:!1,d.defaultDate!==!1&&this.setValue(d.defaultDate),d.defaultTime!==!1&&this.setValue(d.defaultTime),b.readonly&&this.setReadonly(!0),b.disabled&&this.setDisabled(!0),this.$("input").datetimepicker(d)},getValue:function(){var a=this.get("model"),b=a.mode||"YYYY-MM-DD",c=this.$("input").val();return-1!=b.indexOf("YYYY-MM-DD")?c?moment(c).valueOf():"":c},setValue:function(a){if(null===a||void 0===a||""===a)return this.$("input").val(""),!1;var b=null,c=this.get("model"),d=c.mode;return"HH:mm"==d&&null!==a&&void 0!==a&&e.isString(a)?(this.$("input").val(a),!1):"HH:mm"==d&&null!==a&&void 0!==a?(this.$("input").val(moment(a).format("HH:mm")),!1):"HH:mm"==d&&null!==a&&void 0!==a?!1:(b=e.isString(a)?a:e.isDate(a)?moment(a).valueOf():"number"==typeof a?moment(a).valueOf():a.valueOf(),-1325491557e3>b&&(b+=357e3),void this.$("input").val(moment(b).format(d)))},setReadonly:function(a){this.set("curReadonly",a),a?this.$("input").attr("readonly","readonly"):this.$("input").removeAttr("readonly")},setDisabled:function(a){this.set("curDisabled",a),a?this.$("input").attr("disabled","disabled"):this.$("input").removeAttr("disabled")},reset:function(){var a=this.get("model");a.defaultDate!==!1?this.setValue(a.defaultDate):a.defaultTime!==!1?this.setValue(a.defaultTime):this.$("input").val(""),a.readonly?this.setReadonly(!0):this.setReadonly(!1),a.disabled?this.setDisabled(!0):this.setDisabled(!1)},getInstance:function(){return this.$("input")},destroy:function(){this.$("input").datetimepicker("destroy"),g.superclass.destroy.call(this,arguments)},_transMode:function(a){return a?a.replace("YYYY","Y").replace("MM","m").replace("DD","d").replace("HH","H").replace("mm","i"):"Y-m-d"}});c.exports=g}),define("eling/component/ui/date/1.0.0/dist/date.tpl",[],'<div class="el-date {{this.className}}" style="{{this.style}}">\n	<input id="{{this.id}}" name="{{this.name}}" class="{{this.innerClassName}}" style={{this.innerStyle}} \n	type="{{this.triggerType}}" value="{{this.defaultValue}}" placeholder="{{this.placeholder}}" {{this.validate}}/>\n</div>');