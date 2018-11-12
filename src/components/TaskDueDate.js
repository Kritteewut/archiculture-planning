import React from 'react'
import { DateFormatInput } from 'material-ui-next-pickers'
import TimeInput from 'material-ui-time-picker'

class DateTimePicker extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { taskDueDate, taskDueTime } = this.props
        return (
            <div>
                <DateFormatInput
                    okToConfirm={true}
                    dialog={true}
                    name='date'
                    value={taskDueDate}
                    onChange={this.props.onDueDateChange}
                />
                <br />
                <TimeInput
                    mode='24h'
                    value={taskDueTime}
                    onChange={this.props.onDueTimeChange}
                    cancelLabel='ยกเลิก'
                    okLabel='ตกลง'
                    label="ชื่องาน"
                />
            </div >
        )
    }
}
export default DateTimePicker