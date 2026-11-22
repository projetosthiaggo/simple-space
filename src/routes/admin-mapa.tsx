import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Map as MapIcon, MapPin, Users, UserCheck, Inbox, LayoutGrid, Star, List, Minus, Plus, Pencil, Trash2, X, FileText, TrendingUp, CalendarHeart, Eye, Search, Lock, LocateFixed } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { toast } from "sonner";
import { profissionais, pedidos, categories, distritos } from "@/data/plataforma";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

export const Route = createFileRoute("/admin-mapa")({
  component: AdminMapa,
});

function temAcessoAdmin(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem("pp-ai-tipo") === "admin";
}

type TipoEntidade = "cliente" | "profissional" | "pedido";
type Exibicao = "quadros" | "icones" | "texto";

// Coordenadas aproximadas das localidades (Portugal continental)
const COORDENADAS: Record<string, [number, number]> = {
  "Porto": [41.15, -8.61],
  "Braga": [41.55, -8.42],
  "Viana do Castelo": [41.7, -8.83],
  "Aveiro": [40.64, -8.65],
  "Coimbra": [40.21, -8.42],
  "Lisboa": [38.72, -9.14],
  "Santarém": [39.24, -8.69],
  "Évora": [38.57, -7.91],
  "Faro": [37.01, -7.94],
  "Guarda": [41.55, -6.99],
  "Castelo Branco": [40.29, -7.2],
  "Viseu": [40.65, -7.91],
  "Leiria": [39.75, -8.8],
  "Setúbal": [38.53, -8.93],
  "Portalegre": [39.29, -7.43],
  "Beja": [37.99, -8.01],
};

const CORES_TEMA: Record<string, string> = {
  cliente: "var(--color-chart-1)",
  profissional: "var(--color-chart-2)",
  pedido: "var(--color-chart-3)",
};

const CLIENTES_DEMO = [
  { id: "c1", nome: "Ana Silva", localidade: "Lisboa", email: "ana.silva@exemplo.pt" },
  { id: "c2", nome: "João Pereira", localidade: "Porto", email: "joao.pereira@exemplo.pt" },
  { id: "c3", nome: "Miguel Santos", localidade: "Coimbra", email: "miguel.santos@exemplo.pt" },
  { id: "c4", nome: "Rita Ferreira", localidade: "Braga", email: "rita.ferreira@exemplo.pt" },
  { id: "c5", nome: "Paulo Gomes", localidade: "Évora", email: "paulo.gomes@exemplo.pt" },
];

interface MapaEntidade {
  id: string;
  tipo: TipoEntidade;
  nome: string;
  localidade: string;
  extra: string;
  detalhes: Record<string, string>;
  estado?: string;
}

function pontosIniciais(): MapaEntidade[] {
  const pros: MapaEntidade[] = profissionais.map((p) => ({
    id: p.id,
    tipo: "profissional",
    nome: p.nomeComercial ?? p.nome,
    localidade: p.localidade,
    extra: p.especialidade,
    estado: p.estado,
    detalhes: {
      "Nome completo": p.nome,
      Especialidade: p.especialidade,
      Categoria: categories.find((c) => c.id === p.categoria)?.nome ?? p.categoria,
      Concelho: p.concelho,
      Distrito: p.distrito,
      PrecoIndicativo: p.precoIndicativo ?? "—",
      Estado: p.estado.replace("_", " "),
      Experiencia: p.experienciaAnos ? `${p.experienciaAnos} anos` : "—",
      Disponibilidade: p.disponibilidade ?? "—",
    },
  }));
  const peds: MapaEntidade[] = pedidos.map((d) => ({
    id: d.id,
    tipo: "pedido",
    nome: d.titulo,
    localidade: d.localidade,
    extra: d.categoria,
    estado: d.estado,
    detalhes: {
      Titulo: d.titulo,
      Categoria: categories.find((c) => c.id === d.categoria)?.nome ?? d.categoria,
      Localidade: d.localidade,
      Urgencia: d.urgencia === "alta" ? "Alta" : d.urgencia === "media" ? "Média" : "Baixa",
      Estado: d.estado,
      DataCriacao: d.dataCriacao,
      Orçamento: d.orcamento ?? "—",
      Data: d.data ?? "—",
    },
  }));
  const cls: MapaEntidade[] = CLIENTES_DEMO.map((c) => ({
    id: c.id,
    tipo: "cliente",
    nome: c.nome,
    localidade: c.localidade,
    extra: "Cliente",
    estado: "ativo",
    detalhes: {
      Nome: c.nome,
      Email: c.email,
      Localidade: c.localidade,
      Tipo: "Cliente",
      Estado: "Ativo",
      Registo: "Demonstração",
    },
  }));
  return [...cls, ...pros, ...peds];
}

