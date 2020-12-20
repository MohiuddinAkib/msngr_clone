import * as admin from "firebase-admin";

const serviceAccount = require("@config/msngr_clone.json");


export default !admin.apps.length
    ?
    admin.initializeApp({
        credential: admin.credential.cert({
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
            projectId: process.env.FIREBASE_PROJECT_ID
        }),
        databaseURL: process.env.DIREBASE_DATABASE_URL
    })
    :
    admin.app();
