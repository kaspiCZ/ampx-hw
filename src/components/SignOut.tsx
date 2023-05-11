import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { SIGN_IN } from "../constants/routes"
import useAuthenticatedUser from "../hooks/authenticated-user"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"

const SignOut = () => {
  const [user] = useAuthenticatedUser()
  const navigate = useNavigate()

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

  return <></>
}

export default SignOut
