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
                        tc_max: `อุณหภูมิสูงสุด ${Math.round(tc_max)} °C`,
                        tc_min: `อุณหภูมิต่ำสุด ${Math.round(tc_min)} °C`,
                        rh: `ความชื้นสัมพัทธเฉลี่ย ${rh} %`,
                        rain: `ปริมาณฝนรวม 24 ชม. ${rain} มิลลิเมตร`,
                        cond: this.onCompareCond(cond),
                        time: moment(forecast.time).format('ll'),
                        key
                    }
                })
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
                condPic = 1
                break;
            case 2:
                condText = 'มีเมฆบางส่วน'
                condPic = 1
                break;
            case 3:
                condText = 'มีเมฆเป็นส่วนมาก'
                condPic = 1
                break;
            case 4:
                condText = 'มีเมฆมาก'
                condPic = 1
                break;
            case 5:
                condText = 'ฝนตกเล็กน้อย'
                condPic = 1
                break;
            case 6:
                condText = 'ฝนปานกลาง '
                condPic = 1
                break;
            case 7:
                condText = 'ฝนตกหนัก '
                condPic = 1
                break;
            case 8:
                condText = 'ฝนฟ้าคะนอง '
                condPic = 1
                break;
            case 9:
                condText = 'อากาศหนาวจัด'
                condPic = 1
                break;
            case 10:
                condText = 'อากาศหนาว'
                condPic = 1
                break;
            case 11:
                condText = 'อากาศเย็น '
                condPic = 1
                break;
            case 12:
                condText = 'อากาศร้อนจัด'
                condPic = 1
                break;
            default:
                condText = 'ไม่พบสภาพอากาศ'
                condPic = 1
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
            <div>
                <Button variant="outlined" color="primary" onClick={this.handleToggleWheaterDialog}>
                    พยากรณ์อากาศ
                </Button>
                <Dialog
                    open={isWheaterOpen}
                    onClose={this.handleToggleWheaterDialog}
                >
                    <DialogTitle>{"พยากรณ์อากาศ"}</DialogTitle>
                    <DialogContent>
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
                        <div>
                            {
                                wheatherForecast.map(forecast => {
                                    const { cond, rain, time, tc_max, tc_min, rh } = forecast
                                    const { condPic, condText } = cond
                                    return (
                                        <div
                                            key={forecast.key}
                                            style={{
                                                float: 'left',
                                                width: '33.33%',
                                                height: '33.33%',
                                                padding: '5px',
                                                textAlign: 'center',
                                                border: 'solid',
                                            }}
                                        >
                                            <div>{time}</div>
                                            <div>{condText}</div>
                                            <div>{rain}</div>
                                            <div>{rh}</div>
                                            <div>{tc_max}</div>
                                            <div>{tc_min}</div>
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