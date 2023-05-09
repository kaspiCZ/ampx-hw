import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import CssBaseline from "@mui/material/CssBaseline"

import { DASHBOARD, INDEX, SIGN_IN, SIGN_OUT } from "./constants/routes"

import AuthGuard from "./components/AuthGuard"

const AppLayout = lazy(() => import("./components/AppLayout"))
const Intro = lazy(() => import("./components/Intro"))
const Dashboard = lazy(() => import("./components/Dashboard"))
const SignIn = lazy(() => import("./components/SignIn"))
const SignOut = lazy(() => import("./components/SignOut"))

function App() {
  return (
    <>
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
    </>
  )
}

export default App