const ICONE_POR_TIPO: Record<TipoEntidade, any> = {
  cliente: Users,
  profissional: UserCheck,
  pedido: Inbox,
};

const LENDA: { tipo: TipoEntidade; label: string; cor: string }[] = [
  { tipo: "cliente", label: "Clientes", cor: CORES_TEMA.cliente },
  { tipo: "profissional", label: "Profissionais", cor: CORES_TEMA.profissional },
  { tipo: "pedido", label: "Pedidos", cor: CORES_TEMA.pedido },
];

function AdminMapa() {
  const [entidades, setEntidades] = useState<MapaEntidade[]>(pontosIniciais);
  const [filtros, setFiltros] = useState<Record<TipoEntidade, boolean>>({
    cliente: true,
    profissional: true,
    pedido: true,
  });
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [editando, setEditando] = useState<MapaEntidade | null>(null);
  const [exibicao, setExibicao] = useState<Exibicao>("quadros");
  const [zoom, setZoom] = useState(6.5);

  const mapRef = useRef<L.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const visiveis = useMemo(
    () =>
      entidades.filter(
        (e) =>
          filtros[e.tipo] &&
          (busca.trim() === "" ||
            e.nome.toLowerCase().includes(busca.toLowerCase()) ||
            e.localidade.toLowerCase().includes(busca.toLowerCase())),
      ),
    [entidades, filtros, busca],
  );

  const localidadesAtivas = useMemo(
    () => Array.from(new Set(visiveis.map((e) => e.localidade))),
    [visiveis],
  );

  const total = visiveis.length;
  const porTipo: Record<TipoEntidade, number> = {
    cliente: visiveis.filter((e) => e.tipo === "cliente").length,
    profissional: visiveis.filter((e) => e.tipo === "profissional").length,
    pedido: visiveis.filter((e) => e.tipo === "pedido").length,
  };

  const graficoTipos = [
    { tipo: "Clientes", value: porTipo.cliente },
    { tipo: "Profissionais", value: porTipo.profissional },
    { tipo: "Pedidos", value: porTipo.pedido },
  ];

  const graficoLocal = localidadesAtivas.map((l) => ({
    localidade: l,
    Clientes: visiveis.filter((e) => e.tipo === "cliente" && e.localidade === l).length,
    Profissionais: visiveis.filter((e) => e.tipo === "profissional" && e.localidade === l).length,
    Pedidos: visiveis.filter((e) => e.tipo === "pedido" && e.localidade === l).length,
  }));

  const configuracaoTipos: ChartConfig = {
    Clientes: { label: "Clientes", color: CORES_TEMA.cliente },
    Profissionais: { label: "Profissionais", color: CORES_TEMA.profissional },
    Pedidos: { label: "Pedidos", color: CORES_TEMA.pedido },
  };

  const configuracaoLocal: ChartConfig = {
    Clientes: { label: "Clientes", color: CORES_TEMA.cliente },
    Profissionais: { label: "Profissionais", color: CORES_TEMA.profissional },
    Pedidos: { label: "Pedidos", color: CORES_TEMA.pedido },
  };

  const selecionada = visiveis.find((e) => e.id === selecionado) ?? null;

  // Inicialização do mapa Leaflet
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: [40.2, -8.4],
      zoom,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    const layer = L.layerGroup().addTo(map);
    mapRef.current = map;
    markersLayerRef.current = layer;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Zoom externo controlado pelo botão
  useEffect(() => {
    if (mapRef.current && mapRef.current.getZoom() !== zoom) {
      mapRef.current.setZoom(zoom);
    }
  }, [zoom]);

  // Pontos no mapa
  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (exibicao === "quadros" || exibicao === "texto") {
      // Marcadores por localidade (agrupados por tipo)
      localidadesAtivas.forEach((localidade) => {
        const coord = COORDENADAS[localidade];
        if (!coord) return;

        const grupos: { tipo: TipoEntidade; count: number }[] = (
          ["cliente", "profissional", "pedido"] as TipoEntidade[]
        ).map((t) => ({
          tipo: t,
          count: visiveis.filter((e) => e.tipo === t && e.localidade === localidade).length,
        }));

        const html = `<div class="mapa-marker-ciclo">
          <div class="mapa-marker-ciclo-tipo">${grupos
            .filter((g) => g.count > 0)
            .map(
              (g) =>
                `<span class="mapa-marker-ciclo-ponto" style="background:${CORES_TEMA[g.tipo]}"></span>`,
            )
            .join("")}</div>
          <div class="mapa-marker-ciclo-label">${localidade}</div>
        </div>`;

        const marker = L.marker(coord, {
          icon: L.divIcon({
            html,
            className: "",
            iconSize: [96, 44],
            iconAnchor: [48, 22],
          }),
          title: localidade,
        }).bindTooltip(
          localidade,
          { direction: "top", offset: [0, -12] },
        );

        marker.on("click", () => {
          // Seleciona o primeiro registo desta localidade
          const primeiro = visiveis.find((e) => e.localidade === localidade);
          if (primeiro) setSelecionado(primeiro.id);
        });

        layer.addLayer(marker);
      });
    } else {
      // Exibição por ícones (um por registo)
      visiveis.forEach((e) => {
        const coord = COORDENADAS[e.localidade];
        if (!coord) return;
        const cor = CORES_TEMA[e.tipo];
        const ehSel = e.id === selecionado;
        const tamanho = ehSel ? 40 : 30;
        const labelTipo = LENDA.find((l) => l.tipo === e.tipo)?.label.replace(/s$/, "");

        const nomeSeguro = e.nome.replace(/"/g, "\u0027");
        const html = `<button type="button" class="mapa-icone-ponto ${ehSel ? "mapa-icone-ponto--sel" : ""}" style="background:${cor};width:${tamanho}px;height:${tamanho}px" title="${nomeSeguro}">
          <span class="mapa-icone-ponto-label">${labelTipo}</span>
        </button>`;

        const marker = L.marker(coord, {
          icon: L.divIcon({
            html,
            className: "",
            iconSize: [tamanho, tamanho],
            iconAnchor: [tamanho / 2, tamanho / 2],
          }),
        });

        marker.on("click", () => setSelecionado(ehSel ? null : e.id));

        layer.addLayer(marker);
      });
    }
  }, [visiveis, exibicao, localidadesAtivas, selecionado]);

  const remover = (id: string) => {
    setEntidades((prev) => prev.filter((e) => e.id !== id));
    setSelecionado(null);
    setEditando(null);
    toast.success("Registo removido do mapa (demonstração)");
  };

  const salvarEdicao = () => {
    if (!editando) return;
    setEntidades((prev) => prev.map((e) => (e.id === editando.id ? editando : e)));
    setEditando(null);
    toast.success("Registo atualizado no mapa (demonstração)");
  };

  const centrarEmLocalidade = (localidade: string) => {
    const coord = COORDENADAS[localidade];
    if (coord && mapRef.current) {
      mapRef.current.panTo(coord, 11);
    }
  };

  if (!temAcessoAdmin()) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
          <Lock className="size-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Acesso reservado</h1>
        <p className="mt-2 text-muted-foreground">
          Esta área do painel administrativo está reservada a administradores
          autorizados. Inicia sessão na página de entrada.
        </p>
        <Button asChild size="sm" className="mt-6">
          <Link to="/entrar">Iniciar sessão</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      {/* CSS dos marcadores */}
      <style>{`
        .mapa-marker-ciclo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          pointer-events: none;
        }
        .mapa-marker-ciclo-tipo {
          display: flex;
          gap: 4px;
        }
        .mapa-marker-ciclo-ponto {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 2px solid var(--color-background);
          box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
        }
        .mapa-marker-ciclo-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--color-muted-foreground);
          background: color-mix(in srgb, var(--color-background) 85%, transparent);
          padding: 1px 6px;
          border-radius: 999px;
        }
        .mapa-icone-ponto {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 2px solid var(--color-background);
          box-shadow: 0 4px 10px rgb(0 0 0 / 25%);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .mapa-icone-ponto:hover {
          transform: scale(1.1);
        }
        .mapa-icone-ponto--sel {
          outline: 3px solid var(--color-ring);
          outline-offset: 2px;
        }
        .mapa-icone-ponto-label {
          font-size: 9px;
          font-weight: 700;
          color: var(--color-background);
        }
        .leaflet-container {
          background: var(--color-muted);
        }
        .leaflet-tooltip {
          background: var(--color-popover);
          border: 1px solid var(--color-border);
          color: var(--color-popover-foreground);
          font-size: 12px;
          font-weight: 500;
          border-radius: 6px;
          padding: 4px 8px;
        }
        .leaflet-tooltip-top:before {
          border-top-color: var(--color-popover);
        }
        .leaflet-control-attribution {
          font-size: 9px;
          background: color-mix(in srgb, var(--color-background) 80%, transparent);
        }
      `}</style>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2">
            <Lock className="mr-1 size-3" />
            Painel de administração
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Mapa online da plataforma
          </h1>
          <p className="mt-1 text-muted-foreground">
            Mapa real (OpenStreetMap) com clientes, profissionais e pedidos.
            Clica num registo para ver, editar ou remover os dados
            (demonstração).
          </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 rounded-xl border bg-muted/40 px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                      >
                        <MapIcon className="size-4" />
                        <span>Painel principal</span>
                      </Link>
                    </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin">Voltar ao resumo</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Mapa + controles */}
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8"
                      onClick={() => setZoom((z) => Math.max(4, +(z - 0.5).toFixed(2)))}
                      aria-label="Diminuir zoom"
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-14 text-center text-xs font-medium tabular-nums text-muted-foreground">
                      Zoom {zoom}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8"
                      onClick={() => setZoom((z) => Math.min(15, +(z + 0.5).toFixed(2)))}
                      aria-label="Aumentar zoom"
                    >
                      <Plus className="size-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        mapRef.current?.setView([40.2, -8.4], 6.5);
                        setZoom(6.5);
                      }}
                    >
                      <LocateFixed className="mr-1 size-3.5" />
                      Portugal
                    </Button>
                  </div>
                                  <div className="flex items-center gap-1.5">
                  {(
                    [
                      ["quadros", LayoutGrid, "Ciclo"],
                      ["icones", MapPin, "Ícones"],
                      ["texto", List, "Texto"],
                    ] as [Exibicao, any, string][]
                  ).map(([id, Icone, label]) => (
                    <Button
                      key={id}
                      size="sm"
                      variant={exibicao === id ? "default" : "ghost"}
                      onClick={() => setExibicao(id)}
                    >
                      <Icone className="mr-1 size-3.5" />
                      {label}
                    </Button>
                  ))}
                </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Search className="size-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Procurar no mapa…"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="h-8 w-40 text-sm"
                    />
                  </div>
                  {LENDAS().map((l) => (
                    <button
                      key={l.tipo}
                      onClick={() =>
                        setFiltros((f) => ({ ...f, [l.tipo]: !f[l.tipo] }))
                      }
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                        filtros[l.tipo]
                          ? "bg-muted text-foreground"
                          : "opacity-40 line-through"
                      }`}
                    >
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: l.cor }}
                      />
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MAPA REAL */}
              <div className="relative h-[420px] w-full sm:h-[520px]">
                <div ref={mapDivRef} className="absolute inset-0 z-0" />
                {visiveis.length === 0 && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <p className="rounded-lg bg-background/90 px-4 py-2 text-sm shadow">
                      Sem registos correspondentes aos filtros.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* GRÁFICOS */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Star className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">
                    Registos por tipo de entidade
                  </h3>
                </div>
                <ChartContainer
                  config={configuracaoTipos}
                  className="h-56 aspect-auto w-full"
                >
                  <PieChart>
                    <Pie
                      data={graficoTipos}
                      dataKey="value"
                      nameKey="tipo"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {graficoTipos.map((entry) => (
                        <Cell
                          key={entry.tipo}
                          fill={
                            entry.tipo === "Clientes"
                              ? CORES_TEMA.cliente
                              : entry.tipo === "Profissionais"
                                ? CORES_TEMA.profissional
                                : CORES_TEMA.pedido
                          }
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                    <ChartLegend content={<ChartLegendContent hideIcon />} />
                  </PieChart>
                </ChartContainer>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Total de {total} registos no mapa
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Registos por localidade</h3>
                </div>
                <ChartContainer config={configuracaoLocal} className="h-56 aspect-auto w-full">
                  <BarChart data={graficoLocal}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="localidade" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis tick={{ fontSize: 10 }} width={28} allowDecimals={false} />
                    <ChartTooltip
                      content={<ChartTooltipContent hideIndicator />}
                    />
                    <Bar dataKey="Clientes" stackId="a" fill={CORES_TEMA.cliente} />
                    <Bar dataKey="Profissionais" stackId="a" fill={CORES_TEMA.profissional} />
                    <Bar dataKey="Pedidos" stackId="a" fill={CORES_TEMA.pedido} radius={[3, 3, 0, 0]} />
                    <ChartLegend content={<ChartLegendContent hideIcon />} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Tendências por localidade</h3>
                </div>
                <ChartContainer config={configuracaoLocal} className="h-56 aspect-auto w-full">
                  <LineChart data={graficoLocal}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="localidade" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis tick={{ fontSize: 10 }} width={28} allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                    <Line
                      type="monotone"
                      dataKey="Clientes"
                      stroke={CORES_TEMA.cliente}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Profissionais"
                      stroke={CORES_TEMA.profissional}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Pedidos"
                      stroke={CORES_TEMA.pedido}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <ChartLegend content={<ChartLegendContent hideIcon />} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <CalendarHeart className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Visão geral do mapa</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {LENDAS().map((l) => (
                    <div
                      key={l.tipo}
                      className="flex items-center gap-2 rounded-lg border p-3"
                    >
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: l.cor }}
                      />
                      <div>
                        <p className="text-lg font-bold leading-none">
                          {porTipo[l.tipo]}
                        </p>
                        <p className="text-xs text-muted-foreground">{l.label}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <MapPin className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-bold leading-none">
                        {localidadesAtivas.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Localidades</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.success("Adicionar registo: demonstração")
                    }
                  >
                    <Plus className="mr-1 size-3.5" />
                    Adicionar cliente
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.success("Adicionar registo: demonstração")
                    }
                  >
                    <Plus className="mr-1 size-3.5" />
                    Adicionar pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LISTA */}
          <Card>
            <CardContent className="p-0">
              <div className="border-b p-4">
                <h2 className="font-semibold">Registos no mapa</h2>
                <p className="text-sm text-muted-foreground">
                  Selecciona um registo para ver os detalhes no painel lateral
                  ou centra o mapa numa localidade.
                </p>
              </div>
              <div className="divide-y">
                {visiveis.map((e) => {
                  const Icone = ICONE_POR_TIPO[e.tipo];
                  const cor = CORES_TEMA[e.tipo];
                  return (
                    <div
                      key={e.id}
                      className={`flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-muted/40 ${
                        e.id === selecionado ? "bg-muted/60" : ""
                      }`}
                    >
                      <button
                        className="flex flex-1 items-center gap-3 text-left"
                        onClick={() => setSelecionado(e.id)}
                      >
                        <span
                          className="flex size-9 shrink-0 items-center justify-center rounded-full ring-2 ring-background"
                          style={{ backgroundColor: cor }}
                        >
                          <Icone className="size-4 text-white" />
                        </span>
                        <div>
                          <div className="text-sm font-medium">{e.nome}</div>
                          <div className="text-xs text-muted-foreground">
                            {e.localidade} · {e.extra}
                          </div>
                        </div>
                      </button>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => centrarEmLocalidade(e.localidade)}
                        >
                          <MapPin className="mr-1 size-3" />
                          Centrar
                        </Button>
                        <span className="rounded-full border px-2 py-0.5 text-xs">
                          {LENDAS().find((l) => l.tipo === e.tipo)?.label.replace(/s$/, "")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PAINEL LATERAL */}
        <div className="space-y-4">
          {editando ? (
            <Card className="sticky top-6">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Editar registo</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setEditando(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Nome
                    </label>
                    <Input
                      value={editando.nome}
                      onChange={(ev) =>
                        setEditando({ ...editando, nome: ev.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Localidade
                    </label>
                    <Input
                      value={editando.localidade}
                      onChange={(ev) =>
                        setEditando({ ...editando, localidade: ev.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Tipo
                    </label>
                    <select
                      value={editando.tipo}
                      onChange={(ev) =>
                        setEditando({
                          ...editando,
                          tipo: ev.target.value as TipoEntidade,
                        })
                      }
                      className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="profissional">Profissional</option>
                      <option value="pedido">Pedido</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={salvarEdicao}>
                      <Pencil className="mr-1 size-3.5" />
                      Guardar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setEditando(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selecionada ? (
            <Card className="sticky top-6">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-10 items-center justify-center rounded-full ring-2 ring-background"
                      style={{ backgroundColor: CORES_TEMA[selecionada.tipo] }}
                    >
                      {(() => {
                        const I = ICONE_POR_TIPO[selecionada.tipo];
                        return <I className="size-5 text-white" />;
                      })()}
                    </span>
                    <div>
                      <h3 className="font-semibold">{selecionada.nome}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selecionada.localidade}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setSelecionado(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                <dl className="space-y-2">
                  {Object.entries(selecionada.detalhes).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-3 border-b pb-2 text-sm"
                    >
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right font-medium capitalize">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditando({ ...selecionada })}
                  >
                    <Pencil className="mr-1 size-3.5" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => remover(selecionada.id)}
                  >
                    <Trash2 className="mr-1 size-3.5" />
                    Remover
                  </Button>
                </div>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Alterações de demonstração — não são persistidas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-6">
              <CardContent className="p-5">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted">
                    <Eye className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium">Nenhum registo selecionado</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Toca num ponto no mapa ou num item da lista para ver,
                    editar ou remover os dados.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.success("Adicionar registo: demonstração")
                      }
                    >
                      <Plus className="mr-1 size-3.5" />
                      Adicionar cliente
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.success("Adicionar registo: demonstração")
                      }
                    >
                      <Plus className="mr-1 size-3.5" />
                      Adicionar pedido
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function LENDAS() {
  return LENDA;
}
