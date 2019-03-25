import React from 'react';
import { Radio } from 'antd';
import { SHOW_ALL, SHOW_ACTIVATE, SHOW_COMPLETE, SHOW_OVERVIEW, SHOW_TODAY } from '../StaticValue/StaticString'

//CSS import 
import './TaskDesign.css';

class ShowButtton extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div style={{
                margin: 'auto',
                width: '100%',
            }}>
                <Radio.Group value={this.props.overlAllFiltertask} >
                    <Radio.Button value={SHOW_OVERVIEW} onClick={() => this.props.onFilterTask(this.props.filterTaskType, SHOW_OVERVIEW)}>ภาพรวมงาน</Radio.Button>
                    <Radio.Button value={SHOW_TODAY} onClick={() => this.props.onFilterTask(this.props.filterTaskType, SHOW_TODAY)}>งานวันนี้</Radio.Button>
                </Radio.Group>
                <br />
                <Radio.Group value={this.props.filterTaskType} >
                    <Radio.Button value={SHOW_ALL} onClick={() => this.props.onFilterTask(SHOW_ALL, this.props.overlAllFiltertask)}>ทั้งหมด</Radio.Button>
                    <Radio.Button value={SHOW_ACTIVATE} onClick={() => this.props.onFilterTask(SHOW_ACTIVATE, this.props.overlAllFiltertask)}>ยังไม่เสร็จ</Radio.Button>
                    <Radio.Button value={SHOW_COMPLETE} onClick={() => this.props.onFilterTask(SHOW_COMPLETE, this.props.overlAllFiltertask)}>เสร็จแล้ว</Radio.Button>
                </Radio.Group>
            </div>
        );
    }
}

export default ShowButtton;