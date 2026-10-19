import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import type { AboutPack, ToolAbout } from "@/lib/i18n/about-pack";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
} from "@/lib/constants";

const fairness = {
  href: SITE_FAIRNESS_AUDIT_URL,
  linkLabel: "testisivu",
  linkTitle: "Avaa SpinWheelPlusin testisivu",
};

const privacy = {
  href: SITE_PRIVACY_URL,
  linkLabel: "tietosuojaseloste",
  linkTitle: "SpinWheelPlusin tietosuojaseloste",
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

const note = "Sama sivu, selaimen välilehdessä.";

export const aboutFi: ToolAbout = {
  number: pack(
    "Mihin tämä sivu on",
    "Tässä, avoimen sivun vieressä, arvot kokonaislukuja. Aseta pienin ja suurin, ohita muutama arvo, arvo yksi tai useampi, ja kopioi tai lataa historia. Arvonnat pysyvät tässä selaimessa. Jos haluat enemmän tilaa, avaa sama sivu välilehteen.",
    [
      feature("range", "Pienimmästä suurimpaan", "Arpoo väliltä -1 000 000 ja 1 000 000. Jos pienin on isompi kuin suurin, se käy: otan pienestä suureen."),
      feature("exclude", "Luvut, jotka ohitat", "Jo osuneet arvat tai koodit, jotka haluat ohittaa: kirjoita ne pilkuilla. Ne pysyvät ulkona, kunnes poistat ne."),
      feature("batch", "Yksi tai monta", "Pikavalinnat ovat 1, 2, 3, 5 tai 10. Kohdassa Muu pyydät jopa 500 yhdellä Arvo-painalluksella."),
      feature("repeat", "Saa toistua samassa arvonnassa", "Päällä: samassa tuloksessa sama luku voi osua kahdesti. Pois: sillä kierroksella kaikki luvut ovat eri."),
      feature("roll", "Liike", "Jos haluat, luvut liukuvat näytöllä noin 2,5 sekuntia. Ne on jo valittu, funktiolla crypto.getRandomValues(). Liike on vain katsottavaksi."),
      feature("history", "Historia pysyy tässä", "Viimeisimmät arvonnat pysyvät tässä selaimessa. Avaa rivi uudelleen, kopioi viimeisin tulos tai lataa .txt."),
      feature("fairness-audit", "Voit tarkistaa, että se on sattumaa", "Jokainen arvonta käyttää crypto.getRandomValues() tässä selaimessa. Luettavat esimerkit: testisivu.", fairness),
    ],
    [
      faq("Onko Satunnainen luku ilmainen?", "Kyllä. Laajennus ja sivu sivustolla ovat ilmaisia tavalliseen käyttöön. Arvomiseen et tarvitse tiliä."),
      faq("Tarvitsenko tilin?", "Et. Asetukset ja historia pysyvät tässä selaimessa. Kirjaudu SpinWheelPlusiin, jos haluat pitää pyöriä tililläsi."),
      faq("Tulevatko luvut oikeasti sattumalta?", "Jokainen arvonta käyttää crypto.getRandomValues() tässä selaimessa. Jokaisella kokonaisluvulla välillä on sama mahdollisuus, itsenäisesti. Esimerkit: testisivu.", fairness),
      faq("Mitä väliä voin käyttää?", "Mitä tahansa kokonaislukua väliltä -1 000 000 ja 1 000 000. Lyhyt väli sopii arpoihin. Leveä väli, otannan koodeihin."),
      faq("Voinko arpoa enemmän kuin yhden?", "Kyllä. Käytä pikavalintaa tai Muu: jopa 500 lukua per Arvo."),
      faq("Voinko ohittaa muutaman?", "Kyllä. Kirjoita ohitettavat luvut pilkuilla. Ne pysyvät ulkona, kunnes tyhjennät ne."),
      faq("Voiko sama luku osua kahdesti?", "Kyllä, jos Saa toistua samassa arvonnassa on päällä. Jos se on pois, luvut sillä kierroksella ovat kaikki eri. Jos pyydät enemmän kuin ohitusten jälkeen jää, tulee ilmoitus."),
      faq("Muuttaako liike tuloksen?", "Ei. Luvut on jo valittu. Se mitä näet näytöllä, ei muuta arvontaa."),
      faq("Pysyykö historia yksityisenä?", "Tässä kyllä. Se on tämän laajennuksen muistissa. Miten SpinWheelPlus käsittelee tietoja sivustolla, kertoo tietosuojaseloste.", privacy),
    ],
    "Avaa Satunnainen luku SpinWheelPlusissa",
    "Avaa Satunnainen luku SpinWheelPlusissa",
    note,
  ),
  name: pack(
    "Mihin tämä sivu on",
    "Tässä arvot yhden nimen listasta, avoimen sivun vieressä. Liitä tai tuo nimet, ohita kaksoiskappaleet, poista osunut nimi, ja kopioi tai lataa historia. Arvonnat pysyvät tässä selaimessa.",
    [
      feature("list", "Nimilista", "Yksi nimi riville. Liitä leikepöydältä, tuo .txt, sekoita järjestys tai tyhjennä lista."),
      feature("duplicates", "Ohita samat nimet", "Päällä: jokaisesta nimestä lasketaan vain ensimmäinen rivi. Isot ja pienet kirjaimet ovat sama nimi. Pois: ylimääräiset rivit laskevat ylimääräisiksi arvoiksi."),
      feature("remove-winner", "Poista osunut nimi", "Päällä: jokaisen arvonnan jälkeen se nimi lähtee listalta. Näin teet yleensä ensimmäisen, toisen ja kolmannen."),
      feature("roll", "Liike", "Jos haluat, nimet liukuvat näytöllä noin 2,5 sekuntia. Nimi on jo valittu, funktiolla crypto.getRandomValues(). Liike on vain katsottavaksi."),
      feature("history", "Historia pysyy tässä", "Viimeisimmät arvonnat pysyvät tässä selaimessa (enintään 100). Avaa rivi uudelleen, kopioi nimi tai lataa .txt."),
      feature("fairness-audit", "Voit tarkistaa, että se on sattumaa", "Jokainen arvonta käyttää crypto.getRandomValues() tässä selaimessa. Luettavat esimerkit: testisivu.", fairness),
    ],
    [
      faq("Onko Arvo nimi ilmainen?", "Kyllä. Laajennus ja sivu sivustolla ovat ilmaisia tavalliseen käyttöön. Arvomiseen et tarvitse tiliä."),
      faq("Tarvitsenko tilin?", "Et. Lista, asetukset ja historia pysyvät tässä selaimessa. Kirjaudu SpinWheelPlusiin, jos haluat pitää pyöriä tililläsi."),
      faq("Onko arvonta reilu?", "Jokainen arvonta ottaa paikan funktiolla crypto.getRandomValues() tässä selaimessa. Jokaisella nimellä ryhmässä on sama mahdollisuus. Esimerkit: testisivu.", fairness),
      faq("Voinko arpoa useamman kerralla?", "Jokainen painallus arpoo yhden. Jos haluat eri nimiä, laita Poista osunut nimi päälle ja jatka."),
      faq("Mihin Ohita samat nimet on?", "Kun se on päällä, jokaisesta nimestä lasketaan vain ensimmäinen rivi. Kopiot eivät laske. Isot ja pienet kirjaimet ovat sama nimi. Kun se on pois, toistuvat rivit laskevat ylimääräisiksi arvoiksi."),
      faq("Mihin Poista osunut nimi on?", "Arvonnan jälkeen se nimi lähtee listalta eikä voi osua uudelleen, ennen kuin lisäät sen takaisin."),
      faq("Muuttaako liike sen, kuka osuu?", "Ei. Nimi on valittu sillä hetkellä kun painat. Liike kestää noin 2,5 sekuntia eikä muuta, kuka osui."),
      faq("Pysyvätkö lista ja historia yksityisinä?", "Tässä kyllä. Ne ovat tämän laajennuksen muistissa. Miten SpinWheelPlus käsittelee tietoja sivustolla, kertoo tietosuojaseloste.", privacy),
    ],
    "Avaa Arvo nimi SpinWheelPlusissa",
    "Avaa Arvo nimi SpinWheelPlusissa",
    note,
  ),
  dice: pack(
    "Mihin tämä sivu on",
    "Tässä heität noppia, joissa on useampi tahko, avoimen sivun vieressä. D4:stä D20:een, lisää tai vähennä lisäys, ja kopioi tai lataa historia. Tulokset pysyvät tässä selaimessa.",
    [
      feature("table", "Pöytä 3D:nä", "Enintään 25 noppaa (D4, D6, D8, D10, D12, D20). Paina Heitä tai Space. Jokainen tahko käyttää crypto.getRandomValues()."),
      feature("modifier", "Lisäys", "Lisää tai vähennä väliltä -99 ja +99. Se koskee summaa, ei sitä miten kukin noppa kaatuu. Kätevä heittoon kuten 2d6+3."),
      feature("setup", "Värit ja tiedosto", "Avaa noppa vaihtaaksesi tahkon ja merkkien värin, ja D6:lle numerot, pisteet tai kuusi sanaa. Tyhjä tahko näyttää numeron. Tiedosto lataa tai avaa JSON-tiedoston. Täältä ei ole linkkiä lähetettäväksi."),
      feature("click", "Paina noppaa", "Yksi painallus heittää kaikki (näin se on aluksi). Rattaasta voit heittää yhden."),
      feature("history", "Historia pysyy tässä", "Viimeisimmät tulokset pysyvät tässä selaimessa (enintään 200). Lataa .txt tai tyhjennä lista seuraavaa kertaa varten."),
      feature("fairness-audit", "Voit tarkistaa, että se on sattumaa", "Jokainen tahko käyttää crypto.getRandomValues() tässä selaimessa. Luettavat esimerkit: testisivu.", fairness),
    ],
    [
      faq("Ovatko nopat ilmaisia?", "Kyllä. Laajennus ja sivu sivustolla ovat ilmaisia tavalliseen käyttöön. Heittämiseen et tarvitse tiliä."),
      faq("Tulevatko tulokset sattumalta?", "Kyllä. Jokainen heitto ottaa satunnaisia tavuja funktiosta crypto.getRandomValues() tässä selaimessa, joten jokaisella tahkolla on sama mahdollisuus. Esimerkit: testisivu.", fairness),
      faq("Voinko heittää enemmän kuin yhden?", "Kyllä. Laita pöydälle jopa 25 noppaa (D4:stä D20:een) ja heitä ne yhdessä. Kolmesta alkaen nappi sanoo Heitä kaikki."),
      faq("Voinko heittää yhden uudelleen?", "Kyllä. Laita pöydän asetuksissa Paina noppaa asentoon Heitä yksi, ja paina sitten sitä noppaa. Aluksi heität kaikki."),
      faq("Voinko laittaa lisäyksen, kuten 2d6+3?", "Kyllä. Rivillä jolla lisäät noppia laitat +/- väliltä -99 ja +99. Se koskee tahkoja, joissa on numero. Jos tulee vain sana, lisäys ei laske."),
      faq("Voinko laittaa sanoja D6:lle?", "Kyllä. Avaa D6 ja valitse Sanat. Kirjoita sana joka tahkolle, tai käytä Numero tai Kyllä / Ei. Tyhjä tahko näyttää silti numeron ja laskee summaan."),
      faq("Voinko kopioida tai tallentaa tuloksia?", "Kyllä. Kopioi viimeisin summa, lataa historia .txt-tiedostona, tai lataa ja avaa Tiedoston kautta asetukset JSON-tiedostona."),
      faq("Onko D100?", "Erillistä D100:aa ei ole. Käytä D10:tä jos haluat persentiilityylin, tai laita useampi noppa samalle pöydälle (esimerkiksi 2d10) ja lue summa itse."),
      faq("Pysyykö heittohistoria yksityisenä?", "Tässä kyllä. Se on tämän laajennuksen muistissa. Miten SpinWheelPlus käsittelee tietoja sivustolla, kertoo tietosuojaseloste.", privacy),
    ],
    "Avaa Nopat SpinWheelPlusissa",
    "Avaa Nopat SpinWheelPlusissa",
    "Sama pöytä, selaimen välilehdessä.",
  ),
  coin: pack(
    "Mihin tämä sivu on",
    "Tässä heität kruunaa tai klaavaa, avoimen sivun vieressä. Kulta, hopea ja kupari, yksi kolikko tai kaikki, ja sitten kopioit tai lataat historian. Heitot pysyvät tässä selaimessa.",
    [
      feature("table", "Pöytä 3D:nä", "Enintään 25 kolikkoa. Paina Heitä tai Space. Jokainen heitto käyttää crypto.getRandomValues(), joten kruuna ja klaava pysyvät 50/50."),
      feature("metals", "Kulta, hopea ja kupari", "Valitse metalli kun lisäät kolikon, tai laita koko pöytä asentoon Kyllä / Ei, Voitto / Häviö tai Pariton / Parillinen. Tiedosto lataa JSON-tiedoston. Täältä ei ole linkkiä lähetettäväksi."),
      feature("click", "Paina kolikkoa", "Yksi painallus heittää kaikki (näin se on aluksi). Rattaasta voit heittää yhden."),
      feature("history", "Historia pysyy tässä", "Viimeisimmät heitot pysyvät tässä selaimessa (enintään 200). Lataa .txt tai tyhjennä lista seuraavaa kertaa varten."),
      feature("fairness-audit", "Voit tarkistaa, että se on sattumaa", "Jokainen heitto käyttää crypto.getRandomValues() tässä selaimessa. Luettavat esimerkit: testisivu.", fairness),
    ],
    [
      faq("Onko Kruuna tai klaava ilmainen?", "Kyllä. Laajennus ja sivu sivustolla ovat ilmaisia tavalliseen käyttöön. Heittämiseen et tarvitse tiliä."),
      faq("Ovatko kruuna ja klaava oikeasti 50/50?", "Peliin, luokkaan ja tavallisiin valintoihin kyllä. Jokainen heitto ottaa satunnaisia tavuja funktiosta crypto.getRandomValues() tässä selaimessa. Tämä ei ole kasinon sertifioima generaattori. Esimerkit: testisivu.", fairness),
      faq("Voinko laittaa sanoja kolikoihin?", "Kyllä. Valitse Puolet-kohdasta Kyllä / Ei, Voitto / Häviö tai Pariton / Parillinen. Se pari koskee kaikkia kolikoita. Klassinen pitää kullan, hopean ja kuparin."),
      faq("Voinko heittää enemmän kuin yhden?", "Kyllä. Laita jopa 25 kolikkoa (kulta, hopea tai kupari) ja heitä ne yhdessä. Kahdesta alkaen nappi sanoo Heitä kaikki."),
      faq("Voinko heittää yhden uudelleen?", "Kyllä. Laita pöydän asetuksissa Paina kolikkoa asentoon Heitä yksi, ja paina sitten sitä kolikkoa. Aluksi heität kaikki."),
      faq("Voinko kopioida tai tallentaa heittoja?", "Kyllä. Kopioi viimeisin tulos, lataa historia .txt-tiedostona, tai lataa ja avaa Tiedoston kautta asetukset JSON-tiedostona."),
      faq("Pysyykö heittohistoria yksityisenä?", "Tässä kyllä. Se on tämän laajennuksen muistissa. Miten SpinWheelPlus käsittelee tietoja sivustolla, kertoo tietosuojaseloste.", privacy),
    ],
    "Avaa Kruuna tai klaava SpinWheelPlusissa",
    "Avaa Kruuna tai klaava SpinWheelPlusissa",
    "Sama pöytä, selaimen välilehdessä.",
  ),
  yesNo: pack(
    "Mihin tämä sivu on",
    "Tässä tulee Kyllä, Ei, Ehkä, Totta, Ei totta, tai lause jonka olet kirjoittanut. Kysy uudelleen Spacella tai Enterillä. Historia pysyy tässä selaimessa.",
    [
      feature("modes", "Neljä tapaa vastata", "Kyllä tai ei (50/50), Kyllä / Ei / Ehkä, Totta / Ei totta, tai omat lauseesi, yksi riville. Ryhmässä jokaisella rivillä on sama mahdollisuus."),
      feature("ask", "Kysy uudelleen", "Paina Kysy uudelleen tai Space. Sattuma tulee funktiosta crypto.getRandomValues()."),
      feature("motion", "Liike ja ääni", "Valinta, kääntö, häivytys tai kirjain kerrallaan. Äänen saa pois. Vastaus on valittu ennen kuin liike alkaa."),
      feature("history", "Historia pysyy tässä", "Viimeisimmät vastaukset pysyvät tässä selaimessa (enintään 200). Lataa .txt tai tyhjennä lista."),
      feature("fairness-audit", "Voit tarkistaa, että se on sattumaa", "Jokainen kysymys käyttää crypto.getRandomValues() tässä selaimessa. Luettavat esimerkit: testisivu.", fairness),
    ],
    [
      faq("Onko Kyllä tai ei ilmainen?", "Kyllä. Laajennus ja sivu sivustolla ovat ilmaisia tavalliseen käyttöön. Kysymiseen et tarvitse tiliä."),
      faq("Ovatko Kyllä ja Ei 50/50?", "Asennossa Kyllä tai ei kyllä. Jokainen kysymys tulee funktiosta crypto.getRandomValues() tässä selaimessa. Ehkä antaa kolme yhtä suurta tietä. Omat lauseet jakaa kirjoitetut rivit tasan. Esimerkit: testisivu.", fairness),
      faq("Voinko käyttää Ehkä tai omia lauseita?", "Kyllä. Laita asento Kyllä / Ei / Ehkä, Totta / Ei totta tai Omat lauseet."),
      faq("Muuttavatko liike ja ääni vastauksen?", "Eivät. Valinta on jo tehty. Liike ja ääni vain näyttävät sen."),
      faq("Voinko katsoa aiempia vastauksia?", "Kyllä. Viimeisimmät pysyvät tässä selaimessa (enintään 200). Jos haluat tiedoston, on Lataa .txt."),
      faq("Käytänkö tätä tärkeään valintaan?", "Et. Siihen mikä oikeasti merkitsee, päätät itse. Tämä on irrottautumiseen ja kevyisiin valintoihin."),
      faq("Entä jos haluan kruunan tai klaavan?", "Avaa Kruuna tai klaava tässä paneelissa. Luvuille kokeile Nopat tai Satunnainen luku."),
      faq("Pysyykö vastaushistoria yksityisenä?", "Tässä kyllä. Se on tämän laajennuksen muistissa. Miten SpinWheelPlus käsittelee tietoja sivustolla, kertoo tietosuojaseloste.", privacy),
    ],
    "Avaa Kyllä tai ei SpinWheelPlusissa",
    "Avaa Kyllä tai ei SpinWheelPlusissa",
    note,
  ),
  shuffle: pack(
    "Mihin tämä sivu on",
    "Tässä laitat listan uuteen järjestykseen, avoimen sivun vieressä. Voittajaa ei valita. Liitä tai tuo rivit, poista tyhjät rivit tai kaksoiskappaleet, ja kopioi tai lataa. Historia pysyy tässä selaimessa.",
    [
      feature("list", "Sinun listasi", "Yksi asia riville. Liitä leikepöydältä, tuo .txt tai tyhjennä lista."),
      feature("ignore-empty", "Ohita tyhjät rivit", "Päällä: tyhjät rivit lähtevät ennen sekoitusta. Pois: ne jäävät tyhjiksi paikoiksi."),
      feature("duplicates", "Poista kaksoiskappaleet", "Päällä: jokaisesta rivistä jää vain ensimmäinen kopio. Isot ja pienet kirjaimet ovat sama. Pois: ylimääräiset kopiot jäävät ylimääräisiksi arvoiksi."),
      feature("sound", "Ääni kun järjestys tulee", "Lyhyt ääni, jos haluat, kun uusi järjestys tulee. Järjestys on jo valittu. Ääni ei muuta sitä. Historiasta avattuna se on hiljaa."),
      feature("order", "Satunnainen, reilu järjestys", "Fisher-Yates funktiolla crypto.getRandomValues() tässä selaimessa. Jokainen täysi järjestys listasta on yhtä todennäköinen. Esimerkit: testisivu.", fairness),
      feature("history", "Historia pysyy tässä", "Viimeisimmät sekoitukset pysyvät tässä selaimessa (enintään 50). Avaa kortti uudelleen, kopioi järjestys tai lataa .txt."),
    ],
    [
      faq("Onko Sekoita lista ilmainen?", "Kyllä. Sekoita ja kopioi ilman tiliä. Kirjaudu SpinWheelPlusiin, jos myöhemmin käytät jotain muuta."),
      faq("Kuinka satunnainen se on?", "Fisher-Yates plus tämän selaimen sattuma, crypto.getRandomValues(). Ei kiinteää siementä. Sopii luokkaan, kokoukseen ja kevyeen arvontaan. Säännelty arvonta on eri asia. Esimerkit: testisivu.", fairness),
      faq("Mitä asetukset tekevät?", "Ohita tyhjät rivit poistaa tyhjät rivit. Poista kaksoiskappaleet pitää jokaisen rivin ensimmäisen kopion. Kätevä sotkuisen taulukon jälkeen."),
      faq("Voinko palata?", "Kyllä, kohdassa Viimeisimmät sekoitukset, tässä selaimessa. Tyhjennä historia kun olet valmis. Jos tyhjennät selaimen tiedot, se historia katoaa."),
      faq("Voinko sekoittaa uudelleen?", "Milloin vain. Jokainen painallus on uusi järjestys."),
      faq("Mitä laitan siihen?", "Nimiä, tehtäviä, otsikoita, lauluja, ideoita: yksi asia riville. Pitkätkin listat sekoittuvat. Yli 100 rivin lukeminen ääneen on hankala osa, ei laskeminen."),
      faq("Valitseeko tämä voittajan?", "Ei. Saat samat asiat eri järjestyksessä. Jos haluat yhden, avaa Arvo nimi."),
      faq("Pysyvätkö lista ja historia yksityisinä?", "Tässä kyllä. Ne ovat tämän laajennuksen muistissa. Miten SpinWheelPlus käsittelee tietoja sivustolla, kertoo tietosuojaseloste.", privacy),
    ],
    "Avaa Sekoita lista SpinWheelPlusissa",
    "Avaa Sekoita lista SpinWheelPlusissa",
    note,
  ),
  team: pack(
    "Mihin tämä sivu on",
    "Tässä jaat listan joukkueisiin, avoimen sivun vieressä. Voittajaa ei valita. Liitä nimet, laita kapteenit, jaa, ja kopioi tai lataa. Historia pysyy tässä selaimessa.",
    [
      feature("list", "Nimilista", "Yksi nimi riville. Liitä, tuo .txt tai .csv, tai tyhjennä. Kruunu tekee kapteenin. Enintään 300 nimeä."),
      feature("split", "Montako joukkuetta, tai montako ihmistä", "Jaa joukkueiden määrän mukaan, tai sen mukaan montako ihmistä haluat kuhunkin. Pidä määrät lähellä, tai anna niiden erota."),
      feature("captains", "Kapteenit", "Jokainen nimi jolla on kruunu menee ensin eri joukkueeseen. Loput täyttyvät ympärille."),
      feature("adjust", "Sen jälkeen vielä siirto", "Vedä nimi toiseen joukkueeseen, tai valitse joukkue rivin valikosta. Vaihda nimi, ja sitten Kopioi kaikki."),
      feature("sound", "Ääni kun joukkueet tulevat", "Lyhyt ääni, jos haluat, kun uusi jako tulee. Historiasta avattuna se on hiljaa."),
      feature("fairness", "Satunnainen, reilu jako", "Fisher-Yates funktiolla crypto.getRandomValues() tässä selaimessa. Se on mahdollisuuden reiluutta, ei tason. Esimerkit: testisivu.", fairness),
    ],
    [
      faq("Onko Jaa joukkueisiin ilmainen?", "Kyllä. Jaa niin usein kuin haluat. Et tarvitse tiliä."),
      faq("Ovatko joukkueet reiluja?", "Nimet sekoitetaan Fisher-Yatesilla ja funktiolla crypto.getRandomValues() tässä selaimessa. Pidä määrät lähellä jättää joukkueet yhden ihmisen eroon, kun määrät sen sallivat. Se on mahdollisuuden reiluutta, ei tason. Esimerkit: testisivu.", fairness),
      faq("Montako joukkuetta voin tehdä?", "Niin monta kuin ihmisiä on. Valitse Montako joukkuetta tai Ihmisiä joukkueessa. Kun kapteenit ovat päällä, tarvitset vähintään yhden joukkueen kapteenia kohti."),
      faq("Voinko laittaa kapteeneja?", "Kyllä. Laita kruunu nimelle, laita Käytä kapteeneja päälle, ja jokainen kapteeni menee ensin eri joukkueeseen."),
      faq("Voinko siirtää heitä sen jälkeen?", "Kyllä. Vedä nimi toiseen joukkueeseen, tai valitse joukkue rivin valikosta. Vaihda nimi, ja sitten Kopioi kaikki."),
      faq("Voinko tehdä uudelleen?", "Paina Jaa uudelleen saadaksesi toisen jaon. Aiemmat pysyvät kohdassa Viimeisimmät jaot, jos haluat avata jonkin."),
      faq("Valitseeko tämä voittajan?", "Ei. Saat ryhmiä. Yhdelle nimelle avaa Arvo nimi. Uuteen järjestykseen ilman joukkueita avaa Sekoita lista."),
      faq("Pysyvätkö lista ja historia yksityisinä?", "Tässä kyllä. Nimet, joukkueet ja historia ovat tämän laajennuksen muistissa. Sivustoa koskee tietosuojaseloste.", privacy),
    ],
    "Avaa Jaa joukkueisiin SpinWheelPlusissa",
    "Avaa Jaa joukkueisiin SpinWheelPlusissa",
    note,
  ),
};
