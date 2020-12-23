import admin from 'firebase-admin'
import config from './config'

async function getFirebaseAdmin() {
  if (!admin.apps.length) {
    await admin.initializeApp({
      credential: admin.credential.cert(config),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    })
  }
  return admin
}

export default getFirebaseAdmin
