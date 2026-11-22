export type CategoryId =
  | "reparacoes"
  | "canalizacao"
  | "eletricidade"
  | "limpeza"
  | "jardinagem"
  | "pintura"
  | "mudancas"
  | "informatica"
  | "design"
  | "marketing"
  | "fotografia"
  | "formacao"
  | "consultoria"
  | "eventos"
  | "beleza"
  | "outros";

export interface Category {
  id: CategoryId;
  nome: string;
  icone: string; // nome do icone lucide-react
  descricao: string;
}

export const categories: Category[] = [
  { id: "reparacoes", nome: "Reparações e bricolage", icone: "Wrench", descricao: "Reparações domésticas e pequenas obras" },
  { id: "canalizacao", nome: "Canalização", icone: "Droplets", descricao: "Fugas, instalações e manutenção de água" },
  { id: "eletricidade", nome: "Eletricidade", icone: "Zap", descricao: "Instalações, avarias e certificação" },
  { id: "limpeza", nome: "Limpeza", icone: "Sparkles", descricao: "Limpeza doméstica, profissional e pós-obras" },
  { id: "jardinagem", nome: "Jardinagem", icone: "Leaf", descricao: "Jardins, relva e espaços verdes" },
  { id: "pintura", nome: "Pintura", icone: "Paintbrush", descricao: "Pintura interior e exterior" },
  { id: "mudancas", nome: "Mudanças e transportes", icone: "Truck", descricao: "Mudanças, transportes e montagem de móveis" },
  { id: "informatica", nome: "Informática e tecnologia", icone: "Monitor", descricao: "Suporte, equipamentos e desenvolvimento" },
  { id: "design", nome: "Design gráfico", icone: "Palette", descricao: "Identidade visual e design" },
  { id: "marketing", nome: "Marketing digital", icone: "TrendingUp", descricao: "Presença online e campanhas" },
  { id: "fotografia", nome: "Fotografia e vídeo", icone: "Camera", descricao: "Fotografia, vídeo e produção" },
  { id: "formacao", nome: "Explicações e formação", icone: "GraduationCap", descricao: "Aulas, cursos e formação profissional" },
  { id: "consultoria", nome: "Consultoria empresarial", icone: "Briefcase", descricao: "Consultoria e apoio às empresas" },
  { id: "eventos", nome: "Eventos", icone: "CalendarHeart", descricao: "Organização e produção de eventos" },
  { id: "beleza", nome: "Beleza e bem-estar", icone: "Scissors", descricao: "Cabelo, estética e bem-estar" },
  { id: "outros", nome: "Outros serviços", icone: "MoreHorizontal", descricao: "Todos os outros serviços" },
];
// Alias pt-PT usado pelas rotas (import { categorias } from "@/data/plataforma")
export const categorias = categories;


export interface Profissional {
  id: string;
  nome: string;
  nomeComercial?: string;
  especialidade: string;
  categoria: CategoryId;
  servicos: string[];
  localidade: string;
  distrito: string;
  concelho: string;
  precoIndicativo?: string;
  avaliacao?: number;
  numeroAvaliacoes: number;
  disponibilidade?: string;
  experienciaAnos?: number;
  estado: "aprovado" | "em_analise" | "pendente" | "suspenso";
  descricao: string;
  exemplo: boolean;
}

export interface Pedido {
  id: string;
  titulo: string;
  categoria: CategoryId;
  descricao: string;
  localidade: string;
  data?: string;
  urgencia: "baixa" | "media" | "alta";
  orcamento?: string;
  estado: "novo" | "pendente" | "aceite" | "recusado" | "proposta" | "contratado" | "concluido";
  dataCriacao: string;
  exemplo: boolean;
}

