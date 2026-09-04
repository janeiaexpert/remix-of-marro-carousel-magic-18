import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash2, RotateCcw, ArrowLeft } from "lucide-react";
import {
  DEFAULT_NICHES,
  loadNiches,
  saveNiches,
  parseKeywords,
  type Niche,
} from "@/lib/niches";

export const Route = createFileRoute("/nichos")({
  head: () => ({
    meta: [
      { title: "Nichos e palavras-chave | Esteira de Carrossel" },
      {
        name: "description",
        content:
          "Defina os nichos e as palavras-chave que os agentes de IA usam automaticamente ao criar cada carrossel.",
      },
      { property: "og:title", content: "Nichos e palavras-chave do carrossel" },
      {
        property: "og:description",
        content:
          "Cadastre nichos e palavras-chave estratégicas para a IA aplicar em títulos, legendas e hashtags.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NichesPage,
});

function NichesPage() {
  const [niches, setNiches] = useState<Niche[]>(DEFAULT_NICHES);

  useEffect(() => {
    setNiches(loadNiches());
  }, []);

  function update(i: number, patch: Partial<Niche>) {
    setNiches((prev) => prev.map((n, idx) => (idx === i ? { ...n, ...patch } : n)));
  }

  function persist(next: Niche[]) {
    const clean = next
      .map((n) => ({ name: n.name.trim(), keywords: n.keywords.filter(Boolean) }))
      .filter((n) => n.name);
    if (!clean.length) {
      toast.error("Cadastre pelo menos um nicho");
      return;
    }
    setNiches(clean);
    saveNiches(clean);
    toast.success("Nichos salvos — o carrossel já usa essas palavras-chave");
  }

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <Toaster position="top-center" />

      <header className="border-b border-border">
        <div className="mx-auto grid max-w-4xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-5">
          <span className="truncate font-display text-lg tracking-wide sm:text-2xl">
            NICHOS<span className="text-primary">.</span>PALAVRAS-CHAVE
          </span>
          <Button variant="outline" size="sm" className="shrink-0" asChild>
            <Link to="/">
              <ArrowLeft /> Voltar
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-6 sm:px-5 sm:py-8">
        <div className="space-y-2">
          <h1 className="font-display text-3xl leading-none sm:text-4xl">
            Defina as palavras-chave de cada nicho
          </h1>
          <p className="text-sm text-muted-foreground">
            Os agentes de IA usam essas palavras automaticamente nos títulos, na legenda e nas
            hashtags do carrossel do nicho escolhido.
          </p>
        </div>

        <div className="space-y-4">
          {niches.map((n, i) => (
            <div key={i} className="space-y-3 border border-border bg-card p-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label>Nicho</Label>
                  <Input
                    value={n.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    placeholder="Ex: Pet Shop"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  aria-label={`Remover nicho ${n.name}`}
                  onClick={() => setNiches((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <Trash2 />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Palavras-chave (separe por vírgula)</Label>
                <Textarea
                  rows={2}
                  value={n.keywords.join(", ")}
                  onChange={(e) => update(i, { keywords: parseKeywords(e.target.value) })}
                  placeholder="hipertrofia, treino em casa, emagrecimento"
                />
                <div className="flex flex-wrap gap-2">
                  {n.keywords.map((k) => (
                    <span
                      key={k}
                      className="border border-border px-2 py-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
          <Button
            variant="outline"
            onClick={() => setNiches((prev) => [...prev, { name: "", keywords: [] }])}
          >
            <Plus /> Novo nicho
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setNiches(DEFAULT_NICHES);
              saveNiches(DEFAULT_NICHES);
              toast.success("Nichos restaurados");
            }}
          >
            <RotateCcw /> Restaurar padrão
          </Button>
          <Button onClick={() => persist(niches)}>
            <Save /> Salvar nichos
          </Button>
        </div>
      </div>
    </main>
  );
}
