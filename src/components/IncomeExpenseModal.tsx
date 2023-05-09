import { useEffect } from "react"
import { useRecoilState } from "recoil"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { addDoc, collection } from "firebase/firestore"

import {
  Box,
  Button,
  Modal,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material"

import { MonetaryOperation } from "../types"
import { auth, db } from "../firebase"
import { incomeExpenseModalOpen } from "../state/atoms/ui"

import FormTextField from "./form/FormTextField"
import FormDateTimePicker from "./form/FormDateTimePicker"

const TextField = FormTextField<Form>
const DateTimePicker = FormDateTimePicker<Form>

type Props = {
  preselect: MonetaryOperation
}

type Form = {
  monetaryOperation: MonetaryOperation
  amount: number
  date: Date
}

const IncomeExpenseModal = ({ preselect }: Props) => {
  const [open, setOpen] = useRecoilState(incomeExpenseModalOpen)

  const { control, handleSubmit, setValue, reset } = useForm<Form>({
    mode: "onChange",
    defaultValues: {
      monetaryOperation: preselect,
      amount: 0,
      date: new Date(),
    },
  })

  useEffect(() => {
    setValue("monetaryOperation", preselect)
  }, [preselect, setValue])

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      await addDoc(collection(db, "transactions"), {
        uid: auth.currentUser?.uid,
        amount: +data.amount,
        monetaryOperation: data.monetaryOperation,
        date: data.date.toISOString(),
      })
    } catch (error) {
      console.error(error)
    }

    reset()
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset()
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
          {preselect === "expense" ? "Add an expense" : "Add an income"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="monetaryOperation"
            control={control}
            render={({ field }) => {
              return <input type="hidden" {...field} />
            }}
          />
          <Grid container direction="column" spacing={2}>
            <Grid>
              <TextField
                fullWidth
                name="amount"
                label="Amount"
                control={control}
                rules={{
                  required: "This field is required",
                  pattern: { value: /^\d+$/, message: "Fill in numbers only" },
                }}
                data-testid="amount"
              />
            </Grid>
            <Grid>
              <DateTimePicker
                name="date"
                label="Date"
                control={control}
                data-testid="datetime"
              />
            </Grid>
            <Grid>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  )
}

export default IncomeExpenseModal
