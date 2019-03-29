import React from 'react'
import WheatherForecastLatLng from './WeatherForecastLatLng'
import WheatherForecastPlace from './WeatherForecastPlace'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { TMDAPIKey } from '../config/TMD'
import moment from 'moment';
const maxForecastDay = 30

class WeatherForecastDisplay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            wheatherForecast: [],
            forecastDays: 7,
            avgRain: 0,

        }
    }
    onFetchWheatherForecast(url) {
        var self = this
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
                    const { tc_max, tc_min, rh, rain, cond } = forecast.data
                    avgRain += rain
                    //let checkCond = self.onCompareCond(cond)
                    return {
                        tc_max: `อุณหภูมิสูงสุด ${tc_max} °C`,
                        tc_min: `อุณหภูมิต่ำสุด ${tc_min} °C`,
                        rh: `ความชื้นสัมพัทธเฉลี่ย ${rh} %`,
                        rain: `ปริมาณฝนรวม 24 ชม. ${rain} มิลลิเมตร`,
                        cond: `สภาพอากาศโดยทั่วไป ${cond}`,
                        time: moment(forecast.time).format()
                    }
                })
                // avgRain = avgRain / forecasts.length
                // forecasts.forEach(forecast => {
                //     console.log(this.onCompareCond(1))
                // })
                console.log(forecastResult, avgRain)
            }, (error) => {
                console.log(error)
            })
    }
    onCompareCond = (cond) => {
        switch (cond) {
            case 1: return 'ท้องฟ้าแจ่มใส'
            case 2: return 'มีเมฆบางส่วน'
            case 3: return 'เมฆเป็นส่วนมาก'
            case 4: return 'มีเมฆมาก'
            case 5: return 'ฝนตกเล็กน้อย'
            case 6: return 'ฝนปานกลาง '
            case 7: return 'ฝนตกหนัก '
            case 8: return 'ฝนฟ้าคะนอง '
            case 9: return 'อากาศหนาวจัด'
            case 10: return 'อากาศหนาว'
            case 11: return 'อากาศเย็น '
            case 12: return 'อากาศร้อนจัด'
            default: return 'ไม่พบสภาพอากาศ'
        }
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
    render() {
        const { forecastDays } = this.state
        return (
            <div>
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
            </div>
        )
    }
}
export default WeatherForecastDisplay