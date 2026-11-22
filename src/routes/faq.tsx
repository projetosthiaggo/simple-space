import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  component: Faq,
});

function Faq() {
  const faqs = [
    {
      pergunta: "Como funciona a ProxiPro AI?",
      resposta:
        "Explica-nos o que precisas. A ProxiPro AI procura profissionais que cumprem os requisitos essenciais (aprovação, serviço compatível, localização e perfil ativo) e mostra-os em ordem de pertinência.",
    },
    {
      pergunta: "Os profissionais apresentados são reais?",
      resposta:
        "Nesta fase, a plataforma apresenta dados de exemplo claramente identificados como tais. Não inventamos avaliações, preços, qualificações ou disponibilidade.",
    },
    {
      pergunta: "O que significa que um pedido é contratado?",
      resposta:
        "Um pedido não significa contratação. A contratação só se considera confirmada depois de o profissional aceitar e o cliente confirmar a proposta.",
    },
    {
      pergunta: "Como posso avaliar um profissional?",
      resposta:
        "Só é possível avaliar quando existir um serviço concluído associado ao pedido. Cada avaliação inclui classificação de 1 a 5 estrelas e comentário opcional.",
    },
    {
      pergunta: "As mensagens são privadas?",
      resposta:
        "Sim. As conversas entre cliente e profissional são privadas e só acessíveis aos participantes e a administradores autorizados em situações justificadas.",
    },
    {
      pergunta: "Existe cobrança nesta fase?",
      resposta:
        "A ProxiPro AI encontra-se em fase de demonstração. Os planos comerciais (Basic, Pro, Premium) estão preparados visualmente, mas não há cobranças efetivas.",
    },
    {
      pergunta: "O assistente de IA está funcional?",
      resposta:
        "Quando a integração real de IA ainda não estiver disponível, a interface indica claramente que é uma funcionalidade de demonstração.",
    },
    {
      pergunta: "O que posso fazer se um profissional não responder ao meu pedido?",
      resposta:
        "Se o profissional recusar ou não responder dentro do prazo configurado, o sistema poderá apresentar o pedido a outro profissional compatível.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Perguntas frequentes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Respostas rápidas às dúvidas mais comuns sobre a ProxiPro AI.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.pergunta} className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold">{f.pergunta}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {f.resposta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
