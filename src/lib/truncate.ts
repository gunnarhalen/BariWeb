export function truncate(texto: string, limite: number): string {
  if (limite <= 0) return ""
  if (texto.length <= limite) return texto
  return texto.slice(0, limite - 1) + "…"
}
