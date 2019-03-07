import React from "react"
import { Link } from 'react-router-dom'
// import ES6Promise from 'es6-promise'
// ES6Promise.polyfill() //关键代码,让ie识别promise对象!
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import $ from 'jquery'

import TimeAgo from 'javascript-time-ago'
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'

/**
 * RightPart components which displays:
 */
class RightPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CPU: "xxxxxxx",
            GPU: "xxxxxxx",
            Motherboard: "xxxxxxx",
            RAM: "xxxxxxx",
            SSD: "xxxxxxx",
            time:"0",
            activities:[]
        }
    }
    componentWillMount() {
        // Add locale-specific relative date/time formatting rules.
        TimeAgo.addLocale(en)
        
        // Create relative date/time formatter.
        const timeAgo = new TimeAgo('en-US')
        this.timeAgo = timeAgo;
    }

    componentDidMount() {
        this.getSpecifications();
        this.getActivities();

        this.activitiesInterval = setInterval(this.getActivities.bind(this),10000);
    }

    /**
     * 
     * Get the data for Simulations part
     *  
     */
    getSimulations() {
        var self = this;
        $.ajax({
            url:"/api/instant_message/",
            type:"GET",
            dataType:"json",
            success: function(data){
                // console.log("kiki",data)
                if(data.status == "success") {
                    self.setState({
                        CPU: data.result.CPU,
                        GPU: data.result.GPU,
                        Motherboard: data.result.Motherboard,
                        RAM: data.result.RAM,
                        SSD: data.result.SSD,
                    })
                }
            }
        })
    }

    /**
     * 
     * Get the data for Activities part
     *  
     */
    getActivities() {
        var self = this;
        let activities = []
        $.ajax({
            url:"/api/instant_message/",
            type:"GET",
            dataType:"json",
            success: function(data){
                console.log("kiki",data)
                if(data.status == "success") {
                    let time = data.result.node_time * 1000;
                    let overview = {
                        type: "overview",
                        time: self.timeAgo.format(time),
                        normal: data.result.normal_nodes.length,
                        offline: data.result.fault_nodes.length
                    }
                    // console.log("kiki",new Date().getTime(),data.result.node_time * 1000,time)
                    activities.push(overview);

                    let details = data.result.event;
                    for (let i = 0; i < details.length; i++){
                        let detail_time = details[i].time * 1000;
                        let detail = {
                                type: "detail",
                                time: self.timeAgo.format(detail_time),
                                info: details[i].event,
                                group: details[i].group,
                            
                        }
                        activities.push(detail);
                    }
                    activities = activities.concat(self.state.activities);
                    if (activities.length > 20) {
                        activities = activities.slice(0,20);
                    }
                    // let arr1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
                    console.log('kikikiki',activities);
                    self.setState({
                        activities: activities,
                    })
                }
            }
        })
    }

    /**
     * 
     * Get the data for Hardware Specifications part
     *  
     */
    getSpecifications() {
        var self = this;
        $.ajax({
            url:"/api/hardware_specifications/",
            type:"GET",
            dataType:"json",
            success: function(data){
                // console.log("kiki",data)
                if(data.status == "success") {
                    self.setState({
                    })
                }
            }
        })
    }
    
    /**
     * When the component will unmount.
     * Clear the intervals 
     */
    componentWillUnmount() {
        if(this.activitiesInterval) {
            clearInterval(this.activitiesInterval);
        }
    }
    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div className="right-part">
                <div className="simulations">
                    <p className="main-title"><FormattedMessage id="titleSimulations"/></p>
                    <div className="sim-data">
                        <p className="clearfix">
                            <span className="attr"><FormattedMessage id="simuLable1"/></span>
                            <span className="value">Haker Attack</span>
                        </p>
                        <p className="clearfix">
                            <span className="attr"><FormattedMessage id="simuLable2"/></span>
                            <span className="value">00:48:04</span>
                        </p>
                        <p className="clearfix">
                            <span className="attr"><FormattedMessage id="simuLable3"/></span>
                            <span className="value">1</span>
                        </p>
                    </div>
                    <p className="index">639 (38%)</p>
                    <p className="note percent-note"><FormattedMessage id="simuLable4"/></p>
                    <p className="index">437</p>
                    <p className="note"><FormattedMessage id="simuLable5"/></p>
                </div>

                <div className="activities">
                    <p className="main-title"><FormattedMessage id="termActivities"/></p>
                    <div className="transparent-bg"></div>
                    <div className="node-list">
                        {/* <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">{this.state.time}</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section> */}
                        {
                            this.state.activities.map(function(item, index){
                                return (
                                    <section className="item clearfix" key={"item"+index}>
                                        <div className="left">
                                            <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                            <p></p>
                                        </div>
                                        {
                                            item.type == "overview" && 
                                            <div className="right">
                                                <p className="line1">{item.time}</p>
                                                <p className="line2">{item.normal} Nodes Normal</p>
                                                <p className="line2">{item.offline} Nodes Offline</p>
                                                {/* <p className="line3">Ethereum</p> */}
                                            </div> 
                                        }
                                        {
                                            item.type == "detail" && 
                                            <div className="right">
                                                <p className="line1">{item.time}</p>
                                                <p className="line2">{item.info}</p>
                                                <p className="line3">
                                                    {item.group == 1 ?  "Ethereum" : (item.group == 0 ? "Trias": "Hyperledger")     
                                                        // 0 trias   1 eth    2 hyperledger 
                                                    }
                                                </p>
                                            </div> 
                                        }
                                       
                                    </section>
                                )
                            })
                        }
                        {/* <section className="item clearfix">
                            <div className="left">
                                <img src={require("../img/icon/activities/icon_activities_offline@2x.png")} />
                                <p></p>
                            </div>
                            <div className="right">
                                <p className="line1">Less than a minute</p>
                                <p className="line2">3 Nodes Recovered</p>
                                <p className="line3">Ethereum</p>
                            </div>
                        </section> */}
                    </div>
                    <Link to="/activities" className="view-all"><FormattedMessage id="btnViewAll"/></Link>
                </div>

                <div className="specifications">
                    <p className="main-title"><FormattedMessage id="titleHardwareSpecifications" /></p>
                    <section>
                        <p className="name">CPU</p>
                        <p className="detail">{ this.state.CPU }</p>
                    </section>
                    <section>
                        <p className="name">GPU</p>
                        <p className="detail">{ this.state.GPU }</p>
                    </section>
                    <section>
                        <p className="name">Motherboard</p>
                        <p className="detail">{ this.state.Motherboard }</p>
                    </section>
                    <section>
                        <p className="name">RAM</p>
                        <p className="detail">{ this.state.RAM }</p>
                    </section>
                    <section>
                        <p className="name">SSD</p>
                        <p className="detail">{ this.state.SSD }</p>
                    </section>
                </div>
            </div>
        )
    }
}

/* Inject intl to RightPart props */
const propTypes = {
    intl: intlShape.isRequired,
};
RightPart.propTypes = propTypes
export default injectIntl(RightPart)