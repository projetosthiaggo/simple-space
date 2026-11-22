import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Lock,
  MapPin,
  Users,
  UserCheck,
  Inbox,
  LayoutGrid,
  Star,
  List,
  Minus,
  Plus,
  Pencil,
  Trash2,
  X,
  FileText,
  TrendingUp,
  CalendarHeart,
  Eye,
  Search,
} from "lucide-react";
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
import { profissionais, pedidos, categories } from "@/data/plataforma";

export const Route = createFileRoute("/admin/mapa")({
  component: AdminMapa,
});

function temAcessoAdmin(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem("pp-ai-tipo") === "admin";
}

type TipoEntidade = "cliente" | "profissional" | "pedido";
type Exibicao = "quadros" | "icones" | "texto";

interface PontoLocal {
  x: number;
  y: number;
}

const LOCALIDADES: Record<string, PontoLocal> = {
  "Porto": { x: 42, y: 24 },
  "Braga": { x: 48, y: 15 },
  "Viana do Castelo": { x: 38, y: 8 },
  "Aveiro": { x: 40, y: 40 },
  "Coimbra": { x: 37, y: 52 },
  "Lisboa": { x: 46, y: 72 },
  "Santarém": { x: 55, y: 60 },
  "Évora": { x: 60, y: 82 },
  "Faro": { x: 68, y: 92 },
  "Guarda": { x: 62, y: 38 },
  "Castelo Branco": { x: 56, y: 44 },
  "Viseu": { x: 52, y: 36 },
  "Leiria": { x: 34, y: 56 },
  "Setúbal": { x: 43, y: 78 },
};

const CORES_TEMA: Record<string, string> = {
  cliente: "var(--color-chart-1)",
  profissional: "var(--color-chart-2)",
  pedido: "var(--color-chart-3)",
  aprovado: "var(--color-chart-1)",
  em_analise: "var(--color-chart-2)",
  pendente: "var(--color-chart-3)",
  suspenso: "var(--color-chart-4)",
};

