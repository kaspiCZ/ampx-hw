import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { Button, Unstable_Grid2 as Grid } from "@mui/material"

import { MonetaryOperation } from "../../types"
import {
  aIncomeExpenseModalState,
  aIncomeExpenseModalOpen,
} from "../../state/atoms/ui"
import { auth, db } from "../../firebase"

import FormDateTimePicker from "./FormDateTimePicker"
import FormTextField from "./FormTextField"

const TextField = FormTextField<Form>
const DateTimePicker = FormDateTimePicker<Form>

type Form = {
  monetaryOperation: MonetaryOperation
  amount: number
  date: Date
}

const IncomeExpenseForm = () => {
  const setOpen = useSetRecoilState(aIncomeExpenseModalOpen)
  const { monetaryOperation, transaction } = useRecoilValue(
    aIncomeExpenseModalState,
  )
  const resetModalState = useResetRecoilState(aIncomeExpenseModalState)

  let defaultValues = {
    monetaryOperation,
    amount: 0,
    date: new Date(),
  }

  if (transaction) {
    const { amount, monetaryOperation, date } = transaction

    defaultValues = {
      monetaryOperation,
      amount,
      date: new Date(date),
    }
  }

  const { control, handleSubmit, reset } = useForm<Form>({
    mode: "onChange",
    defaultValues,
  })

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      const saveData = {
        amount: +data.amount,
        monetaryOperation: data.monetaryOperation,
        date: data.date.toISOString(),
      }

      if (transaction?.id) {
        await updateDoc(doc(db, `transactions/${transaction.id}`), saveData)
      } else {
        await addDoc(collection(db, "transactions"), {
          uid: auth.currentUser?.uid,
          ...saveData,
        })
      }
    } catch (error) {
      console.error(error)
    }

    reset()
    resetModalState()
    setOpen(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="monetaryOperation"
        control={control}
        render={({ field }) => <input type="hidden" {...field} />}
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
  )
}

export default IncomeExpenseForm
