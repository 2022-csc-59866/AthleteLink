const { db } = require("./config");

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRandomPhotoUrl = (width = 400, height = 400) => {
  return `https://source.unsplash.com/random/?night,rain`;
};
const createDummyUser = async () => {
  const id = (Math.random() * 1e17).toString(36);
  const username = "user_" + id.substring(0, 6);
  const age = getRandomInt(18, 65);
  const bio = "Hi, I am " + username + ".";
  const email = username + "@example.com";

  const user = {
    age: age,
    bio: bio,
    email: email,
    username: username,
    uid: id,
    userID: id,
    profileImgUrl: getRandomPhotoUrl(),
    cardImgUrl: getRandomPhotoUrl(),
    zipcode: "11010",
    location: {
      latitude: 40,
      longitude: -73,
    },
    sports: ["Basketball", "Baseball"],
    likes: [],
    dislikes: [],
  };

  const userRef = await db.collection("users").add(user);
  user.id = userRef.id;
  return user;
};

const createDummyUsers = async (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = await createDummyUser();
    users.push(user);
  }

  for (let i = 0; i < users.length; i++) {
    const currentUser = users[i];
    for (let j = i + 1; j < users.length; j++) {
      const targetUser = users[j];

      // Add likes between users
      await db
        .collection("users")
        .doc(currentUser.id)
        .update({
          likes: [...currentUser.likes, targetUser.id],
        });
      await db
        .collection("users")
        .doc(targetUser.id)
        .update({
          likes: [...targetUser.likes, currentUser.id],
        });

      // Create a match between users and store them in sorted order
      const user1 =
        currentUser.id < targetUser.id ? currentUser.id : targetUser.id;
      const user2 =
        currentUser.id < targetUser.id ? targetUser.id : currentUser.id;
      const matchData = {
        user1: user1,
        user2: user2,
      };
      const matchRef = await db.collection("matches").add(matchData);

      // Create a chat between users with the same ID as the match document
      const chatData = {
        matchId: matchRef.id,
        users: [user1, user2],
        messages: [],
      };
      await db.collection("chats").doc(matchRef.id).set(chatData);
    }
  }
};

const updateProfileAndCardImages = async () => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    const updates = snapshot.docs.map(async (doc) => {
      const user = doc.data();

      if (
        user.profileImgUrl === "https://example.com/dummy/profile/image.jpg" ||
        user.cardImgUrl === "https://example.com/dummy/card/image.jpg"
      ) {
        const updatedProfileImgUrl = getRandomPhotoUrl();
        const updatedCardImgUrl = getRandomPhotoUrl();

        await doc.ref.update({
          profileImgUrl: updatedProfileImgUrl,
          cardImgUrl: updatedCardImgUrl,
        });

        console.log(`Updated user ${doc.id} with new image URLs.`);
      }
    });

    await Promise.all(updates);
    console.log("All image URLs have been updated.");
  } catch (error) {
    console.error("Error updating image URLs:", error);
  }
};

// Call the function to update the image URLs
// updateProfileAndCardImages();

// Replace 15 with the number of dummy users you want to create
createDummyUsers(15)
  .then(() => {
    console.log("Dummy users and matches created successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error creating dummy users and matches:", error);
    process.exit(1);
  });
