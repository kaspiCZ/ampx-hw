import { Mock } from "vitest"

import { act, renderHook } from "../utils/test-utils"

import useAuthenticatedUser from "./authenticated-user"

import { User, onAuthStateChanged } from "firebase/auth"
vi.mock("firebase/auth")

describe("components/AuthGuard", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it("transitions auth states", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    let receivedCallback = (_args: User) => {}

    const mockedOnAuthStateChanged = onAuthStateChanged as Mock
    mockedOnAuthStateChanged.mockImplementation(
      (_auth, callback) => (receivedCallback = callback),
    )

    const { result } = renderHook(() => useAuthenticatedUser())

    expect(result.current[0]).not.toBeDefined()
    expect(result.current[1]).toBe(true)

    act(() => {
      receivedCallback({ email: "test@example.com" } as User)
    })

    expect(result.current[0]).toEqual({ email: "test@example.com" })
    expect(result.current[1]).toBe(false)
  })
})
