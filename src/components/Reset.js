import React from 'react';
import firebase from '../config/firebase';
// Material-ui Import
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

//Icon import
import logo from './Picture/Logo App.png'

// CSS Import
import './Login.css'
import './Reset.css'

/*const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});*/

class Reset extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    resetPass = (e) => {
        e.preventDefault();
        firebase.auth().sendPasswordResetEmail(this.state.email).then((u) => {
            alert('Password Reset Email Sent!');
        }).catch((error) => {
            console.log(error);
            alert('อีเมลที่ใส่ไม่ถูกต้อง')
        });
    }

    render() {

        return (

            <div className="loading container wrapper LoginFont">

                <p className="logo TextThemedarkColor"><img src={logo} className="App-logo" alt="logo" />

                    <br /> กรอก Email ที่สมัคร

                    </p>

                <div className="inputLogin">

                    <FormControl component="fieldset">
                        <FormGroup className="SetFrame">

                            <Grid container spacing={8} alignItems="flex-end">

                                <Grid className="TextThemedarkColor" item>
                                    <AccountCircle />
                                </Grid>

                                <Grid item>
                                    <TextField value={this.state.email} onChange={this.handleChange} name="email" type="email" id="exampleInputEmail" label="อีเมล" />
                                </Grid>

                            </Grid>

                        </FormGroup>
                    </FormControl>

                </div>

                <br />

                <div className="LoginButton">

                    <button type="submit" onClick={this.resetPass} className="loginBtnforEmail loginBtn--L">ยืนยัน</button>

                    <Button onClick={() => this.props.changePage('login')}>ย้อนกลับ</Button>

                </div>

                <div className="Framecolor">
                </div>

            </div >
        )
    }



}

export default Reset;