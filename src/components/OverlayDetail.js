import React from 'react'
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    snackbar: {
        margin: theme.spacing.unit,
        widith: '300px',
    },
});

class OverlayDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { classes } = this.props
        return (
            <div>
                <SnackbarContent
                    className={classes.snackbar}
                    message={'I love candy. I love cookies. I love cupcakes. I love cheesecake. I love chocolate.'}
                />
            </div>
        );
    }
}

export default withStyles(styles)(OverlayDetail);