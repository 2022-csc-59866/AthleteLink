const { db } = require("./config");

const resetUserProperties = async () => {
  try {
    // Retrieve all documents in the users collection
    const usersSnapshot = await db.collection("users").get();

    // Iterate through the documents and update each document
    const updatePromises = usersSnapshot.docs.map((doc) =>
      db.collection("users").doc(doc.id).update({
        likes: [],
        dislikes: [],
        likesMe: [],
      })
    );

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log("All user properties reset successfully.");
  } catch (error) {
    console.error("Error resetting user properties:", error);
  }
};

resetUserProperties();
