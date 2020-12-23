/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import getFirebase from '../firebase/firebase'

const addDbEntry = async (fileUrl, user, filename, firebase) => {
  try {
    const resp = await firebase
      .firestore()
      .collection('images')
      .add({
        contributorId: user.uid,
        filename,
        contributorName: user.firstName,
        date: new Date(),
        url: fileUrl,
      })
    return { resp }
  } catch (error) {
    return { error }
  }
}

const uploadFiles = async (files, user) => {
  try {
    const firebase = await getFirebase()
    const storageRef = await firebase.storage().ref()

    for (const file of files) {
      const fileRef = storageRef.child(file.name)
      const uploadResp = await fileRef.put(file)
      const fileUrl = await uploadResp.ref.getDownloadURL()
      await addDbEntry(fileUrl, user, file.name, firebase)
    }
    return { success: 'success' }
  } catch (error) {
    return { error }
  }
}

export default uploadFiles
