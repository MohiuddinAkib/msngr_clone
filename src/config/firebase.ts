import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"


export const fbConfig = {
    apiKey: "AIzaSyC3Gp6gY_yOqH02TpAjbitK4JXgV5Raw-4",
    authDomain: "myapps-fde31.firebaseapp.com",
    databaseURL: "https://myapps-fde31.firebaseio.com",
    projectId: "myapps-fde31",
    storageBucket: "myapps-fde31.appspot.com",
    messagingSenderId: "155579129246",
    appId: "1:155579129246:web:04568f01562c62222f8a8f"
}

export default !firebase.apps.length ? firebase.initializeApp(fbConfig) : firebase.app();

firebase.auth()
firebase.firestore()

export const COLLECTIONS = {
    conversations: "conversations",
    participants: "participants",
    messages: "messages",
}