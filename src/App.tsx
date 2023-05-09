import { lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import CssBaseline from "@mui/material/CssBaseline"

import { SIGN_OUT } from "./constants/routes"

const SignOut = lazy(() => import("./components/SignOut"))

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path={SIGN_OUT} element={<SignOut />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
