import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  SlidersHorizontal,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categorias,
  profissionais,
  distritos,
  type Profissional,
} from "@/data/plataforma";
export const Route = createFileRoute("/profissionais")({
  component: Profissionais,
  validateSearch: (
    search: Record<string, unknown>
  ): { servico?: string; localidade?: string; categoria?: string } => ({
    servico: typeof search.servico === "string" ? search.servico : undefined,
    localidade:
      typeof search.localidade === "string" ? search.localidade : undefined,
    categoria:
      typeof search.categoria === "string" ? search.categoria : undefined,
  }),
});

function estadoBadge(estado: Profissional["estado"]) {
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
          Em análise
        </Badge>
      );
    case "pendente":
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="size-3" />
          Pendente
        </Badge>
      );
    default:
      return (
        <Badge variant="destructive" className="gap-1">
          <X className="size-3" />
          Suspenso
        </Badge>
      );
  }
}

function CartaoProfissional({ p }: { p: Profissional }) {
  return (
    <Card className="gap-0 overflow-hidden">
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary to-accent-2/60 text-primary-foreground">
        <span className="text-5xl font-bold opacity-30">
          {p.nome.charAt(0)}
        </span>
      </div>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold">
              {p.nomeComercial ?? p.nome}
              {p.nomeComercial && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({p.nome})
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{p.especialidade}</p>
          </div>
          {estadoBadge(p.estado)}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {p.localidade}
          </span>
          {p.disponibilidade && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {p.disponibilidade}
            </span>
          )}
          {p.avaliacao != null && p.numeroAvaliacoes > 0 && (
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {p.avaliacao.toFixed(1)} ({p.numeroAvaliacoes})
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{p.descricao}</p>

        <div className="flex flex-wrap gap-1.5">
          {p.servicos.slice(0, 3).map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
        </div>

        {p.precoIndicativo && (
          <p className="text-sm font-medium text-accent-2">
            {p.precoIndicativo}
          </p>
        )}

        {p.exemplo && (
          <p className="text-xs text-muted-foreground">
            * Dado de exemplo, não corresponde a um profissional real.
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <Button asChild className="flex-1" size="sm">
            <Link to={`/profissionais/${p.id}`}>Ver perfil</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1" size="sm">
            <Link to={`/pedido?profissional=${p.id}`}>
              Pedir orçamento
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Profissionais() {
  const search = Route.useSearch();
  const [categoria, setCategoria] = useState<string>(
    search.categoria ?? "todas"
  );
  const [distrito, setDistrito] = useState("todos");
  const [minAvaliacao, setMinAvaliacao] = useState("0");
  const [aprovados, setAprovados] = useState(false);
  const [busca, setBusca] = useState(
    `${search.servico ?? ""} ${search.localidade ?? ""}`.trim()
  );

  const filtrados = profissionais.filter((p) => {
    if (aprovados && p.estado !== "aprovado") return false;
    if (categoria !== "todas" && p.categoria !== categoria) return false;
    if (distrito !== "todos" && p.distrito !== distrito) return false;
    if (Number(minAvaliacao) > 0 && (p.avaliacao ?? 0) < Number(minAvaliacao))
      return false;
    if (busca) {
      const alvo =
        p.nome + " " + (p.nomeComercial ?? "") + " " + p.especialidade + " " +
        p.localidade + " " + p.servicos.join(" ");
      if (!alvo.toLowerCase().includes(busca.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          Pesquisa
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Encontra profissionais
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Filtra por categoria, localidade e mais. Os resultados respeitam os
          requisitos essenciais: profissional aprovado, serviço compatível,
          localização e perfil ativo.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5 rounded-2xl border bg-card p-5 lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Filtros</h2>
            <SlidersHorizontal className="size-4 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Pesquisar</label>
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Serviço ou palavra-chave"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Escolher categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Distrito</label>
            <Select value={distrito} onValueChange={setDistrito}>
              <SelectTrigger>
                <SelectValue placeholder="Escolher distrito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {distritos.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Avaliação mínima</label>
            <Select value={minAvaliacao} onValueChange={setMinAvaliacao}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Qualquer</SelectItem>
                <SelectItem value="4">4+ estrelas</SelectItem>
                <SelectItem value="4.5">4,5+ estrelas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={aprovados}
              onChange={(e) => setAprovados(e.target.checked)}
              className="size-4 rounded border-input"
            />
            Só profissionais aprovados
          </label>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filtrados.length}{" "}
              {filtrados.length === 1 ? "resultado" : "resultados"}
            </p>
            <p className="text-xs text-muted-foreground">
              Dados de exemplo identificados como tais.
            </p>
          </div>

          {filtrados.length === 0 ? (
            <Card className="gap-4">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <AlertCircle className="size-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold">Sem resultados nesta pesquisa</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Não há profissionais que cumpram todos os filtros nesta
                  localização. Podes alargar a pesquisa ou remover filtros.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAprovados(false);
                    setMinAvaliacao("0");
                    setDistrito("todos");
                    setCategoria("todas");
                    setBusca("");
                  }}
                >
                  Limpar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtrados.map((p) => (
                <CartaoProfissional key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
