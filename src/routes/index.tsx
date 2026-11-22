import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Search,
  Sparkles,
  Bot,
  ArrowRight,
  Wrench,
  Droplets,
  Zap,
  Leaf,
  Paintbrush,
  Truck,
  Monitor,
  Palette,
  TrendingUp,
  Camera,
  GraduationCap,
  Briefcase,
  CalendarHeart,
  Scissors,
  MoreHorizontal,
  MessageSquare,
  ListChecks,
  UserCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { categories } from "@/data/plataforma";

export const Route = createFileRoute("/")({
  component: Index,
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, Droplets, Zap, Sparkles, Leaf, Paintbrush, Truck, Monitor,
  Palette, TrendingUp, Camera, GraduationCap, Briefcase, CalendarHeart,
  Scissors, MoreHorizontal,
};

function Index() {
  const navigate = useNavigate();
  const [servico, setServico] = useState("");
  const [localidade, setLocalidade] = useState("");

  return (
    <div className="space-y-20 py-12 md:py-16">
      <Hero
        onSearch={() => {
          navigate({
            to: "/profissionais",
            search: { servico, localidade },
          });
        }}
        onAI={() => navigate({ to: "/assistente" })}
        servico={servico}
        localidade={localidade}
        setServico={setServico}
        setLocalidade={setLocalidade}
      />
      <SecaoCategorias />
      <SecaoComoFunciona />
      <SecaoProfissionais />
      <SecaoAssistente />
    </div>
  );
}

function Hero({
  onSearch,
  onAI,
  servico,
  localidade,
  setServico,
  setLocalidade,
}: {
  onSearch: () => void;
  onAI: () => void;
  servico: string;
  localidade: string;
  setServico: (v: string) => void;
  setLocalidade: (v: string) => void;
}) {
  return (
    <section className="border-b bg-gradient-to-b from-accent/40 to-background">
      <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-24">
        <Badge variant="secondary" className="mb-4 gap-1.5">
          <Sparkles className="size-3.5 text-accent-2" />
          Plataforma de demonstração
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Encontra o profissional certo.{" "}
          <span className="text-accent-2">Sem complicações.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Explica-nos o que precisas. A ProxiPro AI ajuda-te a encontrar
          profissionais adequados à tua necessidade.
        </p>

        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border bg-card p-4 shadow-sm md:p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium">
                Que serviço procuras?
              </label>
              <Input
                value={servico}
                onChange={(e) => setServico(e.target.value)}
                placeholder="Ex.: reparação de canalização"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium">
                Em que localidade?
              </label>
              <Input
                value={localidade}
                onChange={(e) => setLocalidade(e.target.value)}
                placeholder="Ex.: Braga"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" onClick={onSearch}>
              <Search className="size-4" />
              Encontrar profissionais
            </Button>
            <Button variant="outline" className="flex-1" onClick={onAI}>
              <Bot className="size-4 text-accent-2" />
              Ajudar-me com IA
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border bg-card p-6 text-left shadow-sm md:flex md:items-center md:gap-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-2/15 text-accent-2">
            <Bot className="size-6" aria-hidden />
          </div>
          <div className="mt-4 md:mt-0">
            <h3 className="font-semibold">Assistente ProxiPro AI</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Não sabes exatamente de que profissional precisas? Conta-nos o
              teu problema e nós ajudamos.{" "}
              <Link
                to="/assistente"
                className="font-medium text-accent-2 hover:underline"
              >
                Conversar com o assistente →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecaoCategorias() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Categorias populares
          </h2>
          <p className="mt-1 text-muted-foreground">
            Explora por área de serviço. Novas categorias podem ser
            adicionadas a qualquer momento.
          </p>
        </div>
        <Button asChild variant="ghost" className="shrink-0">
          <Link to="/categorias">
            Ver todas
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icone] ?? MoreHorizontal;
          return (
            <Link key={cat.id} to={`/profissionais?categoria=${cat.id}`}>
              <Card className="h-full gap-2 transition-colors hover:bg-accent">
                <CardHeader className="p-4 pb-0">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <CardTitle className="text-sm font-semibold">
                    {cat.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground">
                    {cat.descricao}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SecaoComoFunciona() {
  const passos = [
    {
      numero: "01",
      titulo: "Explica o que precisas",
      texto:
        "Descreve o serviço de que precisas de forma simples, com a tua localidade e prazos.",
      icone: <MessageSquare className="size-5" />,
    },
    {
      numero: "02",
      titulo: "Recebe sugestões de profissionais",
      texto:
        "A ProxiPro AI encontra profissionais que cumprem os requisitos essenciais e mostra-os em ordem de pertinência.",
      icone: <ListChecks className="size-5" />,
    },
    {
      numero: "03",
      titulo: "Escolhe, contacta e acompanha",
      texto:
        "Entra em contacto, pede orçamentos e segue o pedido até à conclusão.",
      icone: <UserCheck className="size-5" />,
    },
  ];

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Como funciona
          </h2>
          <p className="mt-2 text-muted-foreground">
            Três passos simples entre ti e a solução.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {passos.map((p) => (
            <Card key={p.numero} className="gap-3">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    {p.icone}
                  </div>
                  <span className="text-3xl font-bold text-accent-2/40">
                    {p.numero}
                  </span>
                </div>
                <CardTitle className="mt-4">{p.titulo}</CardTitle>
                <CardDescription>{p.texto}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecaoProfissionais() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="overflow-hidden rounded-3xl bg-primary text-primary-foreground">
        <div className="grid gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-14">
          <div>
            <Badge
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground/90"
            >
              Para profissionais
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              És profissional? Encontra novos clientes.
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              Cria o teu perfil, apresenta os teus serviços e recebe
              oportunidades de trabalho.
            </p>
            <div className="mt-6">
              <Button
                asChild
                variant="secondary"
                className="bg-accent-2 text-primary hover:bg-accent-2/90"
              >
                <Link to="/registo?tipo=profissional">
                  Registar como profissional
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <ul className="grid content-center gap-3 text-sm md:grid-cols-2">
            {[
              "Perfil profissional com portefólio",
              "Receção de pedidos de clientes",
              "Mensagens e propostas",
              "Estatísticas do teu perfil",
              "Disponibilidade à medida",
              "Avaliações reais",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-accent-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SecaoAssistente() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="rounded-3xl border bg-card p-8 shadow-sm md:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent-2/15 text-accent-2">
            <Bot className="size-7" aria-hidden />
          </div>
          <Badge variant="secondary" className="mb-3">
            Demonstração
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            O assistente que entende o teu problema
          </h2>
          <p className="mt-3 text-muted-foreground">
            Descreve o que precisas em linguagem natural. A ProxiPro AI
            interpreta o pedido, identifica a categoria e a localização e
            sugere profissionais compatíveis. Se ainda não estiver ligada a
            um motor de IA, a interface indica-o de forma transparente.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/assistente">
                Falar com o assistente
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
