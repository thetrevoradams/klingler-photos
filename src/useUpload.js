import { useCollection } from 'swr-firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const addDbEntry = async (fileUrl, user, filename) => {
  try {
    const { add } = useCollection('images')

    const resp = await add({
      contributorId: user.uid,
      filename,
      contributorName: user.firstName,
      date: new Date(),
      url: fileUrl,
    });
    
    return { resp }
  } catch (error) {
    return { error }
  }
}

const uploadFiles = async (files, user) => {
  try {
    const storage = getStorage();

    for (const file of files) {
      const storageRef = ref(storage, file.name);
      const uploadResp = await uploadBytes(storageRef, file)
      const fileUrl = await getDownloadURL(uploadResp.ref)
      await addDbEntry(fileUrl, user, file.name)
    }
    return { success: 'success' }
  } catch (error) {
    return { error }
  }
}

export default uploadFiles
