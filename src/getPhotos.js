import getFirebase from '../firebase/firebase'

const getPhotos = async () => {
  try {
    const firebase = await getFirebase()
    let imgResp

    const fromCache = await firebase
      .firestore()
      .collection('images')
      .get({
        source: 'cache',
      })

    if (!fromCache.empty) {
      imgResp = fromCache.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      // console.log('from cache', imgResp)
    } else {
      const fromServer = await firebase
        .firestore()
        .collection('images')
        .get({ source: 'server' })

      imgResp = fromServer.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      // console.log('from server', imgResp)

      // set up cache
      window.snapshotObserver = await firebase
        .firestore()
        .collection('images')
        .onSnapshot({ includeQueryMetadataChanges: true }, (s) => {
          s.docChanges().map((change) => ({ id: change.doc.id, ...change.doc.data() }))
          // const source = s.metadata.fromCache ? 'local cache' : 'server'
          // console.log(`Data came from ${source}`)
        })
    }

    return { imgResp }
  } catch (error) {
    return { error }
  }
}

export default getPhotos
