import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Send,
  Clock,
  MessageSquare,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { pedidos } from "@/data/plataforma";

export const Route = createFileRoute("/painel-cliente")({
  component: PainelCliente,
});

function PainelCliente() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-2">Painel do cliente</Badge>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          A tua conta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumo, pedidos, mensagens e definições.
        </p>
      </div>

      <Tabs defaultValue="resumo">
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="definicoes">Definições</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="mt-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { rotulo: "Pedidos enviados", valor: "4", icone: <Send className="size-4" /> },
              { rotulo: "Pendentes", valor: "1", icone: <Clock className="size-4" /> },
              { rotulo: "Mensagens", valor: "3", icone: <MessageSquare className="size-4" /> },
              { rotulo: "Favoritos", valor: "2", icone: <Heart className="size-4" /> },
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
              <CardTitle>Pedidos enviados</CardTitle>
              <CardDescription>
                Acompanha o estado de cada pedido.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pedidos.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{p.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.localidade} · {p.dataCriacao}
                    </p>
                  </div>
                  <Badge
                    variant={
                      p.estado === "contratado" || p.estado === "concluido"
                        ? "secondary"
                        : "outline"
                    }
                  >
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
              As conversas com profissionais estão na área de mensagens.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link to="/mensagens">Abrir mensagens</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="definicoes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Definições da conta</CardTitle>
              <CardDescription>
                Preferências, privacidade e dados.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <input className="mt-1 w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="Ana Silva" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input className="mt-1 w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="ana@exemplo.pt" />
              </div>
              <div>
                <label className="text-sm font-medium">Localidade preferida</label>
                <input className="mt-1 w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring" defaultValue="Braga" />
              </div>
              <div>
                <label className="text-sm font-medium">Notificações</label>
                <select className="mt-1 w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option>Só essenciais</option>
                  <option>Todas</option>
                  <option>Nenhuma</option>
                </select>
              </div>
              <Button onClick={() => toast.success("Definições guardadas (demonstração)")}>
                Guardar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