export const profissionais: Profissional[] = [
  {
    id: "p1",
    nome: "Carlos Mendes",
    especialidade: "Canalização residencial",
    categoria: "canalizacao",
    servicos: ["Reparação de fugas", "Instalação de autoclismo", "Desentupimentos"],
    localidade: "Braga",
    distrito: "Braga",
    concelho: "Braga",
    precoIndicativo: "A partir de 30 €/hora",
    avaliacao: 4.8,
    numeroAvaliacoes: 0,
    disponibilidade: "Esta semana",
    experienciaAnos: 12,
    estado: "aprovado",
    descricao:
      "Canalizador com 12 anos de experiência em residências. Atendo Braga e concelhos vizinhos. (Exemplo demonstrativo)",
    exemplo: true,
  },
  {
    id: "p2",
    nome: "Sofia Almeida",
    nomeComercial: "Sofia Almeida Design",
    especialidade: "Design de interiores e pintura",
    categoria: "pintura",
    servicos: ["Pintura interior", "Planeamento de espaços", "Restaurações"],
    localidade: "Porto",
    distrito: "Porto",
    concelho: "Vila Nova de Gaia",
    precoIndicativo: "Preços consoante projecto",
    avaliacao: 5,
    numeroAvaliacoes: 0,
    disponibilidade: "Agenda aberta",
    experienciaAnos: 8,
    estado: "aprovado",
    descricao:
      "Especialista em pintura e renovação de interiores. (Exemplo demonstrativo)",
    exemplo: true,
  },
  {
    id: "p3",
    nome: "Ricardo Silva",
    especialidade: "Informática e suporte técnico",
    categoria: "informatica",
    servicos: ["Reparação de computadores", "Instalação de redes", "Apoio remoto"],
    localidade: "Lisboa",
    distrito: "Lisboa",
    concelho: "Lisboa",
    precoIndicativo: "A partir de 25 €/hora",
    avaliacao: 4.5,
    numeroAvaliacoes: 0,
    disponibilidade: "Seg a Sex",
    experienciaAnos: 6,
    estado: "em_analise",
    descricao:
      "Técnico de informática, apoio a casas e pequenas empresas. (Exemplo demonstrativo)",
    exemplo: true,
  },
  {
    id: "p4",
    nome: "Marta Costa",
    especialidade: "Limpeza profissional",
    categoria: "limpeza",
    servicos: ["Limpeza doméstica", "Pós-obra", "Limpeza de vidros"],
    localidade: "Coimbra",
    distrito: "Coimbra",
    concelho: "Coimbra",
    precoIndicativo: "A partir de 15 €/hora",
    avaliacao: 4.9,
    numeroAvaliacoes: 0,
    disponibilidade: "Todo o dia",
    experienciaAnos: 10,
    estado: "aprovado",
    descricao:
      "Serviços de limpeza com material próprio, para casas e escritórios. (Exemplo demonstrativo)",
    exemplo: true,
  },
];

export const pedidos: Pedido[] = [
  {
    id: "d1",
    titulo: "Reparar fuga de água na cozinha",
    categoria: "canalizacao",
    descricao: "Fuga debaixo da lavagem, precisa de intervenção esta semana.",
    localidade: "Braga",
    data: "Esta semana",
    urgencia: "alta",
    estado: "pendente",
    dataCriacao: "Há 2 dias",
    exemplo: true,
  },
];

export const distritos: string[] = [
  "Aveiro", "Beja", "Braga", "Braga", "Castelo Branco", "Coimbra", "Évora",
  "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém",
  "Setúbal", "Viana do Castelo", "Vila Real", "Viseu",
  "Açores", "Madeira",
];

export const planos = [
  {
    nome: "Basic",
    preco: "14,90 €",
    periodo: "/mês",
    destaque: false,
    recursos: [
      "Perfil profissional",
      "Presença na pesquisa",
      "Receção de pedidos",
      "Estatísticas básicas",
    ],
  },
  {
    nome: "Pro",
    preco: "29,90 €",
    periodo: "/mês",
    destaque: true,
    recursos: [
      "Tudo do Basic",
      "Maior capacidade de apresentação",
      "Ferramentas inteligentes",
      "Estatísticas avançadas",
    ],
  },
  {
    nome: "Premium",
    preco: "49,90 €",
    periodo: "/mês",
    destaque: false,
    recursos: [
      "Tudo do Pro",
      "Ferramentas avançadas de IA",
      "Maior destaque comercial, sujeito a regras transparentes",
      "Estatísticas completas",
    ],
  },
];
