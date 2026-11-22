import { createFileRoute } from "@tanstack/react-router";
import {
  MessageSquare,
  ListChecks,
  UserCheck,
  ShieldCheck,
  Star,
  MapPin,
  Euro,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/como-funciona")({
  component: ComoFunciona,
});

function ComoFunciona() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-3">
          Como funciona
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Simples, transparente e ao teu ritmo
        </h1>
        <p className="mt-3 text-muted-foreground">
          A ProxiPro AI liga-te ao profissional certo, mas a decisão é
          sempre tua.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          {
            icone: <MessageSquare className="size-5" />,
            titulo: "1. Explica o que precisas",
            texto:
              "Descreve o serviço, a localidade e os prazos. Podes usar o assistente de IA ou a pesquisa tradicional.",
          },
          {
            icone: <ListChecks className="size-5" />,
            titulo: "2. Recebe sugestões",
            texto:
              "Mostramos só profissionais que cumprem os requisitos essenciais e ordenamos os resultados por pertinência.",
          },
          {
            icone: <UserCheck className="size-5" />,
            titulo: "3. Escolhe e acompanha",
            texto:
              "Entra em contacto, pede orçamentos e segue o pedido até à conclusão. A contratação só se confirma com aceitação mútua.",
          },
        ].map((p) => (
          <Card key={p.titulo}>
            <CardContent className="p-5">
              <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {p.icone}
              </div>
              <h3 className="font-semibold">{p.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.texto}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <h2 className="text-xl font-bold tracking-tight">
          O que nos garante um serviço com confiança
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              icone: <ShieldCheck className="size-4" />,
              texto:
                "Só profissionais aprovados por administradores aparecem nos resultados com destaque.",
            },
            {
              icone: <Star className="size-4" />,
              texto:
                "Avaliações apenas de serviços concluídos — nunca inventamos reputações.",
            },
            {
              icone: <MapPin className="size-4" />,
              texto:
                "Mostramos proximidade geográfica apenas quando existem coordenadas fiáveis.",
            },
            {
              icone: <Euro className="size-4" />,
              texto:
                "Preços indicativos fornecidos pelo profissional, nunca inventados pela plataforma.",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-2/15 text-accent-2">
                {item.icone}
              </div>
              <p className="text-sm text-muted-foreground">{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
