import getFirebaseAdmin from '../../firebase/admin'

const getPhotos = async (req, res) => {
  try {
    const admin = await getFirebaseAdmin()

    const imagesResp = await admin
      .firestore()
      .collection('images')
      .get()

    const images = imagesResp.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json({ images })
  } catch (error) {
    res.json({ error })
  }
}

export default getPhotos
