import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/privacidade")({
  component: Privacidade,
});

function Privacidade() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Voltar ao início
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Política de privacidade</h1>
      <p className="mt-2 text-muted-foreground">
        Documento de demonstração. A política completa será publicada antes da
        disponibilização de serviços reais, em conformidade com o RGPD.
      </p>

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-4 text-accent-2" /> Dados recolhidos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Quando crias uma conta, recolhemos apenas os dados necessários para
            prestar o serviço: nome, email, palavra-passe (criptografada) e, no
            caso de profissionais, os dados do perfil de serviços.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Utilização dos dados</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Os dados são utilizados para ligar clientes a profissionais,
            gerir pedidos e mensagens e melhorar a plataforma. Não vendemos
            dados pessoais a terceiros.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Os teus direitos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Tens o direito de aceder, retificar ou eliminar os teus dados, de
            te opores ao tratamento e de apresentar reclamação junto da
            autoridade de controlo. Contacta-nos para exercer estes direitos.
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Contacto</h2>
        <Card>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Mail className="size-4 text-accent-2" />
              privacidade@proxipro-ai.pt (exemplo)
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-accent-2" />
              Portugal
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button asChild variant="outline" size="sm">
          <Link to="/termos">Ver termos e condições</Link>
        </Button>
      </div>
    </div>
  );
}
