import { atom } from "recoil"

import { MonetaryOperation, Tags, Transaction } from "../../types"

export const aTags = atom<Tags | Record<string, never>>({
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
