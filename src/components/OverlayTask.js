import React, { Component } from 'react';
import Input from './Input';
import Navigation from './Navigation'
import TaskShow from './TaskShow';
import Navbar from './Navbar';
import Category from './Category';
import Calendar from './Calendar';
import History from './History';
import ShowButton from './ShowButton';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../App.css';

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

  changeShow = (show) => {
    this.setState({
      show: show
    })
  };

  renderpage = () => {
    switch (this.state.page) {
      case 'งาน':
        return (
          <div>

            <ShowButton
              {...this.state}
              changeShow={this.changeShow}

            />

            <Input
              items={this.state.items}
              addItem={this.addItem}
            />

            <TaskShow
              {...this.state}
              handleEditOpen={this.handleEditOpen}
              editItem={this.editItem}
              deleteItem={this.deleteItem}
              onArrayUpdate={this.onArrayUpdate}
              taskDone={this.taskDone}
              taskBack={this.taskBack}
            />

          </div>
        );
      case 'ประวัติ':
        return (
          <div>

            <History
              {...this.state}
              deleteItem={this.deleteItem}
              editItem={this.editItem}
              taskBack={this.taskBack}
            />

          </div>
        );
      case 'ปฏิทิน':
        return (
          <div>

            <Calendar
              editItem={this.editItem}
              {...this.state}
            />

          </div>
        );
    }
  }

  render() {
    return (
      <div class="App">

        <Navbar
          handleDrawerOpen={this.handleDrawerOpen}
          changeMenu={this.changeMenu}
          {...this.state}
        />

        <Category
          handleDrawerOpen={this.handleDrawerOpen}
          open={this.state.open}
        />

        <br /><br /><br />

        {this.renderpage()}

        <br /><br /><br />

        <Navigation
          changePage={this.changePage}
        />

      </div>
    )
  }
}

export default OverlayTask;