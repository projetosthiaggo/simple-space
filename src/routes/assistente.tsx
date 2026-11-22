import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { profissionais, categorias } from "@/data/plataforma";
import {
  Bot,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/assistente")({
  component: Assistente,
});


interface Msg {
  de: "usuario" | "ia";
  texto: string;
}

const categoriasPorPalavra: Record<string, string> = {
  fuga: "canalizacao",
  agua: "canalizacao",
  canalização: "canalizacao",
  canalizacao: "canalizacao",
  luz: "eletricidade",
  eletric: "eletricidade",
  limpar: "limpeza",
  limpeza: "limpeza",
  jardim: "jardinagem",
  pintar: "pintura",
  pintura: "pintura",
  mudança: "mudancas",
  mudanca: "mudancas",
  informát: "informatica",
  computador: "informatica",
  fotografia: "fotografia",
};

function Assistente() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      de: "ia",
      texto:
        "Olá! Sou a assistente da ProxiPro AI. Descreve o que precisas, como se estivesses a explicar a uma pessoa. Por exemplo: “Preciso de alguém para reparar uma fuga de água na cozinha em Braga esta semana.”",
    },
  ]);
  const [texto, setTexto] = useState("");
  const [aPensar, setAPensar] = useState(false);

  function enviar() {
    const t = texto.trim();
    if (!t) return;
    setMsgs((m) => [...m, { de: "usuario", texto: t }]);
    setTexto("");
    setAPensar(true);

    // Simulação demonstrativa de interpretação
    const baix = t.toLowerCase();
    const cat = Object.entries(categoriasPorPalavra).find(([k]) =>
      baix.includes(k)
    )?.[1];
    const catNome = categorias.find((c) => c.id === cat)?.nome;
    const local = t.match(/em\s([a-záàêõúâç]+)/i)?.[1] ?? "não indicada";
    const urgente = /urgente|agora|hoje|esta semana|rapidamente/i.test(t);

    setTimeout(() => {
      const sugestao = profissionais.filter(
        (p) => (cat ? p.categoria === cat : true) && p.estado === "aprovado"
      );

      const partes: string[] = [];
      partes.push("Entendi o teu pedido. Deixa-me confirmar o que identifiquei:");
      partes.push(`• Categoria: ${catNome ?? "por identificar"}`);
      partes.push(`• Localização: ${local}`);
      if (urgente) partes.push("• Urgência: alta");
      if (baix.includes("orçamento") || baix.includes("preço") || baix.includes("preco"))
        partes.push("• Orçamento: mencionado — pediste indicação de preços");

      if (sugestao.length > 0) {
        partes.push("");
        partes.push(
          `Temos ${sugestao.length} ${sugestao.length === 1 ? "profissional" : "profissionais"} compatível(is) nesta área. Sugestões:`
        );
        sugestao.slice(0, 3).forEach((p) => {
          partes.push(
            `• ${p.nomeComercial ?? p.nome} — ${p.especialidade} (${p.localidade}). Sugerido porque presta o serviço e atende a localidade indicada.`
          );
        });
      } else {
        partes.push(
          "Por agora não tenho profissionais aprovados que cumpram todos os requisitos nesta localização. Podes alargar a pesquisa ou voltar mais tarde."
        );
      }
      partes.push("");
      partes.push(
        "Isto é uma demonstração. Quando a integração de IA estiver disponível, as respostas serão geradas por um modelo real — nunca inventamos profissionais nem dados."
      );

      setMsgs((m) => [...m, { de: "ia", texto: partes.join("\n") }]);
      setAPensar(false);
    }, 700);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-accent-2/15 text-accent-2">
          <Bot className="size-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Como podemos ajudar?
        </h1>
        <p className="mt-2 text-muted-foreground">
          Descreve o que precisas, como se estivesses a explicar a uma
          pessoa.
        </p>
        <Badge variant="secondary" className="mt-3">
          <Sparkles className="mr-1 size-3" />
          Funcionalidade de demonstração — IA real em breve
        </Badge>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="mb-4 max-h-[50vh] space-y-4 overflow-y-auto pr-1">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.de === "usuario"
                    ? "flex justify-end"
                    : "flex items-start gap-3"
                }
              >
                {m.de === "ia" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-2/15 text-accent-2">
                    <Bot className="size-4" />
                  </div>
                )}
                <div
                  className={
                    "max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm " +
                    (m.de === "usuario"
                      ? "bg-primary text-primary-foreground"
                      : "border bg-card")
                  }
                >
                  {m.texto}
                </div>
                {m.de === "usuario" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {aPensar && (
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-accent-2/15 text-accent-2">
                  <Bot className="size-4" />
                </div>
                <div className="flex gap-1">
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground" />
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.1s]" />
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.2s]" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end gap-2">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  enviar();
                }
              }}
              placeholder="Escreve aqui…"
              rows={2}
              className="max-h-32 min-h-[52px] flex-1 resize-none rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={enviar} size="icon" className="size-12 shrink-0">
              <Send className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          "Reparação de uma fuga de água em Braga",
          "Quem faz pinturas interiores no Porto?",
          "Mudança de casa de Lisboa a Coimbra",
        ].map((s) => (
          <button
            key={s}
            onClick={() => setTexto(s)}
            className="rounded-lg border bg-card px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-accent"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Nota de privacidade:</strong> a
        conversa é demonstrativa e não é guardada. Quando a integração real
        estiver disponível, o histórico segue a política de privacidade da
        ProxiPro AI.
      </div>
    </div>
  );
}
