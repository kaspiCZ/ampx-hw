import { Mock } from "vitest"
import { Router } from "react-router"
import { MemoryHistory, createMemoryHistory } from "history"

import { RenderOptions, render, waitFor } from "../utils/test-utils"

import SignOut from "./SignOut"

import useAuthenticatedUser from "../hooks/authenticated-user"
vi.mock("../hooks/authenticated-user")

import { signOut } from "firebase/auth"
vi.mock("firebase/auth")

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

  it("signs out", async () => {
    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [{ email: "test@example.com" }, false])

    const mockedSignOut = signOut as Mock
    mockedSignOut.mockImplementation(async () => true)

    render(<SignOut />, { wrapper })

    expect(history.location.pathname).toBe("/")

    await waitFor(() => {
      expect(history.location.pathname).toBe("/signin")
    })
  })
})
