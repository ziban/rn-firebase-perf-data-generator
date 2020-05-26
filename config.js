
const admin = require("firebase-admin");

// Create a sevice account && copy the key json to the serviceAccount.json file. 
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rn-firebase-a7cb6.firebaseio.com"
});

module.exports = { admin };
// Create the first firbase