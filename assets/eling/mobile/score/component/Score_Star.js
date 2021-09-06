import React from "react";

import Star from 'material-ui/lib/svg-icons/toggle/star';
import StarBorder from 'material-ui/lib/svg-icons/toggle/star-border';

import moment from "moment";

import aw from "el-wechat/lib/Ajaxwrapper";

var style = {width:"34px",height:"34px",fill:"#f56747"};

var Score_Stars = React.createClass({

    render(){
        var starts= [];
        for(var i=0;i<5;i++){
            if(i>=(this.props.data.score || 0)){
                starts.push(<StarBorder id={i} key={i} onTouchTap={this.handleTouch} style={style}/>);
            }else{
                starts.push(<Star id={i} key={i} onTouchTap={this.handleTouch} style={style}/>);
            }
        }

        return (
            <div>{starts}</div>
        );
    },

    handleTouch(e){
        var score = parseInt(e.currentTarget.id) + 1;
        aw.ajax({
            url : "api/serviceevaluation/save",
            data:{
                "personalInfo" : location.hash.substring(1),
                "evaluateDate" : moment().valueOf(),
                "appraisee" : this.props.data.pkUser,
                "score" : score,
                "evaluateType" : this.props._evaluateType
            },
            dataType : "json",
            success : function(data){
                if(data && data.msg == "保存成功"){
                    this.props.data.score = score;
                    this.forceUpdate();
                }
            }.bind(this),
            error: function(){
            }.bind(this)
        });
    }
});

export default Score_Stars;