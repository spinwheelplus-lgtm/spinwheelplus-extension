import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import type { AboutPack, ToolAbout } from "@/lib/i18n/about-pack";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
} from "@/lib/constants";

const fairness = {
  href: SITE_FAIRNESS_AUDIT_URL,
  linkLabel: "Testseite",
  linkTitle: "Testseite von SpinWheelPlus öffnen",
};

const privacy = {
  href: SITE_PRIVACY_URL,
  linkLabel: "Datenschutzerklärung",
  linkTitle: "Datenschutzerklärung von SpinWheelPlus",
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

const pageNote = "Dasselbe Werkzeug, in einem Browser-Tab geöffnet.";
const tableNote = "Dieselbe Fläche, in einem Browser-Tab geöffnet.";

export const aboutDe: ToolAbout = {
  number: pack(
    "Wofür ist diese Seite da",
    "Diese Seite zieht ganze Zahlen neben der offenen Seite. Du setzt den Bereich, lässt Zahlen weg, ziehst eine oder mehrere und kopierst oder lädst den Verlauf herunter. Die Ziehungen bleiben auf diesem Gerät.",
    [
      feature(
        "range",
        "Von klein nach groß",
        "Es geht von -1.000.000 bis 1.000.000. Wenn das Minimum größer ist als das Maximum, geht es trotzdem: von der kleineren Zahl zur größeren.",
      ),
      feature(
        "exclude",
        "Zahlen, die draußen bleiben",
        "Lose oder Nummern lässt du mit einer Liste weg, getrennt durch Kommas. Diese Werte kommen nicht, bis du sie löschst.",
      ),
      feature(
        "batch",
        "Eine oder mehrere",
        "Kurz 1, 2, 3, 5 oder 10, oder deine eigene Anzahl, bis 500 Zahlen in einem Zug.",
      ),
      feature(
        "repeat",
        "In derselben Ziehung wiederholen",
        "An: dieselbe Zahl kann in diesem Ergebnis zweimal kommen. Aus: jede Zahl in diesem Zug ist anders.",
      ),
      feature(
        "roll",
        "Das Mischen auf dem Bildschirm",
        "Etwa 2,5 Sekunden Mischen, wenn du willst. Die endgültigen Zahlen stehen schon fest, über crypto.getRandomValues(). Die Bewegung zeigt sie nur.",
      ),
      feature(
        "history",
        "Verlauf auf diesem Gerät",
        "Die letzten Ziehungen bleiben in diesem Browser. Eine Zeile wieder öffnen, das letzte Ergebnis kopieren oder eine .txt laden.",
      ),
      feature(
        "fairness-audit",
        "Du kannst den Zufall prüfen",
        "Jede Wahl nutzt crypto.getRandomValues() in diesem Browser. Die Testseite zeigt Proben, die du lesen kannst.",
        fairness,
      ),
    ],
    [
      faq(
        "Ist diese Zahlenziehung kostenlos?",
        "Ja. Erweiterung und Werkzeug auf der Website sind für den normalen Gebrauch kostenlos. Zum Ziehen brauchst du kein Konto.",
      ),
      faq(
        "Brauche ich ein Konto zum Ziehen?",
        "Nein. Einstellungen und Verlauf bleiben auf diesem Gerät. Bei SpinWheelPlus meldest du dich nur an, wenn du Räder im Konto behalten willst.",
      ),
      faq(
        "Kommen die Zahlen wirklich zufällig?",
        "Jede Ziehung nutzt crypto.getRandomValues() in diesem Browser. Jede ganze Zahl im Bereich hat dieselbe Chance, unabhängig von den anderen. Öffne die Testseite, wenn du Proben auf der Website sehen willst.",
        fairness,
      ),
      faq(
        "Welchen Bereich kann ich nehmen?",
        "Jede ganze Zahl von -1.000.000 bis 1.000.000. Ein kurzer Bereich ist für Lose. Ein weiter für Probennummern.",
      ),
      faq(
        "Kann ich mehrere Zahlen auf einmal ziehen?",
        "Ja. Nimm eine Kurzauswahl oder deine eigene Anzahl, bis 500 Zahlen pro Zug.",
      ),
      faq(
        "Kann ich einzelne Zahlen weglassen?",
        "Ja. Schreib die Werte mit Komma unter Zahlen weglassen. Sie bleiben draußen, bis du sie aus der Liste löschst.",
      ),
      faq(
        "Kann dieselbe Zahl in einer Ziehung zweimal kommen?",
        "Ja, wenn In derselben Ziehung wiederholen an ist. Schalt es aus für verschiedene Werte. Wenn du mehr verschiedene Zahlen willst, als nach dem Weglassen übrig sind, kommt ein Hinweis.",
      ),
      faq(
        "Ändert die Bewegung das Ergebnis?",
        "Nein. Die endgültigen Zahlen stehen sofort fest. Das Mischen auf dem Bildschirm ändert die Chancen nicht.",
      ),
      faq(
        "Bleibt der Verlauf bei mir?",
        "Hier ja. Der Verlauf bleibt in dieser Erweiterung, in diesem Browser. Die Datenschutzerklärung sagt, wie SpinWheelPlus Daten auf der Website behandelt.",
        privacy,
      ),
    ],
    "Zufallszahl auf SpinWheelPlus öffnen",
    "Die Zahlenziehung auf SpinWheelPlus öffnen",
    pageNote,
  ),
  name: pack(
    "Wofür ist diese Seite da",
    "Diese Seite zieht einen Namen aus deiner Liste, neben der offenen Seite. Einfügen oder importieren, Doppelte übergehen, den gezogenen Namen rausnehmen, Verlauf kopieren oder herunterladen. Die Ziehungen bleiben auf diesem Gerät.",
    [
      feature(
        "list",
        "Die Namensliste",
        "Ein Name pro Zeile. Aus der Zwischenablage einfügen, eine .txt einlesen, die Reihenfolge mischen oder die Liste löschen.",
      ),
      feature(
        "duplicates",
        "Doppelte Namen übergehen",
        "An: nur die erste Zeile jedes Namens zählt (Großschreibung egal). Aus: zusätzliche Zeilen zählen wie Extra-Lose.",
      ),
      feature(
        "remove-winner",
        "Den gezogenen Namen rausnehmen",
        "An: der Name verlässt die Liste nach jeder Ziehung. So holst du den Ersten, den Zweiten und den Dritten.",
      ),
      feature(
        "roll",
        "Das Mischen auf dem Bildschirm",
        "Etwa 2,5 Sekunden Mischen, wenn du willst. Der Name steht schon fest, über crypto.getRandomValues(). Die Bewegung zeigt ihn nur.",
      ),
      feature(
        "history",
        "Verlauf auf diesem Gerät",
        "Die letzten Ziehungen bleiben in diesem Browser (bis 100). Eine Zeile wieder öffnen, einen Namen kopieren oder eine .txt laden.",
      ),
      feature(
        "fairness-audit",
        "Du kannst den Zufall prüfen",
        "Jede Wahl nutzt crypto.getRandomValues() in diesem Browser. Die Testseite zeigt Proben, die du lesen kannst.",
        fairness,
      ),
    ],
    [
      faq(
        "Ist Namen ziehen kostenlos?",
        "Ja. Erweiterung und Werkzeug auf der Website sind für den normalen Gebrauch kostenlos. Zum Ziehen brauchst du kein Konto.",
      ),
      faq(
        "Brauche ich ein Konto, um Namen zu ziehen?",
        "Nein. Liste, Einstellungen und Verlauf bleiben auf diesem Gerät. Bei SpinWheelPlus meldest du dich nur an, wenn du Räder im Konto behalten willst.",
      ),
      faq(
        "Ist die Ziehung fair?",
        "Jede Ziehung nimmt mit crypto.getRandomValues() in diesem Browser einen Platz. Jeder Name in der Gruppe hat dieselbe Chance. Öffne die Testseite, wenn du Proben auf der Website sehen willst.",
        fairness,
      ),
      faq(
        "Kann ich mehrere Namen auf einmal ziehen?",
        "Ein Klick zieht einen Namen. Für mehrere verschiedene Namen schalt Den gezogenen Namen rausnehmen ein und zieh weiter.",
      ),
      faq(
        "Was macht Doppelte Namen übergehen?",
        "Wenn es an ist, zählt nur die erste Zeile jedes Namens. Kopien fallen weg (Großschreibung egal). Wenn es aus ist, zählen wiederholte Zeilen wie Extra-Lose.",
      ),
      faq(
        "Was macht Den gezogenen Namen rausnehmen?",
        "Nach jeder Ziehung verlässt dieser Name die Liste und kann nicht wieder kommen, bis du ihn neu einträgst.",
      ),
      faq(
        "Ändert die Bewegung den Namen?",
        "Nein. Der Name steht in dem Moment fest, in dem du klickst. Die Bewegung zeigt nur etwa 2,5 Sekunden Mischen.",
      ),
      faq(
        "Bleibt die Liste bei mir?",
        "Hier ja. Liste und Verlauf bleiben in dieser Erweiterung, in diesem Browser. Die Datenschutzerklärung sagt, wie SpinWheelPlus Daten auf der Website behandelt.",
        privacy,
      ),
    ],
    "Namen ziehen auf SpinWheelPlus öffnen",
    "Das Namenziehen auf SpinWheelPlus öffnen",
    pageNote,
  ),
  dice: pack(
    "Wofür ist diese Seite da",
    "Diese Seite würfelt mit verschieden vielen Seiten, neben der offenen Seite. Von D4 bis D20 mischen, einen Modifikator dazu oder weg, Verlauf kopieren oder herunterladen. Die Ergebnisse bleiben auf diesem Gerät.",
    [
      feature(
        "table",
        "Die Würfelfläche",
        "Bis 25 Würfel (D4, D6, D8, D10, D12, D20). Klick auf Würfeln oder drück Space. Jede Seite nutzt crypto.getRandomValues().",
      ),
      feature(
        "modifier",
        "Modifikator",
        "Von -99 bis +99 dazu oder weg. Gilt für die Summe, nicht dafür, wie jeder Würfel fällt. Für Proben wie 2d6+3.",
      ),
      feature(
        "setup",
        "Farben und Datei",
        "Öffne einen Würfel und ändere Flächenfarbe, Zeichenfarbe, die Zahlen vom D6, die Punkte oder sechs Wörter. Eine leere Fläche zeigt die Zahl. Unter Datei lädst du die Konfiguration herunter oder öffnest sie. Diese Erweiterung hat keinen Link zum Teilen.",
      ),
      feature(
        "click",
        "Klick auf den Würfel",
        "Ein Klick würfelt alle (so ist es am Anfang), oder du würfelst unter dem Zahnrad einen nach dem anderen.",
      ),
      feature(
        "history",
        "Verlauf auf diesem Gerät",
        "Die letzten Ergebnisse bleiben in diesem Browser (bis 200). Eine .txt laden oder die Liste leeren, bevor die nächste Runde kommt.",
      ),
      feature(
        "fairness-audit",
        "Du kannst den Zufall prüfen",
        "Jede Seite nutzt crypto.getRandomValues() in diesem Browser. Die Testseite zeigt Proben, die du lesen kannst.",
        fairness,
      ),
    ],
    [
      faq(
        "Sind die Würfel kostenlos?",
        "Ja. Erweiterung und Werkzeug auf der Website sind für den normalen Gebrauch kostenlos. Zum Würfeln brauchst du kein Konto.",
      ),
      faq(
        "Kommen die Ergebnisse zufällig?",
        "Ja. Jeder Wurf nimmt Zufallsbytes aus crypto.getRandomValues() in diesem Browser, deshalb hat jede Seite dieselbe Chance. Die Testseite zeigt Proben auf der Website.",
        fairness,
      ),
      faq(
        "Kann ich mehrere Würfel werfen?",
        "Ja. Leg bis 25 Würfel auf die Fläche (von D4 bis D20) und würfle sie zusammen. Ab drei heißt der Knopf Alle würfeln.",
      ),
      faq(
        "Kann ich nur einen Würfel noch einmal werfen?",
        "Ja. Unter den Einstellungen der Fläche stellst du Klick auf den Würfel auf Einen würfeln und klickst diesen Würfel. Am Anfang würfeln alle.",
      ),
      faq(
        "Kann ich einen Modifikator wie 2d6+3 dazuzählen?",
        "Ja. Setz ein +/- in die Zeile zum Hinzufügen (von -99 bis +99). Das gilt für Flächen mit einer Zahl. Ein Ergebnis nur aus Wörtern nutzt den Modifikator nicht.",
      ),
      faq(
        "Kann ich Wörter auf einen D6 schreiben?",
        "Ja. Öffne einen D6 und wähl Wörter. Schreib auf jede Fläche ein Wort, oder nimm Zahl oder Ja / Nein. Eine leere Fläche zeigt weiter die Zahl und zählt in die Summe.",
      ),
      faq(
        "Kann ich die Ergebnisse kopieren oder behalten?",
        "Ja. Kopier die letzte Summe, lad den Verlauf als .txt, oder nutz Datei, um die Konfiguration herunterzuladen und zu öffnen.",
      ),
      faq(
        "Gibt es einen D100?",
        "Einen eigenen D100 gibt es nicht. Nimm einen D10 wie bei Prozenten, oder leg Würfel auf dieselbe Fläche (zum Beispiel 2d10) und lies die Summe selbst.",
      ),
      faq(
        "Bleibt der Verlauf bei mir?",
        "Hier ja. Er bleibt in dieser Erweiterung, in diesem Browser. Die Datenschutzerklärung sagt, wie SpinWheelPlus Daten auf der Website behandelt.",
        privacy,
      ),
    ],
    "Würfel auf SpinWheelPlus öffnen",
    "Die Würfel auf SpinWheelPlus öffnen",
    tableNote,
  ),
  coin: pack(
    "Wofür ist diese Seite da",
    "Diese Seite wirft Münzen neben der offenen Seite. Gold, Silber und Kupfer mischen, eine oder alle werfen, Verlauf kopieren oder herunterladen. Die Würfe bleiben auf diesem Gerät.",
    [
      feature(
        "table",
        "Die Münzfläche",
        "Bis 25 Münzen. Klick auf Werfen oder drück Space. Jeder Wurf nutzt crypto.getRandomValues(), deshalb bleiben Kopf und Zahl bei 50/50.",
      ),
      feature(
        "metals",
        "Gold, Silber und Kupfer",
        "Das Metall wählst du beim Hinlegen, oder du stellst die ganze Fläche auf Ja / Nein, Sieg / Niederlage oder Ungerade / Gerade. Unter Datei lädst du die Konfiguration herunter. Diese Erweiterung hat keinen Link zum Teilen.",
      ),
      feature(
        "click",
        "Klick auf die Münze",
        "Ein Klick wirft alle (so ist es am Anfang), oder du wirfst unter dem Zahnrad eine nach der anderen.",
      ),
      feature(
        "history",
        "Verlauf auf diesem Gerät",
        "Die letzten Würfe bleiben in diesem Browser (bis 200). Eine .txt laden oder die Liste leeren, bevor die nächste Runde kommt.",
      ),
      feature(
        "fairness-audit",
        "Du kannst den Zufall prüfen",
        "Jeder Wurf nutzt crypto.getRandomValues() in diesem Browser. Die Testseite zeigt Proben, die du lesen kannst.",
        fairness,
      ),
    ],
    [
      faq(
        "Ist Münzwurf kostenlos?",
        "Ja. Erweiterung und Werkzeug auf der Website sind für den normalen Gebrauch kostenlos. Zum Werfen brauchst du kein Konto.",
      ),
      faq(
        "Ist Kopf oder Zahl wirklich 50/50?",
        "Ja für ein Spiel, eine Vorführung im Unterricht und Alltagsentscheidungen. Jeder Wurf nimmt Zufallsbytes aus crypto.getRandomValues() in diesem Browser. Die Testseite zeigt Proben. Das ist kein Casino- oder Lotteriegerät.",
        fairness,
      ),
      faq(
        "Kann ich Wörter auf die Münzen setzen?",
        "Ja. Unter Seiten wählst du Ja / Nein, Sieg / Niederlage oder Ungerade / Gerade. Dieses Paar gilt für alle Münzen. Klassisch behält Gold, Silber und Kupfer.",
      ),
      faq(
        "Kann ich mehrere Münzen werfen?",
        "Ja. Leg bis 25 Münzen hin (Gold, Silber oder Kupfer) und wirf sie zusammen. Ab zwei heißt der Knopf Alle werfen.",
      ),
      faq(
        "Kann ich nur eine Münze noch einmal werfen?",
        "Ja. Unter den Einstellungen der Fläche stellst du Klick auf die Münze auf Eine Münze werfen und klickst diese Münze. Am Anfang werfen alle.",
      ),
      faq(
        "Kann ich die Würfe kopieren oder behalten?",
        "Ja. Kopier das letzte Ergebnis, lad den Verlauf als .txt, oder nutz Datei, um die Konfiguration herunterzuladen und zu öffnen.",
      ),
      faq(
        "Bleibt der Verlauf bei mir?",
        "Hier ja. Er bleibt in dieser Erweiterung, in diesem Browser. Die Datenschutzerklärung sagt, wie SpinWheelPlus Daten auf der Website behandelt.",
        privacy,
      ),
    ],
    "Münzwurf auf SpinWheelPlus öffnen",
    "Münzwurf auf SpinWheelPlus öffnen",
    tableNote,
  ),
  yesNo: pack(
    "Wofür ist diese Seite da",
    "Diese Seite zieht Ja, Nein, Vielleicht, Wahr, Falsch oder Sätze, die du geschrieben hast. Frag noch einmal mit Space oder Enter. Der Verlauf bleibt auf diesem Gerät.",
    [
      feature(
        "modes",
        "Vier Arten zu antworten",
        "Ja oder nein (50/50), Ja / Nein / Vielleicht, Wahr / Falsch, oder deine Sätze, einer pro Zeile. Jede Möglichkeit in der Gruppe hat dieselbe Chance.",
      ),
      feature(
        "ask",
        "Noch einmal fragen",
        "Klick auf Noch einmal fragen oder drück Space. Der Zufall ist crypto.getRandomValues().",
      ),
      feature(
        "motion",
        "Bewegung und Ton",
        "Auswahl, Drehen, Ausblenden oder Buchstabe für Buchstabe. Der Ton ist freiwillig. Die Antwort steht fest, bevor die Bewegung anfängt.",
      ),
      feature(
        "history",
        "Verlauf auf diesem Gerät",
        "Die letzten Antworten bleiben in diesem Browser (bis 200). Eine .txt laden oder die Liste leeren.",
      ),
      feature(
        "fairness-audit",
        "Du kannst den Zufall prüfen",
        "Jede Frage nutzt crypto.getRandomValues() in diesem Browser. Die Testseite zeigt Proben, die du lesen kannst.",
        fairness,
      ),
    ],
    [
      faq(
        "Ist dieses Ja oder nein kostenlos?",
        "Ja. Erweiterung und Werkzeug auf der Website sind für den normalen Gebrauch kostenlos. Zum Fragen brauchst du kein Konto.",
      ),
      faq(
        "Sind Ja und Nein 50/50?",
        "Im Modus Ja oder nein ja. Jede Frage kommt aus crypto.getRandomValues() in diesem Browser. Vielleicht hat drei gleiche Wege. Deine Sätze teilen sich gleichmäßig auf die Zeilen, die du geschrieben hast. Die Testseite zeigt Proben.",
        fairness,
      ),
      faq(
        "Kann ich Vielleicht oder meine Sätze nehmen?",
        "Ja. Stell den Modus auf Ja / Nein / Vielleicht, Wahr / Falsch oder deine Sätze.",
      ),
      faq(
        "Ändern Bewegung oder Ton die Antwort?",
        "Nein. Die Wahl steht zuerst. Bewegung und Ton zeigen sie nur.",
      ),
      faq(
        "Kann ich frühere Antworten sehen?",
        "Ja. Die letzten bleiben auf diesem Gerät (bis 200), mit .txt herunterladen, wenn du eine Datei willst.",
      ),
      faq(
        "Taucht das für wichtige Entscheidungen?",
        "Nein. Was wirklich zählt, entscheidest du selbst. Das hier ist zum Loskommen und für kleine Sachen.",
      ),
      faq(
        "Und wenn ich Kopf oder Zahl will?",
        "Nimm Münzwurf in dieser Erweiterung. Für Zahlen nimm Würfel oder Zufallszahl.",
      ),
      faq(
        "Bleibt der Verlauf bei mir?",
        "Hier ja. Er bleibt in dieser Erweiterung, in diesem Browser. Die Datenschutzerklärung sagt, wie SpinWheelPlus Daten auf der Website behandelt.",
        privacy,
      ),
    ],
    "Ja oder nein auf SpinWheelPlus öffnen",
    "Das Werkzeug Ja oder nein auf SpinWheelPlus öffnen",
    pageNote,
  ),
  shuffle: pack(
    "Wofür ist diese Seite da",
    "Diese Seite bringt deine Liste in eine neue Reihenfolge, neben der offenen Seite. Sie zieht keinen einzelnen Namen. Zeilen einfügen oder einlesen, leere und doppelte weg, die Mischung kopieren oder herunterladen. Der Verlauf bleibt auf diesem Gerät.",
    [
      feature(
        "list",
        "Deine Liste",
        "Ein Punkt pro Zeile. Aus der Zwischenablage einfügen, eine .txt einlesen oder die Liste löschen.",
      ),
      feature(
        "ignore-empty",
        "Leere Zeilen übergehen",
        "An: leere Zeilen fallen vor dem Mischen weg. Aus: sie bleiben als Lücken.",
      ),
      feature(
        "duplicates",
        "Doppelte rausnehmen",
        "An: nur die erste Kopie jeder Zeile bleibt (Großschreibung egal). Aus: zusätzliche Kopien bleiben wie Extra-Lose.",
      ),
      feature(
        "sound",
        "Ton beim Zeigen",
        "Ein kurzer Ton, wenn du willst, sobald eine neue Mischung da ist. Die Reihenfolge steht schon fest. Der Ton ändert sie nicht. Aus dem Verlauf öffnen bleibt still.",
      ),
      feature(
        "order",
        "Eine zufällige Reihenfolge",
        "Fisher-Yates mit crypto.getRandomValues() in diesem Browser. Jede volle Reihenfolge der Liste hat dieselbe Chance. Die Testseite zeigt Proben, die du lesen kannst.",
        fairness,
      ),
      feature(
        "history",
        "Verlauf auf diesem Gerät",
        "Die letzten Mischungen bleiben in diesem Browser (bis 50). Eine Karte wieder öffnen, eine Mischung kopieren oder eine .txt laden.",
      ),
    ],
    [
      faq(
        "Ist Liste mischen kostenlos?",
        "Ja. Mischen und kopieren geht ohne Konto. Bei SpinWheelPlus meldest du dich nur an, wenn du später andere Funktionen nutzt.",
      ),
      faq(
        "Wie zufällig ist das?",
        "Fisher-Yates plus der Zufall des Browsers (crypto.getRandomValues()). Kein fester Startwert. Für Unterricht, Besprechung und ein lockeres Ziehen. Eine regulierte Lotterie ist etwas anderes. Die Testseite zeigt Proben.",
        fairness,
      ),
      faq(
        "Was machen die Schalter?",
        "Leere Zeilen übergehen nimmt die Lücken weg. Doppelte rausnehmen behält die erste Kopie jeder Zeile. Hilft nach einem unordentlichen Tabellenexport.",
      ),
      faq(
        "Kann ich zurück?",
        "Ja, unter Letzte Mischungen auf diesem Gerät. Leer den Verlauf, wenn du fertig bist. Wenn du die Browserdaten löschst, ist dieser Verlauf auch weg.",
      ),
      faq(
        "Kann ich noch einmal mischen?",
        "Wann du willst. Jeder Klick ist eine neue Reihenfolge.",
      ),
      faq(
        "Was kann ich in die Liste schreiben?",
        "Namen, Aufgaben, Titel, Lieder, Ideen: eine Sache pro Zeile. Lange Listen mischen sich auch. Mehr als 100 Zeilen vorlesen ist das Schwere, nicht die Rechnung.",
      ),
      faq(
        "Zieht das einen Namen?",
        "Nein. Du bekommst dieselben Punkte in einer anderen Reihenfolge. Nimm Namen ziehen, wenn du nur einen willst.",
      ),
      faq(
        "Bleibt die Liste bei mir?",
        "Hier ja. Liste und Verlauf bleiben in dieser Erweiterung, in diesem Browser. Die Datenschutzerklärung sagt, wie SpinWheelPlus Daten auf der Website behandelt.",
        privacy,
      ),
    ],
    "Liste mischen auf SpinWheelPlus öffnen",
    "Liste mischen auf SpinWheelPlus öffnen",
    pageNote,
  ),
  team: pack(
    "Wofür ist diese Seite da",
    "Diese Seite teilt die Liste in Teams, neben der offenen Seite. Sie zieht keinen Gewinner. Namen einfügen, Kapitäne markieren, Teams bilden, kopieren oder herunterladen. Der Verlauf bleibt auf diesem Gerät.",
    [
      feature(
        "list",
        "Die Namensliste",
        "Ein Name pro Zeile. Einfügen, eine .txt oder .csv einlesen, oder löschen. Die Krone markiert einen Kapitän. Höchstens 300 Namen.",
      ),
      feature(
        "split",
        "Anzahl oder Größe",
        "Teil nach der Zahl der Teams oder nach der Größe, die du willst. Halt die Teams ungefähr gleich groß, oder lass verschiedene Größen zu.",
      ),
      feature(
        "captains",
        "Kapitäne",
        "Jeder Name mit Krone kommt zuerst in ein anderes Team. Der Rest setzt sich drumherum.",
      ),
      feature(
        "adjust",
        "Nach dem Teilen noch ändern",
        "Zieh einen Namen in ein anderes Team, oder wähl das Team im Menü der Zeile. Namen ändern, dann Alles kopieren.",
      ),
      feature(
        "sound",
        "Ton beim Zeigen",
        "Ein kurzer Ton, wenn du willst, sobald eine neue Aufteilung da ist. Aus dem Verlauf öffnen bleibt still.",
      ),
      feature(
        "fairness",
        "Eine zufällige Aufteilung",
        "Fisher-Yates mit crypto.getRandomValues() in diesem Browser. Gleiche Chance, nicht gleicher Spielstärke. Die Testseite zeigt Proben, die du lesen kannst.",
        fairness,
      ),
    ],
    [
      faq(
        "Ist Teams bilden kostenlos?",
        "Ja. Teil so oft du willst. Ein Konto brauchst du nicht.",
      ),
      faq(
        "Werden die Teams fair verteilt?",
        "Die Namen werden mit Fisher-Yates und crypto.getRandomValues() in diesem Browser gemischt. Ungefähr gleich groß lässt die Größen um eine Person auseinander, wenn die Zahlen das hergeben. Gleiche Chance, nicht gleiche Spielstärke. Die Testseite zeigt Proben.",
        fairness,
      ),
      faq(
        "Wie viele Teams kann ich machen?",
        "So viele, wie du Personen hast. Wähl Zahl der Teams oder eine Größe. Mit Kapitänen brauchst du mindestens ein Team pro Kapitän.",
      ),
      faq(
        "Kann ich Kapitäne festlegen?",
        "Ja. Setz die Krone auf einen Namen, schalt Kapitäne nutzen ein, und jeder Kapitän kommt zuerst in ein anderes Team.",
      ),
      faq(
        "Kann ich die Teams danach noch ändern?",
        "Ja. Zieh einen Namen in ein anderes Team, oder wähl das Team im Menü der Zeile. Namen ändern, dann Alles kopieren.",
      ),
      faq(
        "Kann ich noch einmal teilen?",
        "Klick auf Nochmal aufteilen für eine andere Aufteilung. Die früheren bleiben unter Letzte Aufteilungen, wenn du eine wieder öffnen willst.",
      ),
      faq(
        "Zieht das einen Gewinner?",
        "Nein. Du bekommst Gruppen. Nimm Namen ziehen für einen einzelnen Namen, oder Liste mischen für eine neue Reihenfolge ohne Teams.",
      ),
      faq(
        "Bleibt die Liste bei mir?",
        "Hier ja. Namen, Teams und Verlauf bleiben in dieser Erweiterung, in diesem Browser. Die Datenschutzerklärung gilt für die Website.",
        privacy,
      ),
    ],
    "Teams bilden auf SpinWheelPlus öffnen",
    "Teams bilden auf SpinWheelPlus öffnen",
    pageNote,
  ),
};