const CLIENTES_DEMO = [
  { id: "c1", nome: "Ana Silva", localidade: "Lisboa" },
  { id: "c2", nome: "João Pereira", localidade: "Porto" },
  { id: "c3", nome: "Miguel Santos", localidade: "Coimbra" },
  { id: "c4", nome: "Rita Ferreira", localidade: "Braga" },
  { id: "c5", nome: "Paulo Gomes", localidade: "Évora" },
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
      Categoria:
        categories.find((c) => c.id === p.categoria)?.nome ?? p.categoria,
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
      Categoria:
        categories.find((c) => c.id === d.categoria)?.nome ?? d.categoria,
      Localidade: d.localidade,
      Urgencia:
        d.urgencia === "alta" ? "Alta" : d.urgencia === "media" ? "Média" : "Baixa",
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
  const [zoom, setZoom] = useState(1);

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

  const visiveis = entidades.filter(
    (e) =>
      filtros[e.tipo] &&
      (busca.trim() === "" ||
        e.nome.toLowerCase().includes(busca.toLowerCase()) ||
        e.localidade.toLowerCase().includes(busca.toLowerCase())),
  );

  const porLocalidade = (tipo: TipoEntidade, localidade: string) =>
    visiveis.filter((e) => e.tipo === tipo && e.localidade === localidade).length;

  const pontosPorLocal: Record<string, PontoLocal> = {};
  visiveis.forEach((e) => {
    pontosPorLocal[e.localidade] =
      LOCALIDADES[e.localidade] ?? { x: 50 + (e.localidade.length * 7) % 20, y: 50 };
  });

  const total = visiveis.length;
  const porTipo: Record<TipoEntidade, number> = {
    cliente: visiveis.filter((e) => e.tipo === "cliente").length,
    profissional: visiveis.filter((e) => e.tipo === "profissional").length,
    pedido: visiveis.filter((e) => e.tipo === "pedido").length,
  };

  const graficoTipos: { tipo: string; value: number }[] = [
    { tipo: "Clientes", value: porTipo.cliente },
    { tipo: "Profissionais", value: porTipo.profissional },
    { tipo: "Pedidos", value: porTipo.pedido },
  ];

  const graficoLocal: { localidade: string; Clientes: number; Profissionais: number; Pedidos: number }[] =
    Object.keys(pontosPorLocal).map((l) => ({
      localidade: l,
      Clientes: porLocalidade("cliente", l),
      Profissionais: porLocalidade("profissional", l),
      Pedidos: porLocalidade("pedido", l),
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

  const tamanhoPonto = (tipo: TipoEntidade) =>
    (tipo === "profissional" ? 14 : tipo === "pedido" ? 11 : 12) * zoom;

  const posicaoPonto = (id: string, tipo: TipoEntidade, localidade: string) => {
    const base = pontosPorLocal[localidade] ?? { x: 50, y: 50 };
    const grupo = visiveis.filter((e) => e.tipo === tipo && e.localidade === localidade);
    const idx = grupo.findIndex((g) => g.id === id);
    const desvio = (idx - (grupo.length - 1) / 2) * 3.2 * zoom;
    return { x: base.x + desvio, y: base.y };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2">
            <Lock className="mr-1 size-3" />
            Painel de administração
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Mapa da plataforma
          </h1>
          <p className="mt-1 text-muted-foreground">
            Localiza clientes, profissionais e pedidos. Clica num ponto para
            ver, editar ou remover os dados (demonstração).
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-xl border bg-muted/40 px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              <MapPin className="size-4" />
              <span>Mapa interativo</span>
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                novo
              </span>
            </Link>
          </div>
        </div>
                  <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/admin")}
          >
            Voltar ao resumo
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
                      onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.15).toFixed(2)))}
                      aria-label="Diminuir zoom"
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-12 text-center text-xs font-medium tabular-nums text-muted-foreground">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-8"
                      onClick={() => setZoom((z) => Math.min(2, +(z + 0.15).toFixed(2)))}
                      aria-label="Aumentar zoom"
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(
                      [
                        ["quadros", LayoutGrid, "Quadros"],
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

              {/* SUPERFÍCIE DO MAPA */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted/30 sm:aspect-[16/10]">
                {/* grade estilo mapa */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
                    backgroundSize: `${28 * zoom}px ${28 * zoom}px`,
                  }}
                />
                <div
                  className="absolute transition-transform duration-200"
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: `scale(${zoom})`,
                    transformOrigin: "center center",
                  }}
                >
                  {Object.entries(pontosPorLocal).map(([localidade, pos]) => {
                    const temPonto = visiveis.some((e) => e.localidade === localidade);
                    if (!temPonto) return null;
                    return (
                      <div
                        key={localidade}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      >
                        {exibicao === "texto" && (
                          <div className="whitespace-nowrap rounded bg-background/80 px-1 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                            {localidade}
                          </div>
                        )}
                        {exibicao !== "texto" && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex gap-1">
                              {LENDAS().filter((l) => porLocalidade(l.tipo, localidade) > 0).map((l) => (
                                <span
                                  key={l.tipo}
                                  className="size-2 rounded-full ring-2 ring-background"
                                  style={{ backgroundColor: l.cor }}
                                />
                              ))}
                            </div>
                            <div className="text-[10px] font-medium text-muted-foreground">
                              {localidade}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {exibicao !== "texto" &&
                    visiveis.map((e) => {
                      const { x, y } = posicaoPonto(e.id, e.tipo, e.localidade);
                      const Icone = ICONE_POR_TIPO[e.tipo];
                      const cor = CORES_TEMA[e.tipo];
                      const ehSel = e.id === selecionado;
                      const tam = tamanhoPonto(e.tipo);
                      return (
                        <button
                          key={e.id}
                          onClick={() => setSelecionado(ehSel ? null : e.id)}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm transition ${
                            ehSel
                              ? "z-10 border-foreground ring-4 ring-foreground/20"
                              : "border-background hover:z-10 hover:scale-110"
                          }`}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: tam,
                            height: tam,
                            backgroundColor: cor,
                          }}
                          title={e.nome}
                        >
                          {exibicao === "icones" && (
                            <Icone
                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                              style={{ width: tam * 0.55, height: tam * 0.55 }}
                            />
                          )}
                          {exibicao === "quadros" && (
                            <span
                              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-background/90 px-1 text-[9px] font-bold text-foreground"
                            >
                              {LENDAS().find((l) => l.tipo === e.tipo)?.label
                                .replace(/s$/, "")}
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>

                {visiveis.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
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
                      content={<ChartTooltipContent hideIndicator nameKey="value" />}
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
                  <h3 className="text-sm font-semibold">Repartição por distritos</h3>
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
                        {Object.keys(pontosPorLocal).length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Localidades
                      </p>
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
                  Selecciona um registo para ver os detalhes no painel lateral.
                </p>
              </div>
              <div className="divide-y">
                {visiveis.map((e) => {
                  const Icone = ICONE_POR_TIPO[e.tipo];
                  const cor = CORES_TEMA[e.tipo];
                  return (
                    <button
                      key={e.id}
                      onClick={() => setSelecionado(e.id)}
                      className={`flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-muted/40 ${
                        e.id === selecionado ? "bg-muted/60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
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
                      </div>
                      <span
                        className="rounded-full border px-2 py-0.5 text-xs"
                      >
                        {LENDAS().find((l) => l.tipo === e.tipo)?.label.replace(/s$/, "")}
                      </span>
                    </button>
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
