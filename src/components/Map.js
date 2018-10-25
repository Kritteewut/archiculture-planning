import React from 'react';
import './Design.css';
import moment from 'moment';
import firebase from 'firebase'
import { db, planMemberRef, planRef } from '../config/firebase'
import update from 'immutability-helper';
//if sort by alfhabet 0-9 => a-z => ก - ฮ
//if sort by date the lastest day will be at the end of array

class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            zoom: 15,
            center: { lat: 13.7648, lng: 100.5381 },
        }
    }
    componentWillMount() {
        window.initMap = this.initMap
    }
    initMap = () => {
        var self = this
        window.map = new window.google.maps.Map(document.getElementById("map"), {
            center: this.state.center,
            zoom: this.state.zoom,
            clickableIcons: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: 'satellite',
            //hybrid sat with detail
            //roadmap raod
            //satellite sat
            //terrain raod wtih terrain
        })
        this.setState({
            isLoad: true
        })
    }

    render() {
        var childrenOutput = null;
        if (this.state.isLoad === true) {
            childrenOutput = this.props.children;
        }
        return (
            <div style={{
                left: this.props.left,

            }}
                className="Map"
                id="map" >
                {childrenOutput}
            </div>
        );
    }
}
export default Map;

//add 'planDescription' field for each value Plan by defualt is '-'
// planRef.get().then(function (querySnapshot) {
//     querySnapshot.forEach(function (doc) {
//         doc.ref.set({
//             createPlanDate: new Date()
//         }, { merge: true });

//     })
// })

// planRef.get().then(function (querySnapshot) {
//     querySnapshot.forEach(function (doc) {
//         const memberId = doc.data().uid
//         const planId = doc.id
//         const memberRole = 'editor'
//         const data = { memberId, planId, memberRole }
//         planMemberRef.add(data)
//     })
// })

//delete field in data base dont forget to *import firebase*
// planRef.get().then(function (querySnapshot) {
//     querySnapshot.forEach(function (doc) {
//         planRef.doc(doc.id).update({
//             uid: firebase.firestore.FieldValue.delete()
//         });
//     })
// })