import { useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"

import { auth } from "../firebase"

const useAuthenticatedUser = (): [User | null, boolean] => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (newUserValue) => {
        if (newUserValue !== undefined) {
          setUser(newUserValue)
        }
        setLoading(false)
      })

      return () => {
        try {
          unsubscribe()
        } catch (error) {
          console.error(error)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, [user])

  return [user, loading]
}

export default useAuthenticatedUser
