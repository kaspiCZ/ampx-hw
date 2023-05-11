import { PropsWithChildren } from "react"
import { RecoilRoot } from "recoil"
import { Mock } from "vitest"
import { format } from "date-fns"

import { render, screen } from "../utils/test-utils"

import Dashboard from "./Dashboard"

import useTags from "../hooks/tags"
vi.mock("../hooks/tags")

import useLastTransactions from "../hooks/last-transactions"
vi.mock("../hooks/last-transactions")

describe("components/dashboard", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders", () => {
    const now = new Date()

    const mockedTagsHook = useTags as Mock
    const mockedTagsImplementation: typeof useTags = () => ({})
    mockedTagsHook.mockImplementation(mockedTagsImplementation)

    const mockedTransactionsHook = useLastTransactions as Mock
    const mockedTransactionsImplementation: typeof useLastTransactions = () => [
      {
        id: "transactionId",
        amount: 100,
        date: now.toISOString(),
        monetaryOperation: "income",
        tags: [],
      },
    ]
    mockedTransactionsHook.mockImplementation(mockedTransactionsImplementation)

    render(<Dashboard />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <RecoilRoot>{children}</RecoilRoot>
      ),
    })

    expect(screen.getByText("100.00")).toBeInTheDocument()
    expect(
      screen.getByText(format(now, "yyyy-MM-dd HH:mm:ss")),
    ).toBeInTheDocument()
  })
})
