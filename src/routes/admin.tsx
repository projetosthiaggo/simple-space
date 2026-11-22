import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, type DragEvent } from "react";
import {
  Users,
  UserCheck,
  Clock,
  Inbox,
  Flag,
  Star,
  Lock,
  ShieldCheck,
  CreditCard,
  Pencil,
  Trash2,
  Plus,
  MapPin,
  Search,
  ChevronRight,
  Eye,
  X,
  Star as StarIcon,
  LayoutDashboard,
  FileText,
  MessageSquareWarning,
  Layers,
  User,
  Banknote,
  BadgePercent,
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
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  categorias,
  profissionais,
  pedidos,
  planos,
  type Profissional,
  type Pedido,
} from "@/data/plataforma";
import { MapaPlataforma } from "@/components/mapa-plataforma";
import { LayoutGrid, LayoutList, Minus, Plus as PlusZoom, GripVertical, Image as ImageIcon, Megaphone, Home, Repeat, Upload } from "lucide-react";

// ===== Utilitários de modo de exibição e reordenação por arrastar/soltar =====


type ModoExibicao = "quadros" | "icones" | "texto";

const ROTULO_MODO: Record<ModoExibicao, string> = {
  quadros: "Quadros",
  icones: "Ícones",
  texto: "Texto",
};

/**
 * Hook que liga eventos de drag/drop nativos para reordenar itens.
 * O estado (ordem) vive no pai; ao arrastar e largar sobre um item, a ordem
 * é recalculada e repassada ao pai via `aoReordenar`.
 */
function usarReordenacao<T extends { id: string }>(
  itens: T[],
  aoReordenar: (nova: T[]) => void,
) {
  const arrastandoRef = useRef<string | null>(null);

  const props = (id: string, alvoId: string) => ({
    draggable: true,
    "data-arrastavel": id,
    onDragStart: (e: DragEvent<HTMLElement>) => {
      arrastandoRef.current = id;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    },
    onDragOver: (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    },
    onDrop: (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      const origem = arrastandoRef.current;
      arrastandoRef.current = null;
      if (!origem || origem === alvoId) return;
      const nova = [...itens];
      const iO = nova.findIndex((i) => i.id === origem);
      const iA = nova.findIndex((i) => i.id === alvoId);
      if (iO === -1 || iA === -1) return;
      const [removido] = nova.splice(iO, 1);
      nova.splice(iA, 0, removido);
      aoReordenar(nova);
    },
    onDragEnd: () => {
      arrastandoRef.current = null;
    },
  });
  return props;
}

