import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import CssBaseline from "@mui/material/CssBaseline"

import { INDEX, SIGN_IN, SIGN_OUT } from "./constants/routes"

import AuthGuard from "./components/AuthGuard"

const AppLayout = lazy(() => import("./components/AppLayout"))
const Dashboard = lazy(() => import("./components/Dashboard"))
const SignIn = lazy(() => import("./components/SignIn"))
const SignOut = lazy(() => import("./components/SignOut"))

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path={INDEX} element={<AppLayout />}>
            <Route
              index
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
          </Route>
          <Route path={SIGN_IN} element={<SignIn />} />
          <Route path={SIGN_OUT} element={<SignOut />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
