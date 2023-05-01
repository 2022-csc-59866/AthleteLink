const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
const admin = require("firebase-admin");
const { db } = require("./config");

const bp = require("body-parser");
const saltedMd5 = require("salted-md5");
const axios = require("axios");
const multer = require("multer");

const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

const bucket = admin.storage().bucket();

app.get("/", (req, res) => {
  res.json({ message: "sup dude from server!" });
});

app.post("/uploadProfileImage", upload.single("image"), async (req, res) => {
  if (!req.file) {
    console.log("No file sent");
    res.status(400).send("No file uploaded.");
    return;
  }
  if (!req.body.userID) {
    console.log("No user id sent");
    res.status(400).send("No USERID sent.");
    return;
  }
  const userID = req.body.userID;

  const { originalname, buffer } = req.file;

  // Define your custom path here. For example, you can use the user ID or any other identifier:
  const folderPath = `users/${userID}/profileImage`;

  // const customPath = folderPath + originalname;
  const file = bucket.file(folderPath);
  const options = {
    metadata: {
      contentType: "image/jpeg",
    },
    public: true,
  };

  try {
    await file.save(buffer, options);
    const url = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(folderPath)}?alt=media`;
    res.status(201).send(url);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file.");
  }
});

app.post("/uploadCardImage", upload.single("image"), async (req, res) => {
  if (!req.file) {
    console.log("No file sent");
    res.status(400).send("No file uploaded.");
    return;
  }
  if (!req.body.userID) {
    console.log("No user id sent");
    res.status(400).send("No USERID sent.");
    return;
  }
  const userID = req.body.userID;

  const { originalname, buffer } = req.file;

  // Define your custom path here. For example, you can use the user ID or any other identifier:
  const folderPath = `users/${userID}/cardImage`;

  // const customPath = folderPath + originalname;
  const file = bucket.file(folderPath);
  const options = {
    metadata: {
      contentType: "image/jpeg",
    },
    public: true,
  };

  try {
    await file.save(buffer, options);
    const url = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(folderPath)}?alt=media`;
    res.status(201).send(url);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file.");
  }
});

app.get("/getNewUserFlag", (req, res) => {
  const uid = req.query.uid; // assuming the user ID is passed in the query string
  userRef = db.collection("users");
  userRef
    .where("uid", "==", uid)
    .get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve data" });
    });
});

app.get("/checkUsernameAvailability", (req, res) => {
  const username = req.query.username; // assuming the user ID is passed in the query string
  userRef = db.collection("users");
  userRef
    .where("username", "==", username)
    .get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      if (data.length > 0) {
        res.status(200).json({ isAvailable: false });
      } else {
        res.status(200).json({ isAvailable: true });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve data" });
    });
});

app.post("/api/create-user", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    try {
      const newUser = {
        uid: userRecord.uid,
        email: userRecord.email,
        flagNewUser: true,
      };
      await db.collection("users").doc(newUser.uid).set(newUser);
      console.log("data creaeted successfully.");
      // res.status(201).send('Document created successfully');
    } catch (error) {
      console.log("User created successfully!");
      console.error("Error creating user: ", error);
    }

    res.status(201).json(userRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/onboarding", async (req, res) => {
  const {
    userID,
    username,
    bio,
    age,
    zipcode,
    profileImgUrl,
    cardImgUrl,
    sports,
    location,
    profilesLiked,
    profilesLikedMe,
    matches,
  } = req.body;

  const onboardingData = {
    userID,
    username,
    bio,
    age,
    zipcode,
    profileImgUrl,
    cardImgUrl,
    sports,
    location,
    profilesLiked,
    profilesLikedMe,
    matches,
  };

  try {
    const docRef = db.collection("users").doc(userID);
    await docRef.update(onboardingData);

    res.status(200).send({ message: "Onboarding data successfully saved." });
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    res.status(500).send({ message: "Error saving onboarding data.", error });
  }
});
const filterUndefinedProperties = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
  );
};

app.post("/api/updateProfile", async (req, res) => {
  const {
    userID,
    username,
    bio,
    age,
    zipcode,
    profileImgUrl,
    cardImgUrl,
    sports,
    location,
    profilesLiked,
    profilesLikedMe,
    matches,
  } = req.body;

  const onboardingData = filterUndefinedProperties({
    userID,
    username,
    bio,
    age,
    zipcode,
    profileImgUrl,
    cardImgUrl,
    sports,
    location,
    profilesLiked,
    profilesLikedMe,
    matches,
  });
  console.log(onboardingData);

  try {
    const docRef = db.collection("users").doc(userID);
    await docRef.update(onboardingData);

    res.status(200).send({ message: "Onboarding data successfully saved." });
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    res.status(500).send({ message: "Error saving onboarding data.", error });
  }
});

app.post("/api/disableNewUserFlag", async (req, res) => {
  const { userID } = req.body;

  docRef = db.collection("users").doc(userID);
  try {
    await docRef.update({ flagNewUser: false });
    res.status(200).send({ message: "New user flag successfully disabled." });
  } catch (error) {
    console.log("error when updating newUserFlag in onboarding", error);
    res.status(500).send({ message: "Error disabling new user flag.", error });
  }
});

app.get("/api/getAllUsers", async (req, res) => {
  const currentUserId = req.query.currentUserId;

  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    let users = [];
    snapshot.forEach((doc) => {
      if (doc.id !== currentUserId) {
        users.push({ id: doc.id, data: doc.data() });
      }
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

// app.post("/api/filterUsersBySports", async (req, res) => {
//   try {
//     const selectedSports = req.body.selectedSports;
//     const filteredUsers = await getUsersWithSelectedSports(selectedSports);
//     res.json(filteredUsers);
//   } catch (error) {
//     res.status(500).send("Error filtering users by sports: " + error.message);
//   }
// });

// async function getUsersWithSelectedSports(selectedSports) {
//   const usersRef = db.collection("users");
//   const usersQuery = usersRef.where(
//     "sports",
//     "array-contains-any",
//     selectedSports
//   );
//   const querySnapshot = await usersQuery.get();

//   const filteredUsers = [];
//   querySnapshot.forEach((doc) => {
//     filteredUsers.push({ id: doc.id, ...doc.data() });
//   });

//   return filteredUsers;
// }
app.post("/api/filterUsersBySports", async (req, res) => {
  const { selectedSports, currentUserId } = req.body;
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("sports", "array-contains-any", selectedSports)
      .get();

    const filteredUsers = snapshot.docs
      .map((doc) => ({ id: doc.id, data: doc.data() }))
      .filter((user) => user.id !== currentUserId);

    res.json(filteredUsers);
  } catch (error) {
    console.error("Error filtering users by sports:", error);
    res.status(500).json({ message: "Failed to filter users by sports." });
  }
});

app.get("/api/getUserData/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      res.json({ id: userDoc.id, data: userDoc.data() });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    res.status(500).json({ message: "Failed to get user data." });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
