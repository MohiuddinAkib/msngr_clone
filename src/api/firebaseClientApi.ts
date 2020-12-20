import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"
import "firebase/firestore"

export const fbConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.DIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}

export default !firebase.apps.length ? firebase.initializeApp(fbConfig) : firebase.app();

firebase.auth()
firebase.firestore()
firebase.storage()
firebase.database()

export const COLLECTIONS = {
    conversations: "conversations",
    participants: "participants",
    messages: "messages",
    users: "users",
}
