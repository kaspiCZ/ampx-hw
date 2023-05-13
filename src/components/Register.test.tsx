import { Mock } from "vitest"
import { Router } from "react-router"
import { MemoryHistory, createMemoryHistory } from "history"

import {
  RenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
} from "../utils/test-utils"

import Register from "./Register"

import useAuthenticatedUser from "../hooks/authenticated-user"
vi.mock("../hooks/authenticated-user")

import { createUserWithEmailAndPassword } from "firebase/auth"
import { RecoilRoot } from "recoil"
vi.mock("firebase/auth")

describe("components/Register", () => {
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
    history.push("/register")

    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [{ email: "test@example.com" }, false])

    const mockedRegister = createUserWithEmailAndPassword as Mock
    mockedRegister.mockImplementation(async () => true)

    render(<Register />, { wrapper })

    expect(screen.queryByText("Register")).not.toBeInTheDocument()
    expect(history.location.pathname).toBe("/home")
  })

  it("renders form and creates user", async () => {
    history.push("/register")

    const mockedHook = useAuthenticatedUser as Mock
    mockedHook.mockImplementation(() => [undefined, false])

    const mockedRegister = createUserWithEmailAndPassword as Mock
    mockedRegister.mockImplementation(async () => true)

    render(<Register />, { wrapper })

    expect(history.location.pathname).toBe("/register")

    const email = screen.getByLabelText("E-mail")
    await userEvent.type(email, "test@example.com")

    const password = screen.getByLabelText("Password")
    await userEvent.type(password, "Test1234*")

    const passwordConfirmation = screen.getByLabelText("Confirm password")
    await userEvent.type(passwordConfirmation, "Test1234*")

    const button = screen.getByRole("button")
    await userEvent.click(button)

    await waitFor(() => {
      expect(history.location.pathname).toBe("/home")
    })
  })
})
