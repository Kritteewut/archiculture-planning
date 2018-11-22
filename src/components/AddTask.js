import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import purple from '@material-ui/core/colors/purple';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    container: {
        margin: 'auto',
        width: '100%',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    cssLabel: {
        '&$cssFocused': {
            color: purple[500],
        },
    },
    cssFocused: {},
    cssUnderline: {
        '&:after': {
            borderBottomColor: purple[500],
        },
    },
    button: {
        margin: theme.spacing.unit,
        backgroundColor: '#00CCFF',
        color: 'white',
    },
});

class InputItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            taskName: '',
        }
    }

    handleOnchange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = () => {
        if (!this.state.taskName.trim()) {
            alert('กรุณากรอกชื่องาน')
            this.setState({ name: '', })
        } else {
            var task = {
                name: this.state.taskName,
                content: '',
                isDone: false,
                addTaskDate: new Date(),
            }
            this.props.onAddTask(task)
            this.setState({ name: '' })
        }
    }


    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <FormControl className={classes.margin}>
                    <TextField
                        className="DataTextPlan"
                        name='taskName'
                        value={this.state.taskName}
                        onChange={this.handleOnchange}
                        margin="normal"
                        label="ชื่องาน"
                    />
                    {/* <InputLabel
                        FormLabelClasses={{
                            root: classes.cssLabel,
                            focused: classes.cssFocused,
                        }}
                        htmlFor="custom-css-input"
                    >
                        เพิ่มงาน
                    </InputLabel>
                    <Input
                        classes={{
                            underline: classes.cssUnderline,
                        }}
                        id="custom-css-input"
                        name="name"
                        onChange={this.handleOnchange}
                        value={this.state.name}
                    /> */}
                </FormControl>
                <Button onClick={this.handleSubmit} variant="fab" className={classes.button}>
                    <AddIcon />
                </Button>
            </div>
        );
    }
}
InputItem.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputItem);