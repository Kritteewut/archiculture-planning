import React from 'react';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import IconBook from '@material-ui/icons/Book';

import './Design.css';
import './HowTo.css';


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
                    <div className="paper">
                    
                    </div>
                </Modal>
            </div>
        )
    }
}

export default HowTo;