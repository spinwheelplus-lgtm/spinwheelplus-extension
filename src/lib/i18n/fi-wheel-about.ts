import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const FI_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "Mihin tämä pyörä on",
  featuresLead:
    "Avoimen sivun vieressä laitat nimet, vaihdat värit ja äänet, ja pyöräytät. Lista pysyy tässä selaimessa. Jos haluat lähettää linkin, laittaa pyörän sivulle tai jättää sen tilillesi, avaa muokkaussivu SpinWheelPlusissa.",
  features: [
    {
      id: "weighted-slices",
      title: "Leveämpi sektori osuu useammin",
      desc: "Jos nimen pitää osua useammin, nosta painoa. Leveä sektori on todennäköisyys. Kuvan lisäät kohdassa Yksi kerrallaan. Jos sektorit eivät ole yhtä suuria, sano se ennen pyöräytystä.",
    },
    {
      id: "images-themes",
      title: "Värit ja kuvat",
      desc: "Valitse värit, reuna, keskusta ja otsikko. Liitä kuva sektoriin. Sivun tausta ja Unsplash ovat muokkaussivulla.",
    },
    {
      id: "sounds-winner",
      title: "Ääni ja tulosruutu",
      desc: "Kuulet äänen pyöriessä ja kun nimi osuu. Lopussa konfetti tai ilotulitus. Sulje tulosruutu tai poista osunut nimi. Seuraavalla kerralla tulee toinen.",
    },
    {
      id: "entries-history",
      title: "Lista ja historia",
      desc: "Kirjoita monta riviä kerralla tai yksi nimi kerrallaan. Sekoita, järjestä, tyhjennä. Historia pysyy tässä selaimessa.",
    },
    {
      id: "beside-tab",
      title: "Pyöräytä avoimen sivun vieressä",
      desc: "Jätä Docs, Meet tai oppitunti auki ja pyöräytä tässä. Paina pyörää tai Space.",
    },
    {
      id: "full-editor",
      title: "Linkki, sivu, tili",
      desc: "Avaa muokkaussivu SpinWheelPlusissa kopioidaksesi linkin, laittaaksesi pyörän sivulle, lisätäksesi taustan tai tallentaaksesi sen tilillesi.",
    },
    {
      id: "fairness-audit",
      title: "Voit tarkistaa, että se on sattumaa",
      desc: "Jokainen pyöräytys käyttää crypto.getRandomValues() tässä selaimessa. Katso testisivu: 111 nimeä, 10 000 pyöräytystä (4 kertaa) ja khii-neliötesti pyörän koon mukaan.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "testisivu",
      linkTitle: "Avaa SpinWheelPlusin testisivu",
    },
  ],
  faqHeading: "Usein kysyttyä",
  faqs: [
    {
      question: "Onko SpinWheelPlus ilmainen?",
      answer:
        "Tavalliseen käyttöön kyllä: tämä laajennus ja sivu sivustolla. Jos joskus tulee maksullista, se on erikseen. Ensimmäinen pyöräytys ei ole maksun takana.",
    },
    {
      question: "Tarvitsenko tilin pyöräyttääkseni?",
      answer:
        "Et. Pyörä on tässä selaimessa. Kirjaudu SpinWheelPlusiin, jos haluat pitää useamman pyörän tililläsi.",
    },
    {
      question: "Tuleeko se oikeasti sattumalta?",
      answer:
        "Jokainen pyöräytys käyttää crypto.getRandomValues() tässä selaimessa, ei lukua jonka joku on valinnut. Katso testisivu: tuhansia pyöräytyksiä. Sopii luokkaan ja livestriimiin. Tämä ei ole luvallinen arvonta.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "testisivu",
      linkTitle: "Avaa SpinWheelPlusin testisivu",
    },
    {
      question: "Mitä paino tekee?",
      answer:
        "Kohdassa Yksi kerrallaan isompi paino vie enemmän pyörästä ja osuu useammin. Kätevä lisäarpoihin tai kun yhdelle nimelle halutaan vähän enemmän mahdollisuutta. Luku näkyy pyörässä. Sivuston koe mittaa vain yhtä suuria sektoreita.",
    },
    {
      question: "Voinko lähettää pyörän jollekulle?",
      answer:
        "Täältä et. Avaa muokkaussivu SpinWheelPlusissa ja kopioi linkki. Se, joka esittää kanssasi, avaa saman pyörän.",
      href: SITE_URL,
      linkLabel: "muokkaussivu SpinWheelPlusissa",
      linkTitle: "Avaa SpinWheelPlusin muokkaussivu",
    },
    {
      question: "Voinko laittaa sen striimiin tai sivulle?",
      answer:
        "Muokkaussivulla laitat sen sivulle tai avaat pyöräytyssivun. Tämä laajennus pysyy välilehden vieressä, jotta pyöräytät samalla kun esität.",
    },
    {
      question: "Missä lista pysyy?",
      answer:
        "Tässä, tämän laajennuksen muistissa, kunnes avaat muokkaussivun ja kosket Jaa- tai Tallenna-painiketta. Älä laita arkaluonteisia oppilastietoja julkiseen linkkiin. Miten tiedot säilyvät ja poistuvat, kertoo tietosuojaseloste.",
      href: SITE_PRIVACY_URL,
      linkLabel: "tietosuojaseloste",
      linkTitle: "SpinWheelPlusin tietosuojaseloste",
    },
    {
      question: "Montako nimeä mahtuu?",
      answer:
        "Enintään 1000. Yli noin 120 sektoria on projektorilla hankala lukea. Jos lista on valtava, tee kaksi pyörää.",
    },
  ],
};
