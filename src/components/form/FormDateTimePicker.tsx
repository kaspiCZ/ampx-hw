import {
  Controller,
  FieldValues,
  UseControllerProps,
  UseFormReturn,
} from "react-hook-form"
import {
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

type Props<T extends FieldValues> = {
  name: UseControllerProps<T>["name"]
  control: UseFormReturn<T>["control"]
} & DateTimePickerProps<Date>

const FormDateTimePicker = <T extends FieldValues>({
  name,
  control,
  ...dateTimePickerProps
}: Props<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker {...field} {...dateTimePickerProps} />
      </LocalizationProvider>
    )}
  />
)

export default FormDateTimePicker
