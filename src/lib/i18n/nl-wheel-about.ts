import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const NL_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "Waar is dit rad voor",
  featuresLead:
    "Naast de pagina die je open hebt zet je namen, verander je kleuren en geluid, en draai je. De lijst blijft in deze browser. Wil je een link sturen, het rad op een pagina zetten of het op je account laten staan, open dan de bewerkingspagina op SpinWheelPlus.",
  features: [
    {
      id: "weighted-slices",
      title: "Een bredere punt komt vaker",
      desc: "Moet een naam vaker uitkomen, zet het gewicht hoger. De brede punt is de kans. Een foto zet je bij Eén voor één. Zijn de punten niet gelijk, zeg dat dan voor je draait.",
    },
    {
      id: "images-themes",
      title: "Kleuren en foto's",
      desc: "Kies kleuren, de rand, het midden en de titel. Plak een foto op een punt. De pagina-achtergrond en Unsplash staan op de bewerkingspagina.",
    },
    {
      id: "sounds-winner",
      title: "Geluid en het vak",
      desc: "Je kunt geluid horen terwijl het draait en als er een naam uitkomt. Aan het eind: confetti of vuurwerk. Sluit het resultaatvak, of haal de getrokken naam weg. De volgende draai komt er een andere.",
    },
    {
      id: "entries-history",
      title: "Lijst en geschiedenis",
      desc: "Schrijf alles tegelijk, of één naam per keer. Schud, sorteer, wis. De geschiedenis blijft in deze browser.",
    },
    {
      id: "beside-tab",
      title: "Draai naast de open pagina",
      desc: "Laat Docs, Meet of de lespagina open en draai hier. Druk op het rad, of op Space.",
    },
    {
      id: "full-editor",
      title: "Link, pagina, account",
      desc: "Open de bewerkingspagina op SpinWheelPlus om de link te kopiëren, het rad op een pagina te zetten, een achtergrond toe te voegen of het op je account te bewaren.",
    },
    {
      id: "fairness-audit",
      title: "Je kunt nakijken of het toeval is",
      desc: "Elke draai gebruikt crypto.getRandomValues() in deze browser. Op de testpagina staan 111 namen, 10.000 draaien (4 keer) en de chi-kwadraattest, naar de grootte van het rad.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "testpagina",
      linkTitle: "Open de testpagina van SpinWheelPlus",
    },
  ],
  faqHeading: "Veelgestelde vragen",
  faqs: [
    {
      question: "Is SpinWheelPlus gratis?",
      answer:
        "Ja, voor gewoon gebruik: deze extensie en de pagina op de site. Komt er ooit iets betaalds bij, dan staat dat apart. De eerste draai zit niet achter een betaling.",
    },
    {
      question: "Heb ik een account nodig om te draaien?",
      answer:
        "Nee. Het rad staat in deze browser. Log in bij SpinWheelPlus als je er een paar op je account wilt bewaren.",
    },
    {
      question: "Komt het echt toevallig uit?",
      answer:
        "Elke draai gebruikt crypto.getRandomValues() in deze browser, geen getal dat iemand heeft uitgekozen. Op de testpagina zie je duizenden draaien. Prima voor de klas en een livestream. Het is geen vergunde loterij.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "testpagina",
      linkTitle: "Open de testpagina van SpinWheelPlus",
    },
    {
      question: "Wat doet het gewicht?",
      answer:
        "Bij Eén voor één neemt een hoger gewicht meer van het rad in en komt het vaker uit. Handig voor extra lootjes, of om een naam iets meer kans te geven. De telling zie je op het rad. De proef op de site meet alleen gelijke punten.",
    },
    {
      question: "Kan ik het rad naar iemand sturen?",
      answer:
        "Vanuit hier niet. Open de bewerkingspagina op SpinWheelPlus en kopieer de link. Wie met je presenteert, opent hetzelfde rad.",
      href: SITE_URL,
      linkLabel: "bewerkingspagina op SpinWheelPlus",
      linkTitle: "Open de bewerkingspagina van SpinWheelPlus",
    },
    {
      question: "Kan ik het in een stream of op een site zetten?",
      answer:
        "Op de bewerkingspagina zet je het op een pagina, of je opent de draaipagina. Deze extensie blijft naast het tabblad, zodat je draait terwijl je presenteert.",
    },
    {
      question: "Waar blijft de lijst?",
      answer:
        "Hier, in het geheugen van deze extensie, tot je de bewerkingspagina opent en Delen of Opslaan aanraakt. Zet geen gevoelige leerlinggegevens in een openbare link. Hoe het bewaard en gewist wordt, staat in de Privacyverklaring.",
      href: SITE_PRIVACY_URL,
      linkLabel: "Privacyverklaring",
      linkTitle: "Privacyverklaring van SpinWheelPlus",
    },
    {
      question: "Hoeveel namen passen erop?",
      answer:
        "Tot 1000. Boven ongeveer 120 zijn de punten op een projector lastig te lezen. Is de lijst enorm, maak dan twee raderen.",
    },
  ],
};
