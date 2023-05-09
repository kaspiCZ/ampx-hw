import { PropsWithChildren, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { INDEX } from "../constants/routes"
import useAuthenticatedUser from "../hooks/authenticated-user"

const AuthGuard = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const [user, loading] = useAuthenticatedUser()

  useEffect(() => {
    if (loading) {
      return
    }

    if (!user) {
      navigate(INDEX)
    }
  }, [loading, navigate, user])

  if (!loading && user) {
    return <>{children}</>
  }

  return null
}

export default AuthGuard
