import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const DE_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "Wofür ist dieses Rad da",
  featuresLead:
    "Du füllst dieses Rad hier, neben der offenen Seite. Namen rein, Farbe ändern, Ton an, drehen. Die Liste bleibt auf diesem Gerät. Für einen Link, eine Seite oder dein Konto öffnest du die Bearbeitungsseite auf SpinWheelPlus.",
  features: [
    {
      id: "weighted-slices",
      title: "Das größere Feld kommt öfter",
      desc: "Wenn eine Möglichkeit öfter kommen soll, erhöhe das Gewicht. Das breitere Feld hat mehr Chance. Das Foto kommt unter Einzeln dazu. Wenn die Felder nicht gleich groß sind, sag das vorher.",
    },
    {
      id: "images-themes",
      title: "Fotos und Farben",
      desc: "Farben, Rand, Mitte und Titel stellst du hier ein. Ein Foto klebst du auf ein Feld. Seitenhintergrund und Unsplash liegen auf der Bearbeitungsseite der Website.",
    },
    {
      id: "sounds-winner",
      title: "Ton und Ergebnisfeld",
      desc: "Beim Drehen und wenn ein Name kommt, kann ein Ton laufen. Am Ende gibt es Konfetti oder Feuerwerk. Schließ das Ergebnisfeld, oder nimm den Namen raus, damit als Nächstes ein anderer kommt.",
    },
    {
      id: "entries-history",
      title: "Liste und Verlauf",
      desc: "Du kannst viele Zeilen auf einmal ändern, oder einen Namen nach dem anderen. Mischen, sortieren, löschen. Der Verlauf bleibt auf diesem Gerät.",
    },
    {
      id: "beside-tab",
      title: "Neben der offenen Seite drehen",
      desc: "Lass Docs, Meet oder die Unterrichtsseite offen und dreh hier. Klick auf das Rad oder drück Space.",
    },
    {
      id: "full-editor",
      title: "Link, Seite und Konto",
      desc: "Öffne die Bearbeitungsseite auf SpinWheelPlus, um den Link zu kopieren, das Rad auf eine Seite zu setzen, einen Hintergrund zu legen oder es im Konto zu behalten.",
    },
    {
      id: "fairness-audit",
      title: "Du kannst den Zufall prüfen",
      desc: "Jeder Dreh nutzt crypto.getRandomValues() in diesem Browser. Die Testseite zeigt eine Probe mit 111 Namen, 10.000 Drehs (4 Durchgänge) und einen Chi-Quadrat-Test je nach Größe des Rads.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "Testseite",
      linkTitle: "Testseite von SpinWheelPlus öffnen",
    },
  ],
  faqHeading: "Häufige Fragen",
  faqs: [
    {
      question: "Kostet SpinWheelPlus etwas?",
      answer:
        "Für den normalen Gebrauch nein. Diese Erweiterung und die Bearbeitung auf der Website sind kostenlos. Wenn später etwas Geld kostet, ist das extra. Der erste Probedreh steckt nicht hinter einer Zahlung.",
    },
    {
      question: "Brauche ich ein Konto zum Drehen?",
      answer:
        "Nein. Die Erweiterung öffnet das Rad und behält es auf diesem Gerät. Bei SpinWheelPlus meldest du dich an, wenn du Räder im Konto behalten willst.",
    },
    {
      question: "Kommt das Rad wirklich zufällig?",
      answer:
        "Jeder Dreh nutzt crypto.getRandomValues() in diesem Browser, nicht eine Zahl von Hand. Wenn du Tausende Drehs auf deinem Gerät sehen willst, öffne die Testseite. Das reicht für Unterricht und Streams. Es ist keine amtliche Lotterie.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "Testseite",
      linkTitle: "Testseite von SpinWheelPlus öffnen",
    },
    {
      question: "Was ist das Gewicht?",
      answer:
        "Unter Einzeln nimmt ein höheres Gewicht mehr vom Rad ein und kommt öfter. Das ist für Extra-Lose, oder wenn eine Möglichkeit etwas mehr Chance haben soll. Die Rechnung siehst du am Rad. Der Test auf der Website misst nur gleich große Felder.",
    },
    {
      question: "Kann ich das Rad jemandem schicken?",
      answer:
        "Von hier aus nicht. Öffne die Bearbeitungsseite auf SpinWheelPlus und kopiere den Link. Wer mit dir vorne steht, öffnet dasselbe Rad auf der anderen Seite.",
      href: SITE_URL,
      linkLabel: "Bearbeitungsseite auf SpinWheelPlus",
      linkTitle: "Bearbeitungsseite von SpinWheelPlus öffnen",
    },
    {
      question: "Kann ich das Rad in einen Stream oder auf eine Website setzen?",
      answer:
        "Dafür nutzt du die Bearbeitungsseite auf SpinWheelPlus, zum Einbetten oder zum Öffnen der Drehseite. Diese Erweiterung bleibt neben dem aktuellen Tab, damit du drehst, während du sprichst.",
    },
    {
      question: "Geht meine Liste irgendwohin?",
      answer:
        "Hier nicht. Die Namen bleiben in dieser Erweiterung, in diesem Browser, bis du die Bearbeitung öffnest und auf Teilen oder Speichern tippst. Keine sensiblen Schülerdaten in einen öffentlichen Link. Wie das gespeichert und gelöscht wird, steht in der Datenschutzerklärung.",
      href: SITE_PRIVACY_URL,
      linkLabel: "Datenschutzerklärung",
      linkTitle: "Datenschutzerklärung von SpinWheelPlus",
    },
    {
      question: "Wie viele Namen kann ich eintragen?",
      answer:
        "Bis 1000. Ab etwa 120 Namen werden die Felder auf einem Beamer schwer lesbar. Wenn die Liste riesig ist, mach zwei Räder.",
    },
  ],
};
