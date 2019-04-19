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
import WeatherAffectCrops from './WeatherAffectCrops'
import './PermanentDrawer.css';

const maxForecastDay = 126
const rice = {
    minGoodGrowth: 25,
    maxGoodGrowth: 33,
    minCanGrowth1: 34,
    maxCanGrowth1: 40,
    minCanGrowth2: 15,
    maxCanGrowth2: 24,
    minStopGrowth: 14,
    maxStopGrowth: 41,
}
const corn = {
    minStopGrowth: 20,
    maxStopGrowth: 36,
    minGoodGrowth: 21,
    maxGoodGrowth: 27,
    minCanGrowth: 28,
    maxCanGrowth: 35,
}
const sugarcane = {
    minGoodGrowth: 18,
    maxGoodGrowth: 35,
    minStopGrowth: 17,
    maxStopGrowth: 36,
}
//มันสำปะหลัง
const cassava = {
    minStopGrowth: 15,
    maxStopGrowth: 40,
    minGoodGrowth: 25,
    maxGoodGrowth: 29,
    minCanGrowth1: 16,
    maxCanGrowth1: 24,
    minCanGrowth2: 30,
    maxCanGrowth2: 39,
}

class WeatherForecastDisplay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            weatherForecast: [],
            forecastDays: 7,
            avgRain: '',
            isWeaterOpen: false,
            isFetchingWeather: false,
            plantCondition: []
        }
    }
    componentWillMount() {
        // let url = 'https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly'
        // fetch(url, {
        //     method: "get",
        //     headers: {
        //         authorization: TMDAPIKey,
        //         accept: "application/json",
        //     },
        // })
        //     .then(res => res.json())
        //     .then((result) => {
        //         console.log(result)
        //     }, (error) => {
        //         console.log(error)
        //     })
    }
    onFetchWheatherForecast = (url) => {
        const { forecastDays } = this.state
        this.onSetFetchingWeather()
        fetch(url, {
            method: "get",
            headers: {
                authorization: TMDAPIKey,
                accept: "application/json",
            },
        })
            .then(res => res.json())
            .then((result) => {
                console.log(result)
                const { forecasts, location } = result.WeatherForecasts[0]
                let sumRain = 0
                let forecastResult = forecasts.map(forecast => {
                    const key = shortid.generate()
                    const { tc_max, tc_min, rh, rain, cond } = forecast.data
                    sumRain += rain
                    return {
                        tc_max: `สูงสุด ${Math.round(tc_max)} °C`,
                        tc_min: `ต่ำสุด ${Math.round(tc_min)} °C`,
                        rh: `ความชื้นสัมพัทธเฉลี่ย ${Math.round(rh)} %`,
                        rain: `ปริมาณฝนรวม 24 ชม. ${Math.round(rain)} มิลลิเมตร`,
                        cond: this.onCompareCond(cond),
                        time: moment(forecast.time).format('dd Do MMM'),
                        key
                    }
                })

                this.onSetPlantConditionText(forecasts)
                let avgRain = sumRain / forecasts.length
                this.setState({
                    weatherForecast: forecastResult,
                    avgRain: `ปริมาณน้ำฝนรวม ${forecastDays} วัน ${Math.round(sumRain)} มิลลิเมตร เฉลี่ย ${Math.round(avgRain)} มิลลิเมตรต่อวัน`,
                    isFetchingWeather: false
                })
            }, (error) => {
                console.log(error)
            })
    }
    onSetFetchingWeather = () => {
        this.setState({ isFetchingWeather: true })
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
    handleToggleWeaterDialog = () => {
        const { isWeaterOpen } = this.state
        this.setState({ isWeaterOpen: !isWeaterOpen })
    }
    onCompareRiceCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth,
            maxGoodGrowth, minCanGrowth1, maxCanGrowth1,
            minCanGrowth2, maxCanGrowth2 } = rice
        if (temperature < minStopGrowth || temperature > maxStopGrowth) {
            return 'ข้าวอาจหยุดการเจริญเติบโต'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'ข้าวเจริญเติบโตได้ดี'
        }
        if (inRange(temperature, minCanGrowth1, maxCanGrowth1) || inRange(temperature, minCanGrowth2, maxCanGrowth2)) {
            return 'ข้าวสามารถเติบโตได้'
        }
    }
    onCompareCassavaCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth,
            maxGoodGrowth, minCanGrowth1, maxCanGrowth1,
            minCanGrowth2, maxCanGrowth2 } = cassava
        if (temperature < minStopGrowth || temperature > maxStopGrowth) {
            return 'มันสำปะหลังอาจหยุดการเจริญเติบโต'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'มันสำปะหลังเจริญเติบโตได้ดี'
        }
        if (inRange(temperature, minCanGrowth1, maxCanGrowth1) || inRange(temperature, minCanGrowth2, maxCanGrowth2)) {
            return 'มันสำปะหลังสามารถเติบโตได้'
        }
    }
    onCompareCornCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth,
            maxGoodGrowth, minCanGrowth, maxCanGrowth, } = corn

        if (temperature < minStopGrowth || temperature > maxStopGrowth) {
            return 'ข้าวโพดอาจหยุดการเจริญเติบโต'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'ข้าวโพดหลังเจริญเติบโตได้ดี'
        }
        if (inRange(temperature, minCanGrowth, maxCanGrowth)) {
            return 'ข้าวโพดหลังสามารถเติบโตได้'
        }
    }
    onCompareSugarcaneCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth, maxGoodGrowth } = sugarcane
        if (temperature < minStopGrowth || temperature > maxStopGrowth) {
            return 'อ้อยอาจหยุดการเจริญเติบโต'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'อ้อยเจริญเติบโตได้ดี'
        }
    }
    onSetPlantConditionText = (forecasts) => {
        const { tc_max, tc_min } = forecasts[0].data
        let plantCondition = []
        let tmax = Math.round(tc_max)
        let tmin = Math.round(tc_min)
        plantCondition.push({
            tc_max: `ที่อุณหภูมิ ${tmax} °C ${this.onCompareRiceCondition(tmax)}`,
            tc_min: `ที่อุณหภูมิ ${tmin} ${this.onCompareRiceCondition(tmin)}`,
            key: 'rice'
        })
        plantCondition.push({
            tc_max: `ที่อุณหภูมิ ${tmax} °C ${this.onCompareCassavaCondition(tmax)}`,
            tc_min: `ที่อุณหภูมิ ${tmin} °C ${this.onCompareCassavaCondition(tmin)}`,
            key: 'cassava'
        })
        plantCondition.push({
            tc_max: `ที่อุณหภูมิ ${tmax} °C ${this.onCompareSugarcaneCondition(tmax)}`,
            tc_min: `ที่อุณหภูมิ ${tmin} °C ${this.onCompareSugarcaneCondition(tmin)}`,
            key: 'sugarcane'
        })
        plantCondition.push({
            tc_max: `ที่อุณหภูมิ ${tmax} °C ${this.onCompareCornCondition(tmax)}`,
            tc_min: `ที่อุณหภูมิ ${tmin} °C ${this.onCompareCornCondition(tmin)}`,
            key: 'corn'
        })
        this.setState({ plantCondition })
    }
    render() {
        const { forecastDays, weatherForecast, avgRain, isWeaterOpen, isFetchingWeather, plantCondition } = this.state
        return (

            <div>
                
                <Button variant="contained" className="buttonWeather" onClick={this.handleToggleWeaterDialog}>
                    พยากรณ์อากาศ
                </Button>

                <Dialog
                    open={isWeaterOpen}
                    onClose={this.handleToggleWeaterDialog}
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

                        {
                            isFetchingWeather ?
                                'กำลังโหลด...' :
                                <div>
                                    {/* <WeatherAffectCrops
                                        {...this.state}
                                    /> */}
                                    {
                                        plantCondition.map(plant => {
                                            return (
                                                <div
                                                    key={plant.key}
                                                >
                                                    <div>
                                                        {plant.tc_max}
                                                    </div>
                                                    <div>
                                                        {plant.tc_min}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    {avgRain}
                                    <div >

                                        {
                                            weatherForecast.map(forecast => {
                                                const { cond, rain, time, tc_max, tc_min, rh, key } = forecast
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
                                </div>
                        }

                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" className="buttonCloseWeather" onClick={this.handleToggleWeaterDialog} autoFocus>
                            ปิด
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
export default WeatherForecastDisplay


function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}