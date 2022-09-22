import { updateDoc, doc, getFuego } from 'swr-firebase'

const updateFileData = async (imageId, data) => {
  try {
    const firebase = await getFuego()
    const docRef = doc(firebase.db, "images", `${imageId}`)
    const resp = await updateDoc(docRef, {
      filename: data.filenameVal,
      date: firebase.firestore.Timestamp.fromDate(data.dateVal),
      desc: data.descVal || '',
    })
    return { resp }
  } catch (error) {
    return { error }
  }
}

export default updateFileData
