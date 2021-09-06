import React from "react";
const styles = {
    subHeader: {
        height: "54px",
        lineHeight: "54px",
        background: "#f5f5f9",
        fontSize: "24px",
        color: "#737373"
    },
    subHeaderTitle: {
        paddingLeft: "20px"
    }
}

var Activity_SubHeader = React.createClass({

    render(){
        return (
            <div style={styles.subHeader}>
                <span style={styles.subHeaderTitle}>活动报名列表</span>
                <span>（{this.props.length}）</span>
            </div>
        );
    }
});

export default Activity_SubHeader;