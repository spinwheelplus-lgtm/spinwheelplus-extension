import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const PT_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "Para que serve esta roleta",
  featuresLead:
    "Você monta esta roleta aqui, do lado da página que está aberta. Coloca os nomes, muda a cor, liga o som e gira. A lista fica neste aparelho. Para mandar um link, colocar a roleta numa página ou guardar na sua conta, abra a página de edição no SpinWheelPlus.",
  features: [
    {
      id: "weighted-slices",
      title: "A fatia maior sai mais",
      desc: "Se uma opção deve sair mais vezes, aumente o peso. A fatia mais larga tem mais chance. A foto entra em Um por um. Se as fatias não forem iguais, avise antes.",
    },
    {
      id: "images-themes",
      title: "Fotos e cores",
      desc: "Escolha as cores, a borda, o centro e o título. Cole uma foto numa fatia. O fundo da página e o Unsplash ficam na página de edição do site.",
    },
    {
      id: "sounds-winner",
      title: "Som e o quadro do resultado",
      desc: "Pode tocar som ao girar e quando sai um nome. Quando para, dá para soltar confete ou fogos. Feche o quadro, ou tire o nome que saiu, para o próximo giro trazer outro.",
    },
    {
      id: "entries-history",
      title: "Lista e histórico",
      desc: "Dá para mudar várias linhas de uma vez, ou um nome de cada vez. Embaralhe, ordene ou apague. O histórico fica neste aparelho.",
    },
    {
      id: "beside-tab",
      title: "Girar do lado da página aberta",
      desc: "Deixe o Docs, o Meet ou a página da aula abertos, e gire aqui. Clique na roleta ou aperte Space.",
    },
    {
      id: "full-editor",
      title: "Link, página e conta",
      desc: "Abra a página de edição no SpinWheelPlus para copiar o link, colocar a roleta numa página, pôr um fundo ou guardar na sua conta.",
    },
    {
      id: "fairness-audit",
      title: "Dá para conferir se é ao acaso",
      desc: "Cada giro usa crypto.getRandomValues() neste navegador. A página de teste publica uma amostra de 111 nomes, 10.000 giros (4 vezes) e um teste de qui-quadrado conforme o tamanho da roleta.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "página de teste",
      linkTitle: "Abrir a página de teste do SpinWheelPlus",
    },
  ],
  faqHeading: "Perguntas frequentes",
  faqs: [
    {
      question: "O SpinWheelPlus é grátis?",
      answer:
        "Sim, no uso normal: esta extensão e o editor do site. Se um dia existir algo pago, será opcional. O primeiro giro de teste não fica atrás de pagamento.",
    },
    {
      question: "Preciso de conta para girar?",
      answer:
        "Não. A extensão abre e guarda a roleta neste aparelho. Entre no SpinWheelPlus quando quiser guardar roletas na conta.",
    },
    {
      question: "A roleta sai mesmo ao acaso?",
      answer:
        "Cada giro usa crypto.getRandomValues() neste navegador, não um número escolhido na mão. Se quiser ver milhares de giros no seu aparelho, abra a página de teste. Serve para aula e transmissões. Não é loteria oficial.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "página de teste",
      linkTitle: "Abrir a página de teste do SpinWheelPlus",
    },
    {
      question: "O que é o peso?",
      answer:
        "Em Um por um, um peso maior ocupa mais da roleta e sai com mais frequência. Serve para bilhetes extras, ou para uma opção ter um pouco mais de chance. A conta aparece na roleta. O teste do site só mede fatias iguais.",
    },
    {
      question: "Posso mandar a roleta para alguém?",
      answer:
        "Daqui, não. Abra a página de edição no SpinWheelPlus para copiar o link. Quem apresenta com você abre a mesma roleta do outro lado.",
      href: SITE_URL,
      linkLabel: "página de edição no SpinWheelPlus",
      linkTitle: "Abrir a página de edição do SpinWheelPlus",
    },
    {
      question: "Posso colocar a roleta numa live ou num site?",
      answer:
        "Use a página de edição no SpinWheelPlus para incorporar ou abrir a página do giro. Esta extensão fica do lado da aba atual para você girar enquanto apresenta.",
    },
    {
      question: "Minha lista vai para algum lugar?",
      answer:
        "Aqui, não. Os nomes ficam guardados nesta extensão, neste navegador, até você abrir o editor e tocar em Compartilhar ou Salvar. Não coloque dados sensíveis de alunos num link público. Como se guarda e como se apaga está na Política de privacidade.",
      href: SITE_PRIVACY_URL,
      linkLabel: "Política de privacidade",
      linkTitle: "Política de privacidade do SpinWheelPlus",
    },
    {
      question: "Quantos nomes posso colocar?",
      answer:
        "Até 1000. Passados uns 120 nomes, as fatias ficam difíceis de ler no projetor. Se a lista for enorme, divida em duas roletas.",
    },
  ],
};
