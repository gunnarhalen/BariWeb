// Teste simples de variáveis de ambiente
export default function TestEnv() {
  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Teste de Variáveis de Ambiente</h2>
      <p>NODE_ENV: {process.env.NODE_ENV}</p>
      <p>
        NEXT_PUBLIC_FIREBASE_API_KEY:{" "}
        {process.env.NEXT_PUBLIC_FIREBASE_API_KEY
          ? "✅ Presente"
          : "❌ Ausente"}
      </p>
      <p>
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:{" "}
        {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
          ? "✅ Presente"
          : "❌ Ausente"}
      </p>
      <p>
        NEXT_PUBLIC_FIREBASE_PROJECT_ID:{" "}
        {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
          ? "✅ Presente"
          : "❌ Ausente"}
      </p>
      <p>
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:{" "}
        {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
          ? "✅ Presente"
          : "❌ Ausente"}
      </p>
      <p>
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:{" "}
        {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
          ? "✅ Presente"
          : "❌ Ausente"}
      </p>
      <p>
        NEXT_PUBLIC_FIREBASE_APP_ID:{" "}
        {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Presente" : "❌ Ausente"}
      </p>

      <h3>Todas as variáveis NEXT_PUBLIC_:</h3>
      <pre>
        {JSON.stringify(
          Object.keys(process.env)
            .filter((key) => key.startsWith("NEXT_PUBLIC_"))
            .reduce((acc, key) => {
              acc[key] = process.env[key] ? "***presente***" : "ausente";
              return acc;
            }, {}),
          null,
          2
        )}
      </pre>
    </div>
  );
}
