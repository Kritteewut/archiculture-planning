import React from 'react';

//Material Import
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import IconBook from '@material-ui/icons/Book';

//CSS Import
import './Design.css';
import './HowTo.css';

//Picture Import
import pic1 from './Picture/1.JPG'
import pic2 from './Picture/2.JPG'
import pic3 from './Picture/3.JPG'
import pic4 from './Picture/4.JPG'
import pic5 from './Picture/5.JPG'
import pic6 from './Picture/6.JPG'
import pic7 from './Picture/7.JPG'
import pic8 from './Picture/8.JPG'
import pic9 from './Picture/9.JPG'
import pic10 from './Picture/10.JPG'
import pic11 from './Picture/11.JPG'
import pic12 from './Picture/12.JPG'
import pic13 from './Picture/13.JPG'
import pic14 from './Picture/14.JPG'
import pic15 from './Picture/15.JPG'
import pic16 from './Picture/16.JPG'
import pic17 from './Picture/17.JPG'


class HowTo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isHowToOpen: false,
        }
    }

    onToggleHowToOpen = () => {
        this.setState({ isHowToOpen: !this.state.isHowToOpen })
    }

    render() {
        return (
            <div>
                <Button
                    variant="contained"
                    color="default"
                    className="buttonHowtoUse"
                    onClick={this.onToggleHowToOpen}
                >

                    <div className="leftIcon ButtonHowtoIconColor">
                        <IconBook />
                    </div>

                    <div className="TextLargeSize">
                        คู่มือการใช้งาน
                    </div>

                </Button>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.isHowToOpen}
                    onClose={this.onToggleHowToOpen}
                >
                    <div className="paperHowto">

                            <img src={pic1} className="picHowto"/>


                    </div>
                </Modal>
            </div>
        )
    }
}

export default HowTo;