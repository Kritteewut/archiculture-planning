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
})

class TaskRepetition extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      taskRepetitionSwitch: false,
      isTaskRepetitionOpen: false,
      repetitionType: 'daily',
      dueRepetitionType: 'forever'
    }
  }
  componentWillReceiveProps(props) {
    if (props.TaskRepetition) {

    } else {

    }
  }
  handleTaskRepetitionToggle = () => {
    this.setState({ isTaskRepetitionOpen: !this.state.isTaskRepetitionOpen })
  }
  handleSubmitEditTaskRepetition = () => {
    this.props.onSetTaskRepetition(this.state.taskRepetitionSwitch)
    this.handleTaskRepetitionToggle()
  }
  handleTaskRepetitionSwitch = (event) => {
    this.setState({ [event.target.name]: event.target.checked })
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { classes } = this.props
    return (
      <div>
        <Button
          onClick={this.handleTaskRepetitionToggle}
        >
          ไม่มีการเกิดซ้ำ
        </Button>
        <Dialog
          open={this.state.isTaskRepetitionOpen}
          onClose={this.handleTaskRepetitionToggle}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Switch
            checked={this.state.taskRepetitionSwitch}
            onChange={this.handleTaskRepetitionSwitch}
            name="taskRepetitionSwitch"
          />
          <DialogTitle
            id="alert-dialog-title"
          >
            {"การเกิดซ้้ำ"}
          </DialogTitle>
          <DialogContent>
            <form className={classes.root} autoComplete="off">
              <FormControl className={classes.formControl}>
                <InputLabel
                  shrink
                  htmlFor="repetition-label-placeholder">
                  ลักษณะการเกิดซ้ำ
                </InputLabel>
                <Select
                  value={this.state.repetitionType}
                  onChange={this.handleChange}
                  input={<Input name="repetitionType" id="repetition-label-placeholder" />}
                  displayEmpty
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
            <form
              className={classes.root}
              autoComplete="off"
            >
              <FormControl className={classes.formControl}>
                <InputLabel
                  shrink
                  htmlFor="due-repetition-label-placeholder">
                  กำหนดการสิ้นสุด
                </InputLabel>
                <Select
                  value={this.state.dueRepetitionType}
                  onChange={this.handleChange}
                  input={<Input name="due-repetition" id="due-repetition-label-placeholder" />}
                  displayEmpty
                  name="dueRepetitionType"
                  className={classes.selectEmpty}
                >
                  <MenuItem value={'forever'}>ตลอดไป</MenuItem>
                  <MenuItem value={'untilDate'}>จนถึงวันที่</MenuItem>
                  <MenuItem value={'times'}>เป็นจำนวนครั้ง</MenuItem>
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleTaskRepetitionToggle} color="primary">
              ยกเลิก
            </Button>
            <Button onClick={this.handleSubmitEditTaskRepetition} color="primary" autoFocus>
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    )
  }
}
export default withStyles(styles)(TaskRepetition)