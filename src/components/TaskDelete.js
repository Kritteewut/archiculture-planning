import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

var shortid = require('shortid');

const styles = {
};

class TaskDelete extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    handleDelete(item, close) {
        this.props.deleteItem(item)
        this.props.handleToggleDeleteTask(close)
    }

    render() {
        const { handleToggleDeleteTask, item, isDeleteTaskOpen } = this.props;

        return (
            <div>
                <Dialog
                    open={isDeleteTaskOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"ยืนยันการลบ"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            หากลบงานที่เลือกแล้ว จะไม่สามารถกู้คืนได้
            </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleToggleDeleteTask()} color="primary">
                            ยกเลิก
            </Button>
                        <Button onClick={() => this.handleDelete(item, false)} color="primary" autoFocus>
                            ลบงาน
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

TaskDelete.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TaskDelete);