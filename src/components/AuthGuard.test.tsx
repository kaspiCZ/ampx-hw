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

  describe("protected routes", () => {
    it("redirects anonymous to /", () => {
      history.push("/someroute")

      const mockedHook = useAuthenticatedUser as Mock
      mockedHook.mockImplementation(() => [undefined, false])

      render(<AuthGuard />, { wrapper })

      expect(history.location.pathname).toBe("/")
    })

    it("does not redirect user", async () => {
      history.push("/someroute")

      const mockedHook = useAuthenticatedUser as Mock
      mockedHook.mockImplementation(() => [
        { email: "test@example.com" },
        false,
      ])

      render(<AuthGuard />, { wrapper })

      expect(history.location.pathname).toBe("/someroute")
    })
  })

  describe("anonymous routes", () => {
    it("does not redirect anonymous", () => {
      history.push("/someroute")

      const mockedHook = useAuthenticatedUser as Mock
      mockedHook.mockImplementation(() => [undefined, false])

      render(<AuthGuard allow="anonymous" />, { wrapper })

      expect(history.location.pathname).toBe("/someroute")
    })

    it("redirects user to /", async () => {
      history.push("/someroute")

      const mockedHook = useAuthenticatedUser as Mock
      mockedHook.mockImplementation(() => [
        { email: "test@example.com" },
        false,
      ])

      render(<AuthGuard allow="anonymous" />, { wrapper })

      expect(history.location.pathname).toBe("/home")
    })
  })
})
