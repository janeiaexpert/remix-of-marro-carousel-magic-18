const FONT_CSS_URL =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&display=swap";

let cached: string | null = null;

/**
 * Baixa o CSS das fontes do Google e converte cada arquivo woff2 em data URI,
 * para que o export em PNG saia com a tipografia correta.
 */
export async function getFontEmbedCSS(): Promise<string> {
  if (cached !== null) return cached;
  try {
    const css = await fetch(FONT_CSS_URL).then((r) => r.text());
    const urls = Array.from(new Set(css.match(/https:\/\/[^)"']+\.woff2/g) ?? []));
    const pairs = await Promise.all(
      urls.map(async (url) => {
        const buf = await fetch(url).then((r) => r.arrayBuffer());
        let binary = "";
        const bytes = new Uint8Array(buf);
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
        return [url, `data:font/woff2;base64,${btoa(binary)}`] as const;
      }),
    );
    let out = css;
    for (const [url, data] of pairs) out = out.split(url).join(data);
    cached = out;
    return out;
  } catch {
    cached = "";
    return "";
  }
}
