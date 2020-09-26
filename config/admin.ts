import * as admin from "firebase-admin";

const serviceAccount = require("./msngr_clone.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://myapps-fde31.firebaseio.com"
});

export default admin