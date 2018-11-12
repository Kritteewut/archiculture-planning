import React from 'react';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { DateFormatInput } from 'material-ui-next-pickers'
import TimeInput from 'material-ui-time-picker'
import classNames from 'classnames';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Checkbox } from 'antd';
import moment from 'moment';

const CheckboxGroup = Checkbox.Group;
const days = [
  { label: 'จันทร์', value: 'mon', engLabel: 'Monday' },
  { label: 'อังคาร', value: 'tue', engLabel: 'Tuesday' },
  { label: 'พุธ', value: 'wed', engLabel: 'Wednesday' },
  { label: 'พฤหัสบดี', value: 'thu', engLabel: 'Thursday' },
  { label: 'ศุกร์', value: 'fri', engLabel: 'Friday' },
  { label: 'เสาร์', value: 'sat', engLabel: 'Saturday' },
  { label: 'อาทิตย์', value: 'sun', engLabel: 'Sunday' },
];

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
})

class TaskRepetition extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      taskRepetitionSwitch: false,
      isTaskRepetitionOpen: false,
      repetitionType: 'daily',
      repetitionDueType: 'forever',
      taskStartDate: new Date(),
      taskDueDate: new Date(),
      repetitionUnit: 1,
      repetitionTimes: 1,
      repetitionCountUnit: 'วัน',
      repetitionDayInWeek: this.getShowDay(moment().format('dddd')),
      isTaskStartDateError: false,
      isTaskDueDateError: false,
    }
  }
  componentWillReceiveProps(props) {
    if (props.taskRepetition) {
      this.setState({
        taskRepetitionSwitch: true,
        ...props.taskRepetition,
      })
      switch (props.repetitionType) {
        case 'daily': return this.setState({ repetitionCountUnit: 'วัน' })
        case 'weekly': return this.setState({ repetitionCountUnit: 'อาทิตย์' })
        case 'monthly': return this.setState({ repetitionCountUnit: 'เดือน' })
        case 'yearly': return this.setState({ repetitionCountUnit: 'ปี' })
        default: return;
      }
    }
  }
  handleTaskRepetitionClose = () => {
    this.setState({
      taskRepetitionSwitch: false,
      isTaskRepetitionOpen: false,
      repetitionType: 'daily',
      repetitionDueType: 'forever',
      taskStartDate: new Date(),
      taskDueDate: new Date(),
      repetitionUnit: 1,
      repetitionTimes: 1,
      repetitionCountUnit: 'วัน',
      repetitionDayInWeek: this.getShowDay(moment().format('dddd'))
    })
  }
  handleTaskRepetitionOpen = () => {
    this.setState({ isTaskRepetitionOpen: true })
  }
  handleSubmitEditTaskRepetition = () => {
    const { taskRepetitionSwitch, repetitionType, repetitionDueType, repetitionUnit, taskStartDate } = this.state
    var taskRepetition = { repetitionType, repetitionDueType, repetitionUnit, taskStartDate }
    if (taskRepetitionSwitch) {
      switch (repetitionType) {
        //case 'daily': break;
        case 'weekly':
          const { repetitionDayInWeek } = this.state
          taskRepetition = { repetitionDayInWeek, ...taskRepetition }
          break;
        //case 'monthly': break;
        //case 'yearly': break;
        default:
          break;
      }
      switch (repetitionDueType) {
        // case 'forever': break;
        case 'untilDate':
          const { taskDueDate } = this.state
          taskRepetition = { taskDueDate, ...taskRepetition }
          break;
        case 'times':
          const { repetitionTimes } = this.state
          const repetitionRemainTimes = repetitionTimes
          taskRepetition = { repetitionRemainTimes, repetitionTimes, ...taskRepetition }
          break;
        default:
          break;
      }
      this.props.onSetTaskRepetition(taskRepetition)
    } else {
      this.props.onSetTaskRepetition(null)
    }
    this.handleTaskRepetitionClose()
  }
  handleTaskRepetitionSwitch = (event) => {
    this.setState({ [event.target.name]: event.target.checked })
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onRepetitionUnitChange = (event) => {
    var RawRePetitionUnit = event.target.value
    var props = event.target.name
    var repetitionUnit
    if (RawRePetitionUnit > 99) {
      repetitionUnit = 99
    } else {
      if (RawRePetitionUnit < 1) {
        repetitionUnit = 1
      } else {
        repetitionUnit = RawRePetitionUnit
      }
    }
    this.setState({ [props]: repetitionUnit })
  }
  onChangeRepetitionType = (event) => {
    const repetitionType = event.target.value
    var repetitionCountUnit
    switch (repetitionType) {
      case 'daily': repetitionCountUnit = 'วัน'
        break;
      case 'weekly': repetitionCountUnit = 'อาทิตย์'
        break;
      case 'monthly': repetitionCountUnit = 'เดือน'
        break;
      case 'yearly': repetitionCountUnit = 'ปี'
        break;
      default: break;
    }
    this.setState({ repetitionCountUnit, repetitionType })
    this.onCheckTaskStartDateError()
  }
  onCheckTaskStartDateError = () => {

  }
  onDayCheckChange = (repetitionDayInWeek) => {
    if (repetitionDayInWeek.length === 0) {
      return;
    }
    //console.log(repetitionDayInWeek)
    this.setState({ repetitionDayInWeek })
  }
  getShowDay = (thisDay) => {
    days.map((day, index) => {
      if (thisDay === day.label || thisDay === day.engLabel) {
        //console.log([days[index].value], 'go')
        return [`${days[index].value}`]
      }
    })
  }
  onDateChange = name => date => {
    var format = this.onFormatedDateTime(date, this.state[name])
    this.setState({ [name]: format }, () => {

    })
  }
  onTimeChange = name => time => {
    var format = this.onFormatedDateTime(this.state[name], time)
    this.setState({ [name]: format }, () => {

    })
  }
  onFormatedDateTime = (date, time) => {
    var format = moment(date).minute(moment(time).minute())
    format = moment(format).hours(moment(time).hours()).toDate()
    return format
  }
  renderRepetitionDueType = () => {
    const { repetitionDueType, taskDueDate } = this.state
    const { classes } = this.props
    switch (repetitionDueType) {
      case 'forever': return
      case 'untilDate': return (
        <div>
          <DateFormatInput
            okToConfirm={true}
            dialog={true}
            name='date'
            value={taskDueDate}
            onChange={this.onDateChange('taskDueDate')}
          />
          <br />
          <TimeInput
            mode='24h'
            value={taskDueDate}
            onChange={this.onTimeChange('taskDueDate')}
            cancelLabel='ยกเลิก'
            okLabel='ตกลง'
            label="ชื่องาน"
            error={this.state.isTaskDueDateError}
          />
        </div>
      )
      case 'times': return (
        <FormControl
          className={classNames(classes.margin, classes.withoutLabel, classes.textField)}
          aria-describedby="times-helper-text"
        >
          <Input
            id="adornment-times"
            value={this.state.repetitionTimes}
            type="number"
            name="repetitionTimes"
            onChange={this.onRepetitionUnitChange}
            endAdornment={<InputAdornment position="end">ครั้ง</InputAdornment>}
            inputProps={{
              'aria-label': 'Weight',
            }}
          />
        </FormControl>
      )
      default: return;
    }
  }
  render() {
    const { classes } = this.props
    const { taskStartDate, taskRepetitionSwitch } = this.state

    return (
      <div>
        <Button
          onClick={this.handleTaskRepetitionOpen}
        >
          {
            taskRepetitionSwitch ?
              <div>
                {this.state.repetitionType},
              {this.state.repetitionDueType}
              </div>
              : 'ไม่มีการเกิดซ้ำ'
          }
        </Button>
        <Dialog
          open={this.state.isTaskRepetitionOpen}
          onClose={this.handleTaskRepetitionClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.taskRepetitionSwitch}
                  onChange={this.handleTaskRepetitionSwitch}
                  name="taskRepetitionSwitch"
                />
              }
              label={this.state.taskRepetitionSwitch ? 'เปิดอยู่' : "ปิดอยู่"}
            />
          </FormGroup>
          <DialogTitle
            id="alert-dialog-title"
          >
            {"การเกิดซ้้ำ"}
          </DialogTitle>
          <DialogContent>
            <form className={classes.root} autoComplete="off">
              <FormControl className={classes.formControl} disabled={!this.state.taskRepetitionSwitch}>
                <InputLabel
                  shrink
                  htmlFor="repetition-label-placeholder">
                  ลักษณะการเกิดซ้ำ
                </InputLabel>
                <Select
                  value={this.state.repetitionType}
                  onChange={this.onChangeRepetitionType}
                  input={<Input name="repetitionType" id="repetition-label-placeholder" />}
                  name="repetitionType"
                  className={classes.selectEmpty}
                >
                  <MenuItem value={'daily'}>ซ้ำทุกวัน</MenuItem>
                  <MenuItem value={'weekly'}>ซ้ำทุกอาทิตย์</MenuItem>
                  <MenuItem value={'monthly'}>ซ้ำทุกเดือน</MenuItem>
                  <MenuItem value={'yearly'}>ซ้ำทุกปี</MenuItem>
                </Select>
              </FormControl>
            </form>
            {this.state.repetitionType === 'weekly' ?
              <CheckboxGroup
                options={days}
                value={this.state.repetitionDayInWeek}
                onChange={this.onDayCheckChange} />
              :
              null
            }
            {this.state.taskRepetitionSwitch ?
              <div>
                <DateFormatInput
                  okToConfirm={true}
                  dialog={true}
                  name='date'
                  value={taskStartDate}
                  onChange={this.onDateChange('taskStartDate')}

                />
                <br />
                <TimeInput
                  mode='24h'
                  value={taskStartDate}
                  onChange={this.onTimeChange('taskStartDate')}
                  cancelLabel='ยกเลิก'
                  okLabel='ตกลง'
                  label="ชื่องาน"
                  error={this.state.isTaskStartDateError}
                />
                <FormControl
                  className={classNames(classes.margin, classes.withoutLabel, classes.textField)}
                  aria-describedby="weight-helper-text"
                >
                  <InputLabel htmlFor="component-simple">ทุก ๆ </InputLabel>
                  <Input
                    id="adornment-weight"
                    value={this.state.repetitionUnit}
                    type="number"
                    name="repetitionUnit"
                    onChange={this.onRepetitionUnitChange}
                    endAdornment={<InputAdornment position="end">{this.state.repetitionCountUnit}</InputAdornment>}
                    inputProps={{
                      'aria-label': 'Weight',
                    }}
                  />
                </FormControl>
              </div>
              :
              null
            }
            <form className={classes.root} autoComplete="off" >
              <FormControl className={classes.formControl} disabled={!this.state.taskRepetitionSwitch}>
                <InputLabel
                  shrink
                  htmlFor="due-repetition-label-placeholder">
                  กำหนดการสิ้นสุด
                </InputLabel>
                <Select
                  value={this.state.repetitionDueType}
                  onChange={this.handleChange}
                  input={<Input name="dueRepetitionType" id="due-repetition-label-placeholder" />}
                  name="repetitionDueType"
                  className={classes.selectEmpty}
                >
                  <MenuItem value={'forever'}>ตลอดไป</MenuItem>
                  <MenuItem value={'untilDate'}>จนถึงวันที่</MenuItem>
                  <MenuItem value={'times'}>เป็นจำนวนครั้ง</MenuItem>
                </Select>
              </FormControl>
            </form>
            {taskRepetitionSwitch ? this.renderRepetitionDueType() : null}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleSubmitEditTaskRepetition}
              color="primary" autoFocus
              disabled={this.state.isTaskDueDateError || this.state.isTaskStartDateError}
            >
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
export default withStyles(styles)(TaskRepetition)