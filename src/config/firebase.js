
import firebase from 'firebase'
require('firebase/firestore')
const config = {
    apiKey: "AIzaSyDUF-rTKSwQiz_scL-JPNLRZbcQQXFfPZ0",
    authDomain: "archiculture-planning.firebaseapp.com",
    databaseURL: "https://archiculture-planning.firebaseio.com",
    projectId: "archiculture-planning",
    storageBucket: "archiculture-planning.appspot.com",
    messagingSenderId: "626415423664"
};
firebase.initializeApp(config);

export const ref = firebase.database().ref()
export const db = firebase.firestore();

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()
export const settings = {/* your settings... */ timestampsInSnapshots: true };
export const auth = firebase.auth();
export const provider = new firebase.auth.FacebookAuthProvider();
export const provider2 = new firebase.auth.GoogleAuthProvider();
db.settings(settings);
db.enablePersistence()
    .catch(function (err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
            alert('Multiple tabs open, persistence can only be enabled in one tab at a a time.')
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
            alert('The current browser does not support all of the features required to enable persistence.')
        }
    });
// Subsequent queries will use persistence, if it was enabled successfully

export default firebase;
