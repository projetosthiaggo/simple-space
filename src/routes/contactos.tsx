import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/contactos")({
  component: Contactos,
});

function Contactos() {
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Voltar ao início
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
        <p className="mt-2 text-muted-foreground">
          Fala connosco. Responderemos no prazo mais breve possível.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent-2/15 text-accent-2">
                <Mail className="size-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p>ola@proxipro-ai.pt (exemplo)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent-2/15 text-accent-2">
                <MapPin className="size-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">Localização</p>
                <p>Portugal — atuação nacional</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent-2/15 text-accent-2">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">Horário de apoio</p>
                <p>Segunda a sexta, 9h–18h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Envia-nos uma mensagem</CardTitle>
          </CardHeader>
          <CardContent>
            {enviado ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 className="size-10 text-green-600" />
                <p className="text-sm font-medium">Mensagem enviada. Obrigado!</p>
                <p className="text-xs text-muted-foreground">
                  Responderemos pelo email indicado. (Demonstração)
                </p>
                <Button variant="outline" size="sm" onClick={() => setEnviado(false)}>
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEnviado(true);
                  toast.success("Mensagem enviada", {
                    description: "Obrigado pelo contacto.",
                  });
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label>Nome</Label>
                  <Input required placeholder="O teu nome" />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" required placeholder="tu@exemplo.pt" />
                </div>
                <div className="space-y-1.5">
                  <Label>Mensagem</Label>
                  <Textarea required rows={4} placeholder="Como podemos ajudar?" />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 size-4" />
                  Enviar mensagem
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
