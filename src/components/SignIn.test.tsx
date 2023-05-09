import { Mock } from "vitest"
import { Router } from "react-router"
import { MemoryHistory, createMemoryHistory } from "history"

import { RenderOptions, render, screen, userEvent } from "../utils/test-utils"

import SignIn from "./SignIn"

import useAuthenticatedUser from "../hooks/authenticated-user"
vi.mock("../hooks/authenticated-user")

import { signInWithEmailAndPassword } from "firebase/auth"
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

  it("redirects authenticated user to /", () => {
    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [{ email: "test@example.com" }, false])

    const mockedSignIn = signInWithEmailAndPassword as Mock
    mockedSignIn.mockImplementation(async () => true)

    render(<SignIn />, { wrapper })

    expect(screen.queryByText("Sign in")).not.toBeInTheDocument()
    expect(history.location.pathname).toBe("/")
  })

  it("renders from and authenticates user", async () => {
    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [undefined, false])

    const mockedSignIn = signInWithEmailAndPassword as Mock
    mockedSignIn.mockImplementation(async () => true)

    render(<SignIn />, { wrapper })

    const button = screen.getByText("Sign in")
    await userEvent.click(button)

    expect(history.location.pathname).toBe("/")
  })
})
