import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';

var shortid = require('shortid');

const styles = theme => ({
    appBar: {
        position: 'relative',
        backgroundColor: '#00CCFF'
    },
    flex: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class TaskEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSave() {
        // var itemRef = db.collection('item').doc(id);

        // var sd = new Date(this.props.startDate);

        // console.log(sd);

        // var ed = new Date(this.props.endDate);
        // console.log(ed);

        var item = {
            name: document.getElementById("name").value,
            content: document.getElementById("content").value,
            startAt: document.getElementById("startAt").value,
            endAt: document.getElementById("endAt").value,
            id: this.props.item.id
        }
        this.props.editItem(item, this.props.selectedTaskIndex)
        this.props.handleToggleEditTask()
        // this.props.onArrayUpdate(id, item)
        //itemRef.update(item);
        //    var TT =  itemRef.doc(this.props.id).get()
        //         .then(function (hi) {

        //             var isd = new Date(hi.data().startDate.toDate());
        //             var ied = new Date(hi.data().endDate.toDate());
        //             var Bes = isd.toDateString();
        //             var Bee = ied.toDateString();
        //             var sdstring = moment(Bes).format('YYYY-MM-DD');
        //             var edstring = moment(Bee).format('YYYY-MM-DD');

        //          var  itemEdit = {
        //                 description: hi.data().description,
        //                 startDate: sdstring,
        //                 endDate: edstring,
        //                 taskName: hi.data().taskName,
        //                 id: hi.id,
        //             }
        //             TT.update(itemEdit)

        //             //console.log(doc.id, " => ", doc.data());
        //             console.log(itemRef, 'item Update ได้')
        //         })

        // .catch(function (error) {
        //     console.log("Error จ้า: ", error);
        // });

        // this.setState({
        // });
    }

    render() {
        const { item, classes, openEdit, handleToggleEditTask } = this.props;

        return (
            <div>
                <Dialog
                    fullScreen
                    open={openEdit}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}

                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={() => handleToggleEditTask()} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit" className={classes.flex}>
                                {item.name}
                            </Typography>
                            <Button color="inherit" onClick={() => this.handleSave()}>
                                save
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <main className={classes.layout}>
                        <Paper className={classes.paper}>
                            {item.isDone === false ?
                                <Form>
                                    <FormGroup>
                                        <Label for="taskName">ชื่องาน</Label>
                                        <Input id='name' type="text" name="taskName" defaultValue={item.name} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="startDate">วันเริ่มงาน</Label>
                                        <Input id='startAt' type="date" name="startDate" defaultValue={item.startAt} />
                                    </FormGroup>
                                    {' '}
                                    <FormGroup>
                                        <Label for="endDate">วันสิ้นสุดงาน</Label>
                                        <Input id='endAt' type="date" name="endDate" defaultValue={item.endAt} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="description">คำอธิบาย</Label>
                                        <Input id='content' type="textarea" name="description" defaultValue={item.content} />
                                    </FormGroup>
                                </Form>

                                :

                                <Form>
                                    <FormGroup>
                                        <Label for="taskName">ชื่องาน</Label>
                                        <Input id='name' type="text" name="taskName" value={item.name} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="startDate">วันเริ่มงาน</Label>
                                        <Input id='startAt' type="text" name="startDate" value={item.startAt} />
                                    </FormGroup>
                                    {' '}
                                    <FormGroup>
                                        <Label for="endDate">วันสิ้นสุดงาน</Label>
                                        <Input id='endAt' type="text" name="endDate" value={item.endAt} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="description">คำอธิบาย</Label>
                                        <Input id='content' type="textarea" name="description" value={item.content} />
                                    </FormGroup>
                                </Form>

                            }
                        </Paper>
                    </main>


                </Dialog>
            </div>
        )
    }
}

TaskEdit.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TaskEdit);