import React from 'react'
import SnackbarContent from '@material-ui/core/SnackbarContent';

class OverlayDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { panelName, latLngDetail, lengthDetail, disBtwDetail, areaDetail } = this.props
        return (
            <div>
                <SnackbarContent
                    message={panelName}
                />

                {(latLngDetail !== '') ?

                    <SnackbarContent

                        message={latLngDetail}

                    />
                    :
                    null
                }

                {(lengthDetail !== '') ?

                    <SnackbarContent

                        message={'ความยาวรวม : ' + lengthDetail + ' เมตร'}

                    />
                    :
                    null
                }

                {(areaDetail !== '') ?

                    <SnackbarContent

                        message={'พื้นที่คือ : ' + areaDetail}

                    />
                    :
                    null
                }

                {(disBtwDetail !== '') ?

                    <SnackbarContent

                        message={'ระยะห่างระหว่างจุด : ' + disBtwDetail + ' เมตร'}

                    />
                    :
                    null
                }

            </div>
        );
    }
}

export default OverlayDetail;