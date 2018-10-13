import React, { Component } from 'react';
import { Radio } from 'antd';
import { SHOW_ALL, SHOW_ACTIVATE, SHOW_COMPLETE } from '../staticValue/SaticString'

class ShowButtton extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div>
                <Radio.Group value={this.props.filterTaskType} >
                    <Radio.Button value={SHOW_ALL} onClick={() => this.props.onFilterTask(SHOW_ALL)}>ทั้งหมด</Radio.Button>
                    <Radio.Button value={SHOW_ACTIVATE} onClick={() => this.props.onFilterTask(SHOW_ACTIVATE)}>ที่กำลังทำ</Radio.Button>
                    <Radio.Button value={SHOW_COMPLETE} onClick={() => this.props.onFilterTask(SHOW_COMPLETE)}>ที่เสร็จแล้ว</Radio.Button>
                </Radio.Group>
            </div>
        );
    }
}
ShowButtton.propTypes = {

};

export default ShowButtton;