import { FormEventHandler, useEffect, useState } from "react"
import { redirect, useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"

import { Button, TextField } from "@mui/material"

import { INDEX } from "../constants/routes"
import { auth } from "../firebase"
import useAuthenticatedUser from "../hooks/authenticated-user"

const SignIn = () => {
  const navigate = useNavigate()

  const [user, loading] = useAuthenticatedUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signIn: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    try {
      await signInWithEmailAndPassword(auth, email, password)

      redirect(INDEX)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (user) {
      navigate(INDEX)
    }
  }, [navigate, user])

  if (loading || user) {
    return null
  }

  return (
    <>
      <form onSubmit={signIn}>
        <TextField
          required
          type="email"
          variant="standard"
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          type="password"
          variant="standard"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Sign in
        </Button>
      </form>
    </>
  )
}

export default SignIn
