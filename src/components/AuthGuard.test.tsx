import { Mock } from "vitest"
import { Router } from "react-router"
import { MemoryHistory, createMemoryHistory } from "history"

import { RenderOptions, render } from "../utils/test-utils"

import AuthGuard from "./AuthGuard"

import useAuthenticatedUser from "../hooks/authenticated-user"
vi.mock("../hooks/authenticated-user")

describe("components/AuthGuard", () => {
  let wrapper: RenderOptions["wrapper"]
  let history: MemoryHistory

  beforeAll(() => {
    wrapper = ({ children }) => {
      return (
        <Router navigator={history} location={history.location}>
          {children}
        </Router>
      )
    }
  })

  beforeEach(() => {
    history = createMemoryHistory()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("navigates to /", () => {
    history.push("/someroute")

    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [undefined, false])

    render(<AuthGuard />, { wrapper })

    expect(history.location.pathname).toBe("/")
  })

  it("does not navigate", async () => {
    history.push("/someroute")

    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [{ email: "test@example.com" }, false])

    render(<AuthGuard />, { wrapper })

    expect(history.location.pathname).toBe("/someroute")
  })
})
