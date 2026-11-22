import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Check,
  Bot,
  BarChart3,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { planos } from "@/data/plataforma";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/para-profissionais")({
  component: ParaProfissionais,
});

function ParaProfissionais() {
  const [tab, setTab] = useState<"perfil" | "ia" | "plano">("perfil");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="mb-10 max-w-2xl">
        <Badge variant="secondary" className="mb-3">
          Para profissionais
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Encontra novos clientes, de forma simples.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Cria o teu perfil, apresenta os teus serviços e recebe oportunidades
          de trabalho compatíveis com a tua zona.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/registo?tipo=profissional">
              Registar como profissional
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/entrar">Já tenho conta</Link>
          </Button>
        </div>
      </div>

      <div className="mb-8 flex gap-2">
        <Button
          variant={tab === "perfil" ? "default" : "outline"}
          onClick={() => setTab("perfil")}
        >
          <Briefcase className="mr-2 size-4" />
          Perfil profissional
        </Button>
        <Button
          variant={tab === "ia" ? "default" : "outline"}
          onClick={() => setTab("ia")}
        >
          <Bot className="mr-2 size-4" />
          Ferramentas de IA
        </Button>
        <Button
          variant={tab === "plano" ? "default" : "outline"}
          onClick={() => setTab("plano")}
        >
          <BarChart3 className="mr-2 size-4" />
          Planos
        </Button>
      </div>

      {tab === "perfil" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>O que podes fazer</CardTitle>
              <CardDescription>
                Ferramentas essenciais para apresentares o teu trabalho.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Criar e editar o teu perfil",
                  "Escolher categorias e descrever os serviços",
                  "Adicionar fotografias e portefólio",
                  "Indicar preços orientativos",
                  "Definir concelhos e zonas de atendimento",
                  "Indicar disponibilidade",
                  "Receber pedidos de clientes",
                  "Aceitar ou recusar pedidos",
                  "Enviar propostas e orçamentos",
                  "Comunicar com clientes",
                  "Consultar avaliações e estatísticas",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Estado do perfil</CardTitle>
              <CardDescription>
                A ProxiPro AI distingue claramente o estado de cada perfil.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Perfil criado", desc: "Ainda sem submissão para análise." },
                { label: "Perfil em análise", desc: "Um administrador está a rever o conteúdo." },
                { label: "Perfil aprovado", desc: "Visível na pesquisa e a receber pedidos." },
                { label: "Perfil suspenso", desc: "Temporariamente fora da pesquisa por causa de uma denúncia." },
              ].map((e) => (
                <div key={e.label} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">{e.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.desc}</p>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Só usamos a expressão “verificado” quando existe uma
                verificação efetiva e documentada.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "ia" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-muted/50 p-6">
            <Badge variant="secondary" className="mb-3">
              <Sparkles className="mr-1 size-3" />
              Demonstração
            </Badge>
            <h2 className="text-xl font-bold">
              Ferramentas de IA para profissionais
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Estas ferramentas ajudam-te a apresentar melhor o teu trabalho.
              A IA sugere, nunca publica nem envia propostas sem a tua
              confirmação.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { titulo: "Melhorar a descrição do perfil", texto: "Textos mais claros e consistentes." },
              { titulo: "Criar descrições de serviços", texto: "Modelos prontos a adaptar." },
              { titulo: "Melhorar respostas a clientes", texto: "Sugestões de tom e conteúdo." },
              { titulo: "Preparar propostas", texto: "Estrutura e apresentação de orçamentos." },
              { titulo: "Formas de apresentar preços", texto: "Preços orientativos bem explicados." },
              { titulo: "Organizar pedidos recebidos", texto: "Classificação por prioridade." },
            ].map((f) => (
              <Card key={f.titulo} className="gap-2">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-sm">{f.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xs text-muted-foreground">{f.texto}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "plano" && (
        <div className="space-y-6">
          <div className="max-w-2xl text-sm text-muted-foreground">
            Estes planos são uma estrutura visual de planos comerciais
            futuros. Nesta fase não é feita cobrança — apenas preparação de
            produto. Nenhum resultado de pesquisa é escondido nem favorecido
            de forma enganosa por planos pagos.
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {planos.map((p) => (
              <Card
                key={p.nome}
                className={
                  p.destaque
                    ? "border-accent-2 ring-2 ring-accent-2/30"
                    : ""
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{p.nome}</CardTitle>
                    {p.destaque && (
                      <Badge variant="secondary">Em destaque</Badge>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{p.preco}</span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      {p.periodo}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {p.recursos.map((r) => (
                      <li key={r} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent-2" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-4" />
                  <Button
                    variant={p.destaque ? "default" : "outline"}
                    className="w-full"
                    onClick={() =>
                      toast.info("Plano apenas demonstrativo", {
                        description:
                          "Nesta fase, a subscrição não está ligada a pagamentos reais.",
                      })
                    }
                  >
                    Escolher {p.nome}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
