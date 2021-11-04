import React from "react";

import Score_SecretaryItem from "./Score_SecretaryItem";

var Score_Secretary = React.createClass({

    render(){
        return (
            <div>
                <div style={{margin:"20px 0 0 10px",color:"#737373",fontSize:"30px"}}>专属秘书</div>
                <div style={{textAlign:"center"}}>
                    {this.processScrretaryItem()}
                </div>
            </div>
        );
    },

    shouldComponentUpdate(nextProps){
        if(nextProps.secretaryScore == null){
            return false;
        }
        return true;
    },

    processScrretaryItem(){
        var secretary = this.props.secretary;
        var secretaryScore =this.props.secretaryScore;
        for(var i in secretary){
            for(var j in secretaryScore){
                if(secretaryScore[j].appraisee.pkUser == secretary[i].pkUser){
                	for(var key in secretaryScore[j]){
                		secretary[i][key] = secretaryScore[j][key];
                	}
                }
            }
        }
        return secretary.map(function(data,index,array){
            return <Score_SecretaryItem key={data.pkUser} data={data}/>
        });
    }
});

export default Score_Secretary;