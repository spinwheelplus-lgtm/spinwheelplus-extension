import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const IT_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "A cosa serve questa ruota",
  featuresLead:
    "Accanto alla pagina che hai aperta metti i nomi, cambi colori e suono, e giri. L'elenco resta su questo browser. Per mandare un link, metterla in una pagina o lasciarla sull'account, apri la pagina di modifica su SpinWheelPlus.",
  features: [
    {
      id: "weighted-slices",
      title: "La fetta più larga esce di più",
      desc: "Se un nome deve uscire più spesso, alza il peso. La fetta larga è la probabilità. La foto si mette in Uno per uno. Se le fette non sono uguali, dillo prima di girare.",
    },
    {
      id: "images-themes",
      title: "Colori e foto",
      desc: "Scegli i colori, il bordo, il centro e il titolo. Incolla una foto su una fetta. Lo sfondo della pagina e Unsplash stanno sulla pagina di modifica.",
    },
    {
      id: "sounds-winner",
      title: "Suono e riquadro",
      desc: "Puoi sentire un suono mentre gira e quando esce un nome. Alla fine, coriandoli o fuochi. Chiudi il riquadro, oppure togli il nome uscito: al giro dopo ne esce un altro.",
    },
    {
      id: "entries-history",
      title: "Elenco e storico",
      desc: "Scrivi tutto insieme, oppure un nome alla volta. Mescola, ordina, cancella. Lo storico resta su questo browser.",
    },
    {
      id: "beside-tab",
      title: "Gira accanto alla pagina aperta",
      desc: "Lascia aperti Docs, Meet o la pagina della lezione e gira qui. Premi la ruota, oppure Space.",
    },
    {
      id: "full-editor",
      title: "Link, pagina, account",
      desc: "Apri la pagina di modifica su SpinWheelPlus per copiare il link, metterla in una pagina, aggiungere uno sfondo o salvarla sull'account.",
    },
    {
      id: "fairness-audit",
      title: "Puoi controllare se è a caso",
      desc: "Ogni giro usa crypto.getRandomValues() in questo browser. Sulla pagina di prova ci sono 111 nomi, 10.000 giri (4 volte) e il test del chi quadrato, secondo la grandezza della ruota.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "pagina di prova",
      linkTitle: "Apri la pagina di prova di SpinWheelPlus",
    },
  ],
  faqHeading: "Domande frequenti",
  faqs: [
    {
      question: "SpinWheelPlus è gratis?",
      answer:
        "Sì, per l'uso di tutti i giorni: questa estensione e la pagina sul sito. Se un giorno ci sarà qualcosa a pagamento, sarà a parte. Il primo giro non sta dietro a un pagamento.",
    },
    {
      question: "Mi serve un account per girare?",
      answer:
        "No. La ruota sta su questo browser. Entra in SpinWheelPlus solo quando vuoi salvarne qualcuna sull'account.",
    },
    {
      question: "Esce davvero a caso?",
      answer:
        "Ogni giro usa crypto.getRandomValues() in questo browser, non un numero scelto a mano. Sulla pagina di prova vedi migliaia di giri. Va bene in classe e in diretta. Non è una lotteria autorizzata.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "pagina di prova",
      linkTitle: "Apri la pagina di prova di SpinWheelPlus",
    },
    {
      question: "Il peso cosa fa?",
      answer:
        "In Uno per uno, un peso più alto occupa più ruota ed esce più spesso. Serve per i biglietti extra, o per dare un po' più di probabilità a un nome. Il conto si vede sulla ruota. La prova sul sito misura solo fette uguali.",
    },
    {
      question: "Posso mandare la ruota a qualcuno?",
      answer:
        "Da qui, no. Apri la pagina di modifica su SpinWheelPlus e copia il link. Chi presenta con te apre la stessa ruota.",
      href: SITE_URL,
      linkLabel: "pagina di modifica su SpinWheelPlus",
      linkTitle: "Apri la pagina di modifica di SpinWheelPlus",
    },
    {
      question: "Posso metterla in una diretta o su un sito?",
      answer:
        "Sulla pagina di modifica la metti in una pagina, oppure apri la pagina del giro. Questa estensione resta accanto alla scheda, così giri mentre presenti.",
    },
    {
      question: "L'elenco dove va a finire?",
      answer:
        "Resta qui, nella memoria di questa estensione, finché non apri la pagina di modifica e tocchi Condividi o Salva. Non mettere dati delicati degli studenti in un link pubblico. Come si conserva e come si cancella sta nell'Informativa sulla privacy.",
      href: SITE_PRIVACY_URL,
      linkLabel: "Informativa sulla privacy",
      linkTitle: "Informativa sulla privacy di SpinWheelPlus",
    },
    {
      question: "Quanti nomi ci stanno?",
      answer:
        "Fino a 1000. Oltre circa 120, le fette si leggono male su un proiettore. Se l'elenco è enorme, fai due ruote.",
    },
  ],
};
