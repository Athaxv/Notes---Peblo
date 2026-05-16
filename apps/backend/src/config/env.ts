function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: required("JWT_SECRET"),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  refreshDays: Number(process.env.JWT_REFRESH_DAYS ?? 7),
  isProd: process.env.NODE_ENV === "production",
  useAiWorker: process.env.USE_AI_WORKER === "true",
  groqApiKey: process.env.GROQ_API_KEY,
};
