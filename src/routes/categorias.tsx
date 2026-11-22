import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wrench,
  Droplets,
  Zap,
  Sparkles,
  Leaf,
  Paintbrush,
  Truck,
  Monitor,
  Palette,
  TrendingUp,
  Camera,
  GraduationCap,
  Briefcase,
  CalendarHeart,
  Scissors,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/plataforma";

export const Route = createFileRoute("/categorias")({
  component: Categorias,
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, Droplets, Zap, Sparkles, Leaf, Paintbrush, Truck, Monitor,
  Palette, TrendingUp, Camera, GraduationCap, Briefcase, CalendarHeart,
  Scissors, MoreHorizontal,
};

function Categorias() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Categorias de serviços
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          As categorias podem ser ampliadas pela equipa de administração.
          Nesta fase de demonstração, a lista abaixo é o catálogo inicial.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icone] ?? MoreHorizontal;
          return (
            <Link key={cat.id} to="/profissionais" search={{ categoria: cat.id }}>
              <Card className="h-full p-4 transition-colors hover:bg-accent">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cat.nome}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {cat.descricao}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}

        <Card className="flex flex-col items-center justify-center border-dashed p-6 text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Plus className="size-5" />
          </div>
          <h3 className="font-semibold">Nova categoria</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Categorias são geridas pelo painel de administração e podem ser
            ampliadas a qualquer momento.
          </p>
        </Card>
      </div>
    </div>
  );
}
