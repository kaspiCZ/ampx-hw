import { Mock } from "vitest"
import { Router } from "react-router"
import { MemoryHistory, createMemoryHistory } from "history"
import { RecoilRoot } from "recoil"

import {
  RenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
} from "../utils/test-utils"

import SignIn from "./SignIn"

import useAuthenticatedUser from "../hooks/authenticated-user"
vi.mock("../hooks/authenticated-user")

import { signInWithEmailAndPassword } from "firebase/auth"
vi.mock("firebase/auth")

describe("components/SignIn", () => {
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

  it("redirects authenticated user to /home", () => {
    history.push("/signin")

    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [{ email: "test@example.com" }, false])

    const mockedSignIn = signInWithEmailAndPassword as Mock
    mockedSignIn.mockImplementation(async () => true)

    render(<SignIn />, { wrapper })

    expect(screen.queryByText("Sign in")).not.toBeInTheDocument()
    expect(history.location.pathname).toBe("/home")
  })

  it("renders form and authenticates user", async () => {
    history.push("/signin")

    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [undefined, false])

    const mockedSignIn = signInWithEmailAndPassword as Mock
    mockedSignIn.mockImplementation(async () => true)

    render(<SignIn />, { wrapper })

    expect(history.location.pathname).toBe("/signin")

    const email = screen.getByLabelText("E-mail")
    await userEvent.type(email, "test@example.com")

    const password = screen.getByLabelText("Password")
    await userEvent.type(password, "Test1234")

    const button = screen.getByRole("button")
    await userEvent.click(button)

    await waitFor(() => {
      expect(history.location.pathname).toBe("/home")
    })
  })
})
