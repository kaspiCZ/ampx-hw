import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"

import { SIGN_IN } from "../constants/routes"
import { auth } from "../firebase"
import useAuthenticatedUser from "../hooks/authenticated-user"

const SignOut = () => {
  const navigate = useNavigate()
  const [user] = useAuthenticatedUser()

  useEffect(() => {
    const executeSignOut = async () => {
      try {
        await signOut(auth)

        navigate(SIGN_IN)
      } catch (error) {
        console.error(error)
      }
    }

    if (user) {
      executeSignOut()
    }
  }, [navigate, user])

  return null
}

export default SignOut
