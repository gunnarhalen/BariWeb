import { describe, expect, it } from "vitest"

import { isEmailValido } from "../is-email-valido"

describe("isEmailValido", () => {
  it("accepts simple valid emails", () => {
    expect(isEmailValido("usuario@exemplo.com")).toBe(true)
    expect(isEmailValido("a@b.co")).toBe(true)
  })

  it("accepts subdomains", () => {
    expect(isEmailValido("usuario@mail.exemplo.com.br")).toBe(true)
  })

  it("accepts plus, dots and underscores in the local part", () => {
    expect(isEmailValido("nome.sobrenome@exemplo.com")).toBe(true)
    expect(isEmailValido("usuario+tag@exemplo.com")).toBe(true)
    expect(isEmailValido("nome_sobrenome@exemplo.com")).toBe(true)
  })

  it("accepts mixed case", () => {
    expect(isEmailValido("Usuario@Exemplo.COM")).toBe(true)
  })

  it("trims surrounding whitespace", () => {
    expect(isEmailValido("  usuario@exemplo.com  ")).toBe(true)
  })

  it("rejects empty or whitespace-only input", () => {
    expect(isEmailValido("")).toBe(false)
    expect(isEmailValido("   ")).toBe(false)
  })

  it("rejects input without @", () => {
    expect(isEmailValido("usuario.exemplo.com")).toBe(false)
  })

  it("rejects multiple @", () => {
    expect(isEmailValido("usuario@@exemplo.com")).toBe(false)
    expect(isEmailValido("usuario@exemplo@com")).toBe(false)
  })

  it("rejects missing domain or TLD", () => {
    expect(isEmailValido("usuario@")).toBe(false)
    expect(isEmailValido("@exemplo.com")).toBe(false)
    expect(isEmailValido("usuario@exemplo")).toBe(false)
    expect(isEmailValido("a@b")).toBe(false)
  })

  it("rejects spaces and consecutive dots", () => {
    expect(isEmailValido("usuario @exemplo.com")).toBe(false)
    expect(isEmailValido("usuario@exemplo .com")).toBe(false)
    expect(isEmailValido("usuario@exemplo..com")).toBe(false)
    expect(isEmailValido(".usuario@exemplo.com")).toBe(false)
  })

  it("rejects leading or trailing dots in the domain", () => {
    expect(isEmailValido("usuario@.exemplo.com")).toBe(false)
    expect(isEmailValido("usuario@exemplo.com.")).toBe(false)
  })
})
