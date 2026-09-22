import { describe, expect, it } from "vitest"

import { truncate } from "../truncate"

describe("truncate", () => {
  it("keeps text shorter than the limit unchanged", () => {
    expect(truncate("abc", 5)).toBe("abc")
  })

  it("keeps text equal to the limit unchanged", () => {
    expect(truncate("abcde", 5)).toBe("abcde")
  })

  it("cuts text longer than the limit and appends an ellipsis", () => {
    expect(truncate("abcdefgh", 5)).toBe("abcd…")
    expect(truncate("abcdefgh", 5)).toHaveLength(5)
  })

  it("handles the smallest limits", () => {
    expect(truncate("abc", 1)).toBe("…")
    expect(truncate("abc", 0)).toBe("")
  })

  it("returns an empty string for empty input", () => {
    expect(truncate("", 5)).toBe("")
  })
})
