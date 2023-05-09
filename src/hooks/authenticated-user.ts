import { useEffect, useState } from "react"
import { User, onAuthStateChanged } from "firebase/auth"

import { auth } from "../firebase"

const useAuthenticatedUser = (): [User | undefined, boolean] => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User>()

  useEffect(() => {
    onAuthStateChanged(auth, (newUserValue) => {
      if (newUserValue) {
        setUser(newUserValue)
      }

      if (newUserValue) {
        setLoading(false)
      }
    })
  }, [user])

  return [user, loading]
}

export default useAuthenticatedUser
