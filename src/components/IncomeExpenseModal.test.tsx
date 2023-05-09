import { PropsWithChildren } from "react"
import { RecoilRoot } from "recoil"

import { render, screen, userEvent } from "../utils/test-utils"
import { incomeExpenseModalOpen } from "../state/atoms/ui"

import IncomeExpenseModal from "./IncomeExpenseModal"

describe("components/IncomeExpenseModal", () => {
  it("renders closed", () => {
    render(<IncomeExpenseModal preselect="expense" />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <RecoilRoot>{children}</RecoilRoot>
      ),
    })

    expect(screen.queryByText("Save")).not.toBeInTheDocument()
  })

  it("renders open and validates input", async () => {
    const { rerender } = render(<IncomeExpenseModal preselect="expense" />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <RecoilRoot
          initializeState={({ set }) => {
            set(incomeExpenseModalOpen, true)
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

    rerender(<IncomeExpenseModal preselect="income" />)
    expect(screen.getByText("Add an income")).toBeInTheDocument()
  })
})
