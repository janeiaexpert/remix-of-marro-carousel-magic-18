export type Niche = { name: string; keywords: string[] };

const KEY = "esteira.niches.v1";

export const DEFAULT_NICHES: Niche[] = [
  { name: "Academia / Fitness", keywords: ["hipertrofia", "treino em casa", "emagrecimento", "dieta flexível"] },
  { name: "Clínica de Estética", keywords: ["harmonização facial", "botox", "skincare", "autoestima"] },
  { name: "Nutricionista", keywords: ["reeducação alimentar", "low carb", "intestino", "energia"] },
  { name: "Imobiliária", keywords: ["financiamento", "primeiro imóvel", "valorização", "aluguel"] },
  { name: "Marketing Digital", keywords: ["tráfego pago", "funil", "copywriting", "engajamento"] },
  { name: "Notícias", keywords: ["urgente", "bastidores", "economia", "brasil"] },
  { name: "Advocacia", keywords: ["direitos trabalhistas", "inss", "consumidor", "contrato"] },
  { name: "Barbearia", keywords: ["fade", "barba desenhada", "estilo masculino", "corte social"] },
];

export function loadNiches(): Niche[] {
  if (typeof window === "undefined") return DEFAULT_NICHES;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_NICHES;
    const parsed = JSON.parse(raw) as Niche[];
    if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_NICHES;
    return parsed
      .filter((n) => n && typeof n.name === "string")
      .map((n) => ({ name: n.name, keywords: Array.isArray(n.keywords) ? n.keywords : [] }));
  } catch {
    return DEFAULT_NICHES;
  }
}

export function saveNiches(niches: Niche[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(niches));
}

export function parseKeywords(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 20);
}
