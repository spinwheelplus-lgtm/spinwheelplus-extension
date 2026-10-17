import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import type { AboutPack, ToolAbout } from "@/lib/i18n/about-pack";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
} from "@/lib/constants";

const fairness = {
  href: SITE_FAIRNESS_AUDIT_URL,
  linkLabel: "página de teste",
  linkTitle: "Abrir a página de teste do SpinWheelPlus",
};

const privacy = {
  href: SITE_PRIVACY_URL,
  linkLabel: "Política de privacidade",
  linkTitle: "Política de privacidade do SpinWheelPlus",
};

const feature = (
  id: string,
  title: string,
  desc: string,
  link?: Pick<AboutFeatureItem, "href" | "linkLabel" | "linkTitle">,
): AboutFeatureItem => ({ id, title, desc, ...link });

const faq = (
  question: string,
  answer: string,
  link?: Pick<AboutFaqItem, "href" | "linkLabel" | "linkTitle">,
): AboutFaqItem => ({ question, answer, ...link });

const pack = (
  featuresHeading: string,
  featuresLead: string,
  features: AboutPack["features"],
  faqs: AboutPack["faqs"],
  ctaLabel: string,
  ctaTitle: string,
  ctaNote: string,
): AboutPack => ({
  featuresHeading,
  featuresLead,
  features,
  faqs,
  ctaLabel,
  ctaTitle,
  ctaNote,
});

const pageNote = "A mesma ferramenta, aberta numa aba do navegador.";
const tableNote = "A mesma mesa, aberta numa aba do navegador.";

