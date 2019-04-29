import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import WeatherForecastInterface from './WeatherForecastInterface';
import moment from 'moment';


class WeatherAffectRice extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isWeatherAffectRiceOpen: false,
            isFetchingWeather: false,
            weatherForecast: [],
            plantDate: '',
        }
    }
    // componentWillReceiveProps(props) {
    //     const { overlayPlantDate } = props.selectedOverlay
    //     if (overlayPlantDate) {
    //         this.setState({ plantDate: moment(overlayPlantDate).format().split('T')[0], })
    //     }
    // }
    componentDidMount() {
    }
    handleToggleWeatherAffectRiceOpen = () => {
        const { overlayPlantDate } = this.props.selectedOverlay
        this.setState({
            isWeatherAffectRiceOpen: !this.state.isWeatherAffectRiceOpen
        }) 
        if (overlayPlantDate) {
            this.setState({ plantDate: moment(overlayPlantDate).format().split('T')[0], })
        } 
    }
    handlePlantDateChange = (event) => {
        const plantDate = event.target.value
        this.setState({ plantDate })
    }
    onGetWeatherForecastResult = (result, forecastDays) => {
        if (result) {

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
                showText = `พืชมีอายุ ${diffDate} วัน`
            } else {
                showText = `พืชยังไม่ถูกปลูก`
            }
            return showText
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
                        {
                            this.onShowOverlayPlantDate()
                        }
                        <WeatherForecastInterface
                            onGetWeatherForecastResult={this.onGetWeatherForecastResult}
                            onSetFetchingWeather={this.onSetFetchingWeather}
                            isFetchingWeather={this.state.isFetchingWeather}
                        />
                        {
                            isFetchingWeather ?
                                'กำลังโหลด'
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