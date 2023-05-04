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
    likes,
    dislikes,
    likesMe,
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
    likes,
    dislikes,
    likesMe,
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

// Like User endpoint
app.post("/api/likeUser", async (req, res) => {
  const { currentUserID, likedUserID } = req.body;
  const sortedUserIDs = [currentUserID, likedUserID].sort((a, b) =>
    a.localeCompare(b)
  );

  try {
    const currentUserRef = db.collection("users").doc(currentUserID);
    const currentUserDoc = await currentUserRef.get();
    const currentUserLikes = currentUserDoc.data().likes;

    // Check if the current user has not already liked the liked user
    if (!currentUserLikes.includes(likedUserID)) {
      await currentUserRef.update({
        likes: admin.firestore.FieldValue.arrayUnion(likedUserID),
      });

      const likedUserRef = db.collection("users").doc(likedUserID);
      await likedUserRef.update({
        likesMe: admin.firestore.FieldValue.arrayUnion(currentUserID),
      });

      // Check if the liked user also likes the current user
      const likedUserDoc = await likedUserRef.get();
      const likedUserLikes = likedUserDoc.data().likes;
      let message;

      if (likedUserLikes.includes(currentUserID)) {
        const matchRef = db.collection("matches").doc();
        const chatRef = db.collection("chats").doc(matchRef.id);

        // Use a transaction to ensure atomic operations
        await db.runTransaction(async (transaction) => {
          // Check if the match already exists
          const existingMatchDoc = await transaction.get(matchRef);

          if (!existingMatchDoc.exists) {
            // It's a match! Create a new match document
            transaction.set(matchRef, {
              user1: sortedUserIDs[0],
              user2: sortedUserIDs[1],
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
              messages: [],
            });

            // Create a chat document with the same ID as the match document
            transaction.set(chatRef, {
              user1: sortedUserIDs[0],
              user2: sortedUserIDs[1],
              messages: [],
            });

            message = "Match found!";
          } else {
            message = "Match already exists.";
          }
        });
      } else {
        message = "User liked successfully.";
      }

      res.status(200).send({ message });
    } else {
      res.status(200).send({ message: "User has already liked this person." });
    }
  } catch (error) {
    console.error("Error liking user:", error);
    res.status(500).send({ message: "Error liking user.", error });
  }
});

// Dislike User endpoint
app.post("/api/dislikeUser", async (req, res) => {
  const { currentUserID, dislikedUserID } = req.body;

  try {
    const currentUserRef = db.collection("users").doc(currentUserID);
    await currentUserRef.update({
      dislikes: admin.firestore.FieldValue.arrayUnion(dislikedUserID),
    });

    res.status(200).send({ message: "User disliked successfully." });
  } catch (error) {
    console.error("Error disliking user:", error);
    res.status(500).send({ message: "Error disliking user.", error });
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

app.post("/api/filterUsersBySports", async (req, res) => {
  const { selectedSports, currentUserId } = req.body;
  try {
    // Get current user data
    const currentUserRef = db.collection("users").doc(currentUserId);
    const currentUserDoc = await currentUserRef.get();
    const currentUserData = currentUserDoc.data();
    const currentUserLikes = currentUserData.likes || [];
    const currentUserDislikes = currentUserData.dislikes || [];
    const currentUserMatches = currentUserData.matches || [];

    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("sports", "array-contains-any", selectedSports)
      .get();

    const filteredUsers = snapshot.docs
      .map((doc) => ({ id: doc.id, data: doc.data() }))
      .filter((user) => {
        // Exclude the current user and users who have been liked, disliked, or matched with
        return (
          user.id !== currentUserId &&
          !currentUserLikes.includes(user.id) &&
          !currentUserDislikes.includes(user.id) &&
          !currentUserMatches.includes(user.id)
        );
      });

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

app.get("/api/getMatchedUsers/:currentUserID", async (req, res) => {
  const { currentUserID } = req.params;

  try {
    const matchesSnapshot = await db
      .collection("matches")
      .where("user1", "==", currentUserID)
      .get();

    const reversedMatchesSnapshot = await db
      .collection("matches")
      .where("user2", "==", currentUserID)
      .get();

    const matchedUserIDs = [
      ...matchesSnapshot.docs.map((doc) => doc.data().user2),
      ...reversedMatchesSnapshot.docs.map((doc) => doc.data().user1),
    ];
    const uniqueMatchedUserIDs = [...new Set(matchedUserIDs)];

    const matchedUsersPromises = uniqueMatchedUserIDs.map((uid) =>
      db.collection("users").doc(uid).get()
    );
    const matchedUsersSnapshot = await Promise.all(matchedUsersPromises);

    const matchedUsers = matchedUsersSnapshot.map((userDoc) => {
      const userData = userDoc.data();
      return {
        uid: userDoc.id,
        username: userData.username,
        profileImgUrl: userData.profileImgUrl,
      };
    });

    res.status(200).send(matchedUsers);
  } catch (error) {
    console.error("Error fetching matched users:", error);
    res.status(500).send({ message: "Error fetching matched users.", error });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
