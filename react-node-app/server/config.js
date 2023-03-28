var admin = require("firebase-admin");
const {getFirestore}  = require("firebase-admin/firestore") 
var serviceAccount = require("./athletelink-2b0c4-firebase-adminsdk-a4c8v-c77e827605.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://athletelink-2b0c4-default-rtdb.firebaseio.com"
});

const db=getFirestore()

module.exports = {db}