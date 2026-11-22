import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const original = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...original,
    Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  };
});

vi.mock("@/components/mapa-plataforma", () => ({ MapaPlataforma: () => null }));
vi.mock("@/components/ui/chart", () => ({
  ChartContainer: () => null,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
  ChartLegend: () => null,
  ChartLegendContent: () => null,
}));

import { Route } from "@/routes/admin";

const Admin = Route.options.component;
if (!Admin) throw new Error("Admin route component is missing");

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("Admin hook order", () => {
  it("can leave and return to the summary without changing its hooks", () => {
    localStorage.setItem("pp-ai-tipo", "admin");
    render(<Admin />);

    fireEvent.click(screen.getByRole("button", { name: "Profissionais" }));
    fireEvent.click(screen.getByRole("button", { name: "Pedidos" }));
    fireEvent.click(screen.getByRole("button", { name: "Resumo" }));
    expect(screen.getAllByLabelText(/^Reordenar /)).toHaveLength(8);
  });

  it("keeps the same hooks when the access guard changes", () => {
    localStorage.setItem("pp-ai-tipo", "admin");
    const view = render(<Admin />);
    localStorage.removeItem("pp-ai-tipo");
    expect(() => view.rerender(<Admin />)).not.toThrow();
    localStorage.setItem("pp-ai-tipo", "admin");
    expect(() => view.rerender(<Admin />)).not.toThrow();
    expect(screen.getAllByLabelText(/^Reordenar /)).toHaveLength(8);
  });
});