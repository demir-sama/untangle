/** Local inference is explicit development-only, never a hosted fallback. */
export function developmentAgentOptions(
  mode: string | undefined,
  hosted: boolean,
) {
  if (mode !== "development" || hosted) return {};
  return {
    engine: {
      name: "ai-sdk:ollama",
      config: { baseUrl: "http://127.0.0.1:11439" },
    },
    model: "untangle-qwen",
  };
}
