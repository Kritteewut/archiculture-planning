
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
export const settings = {/* your settings... */ timestampsInSnapshots: true };
export const auth = firebase.auth();
export const provider = new firebase.auth.FacebookAuthProvider();
export const provider2 = new firebase.auth.GoogleAuthProvider();
db.settings(settings);
export default firebase;
