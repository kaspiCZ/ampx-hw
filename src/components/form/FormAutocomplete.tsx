import {
  Controller,
  FieldValues,
  UseControllerProps,
  UseFormReturn,
} from "react-hook-form"
import { Autocomplete, AutocompleteProps, TextField } from "@mui/material"

type Props<
  T extends FieldValues,
  AutocompleteOptions,
  Multiple extends boolean,
  DisableClearable extends boolean,
  FreeSolo extends boolean,
> = {
  name: UseControllerProps<T>["name"]
  control: UseFormReturn<T>["control"]
  label: string
  rules?: UseControllerProps<T>["rules"]
} & Omit<
  AutocompleteProps<AutocompleteOptions, Multiple, DisableClearable, FreeSolo>,
  "renderInput"
>

const FormAutocomplete = <
  T extends FieldValues,
  AutocompleteOptions,
  Multiple extends boolean,
  DisableClearable extends boolean,
  FreeSolo extends boolean,
>({
  name,
  control,
  label,
  rules,
  ...autocompleteProps
}: Props<T, AutocompleteOptions, Multiple, DisableClearable, FreeSolo>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        const { onChange, ...fieldProps } = field

        return (
          <Autocomplete
            {...fieldProps}
            {...autocompleteProps}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id={name}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={label} />}
            onChange={(_event, data) => onChange(data)}
          />
        )
      }}
    />
  )
}

export default FormAutocomplete
