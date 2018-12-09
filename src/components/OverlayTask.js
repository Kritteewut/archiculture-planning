import React from 'react';
import Input from './AddTask';
import TaskShow from './TaskShow';
import Navbar from './Navbar';
import Calendar from './Calendar';
import ShowButton from './ShowButton';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';

import 'bootstrap/dist/css/bootstrap.min.css';

import './OverlayTask.css';



function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class OverlayTask extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      items: [],
      itemsHistory: [],
      Category: [],
      page: 'งาน',
      menu: 'ลบงาน',
      show: 'กำลังทำ',
    }
  }
  changePage = (page) => {
    this.setState({ page })
  };
  renderpage = () => {

    switch (this.state.page) {
      case 'งาน':
        return (
          <div>
            <ShowButton
              {...this.state}
              onFilterTask={this.props.onFilterTask}
              filterTaskType={this.props.filterTaskType}
              overlAllFiltertask={this.props.overlAllFiltertask}

            />
            <Input
              selectedPlan={this.props.selectedPlan}
              selectedOverlay={this.props.selectedOverlay}
              onAddTask={this.props.onAddTask}
            />
            <TaskShow
              {...this.state}
              overlayTaskShow={this.props.overlayTaskShow}
              handleEditOpen={this.handleEditOpen}
              deleteItem={this.deleteItem}
              onArrayUpdate={this.onArrayUpdate}
              taskDone={this.taskDone}
              taskBack={this.taskBack}
              onToggleIsTaskDone={this.props.onToggleIsTaskDone}
              onEditTask={this.props.onEditTask}
              onDeleteTask={this.props.onDeleteTask}
              isWaitingForTaskToggle={this.props.isWaitingForTaskToggle}
            />

          </div>
        );
      case 'ปฏิทิน':
        return (
          <div>
            <Calendar
              overlayTaskShow={this.props.overlayTaskShow}
              {...this.state}
            />

          </div>
        );
      default: return;
    }
  }

  render() {
    const { isOverlayTaskOpen } = this.props
    return (
      <Dialog
        fullScreen
        open={isOverlayTaskOpen}
        onClose={this.handleClose}
        TransitionComponent={Transition}

      >
        <div className="taskApp">
          <Navbar
            onToggleOverlayTaskOpen={this.props.onToggleOverlayTaskOpen}
            changePage={this.changePage}
            {...this.state}
          />
          <br /><br /><br />
          <div>
            {this.renderpage()}
          </div>
        </div>
      </Dialog>
    )
  }
}

export default OverlayTask;