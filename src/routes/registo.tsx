import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Lock,
  Mail,
  Building2,
  Briefcase,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { categorias } from "@/data/plataforma";

export const Route = createFileRoute("/registo")({
  component: Registo,
  validateSearch: (search: Record<string, unknown>): { tipo?: string } =>
    typeof search["tipo"] === "string" ? { tipo: search["tipo"] } : {},
});

function Registo() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [tipo, setTipo] = useState<"cliente" | "profissional">(
    search.tipo === "profissional" ? "profissional" : "cliente"
  );

  function submeter(ev: React.FormEvent) {
    ev.preventDefault();
    localStorage.setItem("pp-ai-tipo", tipo);
    toast.success(
      tipo === "cliente"
        ? "Conta de cliente criada (demonstração)"
        : "Pedido de registo profissional enviado (demonstração)",
      {
        description:
          tipo === "profissional"
            ? "O perfil será analisado por um administrador antes de ficar visível na pesquisa. A tua sessão profissional já está ativa nesta navegação."
            : "Podes já começar a procurar profissionais. A tua sessão de cliente já está ativa nesta navegação.",
      }
    );
    navigate({
      to:
        tipo === "cliente" ? "/painel-cliente" : "/painel-profissional",
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Voltar ao início
      </Link>
      <h1 className="text-3xl font-bold tracking-tight">Criar conta</h1>
      <p className="mt-2 text-muted-foreground">
        Escolhe o tipo de conta que queres criar.
      </p>

      <Tabs
        value={tipo}
        onValueChange={(v) => setTipo(v as "cliente" | "profissional")}
        className="mt-6"
      >
        <TabsList>
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="profissional">Profissional</TabsTrigger>
        </TabsList>

        <TabsContent value="cliente" className="mt-6">
          <Card className="space-y-4 p-6">
            <form onSubmit={submeter} className="space-y-4">
              <CampoIcone icone={<User className="size-4" />} rotulo="Nome completo" placeholder="Ex.: Ana Silva" required />
              <CampoIcone icone={<Mail className="size-4" />} rotulo="Email" placeholder="ana@exemplo.pt" type="email" required />
              <CampoIcone icone={<Lock className="size-4" />} rotulo="Palavra-passe" placeholder="Mínimo 8 caracteres" type="password" required />

              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" required className="mt-1 size-4 rounded border-input" />
                <span>
                  Aceito os{" "}
                  <Link
                    to="/termos"
                    className="text-accent-2 hover:underline"
                  >
                    termos e condições
                  </Link>
                  e a{" "}
                  <Link
                    to="/privacidade"
                    className="text-accent-2 hover:underline"
                  >
                    política de privacidade
                  </Link>
                  .
                </span>
              </label>

              <Button type="submit" className="w-full">
                Criar conta de cliente
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="profissional" className="mt-6">
          <Card className="space-y-4 p-6">
            <form onSubmit={submeter} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoIcone icone={<User className="size-4" />} rotulo="Nome" placeholder="Ex.: João Santos" required />
                <CampoIcone icone={<Building2 className="size-4" />} rotulo="Nome comercial (opcional)" placeholder="Ex.: Santos & Filhos Lda" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoIcone icone={<Mail className="size-4" />} rotulo="Email" placeholder="joao@exemplo.pt" type="email" required />
                <CampoIcone icone={<Phone className="size-4" />} rotulo="Contacto (opcional)" placeholder="+351 …" />
              </div>
              <CampoIcone icone={<Lock className="size-4" />} rotulo="Palavra-passe" placeholder="Mínimo 8 caracteres" type="password" required />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Categoria principal</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolher" />
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
                <div className="space-y-1.5">
                  <Label>Localização / concelho</Label>
                  <Input placeholder="Ex.: Braga" />
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" required className="mt-1 size-4 rounded border-input" />
                <span>
                  Aceito os{" "}
                  <Link to="/termos" className="text-accent-2 hover:underline">
                    termos e condições
                  </Link>{" "}
                  e a{" "}
                  <Link to="/privacidade" className="text-accent-2 hover:underline">
                    política de privacidade
                  </Link>
                  . O perfil fica visível só após aprovação.
                </span>
              </label>

              <Button type="submit" className="w-full">
                <Briefcase className="mr-2 size-4" />
                Criar conta profissional
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tens conta?{" "}
        <Link to="/entrar" className="font-medium text-accent-2 hover:underline">
          Inicia sessão
        </Link>
      </p>
    </div>
  );
}

function CampoIcone({
  icone,
  rotulo,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icone: React.ReactNode;
  rotulo: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{rotulo}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icone}
        </span>
        <Input className="pl-10" {...props} />
      </div>
    </div>
  );
}
