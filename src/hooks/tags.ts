import { useEffect } from "react"
import { useSetRecoilState } from "recoil"
import { collection, onSnapshot, query, where } from "firebase/firestore"

import { Tags } from "../types"
import { auth, db } from "../firebase"
import { aTags } from "../state/atoms/ui"

// TODO write tests with Firebase mocks

const useTags = () => {
  const setTags = useSetRecoilState(aTags)

  useEffect(() => {
    try {
      const tagsSnapshot = query(
        collection(db, "tags"),
        where("uid", "==", auth.currentUser?.uid),
      )

      const unsubscribe = onSnapshot(tagsSnapshot, (querySnapshot) => {
        const newTags: Tags = {}

        querySnapshot.docs.forEach((document) => {
          newTags[document.id] = document.data().name
        })

        setTags(newTags)
      })

      return () => {
        unsubscribe()
      }
    } catch (error) {
      console.error(error)
    }
  }, [setTags])
}

export default useTags
