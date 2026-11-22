import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MessageSquareWarning, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/reclamacoes")({
  component: Reclamacoes,
});

function Reclamacoes() {
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Voltar ao início
      </Link>
      <div className="mb-6">
        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-accent-2/15 text-accent-2">
          <MessageSquareWarning className="size-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Livro de reclamações</h1>
        <p className="mt-2 text-muted-foreground">
          Podes apresentar aqui reclamações ou sugestões sobre a ProxiPro AI.
          Cada reclamação tem um número de registo.
        </p>
      </div>

      {enviado ? (
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <CheckCircle2 className="size-10 text-green-600" />
          <h2 className="text-lg font-semibold">Reclamação registada</h2>
          <p className="text-sm text-muted-foreground">
            Número de registo: <span className="font-mono">LR-{new Date().getFullYear()}-0001</span>.
            Serás contactado no prazo de 15 dias úteis. (Demonstração)
          </p>
          <Button variant="outline" size="sm" onClick={() => setEnviado(false)}>
            Registar nova reclamação
          </Button>
        </Card>
      ) : (
        <Card className="space-y-4 p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEnviado(true);
              toast.success("Reclamação registada", {
                description: "Guarda o número de registo para referência.",
              });
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input required placeholder="O teu nome" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" required placeholder="tu@exemplo.pt" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Motivo</Label>
              <Input required placeholder="Ex.: experiência de utilização, profissional, pedido" />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Textarea
                required
                rows={5}
                placeholder="Descreve a tua reclamação com o máximo de pormenor."
              />
            </div>
            <Button type="submit" className="w-full">
              <Send className="mr-2 size-4" />
              Enviar reclamação
            </Button>
          </form>
        </Card>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Demonstração: os formulários ainda não enviam dados reais. O livro de
        reclamações será disponibilizado com registo efetivo numa fase futura.
      </p>
    </div>
  );
}
