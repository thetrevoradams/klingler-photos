import firebase from '../../utils/firebaseAdmin'

export default async (req, res) => {
  try {
    const data = await firebase.collection('images').get()
    const images = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json({ images })
  } catch (error) {
    res.json({ error })
  }
}
