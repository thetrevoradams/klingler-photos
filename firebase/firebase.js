// import firebase from 'firebase/app'
// import 'firebase/auth'
// import 'firebase/storage'

import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";


function getFirebase() {
  // if (!firebase.apps.length) {
    const app = initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    })
  // }
  // TODO: Figure out how to setPersistence in v9
  // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

  return app
}

export default getFirebase
