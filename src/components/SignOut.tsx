import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useResetRecoilState, useSetRecoilState } from "recoil"
import { signOut } from "firebase/auth"
import { Alert } from "@mui/material"

import { SIGN_IN } from "../constants/routes"
import useAuthenticatedUser from "../hooks/authenticated-user"
import { auth } from "../firebase"
import { aSnackbar } from "../state/atoms/ui"

const SignOut = () => {
  const [user] = useAuthenticatedUser()
  const navigate = useNavigate()
  const setSnackbarState = useSetRecoilState(aSnackbar)
  const resetSnackbarState = useResetRecoilState(aSnackbar)

  useEffect(() => {
    const executeSignOut = async () => {
      try {
        await signOut(auth)

        navigate(SIGN_IN)

        setSnackbarState({
          open: true,
          children: (
            <Alert
              onClose={() => resetSnackbarState()}
              severity="success"
              sx={{ width: "100%" }}
            >
              Signed out 👋 see you later
            </Alert>
          ),
        })
      } catch (error) {
        setSnackbarState({
          open: true,
          children: (
            <Alert
              onClose={() => resetSnackbarState()}
              severity="error"
              sx={{ width: "100%" }}
            >
              An error occured during sign out 😔
            </Alert>
          ),
        })
        console.error(error)
      }
    }

    if (user) {
      executeSignOut()
    }
  }, [navigate, resetSnackbarState, setSnackbarState, user])

  return <></>
}

export default SignOut
