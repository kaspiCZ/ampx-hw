import { PropsWithChildren } from "react"
import { RecoilRoot } from "recoil"
import { format } from "date-fns"

import { render, screen, userEvent } from "../utils/test-utils"
import {
  aIncomeExpenseModalOpen,
  aIncomeExpenseModalState,
} from "../state/atoms/ui"

import IncomeExpenseModal from "./IncomeExpenseModal"

describe("components/IncomeExpenseModal", () => {
  it("renders closed", () => {
    render(<IncomeExpenseModal />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <RecoilRoot>{children}</RecoilRoot>
      ),
    })

    expect(screen.queryByText("Save")).not.toBeInTheDocument()
  })

  it("renders open and validates input for expense", async () => {
    render(<IncomeExpenseModal />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <RecoilRoot
          initializeState={({ set }) => {
            set(aIncomeExpenseModalState, { monetaryOperation: "expense" })
            set(aIncomeExpenseModalOpen, true)
          }}
        >
          {children}
        </RecoilRoot>
      ),
    })

    const button = screen.getByText("Save")

    expect(screen.getByText("Add an expense")).toBeInTheDocument()
    expect(button).toBeInTheDocument()

    const amount = screen.getByLabelText("Amount")

    await userEvent.type(amount, "ASD")
    expect(screen.getByText("Fill in numbers only")).toBeInTheDocument()

    await userEvent.clear(amount)
    expect(screen.getByText("This field is required")).toBeInTheDocument()
  })

  it("renders open for income", async () => {
    render(<IncomeExpenseModal />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <RecoilRoot
          initializeState={({ set }) => {
            set(aIncomeExpenseModalState, { monetaryOperation: "income" })
            set(aIncomeExpenseModalOpen, true)
          }}
        >
          {children}
        </RecoilRoot>
      ),
    })

    const button = screen.getByText("Save")

    expect(screen.getByText("Add an income")).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })

  it("renders open for editing income", async () => {
    const now = new Date()

    render(<IncomeExpenseModal />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <RecoilRoot
          initializeState={({ set }) => {
            set(aIncomeExpenseModalState, {
              monetaryOperation: "income",
              transaction: {
                id: "transactionId",
                amount: 1000,
                date: now,
                monetaryOperation: "income",
                tags: [
                  {
                    title: "sport",
                    id: "tagId",
                  },
                ],
              },
            })
            set(aIncomeExpenseModalOpen, true)
          }}
        >
          {children}
        </RecoilRoot>
      ),
    })

    const button = screen.getByText("Save")

    expect(screen.getByText("Edit an income")).toBeInTheDocument()
    expect(button).toBeInTheDocument()

    expect(screen.getByLabelText<HTMLInputElement>("Amount").value).toBe("1000")

    expect(screen.getByLabelText<HTMLInputElement>("Date").value).toBe(
      format(now, "MM/dd/yyyy hh:mm a"),
    )
  })
})
