const { db } = require("./config");

const deleteUserWithEmailDomain = async (emailDomain) => {
  try {
    // Get all users with emailDomain
    const usersSnapshot = await db
      .collection("users")
      .where("email", ">=", emailDomain)
      .where("email", "<", emailDomain + "\uf8ff")
      .get();

    const deleteUserPromises = [];

    usersSnapshot.forEach((doc) => {
      const userId = doc.id;

      // Delete user document
      deleteUserPromises.push(db.collection("users").doc(userId).delete());

      // Delete match documents
      const matchesQuery1 = db
        .collection("matches")
        .where("user1", "==", userId);
      const matchesQuery2 = db
        .collection("matches")
        .where("user2", "==", userId);
      deleteUserPromises.push(
        matchesQuery1.get().then(async (querySnapshot) => {
          const matchDeletePromises = [];
          querySnapshot.forEach((matchDoc) => {
            matchDeletePromises.push(
              db.collection("matches").doc(matchDoc.id).delete()
            );
          });
          await Promise.all(matchDeletePromises);
        }),
        matchesQuery2.get().then(async (querySnapshot) => {
          const matchDeletePromises = [];
          querySnapshot.forEach((matchDoc) => {
            matchDeletePromises.push(
              db.collection("matches").doc(matchDoc.id).delete()
            );
          });
          await Promise.all(matchDeletePromises);
        })
      );

      // Delete chat documents
      deleteUserPromises.push(
        db
          .collection("chats")
          .where("members", "array-contains", userId)
          .get()
          .then(async (querySnapshot) => {
            const chatDeletePromises = [];
            querySnapshot.forEach((chatDoc) => {
              chatDeletePromises.push(
                db.collection("chats").doc(chatDoc.id).delete()
              );
            });
            await Promise.all(chatDeletePromises);
          })
      );
    });

    // Execute all promises
    await Promise.all(deleteUserPromises);
    console.log("Deleted users with email domain:", emailDomain);
  } catch (error) {
    console.error("Error deleting users with email domain:", error);
  }
};

deleteUserWithEmailDomain("@example.com");
