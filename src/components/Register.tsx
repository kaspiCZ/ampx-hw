import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
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
import { aSnackbar } from "../state/atoms/ui"

import FormTextField from "./form/FormTextField"

const TextField = FormTextField<Form>

type Form = {
  email: string
  password: string
  passwordConfirmation: string
}

const Register = () => {
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
      passwordConfirmation: "",
    },
  })

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password)

      navigate(DASHBOARD)

      setSnackbarState({
        open: true,
        children: (
          <Alert
            onClose={() => resetSnackbarState()}
            severity="success"
            sx={{ width: "100%" }}
          >
            Registered and signed in 🙌 welcome
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
            Failed to register your new account 😔
          </Alert>
        ),
      })
      console.error(error)
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
          Register a new account
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  label="E-mail"
                  control={control}
                  rules={{
                    required: "This field is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // as per https://www.regular-expressions.info/email.html
                      message: "This does not look like an e-mail",
                    },
                  }}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  label="Password"
                  control={control}
                  rules={{
                    required: "This field is required",
                    validate: (value) => {
                      if (value?.length < 8) {
                        return "At least 8 characters needed"
                      }

                      // based on https://stackoverflow.com/a/5142164
                      return /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/i.test(
                        value,
                      )
                        ? true
                        : "Use at least one of each: uppercase letter, lowercase letter, number, special character "
                    },
                  }}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  name="passwordConfirmation"
                  type="password"
                  label="Confirm password"
                  control={control}
                  rules={{
                    required: "This field is required",
                    validate: (passwordConfirmationValue, formValues) => {
                      return passwordConfirmationValue === formValues.password
                        ? true
                        : "Passwords do not match"
                    },
                  }}
                />
              </Grid>
              <Grid xs={12}>
                <Button fullWidth variant="contained" type="submit">
                  Register
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </form>
  )
}

export default Register
