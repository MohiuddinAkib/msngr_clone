import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"
import "firebase/firestore"

export const fbConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
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
    presence: "presence",
}
