import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress';

class LinearLoadingProgress extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { loadingProgress } = this.props
        return (

            <LinearProgress
                style={{
                    left: this.props.left,
                    zIndex: 10,
                    position: 'relative',
                    width: '100%',
                    display: loadingProgress ? null : 'none'
                }}
                value={loadingProgress}
                variant='determinate'
            />
        )
    }
}
export default LinearLoadingProgress