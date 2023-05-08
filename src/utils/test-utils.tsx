import { cleanup, render } from "@testing-library/react"
import { afterEach } from "vitest"

afterEach(() => {
  cleanup()
})

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  })
}

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react"
export { default as userEvent } from "@testing-library/user-event"
export { customRender as render }
