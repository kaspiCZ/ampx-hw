import { Router } from "react-router"
import { MemoryHistory, createMemoryHistory } from "history"

import { RenderOptions, render, screen, userEvent } from "../utils/test-utils"

import Intro from "./Intro"

describe("components/Intro", () => {
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

  it("renders and redirects to signin", async () => {
    render(<Intro />, { wrapper })

    const button = screen.getByText("Sign in")

    expect(button).toBeInTheDocument()
    expect(history.location.pathname).toBe("/")

    await userEvent.click(button)

    expect(history.location.pathname).toBe("/signin")
  })
})
