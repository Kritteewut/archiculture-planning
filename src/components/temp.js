import React from 'react';

class Temp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (null)
  }
}
export default Temp

{/*
 var overlayType = overlayCoords[overlayCoords.length - 1].overlayType
      var coordsLength = overlayCoords[overlayCoords.length - 1].coords.length
      if (overlayType === 'polygon' && coordsLength < 2) {
        console.log('delete')
      } else {
        this.setState((prevState) => {
          return {
            overlayIndex: prevState.overlayIndex + 1,
            isFirstDraw: true
          };
        }, () => console.log(this.state.overlayCoords, 'overlayCoords'));
      }
      if (overlayType === 'polyline' && coordsLength < 1) {
        console.log('delete')
      } else {
        this.setState((prevState) => {
          return {
            overlayIndex: prevState.overlayIndex + 1,
            isFirstDraw: true
          };
        }, () => console.log(this.state.overlayCoords, 'overlayCoords'));
      }
      if (overlayType === 'marker') {
        this.setState((prevState) => {
          return {
            overlayIndex: prevState.overlayIndex + 1,
            isFirstDraw: true
          };
        }, () => console.log(this.state.overlayCoords, 'overlayCoords'));
      }
*/}

// shouldSaveTask.forEach((task) => {
//   const isDone = task.isDone
//   const content = task.content
//   const startAt = task.startAt
//   const endAt = task.endAt
//   const overlayId = task.overlayId
//   const taskId = task.taskId
//   const taskSource = task.taskSource
//   const name = task.name
//   const addTask = {
//     isDone, content, startAt,
//     endAt, planId, overlayId, name
//   }

//   if (taskSource === 'local') {
//     taskRef
//       .add(addTask)
//       .then(function (doc) {

//         self.setState((state) => {
//           const updateTaskIndex = state.overlayTasks.findIndex(task => task.taskId === taskId)
//           const editTaskId = update(state.overlayTasks, { [updateTaskIndex]: { taskId: { $set: doc.id } } })
//           const editIsTaskSave = update(editTaskId, { [updateTaskIndex]: { isTaskSave: { $set: true } } })
//           const editTaskSource = update(editIsTaskSave, { [updateTaskIndex]: { taskSource: { $set: 'server' } } })
//           return {
//             overlayTasks: editTaskSource,
//             loadingProgress: ((state.finishedSaveAmount + 1) / state.saveAmount) * 100,
//             finishedSaveAmount: (state.finishedSaveAmount + 1),
//           }
//         }, () => {
//           if (self.state.finishedSaveAmount === self.state.saveAmount) {
//             self.setState({ isSaving: false, loadingProgress: null, shouldSave: false })
//             self.onChangeOverlayTaskIndex()
//           }
//         })

//       }).catch(function (error) {
//         throw ('error', error)
//       });
//   } else {
//     taskRef.doc(taskId).set(addTask
//       , { merge: true }).then(function () {
//         self.setState((state) => {
//           const updateTaskId = state.overlayTasks.findIndex(task => task.taskId === taskId)
//           const editIsOverlaySave = update(state.overlayTasks, { [updateTaskId]: { isTaskSave: { $set: true } } })
//           return {
//             overlayTasks: editIsOverlaySave,
//             loadingProgress: ((state.finishedSaveAmount + 1) / state.saveAmount) * 100,
//             finishedSaveAmount: (state.finishedSaveAmount + 1)
//           };
//         }, () => {
//           if (self.state.finishedSaveAmount === self.state.saveAmount) {
//             self.setState({ isSaving: false, loadingProgress: null, shouldSave: false })
//           }
//         });
//       }).catch(function (error) {
//         throw ('there is something went wrong', error)
//       });
//   }
// })