import { useEffect, useMemo, useRef, useState } from "react";
import {
  Map as MapIcon,
  MapPin,
  Minus,
  Plus,
  LayoutGrid,
  List,
  Search,
  LocateFixed,
  Activity,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  profissionais,
  pedidos,
  categories,
} from "@/data/plataforma";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

type TipoEntidade = "cliente" | "profissional" | "pedido";
type Exibicao = "quadros" | "icones" | "texto";

export interface MapaEntidade {
  id: string;
  tipo: TipoEntidade;
  nome: string;
  localidade: string;
  extra: string;
  detalhes: Record<string, string>;
  estado?: string;
}

// Coordenadas aproximadas das localidades (Portugal continental)
export const COORDENADAS: Record<string, [number, number]> = {
  "Porto": [41.15, -8.61],
  "Braga": [41.55, -8.42],
  "Viana do Castelo": [41.7, -8.83],
  "Aveiro": [40.64, -8.65],
  "Coimbra": [40.21, -8.42],
  "Lisboa": [38.72, -9.14],
  "Santarém": [39.24, -8.69],
  "Évora": [38.57, -7.91],
  "Faro": [37.01, -7.94],
  "Guarda": [41.55, -6.99],
  "Castelo Branco": [40.29, -7.2],
  "Viseu": [40.65, -7.91],
  "Leiria": [39.75, -8.8],
  "Setúbal": [38.53, -8.93],
  "Portalegre": [39.29, -7.43],
  "Beja": [37.99, -8.01],
};

export const CORES_TEMA: Record<TipoEntidade, string> = {
  cliente: "var(--color-chart-1)",
  profissional: "var(--color-chart-2)",
  pedido: "var(--color-chart-3)",
};

export const LENDA: { tipo: TipoEntidade; label: string; cor: string }[] = [
  { tipo: "cliente", label: "Clientes", cor: CORES_TEMA.cliente },
  { tipo: "profissional", label: "Profissionais", cor: CORES_TEMA.profissional },
  { tipo: "pedido", label: "Pedidos", cor: CORES_TEMA.pedido },
];

const CLIENTES_DEMO = [
  { id: "c1", nome: "Ana Silva", localidade: "Lisboa", email: "ana.silva@exemplo.pt" },
  { id: "c2", nome: "João Pereira", localidade: "Porto", email: "joao.pereira@exemplo.pt" },
  { id: "c3", nome: "Miguel Santos", localidade: "Coimbra", email: "miguel.santos@exemplo.pt" },
  { id: "c4", nome: "Rita Ferreira", localidade: "Braga", email: "rita.ferreira@exemplo.pt" },
  { id: "c5", nome: "Paulo Gomes", localidade: "Évora", email: "paulo.gomes@exemplo.pt" },
];

export function pontosIniciais(): MapaEntidade[] {
  const pros: MapaEntidade[] = profissionais.map((p) => ({
    id: p.id,
    tipo: "profissional",
    nome: p.nomeComercial ?? p.nome,
    localidade: p.localidade,
    extra: p.especialidade,
    estado: p.estado,
    detalhes: {
      "Nome completo": p.nome,
      Especialidade: p.especialidade,
      Categoria: categories.find((c) => c.id === p.categoria)?.nome ?? p.categoria,
      Concelho: p.concelho,
      Distrito: p.distrito,
      PrecoIndicativo: p.precoIndicativo ?? "—",
      Estado: p.estado.replace("_", " "),
      Experiencia: p.experienciaAnos ? `${p.experienciaAnos} anos` : "—",
      Disponibilidade: p.disponibilidade ?? "—",
    },
  }));
  const peds: MapaEntidade[] = pedidos.map((d) => ({
    id: d.id,
    tipo: "pedido",
    nome: d.titulo,
    localidade: d.localidade,
    extra: d.categoria,
    estado: d.estado,
    detalhes: {
      Titulo: d.titulo,
      Categoria: categories.find((c) => c.id === d.categoria)?.nome ?? d.categoria,
      Localidade: d.localidade,
      Urgencia: d.urgencia === "alta" ? "Alta" : d.urgencia === "media" ? "Média" : "Baixa",
      Estado: d.estado,
      DataCriacao: d.dataCriacao,
      Orçamento: d.orcamento ?? "—",
      Data: d.data ?? "—",
    },
  }));
  const cls: MapaEntidade[] = CLIENTES_DEMO.map((c) => ({
    id: c.id,
    tipo: "cliente",
    nome: c.nome,
    localidade: c.localidade,
    extra: "Cliente",
    estado: "ativo",
    detalhes: {
      Nome: c.nome,
      Email: c.email,
      Localidade: c.localidade,
      Tipo: "Cliente",
      Estado: "Ativo",
      Registo: "Demonstração",
    },
  }));
  return [...cls, ...pros, ...peds];
}

