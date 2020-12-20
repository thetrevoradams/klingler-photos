import firebase from '../../utils/firebaseAdmin'

export default async (req, res) => {
  try {
    const data = await firebase.collection('images').get()
    const images = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    console.log(`images`, images)
    res.json({ images })
  } catch (error) {
    res.json({ error })
  }
}
