import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type TipoConta = "cliente" | "profissional" | "admin" | null;

function tipoSessao(): TipoConta {
  if (typeof localStorage === "undefined") return null;
  const v = localStorage.getItem("pp-ai-tipo");
  return v === "cliente" || v === "profissional" || v === "admin" ? v : null;
}

export const Route = createFileRoute("/entrar")({
  component: Entrar,
});

function Entrar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const tipoAtual = tipoSessao();

  function submeter(ev: React.FormEvent) {
    ev.preventDefault();
    const tipo: TipoConta = email.toLowerCase().startsWith("admin")
      ? "admin"
      : pass.length > 8 && email.includes(".pt")
        ? "profissional"
        : "cliente";
    localStorage.setItem("pp-ai-tipo", tipo);
    toast.success(
      tipo === "admin"
        ? "Sessão de administrador iniciada (demonstração)"
        : tipo === "profissional"
          ? "Sessão profissional iniciada (demonstração)"
          : "Sessão de cliente iniciada (demonstração)",
      {
        description:
          "Os dados são guardados apenas nesta navegação. Não armazenas palavras-passe em texto simples.",
      }
    );
    navigate({
      to:
        tipo === "admin"
          ? "/admin"
          : tipo === "profissional"
            ? "/painel-profissional"
            : "/painel-cliente",
    });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:px-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Voltar ao início
      </Link>

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Iniciar sessão</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bem-vindo de volta à ProxiPro AI.
        </p>
      </div>

      <Card className="space-y-4 p-6">
        <form onSubmit={submeter} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@exemplo.pt"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Palavra-passe</Label>
              <Link
                to="/recuperar-palavra-passe"
                className="text-xs text-accent-2 hover:underline"
              >
                Esqueci-me
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                type="password"
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </Card>

      {tipoAtual && (
        <div className="mt-4 space-y-2 rounded-lg border bg-card p-4 text-sm">
          <p className="font-medium">
            Sessão ativa (demonstração):{" "}
            <span className="text-accent-2">
              {tipoAtual === "admin"
                ? "administrador"
                : tipoAtual === "profissional"
                  ? "profissional"
                  : "cliente"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("pp-ai-tipo");
                window.location.href = "/";
              }}
            >
              Terminar sessão
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/" })}
            >
              Ir ao início
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        Nesta fase de demonstração, a autenticação é simulada no
        navegador. A proteção de páginas privadas e as permissões por tipo
        de utilizador serão ativadas quando houver um backend real.
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tens conta?{" "}
        <Link to="/registo" className="font-medium text-accent-2 hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
