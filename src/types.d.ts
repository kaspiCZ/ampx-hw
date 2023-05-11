export type MonetaryOperation = "income" | "expense"

export type Tags = {
  [id in string]: string
}

export type Transaction = {
  id: string
  amount: number
  date: string
  monetaryOperation: MonetaryOperation
  tags: string[]
}
