const express = require("express");
const cors = require('cors')
const User = require("./config")
const PORT = process.env.PORT || 3001;
const admin = require("firebase-admin");
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
    });


    res.status(201).json(userRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// app.post('/api/sign-in', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     const userRecord = await admin.auth().getUserByEmail(email);
//     console.log("request body", req.body)
//     console.log("email", email)
//     await admin.auth().signInWithEmailAndPassword(email, password);

//     res.status(200).json(userRecord);
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ error: 'Invalid credentials' });
//   }
// });


app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});