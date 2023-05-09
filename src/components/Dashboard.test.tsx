import { render, screen } from "../utils/test-utils"

import Dashboard from "./Dashboard"

describe("components/dashboard", () => {
  it("renders", () => {
    render(<Dashboard />)

    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })
})