export interface MapaPlataformaProps {
  /** Altura do mapa em pixels (ou classe CSS). */
  altura?: number | string;
  /** Compacto: oculta a lista e o painel de detalhe (só mapa + mini-lenda). */
  compacto?: boolean;
  /** Permite ao pai selecionar/destacar um registo por ID. */
  selecionadoInicial?: string | null;
  /** Callback quando um registo é clicado no mapa. */
  onSelecionar?: (id: string | null) => void;
}

export function MapaPlataforma({
  altura = 420,
  compacto = false,
  selecionadoInicial = null,
  onSelecionar,
}: MapaPlataformaProps) {
  const [entidades, setEntidades] = useState<MapaEntidade[]>(pontosIniciais);

  // Simulação de atualizações em tempo real: a cada poucos segundos
  // o estado de um registo avança, refletindo-se no mapa em direto.
  useEffect(() => {
    const fluxo: Record<TipoEntidade, string[]> = {
      profissional: ["aprovado", "pendente_aprovação", "em_serviço"],
      pedido: ["novo", "em_andamento", "concluido"],
      cliente: ["ativo"],
    };
    const timer = window.setInterval(() => {
      setEntidades((prev) => {
        if (prev.length === 0) return prev;
        const alvo = prev[Math.floor(Math.random() * prev.length)];
        if (alvo.tipo === "cliente") return prev;
        const sequencia = fluxo[alvo.tipo];
        const indiceAtual = sequencia.indexOf(alvo.estado ?? "");
        const proximo = sequencia[(indiceAtual + 1) % sequencia.length];
        if (proximo === alvo.estado) return prev;
        const atualizado: MapaEntidade = {
          ...alvo,
          estado: proximo,
          detalhes: {
            ...alvo.detalhes,
            Estado: proximo.replace(/_/g, " "),
            "Última atualização": new Date().toLocaleTimeString("pt-PT", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          },
        };
        return prev.map((e) => (e.id === alvo.id ? atualizado : e));
      });
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);
  const [filtros, setFiltros] = useState<Record<TipoEntidade, boolean>>({
    cliente: true,
    profissional: true,
    pedido: true,
  });
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<string | null>(selecionadoInicial);
  const [exibicao, setExibicao] = useState<Exibicao>("quadros");
  const [zoom, setZoom] = useState(6.5);

  const mapRef = useRef<L.Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const visiveis = useMemo(
    () =>
      entidades.filter(
        (e) =>
          filtros[e.tipo] &&
          (busca.trim() === "" ||
            e.nome.toLowerCase().includes(busca.toLowerCase()) ||
            e.localidade.toLowerCase().includes(busca.toLowerCase())),
      ),
    [entidades, filtros, busca],
  );

  const localidadesAtivas = useMemo(
    () => Array.from(new Set(visiveis.map((e) => e.localidade))),
    [visiveis],
  );

  const selecionada = visiveis.find((e) => e.id === selecionado) ?? null;

  // Inicialização do mapa Leaflet
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: [40.2, -8.4],
      zoom,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    const layer = L.layerGroup().addTo(map);
    mapRef.current = map;
    markersLayerRef.current = layer;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Zoom externo controlado pelo botão
  useEffect(() => {
    if (mapRef.current && mapRef.current.getZoom() !== zoom) {
      mapRef.current.setZoom(zoom);
    }
  }, [zoom]);

  // Pontos no mapa
  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (exibicao === "quadros" || exibicao === "texto") {
      localidadesAtivas.forEach((localidade) => {
        const coord = COORDENADAS[localidade];
        if (!coord) return;

        const grupos: { tipo: TipoEntidade; count: number }[] = (
          ["cliente", "profissional", "pedido"] as TipoEntidade[]
        ).map((t) => ({
          tipo: t,
          count: visiveis.filter((e) => e.tipo === t && e.localidade === localidade).length,
        }));

        const html = `<div class="mapa-marker-ciclo">
          <div class="mapa-marker-ciclo-tipo">${grupos
            .filter((g) => g.count > 0)
            .map(
              (g) =>
                `<span class="mapa-marker-ciclo-ponto" style="background:${CORES_TEMA[g.tipo]}"></span>`,
            )
            .join("")}</div>
          <div class="mapa-marker-ciclo-label">${localidade}</div>
        </div>`;

        const marker = L.marker(coord, {
          icon: L.divIcon({
            html,
            className: "",
            iconSize: [96, 44],
            iconAnchor: [48, 22],
          }),
          title: localidade,
        }).bindTooltip(localidade, { direction: "top", offset: [0, -12] });

        marker.on("click", () => {
          const primeiro = visiveis.find((e) => e.localidade === localidade);
          if (primeiro) {
            setSelecionado(primeiro.id);
            onSelecionar?.(primeiro.id);
          }
        });

        layer.addLayer(marker);
      });
    } else {
      visiveis.forEach((e) => {
        const coord = COORDENADAS[e.localidade];
        if (!coord) return;
        const cor = CORES_TEMA[e.tipo];
        const ehSel = e.id === selecionado;
        const tamanho = ehSel ? 40 : 30;
        const labelTipo = LENDA.find((l) => l.tipo === e.tipo)?.label.replace(/s$/, "");

        const nomeSeguro = e.nome.replace(/"/g, "\u0027");
        const html = `<button type="button" class="mapa-icone-ponto ${ehSel ? "mapa-icone-ponto--sel" : ""}" style="background:${cor};width:${tamanho}px;height:${tamanho}px" title="${nomeSeguro}">
          <span class="mapa-icone-ponto-label">${labelTipo}</span>
        </button>`;

        const marker = L.marker(coord, {
          icon: L.divIcon({
            html,
            className: "",
            iconSize: [tamanho, tamanho],
            iconAnchor: [tamanho / 2, tamanho / 2],
          }),
        });

        marker.on("click", () => {
          const prox = ehSel ? null : e.id;
          setSelecionado(prox);
          onSelecionar?.(prox);
        });

        layer.addLayer(marker);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visiveis, exibicao, localidadesAtivas, selecionado]);

  const centrarEmLocalidade = (localidade: string) => {
    const coord = COORDENADAS[localidade];
    if (coord && mapRef.current) {
      mapRef.current.setView(coord, 11);
    }
  };

  return (
    <Card>
      <style>{`
        .mapa-marker-ciclo { display:flex; flex-direction:column; align-items:center; gap:4px; pointer-events:none; }
        .mapa-marker-ciclo-tipo { display:flex; gap:4px; }
        .mapa-marker-ciclo-ponto { width:10px; height:10px; border-radius:999px; border:2px solid var(--color-background); box-shadow:0 2px 6px rgb(0 0 0 / 20%); }
        .mapa-marker-ciclo-label { font-size:10px; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; color:var(--color-muted-foreground); background:color-mix(in srgb, var(--color-background) 85%, transparent); padding:1px 6px; border-radius:999px; }
        .mapa-icone-ponto { display:flex; align-items:center; justify-content:center; border-radius:999px; border:2px solid var(--color-background); box-shadow:0 4px 10px rgb(0 0 0 / 25%); cursor:pointer; transition:transform 0.15s ease; }
        .mapa-icone-ponto:hover { transform:scale(1.1); }
        .mapa-icone-ponto--sel { outline:3px solid var(--color-ring); outline-offset:2px; }
        .mapa-icone-ponto-label { font-size:9px; font-weight:700; color:var(--color-background); }
        .leaflet-container { background:var(--color-muted); }
        .leaflet-tooltip { background:var(--color-popover); border:1px solid var(--color-border); color:var(--color-popover-foreground); font-size:12px; font-weight:500; border-radius:6px; padding:4px 8px; }
        .leaflet-tooltip-top:before { border-top-color:var(--color-popover); }
        .leaflet-control-attribution { font-size:9px; background:color-mix(in srgb, var(--color-background) 80%, transparent); }
      `}</style>
      <CardContent className="p-0">
        {/* Cabeçalho com controles */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={() => setZoom((z) => Math.max(4, +(z - 0.5).toFixed(2)))}
                aria-label="Diminuir zoom"
              >
                <Minus className="size-3.5" />
              </Button>
              <span className="w-14 text-center text-xs font-medium tabular-nums text-muted-foreground">
                Zoom {zoom}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="size-8"
                onClick={() => setZoom((z) => Math.min(15, +(z + 0.5).toFixed(2)))}
                aria-label="Aumentar zoom"
              >
                <Plus className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  mapRef.current?.setView([40.2, -8.4], 6.5);
                  setZoom(6.5);
                }}
              >
                <LocateFixed className="mr-1 size-3.5" />
                Portugal
              </Button>
            </div>
            <div className="flex items-center gap-1.5">
              {(
                [
                  ["quadros", LayoutGrid, "Ciclo"],
                  ["icones", MapPin, "Ícones"],
                  ["texto", List, "Texto"],
                ] as [Exibicao, typeof LayoutGrid, string][]
              ).map(([id, Icone, label]) => (
                <Button
                  key={id}
                  size="sm"
                  variant={exibicao === id ? "default" : "ghost"}
                  onClick={() => setExibicao(id)}
                >
                  <Icone className="mr-1 size-3.5" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!compacto && (
              <div className="flex items-center gap-2">
                <Search className="size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Procurar no mapa…"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="h-8 w-40 text-sm"
                />
              </div>
            )}
            {LENDAS().map((l) => (
              <button
                key={l.tipo}
                onClick={() => setFiltros((f) => ({ ...f, [l.tipo]: !f[l.tipo] }))}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                  filtros[l.tipo]
                    ? "bg-muted text-foreground"
                    : "opacity-40 line-through"
                }`}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: l.cor }}
                />
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mapa em tempo real */}
        <div className="relative w-full" style={{ height: compacto ? 320 : altura }}>
          <div ref={mapDivRef} className="absolute inset-0 z-0" />
          {visiveis.length === 0 && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <p className="rounded-lg bg-background/90 px-4 py-2 text-sm shadow">
                Sem registos correspondentes aos filtros.
              </p>
            </div>
          )}
        </div>

        {/* Faixa de estado em tempo real (compacto) */}
        {compacto && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="size-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">
                    Atividade em tempo real
                  </h3>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    Em direto
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {visiveis.length} registos em {localidadesAtivas.length}{" "}
                  localidades · atualiza a cada 4s
                </p>
              </div>
            </div>
            {selecionada ? (
              <button
                onClick={() => {
                  setSelecionado(null);
                  onSelecionar?.(null);
                }}
                className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5 text-xs transition hover:bg-muted"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: CORES_TEMA[selecionada.tipo] }}
                />
                {selecionada.nome}
                <X className="size-3" />
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapIcon className="size-3.5" />
                Clica num ponto para ver o registo
              </span>
            )}
          </div>
        )}

        {/* Painel lateral (só em modo completo) */}
        {!compacto && selecionada && (
          <div className="border-t p-4">
            <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-4">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: CORES_TEMA[selecionada.tipo] }}
              >
                <MapPin className="size-5 text-white" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="truncate font-semibold">{selecionada.nome}</h4>
                  <button
                    onClick={() => {
                      setSelecionado(null);
                      onSelecionar?.(null);
                    }}
                    className="rounded p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Fechar"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selecionada.localidade} · {selecionada.extra}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                  {Object.entries(selecionada.detalhes)
                    .slice(0, 6)
                    .map(([k, v]) => (
                      <div key={k} className="rounded-lg bg-background p-2">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="font-medium capitalize">{v}</dd>
                      </div>
                    ))}
                </dl>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => centrarEmLocalidade(selecionada.localidade)}
                  >
                    <MapPin className="mr-1 size-3.5" />
                    Centrar no mapa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LENDAS() {
  return LENDA;
}
