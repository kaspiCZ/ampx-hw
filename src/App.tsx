import { lazy } from "react"
import { useRecoilValue } from "recoil"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"

import { DASHBOARD, INDEX, SIGN_IN, SIGN_OUT } from "./constants/routes"
import { aPaletteMode } from "./state/atoms/ui"

import AuthGuard from "./components/AuthGuard"

const AppLayout = lazy(() => import("./components/AppLayout"))
const Intro = lazy(() => import("./components/Intro"))
const Dashboard = lazy(() => import("./components/Dashboard"))
const SignIn = lazy(() => import("./components/SignIn"))
const SignOut = lazy(() => import("./components/SignOut"))

const App = () => {
  const mode = useRecoilValue(aPaletteMode)

  const theme = createTheme({
    palette: { mode },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<AuthGuard allow="anonymous" />}>
            <Route path={INDEX} element={<Intro />} />
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
    </ThemeProvider>
  )
}

export default App
