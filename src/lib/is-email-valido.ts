const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

export function isEmailValido(texto: string): boolean {
  if (typeof texto !== "string") return false
  const email = texto.trim()
  if (email.length === 0 || email.length > 254) return false
  if (email.includes("..")) return false
  const [local] = email.split("@")
  if (local.startsWith(".") || local.endsWith(".")) return false
  return EMAIL_REGEX.test(email)
}
