import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import WeatherForecastInterface from './WeatherForecastInterface';
import moment from 'moment';
import Sunny from './icons/sunny.png'
import Hot from './icons/hot.png'
import Snowflake from './icons/snowflake.png'
import Snowflakes from './icons/snowflakes.png'
import Storm_thunder from './icons/storm_thunder.png'
import Rain from './icons/rain.png'
import Clouds from './icons/clouds.png'
import Cloud from './icons/cloud.png'
import Warning from './icons/warning.png'
import shortid from 'shortid'
import './WeatherAffect.css';
import './Design.css';
import IconWeather from '@material-ui/icons/WbSunny';

const rice = {
    minGoodGrowth: 25,
    minCanGrowth1: 34,
    minCanGrowth2: 15,
    minStopGrowth: 14,
    maxGoodGrowth: 33,
    maxCanGrowth1: 40,
    maxCanGrowth2: 24,
    maxStopGrowth: 41,
}

class WeatherAffectRice extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isWeatherAffectRiceOpen: false,
            isFetchingWeather: false,
            riceCondition: [],
            plantDate: '',
            weatherForecast: [],
            avgRain: '',
            plantCondition: [],
            rainWarning: '',
            currentTime: moment().format('ll'),
        }
        this.currentTimeRef = null
    }
    componentDidMount() {
        //this.currentTimeRef = setInterval(this.onGetCurrentTime, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.currentTimeRef);
    }
    handleToggleWeatherAffectRiceOpen = () => {
        const { overlayPlantDate } = this.props.selectedOverlay
        let plantDate = ''
        if (overlayPlantDate) {
            plantDate = moment(overlayPlantDate).format().split('T')[0]
        }
        this.setState({
            isWeatherAffectRiceOpen: !this.state.isWeatherAffectRiceOpen,
            plantDate,
        })
    }
    handlePlantDateChange = (event) => {
        const plantDate = event.target.value
        this.setState({ plantDate })
    }
    onGetWeatherForecastResult = (result, forecastDays) => {
        if (result) {
            const { forecasts } = result.WeatherForecasts[0]
            let sumRain = 0
            let forecastResult = forecasts.map(forecast => {
                const key = shortid.generate()
                const { tc_max, tc_min, rain } = forecast.data
                let tc_maxR = Math.round(tc_max)
                let tc_minR = Math.round(tc_min)
                sumRain += rain
                return {
                    time: moment(forecast.time).format('dd Do MMM'),
                    tc_max: `${tc_maxR}`,
                    tc_max_cod: this.onCompareRiceCondition(tc_maxR),
                    tc_min: `${tc_minR}`,
                    tc_min_cod: this.onCompareRiceCondition(tc_minR),
                    rain: rain,
                    rain_warning: rain > 0 ? 'อาจมีฝนตก ระวังระดับน้ำในนา' : ' ',
                    key
                }
            })
            console.log(forecastResult)
            let avgRain = sumRain / forecasts.length
            this.setState({
                weatherForecast: forecastResult,
                avgRain: `ปริมาณน้ำฝนรวม ${forecastDays} วัน ${sumRain.toFixed(2)} มิลลิเมตร เฉลี่ย ${avgRain.toFixed(2)} มิลลิเมตรต่อวัน`,
                isFetchingWeather: false,
            })
        }
    }
    onSetPlantConditionText = (tmax, tmin, rain) => {
        let tmaxR = Math.round(tmax)
        let tminR = Math.round(tmin)
        let plantCondition = [
            {
                temperature: `ที่อุณหภูมิ ${tmaxR} °C`,
                condition: [
                    `${this.onCompareRiceCondition(tmaxR)}`,
                ],
                key: shortid.generate()
            },
            {
                temperature: `ที่อุณหภูมิ ${tminR} °C`,
                condition: [
                    `${this.onCompareRiceCondition(tminR)}`,
                ],
                key: shortid.generate()
            },
        ]
        this.setState({
            plantCondition,
            rainWarning: rain > 0 ? 'วันนี้มีฝนตก โปรดระวังระดับน้ำในนา' : ''
        })
    }
    onSetFetchingWeather = () => {
        this.setState({ isFetchingWeather: true })
    }
    onSubmitEditPlantDate = () => {
        const { plantDate } = this.state
        let formatedDate
        if (plantDate === '') {
            formatedDate = ''
        } else {
            formatedDate = moment(plantDate).toDate()
        }
        this.props.onEditOverlayPlantDate(formatedDate)
    }
    onShowOverlayPlantDate = () => {
        const { plantDate } = this.state
        if (plantDate) {
            let diffDate = moment().diff(moment(plantDate), 'd')
            let showText = ''
            if (diffDate >= 0) {
                showText = `ข้าวมีอายุ ${diffDate} วัน`
            } else {
                showText = `ข้าวยังไม่ถูกปลูก`
            }
            return (
                <div className="FrameWeatherRain">
                    <div>{showText}</div>
                    <div>{this.onGetRiceGuide()}</div>
                </div>)
        }
    }
    onGetRiceGuide = () => {
        const { plantDate } = this.state
        if (plantDate) {
            let days = moment().diff(moment(plantDate), 'd')
            if (inRange(days, 0, 14)) {
                return 'ระยะเตรียมเมล็ดพันธุ์ข้าวและปลูกด้วยการหยอด'
            }
            if (inRange(days, 15, 29)) {
                return 'ระยะต้นกล้างอก ปล่อยน้ำเข้านา วัดจากหน้าดินสูงไม่เกิน 5 ซม.'
            }
            if (inRange(days, 30, 59)) {
                return 'ระยะแตกกอ ปล่อยน้ำเข้าให้สูงขึ้นวัดจากหน้าดินสูง 10 ซม. ใส่ปุ๋ยครั้งแรกเพื่อเร่งให้ข้าวแตกกอ'
            }
            if (inRange(days, 60, 69)) {
                return 'ปล่อยให้แปลงให้แห้ง'
            }
            if (inRange(days, 70, 99)) {
                return 'ปล่อยน้ำเข้านาสูง 10 ซม. และปล่อยให้แปลงแห้ง ทำต่อเนื่อง 7 ครั้ง'
            }
            if (inRange(days, 100, 130)) {
                return 'ปล่อยน้ำเข้านาสูง 10 ซม. ในช่วงนี้แมลงศัตรูพเริ่มระบาด ต้องตรวขสอบแปลงบ่อย'
            }
            if (days >= 131) {
                return 'ระบายน้ำออกจากแปลงให้แห้ง รอเก็บเกี่ยว หลังจากข้าวออกดอก 28-30 วัน ให้เก็บเกี่ยวได้'
            }
        }

    }
    onCompareRiceCondition = (temperature) => {
        const { minStopGrowth, maxStopGrowth, minGoodGrowth,
            maxGoodGrowth, minCanGrowth1, maxCanGrowth1,
            minCanGrowth2, maxCanGrowth2 } = rice
        if (temperature <= minStopGrowth || temperature >= maxStopGrowth) {
            return 'ข้าวอาจเติบโตได้น้อยลง'
        }
        if (inRange(temperature, minGoodGrowth, maxGoodGrowth)) {
            return 'ข้าวเติบโตได้ดี'
        }
        if (inRange(temperature, minCanGrowth1, maxCanGrowth1) || inRange(temperature, minCanGrowth2, maxCanGrowth2)) {
            return 'ข้าวเติบโตได้'
        }
    }
    onGetCurrentTime = () => {
        this.setState({ currentTime: moment().format('LLLL') })
    }
    render() {
        const { isWeatherAffectRiceOpen, isFetchingWeather, plantDate, weatherForecast,
            avgRain, currentTime } = this.state
        return (
            <div>
                <Button variant="contained" className="buttonWeatherAffect" onClick={this.handleToggleWeatherAffectRiceOpen}>
                    ผลกระทบจากสภาพอากาศ . . .
                    <div className="rightIcon ButtonHowtoIconColor">
                        <IconWeather />
                    </div>
                </Button>
                <Dialog
                    fullWidth
                    open={isWeatherAffectRiceOpen}
                    onClose={this.handleToggleWeatherAffectRiceOpen}
                >
                    <DialogTitle id="alert-dialog-title">{"สภาพอากาศที่มีผลกระต่อข้าว"}</DialogTitle>
                    <DialogContent>
                        <WeatherForecastInterface
                            onGetWeatherForecastResult={this.onGetWeatherForecastResult}
                            onSetFetchingWeather={this.onSetFetchingWeather}
                            isFetchingWeather={this.state.isFetchingWeather}
                        />
                        <div className="FrameWeatherRain">วันนี้วันที่ {currentTime}</div>
                        <TextField

                            fullWidth
                            onChange={this.handlePlantDateChange}
                            id="date"
                            label="อายุข้าว"
                            type="date"
                            value={plantDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <div>
                            {
                                this.onShowOverlayPlantDate()
                            }
                        </div>
                        {
                            isFetchingWeather ?
                                'กำลังโหลด...'
                                :
                                <div>
                                    {avgRain && <div className="FrameWeatherRain">
                                        {avgRain}
                                    </div>}
                                    {weatherForecast.length > 0 ?
                                        weatherForecast.map(forecast => {
                                            const { time, key, tc_max, tc_min, tc_max_cod, tc_min_cod, rain, rain_warning } = forecast
                                            return (
                                                <div key={key} className="RiceCond">
                                                    <div>{time}</div>
                                                    <div>อุณหภูมิสูงสุด {tc_max} °C</div>
                                                    <div>{tc_max_cod}</div>
                                                    <div>อุณภูมิต่ำสุด {tc_min} °C</div>
                                                    <div>{tc_min_cod}</div>
                                                    <div>ปริมาณน้ำฝน {rain} มม.</div>
                                                    <div>{rain_warning}</div>
                                                </div>)
                                        })
                                        :
                                        'กดปุ่มพยากรณ์อากาศเพื่อดูผลกระทบ'
                                    }

                                </div>
                        }

                    </DialogContent>

                    <DialogActions>
                        <Button
                            variant="contained"
                            className="buttonContinueUpdate"
                            onClick={this.onSubmitEditPlantDate}
                        >
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                        <Button
                            variant="contained"
                            className="buttonNopeUpdate"
                            onClick={this.handleToggleWeatherAffectRiceOpen} autoFocus>
                            ยกเลิก
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
export default WeatherAffectRice

function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}