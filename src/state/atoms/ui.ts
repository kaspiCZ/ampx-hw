import { atom } from "recoil"
import { PaletteMode } from "@mui/material"

import { MonetaryOperation, TagMap, Transaction } from "../../types"
import localStorageEffect from "../effects/local-storage"

export const aPaletteMode = atom<PaletteMode>({
  key: "palette-mode",
  default: "light",
  effects: [localStorageEffect("palette-mode")],
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
