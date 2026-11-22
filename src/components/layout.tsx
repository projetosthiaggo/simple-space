import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Menu, X, Facebook, Instagram, Linkedin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Início", to: "/" },
  { label: "Encontrar profissionais", to: "/profissionais" },
  { label: "Categorias", to: "/categorias" },
  { label: "Como funciona", to: "/como-funciona" },
  { label: "Para profissionais", to: "/para-profissionais" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-5" aria-hidden />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            ProxiPro <span className="text-accent-2">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/entrar">Entrar</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/registo">Criar conta</Link>
          </Button>
        </div>

        <button
          className="inline-flex size-10 items-center justify-center rounded-md text-foreground lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-background px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/entrar" onClick={() => setOpen(false)}>
                  Entrar
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to="/registo" onClick={() => setOpen(false)}>
                  Criar conta
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-4" aria-hidden />
              </div>
              <span className="font-semibold">ProxiPro AI</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Encontra o profissional certo, de forma inteligente, rápida e
              segura.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/como-funciona" className="hover:text-foreground">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link to="/profissionais" className="hover:text-foreground">
                  Encontrar profissionais
                </Link>
              </li>
              <li>
                <Link to="/para-profissionais" className="hover:text-foreground">
                  Para profissionais
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-foreground">
                  Administração
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/termos" className="hover:text-foreground">
                  Termos e condições
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="hover:text-foreground">
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link to="/reclamacoes" className="hover:text-foreground">
                  Livro de reclamações
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Apoio</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/faq" className="hover:text-foreground">
                  Perguntas frequentes
                </Link>
              </li>
              <li>
                <Link to="/contactos" className="hover:text-foreground">
                  Contactos
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com" target="_blank" rel="noreferrer"
              aria-label="Facebook"
              className="rounded-lg border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Facebook className="size-4" />
            </a>
            <a
              href="https://instagram.com" target="_blank" rel="noreferrer"
              aria-label="Instagram"
              className="rounded-lg border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://linkedin.com" target="_blank" rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-lg border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Linkedin className="size-4" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ProxiPro AI — Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
