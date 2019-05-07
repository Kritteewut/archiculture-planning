import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import WeatherForecastInterface from './WeatherForecastInterface';
import moment from 'moment';

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
        }
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
            // let sumRain = 0
            // let forecastResult = forecasts.map(forecast => {
            //     const key = shortid.generate()
            //     const { tc_max, tc_min, rh, rain, cond } = forecast.data
            //     let tc_maxR = Math.round(tc_max)
            //     let tc_minR = Math.round(tc_min)
            //     let rhR = Math.round(rh)
            //     sumRain += rain
            //     return {
            //         tc_max: `${tc_maxR}`,
            //         tc_min: `${tc_minR}`,
            //         rh: `ความชื้นสัมพัทธเฉลี่ย ${rhR}%`,
            //         rain: `ปริมาณฝน ${rain} มม.`,
            //         cond: this.onCompareCond(cond),
            //         time: moment(forecast.time).format('dd Do MMM'),
            //         key
            //     }
            // })
            //this.setState({ riceCondition, isFetchingWeather: false })
        }
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
            return showText
        }
    }
    onGetRiceGuide = () => {
        const { plantDate } = this.state
        if (plantDate) {
            let days = moment().diff(moment(plantDate), 'd')
            if (inRange(days, 7, 14)) {
                return 'ช่วง 7-14 วัน หลังต้นกล้างอกปล่อยน้ำเข้านาไม่ให้ลึกเกิน 5 ซม. จากหน้าดิน'
            }
            if (inRange(days, 30, 59)) {
                return '30 วัน ปล่อยน้ำเข้านาให้สูงขึ้นเป็น 10 ซม. จากหน้าดินแล้วใส่ปุ๋ยเพื่อเร่งให้ข้าวแตกกอ'
            }
            if (inRange(days, 60, 69)) {
                return '60 วัน ระบายน้ำออกให้แห้ง'
            }
            if (inRange(days, 70, 99)) {
                return '70 วัน ปล่อยน้ำเข้านาสูง 10 ซม. สลับกับแห้ง 7 ครั้ง'
            }
            if (inRange(days, 100, 139)) {
                return '100 วัน ปล่อยน้ำเข้านาสูง 10 ซม. ในช่วงนี้แมลงศัตรูพเริ่มระบาด ต้องตรวขสอบแปลงบ่อย'
            }
            if (days >= 140) {
                return '140 วัน ระบายน้ำออกจากแปลงให้แห้ง รอเก็บเกี่ยว หลังจากข้าวออกดอก 30 วันให้เก็บเกี่ยวได้'
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
    render() {
        const { isWeatherAffectRiceOpen, isFetchingWeather, plantDate } = this.state
        return (
            <div>
                <Button onClick={this.handleToggleWeatherAffectRiceOpen}>
                    ผลกระทบจากสภาพอากาศ
                </Button>
                <Dialog
                    fullWidth
                    open={isWeatherAffectRiceOpen}
                    onClose={this.handleToggleWeatherAffectRiceOpen}
                >
                    <DialogTitle id="alert-dialog-title">{"สภาพอากาศที่มีผลกระต่อข้าว"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            onChange={this.handlePlantDateChange}
                            id="date"
                            label="วันที่ปลูก"
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
                        <div>
                            {
                                this.onGetRiceGuide()
                            }
                        </div>

                        <WeatherForecastInterface
                            onGetWeatherForecastResult={this.onGetWeatherForecastResult}
                            onSetFetchingWeather={this.onSetFetchingWeather}
                            isFetchingWeather={this.state.isFetchingWeather}
                        />
                        {
                            isFetchingWeather ?
                                'กำลังโหลด...'
                                :
                                <div>

                                </div>
                        }
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={this.onSubmitEditPlantDate}
                            color="primary">
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                        <Button onClick={this.handleToggleWeatherAffectRiceOpen} color="primary" autoFocus>
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