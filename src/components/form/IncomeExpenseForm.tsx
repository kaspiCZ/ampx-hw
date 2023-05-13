import { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore"
import {
  Alert,
  Button,
  Unstable_Grid2 as Grid,
  createFilterOptions,
} from "@mui/material"

import { Transaction, Tag } from "../../types"
import {
  aIncomeExpenseModalState,
  aIncomeExpenseModalOpen,
  aSnackbar,
} from "../../state/atoms/ui"
import { aTagsAsOptions } from "../../state/selectors/ui"
import { auth, db } from "../../firebase"

import FormDateTimePicker from "./FormDateTimePicker"
import FormTextField from "./FormTextField"
import FormAutocomplete from "./FormAutocomplete"

const TextField = FormTextField<Form>
const DateTimePicker = FormDateTimePicker<Form>
const Autocomplete = FormAutocomplete<Form, Tag, true, false, true>

const filter = createFilterOptions<Tag>()

type Form = Omit<Transaction, "id">

type SaveData = Pick<Transaction, "amount" | "info" | "monetaryOperation"> & {
  date: string
  tags: DocumentReference<DocumentData>[]
}

/**
 * TODO update test with new fields
 */
const IncomeExpenseForm = () => {
  const setOpen = useSetRecoilState(aIncomeExpenseModalOpen)
  const { monetaryOperation, transaction } = useRecoilValue(
    aIncomeExpenseModalState,
  )
  const resetModalState = useResetRecoilState(aIncomeExpenseModalState)
  const setSnackbarState = useSetRecoilState(aSnackbar)
  const resetSnackbarState = useResetRecoilState(aSnackbar)
  const tagsAsOptions = useRecoilValue(aTagsAsOptions)
  const [options, setOptions] = useState<Tag[]>([])

  useEffect(() => {
    setOptions(tagsAsOptions)
  }, [tagsAsOptions])

  let defaultValues: Form = {
    monetaryOperation,
    amount: 0,
    date: new Date(),
    tags: [],
    info: "",
  }

  if (transaction) {
    const { amount, monetaryOperation, date, tags, info } = transaction

    defaultValues = {
      monetaryOperation,
      amount,
      date: new Date(date),
      tags: tags || [],
      info: info || "",
    }
  }

  const { control, handleSubmit, reset } = useForm<Form>({
    mode: "onChange",
    defaultValues,
  })

  const onSubmit: SubmitHandler<Form> = async (data) => {
    try {
      for (const tag of data.tags) {
        if (tag.id) {
          continue
        }

        const newTag = await addDoc(collection(db, "tags"), {
          uid: auth.currentUser?.uid,
          title: tag.inputValue ? tag.inputValue : tag.title,
        })

        tag.id = newTag.id
      }

      const saveData: SaveData = {
        amount: +data.amount,
        monetaryOperation: data.monetaryOperation,
        date: data.date.toISOString(),
        tags: data.tags.map((tag) => doc(db, `/tags/${tag.id}`)),
        info: data.info || "",
      }

      if (transaction?.id) {
        await updateDoc(doc(db, `transactions/${transaction.id}`), saveData)
      } else {
        await addDoc(collection(db, "transactions"), {
          uid: auth.currentUser?.uid,
          ...saveData,
        })
      }

      setSnackbarState({
        open: true,
        children: (
          <Alert
            onClose={() => resetSnackbarState()}
            severity="success"
            sx={{ width: "100%" }}
          >
            Success 👍
          </Alert>
        ),
      })
    } catch (error) {
      setSnackbarState({
        open: true,
        children: (
          <Alert
            onClose={() => resetSnackbarState()}
            severity="error"
            sx={{ width: "100%" }}
          >
            An error occured 😔
          </Alert>
        ),
      })
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
          />
        </Grid>
        <Grid>
          <Autocomplete
            name="tags"
            label="Tags"
            multiple
            freeSolo
            control={control}
            options={options}
            filterSelectedOptions
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.title
            }
            isOptionEqualToValue={(option, value) =>
              option.title === value.title
            }
            filterOptions={(options, params) => {
              const filtered = filter(options, params)
              const { inputValue } = params

              const isExisting = options.some(
                (option) => inputValue === option.title,
              )

              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  inputValue,
                  title: `Add "${inputValue}"`,
                })
              }

              return filtered
            }}
          />
        </Grid>
        <Grid>
          <DateTimePicker
            sx={{ width: "100%" }}
            name="date"
            label="Date"
            control={control}
            data-testid="datetime"
          />
        </Grid>
        <Grid>
          <TextField
            fullWidth
            name="info"
            control={control}
            label="(Optional) Info"
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
