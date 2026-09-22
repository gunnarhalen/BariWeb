import { describe, expect, it } from "vitest"

import { slugify } from "../slugify"

describe("slugify", () => {
  it("removes accents", () => {
    expect(slugify("coração")).toBe("coracao")
    expect(slugify("Olá, você")).toBe("ola-voce")
  })

  it("replaces spaces with hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world")
  })

  it("replaces special characters with hyphens", () => {
    expect(slugify("Olá! Mundo?")).toBe("ola-mundo")
    expect(slugify("foo@bar#baz")).toBe("foo-bar-baz")
  })

  it("collapses repeated separators and trims edge hyphens", () => {
    expect(slugify("  A  B  ")).toBe("a-b")
    expect(slugify("--foo--bar--")).toBe("foo-bar")
  })

  it("returns an empty string for empty or symbol-only input", () => {
    expect(slugify("")).toBe("")
    expect(slugify("!!!")).toBe("")
  })
})
