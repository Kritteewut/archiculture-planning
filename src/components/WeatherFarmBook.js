import React from 'react';

//Material Import
import Button from '@material-ui/core/Button';
import IconBook from '@material-ui/icons/ImportContacts';
import ListItem from '@material-ui/core/ListItem';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

//CSS Import
import './Design.css';
import './WeatherFarmBook.css';
import './HowTo'

//Picture Import
import pic1 from './Picture/ข้าว 1.png'
import pic2 from './Picture/ข้าว 2.png'
import pic3 from './Picture/ข้าวโพด 1.png'
import pic4 from './Picture/ข้าวโพด 2.png'
import pic5 from './Picture/อ้อย 1.png'
import pic6 from './Picture/อ้อย 2.png'
import pic7 from './Picture/มันสำปะหลัง 1.png'
import pic8 from './Picture/มันสำปะหลัง 2.png'


const riceGuideBook = [pic1, pic2,]
const cornGuideBook = [pic3, pic4,]
const sugarcaneGuideBook = [pic5, pic6,]
const cassavaGuideBook = [pic7, pic8,]



class HowTo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isHowToOpen: false,
            plantType: 'rice',
        }
    }

    onToggleHowToOpen = () => {
        this.setState({ isHowToOpen: !this.state.isHowToOpen })
    }
    onPlantTypeChange = (event) => {
        this.setState({ plantType: event.target.value })
    }
    renderGuideBook = () => {
        const { plantType } = this.state
        let plantArray
        switch (plantType) {
            case 'rice':
                plantArray = riceGuideBook
                break;
            case 'corn':
                plantArray = cornGuideBook
                break;
            case 'sugarcane':
                plantArray = sugarcaneGuideBook
                break;
            case 'cassava':
                plantArray = cassavaGuideBook
                break;
            default:
                break;
        }
        return plantArray.map((pic, key) => {
            return (
                <img src={pic} key={key} 
                alt="guide" 
                className="picHowto"
                />
            )
        })
    }
    render() {
        return (
            <div>
                <Button
                    variant="contained"
                    color="default"
                    className="buttonFarmBook"
                    onClick={this.onToggleHowToOpen}
                >

                    <div className="leftIcon ButtonHowtoIconColor">
                        <IconBook />
                    </div>

                    <div className="TextLargeSize">
                        คู่มือการดูแลพืช
                    </div>

                </Button>
                <Dialog
                    open={this.state.isHowToOpen}
                    onClose={this.onToggleHowToOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                    maxWidth={false}

                >
                    <DialogTitle id="alert-dialog-title">
                        {"คู่มือการดูแล : "}
                        <Select
                            value={this.state.plantType}
                            onChange={this.onPlantTypeChange}

                        >
                            <MenuItem value={'rice'}>ข้าว</MenuItem>
                            <MenuItem value={'corn'}>ข้าวโพด</MenuItem>
                            <MenuItem value={'cassava'}>มันสำปะหลัง</MenuItem>
                            <MenuItem value={'sugarcane'}>อ้อย</MenuItem>
                        </Select>
                    </DialogTitle>
                    <DialogContent>
                        {this.renderGuideBook()}
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default HowTo;

{/* <div
//className="paperFarmBook"
>

</div> */}