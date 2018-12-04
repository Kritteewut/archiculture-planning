import React from 'react';
import firebase, { auth, provider, provider2 } from '../config/firebase';
import Register from './Register';
import Reset from './Reset';

//material Import
import Grid from '@material-ui/core/Grid';
import Lock from '@material-ui/icons/Lock';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';

//Icon import
import logo from './Picture/Logo App.png'

// CSS import
import './Login.css';
import './Design.css';


const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        color: 'rgb(0, 0, 0)',
        fontSize: '16px',
    },

    Theme: {
        color: 'rgb(0, 0, 0)',
    },

});

class Login extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            page: 'login',
        };
    }
    componentWillMount() {

    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    loginEmail = (e) => {
        e.preventDefault();
        var self = this
        var email = this.state.email
        var password = this.state.password
        firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
            var user = result.user;
            self.props.onSetUser(user)
        }).catch((error) => {
            alert("Username or Password incorrect")
            console.log(error);
        });
    }

    loginFacebook = () => {
        var self = this
        auth.signInWithPopup(provider).then(function (result) {
            var user = result.user;
            self.props.onSetUser(user)
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
    }

    loginGoogle = () => {
        var self = this;
        auth.signInWithPopup(provider2).then(function (result) {
            var user = result.user;
            self.props.onSetUser(user)
        }).catch(function (error) {
            console.log('เกิดข้อผิดพลาด : ', error)
        });

    }

    changePage = (page) => {
        this.setState({ page: page })
    }

    render() {
        const { classes } = this.props;
        switch (this.state.page) {
            case 'login':
                return (

                    //loading container wrapper LoginFont

                    <div className="container wrapper LoginFont ">

                        <p className="logo TextThemedarkColor">

                            <img src={logo} className="logo App-logo" alt="logo" />

                            <br />

                            Farm Plan

                        </p>


                        <div className="inputLogin">

                            <FormControl component="fieldset">

                                <FormGroup className="SetFrame">

                                    <Grid container spacing={8} alignItems="flex-end">

                                        <Grid className="TextThemedarkColor" item>
                                            <AccountCircle />
                                        </Grid>

                                        <Grid className={classes.Theme} item>
                                            <TextField className="TextWhite" value={this.state.email} onChange={this.handleChange} name="email" type="email" label="อีเมล" />
                                        </Grid>

                                    </Grid>

                                </FormGroup>

                                <FormGroup className="SetFrame">

                                    <Grid container spacing={8} alignItems="flex-end">

                                        <Grid className="TextThemedarkColor" item>
                                            <Lock />
                                        </Grid>

                                        <Grid item>
                                            <TextField value={this.state.password} onChange={this.handleChange} name="password" type="password" label="ป้อนรหัสผ่าน" />
                                        </Grid>

                                    </Grid>

                                </FormGroup>

                            </FormControl>
                        </div>

                        <br /><br />

                        <div className="LoginButton">
                            <button type="submit" onClick={this.loginEmail} className="loginBtnforEmail loginBtn--L TextThemedarkColor">
                            
                            <div className="TextThemeButton">Log In with email</div>

                            </button>

                            <br /><br />

                            <p className='TextThemedarkColor'> or </p>

                            <button className="loginBtn loginBtn--facebook" onClick={this.loginFacebook}>Log In with Facebook</button>
                            <button className="loginBtn loginBtn--google" onClick={this.loginGoogle}>Log In with Google</button><br />

                        </div>

                        <br />

                        <div className="regisBtn">
                            <Button onClick={() => this.changePage('register')} className={classes.button}>สมัครสมาชิก</Button>
                            <Button onClick={() => this.changePage('reset')} className={classes.button}>ลืมรหัสผ่าน</Button>
                        </div>

                        <div className="Framecolor">
                        </div>

                    </div>

                )
            case 'register':
                return (
                    <Register
                        changePage={this.changePage}
                    />
                )
            case 'reset':
                return (
                    <Reset
                        changePage={this.changePage}
                    />
                )
            default: return null
        }
    }

}

Login.propTypes = {

};

export default withStyles(styles)(Login);