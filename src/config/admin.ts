import * as admin from "firebase-admin";
import * as firebase from "firebase";

const serviceAccount = require("./msngr_clone.json");


export default !admin.apps.length
    ?
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://myapps-fde31.firebaseio.com"
    })
    :
    admin.app();