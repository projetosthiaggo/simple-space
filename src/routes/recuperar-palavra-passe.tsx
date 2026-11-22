import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/recuperar-palavra-passe")({
  component: Recuperar,
});

function Recuperar() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 md:px-6">
      <Link to="/entrar" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Voltar ao login
      </Link>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-accent-2/15 text-accent-2">
          <KeyRound className="size-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Recuperar palavra-passe
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Indica o email da tua conta e enviaremos um link seguro de
          redefinição.
        </p>
      </div>
      <Card className="p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Instruções enviadas", {
              description: "Verifica a tua caixa de entrada (e o spam).",
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" required placeholder="tu@exemplo.pt" />
          </div>
          <Button type="submit" className="w-full">
            Enviar link de redefinição
          </Button>
        </form>
      </Card>
    </div>
  );
}
