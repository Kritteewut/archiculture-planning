import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
//CSS Import
import './OverlayDetail.css';


class OverlayDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { panelName, latLngDetail, lengthDetail, disBtwDetail, areaDetail } = this.props
        return (
            <SnackbarContent
                // ContentProps={{
                //     'aria-describedby': 'snackbar-fab-message-id',
                //     className: "SnackbarContent",
                // }}
                className="Snackbar"
                message={
                    <div>
                        <div>{panelName}</div>
                        <div>{(latLngDetail !== '') ? latLngDetail : ''}</div>
                        <div>{(disBtwDetail !== '') ? 'ระยะห่างระหว่างจุด : ' + disBtwDetail + ' เมตร' : ''}</div>
                        <div>{(lengthDetail !== '') ? 'ความยาวรวม : ' + lengthDetail + ' เมตร' : ''}</div>
                        <div>{(areaDetail !== '') ? 'พื้นที่คือ : ' + areaDetail : ''}</div>
                    </div>
                }
            />
        );
    }
}

export default OverlayDetail;