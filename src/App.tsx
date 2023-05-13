import { lazy } from "react"
import { useRecoilValue, useResetRecoilState } from "recoil"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import {
  createTheme,
  CssBaseline,
  Snackbar,
  ThemeProvider,
} from "@mui/material"

import {
  DASHBOARD,
  INDEX,
  REGISTER,
  SIGN_IN,
  SIGN_OUT,
} from "./constants/routes"
import { aPaletteMode, aSnackbar } from "./state/atoms/ui"

import AuthGuard from "./components/AuthGuard"

const AppLayout = lazy(() => import("./components/AppLayout"))
const Intro = lazy(() => import("./components/Intro"))
const Dashboard = lazy(() => import("./components/Dashboard"))
const Register = lazy(() => import("./components/Register"))
const SignIn = lazy(() => import("./components/SignIn"))
const SignOut = lazy(() => import("./components/SignOut"))

const App = () => {
  const mode = useRecoilValue(aPaletteMode)
  const snackbarState = useRecoilValue(aSnackbar)
  const resetSnackbarState = useResetRecoilState(aSnackbar)

  const theme = createTheme({
    palette: { mode },
  })

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return
    }

    resetSnackbarState()
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<AuthGuard allow="anonymous" />}>
            <Route path={INDEX} element={<Intro />} />
            <Route path={REGISTER} element={<Register />} />
            <Route path={SIGN_IN} element={<SignIn />} />
          </Route>
          <Route element={<AuthGuard />}>
            <Route path={DASHBOARD} element={<AppLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path={SIGN_OUT} element={<SignOut />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        children={snackbarState.children}
      />
    </ThemeProvider>
  )
}

export default App
