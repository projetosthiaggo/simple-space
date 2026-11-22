import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  BarChart3,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { profissionais, pedidos, planos } from "@/data/plataforma";

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

const CORES_ENTITY = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
];

const configuracaoMapa: ChartConfig = {
  Registos: { label: "Registos", color: "var(--color-chart-1)" },
};

const configuracaoEntidades: ChartConfig = {
  Clientes: { label: "Clientes", color: "var(--color-chart-1)" },
  Profissionais: { label: "Profissionais", color: "var(--color-chart-2)" },
  Pedidos: { label: "Pedidos", color: "var(--color-chart-3)" },
};

function Admin() {
  const [secao, setSecao] = useState<
    | "resumo"
    | "profissionais"
    | "pedidos"
    | "denuncias"
    | "avaliacoes"
    | "categorias"
    | "utilizadores"
    | "planos"
  >("resumo");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [planosAtivos, setPlanosAtivos] = useState<
    Record<string, { basic: number; pro: number; premium: number }>
  >({});

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2">
            <Lock className="mr-1 size-3" />
            Acesso reservado a administradores
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Painel de administração</h1>
          <p className="mt-1 text-muted-foreground">
            Nesta fase de demonstração, os dados são ilustrativos.
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ["resumo", "Resumo"],
          ["profissionais", "Profissionais"],
          ["pedidos", "Pedidos"],
          ["denuncias", "Denúncias"],
          ["avaliacoes", "Avaliações"],
          ["categorias", "Categorias"],
          ["utilizadores", "Utilizadores"],
          ["planos", "Planos"],
        ].map(([id, label]) => (
          <Button
            key={id}
            variant={secao === id ? "default" : "outline"}
            size="sm"
            onClick={() => setSecao(id as typeof secao)}
          >
            {label}
          </Button>
        ))}
      </div>

      {secao === "resumo" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icone: <Users className="size-5" />, valor: "128", label: "Clientes registados" },
              { icone: <UserCheck className="size-5" />, valor: "42", label: "Profissionais aprovados" },
              { icone: <Clock className="size-5" />, valor: "9", label: "Profissionais pendentes" },
              { icone: <Inbox className="size-5" />, valor: "87", label: "Pedidos de serviço" },
              { icone: <Flag className="size-5" />, valor: "3", label: "Denúncias a tratar" },
              { icone: <Star className="size-5" />, valor: "214", label: "Avaliações publicadas" },
              { icone: <CreditCard className="size-5" />, valor: "14", label: "Subscrições ativas" },
              { icone: <ShieldCheck className="size-5" />, valor: "1", label: "Administradores ativos" },
            ].map((c) => (
              <Card key={c.label}>
                <CardContent className="p-5">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    {c.icone}
                  </div>
                  <p className="text-3xl font-bold">{c.valor}</p>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="flex flex-col items-center justify-between gap-4 p-5 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <MapPin className="size-6" />
                </div>
                <div>
                  <h2 className="font-semibold">Mapa interativo da plataforma</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Localiza clientes, profissionais e pedidos. Clica num registo
                    para ver, editar ou remover os dados (demonstração).
                  </p>
                </div>
              </div>
              <Button asChild size="sm">
                <Link to="/admin/mapa">Abrir mapa</Link>
              </Button>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <BarChart3 className="size-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">Registos por localidade</h3>
                  </div>
                  <ChartContainer config={configuracaoMapa} className="h-40 aspect-auto w-full">
                    <BarChart data={dadosLocalidade}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="localidade" tick={{ fontSize: 10 }} interval={0} />
                      <YAxis tick={{ fontSize: 10 }} width={26} allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent hideIndicator nameKey="value" />} />
                      <Bar dataKey="Registos" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">Repartição de entidades</h3>
                  </div>
                  <ChartContainer config={configuracaoEntidades} className="h-40 aspect-auto w-full">
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
                          <Cell key={entry.tipo} fill={CORES_ENTITY[i % CORES_ENTITY.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                      <ChartLegend content={<ChartLegendContent hideIcon />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {secao === "profissionais" && (
        <Card>
          <CardContent className="p-0">
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
                {profissionais.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.nomeComercial ?? p.nome}</div>
                      <div className="text-xs text-muted-foreground">{p.especialidade}</div>
                    </TableCell>
                    <TableCell>{p.categoria}</TableCell>
                    <TableCell>{p.localidade}</TableCell>
                    <TableCell>
                      <Badge
                        variant={p.estado === "aprovado" ? "secondary" : "outline"}
                      >
                        {p.estado.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          toast.success("Estado atualizado (demonstração)")
                        }
                      >
                        <ShieldCheck className="mr-1 size-3.5" />
                        {p.estado === "aprovado" ? "Suspender" : "Aprovar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {secao === "pedidos" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Localidade</TableHead>
                  <TableHead>Urgência</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="font-medium">{d.titulo}</div>
                      <div className="text-xs text-muted-foreground">
                        {d.dataCriacao}
                      </div>
                    </TableCell>
                    <TableCell>{d.localidade}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {d.urgencia === "alta" ? "Alta" : d.urgencia === "media" ? "Média" : "Baixa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{d.estado}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {secao === "denuncias" && (
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Denúncias e reclamações</h2>
              <Badge variant="outline">A tratar</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Registo de denúncias recebidas sobre profissionais, pedidos ou
              avaliações. A administração trata cada caso com transparência e
              histórico.
            </p>
            <div className="mt-4 space-y-3">
              {[
                { tipo: "Avaliação", alvo: "Perfil p1", motivo: "Linguagem inadequada", estado: "Em análise" },
                { tipo: "Pedido", alvo: "Pedido d1", motivo: "Não corresponde à descrição", estado: "Nova" },
                { tipo: "Perfil", alvo: "Perfil p3", motivo: "Dados não verificados", estado: "Resolvida" },
              ].map((d, i) => (
                <div key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                  <div>
                    <div className="text-sm font-medium">
                      {d.tipo} · {d.alvo}
                    </div>
                    <div className="text-xs text-muted-foreground">{d.motivo}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={d.estado === "Resolvida" ? "secondary" : "outline"}>
                      {d.estado}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => toast.info("Ação registada (demonstração)")}>Tratar</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {secao === "avaliacoes" && (
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Avaliações recentes</h2>
              <Badge variant="outline">Moderação</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              As avaliações só podem ser publicadas depois de um serviço
              concluído. A equipa de administração pode moderar denúncias.
            </p>
            <div className="mt-4 space-y-3">
              {[
                { pro: "Carlos Mendes", estrelas: 5, texto: "Excelente, rápido e profissional." },
                { pro: "Marta Costa", estrelas: 5, texto: "Trabalho impecável, muito cuidado." },
              ].map((a, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{a.pro}</span>
                    <span className="text-sm text-amber-500">
                      {"★".repeat(a.estrelas)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.texto}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {secao === "categorias" && (
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Gestão de categorias</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toast.info("Novo editor de categorias em breve")
                }
              >
                Adicionar categoria
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {["Reparações e bricolage","Canalização","Eletricidade","Limpeza","Jardinagem","Pintura","Mudanças e transportes","Informática e tecnologia","Design gráfico","Marketing digital","Fotografia e vídeo","Explicações e formação","Consultoria empresarial","Eventos","Beleza e bem-estar","Outros serviços"].map(
                (c) => (
                  <div
                    key={c}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="text-sm">{c}</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toast.info("Edição de categoria (demonstração)")}>
                        <Pencil className="mr-1 size-3.5" />
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info("Remoção de categoria (demonstração)")}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="mt-4 rounded-lg border p-4">
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
                    toast.success(`Categoria «${novaCategoria}» criada (demonstração)`);
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
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Gestão de utilizadores</h2>
              <Badge variant="outline">Todos os tipos</Badge>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Lista consolidada de contas. O tipo «administrador» só é
              atribuído internamente pelo operador, nunca através de
              formulário público.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último acesso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { nome: "admin@proxipro.ai", tipo: "Administrador", estado: "Ativo", acesso: "Hoje, 09:12" },
                  { nome: "ana.silva@exemplo.pt", tipo: "Cliente", estado: "Ativo", acesso: "Ontem" },
                  { nome: "carlos.mendes@exemplo.pt", tipo: "Profissional", estado: "Ativo", acesso: "Há 2 dias" },
                  { nome: "s.oficial@exemplo.pt", tipo: "Profissional", estado: "Pendente", acesso: "Há 5 dias" },
                ].map((u, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-medium">{u.nome}</TableCell>
                    <TableCell><Badge variant={u.tipo === "Administrador" ? "secondary" : "outline"}>{u.tipo}</Badge></TableCell>
                    <TableCell><Badge variant={u.estado === "Ativo" ? "secondary" : "outline"}>{u.estado}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.acesso}</TableCell>
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Gestão de planos</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Os preços apresentados são hipóteses comerciais e ainda não
                    são cobrados. A estrutura está preparada para ativar
                    subscrições numa fase futura.
                  </p>
                </div>
                <Badge variant="outline">Pré-lançamento</Badge>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            {planos.map((p) => (
              <Card key={p.nome} className={p.destaque ? "border-primary" : ""}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">{p.nome}</h3>
                    {p.destaque && <Badge>Recomendado</Badge>}
                  </div>
                  <p className="text-2xl font-bold">
                    {p.preco}
                    <span className="text-sm font-normal text-muted-foreground">{p.periodo}</span>
                  </p>
                  <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                    {p.recursos.map((r) => (
                      <li key={r}>· {r}</li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-xs text-muted-foreground">
                      Ativos: {planosAtivos[p.nome.toLowerCase()]?.[p.nome.toLowerCase() as "basic" | "pro" | "premium"] ?? 0}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.info(`Plano ${p.nome}: gestão de subscrições ainda não ativa`)
                      }
                    >
                      Gerir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

