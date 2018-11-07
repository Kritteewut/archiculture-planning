import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material-ui Import
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
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

DetailedExpansionPanel.propTypes = {

};
export default (DetailedExpansionPanel);