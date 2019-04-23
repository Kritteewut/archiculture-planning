import React from 'react';

//Material Import
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import IconBook from '@material-ui/icons/Book';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

//CSS Import
import './Design.css';
import './WeatherFarmBook.css';

//Picture Import
import pic1 from './Picture/ข้าว 1.png'
import pic2 from './Picture/ข้าว 2.png'
import pic3 from './Picture/ข้าวโพด 1.png'
import pic4 from './Picture/ข้าวโพด 2.png'
import pic5 from './Picture/อ้อย 1.png'
import pic6 from './Picture/อ้อย 2.png'
import pic7 from './Picture/มันสำปะหลัง 1.png'
import pic8 from './Picture/มันสำปะหลัง 2.png'

const howToPic = [
    pic1,
    pic2,
    pic3,
    pic4,
    pic5,
    pic6,
    pic7,
    pic8,
]

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
                        คู่มือการดูแลพืช
                    </div>

                </Button>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.isHowToOpen}
                    onClose={this.onToggleHowToOpen}
                >
                    <div className="paperHowto">
                        {
                            howToPic.map((pic, key) => {
                                return (
                                    <ListItem
                                        key={key}
                                    >
                                        <img src={pic} className="picHowto"/>
                                    </ListItem>
                                )
                            })
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}

export default HowTo;