import getFirebaseAdmin from '../../firebase/admin'

const getPhoto = async (req, res) => {
  try {
    const admin = await getFirebaseAdmin()

    const imagesResp = await admin
      .firestore()
      .collection('images')
      .get()

    const images = imagesResp.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    const imageIndex = images.findIndex((item) => item.id === req.query.id)
    const resp = { image: images[imageIndex] }
    if (imageIndex !== images.length - 1) resp.nextId = images[imageIndex + 1].id
    if (imageIndex !== 0) resp.prevId = images[imageIndex - 1].id

    if (imageIndex >= 0) {
      res.json(resp)
    } else {
      res.json({ error: imagesResp })
    }
  } catch (error) {
    res.json({ error })
  }
}

export default getPhoto
