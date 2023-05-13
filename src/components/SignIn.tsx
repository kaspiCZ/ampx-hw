import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { SubmitHandler, useForm } from "react-hook-form"
import { useResetRecoilState, useSetRecoilState } from "recoil"
import {
  Button,
  Card,
  CardContent,
  Container,
  Unstable_Grid2 as Grid,
  useTheme,
  Typography,
  Alert,
} from "@mui/material"

import { DASHBOARD } from "../constants/routes"
import { auth } from "../firebase"
import useAuthenticatedUser from "../hooks/authenticated-user"

import FormTextField from "./form/FormTextField"
import { aSnackbar } from "../state/atoms/ui"

const TextField = FormTextField<Form>

type Form = {
  email: string
  password: string
}

const SignIn = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [user, loading] = useAuthenticatedUser()
  const setSnackbarState = useSetRecoilState(aSnackbar)
  const resetSnackbarState = useResetRecoilState(aSnackbar)

  const { control, handleSubmit } = useForm<Form>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)

      navigate(DASHBOARD)

      setSnackbarState({
        open: true,
        children: (
          <Alert
            onClose={() => resetSnackbarState()}
            severity="success"
            sx={{ width: "100%" }}
          >
            Successfully signed in 👏
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
            Wrong e-mail and/or password 😔
          </Alert>
        ),
      })
    }
  }

  useEffect(() => {
    if (user) {
      navigate(DASHBOARD)
    }
  }, [navigate, user])

  if (loading || user) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="sm" sx={{ mt: theme.spacing(4) }}>
        <Typography variant="h3" component="h1">
          Sign in
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  label="E-mail"
                  control={control}
                  rules={{
                    required: "This field is required",
                  }}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  label="Password"
                  control={control}
                  rules={{
                    required: "This field is required",
                  }}
                />
              </Grid>
              <Grid xs={12}>
                <Button fullWidth variant="contained" type="submit">
                  Sign in
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </form>
  )
}

export default SignIn
