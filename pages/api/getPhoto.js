import firebase from '../../utils/firebaseAdmin'

export default async (req, res) => {
  console.log('req.query.id', req.query.id)
  try {
    const image = await firebase
      .collection('images')
      .doc(req.query.id)
      .get()
    if (image.exists) {
      res.json({ image: { id: req.query.id, ...image.data() } })
    } else {
      res.json({ error: image })
    }
  } catch (error) {
    res.json({ error })
  }
}
