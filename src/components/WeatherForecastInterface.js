import React from 'react'
import WheatherForecastLatLng from './WeatherForecastLatLng'
import WheatherForecastPlace from './WeatherForecastPlace'
import TextField from '@material-ui/core/TextField';
import { TMDAPIKey } from '../config/TMD'
import PropTypes from 'prop-types';

const maxForecastDay = 126

class WeatherForecastInterface extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            forecastDays: 7,
        }
    }
    render() {
        const { forecastDays } = this.state
        const { isFetchingWeather } = this.props
        return (
            <div>
                <TextField
                    disabled={isFetchingWeather}
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
    onFetchWheatherForecast = (url) => {
        //console.log(url)
        this.props.onSetFetchingWeather()
        fetch(url, {
            method: "get",
            headers: {
                authorization: TMDAPIKey,
                accept: "application/json",
            },
        })
            .then(res => res.json())
            .then((result) => {
                this.props.onGetWeatherForecastResult(result, this.state.forecastDays)
            }, (error) => {
                console.log(error)
                this.props.onGetWeatherForecastResult(false, this.state.forecastDays)
            })
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
}
WeatherForecastInterface.propTypes = {
    onGetWeatherForecastResult: PropTypes.func.isRequired,
    onSetFetchingWeather: PropTypes.func.isRequired,
    isFetchingWeather: PropTypes.bool.isRequired,
};

export default WeatherForecastInterface