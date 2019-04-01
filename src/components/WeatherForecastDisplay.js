import React from 'react'
import WheatherForecastLatLng from './WeatherForecastLatLng'
import WheatherForecastPlace from './WeatherForecastPlace'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { TMDAPIKey } from '../config/TMD'
import moment from 'moment';
import shortid from 'shortid'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import farm from '../components/Picture/Picfarm2.jpg'
import './WheatherForecaseDisplay.css'
import Sunny from './icons/sunny.png'
import Hot from './icons/hot.png'
import Cloudy from './icons/cloudy.png'
import Snowflake from './icons/snowflake.png'
import Snowflakes from './icons/snowflakes.png'
import Storm_thunder from './icons/storm_thunder.png'
import Rain from './icons/rain.png'
import Clouds from './icons/clouds.png'
import Cloud from './icons/cloud.png'
import Warning from './icons/warning.png'
import Weather_bachgound from './icons/weather_background.png'

const maxForecastDay = 30

function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}
class WeatherForecastDisplay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            wheatherForecast: [],
            forecastDays: 7,
            avgRain: 0,
            isWheaterOpen: false,
        }
    }
    onFetchWheatherForecast = (url) => {
        const { forecastDays } = this.state
        fetch(url, {
            method: "get",
            headers: {
                authorization: TMDAPIKey,
                accept: "application/json",
            },
        })
            .then(res => res.json())
            .then((result) => {
                const { forecasts, location } = result.WeatherForecasts[0]
                let avgRain = 0
                let forecastResult = forecasts.map(forecast => {
                    const key = shortid.generate()
                    const { tc_max, tc_min, rh, rain, cond } = forecast.data
                    avgRain += rain
                    return {
                        tc_max: `สูงสุด ${Math.round(tc_max)} °C`,
                        tc_min: `ต่ำสุด ${Math.round(tc_min)} °C`,
                        rh: `ความชื้นสัมพัทธเฉลี่ย ${Math.round(rh)} %`,
                        rain: `ปริมาณฝนรวม 24 ชม. ${rain} มิลลิเมตร`,
                        cond: this.onCompareCond(cond),
                        time: moment(forecast.time).format('dd Do MMM'),
                        key
                    }
                })
                console.log(location, 'lo')
                this.setState({ wheatherForecast: forecastResult, avgRain: `ปริมาณน้ำฝนเฉลี่ย ${forecastDays} วัน ${avgRain} มิลลิเมตร` })
            }, (error) => {
                console.log(error)
            })
    }
    onCompareCond = (cond) => {
        let condText, condPic
        switch (cond) {
            case 1:
                condText = 'ท้องฟ้าแจ่มใส'
                condPic = Sunny
                break;
            case 2:
                condText = 'มีเมฆบางส่วน'
                condPic = Cloud
                break;
            case 3:
                condText = 'มีเมฆเป็นส่วนมาก'
                condPic = Clouds
                break;
            case 4:
                condText = 'มีเมฆมาก'
                condPic = Clouds
                break;
            case 5:
                condText = 'ฝนตกเล็กน้อย'
                condPic = Rain
                break;
            case 6:
                condText = 'ฝนปานกลาง '
                condPic = Rain
                break;
            case 7:
                condText = 'ฝนตกหนัก '
                condPic = Rain
                break;
            case 8:
                condText = 'ฝนฟ้าคะนอง '
                condPic = Storm_thunder
                break;
            case 9:
                condText = 'อากาศหนาวจัด'
                condPic = Snowflakes
                break;
            case 10:
                condText = 'อากาศหนาว'
                condPic = Snowflake
                break;
            case 11:
                condText = 'อากาศเย็น '
                condPic = Snowflake
                break;
            case 12:
                condText = 'อากาศร้อนจัด'
                condPic = Hot
                break;
            default:
                condText = 'ไม่พบสภาพอากาศ'
                condPic = Warning
                break;
        }
        return { condPic, condText }
    }
    handleForecastDayChange = (event) => {
        const day = event.target.value
        if (isNaN(day) || day === '' || day < 1) {
            return
        }
        let setDay
        if (day > maxForecastDay) {
            setDay = maxForecastDay
        } else {
            setDay = day
        }
        this.setState({ forecastDays: setDay })
    }
    handleToggleWheaterDialog = () => {
        const { isWheaterOpen } = this.state
        this.setState({ isWheaterOpen: !isWheaterOpen })
    }
    render() {
        const { forecastDays, wheatherForecast, avgRain, isWheaterOpen } = this.state
        return (

            <div >
                <Button variant="outlined" color="primary" onClick={this.handleToggleWheaterDialog}>
                    พยากรณ์อากาศ
                </Button>
                <Dialog
                    open={isWheaterOpen}
                    onClose={this.handleToggleWheaterDialog}
                >
                    <DialogTitle>{"พยากรณ์อากาศ"}</DialogTitle>
                    <DialogContent >
                        <TextField
                            id="standard-number"
                            label="จำนวนวันพยากรณ์"
                            value={forecastDays}
                            onChange={this.handleForecastDayChange}
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />
                        <WheatherForecastLatLng
                            {...this.state}
                            onFetchWheatherForecast={this.onFetchWheatherForecast}
                        />
                        <WheatherForecastPlace
                            {...this.state}
                            onFetchWheatherForecast={this.onFetchWheatherForecast}
                        />

                        {avgRain}
                        <div >

                            {
                                wheatherForecast.map(forecast => {
                                    const { cond, rain, time, tc_max, tc_min, rh,key } = forecast
                                    const { condPic, condText } = cond
                                    return (
                                        <div
                                            key={key}
                                            style={{
                                                float: 'left',
                                                width: '30%',
                                                padding: '10px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div>{time}</div>
                                            <img src={condPic} />
                                            <div>{condText}</div>
                                            <div>{tc_max}</div>
                                            <div>{tc_min}</div>
                                            <div>{rain}</div>
                                            <div>{rh}</div>

                                        </div>
                                    )
                                })
                            }
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleToggleWheaterDialog} color="primary" autoFocus>
                            ปิด
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
export default WeatherForecastDisplay