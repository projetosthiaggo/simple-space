import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Euro,
  Image,
  Send,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { categorias, profissionais } from "@/data/plataforma";

export const Route = createFileRoute("/pedido")({
  component: Pedido,
  validateSearch: (s: Record<string, unknown>): { profissional?: string } => ({
    profissional:
      typeof s.profissional === "string" ? s.profissional : undefined,
  }),
});

function Pedido() {
  const search = Route.useSearch();
  const pro = profissionais.find((p) => p.id === search.profissional);

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<string>(pro?.categoria ?? "");
  const [descricao, setDescricao] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [data, setData] = useState("");
  const [urgencia, setUrgencia] = useState("media");
  const [orcamento, setOrcamento] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Pedir orçamento
        </h1>
        <p className="mt-2 text-muted-foreground">
          {pro
            ? `Pedido enviado para ${pro.nomeComercial ?? pro.nome}.`
            : "Descreve o serviço de que precisas."}
        </p>
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          Um pedido não significa contratação. A contratação só se confirma
          quando o profissional aceita a proposta e tu a confirmas.
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Pedido enviado (demonstração)", {
            description:
              "O profissional vai rever o pedido e pode aceitar, recusar ou enviar uma proposta.",
          });
        }}
        className="space-y-4"
      >
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Título</Label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: Reparar fuga de água"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Categoria</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolher categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreve o serviço, prazos, acessos, detalhes úteis."
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Localidade</Label>
                <Input
                  value={localidade}
                  onChange={(e) => setLocalidade(e.target.value)}
                  placeholder="Ex.: Braga"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Data pretendida</Label>
                <Input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Urgência</Label>
                <Select value={urgencia} onValueChange={setUrgencia}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Orçamento indicativo (opcional)</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={orcamento}
                    onChange={(e) => setOrcamento(e.target.value)}
                    placeholder="Ex.: até 150 €"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Fotografias (opcional)</Label>
              <button
                type="button"
                onClick={() =>
                  toast.info("Anexos em demonstração", {
                    description: "O upload de fotografias ficará disponível quando houver backend.",
                  })
                }
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:bg-muted/40"
              >
                <Image className="size-4" />
                Adicionar fotografias
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" asChild>
            <Link to="/profissionais">Cancelar</Link>
          </Button>
          <Button type="submit">
            <Send className="mr-2 size-4" />
            Enviar pedido
          </Button>
        </div>
      </form>
    </div>
  );
}
