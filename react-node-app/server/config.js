var admin = require("firebase-admin");

var serviceAccount = require("./athletelink-2b0c4-firebase-adminsdk-a4c8v-c77e827605.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://athletelink-2b0c4-default-rtdb.firebaseio.com"
});

const db=admin.firestore()

const User = db.collection("Users")
module.exports = User