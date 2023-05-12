export type MonetaryOperation = "income" | "expense"

export type TagMap = {
  [id in string]: string
}

export type Tag = {
  id?: string
  title: string
  inputValue?: string
}

export type Transaction = {
  id: string
  amount: number
  date: Date
  info?: string
  monetaryOperation: MonetaryOperation
  tags: Tag[]
}
