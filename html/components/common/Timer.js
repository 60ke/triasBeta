import React from "react"
/**
 * Timer components which displays:
 *
 * Params: 
 *      interval: the number to count down
 *      TimeChange: the type of the countdown
 * 
 *      eg: 
 *      <Timer interval={this.state.currentInfo.selectedEvent.time} TimeChange={'add'} /> 
 * 
 */
export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeCount: '',
            interval:0,
        }
    }
   
    transformTimeAdd(times) {
        this.intervalAdd(times)
    }
    
    changeTime(times) {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0;//时间默认值
        if (times > 0) {
            day = Math.floor(times / (60 * 60 * 24));
            hour = Math.floor(times / (60 * 60)) - (day * 24);
            minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (day <= 9) day = '0' + day;
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;

        this.setState({
            timeCount:hour + ":" + minute + ":" + second
        })
    }
    intervalAdd(times) {
        this.timerChange = setInterval(() => {
            times++;
            this.changeTime(times)
            
        }, 1000)
    }

    /**
     * When the component will be mounted.
     * Set the intervals 
     */
    componentDidMount() {
        this.dealTime(this.props.interval)
    }
    /**
     * Gets the current time and calculates the time countdown
     */
    dealTime(interval){
        let hour = interval.split(':')
        let currentTime = (new Date().getHours() - Number(hour[0]))*3600 +
                          (new Date().getMinutes() - Number(hour[1])) * 60 + 
                          (new Date().getSeconds() - Number(hour[2])) 
        // Countdown update
        this.transformTimeAdd(currentTime)
    }
    
    /**
     * Clear time interval when the component will be unmounted
     */
    
    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return;
        };
        // clear Countdown timer
        this.timerChange = clearInterval(this.timerChange)
    }
    componentWillReceiveProps(nextProps){
        if(this.props.interval!= nextProps.props){
            this.timerChange = clearInterval(this.timerChange)
            this.dealTime(nextProps.interval);
        }
    }
    componentWillUnmount() {
        this.setState = (state,callback)=>{
          return;
        };
    }
    render() {

        return (

            <span className="eventInterval">
                {
                    this.props.interval &&
                    <span >{this.state.timeCount}</span>
                }
                
            </span>



        )
    }
}