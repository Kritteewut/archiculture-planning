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
            loadingProgress ?
                <LinearProgress
                    style={{
                        flexGrow: 1,
                        zIndex: 10,
                        position: 'relative',
                        width: '100%',
                    }}
                    value={loadingProgress}
                    variant='determinate'
                />
                :
                null
        )
    }
}
export default LinearLoadingProgress