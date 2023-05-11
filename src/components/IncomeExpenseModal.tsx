import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
import { Box, Modal, Typography } from "@mui/material"

import {
  aIncomeExpenseModalState,
  aIncomeExpenseModalOpen,
} from "../state/atoms/ui"

import IncomeExpenseForm from "./form/IncomeExpenseForm"

const IncomeExpenseModal = () => {
  const [open, setOpen] = useRecoilState(aIncomeExpenseModalOpen)
  const { monetaryOperation, transaction } = useRecoilValue(
    aIncomeExpenseModalState,
  )
  const resetModalState = useResetRecoilState(aIncomeExpenseModalState)

  return (
    <Modal
      open={open}
      onClose={() => {
        resetModalState()
        setOpen(false)
      }}
      aria-labelledby="parent-modal-title"
    >
      <Box
        maxWidth={400}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h4" component="h2" id="parent-modal-title">
          {transaction?.id ? "Edit" : "Add"}
          {monetaryOperation === "expense" ? " an expense" : " an income"}
        </Typography>
        <IncomeExpenseForm />
      </Box>
    </Modal>
  )
}

export default IncomeExpenseModal
