import { Mock } from "vitest"
import { Route, Router, Routes } from "react-router-dom"
import { MemoryHistory, createMemoryHistory } from "history"
import { RecoilRoot } from "recoil"

import { RenderOptions, render, screen } from "../utils/test-utils"

import AppLayout from "./AppLayout"

import useAuthenticatedUser from "../hooks/authenticated-user"
vi.mock("../hooks/authenticated-user")

describe("components/AppLayout", () => {
  let wrapper: RenderOptions["wrapper"]
  let history: MemoryHistory

  beforeAll(() => {
    wrapper = ({ children }) => {
      return (
        <RecoilRoot>
          <Router navigator={history} location={history.location}>
            {children}
          </Router>
        </RecoilRoot>
      )
    }
  })

  beforeEach(() => {
    history = createMemoryHistory()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("renders", async () => {
    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [{ email: "test@example.com" }, false])

    render(<AppLayout />, {
      wrapper,
    })

    expect(screen.getByText("Sign out")).toBeInTheDocument()
    expect(screen.getByText("test@example.com")).toBeInTheDocument()
  })

  it("renders with outlet", () => {
    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [undefined, false])

    render(
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<>Dashboard</>} />
        </Route>
      </Routes>,
      {
        wrapper,
      },
    )

    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })
})
