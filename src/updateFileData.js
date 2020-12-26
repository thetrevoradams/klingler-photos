import getFirebase from '../firebase/firebase'

const updateFileData = async (imageId, data) => {
  try {
    const firebase = await getFirebase()

    const resp = await firebase
      .firestore()
      .collection('images')
      .doc(imageId)
      .update({
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
