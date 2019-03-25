import React from 'react'
import WheatherForecastLatLng from './WeatherForecastLatLng'
import WheatherForecastPlace from './WeatherForecastPlace'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { TMDAPIKey } from '../config/TMD'
const maxForecastDay = 30

class WeatherForecastDisplay extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            wheatherForecast: null,
            forecastDays: 1,

        }
    }
    onFetchWheatherForecast(url) {

        fetch(url, {
            method: "get",
            headers: {
                authorization: TMDAPIKey,
                accept: "application/json",
            },
        })
            .then(res => res.json())
            .then((result) => {
                console.log(result.WeatherForecasts)
            }, (error) => {
                console.log(error)
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