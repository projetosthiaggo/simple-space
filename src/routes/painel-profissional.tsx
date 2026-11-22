import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Inbox,
  Check,
  X,
  Send,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { pedidos } from "@/data/plataforma";

export const Route = createFileRoute("/painel-profissional")({
  component: PainelProfissional,
});

function PainelProfissional() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2">
            Painel do profissional
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Olá, Carlos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A teu perfil está <strong className="text-green-600">aprovado</strong>.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin">Ver estatísticas</Link>
        </Button>
      </div>

      <Tabs defaultValue="visao">
        <TabsList>
          <TabsTrigger value="visao">Visão geral</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="propostas">Propostas</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="perfil">Editar perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="visao" className="mt-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { rotulo: "Pedidos novos", valor: "3", icone: <Inbox className="size-4" /> },
              { rotulo: "Propostas enviadas", valor: "5", icone: <Send className="size-4" /> },
              { rotulo: "Mensagens não lidas", valor: "2", icone: <MessageSquare className="size-4" /> },
              { rotulo: "Avaliações (média)", valor: "4.8", icone: <Star className="size-4" /> },
            ].map((c) => (
              <Card key={c.rotulo}>
                <CardContent className="p-4">
                  <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-accent-2/15 text-accent-2">
                    {c.icone}
                  </div>
                  <p className="text-2xl font-bold">{c.valor}</p>
                  <p className="text-xs text-muted-foreground">{c.rotulo}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pedidos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos recebidos</CardTitle>
              <CardDescription>
                Aceita, recusa ou pede esclarecimentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Localidade</TableHead>
                    <TableHead>Urgência</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidos.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-medium">{p.titulo}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.dataCriacao}
                        </div>
                      </TableCell>
                      <TableCell>{p.localidade}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {p.urgencia === "alta" ? "Alta" : p.urgencia === "media" ? "Média" : "Baixa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.success("Pedido aceite (demonstração)")}
                          >
                            <Check className="size-3.5" /> Aceitar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.info("Pedido recusado (demonstração)")}
                          >
                            <X className="size-3.5" /> Recusar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="propostas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Propostas enviadas</CardTitle>
              <CardDescription>
                Acompanha o estado das tuas propostas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { titulo: "Reparação de fuga — Cozinha", estado: "Em espera do cliente" },
                { titulo: "Mudança de apartamento 3T", estado: "Proposta aceite" },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{p.titulo}</p>
                    <p className="text-xs text-muted-foreground">{p.estado}</p>
                  </div>
                  <Badge variant={p.estado.includes("aceite") ? "secondary" : "outline"}>
                    {p.estado}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensagens" className="mt-6">
          <div className="rounded-xl bg-muted/50 p-6 text-center">
            <MessageSquare className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              As mensagens estão na área de conversas partilhada.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link to="/mensagens">Abrir mensagens</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="perfil" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Editar perfil</CardTitle>
              <CardDescription>
                As alterações são publicadas após moderação.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Nome comercial</label>
                <input className="mt-1 w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="Carlos Mendes" />
              </div>
              <div>
                <label className="text-sm font-medium">Especialidade</label>
                <input className="mt-1 w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="Canalização residencial" />
              </div>
              <div>
                <label className="text-sm font-medium">Preços orientativos</label>
                <input className="mt-1 w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="A partir de 30 €/hora" />
              </div>
              <div>
                <label className="text-sm font-medium">Disponibilidade</label>
                <input className="mt-1 w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="Esta semana" />
              </div>
              <Button onClick={() => toast.success("Perfil guardado (demonstração)")}>
                Guardar alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
