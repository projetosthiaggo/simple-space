import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Briefcase,
  MessageSquare,
  Wallet,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { profissionais, categorias } from "@/data/plataforma";
export const Route = createFileRoute("/profissionais/$id")({
  component: PerfilProfissional,
});

function PerfilProfissional() {
  const { id } = Route.useParams();
  const p = profissionais.find((x) => x.id === id);

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <AlertCircle className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Profissional não encontrado</h1>
        <p className="mt-2 text-muted-foreground">
          Este perfil não existe ou já não está disponível.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/profissionais">
            <ArrowLeft className="mr-2 size-4" />
            Voltar à pesquisa
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link to="/profissionais">
          <ArrowLeft className="mr-1 size-4" />
          Voltar aos resultados
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="gap-0 overflow-hidden">
            <div className="flex h-56 items-center justify-center bg-gradient-to-br from-primary to-accent-2/60 text-primary-foreground">
              <span className="text-7xl font-bold opacity-30">
                {p.nome.charAt(0)}
              </span>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {p.nomeComercial ?? p.nome}
                  </h1>
                  <p className="mt-1 text-muted-foreground">
                    {p.especialidade}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-4" />
                      {p.localidade} · {p.distrito}
                    </span>
                    {p.disponibilidade && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-4" />
                        {p.disponibilidade}
                      </span>
                    )}
                  </div>
                </div>
                {estadoBadge(p.estado)}
              </div>

              <Separator className="my-6" />

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Apresentação
                  </h2>
                  <p className="text-sm text-muted-foreground">{p.descricao}</p>
                  {p.exemplo && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      * Este perfil é um exemplo demonstrativo. Não
                      corresponde a um profissional real.
                    </p>
                  )}
                </div>
                <div>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Serviços
                  </h2>
                  <ul className="space-y-2">
                    {p.servicos.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent-2" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Localidades atendidas
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline">{p.concelho}</Badge>
                    <Badge variant="outline">{p.distrito}</Badge>
                  </div>
                </div>
                <div>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Preços orientativos
                  </h2>
                  <p className="flex items-center gap-2 text-sm">
                    <Wallet className="size-4 text-accent-2" />
                    {p.precoIndicativo ?? "Preços a definir no orçamento"}
                  </p>
                  <Separator className="my-4" />
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Experiência
                  </h2>
                  <p className="flex items-center gap-2 text-sm">
                    <Award className="size-4 text-accent-2" />
                    {p.experienciaAnos
                      ? `${p.experienciaAnos} anos de experiência declarada`
                      : "Experiência não indicada"}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Fotografias dos trabalhos
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex aspect-square flex-col items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground"
                    >
                      <ImageIcon className="size-6" />
                      <span className="mt-1 text-xs">Sem fotografia</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  As fotografias são adicionadas pelo profissional. A
                  ProxiPro AI não inventa conteúdos.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card className="space-y-4">
            <CardContent className="space-y-4 p-5">
              <h2 className="font-semibold">Pedir orçamento</h2>
              {p.avaliacao != null && p.numeroAvaliacoes > 0 ? (
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 text-2xl font-bold">
                          {p.avaliacao.toFixed(1)}
                          <Star className="size-5 fill-amber-400 text-amber-400" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Avaliação real de {p.numeroAvaliacoes} serviço(s)
                        concluído(s).
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="text-sm text-muted-foreground">
                    ({p.numeroAvaliacoes} avaliações)
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Ainda sem avaliações.
                </p>
              )}
              <div className="grid gap-2">
                <Button asChild className="w-full">
                  <Link to={`/pedido?profissional=${p.id}`}>
                    <Briefcase className="mr-2 size-4" />
                    Pedir orçamento
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/mensagens">
                    <MessageSquare className="mr-2 size-4" />
                    Enviar mensagem
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Um pedido não significa contratação. A contratação só se
                confirma após o profissional aceitar a proposta e o cliente a
                confirmar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function estadoBadge(estado: (typeof profissionais)[number]["estado"]) {
  switch (estado) {
    case "aprovado":
      return (
        <Badge variant="secondary" className="gap-1">
          <ShieldCheck className="size-3 text-green-600" />
          Aprovado
        </Badge>
      );
    case "em_analise":
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="size-3" />
          Perfil em análise
        </Badge>
      );
    case "pendente":
      return (
        <Badge variant="outline" className="gap-1">
          <BadgeCheck className="size-3" />
          Perfil criado — pendente de análise
        </Badge>
      );
    default:
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="size-3" />
          Suspenso
        </Badge>
      );
  }
}
