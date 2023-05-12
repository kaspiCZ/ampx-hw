import { useTransition } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useRecoilState, useSetRecoilState } from "recoil"
import {
  AppBar,
  Box,
  Button,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material"
import {
  Add,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Remove,
} from "@mui/icons-material"

import { SIGN_OUT } from "../constants/routes"
import {
  aIncomeExpenseModalOpen,
  aIncomeExpenseModalState,
  aPaletteMode,
} from "../state/atoms/ui"
import useAuthenticatedUser from "../hooks/authenticated-user"
import IncomeExpenseModal from "./IncomeExpenseModal"

const AppLayout = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [, startTransition] = useTransition()
  const [user] = useAuthenticatedUser()
  const setModalOpen = useSetRecoilState(aIncomeExpenseModalOpen)
  const setModalData = useSetRecoilState(aIncomeExpenseModalState)
  const [paletteMode, setPaletteMode] = useRecoilState(aPaletteMode)

  const actions = [
    {
      name: "Add income",
      icon: <Add color="success" />,
      onClick: () => {
        setModalData({
          monetaryOperation: "income",
        })
        setModalOpen(true)
      },
    },
    {
      name: "Add expense",
      icon: <Remove color="error" />,
      onClick: () => {
        setModalData({
          monetaryOperation: "expense",
        })
        setModalOpen(true)
      },
    },
  ]

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
            {user ? (
              <Box sx={{ marginInlineEnd: "1em" }}>
                <Typography variant="body1" component="div">
                  {user.displayName || user.email}
                </Typography>
              </Box>
            ) : null}
            <Box sx={{ marginInlineEnd: "1em" }}>
              <IconButton
                onClick={() => {
                  setPaletteMode(paletteMode === "light" ? "dark" : "light")
                }}
                color="inherit"
              >
                {theme.palette.mode === "dark" ? (
                  <Brightness7 />
                ) : (
                  <Brightness4 />
                )}
              </IconButton>
            </Box>
            {user ? (
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => {
                  startTransition(() => navigate(SIGN_OUT))
                }}
              >
                Sign out
              </Button>
            ) : null}
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ flexDirection: "column", flexGrow: 1 }}>
        <Outlet />
      </Box>

      <SpeedDial
        ariaLabel="What do you want to do?"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
      <IncomeExpenseModal />
    </>
  )
}

export default AppLayout