export const aboutPt: ToolAbout = {
  number: pack(
    "Para que serve esta página",
    "Esta página sorteia números inteiros do lado da página que está aberta. Você define o intervalo, tira os valores que não quer, sorteia um ou vários, e copia ou baixa o histórico. Os sorteios ficam neste aparelho.",
    [
      feature(
        "range",
        "Do menor ao maior",
        "Sorteia de -1.000.000 a 1.000.000. Se o mínimo ficar maior que o máximo, ainda funciona: vale do menor para o maior.",
      ),
      feature(
        "exclude",
        "Números que ficam de fora",
        "Pule bilhetes ou códigos com uma lista separada por vírgulas. Esses valores não saem até você apagá-los.",
      ),
      feature(
        "batch",
        "Um ou vários",
        "Atalhos de 1, 2, 3, 5 ou 10, ou uma quantidade sua, até 500 números num único sorteio.",
      ),
      feature(
        "repeat",
        "Repetir no mesmo sorteio",
        "Ligado: o mesmo número pode sair duas vezes nesse resultado. Desligado: cada valor dessa rodada é diferente.",
      ),
      feature(
        "roll",
        "A mistura na tela",
        "Uma mistura opcional de uns 2,5 s. Os números finais já foram escolhidos com crypto.getRandomValues(). A animação só mostra.",
      ),
      feature(
        "history",
        "Histórico neste aparelho",
        "Os sorteios recentes ficam neste navegador. Abra uma linha de novo, copie o último resultado ou baixe um .txt.",
      ),
      feature(
        "fairness-audit",
        "Dá para conferir se é ao acaso",
        "Cada escolha usa crypto.getRandomValues() neste navegador. A página de teste publica amostras que você pode ler.",
        fairness,
      ),
    ],
    [
      faq(
        "Este sorteio de números é grátis?",
        "Sim. A extensão e a ferramenta do site são grátis no uso normal. Não precisa de conta para sortear.",
      ),
      faq(
        "Preciso de conta para sortear?",
        "Não. As opções e o histórico ficam neste aparelho. Entre no SpinWheelPlus só se quiser guardar roletas na conta.",
      ),
      faq(
        "Os números saem mesmo ao acaso?",
        "Cada sorteio usa crypto.getRandomValues() neste navegador. Cada inteiro do intervalo tem a mesma chance, um independente do outro. Abra a página de teste se quiser ver amostras no site.",
        fairness,
      ),
      faq(
        "Qual intervalo eu posso usar?",
        "Qualquer inteiro de -1.000.000 a 1.000.000. Um intervalo curto serve para bilhetes. Um amplo, para códigos de amostra.",
      ),
      faq(
        "Dá para sortear mais de um número de uma vez?",
        "Sim. Use um atalho ou uma quantidade sua, até 500 números por sorteio.",
      ),
      faq(
        "Dá para deixar alguns números de fora?",
        "Sim. Escreva os valores separados por vírgula em Excluir números. Eles ficam de fora até você apagá-los da lista.",
      ),
      faq(
        "O mesmo número pode sair duas vezes num sorteio?",
        "Sim, se Repetir no mesmo sorteio estiver ligado. Desligue para valores diferentes. Se pedir mais números diferentes do que sobram depois das exclusões, aparece um aviso.",
      ),
      faq(
        "A animação muda o resultado?",
        "Não. Os números finais são escolhidos na hora. A mistura na tela só mostra e não muda as chances.",
      ),
      faq(
        "O histórico fica só comigo?",
        "Aqui, sim. O histórico fica guardado nesta extensão, neste navegador. A Política de privacidade explica como o SpinWheelPlus trata os dados no site.",
        privacy,
      ),
    ],
    "Abrir Número aleatório no SpinWheelPlus",
    "Abrir o sorteio de números no SpinWheelPlus",
    pageNote,
  ),
  name: pack(
    "Para que serve esta página",
    "Esta página escolhe um nome da sua lista, do lado da página que está aberta. Cole ou importe os nomes, ignore os repetidos, tire o nome que saiu, e copie ou baixe o histórico. As escolhas ficam neste aparelho.",
    [
      feature(
        "list",
        "A lista de nomes",
        "Um nome por linha. Cole da área de transferência, importe um .txt, embaralhe a ordem ou apague a lista.",
      ),
      feature(
        "duplicates",
        "Ignorar nomes repetidos",
        "Ligado: só conta a primeira linha de cada nome (maiúsculas não importam). Desligado: as linhas extras funcionam como bilhetes extras.",
      ),
      feature(
        "remove-winner",
        "Tirar o nome que saiu",
        "Ligado: esse nome sai da lista depois de cada escolha. É o jeito usual de tirar o primeiro, o segundo e o terceiro.",
      ),
      feature(
        "roll",
        "A mistura na tela",
        "Uma mistura opcional de uns 2,5 s. O nome já foi escolhido com crypto.getRandomValues(). A animação só mostra.",
      ),
      feature(
        "history",
        "Histórico neste aparelho",
        "As escolhas recentes ficam neste navegador (até 100). Abra uma linha de novo, copie um nome ou baixe um .txt.",
      ),
      feature(
        "fairness-audit",
        "Dá para conferir se é ao acaso",
        "Cada escolha usa crypto.getRandomValues() neste navegador. A página de teste publica amostras que você pode ler.",
        fairness,
      ),
    ],
    [
      faq(
        "Escolher um nome é grátis?",
        "Sim. A extensão e a ferramenta do site são grátis no uso normal. Não precisa de conta para escolher.",
      ),
      faq(
        "Preciso de conta para escolher nomes?",
        "Não. A lista, as opções e o histórico ficam neste aparelho. Entre no SpinWheelPlus só se quiser guardar roletas na conta.",
      ),
      faq(
        "A escolha é justa?",
        "Cada escolha pega um lugar ao acaso com crypto.getRandomValues() neste navegador. Cada nome do grupo tem a mesma chance. Abra a página de teste se quiser ver amostras no site.",
        fairness,
      ),
      faq(
        "Dá para escolher vários nomes de uma vez?",
        "Cada toque escolhe um nome. Para vários nomes diferentes, ligue Tirar o nome que saiu e continue escolhendo.",
      ),
      faq(
        "O que faz Ignorar nomes repetidos?",
        "Se estiver ligado, só conta a primeira linha de cada nome. As cópias são ignoradas (maiúsculas não importam). Se estiver desligado, as linhas repetidas funcionam como bilhetes extras.",
      ),
      faq(
        "O que faz Tirar o nome que saiu?",
        "Depois de cada escolha, esse nome sai da lista e não pode sair de novo até você colocá-lo outra vez.",
      ),
      faq(
        "A animação muda quem saiu?",
        "Não. O nome é escolhido no instante em que você clica. A animação só mostra uma mistura de uns 2,5 segundos.",
      ),
      faq(
        "A lista fica só comigo?",
        "Aqui, sim. A lista e o histórico ficam guardados nesta extensão, neste navegador. A Política de privacidade explica como o SpinWheelPlus trata os dados no site.",
        privacy,
      ),
    ],
    "Abrir Escolher um nome no SpinWheelPlus",
    "Abrir a escolha de nomes no SpinWheelPlus",
    pageNote,
  ),
  dice: pack(
    "Para que serve esta página",
    "Esta página joga dados de várias faces, do lado da página que está aberta. Misture de D4 a D20, some ou subtraia um modificador, e copie ou baixe o histórico. Os resultados ficam neste aparelho.",
    [
      feature(
        "table",
        "A mesa de dados",
        "Coloque até 25 dados (D4, D6, D8, D10, D12, D20). Clique em Jogar ou aperte Space. Cada face usa crypto.getRandomValues().",
      ),
      feature(
        "modifier",
        "Modificador",
        "Some ou subtraia de -99 a +99. Vale para o total, não para como cada dado cai. Serve para testes tipo 2d6+3.",
      ),
      feature(
        "setup",
        "Cores e o arquivo",
        "Edite um dado para mudar a cor da face e das marcas, os números do D6, os pontos ou seis palavras. Uma face em branco mostra o número. Em Arquivo você baixa ou abre a configuração. Esta extensão não tem link para compartilhar.",
      ),
      feature(
        "click",
        "Clique no dado",
        "Um clique joga todos (o padrão), ou você joga um dado por vez no menu da engrenagem.",
      ),
      feature(
        "history",
        "Histórico neste aparelho",
        "Os resultados recentes ficam neste navegador (até 200). Baixe um .txt ou limpe a lista quando for começar outra sessão.",
      ),
      feature(
        "fairness-audit",
        "Dá para conferir se é ao acaso",
        "Cada face usa crypto.getRandomValues() neste navegador. A página de teste publica amostras que você pode ler.",
        fairness,
      ),
    ],
    [
      faq(
        "Os dados são grátis?",
        "Sim. A extensão e a ferramenta do site são grátis no uso normal. Não precisa de conta para jogar.",
      ),
      faq(
        "Os resultados saem ao acaso?",
        "Sim. Cada jogada pega bytes ao acaso de crypto.getRandomValues() neste navegador, então cada face tem a mesma chance. A página de teste mostra amostras no site.",
        fairness,
      ),
      faq(
        "Dá para jogar mais de um dado?",
        "Sim. Coloque até 25 dados na mesa (de D4 a D20) e jogue juntos. Com três ou mais, o botão diz Jogar todos.",
      ),
      faq(
        "Dá para jogar de novo só um dado?",
        "Sim. Nas opções da mesa, ponha Clique no dado em Jogar um dado, e clique nesse dado. O padrão é jogar todos.",
      ),
      faq(
        "Dá para somar um modificador tipo 2d6+3?",
        "Sim. Coloque um modificador +/- na fileira de adicionar dados (de -99 a +99). Vale para faces com número. Um resultado que cai só em palavras não usa o modificador.",
      ),
      faq(
        "Dá para colocar palavras num D6?",
        "Sim. Edite um D6 e escolha Palavras. Escreva um rótulo em cada face, ou use Número ou Sim / Não. Uma face em branco continua mostrando o número e entra no total.",
      ),
      faq(
        "Dá para copiar ou guardar os resultados?",
        "Sim. Copie o último total da mesa, baixe o histórico em .txt, ou use Arquivo para baixar e abrir a configuração.",
      ),
      faq(
        "Existe um dado D100?",
        "Não há um tipo D100 separado. Use D10 no estilo de percentil, ou junte dados na mesma mesa (por exemplo 2d10) e leia o total você mesmo.",
      ),
      faq(
        "O histórico fica só comigo?",
        "Aqui, sim. Fica guardado nesta extensão, neste navegador. A Política de privacidade explica como o SpinWheelPlus trata os dados no site.",
        privacy,
      ),
    ],
    "Abrir Dados no SpinWheelPlus",
    "Abrir os dados no SpinWheelPlus",
    tableNote,
  ),
  coin: pack(
    "Para que serve esta página",
    "Esta página joga cara ou coroa do lado da página que está aberta. Misture moedas de ouro, prata e cobre, lance uma ou todas, e copie ou baixe o histórico. Os lançamentos ficam neste aparelho.",
    [
      feature(
        "table",
        "A mesa de moedas",
        "Coloque até 25 moedas. Clique em Lançar ou aperte Space. Cada lançamento usa crypto.getRandomValues(), então cara e coroa ficam 50/50.",
      ),
      feature(
        "metals",
        "Ouro, prata e cobre",
        "Escolha o metal ao colocar uma moeda, ou mude a mesa inteira para Sim / Não, Ganha / Perde ou Ímpar / Par. Em Arquivo você baixa a configuração. Esta extensão não tem link para compartilhar.",
      ),
      feature(
        "click",
        "Clique na moeda",
        "Um clique lança todas (o padrão), ou você lança uma por vez no menu da engrenagem.",
      ),
      feature(
        "history",
        "Histórico neste aparelho",
        "Os lançamentos recentes ficam neste navegador (até 200). Baixe um .txt ou limpe a lista quando for começar outra sessão.",
      ),
      feature(
        "fairness-audit",
        "Dá para conferir se é ao acaso",
        "Cada lançamento usa crypto.getRandomValues() neste navegador. A página de teste publica amostras que você pode ler.",
        fairness,
      ),
    ],
    [
      faq(
        "Cara ou coroa é grátis?",
        "Sim. A extensão e a ferramenta do site são grátis no uso normal. Não precisa de conta para lançar.",
      ),
      faq(
        "Cara ou coroa é mesmo 50/50?",
        "Sim para jogos, demonstração em aula e decisões do dia a dia. Cada lançamento pega bytes ao acaso de crypto.getRandomValues() neste navegador. A página de teste mostra amostras. Não é um gerador de cassino ou de loteria.",
        fairness,
      ),
      faq(
        "Dá para colocar palavras nas moedas?",
        "Sim. Em Faces, escolha Sim / Não, Ganha / Perde ou Ímpar / Par. Esse par vale para todas as moedas. Clássica mantém ouro, prata e cobre.",
      ),
      faq(
        "Dá para lançar mais de uma moeda?",
        "Sim. Coloque até 25 moedas (ouro, prata ou cobre) e lance juntas. Com duas ou mais, o botão diz Lançar todas.",
      ),
      faq(
        "Dá para lançar de novo só uma moeda?",
        "Sim. Nas opções da mesa, ponha Clique na moeda em Lançar uma moeda, e clique nessa moeda. O padrão é lançar todas.",
      ),
      faq(
        "Dá para copiar ou guardar os lançamentos?",
        "Sim. Copie o último resultado da mesa, baixe o histórico em .txt, ou use Arquivo para baixar e abrir a configuração.",
      ),
      faq(
        "O histórico fica só comigo?",
        "Aqui, sim. Fica guardado nesta extensão, neste navegador. A Política de privacidade explica como o SpinWheelPlus trata os dados no site.",
        privacy,
      ),
    ],
    "Abrir Cara ou coroa no SpinWheelPlus",
    "Abrir Cara ou coroa no SpinWheelPlus",
    tableNote,
  ),
  yesNo: pack(
    "Para que serve esta página",
    "Esta página escolhe Sim, Não, Talvez, Verdadeiro, Falso, ou frases que você escreveu. Pergunte de novo com Space ou Enter. O histórico fica neste aparelho.",
    [
      feature(
        "modes",
        "Quatro jeitos de responder",
        "Sim ou não (50/50), Sim / Não / Talvez, Verdadeiro / Falso, ou frases suas, uma por linha. Cada opção do grupo tem a mesma chance.",
      ),
      feature(
        "ask",
        "Perguntar de novo",
        "Clique em Perguntar de novo ou aperte Space. O acaso é crypto.getRandomValues().",
      ),
      feature(
        "motion",
        "Animação e som",
        "Seletor, virada, esmaecer ou letra por letra. O som é opcional. A resposta já foi escolhida antes de a animação começar.",
      ),
      feature(
        "history",
        "Histórico neste aparelho",
        "As respostas recentes ficam neste navegador (até 200). Baixe um .txt ou limpe a lista.",
      ),
      feature(
        "fairness-audit",
        "Dá para conferir se é ao acaso",
        "Cada pergunta usa crypto.getRandomValues() neste navegador. A página de teste publica amostras que você pode ler.",
        fairness,
      ),
    ],
    [
      faq(
        "Este Sim ou não é grátis?",
        "Sim. A extensão e a ferramenta do site são grátis no uso normal. Não precisa de conta para perguntar.",
      ),
      faq(
        "Sim e Não são 50/50?",
        "No modo Sim ou não, sim. Cada pergunta sai de crypto.getRandomValues() neste navegador. Talvez tem três caminhos iguais. O modo de frases suas divide parelho entre as linhas que você escreveu. A página de teste mostra amostras.",
        fairness,
      ),
      faq(
        "Dá para usar Talvez ou as minhas frases?",
        "Sim. Mude o modo para Sim / Não / Talvez, Verdadeiro / Falso, ou frases suas.",
      ),
      faq(
        "A animação ou o som mudam a resposta?",
        "Não. A escolha acontece primeiro. A animação e o som só apresentam.",
      ),
      faq(
        "Dá para ver respostas anteriores?",
        "Sim. As recentes ficam neste aparelho (até 200), com Baixar .txt se você quiser um arquivo.",
      ),
      faq(
        "Serve para decisões importantes?",
        "Não. Para o que realmente importa, use o seu próprio critério. Isto serve para destravar e para escolhas de pouco risco.",
      ),
      faq(
        "E se eu quiser cara ou coroa?",
        "Use Cara ou coroa nesta extensão. Para números, experimente Dados ou Número aleatório.",
      ),
      faq(
        "O histórico fica só comigo?",
        "Aqui, sim. Fica guardado nesta extensão, neste navegador. A Política de privacidade explica como o SpinWheelPlus trata os dados no site.",
        privacy,
      ),
    ],
    "Abrir Sim ou não no SpinWheelPlus",
    "Abrir a ferramenta Sim ou não no SpinWheelPlus",
    pageNote,
  ),
  shuffle: pack(
    "Para que serve esta página",
    "Esta página põe a sua lista numa ordem nova, do lado da página que está aberta. Não escolhe um nome. Cole ou importe as linhas, tire as vazias ou as repetidas, e copie ou baixe a mistura. O histórico fica neste aparelho.",
    [
      feature(
        "list",
        "A sua lista",
        "Um item por linha. Cole da área de transferência, importe um .txt ou apague a lista.",
      ),
      feature(
        "ignore-empty",
        "Ignorar linhas vazias",
        "Ligado: as linhas em branco saem antes de embaralhar. Desligado: ficam como espaços vazios.",
      ),
      feature(
        "duplicates",
        "Tirar itens repetidos",
        "Ligado: só fica a primeira cópia de cada linha (maiúsculas não importam). Desligado: as cópias extras ficam como bilhetes extras.",
      ),
      feature(
        "sound",
        "Som ao mostrar",
        "Um som curto, se você quiser, quando aparece uma mistura nova. A ordem já está escolhida. O som não muda. Abrir do histórico fica em silêncio.",
      ),
      feature(
        "order",
        "Uma ordem ao acaso",
        "Fisher-Yates com crypto.getRandomValues() neste navegador. Cada ordem completa da lista tem a mesma chance. A página de teste publica amostras que você pode ler.",
        fairness,
      ),
      feature(
        "history",
        "Histórico neste aparelho",
        "As misturas recentes ficam neste navegador (até 50). Abra um cartão de novo, copie uma mistura ou baixe um .txt.",
      ),
    ],
    [
      faq(
        "Embaralhar lista é grátis?",
        "Sim. Embaralhe e copie sem conta. Entre no SpinWheelPlus só se mais tarde usar outras funções.",
      ),
      faq(
        "Quão ao acaso é?",
        "Fisher-Yates mais o acaso do navegador (crypto.getRandomValues()). Não é uma semente fixa. Serve para aula, reunião e sorteio informal. Loteria regulamentada é outra coisa. A página de teste publica amostras.",
        fairness,
      ),
      faq(
        "O que as opções fazem?",
        "Ignorar linhas vazias tira os espaços em branco. Tirar itens repetidos deixa a primeira cópia de cada linha. Ajuda depois de exportar uma planilha bagunçada.",
      ),
      faq(
        "Dá para desfazer?",
        "Sim, em Misturas recentes neste aparelho. Limpe o histórico quando terminar. Se apagar os dados do navegador, esse histórico local também some.",
      ),
      faq(
        "Dá para embaralhar de novo?",
        "Quando quiser. Cada clique é uma ordem nova.",
      ),
      faq(
        "O que eu posso colocar na lista?",
        "Nomes, tarefas, títulos, músicas, ideias: uma coisa por linha. Listas bem longas também embaralham. Ler mais de 100 linhas em voz alta é o difícil, não a conta.",
      ),
      faq(
        "Isto escolhe um nome?",
        "Não. Você recebe os mesmos itens em outra ordem. Use Escolher um nome quando precisar de um só.",
      ),
      faq(
        "A lista fica só comigo?",
        "Aqui, sim. A lista e o histórico ficam guardados nesta extensão, neste navegador. A Política de privacidade explica como o SpinWheelPlus trata os dados no site.",
        privacy,
      ),
    ],
    "Abrir Embaralhar lista no SpinWheelPlus",
    "Abrir Embaralhar lista no SpinWheelPlus",
    pageNote,
  ),
  team: pack(
    "Para que serve esta página",
    "Esta página divide a lista em equipes, do lado da página que está aberta. Não escolhe um ganhador. Cole os nomes, marque os capitães, monte as equipes, e copie ou baixe. O histórico fica neste aparelho.",
    [
      feature(
        "list",
        "A lista de nomes",
        "Um nome por linha. Cole, importe um .txt ou .csv, ou apague. A coroa marca um capitão. O máximo é 300 nomes.",
      ),
      feature(
        "split",
        "Quantidade ou tamanho",
        "Divida pelo número de equipes, ou pelo tamanho que você quer. Mantenha as equipes parelhas, ou deixe tamanhos diferentes.",
      ),
      feature(
        "captains",
        "Capitães",
        "Cada nome com coroa cai primeiro numa equipe diferente. O resto se acomoda em volta.",
      ),
      feature(
        "adjust",
        "Ajustar depois de montar",
        "Arraste um nome para outra equipe, ou escolha a equipe no menu da linha. Mude o nome e depois Copiar tudo.",
      ),
      feature(
        "sound",
        "Som ao mostrar",
        "Um som curto, se você quiser, quando aparece uma divisão nova. Abrir do histórico fica em silêncio.",
      ),
      feature(
        "fairness",
        "Uma divisão ao acaso",
        "Fisher-Yates com crypto.getRandomValues() neste navegador. É chance igual, não equilíbrio de habilidade. A página de teste publica amostras que você pode ler.",
        fairness,
      ),
    ],
    [
      faq(
        "Montar equipes é grátis?",
        "Sim. Divida quantas vezes precisar. Não precisa de conta.",
      ),
      faq(
        "As equipes saem de forma justa?",
        "Os nomes são embaralhados com Fisher-Yates e crypto.getRandomValues() neste navegador. Manter as equipes parelhas deixa os tamanhos a uma pessoa de diferença, quando os números permitem. É chance igual, não habilidade. A página de teste publica amostras.",
        fairness,
      ),
      faq(
        "Quantas equipes eu posso criar?",
        "Tantas quantas pessoas você tiver. Escolha Número de equipes ou um tamanho. Com capitães ligados, precisa de pelo menos uma equipe por capitão.",
      ),
      faq(
        "Dá para definir capitães?",
        "Sim. Ponha a coroa num nome, ligue Usar capitães, e cada capitão cai primeiro numa equipe diferente.",
      ),
      faq(
        "Dá para ajustar as equipes depois?",
        "Sim. Arraste um nome para outra equipe, ou escolha a equipe no menu da linha. Mude o nome e depois Copiar tudo.",
      ),
      faq(
        "Dá para montar de novo?",
        "Clique em Montar de novo para outra divisão. As misturas anteriores ficam em Montagens recentes, se você quiser abrir uma de novo.",
      ),
      faq(
        "Isto escolhe um ganhador?",
        "Não. Você recebe grupos. Use Escolher um nome para um só nome, ou Embaralhar lista para uma ordem nova sem equipes.",
      ),
      faq(
        "A lista fica só comigo?",
        "Aqui, sim. Nomes, equipes e histórico ficam guardados nesta extensão, neste navegador. A Política de privacidade cobre o site.",
        privacy,
      ),
    ],
    "Abrir Montar equipes no SpinWheelPlus",
    "Abrir Montar equipes no SpinWheelPlus",
    pageNote,
  ),
};
