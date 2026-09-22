import { describe, expect, it } from "vitest"

import { slugify } from "./slugify"

describe("slugify", () => {
  it("remove acentos", () => {
    expect(slugify("Coração")).toBe("coracao")
    expect(slugify("Ação Não É Fácil")).toBe("acao-nao-e-facil")
  })

  it("converte espaços e pontuação em hífens", () => {
    expect(slugify("Olá, Mundo!")).toBe("ola-mundo")
    expect(slugify("  espaços   múltiplos  ")).toBe("espacos-multiplos")
  })

  it("remove caracteres especiais", () => {
    expect(slugify("foo@bar #baz")).toBe("foo-bar-baz")
    expect(slugify("R$ 100,00 (promo)")).toBe("r-100-00-promo")
  })

  it("remove hífens duplicados e das bordas", () => {
    expect(slugify("--Olá -- Mundo--")).toBe("ola-mundo")
  })

  it("retorna string vazia para entradas sem caracteres válidos", () => {
    expect(slugify("")).toBe("")
    expect(slugify("!!!")).toBe("")
  })
})
