import { useState, useTransition } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil"

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
} from "@mui/material"
import { Add, Menu as MenuIcon, Remove } from "@mui/icons-material"

import { MonetaryOperation } from "../types"
import { SIGN_IN, SIGN_OUT } from "../constants/routes"
import { incomeExpenseModalOpen } from "../state/atoms/ui"
import useAuthenticatedUser from "../hooks/authenticated-user"

import IncomeExpenseModal from "./IncomeExpenseModal"

const AppLayout = () => {
  const navigate = useNavigate()
  const [, startTransition] = useTransition()
  const [user, loading] = useAuthenticatedUser()
  const [monetaryOperation, setMonetaryOperation] =
    useState<MonetaryOperation>("expense")
  const setModalOpen = useSetRecoilState(incomeExpenseModalOpen)

  const actions = [
    {
      name: "Add expense",
      icon: <Remove color="error" />,
      onClick: () => {
        setMonetaryOperation("expense")
        setModalOpen(true)
      },
    },
    {
      name: "Add income",
      icon: <Add color="success" />,
      onClick: () => {
        setMonetaryOperation("income")
        setModalOpen(true)
      },
    },
  ].reverse()

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
      <SpeedDial
        ariaLabel="What do you want to do?"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
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
      <IncomeExpenseModal preselect={monetaryOperation} />
    </>
  )
}

export default AppLayout
