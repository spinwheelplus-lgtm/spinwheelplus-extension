import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import type { AboutPack, ToolAbout } from "@/lib/i18n/about-pack";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
} from "@/lib/constants";

const fairness = {
  href: SITE_FAIRNESS_AUDIT_URL,
  linkLabel: "pagina di prova",
  linkTitle: "Apri la pagina di prova di SpinWheelPlus",
};

const privacy = {
  href: SITE_PRIVACY_URL,
  linkLabel: "Informativa sulla privacy",
  linkTitle: "Informativa sulla privacy di SpinWheelPlus",
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

export const aboutIt: ToolAbout = {
  number: pack(
    "A cosa serve questa pagina",
    "Qui, accanto alla pagina aperta, estrai numeri interi. Metti un minimo e un massimo, lascia fuori qualche valore, estrai uno o più numeri, poi copia o scarica lo storico. Le estrazioni restano su questo browser. La stessa pagina si apre anche in una scheda, se ti serve più spazio.",
    [
      feature(
        "range",
        "Dal minimo al massimo",
        "Estrae da -1.000.000 a 1.000.000. Se il minimo è più alto del massimo, va bene lo stesso: prendo dal più basso al più alto.",
      ),
      feature(
        "exclude",
        "Numeri da lasciare fuori",
        "Biglietti già usciti, o codici da saltare: scrivili separati da virgole. Restano fuori finché non li togli.",
      ),
      feature(
        "batch",
        "Uno o tanti",
        "Le scorciatoie sono 1, 2, 3, 5 o 10. Con Altro ne chiedi fino a 500 in un solo Estrai.",
      ),
      feature(
        "repeat",
        "Ripeti nello stesso estratto",
        "Acceso: in quel risultato lo stesso numero può uscire due volte. Spento: in quel giro i numeri sono tutti diversi.",
      ),
      feature(
        "roll",
        "Movimento",
        "Se vuoi, per circa 2,5 secondi i numeri si mescolano a video. Sono già scelti, con crypto.getRandomValues(). Il movimento è solo da vedere.",
      ),
      feature(
        "history",
        "Lo storico resta qui",
        "Le estrazioni recenti restano in questo browser. Riapri una riga, copia l'ultimo risultato, o scarica un .txt.",
      ),
      feature(
        "fairness-audit",
        "Puoi controllare se è a caso",
        "Ogni estrazione usa crypto.getRandomValues() in questo browser. Sulla pagina di prova ci sono campioni da leggere.",
        fairness,
      ),
    ],
    [
      faq(
        "Numero casuale è gratis?",
        "Sì. L'estensione e la pagina sul sito sono gratis per l'uso di tutti i giorni. Per estrarre non serve un account.",
      ),
      faq(
        "Mi serve un account?",
        "No. Impostazioni e storico restano su questo browser. Entra in SpinWheelPlus solo se vuoi salvare delle ruote sull'account.",
      ),
      faq(
        "I numeri escono davvero a caso?",
        "Ogni estrazione usa crypto.getRandomValues() in questo browser. Ogni intero dell'intervallo ha la stessa probabilità, da solo. I campioni stanno sulla pagina di prova.",
        fairness,
      ),
      faq(
        "Che intervallo posso usare?",
        "Qualsiasi intero da -1.000.000 a 1.000.000. Uno corto va bene per i biglietti. Uno largo, per i codici di un campione.",
      ),
      faq(
        "Posso estrarne più di uno?",
        "Sì. Usa una scorciatoia, oppure Altro: fino a 500 numeri per ogni Estrai.",
      ),
      faq(
        "Posso lasciarne fuori qualcuno?",
        "Sì. Scrivi i numeri da lasciare fuori, separati da virgole. Restano fuori finché non li cancelli.",
      ),
      faq(
        "Lo stesso numero può uscire due volte?",
        "Sì, se Ripeti nello stesso estratto è acceso. Se è spento, in quel giro i numeri sono tutti diversi. Se ne chiedi più di quelli rimasti dopo le esclusioni, compare un avviso.",
      ),
      faq(
        "Il movimento cambia il risultato?",
        "No. I numeri sono già scelti. Quello che vedi sullo schermo non cambia l'estrazione.",
      ),
      faq(
        "Lo storico resta privato?",
        "Qui, sì. Sta nella memoria di questa estensione. L'Informativa sulla privacy dice come SpinWheelPlus tratta i dati sul sito.",
        privacy,
      ),
    ],
    "Apri Numero casuale su SpinWheelPlus",
    "Apri Numero casuale su SpinWheelPlus",
    "La stessa pagina, in una scheda del browser.",
  ),
  name: pack(
    "A cosa serve questa pagina",
    "Qui scegli un nome da un elenco, accanto alla pagina aperta. Incolla o importa i nomi, salta i doppioni, togli il nome uscito, poi copia o scarica lo storico. Le scelte restano su questo browser.",
    [
      feature(
        "list",
        "Elenco dei nomi",
        "Un nome per riga. Incolla dagli appunti, importa un .txt, mescola l'ordine, o svuota l'elenco.",
      ),
      feature(
        "duplicates",
        "Salta i nomi uguali",
        "Acceso: di ogni nome conta solo la prima riga. Maiuscole e minuscole sono uguali. Spento: le righe in più valgono come biglietti in più.",
      ),
      feature(
        "remove-winner",
        "Togli il nome uscito",
        "Acceso: dopo ogni scelta quel nome esce dall'elenco. È il modo solito per il primo, il secondo e il terzo.",
      ),
      feature(
        "roll",
        "Movimento",
        "Se vuoi, per circa 2,5 secondi i nomi si mescolano a video. Il nome è già scelto, con crypto.getRandomValues(). Il movimento è solo da vedere.",
      ),
      feature(
        "history",
        "Lo storico resta qui",
        "Le scelte recenti restano in questo browser (fino a 100). Riapri una riga, copia un nome, o scarica un .txt.",
      ),
      feature(
        "fairness-audit",
        "Puoi controllare se è a caso",
        "Ogni scelta usa crypto.getRandomValues() in questo browser. Sulla pagina di prova ci sono campioni da leggere.",
        fairness,
      ),
    ],
    [
      faq(
        "Scegli un nome è gratis?",
        "Sì. L'estensione e la pagina sul sito sono gratis per l'uso di tutti i giorni. Per scegliere non serve un account.",
      ),
      faq(
        "Mi serve un account?",
        "No. Elenco, impostazioni e storico restano su questo browser. Entra in SpinWheelPlus solo se vuoi salvare delle ruote sull'account.",
      ),
      faq(
        "La scelta è equa?",
        "Ogni scelta prende un posto a caso con crypto.getRandomValues() in questo browser. Ogni nome del gruppo ha la stessa probabilità. I campioni stanno sulla pagina di prova.",
        fairness,
      ),
      faq(
        "Posso sceglierne più di uno insieme?",
        "Ogni pressione ne sceglie uno. Per averne diversi, accendi Togli il nome uscito e continua.",
      ),
      faq(
        "Salta i nomi uguali a cosa serve?",
        "Se è acceso, di ogni nome conta solo la prima riga. Le copie non contano. Maiuscole e minuscole sono uguali. Se è spento, le righe ripetute valgono come biglietti in più.",
      ),
      faq(
        "Togli il nome uscito a cosa serve?",
        "Dopo la scelta, quel nome esce dall'elenco e non può uscire di nuovo finché non lo rimetti.",
      ),
      faq(
        "Il movimento cambia chi esce?",
        "No. Il nome è scelto nel momento in cui premi. Il movimento dura circa 2,5 secondi e non cambia chi è uscito.",
      ),
      faq(
        "Elenco e storico restano privati?",
        "Qui, sì. Stanno nella memoria di questa estensione. L'Informativa sulla privacy dice come SpinWheelPlus tratta i dati sul sito.",
        privacy,
      ),
    ],
    "Apri Scegli un nome su SpinWheelPlus",
    "Apri Scegli un nome su SpinWheelPlus",
    "La stessa pagina, in una scheda del browser.",
  ),
  dice: pack(
    "A cosa serve questa pagina",
    "Qui tiri dadi con più facce, accanto alla pagina aperta. Dal D4 al D20, somma o togli un modificatore, poi copia o scarica lo storico. I risultati restano su questo browser.",
    [
      feature(
        "table",
        "Tavolo in 3D",
        "Fino a 25 dadi (D4, D6, D8, D10, D12, D20). Premi Tira, oppure Space. Ogni faccia usa crypto.getRandomValues().",
      ),
      feature(
        "modifier",
        "Modificatore",
        "Somma o togli da -99 a +99. Vale sul totale, non su come cade ogni dado. Utile per un tiro tipo 2d6+3.",
      ),
      feature(
        "setup",
        "Colori e file",
        "Apri un dado per cambiare il colore della faccia e dei segni, e sul D6 numeri, punti o sei parole. Una faccia vuota mostra il numero. Dal menu File scarichi o apri un JSON. Da qui non c'è un link da mandare.",
      ),
      feature(
        "click",
        "Premi sul dado",
        "Un tocco tira tutti (è così all'inizio). Dal menu dell'ingranaggio puoi tirarne uno solo.",
      ),
      feature(
        "history",
        "Lo storico resta qui",
        "I risultati recenti restano in questo browser (fino a 200). Scarica un .txt, o svuota la lista per un'altra volta.",
      ),
      feature(
        "fairness-audit",
        "Puoi controllare se è a caso",
        "Ogni faccia usa crypto.getRandomValues() in questo browser. Sulla pagina di prova ci sono campioni da leggere.",
        fairness,
      ),
    ],
    [
      faq(
        "I dadi sono gratis?",
        "Sì. L'estensione e la pagina sul sito sono gratis per l'uso di tutti i giorni. Per tirare non serve un account.",
      ),
      faq(
        "I risultati escono a caso?",
        "Sì. Ogni tiro prende byte a caso da crypto.getRandomValues() in questo browser, quindi ogni faccia ha la stessa probabilità. I campioni stanno sulla pagina di prova.",
        fairness,
      ),
      faq(
        "Posso tirarne più di uno?",
        "Sì. Metti fino a 25 dadi sul tavolo (dal D4 al D20) e tirali insieme. Da tre in su, il pulsante dice Tira tutti.",
      ),
      faq(
        "Posso ritirarne uno solo?",
        "Sì. Nelle impostazioni del tavolo metti Premi sul dado su Tira uno, poi premi quel dado. All'inizio si tirano tutti.",
      ),
      faq(
        "Posso aggiungere un modificatore tipo 2d6+3?",
        "Sì. Nella riga dove aggiungi i dadi metti un +/- da -99 a +99. Vale sulle facce con un numero. Se esce solo una parola, il modificatore non entra.",
      ),
      faq(
        "Posso scrivere parole su un D6?",
        "Sì. Apri un D6 e scegli Parole. Scrivi una parola su ogni faccia, oppure usa Numero o Sì / No. Una faccia vuota mostra comunque il numero e conta nel totale.",
      ),
      faq(
        "Posso copiare o salvare i risultati?",
        "Sì. Copia l'ultimo totale, scarica lo storico in .txt, oppure dal menu File scarichi e apri le impostazioni in JSON.",
      ),
      faq(
        "C'è un D100?",
        "Non c'è un dado D100 a parte. Usa un D10 se ti serve lo stile percentili, oppure metti più dadi sullo stesso tavolo (per esempio 2d10) e leggi tu il totale.",
      ),
      faq(
        "Lo storico dei tiri resta privato?",
        "Qui, sì. Sta nella memoria di questa estensione. L'Informativa sulla privacy dice come SpinWheelPlus tratta i dati sul sito.",
        privacy,
      ),
    ],
    "Apri Dadi su SpinWheelPlus",
    "Apri Dadi su SpinWheelPlus",
    "Lo stesso tavolo, in una scheda del browser.",
  ),
  coin: pack(
    "A cosa serve questa pagina",
    "Qui lanci testa o croce, accanto alla pagina aperta. Oro, argento e rame, una moneta o tutte, poi copia o scarica lo storico. I lanci restano su questo browser.",
    [
      feature(
        "table",
        "Tavolo in 3D",
        "Fino a 25 monete. Premi Lancia, oppure Space. Ogni lancio usa crypto.getRandomValues(), quindi testa e croce restano 50/50.",
      ),
      feature(
        "metals",
        "Oro, argento e rame",
        "Scegli il metallo quando aggiungi una moneta, oppure passa tutto il tavolo a Sì / No, Vinci / Perdi o Dispari / Pari. Dal menu File scarichi un JSON. Da qui non c'è un link da mandare.",
      ),
      feature(
        "click",
        "Premi sulla moneta",
        "Un tocco lancia tutte (è così all'inizio). Dal menu dell'ingranaggio puoi lanciarne una sola.",
      ),
      feature(
        "history",
        "Lo storico resta qui",
        "I lanci recenti restano in questo browser (fino a 200). Scarica un .txt, o svuota la lista per un'altra volta.",
      ),
      feature(
        "fairness-audit",
        "Puoi controllare se è a caso",
        "Ogni lancio usa crypto.getRandomValues() in questo browser. Sulla pagina di prova ci sono campioni da leggere.",
        fairness,
      ),
    ],
    [
      faq(
        "Testa o croce è gratis?",
        "Sì. L'estensione e la pagina sul sito sono gratis per l'uso di tutti i giorni. Per lanciare non serve un account.",
      ),
      faq(
        "Testa e croce sono davvero 50/50?",
        "Sì per i giochi, la classe e le scelte di tutti i giorni. Ogni lancio prende byte a caso da crypto.getRandomValues() in questo browser. Non è un generatore certificato da un casinò. I campioni stanno sulla pagina di prova.",
        fairness,
      ),
      faq(
        "Posso scrivere parole sulle monete?",
        "Sì. In Facce scegli Sì / No, Vinci / Perdi o Dispari / Pari. Quella coppia vale per tutte le monete. Classica tiene oro, argento e rame.",
      ),
      faq(
        "Posso lanciarne più di una?",
        "Sì. Metti fino a 25 monete (oro, argento o rame) e lanciale insieme. Da due in su, il pulsante dice Lancia tutte.",
      ),
      faq(
        "Posso rilanciarne una sola?",
        "Sì. Nelle impostazioni del tavolo metti Premi sulla moneta su Lancia una, poi premi quella moneta. All'inizio si lanciano tutte.",
      ),
      faq(
        "Posso copiare o salvare i lanci?",
        "Sì. Copia l'ultimo risultato, scarica lo storico in .txt, oppure dal menu File scarichi e apri le impostazioni in JSON.",
      ),
      faq(
        "Lo storico dei lanci resta privato?",
        "Qui, sì. Sta nella memoria di questa estensione. L'Informativa sulla privacy dice come SpinWheelPlus tratta i dati sul sito.",
        privacy,
      ),
    ],
    "Apri Testa o croce su SpinWheelPlus",
    "Apri Testa o croce su SpinWheelPlus",
    "Lo stesso tavolo, in una scheda del browser.",
  ),
  yesNo: pack(
    "A cosa serve questa pagina",
    "Qui esce Sì, No, Forse, Vero, Falso, oppure una frase che hai scritto tu. Chiedi di nuovo con Space o Invio. Lo storico resta su questo browser.",
    [
      feature(
        "modes",
        "Quattro modi di rispondere",
        "Sì o no (50/50), Sì / No / Forse, Vero / Falso, oppure le tue frasi, una per riga. Nel gruppo, ogni voce ha la stessa probabilità.",
      ),
      feature(
        "ask",
        "Chiedi di nuovo",
        "Premi Chiedi di nuovo, oppure Space. Il caso viene da crypto.getRandomValues().",
      ),
      feature(
        "motion",
        "Movimento e suono",
        "Scelta, giro, sfumatura, o una lettera alla volta. Il suono si può spegnere. La risposta è scelta prima che parta il movimento.",
      ),
      feature(
        "history",
        "Lo storico resta qui",
        "Le risposte recenti restano in questo browser (fino a 200). Scarica un .txt, o svuota la lista.",
      ),
      feature(
        "fairness-audit",
        "Puoi controllare se è a caso",
        "Ogni domanda usa crypto.getRandomValues() in questo browser. Sulla pagina di prova ci sono campioni da leggere.",
        fairness,
      ),
    ],
    [
      faq(
        "Sì o no è gratis?",
        "Sì. L'estensione e la pagina sul sito sono gratis per l'uso di tutti i giorni. Per chiedere non serve un account.",
      ),
      faq(
        "Sì e No sono 50/50?",
        "Nel modo Sì o no, sì. Ogni domanda esce da crypto.getRandomValues() in questo browser. Forse ha tre strade uguali. Le mie frasi dividono in parti uguali le righe che hai scritto. I campioni stanno sulla pagina di prova.",
        fairness,
      ),
      faq(
        "Posso usare Forse o le mie frasi?",
        "Sì. Cambia modo su Sì / No / Forse, Vero / Falso, o Le mie frasi.",
      ),
      faq(
        "Movimento e suono cambiano la risposta?",
        "No. La scelta avviene prima. Movimento e suono la fanno solo vedere.",
      ),
      faq(
        "Posso rivedere le risposte?",
        "Sì. Le ultime restano su questo browser (fino a 200). Se ti serve un file, c'è Scarica .txt.",
      ),
      faq(
        "Lo uso per una decisione importante?",
        "No. Per quello che conta davvero, decidi tu. Qui serve a sbloccarsi, e alle scelte leggere.",
      ),
      faq(
        "E se voglio testa o croce?",
        "Apri Testa o croce in questo pannello. Per i numeri, prova Dadi o Numero casuale.",
      ),
      faq(
        "Lo storico delle risposte resta privato?",
        "Qui, sì. Sta nella memoria di questa estensione. L'Informativa sulla privacy dice come SpinWheelPlus tratta i dati sul sito.",
        privacy,
      ),
    ],
    "Apri Sì o no su SpinWheelPlus",
    "Apri Sì o no su SpinWheelPlus",
    "La stessa pagina, in una scheda del browser.",
  ),
  shuffle: pack(
    "A cosa serve questa pagina",
    "Qui metti una lista in un ordine nuovo, accanto alla pagina aperta. Non sceglie un vincitore. Incolla o importa le righe, togli i vuoti o i doppioni, poi copia o scarica. Lo storico resta su questo browser.",
    [
      feature(
        "list",
        "La tua lista",
        "Una cosa per riga. Incolla dagli appunti, importa un .txt, o svuota la lista.",
      ),
      feature(
        "ignore-empty",
        "Salta le righe vuote",
        "Acceso: le righe vuote escono prima del mescolamento. Spento: restano come spazi vuoti.",
      ),
      feature(
        "duplicates",
        "Togli i doppioni",
        "Acceso: di ogni riga resta solo la prima copia. Maiuscole e minuscole sono uguali. Spento: le copie in più restano come biglietti in più.",
      ),
      feature(
        "sound",
        "Suono quando esce",
        "Un suono corto, se vuoi, quando compare un ordine nuovo. L'ordine è già scelto. Il suono non lo cambia. Se lo riapri dallo storico, niente suono.",
      ),
      feature(
        "order",
        "Un ordine a caso, equo",
        "Fisher-Yates con crypto.getRandomValues() in questo browser. Ogni ordine completo della lista è ugualmente probabile. I campioni stanno sulla pagina di prova.",
        fairness,
      ),
      feature(
        "history",
        "Lo storico resta qui",
        "Gli ultimi mescolamenti restano in questo browser (fino a 50). Riapri una scheda, copia un ordine, o scarica un .txt.",
      ),
    ],
    [
      faq(
        "Mescola la lista è gratis?",
        "Sì. Mescola e copia senza account. Entra in SpinWheelPlus solo se più avanti usi altro.",
      ),
      faq(
        "Quanto è a caso?",
        "Fisher-Yates più il caso di questo browser, crypto.getRandomValues(). Non è un seme fisso. Va bene in classe, in riunione e per un'estrazione leggera. Una lotteria regolamentata è un'altra cosa. I campioni stanno sulla pagina di prova.",
        fairness,
      ),
      faq(
        "Le impostazioni cosa fanno?",
        "Salta le righe vuote toglie gli spazi bianchi. Togli i doppioni tiene la prima copia di ogni riga. Utile dopo un foglio disordinato.",
      ),
      faq(
        "Posso tornare indietro?",
        "Sì, in Ultimi mescolamenti, su questo browser. Cancella lo storico quando hai finito. Se cancelli i dati del browser, quello storico sparisce.",
      ),
      faq(
        "Posso mescolare di nuovo?",
        "Quando vuoi. Ogni pressione è un ordine nuovo.",
      ),
      faq(
        "Cosa ci metto?",
        "Nomi, compiti, titoli, canzoni, idee: una cosa per riga. Anche le liste lunghe si mescolano. Leggerne più di 100 ad alta voce è la parte difficile, non il conto.",
      ),
      faq(
        "Sceglie un vincitore?",
        "No. Ti restituisce le stesse cose in un altro ordine. Se te ne serve una sola, apri Scegli un nome.",
      ),
      faq(
        "Lista e storico restano privati?",
        "Qui, sì. Stanno nella memoria di questa estensione. L'Informativa sulla privacy dice come SpinWheelPlus tratta i dati sul sito.",
        privacy,
      ),
    ],
    "Apri Mescola la lista su SpinWheelPlus",
    "Apri Mescola la lista su SpinWheelPlus",
    "La stessa pagina, in una scheda del browser.",
  ),
  team: pack(
    "A cosa serve questa pagina",
    "Qui dividi un elenco in squadre, accanto alla pagina aperta. Non sceglie un vincitore. Incolla i nomi, segna i capitani, dividi, poi copia o scarica. Lo storico resta su questo browser.",
    [
      feature(
        "list",
        "Elenco dei nomi",
        "Un nome per riga. Incolla, importa un .txt o un .csv, o svuota. La corona segna un capitano. Il massimo è 300 nomi.",
      ),
      feature(
        "split",
        "Quante squadre, o quante persone",
        "Dividi per numero di squadre, oppure per quante persone vuoi in ciascuna. Tieni i numeri pari, oppure lasciali diversi.",
      ),
      feature(
        "captains",
        "Capitani",
        "Ogni nome con la corona finisce prima in una squadra diversa. Gli altri si sistemano intorno.",
      ),
      feature(
        "adjust",
        "Sistemi dopo",
        "Trascina un nome in un'altra squadra, oppure scegli la squadra dal menu della riga. Cambia il nome, poi Copia tutto.",
      ),
      feature(
        "sound",
        "Suono quando esce",
        "Un suono corto, se vuoi, quando compare una divisione nuova. Se la riapri dallo storico, niente suono.",
      ),
      feature(
        "fairness",
        "Una divisione a caso, equa",
        "Fisher-Yates con crypto.getRandomValues() in questo browser. È equità di probabilità, non di livello. I campioni stanno sulla pagina di prova.",
        fairness,
      ),
    ],
    [
      faq(
        "Forma le squadre è gratis?",
        "Sì. Dividi quante volte vuoi. Non serve un account.",
      ),
      faq(
        "Le squadre sono eque?",
        "I nomi si mescolano con Fisher-Yates e crypto.getRandomValues() in questo browser. Tieni i numeri pari lascia le squadre a una persona di differenza, quando i conti lo permettono. È equità di probabilità, non di livello. I campioni stanno sulla pagina di prova.",
        fairness,
      ),
      faq(
        "Quante squadre posso fare?",
        "Tante quante sono le persone. Scegli Quante squadre, oppure Persone per squadra. Con i capitani accesi, serve almeno una squadra per capitano.",
      ),
      faq(
        "Posso mettere i capitani?",
        "Sì. Metti la corona su un nome, accendi Usa i capitani, e ogni capitano finisce prima in una squadra diversa.",
      ),
      faq(
        "Posso sistemarle dopo?",
        "Sì. Trascina un nome in un'altra squadra, oppure scegli la squadra dal menu della riga. Cambia il nome, poi Copia tutto.",
      ),
      faq(
        "Posso rifare?",
        "Premi Dividi di nuovo per un'altra divisione. Quelle di prima restano in Ultime divisioni, se ne vuoi riaprire una.",
      ),
      faq(
        "Sceglie un vincitore?",
        "No. Ti dà dei gruppi. Per un solo nome apri Scegli un nome. Per un ordine nuovo senza squadre, apri Mescola la lista.",
      ),
      faq(
        "Elenco e storico restano privati?",
        "Qui, sì. Nomi, squadre e storico stanno nella memoria di questa estensione. L'Informativa sulla privacy copre il sito.",
        privacy,
      ),
    ],
    "Apri Forma le squadre su SpinWheelPlus",
    "Apri Forma le squadre su SpinWheelPlus",
    "La stessa pagina, in una scheda del browser.",
  ),
};
