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
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField'

const CheckboxGroup = Checkbox.Group;
const days = [
  { label: 'อาทิตย์', value: 0, },
  { label: 'จันทร์', value: 1, },
  { label: 'อังคาร', value: 2, },
  { label: 'พุธ', value: 3, },
  { label: 'พฤหัสบดี', value: 4, },
  { label: 'ศุกร์', value: 5, },
  { label: 'เสาร์', value: 6, },
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
const initState = {
  taskRepetitionSwitch: false,
  isTaskRepetitionOpen: false,
  repetitionType: 'daily',
  repetitionDueType: 'forever',
  taskStartDate: new Date(),
  repetitionDueDate: new Date(),
  repetitionUnit: 1,
  repetitionTimes: 1,
  repetitionCountUnit: 'วัน',
  repetitionDayInWeek: [parseInt(moment().format('d'), 10)],
  isTaskStartDateError: false,
  isTaskDueDateError: false,
  repetitionFinishTimes: 0,
}
class TaskRepetition extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = initState
  }
  handleTaskRepetitionClose = () => {
    this.setState({ isTaskRepetitionOpen: false })
  }
  handleTaskRepetitionOpen = () => {
    const { taskRepetition } = this.props
    if (taskRepetition) {
      this.setState({
        isTaskRepetitionOpen: true,
        taskRepetitionSwitch: true,
        ...taskRepetition,
      })
    } else {
      this.setState({
        ...initState,
        isTaskRepetitionOpen: true,
      })
    }
  }
  handleSubmitEditTaskRepetition = () => {
    const { taskRepetitionSwitch, repetitionType, repetitionDueType, repetitionUnit, taskStartDate } = this.state
    var taskRepetition = { repetitionType, repetitionDueType, repetitionUnit, taskStartDate }
    if (taskRepetitionSwitch) {
      switch (repetitionType) {
        case 'daily': break;
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
          const { repetitionDueDate } = this.state
          taskRepetition = { repetitionDueDate, ...taskRepetition }
          break;
        case 'times':
          const { repetitionTimes, repetitionFinishTimes } = this.state
          taskRepetition = { repetitionFinishTimes, repetitionTimes, ...taskRepetition }
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
    var int = parseInt(RawRePetitionUnit, 10)
    if (!int) {
      return;
    }
    var props = event.target.name
    var repetitionUnit
    if (int > 99) {
      repetitionUnit = 99
    } else {
      if (int < 1) {
        repetitionUnit = 1
      } else {
        repetitionUnit = int
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
    this.setState({
      repetitionCountUnit,
      repetitionType,
      isTaskDueDateError: false,
      isTaskStartDateError: false,
    }, () => {
      if (this.state.repetitionDueType === 'untilDate' || repetitionType === 'weekly') {
        this.onCheckTaskDueDateError()
        this.onCheckTaskStartDateError()
      }
    })
  }
  onDeuRepetitionTypeChange = (event) => {
    const { repetitionType } = this.state
    const repetitionDueType = event.target.value
    this.setState({
      repetitionDueType,
      isTaskDueDateError: false,
      isTaskStartDateError: false,
    }, () => {
      if (repetitionDueType === 'untilDate' || repetitionType === 'weekly') {
        this.onCheckTaskStartDateError()
        this.onCheckTaskDueDateError()
      }
    })
  }
  onCheckTaskStartDateError = () => {
    const { repetitionDueDate, taskStartDate, repetitionDueType } = this.state
    const dueDate = moment(repetitionDueDate)
    const startDate = moment(taskStartDate)
    if (this.onCheckDayInWeek() || ((repetitionDueType === 'untilDate') ? startDate.isAfter(dueDate) : false)) {
      this.setState({
        isTaskDueDateError: false,
        isTaskStartDateError: true,
      })
    } else {
      this.setState({
        isTaskDueDateError: false,
        isTaskStartDateError: false,
      })
    }
  }
  onCheckTaskDueDateError = () => {
    const { repetitionDueDate, taskStartDate } = this.state
    const dueDate = moment(repetitionDueDate)
    const startDate = moment(taskStartDate)
    if (this.onCheckDayInWeek() || dueDate.isBefore(startDate)) {
      this.setState({
        isTaskDueDateError: true,
        isTaskStartDateError: false,
      })
    } else {
      this.setState({
        isTaskDueDateError: false,
        isTaskStartDateError: false,
      })
    }
  }
  onCheckDayInWeek = () => {
    const { repetitionType, repetitionDayInWeek, taskStartDate } = this.state
    if (repetitionType === 'weekly') {
      const startDate = parseInt(moment(taskStartDate).format('d'), 10)
      var isError = true
      repetitionDayInWeek.forEach(day => {
        if (startDate === day) {
          isError = false
        }
      });
      return isError
    } else {
      return false
    }
  }
  onDayCheckChange = (repetitionDayInWeek) => {
    if (repetitionDayInWeek.length === 0) {
      return;
    }
    repetitionDayInWeek = repetitionDayInWeek.sort((a, b) => {
      return a - b
    })
    repetitionDayInWeek.forEach((day, key) => {
      repetitionDayInWeek[key] = parseInt(day, 10)
    })
    console.log(repetitionDayInWeek)
    this.setState({ repetitionDayInWeek }, () => this.onCheckTaskStartDateError())
  }
  onDateChange = name => date => {
    var format = this.onFormatedDateTime(date, this.state[name])
    this.setState({ [name]: format }, () => this.onCheckDateTimeError(name))
  }
  onTimeChange = name => time => {
    var format = this.onFormatedDateTime(this.state[name], time)
    this.setState({ [name]: format }, () => this.onCheckDateTimeError(name))
  }
  onCheckDateTimeError = (name) => {
    const { repetitionDueType, repetitionType } = this.state
    if (repetitionDueType === 'untilDate' || repetitionType === 'weekly') {
      switch (name) {
        case 'repetitionDueDate': return this.onCheckTaskDueDateError()
        case 'taskStartDate': return this.onCheckTaskStartDateError()
        default:
          return;
      }
    }
  }
  onFormatedDateTime = (date, time) => {
    var format = moment(date).minute(moment(time).minute())
    format = moment(format).hours(moment(time).hours()).toDate()
    return format
  }
  onShowCountUnit = () => {
    const { repetitionType } = this.state
    switch (repetitionType) {
      case 'daily': return 'วัน'
      case 'weekly': return 'อาทิตย์'
      case 'monthly': return 'เดือน'
      case 'yearly': return 'ปี'
      default: return;
    }
  }
  onShowSummaryCountUnit = () => {
    const { repetitionUnit } = this.state
    switch (repetitionUnit) {
      case 1: return `ทุก${this.onShowCountUnit()}`;
      case 2: return `${this.onShowCountUnit()}เว้น${this.onShowCountUnit()}`;
      default: return `${this.onShowCountUnit()}เว้น${repetitionUnit}${this.onShowCountUnit()}`;
    }
  }
  renderRepetitionDueType = () => {
    const { repetitionDueType, repetitionDueDate } = this.state
    const { classes } = this.props
    switch (repetitionDueType) {
      case 'forever': return
      case 'untilDate': return (
        <div>
          <DateFormatInput
            okToConfirm={true}
            dialog={true}
            name='date'
            value={repetitionDueDate}
            onChange={this.onDateChange('repetitionDueDate')}
          />
          <br />
          <FormControl className={classes.formControl} error aria-describedby="component-error-text">
            <TimeInput
              mode='24h'
              value={repetitionDueDate}
              onChange={this.onTimeChange('repetitionDueDate')}
              cancelLabel='ยกเลิก'
              okLabel='ตกลง'
              label="ชื่องาน"
              error={this.state.isTaskDueDateError}
            />
            {this.state.isTaskDueDateError ?
              <FormHelperText id="component-error-text">วันที่หรือเวลาที่กำหนดผิด</FormHelperText> : null
            }
          </FormControl>

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
    const { classes, taskRepetition } = this.props
    const { taskStartDate, taskRepetitionSwitch } = this.state

    return (
      <div>
        <Button
          onClick={this.handleTaskRepetitionOpen}
        >
          {
            taskRepetition ?
              <div>
                {taskRepetition.repetitionType},
              {taskRepetition.repetitionDueType}
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
              <div>
                วันที่เริ่มงานต้องเป็นวันใดวันหนึ่งของวันที่เลือก
                <CheckboxGroup
                  options={days}
                  value={this.state.repetitionDayInWeek}
                  onChange={this.onDayCheckChange} />
              </div>
              :
              null
            }
            {this.state.taskRepetitionSwitch ?
              <div>
                <DateFormatInput
                  label='วันเริ่มงาน'
                  okToConfirm={true}
                  dialog={true}
                  name='date'
                  value={taskStartDate}
                  onChange={this.onDateChange('taskStartDate')}

                />
                <br />
                <FormControl className={classes.formControl} error aria-describedby="component-error-text">
                  <TimeInput
                    mode='24h'
                    value={taskStartDate}
                    onChange={this.onTimeChange('taskStartDate')}
                    cancelLabel='ยกเลิก'
                    okLabel='ตกลง'
                    label="ชื่องาน"
                    error={this.state.isTaskStartDateError}
                  />
                  {this.state.isTaskStartDateError ?
                    <FormHelperText id="component-error-text">วันที่หรือเวลาที่กำหนดผิด</FormHelperText> : null
                  }
                </FormControl>
                <TextField
                  id="standard-helperText"
                  label={`หน่วย${this.onShowCountUnit()}`}
                  type="number"
                  name="repetitionUnit"
                  onChange={this.onRepetitionUnitChange}
                  value={this.state.repetitionUnit}
                  className={classes.textField}
                  helperText={`ทำ${this.onShowSummaryCountUnit()}`}
                  margin="normal"
                />
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
                  onChange={this.onDeuRepetitionTypeChange}
                  input={<Input name="repetitionDueType" id="due-repetition-label-placeholder" />}
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