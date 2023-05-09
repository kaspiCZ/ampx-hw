import { useTransition } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material"
import { Menu as MenuIcon } from "@mui/icons-material"

import { SIGN_IN, SIGN_OUT } from "../constants/routes"
import useAuthenticatedUser from "../hooks/authenticated-user"

const AppLayout = () => {
  const [, startTransition] = useTransition()
  const navigate = useNavigate()
  const [user, loading] = useAuthenticatedUser()

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            {loading ? null : user ? (
              <>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ marginInlineEnd: "1em" }}
                >
                  {user.displayName || user.email}
                </Typography>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => {
                    startTransition(() => navigate(SIGN_OUT))
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => {
                  startTransition(() => navigate(SIGN_IN))
                }}
              >
                Sign in
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ flexDirection: "column", flexGrow: 1 }}>
        <Outlet />
      </Box>
    </>
  )
}

export default AppLayout
