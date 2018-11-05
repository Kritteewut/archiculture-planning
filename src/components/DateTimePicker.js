import React from 'react'
import { DateFormatInput } from 'material-ui-next-pickers'
import TimeInput from 'material-ui-time-picker'

class DateTimePicker extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { date, time } = this.props
        return (
            <div>
                <DateFormatInput
                    okToConfirm={true}
                    dialog={true}
                    name='date'
                    value={date}
                    onChange={this.props.onChangeDate}
                />
                <br />
                <TimeInput
                    mode='24h'
                    value={time}
                    onChange={this.props.onChangeTime}
                    cancelLabel='ยกเลิก'
                    okLabel='ตกลง'
                />
            </div>
        )
    }
}
export default DateTimePicker