import React from 'react';
import firebase from '../config/firebase';
import PropTypes from 'prop-types';

//Material Import
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import TextField from '@material-ui/core/TextField';
import Lock from '@material-ui/icons/Lock';
import Button from '@material-ui/core/Button';

//Icon import
import logo from './Picture/Logo App.png'

//CSS import
import './Login.css'

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class Register extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    registerU = (e) => {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
            alert('Register Complete');
        }).catch((error) => {
            alert('username ที่ใส่ไม่ถูกต้อง หรือ ได้ถูกใช้ไปแล้ว')
            console.log(error);
        });

    }
    verifyEmail = (e) => {
        e.preventDefault();
        firebase.auth().currentUser.sendEmailVerification().then((u) => {
            alert("Please Check Your Mail", u);
        }).catch((error) => {
            console.log(error);
            alert("Error");
        });
    }
    render() {

        const { classes } = this.props;

        return (
            <div className="loading container wrapper LoginFont">

                <p className=" logoFrame logo TextThemedarkColor"><img src={logo} className="App-logo " alt="logo" />

                    <br /> สมัครสมาชิก </p>

                <div className="inputLogin">
                    <FormControl component="fieldset">
                        <FormGroup className="SetFrame">
                            <Grid container spacing={8} alignItems="flex-end">

                                <Grid className="TextThemedarkColor" item>
                                    <AccountCircle />
                                </Grid>

                                <Grid item>
                                    <TextField value={this.state.email} onChange={this.handleChange} name="email" type="email" id="exampleInputEmail1" label="อีเมล" aria-describedby="emailHelp" />
                                </Grid>

                            </Grid>
                        </FormGroup>

                        <FormGroup className="SetFrame">
                            <Grid container spacing={8} alignItems="flex-end">

                                <Grid className="TextThemedarkColor" item>
                                    <Lock />
                                </Grid>

                                <Grid item>
                                    <TextField value={this.state.password} onChange={this.handleChange} name="password" type="password" id="exampleInputPassword1" label="ป้อนรหัสผ่าน" />
                                </Grid>

                            </Grid>
                        </FormGroup>

                    </FormControl>

                </div>

                <br />

                <div className="LoginButton buttoncenterFrameregister">

                    <button type="submit" onClick={this.registerU} className="loginBtnforEmail loginBtn--L">ยืนยัน</button>

                    <Button onClick={() => this.props.changePage('login')} className={classes.button}>ย้อนกลับ</Button>

                </div>

                <div className="Framecolor">
                </div>

                <br />
            </div>
        )
    }
}


Register.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);