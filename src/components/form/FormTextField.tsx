import {
  Controller,
  FieldValues,
  UseControllerProps,
  UseFormReturn,
} from "react-hook-form"
import { TextField, TextFieldProps } from "@mui/material"

type Props<T extends FieldValues> = {
  name: UseControllerProps<T>["name"]
  control: UseFormReturn<T>["control"]
  rules?: UseControllerProps<T>["rules"]
} & TextFieldProps

const FormTextField = <T extends FieldValues>({
  name,
  control,
  rules,
  ...textFieldProps
}: Props<T>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState: { error } }) => {
      return (
        <TextField
          {...field}
          {...textFieldProps}
          error={!!error}
          helperText={error?.message}
        />
      )
    }}
  />
)

export default FormTextField
