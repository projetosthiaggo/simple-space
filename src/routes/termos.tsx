import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, ScrollText, Book, MessageSquareWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/termos")({
  component: Termos,
});

function Termos() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Voltar ao início
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Termos e condições</h1>
      <p className="mt-2 text-muted-foreground">
        Documento de demonstração. Os termos definitivos serão publicados
        antes da disponibilização de serviços reais.
      </p>
      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4 text-accent-2" /> Utilização da plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            A ProxiPro AI liga clientes a profissionais e prestadores de
            serviços em Portugal. O registo como cliente é gratuito. O
            registo profissional está sujeito a análise e aprovação por parte
            dos administradores.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pedidos e contratação</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Um pedido de serviço não constitui contratação confirmada. A
            contratação só se considera efetiva após o profissional aceitar o
            pedido e o cliente confirmar a respetiva proposta.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Comportamento na plataforma</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Os participantes devem manter um comportamento respeitoso.
            Avaliações, mensagens e conteúdos inapropriados podem ser
            denunciados e sujeitos a moderação.
          </CardContent>
        </Card>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="outline" size="sm">
          <Link to="/privacidade">
            <ScrollText className="mr-2 size-4" /> Política de privacidade
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/reclamacoes">
            <MessageSquareWarning className="mr-2 size-4" /> Livro de reclamações
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/faq">
            <Book className="mr-2 size-4" /> Perguntas frequentes
          </Link>
        </Button>
      </div>
    </div>
  );
}
