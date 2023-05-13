import { atom } from "recoil"
import { PaletteMode, SnackbarProps } from "@mui/material"

import { MonetaryOperation, TagMap, Transaction } from "../../types"
import localStorageEffect from "../effects/local-storage"

export const aPaletteMode = atom<PaletteMode>({
  key: "palette-mode",
  default: "light",
  effects: [localStorageEffect("palette-mode")],
})

export const aSnackbar = atom<{
  open: boolean
  children?: SnackbarProps["children"]
}>({
  key: "snackbar",
  default: {
    open: false,
  },
})

export const aTags = atom<TagMap | Record<string, never>>({
  key: "tags",
  default: {},
})

export const aIncomeExpenseModalOpen = atom<boolean>({
  key: "income-expense-modal-open",
  default: false,
})

export const aIncomeExpenseModalState = atom<{
  monetaryOperation: MonetaryOperation
  transaction?: Transaction
}>({
  key: "income-expense-modal-edit-data",
  default: { monetaryOperation: "expense" },
})
