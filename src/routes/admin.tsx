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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { profissionais, pedidos } from "@/data/plataforma";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function temAcessoAdmin(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem("pp-ai-tipo") === "admin";
}

function Admin() {
  const [secao, setSecao] = useState<"resumo" | "profissionais" | "pedidos" | "avaliacoes" | "categorias">("resumo");

  if (!temAcessoAdmin()) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
          <Lock className="size-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Acesso reservado</h1>
        <p className="mt-2 text-muted-foreground">
          O painel de administração está reservado a administradores
          autorizados. Não é possível tornar-se administrador através de um
          formulário público.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              localStorage.setItem("pp-ai-tipo", "admin");
              window.location.reload();
            }}
            variant="outline"
            size="sm"
          >
            Entrar como administrador (demonstração)
          </Button>
          <Button asChild size="sm">
            <Link to="/entrar">Iniciar sessão</Link>
          </Button>
        </div>
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
          ["avaliacoes", "Avaliações"],
          ["categorias", "Categorias"],
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icone: <Users className="size-5" />, valor: "128", label: "Clientes registados" },
            { icone: <UserCheck className="size-5" />, valor: "42", label: "Profissionais aprovados" },
            { icone: <Clock className="size-5" />, valor: "9", label: "Profissionais pendentes" },
            { icone: <Inbox className="size-5" />, valor: "87", label: "Pedidos de serviço" },
            { icone: <Flag className="size-5" />, valor: "3", label: "Denúncias a tratar" },
            { icone: <Star className="size-5" />, valor: "214", label: "Avaliações publicadas" },
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
                    <Button size="sm" variant="ghost">
                      Editar
                    </Button>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
