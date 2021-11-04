import React from "react";

const styles = {
    itemContainer:{
        marginTop:"10px",
        marginBottom:"10px",
        marginLeft:"20px"
    },
    label: {
        fontSize: "16px",
        color: "#b2b2b2",
        display: "inline-block",
        textAlign: "left",
        width: "30%",
        verticalAlign: "top"
    },
    value: {
        fontSize: "18px",
        color: "#737373",
        display: "inline-block",
        width: "70%",
        verticalAlign: "top"
    }
};

var HealthArchives_ListItem = React.createClass({
    render(){
        return (
            <div style={styles.itemContainer}>
                <span style={styles.label}>{this.props.label}：</span>
                <span style={styles.value}>{this.props.value}</span>
            </div>
        );
    }
});

export default HealthArchives_ListItem;