function ControlesExibicao({
  modo,
  aoMudarModo,
  tamanho,
  aoMudarTamanho,
}: {
  modo: ModoExibicao;
  aoMudarModo: (m: ModoExibicao) => void;
  tamanho: number;
  aoMudarTamanho: (delta: number) => void;
}) {
  const botoes: { id: ModoExibicao; Icone: typeof LayoutGrid; label: string }[] = [
    { id: "quadros", Icone: LayoutGrid, label: "Quadros" },
    { id: "icones", Icone: LayoutGrid, label: "Ícones" },
    { id: "texto", Icone: LayoutList, label: "Texto" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex rounded-xl border bg-muted/40 p-1" role="group" aria-label="Modo de exibição">
        {botoes.map(({ id, Icone, label }) => (
          <button
            key={id}
            type="button"
            title={label}
            aria-pressed={modo === id}
            onClick={() => aoMudarModo(id)}
            className={`flex size-8 items-center justify-center rounded-lg transition-all ${
              modo === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icone className="size-4" />
          </button>
        ))}
      </div>
      <div className="inline-flex items-center gap-1 rounded-xl border bg-muted/40 p-1" role="group" aria-label="Tamanho de exibição">
        <button
          type="button"
          title="Diminuir tamanho"
          aria-label="Diminuir tamanho"
          onClick={() => aoMudarTamanho(-1)}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-background hover:text-foreground disabled:opacity-40"
          disabled={tamanho <= 0}
        >
          <Minus className="size-4" />
        </button>
        <span className="min-w-[2.5rem] text-center text-xs font-medium tabular-nums text-muted-foreground">
          {tamanho * 4}x
        </span>
        <button
          type="button"
          title="Aumentar tamanho"
          aria-label="Aumentar tamanho"
          onClick={() => aoMudarTamanho(1)}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-background hover:text-foreground disabled:opacity-40"
          disabled={tamanho >= 4}
        >
          <PlusZoom className="size-4" />
        </button>
      </div>
    </div>
  );
}

/** Classe de tamanho para a célula de um item (0-4). */
function classeTamanho(tamanho: number, modo: ModoExibicao): string {
  switch (modo) {
    case "texto":
      // Escala a tipografia: texto → base → lg → xl → 2xl
      return ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"][tamanho];
    case "icones":
      // Escala o ícone: 16 → 20 → 24 → 32 → 40
      return ["size-4", "size-5", "size-6", "size-8", "size-10"][tamanho];
    default:
      // Quadros: escala o padding interno 1 → 5
      return ["p-4", "p-5", "p-6", "p-8", "p-10"][tamanho];
  }
}

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function temAcessoAdmin(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem("pp-ai-tipo") === "admin";
}

const dadosLocalidade = [
  { localidade: "Braga", Registos: 2 },
  { localidade: "Lisboa", Registos: 1 },
  { localidade: "Coimbra", Registos: 1 },
  { localidade: "Porto", Registos: 1 },
];

const dadosEntidades = [
  { tipo: "Clientes", value: 5 },
  { tipo: "Profissionais", value: 4 },
  { tipo: "Pedidos", value: 1 },
];

// Faturamento projetado (demonstração) — meses dos últimos 3 + os 3 futuros
const dadosFaturamento = [
  { mes: "Nov", real: 3200, previsto: null },
  { mes: "Dez", real: 3850, previsto: null },
  { mes: "Jan", real: 4100, previsto: null },
  { mes: "Fev", real: null, previsto: 4650 },
  { mes: "Mar", real: null, previsto: 5300 },
  { mes: "Abr", real: null, previsto: 6050 },
];

// Categorias mais solicitadas / pesquisadas (nº de pesquisas) na demonstração
const dadosCategorias = [
  { categoria: "Reparações", valor: 42 },
  { categoria: "Limpeza", valor: 31 },
  { categoria: "Eletricidade", valor: 24 },
  { categoria: "Jardinagem", valor: 18 },
  { categoria: "Outros", valor: 9 },
];

const CORES_ENTITY = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
];

// Lista inicial de categorias (para reordenação drag/drop)
const listaCategoriasInicial = [
  "Reparações e bricolage",
  "Canalização",
  "Eletricidade",
  "Limpeza",
  "Jardinagem",
  "Pintura",
  "Mudanças e transportes",
  "Informática e tecnologia",
  "Design gráfico",
  "Marketing digital",
  "Fotografia e vídeo",
  "Explicações e formação",
  "Consultoria empresarial",
  "Eventos",
  "Beleza e bem-estar",
  "Outros serviços",
];

// Avaliações de demonstração (para reordenação drag/drop)
interface AvaliacaoDemonstracao {
  id: string;
  pro: string;
  estrelas: number;
  texto: string;
}
const avaliacoesDemonstracao: AvaliacaoDemonstracao[] = [
  {
    id: "av1",
    pro: "Marta Costa",
    estrelas: 5,
    texto: "Excelente profissional, cumprimentou e entregou no prazo.",
  },
  {
    id: "av2",
    pro: "Ana Silva",
    estrelas: 4,
    texto: "Muito boa comunicação e serviço caprichado.",
  },
  {
    id: "av3",
    pro: "Carlos Mendes",
    estrelas: 5,
    texto: "Trabalho de topo, recomendo.",
  },
];

// Utilizadores de demonstração (para reordenação drag/drop)
interface UtilizadorDemonstracao {
  id: string;
  nome: string;
  tipo: string;
  estado: string;
  acesso: string;
}
const utilizadoresDemonstracao: UtilizadorDemonstracao[] = [
  { id: "u-0", nome: "admin@proxipro.ai", tipo: "Administrador", estado: "Ativo", acesso: "Hoje, 09:12" },
  { id: "u-1", nome: "ana.silva@exemplo.pt", tipo: "Cliente", estado: "Ativo", acesso: "Ontem" },
  { id: "u-2", nome: "carlos.mendes@exemplo.pt", tipo: "Profissional", estado: "Ativo", acesso: "Há 2 dias" },
  { id: "u-3", nome: "s.oficial@exemplo.pt", tipo: "Profissional", estado: "Pendente", acesso: "Há 5 dias" },
];

const configuracaoMapa: ChartConfig = {
  Registos: { label: "Registos", color: "var(--color-chart-1)" },
};

const configuracaoEntidades: ChartConfig = {
  Clientes: { label: "Clientes", color: "var(--color-chart-1)" },
  Profissionais: { label: "Profissionais", color: "var(--color-chart-2)" },
  Pedidos: { label: "Pedidos", color: "var(--color-chart-3)" },
};

const configuracaoFaturamento: ChartConfig = {
  real: { label: "Faturado", color: "var(--color-chart-2)" },
  previsto: { label: "Previsto", color: "var(--color-chart-1)" },
};

const configuracaoCategorias: ChartConfig = {
  valor: { label: "Pesquisas", color: "var(--color-chart-3)" },
};

type SecaoId =
  | "resumo"
  | "profissionais"
  | "pedidos"
  | "denuncias"
  | "avaliacoes"
  | "categorias"
  | "utilizadores"
  | "planos"
  | "pagina-inicial"
  | "divulgacao";

const NAVEGACAO: { id: SecaoId; label: string; icone: typeof Users }[] = [
  { id: "resumo", label: "Resumo", icone: LayoutDashboard },
  { id: "profissionais", label: "Profissionais", icone: UserCheck },
  { id: "pedidos", label: "Pedidos", icone: Inbox },
  { id: "denuncias", label: "Denúncias", icone: Flag },
  { id: "avaliacoes", label: "Avaliações", icone: Star },
  { id: "categorias", label: "Categorias", icone: Layers },
  { id: "utilizadores", label: "Utilizadores", icone: User },
  { id: "planos", label: "Planos", icone: Banknote },
  { id: "pagina-inicial", label: "Editar página inicial", icone: Home },
  { id: "divulgacao", label: "Divulgação", icone: Megaphone },
];

interface UtilizadorReciente {
  id: string;
  nome: string;
  email: string;
  tipo: "Cliente" | "Profissional" | "Administrador";
  estado: "Ativo" | "Pendente";
  registo: string;
}

const utilizadoresRecentes: UtilizadorReciente[] = [
  {
    id: "u1",
    nome: "Ana Silva",
    email: "ana.silva@exemplo.pt",
    tipo: "Cliente",
    estado: "Ativo",
    registo: "Há 1 dia",
  },
  {
    id: "u2",
    nome: "Carlos Mendes",
    email: "carlos.mendes@exemplo.pt",
    tipo: "Profissional",
    estado: "Ativo",
    registo: "Há 3 dias",
  },
  {
    id: "u3",
    nome: "Marta Costa",
    email: "marta.costa@exemplo.pt",
    tipo: "Profissional",
    estado: "Ativo",
    registo: "Há 5 dias",
  },
  {
    id: "u4",
    nome: "admin@proxipro.ai",
    email: "admin@proxipro.ai",
    tipo: "Administrador",
    estado: "Ativo",
    registo: "—",
  },
];

type DetalheProfissional =
  | { tipo: "profissional"; alvo: Profissional }
  | { tipo: "pedido"; alvo: Pedido }
  | { tipo: "utilizador"; alvo: UtilizadorReciente }
  | null;

function Admin() {
  const [secao, setSecao] = useState<SecaoId>("resumo");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [busca, setBusca] = useState("");
  const [detalhe, setDetalhe] = useState<DetalheProfissional>(null);

  // ===== Estado local de exibição e reordenação por arrastar/soltar =====
  const [modoExibicao, setModoExibicao] = useState<ModoExibicao>("quadros");
  const [tamanhoExibicao, setTamanhoExibicao] = useState(1); // 0..4
  const [ordemResumo, setOrdemResumo] = useState<number[]>(() =>
    Array.from({ length: 8 }, (_, i) => i),
  );
  const [ordemProfissionais, setOrdemProfissionais] = useState<string[]>(() =>
    profissionais.map((p) => p.id),
  );
  const [ordemPedidos, setOrdemPedidos] = useState<string[]>(() =>
    pedidos.map((p) => p.id),
  );
  const [ordemAvaliacoes, setOrdemAvaliacoes] = useState<string[]>(() =>
    avaliacoesDemonstracao.map((a) => a.id),
  );
  const [ordemCategorias, setOrdemCategorias] = useState<string[]>(() =>
    listaCategoriasInicial.map((c) => c),
  );
  const [ordemUtilizadores, setOrdemUtilizadores] = useState<string[]>(() =>
    utilizadoresDemonstracao.map((u, i) => `u-${i}`),
  );
  const [ordemPlanos, setOrdemPlanos] = useState<string[]>(() =>
    planos.map((p) => p.nome),
  );

  const secaoAtual = NAVEGACAO.find((n) => n.id === secao);
  const SecaoIcone = secaoAtual?.icone ?? LayoutDashboard;

  const profissionaisFiltrados = useMemo(
    () =>
      profissionais.filter(
        (p) =>
          !busca.trim() ||
          p.nome.toLowerCase().includes(busca.toLowerCase()) ||
          (p.nomeComercial ?? "").toLowerCase().includes(busca.toLowerCase()) ||
          p.localidade.toLowerCase().includes(busca.toLowerCase()) ||
          p.especialidade.toLowerCase().includes(busca.toLowerCase()),
      ),
    [busca],
  );

  const pedidosFiltrados = useMemo(
    () =>
      pedidos.filter(
        (d) =>
          !busca.trim() ||
          d.titulo.toLowerCase().includes(busca.toLowerCase()) ||
          d.localidade.toLowerCase().includes(busca.toLowerCase()),
      ),
    [busca],
  );

  if (!temAcessoAdmin()) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
          <Lock className="size-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Acesso reservado</h1>
        <p className="mt-2 text-muted-foreground">
          O painel de administração está reservado a administradores
          autorizados pelo operador da plataforma. Não é possível tornar-se
          administrador através de um formulário público nem por qualquer
          escolha feita durante o registo.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="sm" variant="default">
            <Link to="/entrar">Iniciar sessão</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Para demonstração local: usa a página «Iniciar sessão» e um email
          começado por «admin».
        </p>
      </div>
    );
  }

  const abrirDetalhe = (d: NonNullable<DetalheProfissional>) => {
    setDetalhe(d);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-6">
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Painel de administração
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <Lock className="mr-1 size-3" />
                Reservado
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestão central da plataforma — dados de demonstração.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/mapa">
              <MapPin className="mr-1 size-3.5" />
              Mapa
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/">Voltar ao site</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar de navegação */}
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                {NAVEGACAO.map((item) => {
                  const Icone = item.icone;
                  const ativa = secao === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSecao(item.id);
                        setBusca("");
                        setDetalhe(null);
                      }}
                      className={`group flex min-w-[140px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all lg:min-w-0 ${
                        ativa
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icone
                        className={`size-4 shrink-0 ${ativa ? "" : "text-muted-foreground group-hover:text-foreground"}`}
                      />
                      <span className="truncate">{item.label}</span>
                      {ativa && (
                        <ChevronRight className="ml-auto size-4 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          <Card className="mt-4 hidden lg:block">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Atalho rápido</h3>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Explora a distribuição geográfica dos registos da plataforma.
              </p>
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link to="/admin/mapa">Abrir mapa online</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Conteúdo principal */}
        <main className="min-w-0 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <SecaoIcone className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{secaoAtual?.label}</h2>
                <p className="text-xs text-muted-foreground">
                  {secao === "resumo"
                    ? "Visão geral e métricas da plataforma"
                    : "Detalhes e gestão da secção"}
                </p>
              </div>
            </div>
            {(secao === "profissionais" || secao === "pedidos") && (
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder={
                    secao === "profissionais"
                      ? "Procurar profissional…"
                      : "Procurar pedido…"
                  }
                  className="pl-9"
                />
              </div>
            )}
          </div>

          {secao === "resumo" && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Exibição: </span>
                  {ROTULO_MODO[modoExibicao]} · arrasta os cartões para reordenar
                </div>
                <ControlesExibicao
                  modo={modoExibicao}
                  aoMudarModo={setModoExibicao}
                  tamanho={tamanhoExibicao}
                  aoMudarTamanho={(delta) =>
                    setTamanhoExibicao((t) => Math.max(0, Math.min(4, t + delta)))
                  }
                />
              </div>
              <div
                className={`grid gap-4 ${
                  modoExibicao === "texto"
                    ? "grid-cols-1"
                    : "sm:grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {ordemResumo.map((idx) => {
                  const c = cardsResumo[idx];
                  const arrastar = usarReordenacao(
                    ordemResumo.map((o) => ({ id: String(o) })),
                    (nova) =>
                      setOrdemResumo(nova.map((n) => Number(n.id))),
                  );
                  const propsDrag = arrastar(String(idx), String(idx));
                  return (
                    <div
                      key={c.label}
                      {...propsDrag}
                      className={
                        modoExibicao === "texto"
                          ? "cursor-grab rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md active:cursor-grabbing"
                          : "cursor-grab rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
                      }
                      style={
                        modoExibicao === "quadros"
                          ? {
                              transform: undefined,
                              ["--celula" as string]: "",
                              padding: ["1rem", "1.25rem", "1.5rem", "2rem", "2.5rem"][tamanhoExibicao],
                            }
                          : modoExibicao === "icones"
                            ? {
                                ["--icone" as string]: [
                                  "1rem",
                                  "1.25rem",
                                  "1.5rem",
                                  "2rem",
                                  "2.5rem",
                                ][tamanhoExibicao],
                              }
                            : { fontSize: ["0.875rem", "1rem", "1.125rem", "1.25rem", "1.5rem"][tamanhoExibicao] }
                      }
                      aria-label={`Reordenar ${c.label}`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div
                          className={`flex items-center justify-center rounded-lg bg-primary text-primary-foreground ${
                            modoExibicao === "icones"
                              ? "flex" 
                              : "flex"
                          }`}
                          style={{
                            width: modoExibicao === "icones" ? (8 + tamanhoExibicao * 4) + "rem" : 2.5 + "rem",
                            height: modoExibicao === "icones" ? (8 + tamanhoExibicao * 4) + "rem" : 2.5 + "rem",
                            fontSize: modoExibicao === "icones" ? (1 + tamanhoExibicao * 0.25) + "rem" : "1.25rem",
                          }}
                        >
                          {c.icone}
                        </div>
                        {modoExibicao !== "texto" && (
                          <ChevronRight className="size-4 text-muted-foreground" />
                        )}
                        <GripVertical className="absolute right-2 top-2 size-4 text-muted-foreground/40" />
                      </div>
                      <div
                        className={`flex items-baseline gap-2 ${
                          modoExibicao === "texto" ? "text-base" : ""
                        }`}
                      >
                        <p
                          className="font-bold"
                          style={{
                            fontSize:
                              modoExibicao === "texto"
                                ? ["0.875rem", "1rem", "1.125rem", "1.25rem", "1.5rem"][tamanhoExibicao]
                                : modoExibicao === "icones"
                                  ? ["1rem", "1.25rem", "1.5rem", "2rem", "2.5rem"][tamanhoExibicao]
                                  : ["1.5rem", "1.75rem", "2rem", "2.5rem", "3rem"][tamanhoExibicao],
                          }}
                        >
                          {c.valor}
                        </p>
                        <p className="text-xs font-medium text-primary">{c.delta}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
                    </div>
                  );
                })}
              </div>

              <Card>
                <CardHeader className="flex flex-wrap items-center justify-between gap-3 p-5 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <MapPin className="size-6" />
                    </div>
                    <div>
                      <h2 className="font-semibold">
                        Mapa interativo da plataforma
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Visualiza em tempo real clientes, profissionais e
                        pedidos. Clica num registo para ver os dados.
                      </p>                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/admin/mapa">
                      Mapa completo
                      <ChevronRight className="ml-1 size-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <MapaPlataforma
                    compacto
                    onSelecionar={(id) => {
                      if (!id) return;
                      const pro = profissionais.find((p) => p.id === id);
                      if (pro) {
                        setDetalhe({ tipo: "profissional", alvo: pro });
                        return;
                      }
                      const ped = pedidos.find((d) => d.id === id);
                      if (ped) setDetalhe({ tipo: "pedido", alvo: ped });
                    }}
                  />
                </CardContent>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Registos por localidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={configuracaoMapa}
                      className="h-40 aspect-auto w-full"
                    >
                      <BarChart data={dadosLocalidade}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="localidade"
                          tick={{ fontSize: 10 }}
                          interval={0}
                        />
                        <YAxis
                          tick={{ fontSize: 10 }}
                          width={26}
                          allowDecimals={false}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent hideIndicator nameKey="value" />
                          }
                        />
                        <Bar
                          dataKey="Registos"
                          fill="var(--color-chart-1)"
                          radius={[3, 3, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Repartição de entidades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={configuracaoEntidades}
                      className="h-40 aspect-auto w-full"
                    >
                      <PieChart>
                        <Pie
                          data={dadosEntidades}
                          dataKey="value"
                          nameKey="tipo"
                          innerRadius={35}
                          outerRadius={60}
                          paddingAngle={3}
                        >
                          {dadosEntidades.map((entry, i) => (
                            <Cell
                              key={entry.tipo}
                              fill={CORES_ENTITY[i % CORES_ENTITY.length]}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={<ChartTooltipContent hideIndicator />}
                        />
                        <ChartLegend
                          content={<ChartLegendContent hideIcon />}
                        />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Futuro faturamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={configuracaoFaturamento}
                      className="h-40 w-full"
                    >
                      <LineChart data={dadosFaturamento}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} width={34} />
                        <ChartTooltip
                          content={<ChartTooltipContent hideIndicator />}
                        />
                        <ReferenceLine
                          x="Fev"
                          stroke="var(--muted-foreground)"
                          strokeDasharray="4 4"
                        />
                        <Line
                          type="monotone"
                          dataKey="real"
                          stroke="var(--color-chart-2)"
                          strokeWidth={2}
                          connectNulls
                        />
                        <Line
                          type="monotone"
                          dataKey="previsto"
                          stroke="var(--color-chart-1)"
                          strokeWidth={2}
                          strokeDasharray="6 6"
                          connectNulls
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Categoria mais solicitada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-lg border p-2">
                        <div className="text-muted-foreground">
                          Faturamento previsto (Fev–Abr)
                        </div>
                        <div className="text-base font-bold">
                          ~16 000 €
                        </div>
                      </div>
                      <div className="rounded-lg border p-2">
                        <div className="text-muted-foreground">
                          Categoria mais pesquisada
                        </div>
                        <div className="text-base font-bold">
                          {dadosCategorias[0].categoria}
                        </div>
                      </div>
                    </div>
                    <ChartContainer
                      config={configuracaoCategorias}
                      className="h-36 w-full"
                    >
                      <BarChart data={dadosCategorias} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="categoria"
                          tick={{ fontSize: 10 }}
                          width={70}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent hideIndicator />}
                        />
                        <Bar
                          dataKey="valor"
                          fill="var(--color-chart-3)"
                          radius={[0, 3, 3, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Últimos registos · utilizadores, profissionais e pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Últimos utilizadores
                      </h4>
                      <div className="space-y-2">
                        {utilizadoresRecentes.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => setDetalhe({ tipo: "utilizador", alvo: u })}
                            className="flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all hover:border-primary/40 hover:bg-muted/40"
                          >
                            <span className="text-sm font-medium">{u.nome}</span>
                            <span className="text-xs text-muted-foreground">
                              {u.registo}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Últimos profissionais
                      </h4>
                      <div className="space-y-2">
                        {profissionais.slice(0, 3).map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setDetalhe({ tipo: "profissional", alvo: p })}
                            className="flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all hover:border-primary/40 hover:bg-muted/40"
                          >
                            <span className="text-sm font-medium">
                              {p.nomeComercial ?? p.nome}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {p.localidade}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Últimos pedidos
                      </h4>
                      <div className="space-y-2">
                        {pedidos.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => setDetalhe({ tipo: "pedido", alvo: d })}
                            className="flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all hover:border-primary/40 hover:bg-muted/40"
                          >
                            <span className="truncate text-sm font-medium">
                              {d.titulo}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {d.dataCriacao}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {secao === "profissionais" && (
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold">
                      Profissionais ({profissionaisFiltrados.length})
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Clica numa linha para ver o perfil e ações.
                    </p>
                  </div>
                  {busca && (
                    <Button size="sm" variant="ghost" onClick={() => setBusca("")}>
                      Limpar
                    </Button>
                  )}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profissional</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Localidade</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profissionaisFiltrados.map((p) => (
                      <TableRow
                        key={p.id}
                        className="cursor-pointer hover:bg-muted/40"
                        onClick={() =>
                          abrirDetalhe({ tipo: "profissional", alvo: p })
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {p.nome.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">
                                {p.nomeComercial ?? p.nome}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {p.especialidade}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{p.categoria}</TableCell>
                        <TableCell>{p.localidade}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              p.estado === "aprovado"
                                ? "secondary"
                                : p.estado === "em_analise"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {p.estado.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                abrirDetalhe({ tipo: "profissional", alvo: p })
                              }
                            >
                              <Eye className="mr-1 size-3.5" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                toast.success(
                                  p.estado === "aprovado"
                                    ? "Profissional suspenso (demonstração)"
                                    : "Profissional aprovado (demonstração)",
                                )
                              }
                            >
                              {p.estado === "aprovado" ? (
                                <>
                                  <Trash2 className="mr-1 size-3.5" />
                                  Suspender
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="mr-1 size-3.5" />
                                  Aprovar
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {profissionaisFiltrados.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-8 text-center text-sm text-muted-foreground"
                        >
                          Nenhum profissional corresponde à procura.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {secao === "pedidos" && (
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold">
                      Pedidos ({pedidosFiltrados.length})
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Clica num pedido para ver os detalhes.
                    </p>
                  </div>
                  {busca && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setBusca("")}
                    >
                      Limpar
                    </Button>
                  )}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Localidade</TableHead>
                      <TableHead>Urgência</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidosFiltrados.map((d) => (
                      <TableRow
                        key={d.id}
                        className="cursor-pointer hover:bg-muted/40"
                        onClick={() => abrirDetalhe({ tipo: "pedido", alvo: d })}
                      >
                        <TableCell>
                          <div className="font-medium">{d.titulo}</div>
                          <div className="text-xs text-muted-foreground">
                            {d.dataCriacao}
                          </div>
                        </TableCell>
                        <TableCell>{d.localidade}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              d.urgencia === "alta"
                                ? "destructive"
                                : d.urgencia === "media"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {d.urgencia === "alta"
                              ? "Alta"
                              : d.urgencia === "media"
                                ? "Média"
                                : "Baixa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{d.estado}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                abrirDetalhe({ tipo: "pedido", alvo: d })
                              }
                            >
                              <Eye className="mr-1 size-3.5" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                toast.info(
                                  "Pedido avançado para o próximo estado (demonstração)",
                                )
                              }
                            >
                              Avançar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pedidosFiltrados.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-8 text-center text-sm text-muted-foreground"
                        >
                          Nenhum pedido corresponde à procura.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {secao === "denuncias" && (
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                      <MessageSquareWarning className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold">
                        Denúncias e reclamações
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Clica num caso para ver os detalhes.
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">A tratar</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Registo de denúncias recebidas sobre profissionais, pedidos
                  ou avaliações. A administração trata cada caso com
                  transparência e histórico.
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      tipo: "Avaliação",
                      alvo: "Perfil p1",
                      motivo: "Linguagem inadequada",
                      estado: "Em análise",
                    },
                    {
                      tipo: "Pedido",
                      alvo: "Pedido d1",
                      motivo: "Não corresponde à descrição",
                      estado: "Nova",
                    },
                    {
                      tipo: "Perfil",
                      alvo: "Perfil p3",
                      motivo: "Dados não verificados",
                      estado: "Resolvida",
                    },
                  ].map((d, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        toast.info(`Denúncia ${i + 1}: detalhes (demonstração)`)
                      }
                      className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all hover:border-primary hover:bg-muted/40"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {d.tipo} · {d.alvo}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {d.motivo}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            d.estado === "Resolvida" ? "secondary" : "outline"
                          }
                        >
                          {d.estado}
                        </Badge>
                        <span className="text-xs font-medium text-primary">
                          Tratar
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {secao === "avaliacoes" && (
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <StarIcon className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Avaliações recentes</h2>
                      <p className="text-xs text-muted-foreground">
                        Moderação de avaliações publicadas.
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Moderação</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  As avaliações só podem ser publicadas depois de um serviço
                  concluído. A equipa de administração pode moderar
                  denúncias.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      pro: "Carlos Mendes",
                      estrelas: 5,
                      texto: "Excelente, rápido e profissional.",
                    },
                    {
                      pro: "Marta Costa",
                      estrelas: 5,
                      texto: "Trabalho impecável, muito cuidado.",
                    },
                  ].map((a, i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{a.pro}</span>
                        <span className="text-sm text-amber-500">
                          {"★".repeat(a.estrelas)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {a.texto}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            toast.success(
                              "Avaliação mantida publicada (demonstração)",
                            )
                          }
                        >
                          <ShieldCheck className="mr-1 size-3.5" />
                          Manter
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            toast.info("Avaliação ocultada (demonstração)")
                          }
                        >
                          <X className="mr-1 size-3.5" />
                          Ocultar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {secao === "categorias" && (
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">Gestão de categorias</h2>
                    <p className="text-xs text-muted-foreground">
                      Categorias disponíveis na pesquisa de serviços.
                    </p>
                  </div>
                  <Badge variant="outline">16 ativas</Badge>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    "Reparações e bricolage",
                    "Canalização",
                    "Eletricidade",
                    "Limpeza",
                    "Jardinagem",
                    "Pintura",
                    "Mudanças e transportes",
                    "Informática e tecnologia",
                    "Design gráfico",
                    "Marketing digital",
                    "Fotografia e vídeo",
                    "Explicações e formação",
                    "Consultoria empresarial",
                    "Eventos",
                    "Beleza e bem-estar",
                    "Outros serviços",
                  ].map((c) => (
                    <div
                      key={c}
                      className="flex items-center justify-between rounded-xl border p-3 transition-all hover:border-primary/40 hover:bg-muted/40"
                    >
                      <span className="text-sm">{c}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            toast.info("Edição de categoria (demonstração)")
                          }
                        >
                          <Pencil className="mr-1 size-3.5" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            toast.info("Remoção de categoria (demonstração)")
                          }
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border p-4">
                  <h3 className="mb-2 text-sm font-semibold">Nova categoria</h3>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      value={novaCategoria}
                      onChange={(e) => setNovaCategoria(e.target.value)}
                      placeholder="Nome da categoria"
                      className="max-w-xs"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!novaCategoria.trim()) return;
                        toast.success(
                          `Categoria «${novaCategoria}» criada (demonstração)`,
                        );
                        setNovaCategoria("");
                      }}
                    >
                      <Plus className="mr-1 size-3.5" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {secao === "utilizadores" && (
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">Gestão de utilizadores</h2>
                    <p className="text-xs text-muted-foreground">
                      Lista consolidada de contas. O tipo «administrador» só
                      é atribuído internamente pelo operador.
                    </p>
                  </div>
                  <Badge variant="outline">Todos os tipos</Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilizador</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Último acesso</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        nome: "admin@proxipro.ai",
                        tipo: "Administrador",
                        estado: "Ativo",
                        acesso: "Hoje, 09:12",
                      },
                      {
                        nome: "ana.silva@exemplo.pt",
                        tipo: "Cliente",
                        estado: "Ativo",
                        acesso: "Ontem",
                      },
                      {
                        nome: "carlos.mendes@exemplo.pt",
                        tipo: "Profissional",
                        estado: "Ativo",
                        acesso: "Há 2 dias",
                      },
                      {
                        nome: "s.oficial@exemplo.pt",
                        tipo: "Profissional",
                        estado: "Pendente",
                        acesso: "Há 5 dias",
                      },
                    ].map((u, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm font-medium">
                          {u.nome}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.tipo === "Administrador"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {u.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.estado === "Ativo" ? "secondary" : "outline"}
                          >
                            {u.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {u.acesso}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              toast.info(`Detalhes de ${u.nome} (demonstração)`)
                            }
                          >
                            <Eye className="mr-1 size-3.5" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {secao === "planos" && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">Gestão de planos</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Os preços apresentados são hipóteses comerciais e ainda
                        não são cobrados.
                      </p>
                    </div>
                    <Badge variant="outline">Pré-lançamento</Badge>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-3">
                {planos.map((p) => (
                  <Card
                    key={p.nome}
                    className={`transition-all hover:-translate-y-0.5 hover:shadow-md ${
                      p.destaque ? "border-primary ring-1 ring-primary/30" : ""
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold">{p.nome}</h3>
                        {p.destaque && <Badge>Recomendado</Badge>}
                      </div>
                      <p className="text-2xl font-bold">
                        {p.preco}
                        <span className="text-sm font-normal text-muted-foreground">
                          {p.periodo}
                        </span>
                      </p>
                      <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                        {p.recursos.map((r) => (
                          <li key={r}>· {r}</li>
                        ))}
                      </ul>
                      <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/50 p-3">
                        <span className="text-xs text-muted-foreground">
                          Ativos: 0
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toast.info(
                              `Plano ${p.nome}: gestão de subscrições ainda não ativa`,
                            )
                          }
                        >
                          <BadgePercent className="mr-1 size-3.5" />
                          Gerir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {secao === "pagina-inicial" && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">Editar página inicial</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Edita o conteúdo visível na página inicial do site.
                      </p>
                    </div>
                    <Badge variant="outline">Página inicial</Badge>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Hero (título principal)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Título</label>
                      <Input defaultValue="Encontra o profissional certo." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Subtítulo</label>
                      <Input defaultValue="Sem complicações." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Descrição</label>
                      <textarea
                        className="min-h-20 w-full rounded-md border px-3 py-2 text-sm" defaultValue="Explica-nos o que precisas. A ProxiPro AI ajuda-te a encontrar profissionais adequados à tua necessidade."
                      />
                    </div>
                    <Button size="sm" onClick={() => toast.success("Título do hero atualizado (demonstração)")}>Guardar</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Secção Categorias</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Reorganiza as categorias mostradas na página inicial arrastando os itens.
                    </p>
                    <div className="grid gap-2">
                      {categorias.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-2 rounded-lg border p-2 text-sm"
                        >
                          <GripVertical className="size-4 text-muted-foreground" />
                          <span>{c.nome}</span>
                          <Badge variant="outline" className="ml-auto">{c.id}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Secção "Para profissionais"</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Título</label>
                        <Input defaultValue="És profissional? Encontra novos clientes." />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Texto de apoio</label>
                        <Input defaultValue="Cria o teu perfil, apresenta os teus serviços e recebe oportunidades de trabalho." />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <p className="text-xs font-medium">Benefícios (arrasta para reordenar)</p>
                      {[
                        "Perfil profissional com portefólio",
                        "Receção de pedidos de clientes",
                        "Mensagens e propostas",
                        "Estatísticas do teu perfil",
                        "Disponibilidade à medida",
                        "Avaliações reais",
                      ].map((b, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-lg border p-2 text-sm"
                        >
                          <GripVertical className="size-4 text-muted-foreground" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                    <Button size="sm" onClick={() => toast.success("Secção de profissionais atualizada (demonstração)")}>Guardar</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {secao === "divulgacao" && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">Banners de divulgação</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Cria banners em forma de popup para exibir na página inicial.
                      </p>
                    </div>
                    <Badge variant="outline">Popup</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-4 p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Título do banner</label>
                      <Input placeholder="Ex.: Promoção de verão" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Texto de apoio</label>
                      <Input placeholder="Ex.: Regista-te e ganha 10% de desconto" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Imagem (envia um arquivo)</label>
                      <div className="flex items-center gap-3">
                        <Input type="file" accept="image/*" className="w-full" />
                        <Button type="button" size="sm" variant="outline" onClick={() => toast.success("Arquivo enviado (demonstração)")}>
                          <Upload className="mr-1 size-3.5" /> Enviar
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Tamanho</label>
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" size="sm" variant="outline">Pequeno</Button>
                        <Button type="button" size="sm" variant="outline">Médio</Button>
                        <Button type="button" size="sm" variant="outline">Grande</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Padrão: tamanho original do arquivo.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Data de início</label>
                      <Input type="datetime-local" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Data de término</label>
                      <Input type="datetime-local" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Vezes de exibição</label>
                      <Input type="number" min={0} placeholder="0 = ilimitado" />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={() => toast.success("Banner criado (demonstração)")}>Criar banner</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.info("Banner agendado (demonstração)")}>Agendar</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">Banners existentes</h3>
                      <p className="text-xs text-muted-foreground">
                        Lista de banners criados (demonstração).
                      </p>
                    </div>
                    <Badge variant="outline">2 ativos</Badge>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between rounded-xl border p-3">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="size-8 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Promoção de verão</div>
                          <div className="text-xs text-muted-foreground">Pequeno · ilimitado</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.info("Banner editado (demonstração)")}><Pencil className="mr-1 size-3.5" />Editar</Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.info("Banner removido (demonstração)")}><Trash2 className="size-3.5" /></Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border p-3">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="size-8 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Novo plano Premium</div>
                          <div className="text-xs text-muted-foreground">Grande · 3 vezes</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.info("Banner editado (demonstração)")}><Pencil className="mr-1 size-3.5" />Editar</Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.info("Banner removido (demonstração)")}><Trash2 className="size-3.5" /></Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Painel de detalhe (Sheet) */}
      <Sheet
        open={detalhe !== null}
        onOpenChange={(aberto) => !aberto && setDetalhe(null)}
      >
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>
                {detalhe?.tipo === "profissional"
                  ? "Perfil do profissional"
                  : detalhe?.tipo === "pedido"
                    ? "Detalhes do pedido"
                    : detalhe?.tipo === "utilizador"
                      ? "Detalhes do utilizador"
                      : "Detalhes"}
              </SheetTitle>
              <Button variant="ghost" size="sm" onClick={() => setDetalhe(null)}>
                <X className="size-4" />
              </Button>
            </div>
            <SheetDescription>
              Ações de administração (demonstração).
            </SheetDescription>
          </SheetHeader>

          {detalhe?.tipo === "profissional" && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {detalhe.alvo.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {detalhe.alvo.nomeComercial ?? detalhe.alvo.nome}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {detalhe.alvo.especialidade}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Categoria</div>
                  <div className="font-medium capitalize">
                    {detalhe.alvo.categoria}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">
                    Localidade
                  </div>
                  <div className="font-medium">{detalhe.alvo.localidade}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Estado</div>
                  <div className="font-medium capitalize">
                    {detalhe.alvo.estado.replace("_", " ")}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">
                    Avaliações
                  </div>
                  <div className="font-medium">
                    {detalhe.alvo.avaliacao ?? "—"} (
                    {detalhe.alvo.numeroAvaliacoes})
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {detalhe.alvo.descricao}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to={`/profissionais/${detalhe.alvo.id}`}>
                    <Eye className="mr-1 size-3.5" />
                    Abrir página do perfil
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.success(
                      "Dados do profissional atualizados (demonstração)",
                    )
                  }
                >
                  <Pencil className="mr-1 size-3.5" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.info("Remoção de profissional (demonstração)")
                  }
                >
                  <Trash2 className="mr-1 size-3.5" />
                  Remover
                </Button>
              </div>
            </div>
          )}

          {detalhe?.tipo === "utilizador" && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {detalhe.alvo.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{detalhe.alvo.nome}</h3>
                  <p className="text-sm text-muted-foreground">
                    {detalhe.alvo.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Tipo</div>
                  <div className="font-medium">{detalhe.alvo.tipo}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Estado</div>
                  <div className="font-medium">{detalhe.alvo.estado}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">
                    Registo
                  </div>
                  <div className="font-medium">{detalhe.alvo.registo}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Acesso</div>
                  <div className="font-medium">Recorde local</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.success("Dados do utilizador atualizados (demonstração)")
                  }
                >
                  <Pencil className="mr-1 size-3.5" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.info("Bloqueio de conta de utilizador (demonstração)")
                  }
                >
                  <Lock className="mr-1 size-3.5" />
                  Bloquear
                </Button>
              </div>
            </div>
          )}

          {detalhe?.tipo === "pedido" && (
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-semibold">{detalhe.alvo.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {detalhe.alvo.descricao}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">
                    Localidade
                  </div>
                  <div className="font-medium">{detalhe.alvo.localidade}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">
                    Urgência
                  </div>
                  <div className="font-medium capitalize">
                    {detalhe.alvo.urgencia}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Estado</div>
                  <div className="font-medium capitalize">
                    {detalhe.alvo.estado}
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Criado</div>
                  <div className="font-medium">
                    {detalhe.alvo.dataCriacao}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.success(
                      "Pedido avançado para o próximo estado (demonstração)",
                    )
                  }
                >
                  <FileText className="mr-1 size-3.5" />
                  Avançar estado
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast.info("Pedido reencaminhado (demonstração)")
                  }
                >
                  Reencaminhar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info("Pedido arquivado (demonstração)")}
                >
                  Arquivar
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
