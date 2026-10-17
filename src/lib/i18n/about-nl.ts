import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import type { AboutPack, ToolAbout } from "@/lib/i18n/about-pack";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
} from "@/lib/constants";

const fairness = {
  href: SITE_FAIRNESS_AUDIT_URL,
  linkLabel: "testpagina",
  linkTitle: "Open de testpagina van SpinWheelPlus",
};

const privacy = {
  href: SITE_PRIVACY_URL,
  linkLabel: "Privacyverklaring",
  linkTitle: "Privacyverklaring van SpinWheelPlus",
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

export const aboutNl: ToolAbout = {
  number: pack(
    "Waar is deze pagina voor",
    "Hier, naast de open pagina, trek je hele getallen. Zet een minimum en een maximum, sla een paar waarden over, trek er één of meer, en kopieer of download daarna de geschiedenis. De trekkingen blijven in deze browser. Dezelfde pagina kun je ook in een tabblad openen als je meer ruimte wilt.",
    [
      feature(
        "range",
        "Van minimum tot maximum",
        "Trekt van -1.000.000 tot 1.000.000. Ligt het minimum hoger dan het maximum, dan mag dat: ik neem van laag naar hoog.",
      ),
      feature(
        "exclude",
        "Getallen die je overslaat",
        "Lootjes die al uit zijn, of codes die je wilt overslaan: schrijf ze met komma's ertussen. Ze blijven buiten tot je ze weghaalt.",
      ),
      feature(
        "batch",
        "Eén of veel",
        "De snelkoppelingen zijn 1, 2, 3, 5 of 10. Met Anders vraag je er tot 500 in één Trek.",
      ),
      feature(
        "repeat",
        "Herhaal in dezelfde trekking",
        "Aan: in die uitslag kan hetzelfde getal twee keer uitkomen. Uit: in die ronde zijn alle getallen verschillend.",
      ),
      feature(
        "roll",
        "Beweging",
        "Als je wilt, schuiven de getallen ongeveer 2,5 seconden over het scherm. Ze zijn al gekozen, met crypto.getRandomValues(). De beweging is alleen om te zien.",
      ),
      feature(
        "history",
        "De geschiedenis blijft hier",
        "Recente trekkingen blijven in deze browser. Open een regel opnieuw, kopieer de laatste uitslag, of download een .txt.",
      ),
      feature(
        "fairness-audit",
        "Je kunt nakijken of het toeval is",
        "Elke trekking gebruikt crypto.getRandomValues() in deze browser. Op de testpagina staan voorbeelden om te lezen.",
        fairness,
      ),
    ],
    [
      faq(
        "Is Willekeurig getal gratis?",
        "Ja. De extensie en de pagina op de site zijn gratis voor gewoon gebruik. Om te trekken heb je geen account nodig.",
      ),
      faq(
        "Heb ik een account nodig?",
        "Nee. Instellingen en geschiedenis blijven in deze browser. Log in bij SpinWheelPlus als je raderen op je account wilt bewaren.",
      ),
      faq(
        "Komen de getallen echt toevallig?",
        "Elke trekking gebruikt crypto.getRandomValues() in deze browser. Elk geheel getal in het bereik heeft dezelfde kans, op zichzelf. De voorbeelden staan op de testpagina.",
        fairness,
      ),
      faq(
        "Welk bereik kan ik gebruiken?",
        "Elk geheel getal van -1.000.000 tot 1.000.000. Een kort bereik is handig voor lootjes. Een breed bereik, voor codes van een steekproef.",
      ),
      faq(
        "Kan ik er meer dan één trekken?",
        "Ja. Gebruik een snelkoppeling, of Anders: tot 500 getallen per Trek.",
      ),
      faq(
        "Kan ik er een paar overslaan?",
        "Ja. Schrijf de getallen die je overslaat, met komma's ertussen. Ze blijven buiten tot je ze wist.",
      ),
      faq(
        "Kan hetzelfde getal twee keer uitkomen?",
        "Ja, als Herhaal in dezelfde trekking aan staat. Staat het uit, dan zijn de getallen in die ronde allemaal verschillend. Vraag je er meer dan er overblijven na de uitsluitingen, dan komt er een melding.",
      ),
      faq(
        "Verandert de beweging de uitslag?",
        "Nee. De getallen zijn al gekozen. Wat je op het scherm ziet, verandert de trekking niet.",
      ),
      faq(
        "Blijft de geschiedenis privé?",
        "Hier wel. Die staat in het geheugen van deze extensie. In de Privacyverklaring staat hoe SpinWheelPlus met gegevens op de site omgaat.",
        privacy,
      ),
    ],
    "Open Willekeurig getal op SpinWheelPlus",
    "Open Willekeurig getal op SpinWheelPlus",
    "Dezelfde pagina, in een browsertabblad.",
  ),
  name: pack(
    "Waar is deze pagina voor",
    "Hier kies je één naam uit een lijst, naast de open pagina. Plak of importeer de namen, sla dubbele over, haal de getrokken naam weg, en kopieer of download daarna de geschiedenis. De keuzes blijven in deze browser.",
    [
      feature(
        "list",
        "Namenlijst",
        "Eén naam per regel. Plak van het klembord, importeer een .txt, schud de volgorde, of maak de lijst leeg.",
      ),
      feature(
        "duplicates",
        "Gelijke namen overslaan",
        "Aan: van elke naam telt alleen de eerste regel. Hoofdletters en kleine letters zijn gelijk. Uit: extra regels tellen als extra lootjes.",
      ),
      feature(
        "remove-winner",
        "Getrokken naam weghalen",
        "Aan: na elke keuze gaat die naam van de lijst. Zo doe je meestal de eerste, de tweede en de derde.",
      ),
      feature(
        "roll",
        "Beweging",
        "Als je wilt, schuiven de namen ongeveer 2,5 seconden over het scherm. De naam is al gekozen, met crypto.getRandomValues(). De beweging is alleen om te zien.",
      ),
      feature(
        "history",
        "De geschiedenis blijft hier",
        "Recente keuzes blijven in deze browser (tot 100). Open een regel opnieuw, kopieer een naam, of download een .txt.",
      ),
      feature(
        "fairness-audit",
        "Je kunt nakijken of het toeval is",
        "Elke keuze gebruikt crypto.getRandomValues() in deze browser. Op de testpagina staan voorbeelden om te lezen.",
        fairness,
      ),
    ],
    [
      faq(
        "Is Kies een naam gratis?",
        "Ja. De extensie en de pagina op de site zijn gratis voor gewoon gebruik. Om te kiezen heb je geen account nodig.",
      ),
      faq(
        "Heb ik een account nodig?",
        "Nee. Lijst, instellingen en geschiedenis blijven in deze browser. Log in bij SpinWheelPlus als je raderen op je account wilt bewaren.",
      ),
      faq(
        "Is de keuze eerlijk?",
        "Elke keuze pakt een plek met crypto.getRandomValues() in deze browser. Elke naam in de groep heeft dezelfde kans. De voorbeelden staan op de testpagina.",
        fairness,
      ),
      faq(
        "Kan ik er meer tegelijk kiezen?",
        "Elke druk kiest er één. Wil je verschillende namen, zet dan Getrokken naam weghalen aan en ga door.",
      ),
      faq(
        "Waar is Gelijke namen overslaan voor?",
        "Staat het aan, dan telt van elke naam alleen de eerste regel. Kopieën tellen niet. Hoofdletters en kleine letters zijn gelijk. Staat het uit, dan tellen herhaalde regels als extra lootjes.",
      ),
      faq(
        "Waar is Getrokken naam weghalen voor?",
        "Na de keuze gaat die naam van de lijst en kan hij niet nog eens uitkomen tot je hem er weer op zet.",
      ),
      faq(
        "Verandert de beweging wie eruit komt?",
        "Nee. De naam is gekozen op het moment dat je drukt. De beweging duurt ongeveer 2,5 seconden en verandert niet wie eruit kwam.",
      ),
      faq(
        "Blijven lijst en geschiedenis privé?",
        "Hier wel. Ze staan in het geheugen van deze extensie. In de Privacyverklaring staat hoe SpinWheelPlus met gegevens op de site omgaat.",
        privacy,
      ),
    ],
    "Open Kies een naam op SpinWheelPlus",
    "Open Kies een naam op SpinWheelPlus",
    "Dezelfde pagina, in een browsertabblad.",
  ),
  dice: pack(
    "Waar is deze pagina voor",
    "Hier gooi je dobbelstenen met meer vlakken, naast de open pagina. Van D4 tot D20, tel een modificatie erbij of haal hem eraf, en kopieer of download daarna de geschiedenis. De resultaten blijven in deze browser.",
    [
      feature(
        "table",
        "Tafel in 3D",
        "Tot 25 dobbelstenen (D4, D6, D8, D10, D12, D20). Druk op Gooi, of op Space. Elk vlak gebruikt crypto.getRandomValues().",
      ),
      feature(
        "modifier",
        "Modificatie",
        "Tel op of trek af van -99 tot +99. Het geldt voor het totaal, niet voor hoe elke steen valt. Handig voor een worp als 2d6+3.",
      ),
      feature(
        "setup",
        "Kleuren en bestand",
        "Open een steen om de kleur van het vlak en de tekens te veranderen, en bij een D6 getallen, stippen of zes woorden. Een leeg vlak toont het getal. Via Bestand download of open je een JSON. Vanuit hier is er geen link om te sturen.",
      ),
      feature(
        "click",
        "Druk op de steen",
        "Eén tik gooit alles (zo staat het aan het begin). Via het tandwiel kun je er één gooien.",
      ),
      feature(
        "history",
        "De geschiedenis blijft hier",
        "Recente resultaten blijven in deze browser (tot 200). Download een .txt, of maak de lijst leeg voor een volgende keer.",
      ),
      feature(
        "fairness-audit",
        "Je kunt nakijken of het toeval is",
        "Elk vlak gebruikt crypto.getRandomValues() in deze browser. Op de testpagina staan voorbeelden om te lezen.",
        fairness,
      ),
    ],
    [
      faq(
        "Zijn de dobbelstenen gratis?",
        "Ja. De extensie en de pagina op de site zijn gratis voor gewoon gebruik. Om te gooien heb je geen account nodig.",
      ),
      faq(
        "Komen de resultaten toevallig?",
        "Ja. Elke worp pakt toevallige bytes uit crypto.getRandomValues() in deze browser, dus elk vlak heeft dezelfde kans. De voorbeelden staan op de testpagina.",
        fairness,
      ),
      faq(
        "Kan ik er meer dan één gooien?",
        "Ja. Zet tot 25 stenen op tafel (van D4 tot D20) en gooi ze samen. Vanaf drie zegt de knop Gooi alles.",
      ),
      faq(
        "Kan ik er één opnieuw gooien?",
        "Ja. Zet in de tafelinstellingen Druk op de steen op Gooi er een, en druk daarna op die steen. Aan het begin gooi je alles.",
      ),
      faq(
        "Kan ik een modificatie zetten, zoals 2d6+3?",
        "Ja. In de rij waar je stenen toevoegt zet je een +/- van -99 tot +99. Dat geldt voor vlakken met een getal. Komt er alleen een woord uit, dan telt de modificatie niet mee.",
      ),
      faq(
        "Kan ik woorden op een D6 zetten?",
        "Ja. Open een D6 en kies Woorden. Schrijf een woord op elk vlak, of gebruik Getal of Ja / Nee. Een leeg vlak toont toch het getal en telt mee in het totaal.",
      ),
      faq(
        "Kan ik resultaten kopiëren of bewaren?",
        "Ja. Kopieer het laatste totaal, download de geschiedenis als .txt, of download en open via Bestand de instellingen als JSON.",
      ),
      faq(
        "Is er een D100?",
        "Er is geen aparte D100. Gebruik een D10 als je de percentielstijl wilt, of zet meer stenen op dezelfde tafel (bijvoorbeeld 2d10) en lees zelf het totaal.",
      ),
      faq(
        "Blijft de worpgeschiedenis privé?",
        "Hier wel. Die staat in het geheugen van deze extensie. In de Privacyverklaring staat hoe SpinWheelPlus met gegevens op de site omgaat.",
        privacy,
      ),
    ],
    "Open Dobbelstenen op SpinWheelPlus",
    "Open Dobbelstenen op SpinWheelPlus",
    "Dezelfde tafel, in een browsertabblad.",
  ),
  coin: pack(
    "Waar is deze pagina voor",
    "Hier gooi je kop of munt op, naast de open pagina. Goud, zilver en koper, één munt of allemaal, en daarna kopieer of download je de geschiedenis. De worpen blijven in deze browser.",
    [
      feature(
        "table",
        "Tafel in 3D",
        "Tot 25 munten. Druk op Opgooien, of op Space. Elke worp gebruikt crypto.getRandomValues(), dus kop en munt blijven 50/50.",
      ),
      feature(
        "metals",
        "Goud, zilver en koper",
        "Kies het metaal als je een munt toevoegt, of zet de hele tafel op Ja / Nee, Win / Verlies of Oneven / Even. Via Bestand download je een JSON. Vanuit hier is er geen link om te sturen.",
      ),
      feature(
        "click",
        "Druk op de munt",
        "Eén tik gooit alles op (zo staat het aan het begin). Via het tandwiel kun je er één opgooien.",
      ),
      feature(
        "history",
        "De geschiedenis blijft hier",
        "Recente worpen blijven in deze browser (tot 200). Download een .txt, of maak de lijst leeg voor een volgende keer.",
      ),
      feature(
        "fairness-audit",
        "Je kunt nakijken of het toeval is",
        "Elke worp gebruikt crypto.getRandomValues() in deze browser. Op de testpagina staan voorbeelden om te lezen.",
        fairness,
      ),
    ],
    [
      faq(
        "Is Kop of munt gratis?",
        "Ja. De extensie en de pagina op de site zijn gratis voor gewoon gebruik. Om op te gooien heb je geen account nodig.",
      ),
      faq(
        "Zijn kop en munt echt 50/50?",
        "Ja voor spel, de klas en gewone keuzes. Elke worp pakt toevallige bytes uit crypto.getRandomValues() in deze browser. Het is geen generator met een casinocertificaat. De voorbeelden staan op de testpagina.",
        fairness,
      ),
      faq(
        "Kan ik woorden op de munten zetten?",
        "Ja. Kies bij Kanten Ja / Nee, Win / Verlies of Oneven / Even. Dat paar geldt voor alle munten. Klassiek houdt goud, zilver en koper.",
      ),
      faq(
        "Kan ik er meer dan één opgooien?",
        "Ja. Zet tot 25 munten neer (goud, zilver of koper) en gooi ze samen op. Vanaf twee zegt de knop Alles opgooien.",
      ),
      faq(
        "Kan ik er één opnieuw opgooien?",
        "Ja. Zet in de tafelinstellingen Druk op de munt op Eén opgooien, en druk daarna op die munt. Aan het begin gooi je alles op.",
      ),
      faq(
        "Kan ik worpen kopiëren of bewaren?",
        "Ja. Kopieer de laatste uitslag, download de geschiedenis als .txt, of download en open via Bestand de instellingen als JSON.",
      ),
      faq(
        "Blijft de worpgeschiedenis privé?",
        "Hier wel. Die staat in het geheugen van deze extensie. In de Privacyverklaring staat hoe SpinWheelPlus met gegevens op de site omgaat.",
        privacy,
      ),
    ],
    "Open Kop of munt op SpinWheelPlus",
    "Open Kop of munt op SpinWheelPlus",
    "Dezelfde tafel, in een browsertabblad.",
  ),
  yesNo: pack(
    "Waar is deze pagina voor",
    "Hier komt Ja, Nee, Misschien, Waar, Onwaar, of een zin die jij hebt geschreven. Vraag opnieuw met Space of Enter. De geschiedenis blijft in deze browser.",
    [
      feature(
        "modes",
        "Vier manieren van antwoorden",
        "Ja of nee (50/50), Ja / Nee / Misschien, Waar / Onwaar, of je eigen zinnen, één per regel. In de groep heeft elke regel dezelfde kans.",
      ),
      feature(
        "ask",
        "Nog een keer vragen",
        "Druk op Nog een keer vragen, of op Space. Het toeval komt uit crypto.getRandomValues().",
      ),
      feature(
        "motion",
        "Beweging en geluid",
        "Keuze, draai, vervagen, of letter voor letter. Het geluid mag uit. Het antwoord is gekozen voordat de beweging start.",
      ),
      feature(
        "history",
        "De geschiedenis blijft hier",
        "Recente antwoorden blijven in deze browser (tot 200). Download een .txt, of maak de lijst leeg.",
      ),
      feature(
        "fairness-audit",
        "Je kunt nakijken of het toeval is",
        "Elke vraag gebruikt crypto.getRandomValues() in deze browser. Op de testpagina staan voorbeelden om te lezen.",
        fairness,
      ),
    ],
    [
      faq(
        "Is Ja of nee gratis?",
        "Ja. De extensie en de pagina op de site zijn gratis voor gewoon gebruik. Om te vragen heb je geen account nodig.",
      ),
      faq(
        "Zijn Ja en Nee 50/50?",
        "In de stand Ja of nee wel. Elke vraag komt uit crypto.getRandomValues() in deze browser. Misschien heeft drie gelijke wegen. Mijn zinnen verdeelt de geschreven regels in gelijke delen. De voorbeelden staan op de testpagina.",
        fairness,
      ),
      faq(
        "Kan ik Misschien of mijn eigen zinnen gebruiken?",
        "Ja. Zet de stand op Ja / Nee / Misschien, Waar / Onwaar, of Mijn zinnen.",
      ),
      faq(
        "Veranderen beweging en geluid het antwoord?",
        "Nee. De keuze is er al. Beweging en geluid laten hem alleen zien.",
      ),
      faq(
        "Kan ik eerdere antwoorden terugzien?",
        "Ja. De laatste blijven in deze browser (tot 200). Wil je een bestand, dan is er .txt downloaden.",
      ),
      faq(
        "Gebruik ik dit voor een belangrijke keuze?",
        "Nee. Voor wat er echt toe doet, beslis je zelf. Dit is om los te komen, en voor lichte keuzes.",
      ),
      faq(
        "En als ik kop of munt wil?",
        "Open Kop of munt in dit paneel. Voor getallen probeer je Dobbelstenen of Willekeurig getal.",
      ),
      faq(
        "Blijft de antwoordgeschiedenis privé?",
        "Hier wel. Die staat in het geheugen van deze extensie. In de Privacyverklaring staat hoe SpinWheelPlus met gegevens op de site omgaat.",
        privacy,
      ),
    ],
    "Open Ja of nee op SpinWheelPlus",
    "Open Ja of nee op SpinWheelPlus",
    "Dezelfde pagina, in een browsertabblad.",
  ),
  shuffle: pack(
    "Waar is deze pagina voor",
    "Hier zet je een lijst in een nieuwe volgorde, naast de open pagina. Er wordt geen winnaar gekozen. Plak of importeer de regels, haal lege regels of dubbele weg, en kopieer of download daarna. De geschiedenis blijft in deze browser.",
    [
      feature(
        "list",
        "Jouw lijst",
        "Eén ding per regel. Plak van het klembord, importeer een .txt, of maak de lijst leeg.",
      ),
      feature(
        "ignore-empty",
        "Lege regels overslaan",
        "Aan: lege regels gaan eruit voor het schudden. Uit: ze blijven als lege plekken.",
      ),
      feature(
        "duplicates",
        "Dubbele weghalen",
        "Aan: van elke regel blijft alleen de eerste kopie. Hoofdletters en kleine letters zijn gelijk. Uit: extra kopieën blijven als extra lootjes.",
      ),
      feature(
        "sound",
        "Geluid als het uitkomt",
        "Een kort geluid, als je wilt, wanneer er een nieuwe volgorde komt. De volgorde is al gekozen. Het geluid verandert hem niet. Open je hem uit de geschiedenis, dan blijft het stil.",
      ),
      feature(
        "order",
        "Een toevallige, eerlijke volgorde",
        "Fisher-Yates met crypto.getRandomValues() in deze browser. Elke volledige volgorde van de lijst is even waarschijnlijk. De voorbeelden staan op de testpagina.",
        fairness,
      ),
      feature(
        "history",
        "De geschiedenis blijft hier",
        "De laatste schudbeurten blijven in deze browser (tot 50). Open een kaart opnieuw, kopieer een volgorde, of download een .txt.",
      ),
    ],
    [
      faq(
        "Is Lijst schudden gratis?",
        "Ja. Schud en kopieer zonder account. Log in bij SpinWheelPlus als je later iets anders gebruikt.",
      ),
      faq(
        "Hoe toevallig is het?",
        "Fisher-Yates plus het toeval van deze browser, crypto.getRandomValues(). Geen vaste zaadwaarde. Prima voor de klas, een vergadering en een lichte trekking. Een gereguleerde loterij is iets anders. De voorbeelden staan op de testpagina.",
        fairness,
      ),
      faq(
        "Wat doen de instellingen?",
        "Lege regels overslaan haalt witregels weg. Dubbele weghalen houdt de eerste kopie van elke regel. Handig na een slordig werkblad.",
      ),
      faq(
        "Kan ik terug?",
        "Ja, bij Laatste schudbeurten, in deze browser. Wis de geschiedenis als je klaar bent. Wis je de browsergegevens, dan is die geschiedenis weg.",
      ),
      faq(
        "Kan ik nog een keer schudden?",
        "Wanneer je wilt. Elke druk is een nieuwe volgorde.",
      ),
      faq(
        "Wat zet ik erop?",
        "Namen, taken, titels, liedjes, ideeën: één ding per regel. Ook lange lijsten schudden. Meer dan 100 regels hardop voorlezen is het lastige deel, niet het tellen.",
      ),
      faq(
        "Kiest dit een winnaar?",
        "Nee. Je krijgt dezelfde dingen in een andere volgorde. Wil je er één, open dan Kies een naam.",
      ),
      faq(
        "Blijven lijst en geschiedenis privé?",
        "Hier wel. Ze staan in het geheugen van deze extensie. In de Privacyverklaring staat hoe SpinWheelPlus met gegevens op de site omgaat.",
        privacy,
      ),
    ],
    "Open Lijst schudden op SpinWheelPlus",
    "Open Lijst schudden op SpinWheelPlus",
    "Dezelfde pagina, in een browsertabblad.",
  ),
  team: pack(
    "Waar is deze pagina voor",
    "Hier verdeel je een lijst in teams, naast de open pagina. Er wordt geen winnaar gekozen. Plak de namen, zet kapiteins, verdeel, en kopieer of download daarna. De geschiedenis blijft in deze browser.",
    [
      feature(
        "list",
        "Namenlijst",
        "Eén naam per regel. Plak, importeer een .txt of een .csv, of maak leeg. De kroon zet een kapitein. Het maximum is 300 namen.",
      ),
      feature(
        "split",
        "Hoeveel teams, of hoeveel mensen",
        "Verdeel op aantal teams, of op hoeveel mensen je in elk team wilt. Houd de aantallen gelijk, of laat ze verschillen.",
      ),
      feature(
        "captains",
        "Kapiteins",
        "Elke naam met de kroon komt eerst in een ander team. De rest schuift eromheen.",
      ),
      feature(
        "adjust",
        "Daarna nog schuiven",
        "Sleep een naam naar een ander team, of kies het team in het menu van de regel. Verander de naam, en daarna Kopieer alles.",
      ),
      feature(
        "sound",
        "Geluid als het uitkomt",
        "Een kort geluid, als je wilt, wanneer er een nieuwe verdeling komt. Open je hem uit de geschiedenis, dan blijft het stil.",
      ),
      feature(
        "fairness",
        "Een toevallige, eerlijke verdeling",
        "Fisher-Yates met crypto.getRandomValues() in deze browser. Dat is eerlijkheid van kans, niet van niveau. De voorbeelden staan op de testpagina.",
        fairness,
      ),
    ],
    [
      faq(
        "Is Teams maken gratis?",
        "Ja. Verdeel zo vaak je wilt. Je hebt geen account nodig.",
      ),
      faq(
        "Zijn de teams eerlijk?",
        "De namen worden geschud met Fisher-Yates en crypto.getRandomValues() in deze browser. Aantallen gelijk houden laat de teams op één persoon verschil uitkomen, als de aantallen dat toelaten. Dat is eerlijkheid van kans, niet van niveau. De voorbeelden staan op de testpagina.",
        fairness,
      ),
      faq(
        "Hoeveel teams kan ik maken?",
        "Zoveel als er mensen zijn. Kies Hoeveel teams, of Mensen per team. Met kapiteins aan heb je minstens één team per kapitein nodig.",
      ),
      faq(
        "Kan ik kapiteins zetten?",
        "Ja. Zet de kroon op een naam, zet Kapiteins gebruiken aan, en elke kapitein komt eerst in een ander team.",
      ),
      faq(
        "Kan ik ze daarna nog schuiven?",
        "Ja. Sleep een naam naar een ander team, of kies het team in het menu van de regel. Verander de naam, en daarna Kopieer alles.",
      ),
      faq(
        "Kan ik het overdoen?",
        "Druk op Opnieuw verdelen voor een andere verdeling. Eerdere blijven bij Laatste verdelingen, als je er een wilt openen.",
      ),
      faq(
        "Kiest dit een winnaar?",
        "Nee. Je krijgt groepen. Voor één naam open je Kies een naam. Voor een nieuwe volgorde zonder teams open je Lijst schudden.",
      ),
      faq(
        "Blijven lijst en geschiedenis privé?",
        "Hier wel. Namen, teams en geschiedenis staan in het geheugen van deze extensie. De Privacyverklaring gaat over de site.",
        privacy,
      ),
    ],
    "Open Teams maken op SpinWheelPlus",
    "Open Teams maken op SpinWheelPlus",
    "Dezelfde pagina, in een browsertabblad.",
  ),
};
