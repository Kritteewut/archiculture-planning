import React from 'react';
// Material-ui Import
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

// CSS Import
import './DetailedExpansionPanel.css';

class DetailedExpansionPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {


    }
  }


  render() {
    const { panelName, latLngDetail, lengthDetail, disBtwDetail, areaDetail } = this.props

    return (

      <div className="Detailroot">

        <ExpansionPanel className="theme">

          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon className="details" />}>

            <div style={{ alignItems: 'center' }} >
              <Typography className="heading">{panelName}</Typography>
            </div>

          </ExpansionPanelSummary>

          {(latLngDetail !== '') ?

            <ExpansionPanelDetails className="details">

              <Typography className="details"> {latLngDetail} </Typography>

            </ExpansionPanelDetails>
            :
            null
          }
          {(disBtwDetail !== '') ?
            <ExpansionPanelDetails className="details">

              <Typography className="details" >
                ระยะห่างระหว่างจุด : {disBtwDetail} เมตร</Typography>
            </ExpansionPanelDetails>

            :
            null
          }
          {(lengthDetail !== '') ?
            <ExpansionPanelDetails className="details">

              <Typography className="details">
                ความยาวรวม : {lengthDetail} เมตร
              </Typography>

              {(areaDetail !== '') ?
                <Typography className="details">
                  พื้นที่คือ : {areaDetail}
                </Typography>
                :
                null
              }
            </ExpansionPanelDetails>
            :
            null
          }
          <Divider />

        </ExpansionPanel>

      </div>
    );
  }
}

export default DetailedExpansionPanel;