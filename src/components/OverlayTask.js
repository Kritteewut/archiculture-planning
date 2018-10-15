import React, { Component } from 'react';
import Input from './Input';
import Navigation from './Navigation'
import TaskShow from './TaskShow';
import Navbar from './Navbar';
import Category from './Category';
import Calendar from './Calendar';
import History from './History';
import ShowButton from './ShowButton';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';

import 'bootstrap/dist/css/bootstrap.min.css';

import './OverlayTask.css';



function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class OverlayTask extends Component {

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
  handleDrawerOpen = (open) => {
    this.setState({
      open: open
    });
    console.log(open, 'Drawer')
  };

  changePage = (page) => {
    this.setState({
      page: page
    })
    console.log('Page', page)
  };

  changeMenu = (menu) => {
    this.setState({
      menu: menu
    })
    console.log('menu', menu)
  };

  renderpage = () => {

    switch (this.state.page) {
      case 'งาน':
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
            }}
          >

            <ShowButton
              {...this.state}
              onFilterTask={this.props.onFilterTask}
              filterTaskType={this.props.filterTaskType}

            />

            <Input
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
            />

          </div>
        );
      /*
    case 'ประวัติ':
      return (
        <div>

          <History
            {...this.state}
            deleteItem={this.deleteItem}
            editItem={this.editItem}
            taskBack={this.taskBack}
            onEditTask={this.props.onEditTask}
            onDeleteTask={this.props.onDeleteTask}
          />

        </div>
      );
      */
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
            // handleDrawerOpen={this.handleDrawerOpen}
            // changeMenu={this.changeMenu}
            onToggleOverlayTaskOpen={this.props.onToggleOverlayTaskOpen}
            changePage={this.changePage}
            {...this.state}
          />

          <Category
            handleDrawerOpen={this.handleDrawerOpen}
            open={this.state.open}
          />

          <br /><br /><br />

          {this.renderpage()}

          <br /><br /><br />

          {/* <Navigation
            changePage={this.changePage}
          /> */}
        </div>
      </Dialog>
    )
  }
}

export default OverlayTask;