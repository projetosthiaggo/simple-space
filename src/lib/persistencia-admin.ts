import type { CategoryId } from "@/data/plataforma";

/**
 * Persistência local para as abas do painel de administração
 * ("Editar página inicial" e "Divulgação").
 *
 * Como o projeto não tem um backend ligado, os dados vivem em memória
 * (estado React) e são perdidos ao recarregar. Este módulo liga essas
 * abas ao `localStorage` para que as alterações persistam entre visitas.
 *
 * As chaves têm prefixo "proxipro:" para não colidir com outras.
 */

const CHAVE_PAGINA = "proxipro:pagina-inicial";
const CHAVE_BANNERS = "proxipro:banners";

export interface ConteudoPaginaInicial {
  heroTitulo: string;
  heroSubtitulo: string;
  heroDescricao: string;
  secTitulo: string;
  secApoio: string;
  ordemCategorias: CategoryId[];
  ordemBeneficios: string[];
}

export type TamanhoBanner = "pequeno" | "medio" | "grande";

export interface Banner {
  id: string;
  titulo: string;
  texto: string;
  tamanho: TamanhoBanner;
  inicio: string;
  termino: string;
  vezes: number;
  imagem: string | null;
}

// Valores por omissão (iguais aos iniciais que a UI já usava)
export const PAGINA_INICIAL_PADRAO: ConteudoPaginaInicial = {
  heroTitulo: "Encontra o profissional certo.",
  heroSubtitulo: "Sem complicações.",
  heroDescricao:
    "Explica-nos o que precisas. A ProxiPro AI ajuda-te a encontrar profissionais adequados à tua necessidade.",
  secTitulo: "És profissional? Encontra novos clientes.",
  secApoio:
    "Cria o teu perfil, apresenta os teus serviços e recebe oportunidades de trabalho.",
  ordemCategorias: [],
  ordemBeneficios: [
    "Perfil profissional com portefólio",
    "Receção de pedidos de clientes",
    "Mensagens e propostas",
    "Estatísticas do teu perfil",
    "Disponibilidade à medida",
    "Avaliações reais",
  ],
};

export const BANNERS_PADRAO: Banner[] = [
  {
    id: "b1",
    titulo: "Promoção de verão",
    texto: "Regista-te e ganha 10% de desconto",
    tamanho: "pequeno",
    inicio: "",
    termino: "",
    vezes: 0,
    imagem: null,
  },
  {
    id: "b2",
    titulo: "Novo plano Premium",
    texto: "Ferramentas avançadas de IA",
    tamanho: "grande",
    inicio: "",
    termino: "",
    vezes: 3,
    imagem: null,
  },
];

function podeUsarStorage(): boolean {
  return typeof localStorage !== "undefined";
}

export function lerPaginaInicial(): ConteudoPaginaInicial {
  if (!podeUsarStorage()) return PAGINA_INICIAL_PADRAO;
  try {
    const bruto = localStorage.getItem(CHAVE_PAGINA);
    if (!bruto) return PAGINA_INICIAL_PADRAO;
    const lido = JSON.parse(bruto) as Partial<ConteudoPaginaInicial>;
    return { ...PAGINA_INICIAL_PADRAO, ...lido };
  } catch {
    return PAGINA_INICIAL_PADRAO;
  }
}

export function gravarPaginaInicial(
  conteudo: ConteudoPaginaInicial,
): ConteudoPaginaInicial {
  if (podeUsarStorage()) {
    try {
      localStorage.setItem(CHAVE_PAGINA, JSON.stringify(conteudo));
    } catch {
      // Quota cheia ou storage indisponível: mantém apenas em memória.
    }
  }
  return conteudo;
}

export function lerBanners(): Banner[] {
  if (!podeUsarStorage()) return BANNERS_PADRAO;
  try {
    const bruto = localStorage.getItem(CHAVE_BANNERS);
    if (!bruto) return BANNERS_PADRAO;
    const lido = JSON.parse(bruto) as Banner[];
    return Array.isArray(lido) ? lido : BANNERS_PADRAO;
  } catch {
    return BANNERS_PADRAO;
  }
}

export function gravarBanners(banners: Banner[]): Banner[] {
  if (podeUsarStorage()) {
    try {
      localStorage.setItem(CHAVE_BANNERS, JSON.stringify(banners));
    } catch {
      // Quota cheia ou storage indisponível: mantém apenas em memória.
    }
  }
  return banners;
}
