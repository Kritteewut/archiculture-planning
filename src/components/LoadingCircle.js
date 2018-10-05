import React from 'react';
import PropTypes from 'prop-types';

// Material-ui Import
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

// CSS Import
import './LoadingCircle.css';

/*const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '45%',
        left: '45%',
        zIndex: 10,
        //backgroundColor: theme.palette.background.paper,
        //boxShadow: theme.shadows[5],
        //padding: theme.spacing.unit * 4,
    },
});*/

class LoadingCircular extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { classes } = this.props;
        return (
            <div
                style={{
                    display: this.props.isLoading,
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    zIndex: 10,
                }}

            >
                <CircularProgress
                    className="progress"
                    size={100}
                    color="secondary"
                />
            </div>
        );
    }

}

LoadingCircular.propTypes = {
    
};

export default (LoadingCircular);
