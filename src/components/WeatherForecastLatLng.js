import React from 'react'
import Button from '@material-ui/core/Button';

class WeatherForecastLatLng extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    onGetLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
            var accuracy = position.coords.accuracy
            var positions = { lat: position.coords.latitude, lng: position.coords.longitude }
            console.log(positions)
        })
    }
    render() {
        return (
            <Button onClick={this.onGetLocation}>พยากรณ์อากาศ</Button>
        )
    }
}
export default WeatherForecastLatLng