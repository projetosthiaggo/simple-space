import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  MessageSquare,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  profissionais,
  pedidos,
} from "@/data/plataforma";

export const Route = createFileRoute("/mensagens")({
  component: Mensagens,
});

function Mensagens() {
  const [conversas, setConversas] = useState(
    profissionais
      .filter((p) => p.estado === "aprovado")
      .map((p) => ({
        profissional: p,
        mensagens: [
          { de: "pro", texto: "Olá! Vimo o teu pedido. Podes partilhar mais detalhes?", hora: "09:12", lida: false },
          { de: "eu", texto: "Claro, é uma fuga debaixo da lavagem da cozinha.", hora: "09:15", lida: true },
        ],
      }))
  );
  const [ativa, setAtiva] = useState(conversas[0]?.profissional.id ?? "");

  const atual = conversas.find((c) => c.profissional.id === ativa);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Mensagens
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Conversas privadas entre cliente e profissional.
          </p>
        </div>
        <Badge variant="outline">Demonstração</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        <Card>
          <CardContent className="space-y-1 p-3">
            {conversas.map((c) => (
              <button
                key={c.profissional.id}
                onClick={() => setAtiva(c.profissional.id)}
                className={
                  "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors " +
                  (ativa === c.profissional.id
                    ? "bg-accent"
                    : "hover:bg-muted")
                }
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {c.profissional.nome.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {c.profissional.nomeComercial ?? c.profissional.nome}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.mensagens[c.mensagens.length - 1]?.texto}
                  </p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="flex min-h-[420px] flex-col">
          <CardContent className="flex h-full flex-1 flex-col p-0">
            {atual ? (
              <>
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <p className="font-medium">
                      {atual.profissional.nomeComercial ?? atual.profissional.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Associado a: pedido “{pedidos[0]?.titulo ?? "—"}”
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/profissionais/${atual.profissional.id}`}>
                      Ver perfil
                    </Link>
                  </Button>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {atual.mensagens.map((m, i) => (
                    <div
                      key={i}
                      className={
                        "flex " + (m.de === "eu" ? "justify-end" : "justify-start")
                      }
                    >
                      <div
                        className={
                          "max-w-[70%] rounded-2xl px-3 py-2 text-sm " +
                          (m.de === "eu"
                            ? "bg-primary text-primary-foreground"
                            : "border bg-card")
                        }
                      >
                        {m.texto}
                        <div className="mt-1 text-[10px] opacity-70">
                          {m.hora}
                          {m.lida && m.de === "eu" && " · Lida"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-end gap-2 border-t p-3">
                  <textarea
                    rows={1}
                    placeholder="Escreve uma mensagem…"
                    className="flex-1 resize-none rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button size="icon" className="size-10">
                    <Send className="size-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
                Escolhe uma conversa.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
