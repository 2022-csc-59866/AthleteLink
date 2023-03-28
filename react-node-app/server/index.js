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
      userRef = db.collection("users")
      userRef.add(newUser)
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


app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});