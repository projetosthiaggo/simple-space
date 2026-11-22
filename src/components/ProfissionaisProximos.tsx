import { useState, useEffect } from "react";
import { MapPin, Star, ShieldCheck, Clock, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { profissionais, type Profissional } from "@/data/plataforma";
import { Link } from "@tanstack/react-router";

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
            <Link to="/profissionais/$id" params={{ id: p.id }}>Ver perfil</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1" size="sm">
            <Link to="/pedido" search={{ profissional: p.id }}>
              Pedir orçamento
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfissionaisProximos() {
  const [localizacao, setLocalizacao] = useState<string | null>(null);
  const [profissionaisProximos, setProfissionaisProximos] = useState<Profissional[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          const { latitude, longitude } = posicao.coords;
          setLocalizacao(`Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`);
          // Simulação de busca de profissionais próximos
          const proximos = profissionais.filter(p => p.localidade === "Braga");
          setProfissionaisProximos(proximos);
        },
        (erro) => {
          setErro(erro.message);
          // Se a localização falhar, mostrar todos os profissionais
          setProfissionaisProximos(profissionais);
        }
      );
    } else {
      setErro("Geolocalização não suportada pelo navegador");
      setProfissionaisProximos(profissionais);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profissionais próximos</h2>
        {localizacao && (
          <Badge variant="outline" className="gap-1">
            <MapPin className="size-3" />
            {localizacao}
          </Badge>
        )}
      </div>

      {erro && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-4 text-destructive" />
            <p className="text-sm text-destructive">
              Não foi possível obter a tua localização: {erro}. Mostrando todos os profissionais.
            </p>
          </div>
        </div>
      )}

      {profissionaisProximos.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {profissionaisProximos.map((p) => (
            <CartaoProfissional key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <Card className="gap-4">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">Sem profissionais próximos</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Não há profissionais registados na tua localização.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}