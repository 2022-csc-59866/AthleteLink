const express = require("express");
const cors = require('cors')
const PORT = process.env.PORT || 3001;
const admin = require("firebase-admin");
const {db} = require('./config')
const app = express();
const bp = require('body-parser')

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors());



app.get("/", (req, res) => {
  res.json({ message: "sup dude from server!" });
});

app.get('/getNewUserFlag', (req, res) => {
  const uid = req.query.uid; // assuming the user ID is passed in the query string
  userRef = db.collection("users")
  userRef.where('uid', '==', uid).get().then(snapshot => {
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve data' });
    });
  
});

app.get('/checkUsernameAvailability', (req, res) => {
  const username = req.query.username; // assuming the user ID is passed in the query string
  userRef = db.collection("users")
  userRef.where('username', '==', username).get().then(snapshot => {
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      if(data.length > 0){
        res.status(200).json({isAvailable: false});
      }else{
        res.status(200).json({isAvailable: true});
      }
      
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve data' });
    });
  
});



app.post('/api/create-user', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRecord = await admin.auth().createUser({
      email,
      password,
    })
  
    try{
      const newUser = {
        uid: userRecord.uid,
        email: userRecord.email,
        flagNewUser: true
      }
      await db.collection("users").doc(newUser.uid).set(newUser)
      console.log("data creaeted successfully.")
      // res.status(201).send('Document created successfully');
    }catch (error){
      console.log('User created successfully!');
      console.error('Error creating user: ', error);
    }

    res.status(201).json(userRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
app.post('/api/onboarding', async (req, res) => {
    const { firstName, lastName, gender, age, location, userID, username } = req.body;
    const updateData = {
      firstName,lastName,gender,age,location,username
    };

    console.log("UIDD IS PRINTED HERE", userID,firstName,lastName)
    docRef = db.collection("users").doc(userID)
    try{
      docRef.update(updateData)
        try{
          docRef.update({flagNewUser:false})
        }catch(error){
        console.log("error when updating newUserFlag in onboarding", error)
      }}catch(error){
        onsole.log("error when updating newUserFlag in onboarding", error)
      }
    });


app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});