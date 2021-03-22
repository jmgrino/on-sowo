import * as functions from "firebase-functions";

import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

exports.deleteUserData = functions.auth.user().onDelete((user) => {
  const db = admin.firestore();
  const collection = db.collection("users");
  return collection.doc(user.uid).delete();
});

exports.deleteUserImage = functions.auth.user().onDelete((user) => {
  const bucket = admin.storage().bucket();
  return bucket.deleteFiles({
    prefix: `users/${user.uid}`,
  });
});
