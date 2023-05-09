import { Outlet, Navigate } from "react-router-dom"

import { DASHBOARD, INDEX } from "../constants/routes"
import useAuthenticatedUser from "../hooks/authenticated-user"

type Props = {
  allow?: "authenticated" | "anonymous"
}

const AuthGuard = ({ allow = "authenticated" }: Props) => {
  const [user, loading] = useAuthenticatedUser()

  if (loading) {
    return null
  }

  if (allow === "anonymous" && user) {
    return <Navigate to={DASHBOARD} />
  }

  if (allow === "authenticated" && !user) {
    return <Navigate to={INDEX} />
  }

  return <Outlet />
}

export default AuthGuard
