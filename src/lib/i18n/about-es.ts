import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import type { AboutPack, ToolAbout } from "@/lib/i18n/about-pack";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
} from "@/lib/constants";

const fairness = {
  href: SITE_FAIRNESS_AUDIT_URL,
  linkLabel: "página de prueba",
  linkTitle: "Abrir la página de prueba de SpinWheelPlus",
};

const privacy = {
  href: SITE_PRIVACY_URL,
  linkLabel: "Política de privacidad",
  linkTitle: "Política de privacidad de SpinWheelPlus",
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

const ctaNote = "La misma herramienta, abierta en una pestaña del navegador.";

export const aboutEs: ToolAbout = {
  number: pack(
    "Para qué sirve esta página",
    "Esta página saca números enteros en el rango que tú eliges. Puedes dejar fuera algunos, sacar uno o muchos, y copiar o bajar el historial. El historial se queda en este aparato. Si quieres verla más grande, abre la misma herramienta en SpinWheelPlus.",
    [
      feature(
        "range",
        "Del número chico al grande",
        "Saca enteros de -1,000,000 a 1,000,000. Si el chico queda más alto que el grande, la página igual funciona y entiende cuál es cuál.",
      ),
      feature(
        "exclude",
        "Dejar fuera algunos números",
        "Escríbelos separados por comas. Esos no salen, hasta que los borres de la casilla.",
      ),
      feature(
        "batch",
        "Uno o varios",
        "Puedes elegir 1, 2, 3, 5 o 10. O escribir tú la cantidad, hasta 500 por toque.",
      ),
      feature(
        "repeat",
        "Que se repita en la misma vez",
        "Prendido: el mismo número puede salir dos veces en ese resultado. Apagado: en esa vez todos son distintos.",
      ),
      feature(
        "roll",
        "Animación antes del número",
        "Puedes prender unos 2,5 segundos en los que los números corren. El número ya se eligió antes, con crypto.getRandomValues(). Lo que corre es solo para ver.",
      ),
      feature(
        "history",
        "El historial se queda aquí",
        "Los números recientes se quedan en este navegador. Toca una línea para verla de nuevo, copia el último resultado o baja un .txt.",
      ),
      feature(
        "fairness-audit",
        "Puedes revisar si es al azar",
        "Cada número usa crypto.getRandomValues() en este navegador. La muestra está en la página de prueba.",
        fairness,
      ),
    ],
    [
      faq("¿Sacar un número cuesta?", "No. En esta extensión no hace falta una cuenta."),
      faq(
        "¿Necesito una cuenta?",
        "No. Las opciones y el historial se quedan en este aparato. Entra en SpinWheelPlus solo si quieres guardar una rueda en tu cuenta.",
      ),
      faq(
        "¿Los números salen de verdad al azar?",
        "Sí. Cada vez usa crypto.getRandomValues() en este navegador. Cada entero del rango tiene la misma chance. La muestra está en la página de prueba.",
        fairness,
      ),
      faq(
        "¿Qué rango puedo usar?",
        "Enteros de -1,000,000 a 1,000,000. Un rango corto sirve para un sorteo. Uno ancho sirve cuando necesitas un número de ejemplo.",
      ),
      faq(
        "¿Puedo sacar varios de una vez?",
        "Sí. Usa una cantidad lista o escribe la tuya, hasta 500 por toque.",
      ),
      faq(
        "¿Puedo dejar fuera algunos números?",
        "Sí. Escríbelos con comas en la casilla. No salen hasta que los borres de ahí.",
      ),
      faq(
        "¿El mismo número puede salir dos veces en un toque?",
        "Sí, si prendes permitir repetidos. Si lo apagas, en esa vez todos son distintos. Si pides más números distintos de los que quedan, la página te avisa que no puede.",
      ),
      faq(
        "¿La animación cambia el número?",
        "No. En cuanto tocas, el número ya está. Lo que corre en la pantalla es solo para ver.",
      ),
      faq(
        "¿El historial se manda a algún lado?",
        "No. Se queda en la memoria de la extensión, en este navegador. Cómo trata los datos el sitio está en la Política de privacidad.",
        privacy,
      ),
    ],
    "Abrir Número al azar en SpinWheelPlus",
    "Abrir Número al azar en SpinWheelPlus",
    ctaNote,
  ),
  name: pack(
    "Para qué sirve esta página",
    "Esta página elige un nombre de la lista que escribes. Puedes quitar repetidos, quitar el que acaba de salir, y copiar o bajar el historial. El historial se queda en este aparato. Si quieres verla más grande, abre la misma herramienta en SpinWheelPlus.",
    [
      feature(
        "list",
        "La lista de nombres",
        "Un nombre por línea. Pega, abre un .txt, mezcla el orden o borra todo.",
      ),
      feature(
        "duplicates",
        "Quitar nombres repetidos",
        "Prendido: cada nombre cuenta solo la primera línea, sin importar mayúsculas. Apagado: las líneas iguales se quedan, como un boleto extra.",
      ),
      feature(
        "remove-winner",
        "Quitar el nombre que salió",
        "Prendido: el nombre que acaba de salir se va de la lista. Sirve para sacar primero, segundo y tercero.",
      ),
      feature(
        "roll",
        "Animación antes del nombre",
        "Puedes prender unos 2,5 segundos en los que los nombres corren. El nombre ya se eligió antes, con crypto.getRandomValues(). Lo que corre es solo para ver.",
      ),
      feature(
        "history",
        "El historial se queda aquí",
        "Los nombres recientes se quedan en este navegador (hasta 100). Toca una línea para verla de nuevo, copia el nombre o baja un .txt.",
      ),
      feature(
        "fairness-audit",
        "Puedes revisar si es al azar",
        "Cada elección usa crypto.getRandomValues() en este navegador. La muestra está en la página de prueba.",
        fairness,
      ),
    ],
    [
      faq("¿Elegir un nombre cuesta?", "No. En esta extensión no hace falta una cuenta."),
      faq(
        "¿Necesito una cuenta?",
        "No. La lista y el historial se quedan en este aparato. Entra en SpinWheelPlus solo si quieres guardar una rueda en tu cuenta.",
      ),
      faq(
        "¿Cada nombre tiene la misma chance?",
        "Sí. Cada vez usa crypto.getRandomValues() en este navegador. Cada nombre de la lista tiene la misma chance. La muestra está en la página de prueba.",
        fairness,
      ),
      faq(
        "¿Puedo sacar varios nombres de una vez?",
        "Cada toque saca uno. Si no quieres repetir, prende Quitar el nombre que salió y sigue.",
      ),
      faq(
        "¿Para qué sirve quitar repetidos?",
        "Prendido, cada nombre cuenta solo la primera línea, sin importar mayúsculas. Apagado, las líneas iguales se quedan, como un boleto extra.",
      ),
      faq(
        "¿Para qué sirve quitar el que salió?",
        "Después de cada elección, ese nombre se va de la lista y no vuelve a salir hasta que lo agregues otra vez.",
      ),
      faq(
        "¿La animación cambia el nombre?",
        "No. En cuanto tocas, el nombre ya está. La animación solo corre unos 2,5 segundos en la pantalla.",
      ),
      faq(
        "¿La lista y el historial se mandan a algún lado?",
        "No. Se quedan en la memoria de la extensión, en este navegador. Cómo trata los datos el sitio está en la Política de privacidad.",
        privacy,
      ),
    ],
    "Abrir Elegir un nombre en SpinWheelPlus",
    "Abrir Elegir un nombre en SpinWheelPlus",
    ctaNote,
  ),
  dice: pack(
    "Para qué sirve esta página",
    "Esta página tira dados de varias caras. Agrega de D4 a D20, suma o resta un número, y copia o baja el historial. El historial se queda en este aparato. Si quieres verla más grande, abre la misma herramienta en SpinWheelPlus.",
    [
      feature(
        "table",
        "La mesa de dados",
        "Hasta 25 dados: D4, D6, D8, D10, D12, D20. Toca Tirar o pulsa Space. Cada cara usa crypto.getRandomValues().",
      ),
      feature(
        "modifier",
        "Sumar o restar después",
        "Suma o resta de -99 a +99 al total. Cómo cae cada dado no cambia. Sirve para algo como 2d6+3.",
      ),
      feature(
        "setup",
        "Colores y archivo",
        "Edita un dado para cambiar el color de la cara, el de los números o puntos, y el texto del D6. Una cara vacía sigue mostrando el número. Baja o abre un JSON. Esta ventana no tiene un enlace para mandar.",
      ),
      feature(
        "click",
        "Tocar un dado",
        "Por defecto, un toque tira todos. En las opciones puedes cambiarlo para tirar solo el que tocas.",
      ),
      feature(
        "history",
        "El historial se queda aquí",
        "Las tiradas recientes se quedan en este navegador (hasta 200). Baja un .txt o borra cuando empieces de nuevo.",
      ),
      feature(
        "fairness-audit",
        "Puedes revisar si es al azar",
        "Cada cara usa crypto.getRandomValues() en este navegador. La muestra está en la página de prueba.",
        fairness,
      ),
    ],
    [
      faq("¿Tirar dados cuesta?", "No. En esta extensión no hace falta una cuenta."),
      faq(
        "¿Cada cara tiene la misma chance?",
        "Sí. Cada tirada usa crypto.getRandomValues() en este navegador, así que cada cara tiene la misma chance. La muestra está en la página de prueba.",
        fairness,
      ),
      faq(
        "¿Puedo tirar varios a la vez?",
        "Sí. Hasta 25 (de D4 a D20), juntos. Desde tres, el botón dice Tirar todos.",
      ),
      faq(
        "¿Puedo volver a tirar solo uno?",
        "Sí. En las opciones, pon Tocar un dado en Tirar uno, y toca ese. Por defecto se tiran todos.",
      ),
      faq(
        "¿Puedo hacer un 2d6+3?",
        "Sí. En la fila de agregar dados pon la suma o la resta, de -99 a +99. Se suma a las caras con número. Si la cara solo tiene texto, esa suma no cuenta.",
      ),
      faq(
        "¿Puedo escribir en un D6?",
        "Sí. Edita un D6 y elige Texto. Escribe una palabra por cara, o usa Número o Sí / No. Una cara vacía sigue mostrando el número y entra en el total.",
      ),
      faq(
        "¿Puedo copiar o guardar las tiradas?",
        "Sí. Copia el último total, baja el historial en .txt, o usa Archivo para bajar y abrir la configuración en JSON.",
      ),
      faq(
        "¿Hay un D100?",
        "No hay un D100 aparte. Usa un D10 si necesitas del 1 al 10, o pon varios dados y lee el total tú.",
      ),
      faq(
        "¿El historial se manda a algún lado?",
        "No. Se queda en la memoria de la extensión, en este navegador. Cómo trata los datos el sitio está en la Política de privacidad.",
        privacy,
      ),
    ],
    "Abrir Dados en SpinWheelPlus",
    "Abrir Dados en SpinWheelPlus",
    "La misma mesa de dados, abierta en una pestaña del navegador.",
  ),
  coin: pack(
    "Para qué sirve esta página",
    "Esta página saca cara o cruz. Agrega monedas de oro, plata o cobre, lanza una o todas, y copia o baja el historial. El historial se queda en este aparato. Si quieres verla más grande, abre la misma herramienta en SpinWheelPlus.",
    [
      feature(
        "table",
        "Lanzar la moneda",
        "Hasta 25 monedas. Toca Lanzar o pulsa Space. Cada lanzamiento usa crypto.getRandomValues(), así que cara y cruz salen mitad y mitad.",
      ),
      feature(
        "metals",
        "Oro, plata y cobre",
        "Elige el color al agregar, o cambia toda la mesa a Sí / No, Gana / Pierde o Impar / Par. Baja o abre un JSON. Esta ventana no tiene un enlace para mandar.",
      ),
      feature(
        "click",
        "Tocar una moneda",
        "Por defecto, un toque lanza todas. En las opciones puedes cambiarlo para lanzar solo la que tocas.",
      ),
      feature(
        "history",
        "El historial se queda aquí",
        "Los lanzamientos recientes se quedan en este navegador (hasta 200). Baja un .txt o borra cuando empieces de nuevo.",
      ),
      feature(
        "fairness-audit",
        "Puedes revisar si es al azar",
        "Cada lanzamiento usa crypto.getRandomValues() en este navegador. La muestra está en la página de prueba.",
        fairness,
      ),
    ],
    [
      faq("¿Lanzar la moneda cuesta?", "No. En esta extensión no hace falta una cuenta."),
      faq(
        "¿Cara y cruz salen de verdad mitad y mitad?",
        "Para un juego, una clase o una decisión de todos los días, sí. Cada lanzamiento usa crypto.getRandomValues() en este navegador. Esto no es una máquina de casino ni de lotería. La muestra está en la página de prueba.",
        fairness,
      ),
      faq(
        "¿Puedo escribir en la moneda?",
        "Sí. En Caras elige Sí / No, Gana / Pierde o Impar / Par. Ese par vale para todas. El estilo clásico sigue siendo oro, plata y cobre.",
      ),
      faq(
        "¿Puedo lanzar varias a la vez?",
        "Sí. Hasta 25, juntas. Desde dos, el botón dice Lanzar todas.",
      ),
      faq(
        "¿Puedo volver a lanzar solo una?",
        "Sí. En las opciones, pon Tocar una moneda en Lanzar una, y toca esa. Por defecto se lanzan todas.",
      ),
      faq(
        "¿Puedo copiar o guardar los lanzamientos?",
        "Sí. Copia el último resultado, baja el historial en .txt, o usa Archivo para bajar y abrir la configuración en JSON.",
      ),
      faq(
        "¿El historial se manda a algún lado?",
        "No. Se queda en la memoria de la extensión, en este navegador. Cómo trata los datos el sitio está en la Política de privacidad.",
        privacy,
      ),
    ],
    "Abrir Lanzar moneda en SpinWheelPlus",
    "Abrir Lanzar moneda en SpinWheelPlus",
    "La misma mesa, abierta en una pestaña del navegador.",
  ),
  yesNo: pack(
    "Para qué sirve esta página",
    "Esta página elige Sí, No, Tal vez, Verdadero, Falso, o una frase que tú escribes. Vuelve a preguntar con Space o Enter. El historial se queda en este aparato. Si quieres verla más grande, abre la misma herramienta en SpinWheelPlus.",
    [
      feature(
        "modes",
        "Cuatro formas de responder",
        "Sí o no, Sí / No / Tal vez, Verdadero / Falso, o frases tuyas, una por línea. En el mismo grupo, cada frase tiene la misma chance.",
      ),
      feature(
        "ask",
        "Preguntar otra vez",
        "Toca Preguntar otra vez o pulsa Space. Cada vez usa crypto.getRandomValues().",
      ),
      feature(
        "motion",
        "Animación y sonido",
        "Elige voltear, desvanecer, mostrar letra por letra, o un cuadro que elige. El sonido se prende o se apaga. La respuesta ya está elegida antes de que empiece la animación.",
      ),
      feature(
        "history",
        "El historial se queda aquí",
        "Las respuestas recientes se quedan en este navegador (hasta 200). Baja un .txt o borra cuando ya no las necesites.",
      ),
      feature(
        "fairness-audit",
        "Puedes revisar si es al azar",
        "Cada pregunta usa crypto.getRandomValues() en este navegador. La muestra está en la página de prueba.",
        fairness,
      ),
    ],
    [
      faq("¿Preguntar sí o no cuesta?", "No. En esta extensión no hace falta una cuenta."),
      faq(
        "¿Sí y no salen de verdad mitad y mitad?",
        "En Sí o no, sí. Cada pregunta usa crypto.getRandomValues() en este navegador. Con Tal vez son tres iguales. Si escribes tú las frases, se reparten por línea. La muestra está en la página de prueba.",
        fairness,
      ),
      faq(
        "¿Puedo usar Tal vez o mis propias frases?",
        "Sí. Cambia a Sí / No / Tal vez, Verdadero / Falso, o frases tuyas.",
      ),
      faq(
        "¿La animación o el sonido cambian la respuesta?",
        "No. La respuesta ya está. La animación y el sonido son solo para ver y oír.",
      ),
      faq(
        "¿Puedo ver las respuestas anteriores?",
        "Sí. Las recientes se quedan en este aparato, hasta 200. Hay un botón para bajar un .txt si quieres guardar una copia.",
      ),
      faq(
        "¿Sirve para una decisión importante?",
        "Mejor no. Lo importante lo decides tú. Esta página sirve cuando estás trabado y la elección es ligera.",
      ),
      faq(
        "¿Y si quiero cara o cruz?",
        "Usa Lanzar moneda. Si quieres un número, usa Dados o Número al azar.",
      ),
      faq(
        "¿El historial de respuestas se manda a algún lado?",
        "No. Se queda en la memoria de la extensión, en este navegador. Cómo trata los datos el sitio está en la Política de privacidad.",
        privacy,
      ),
    ],
    "Abrir Sí o no en SpinWheelPlus",
    "Abrir Sí o no en SpinWheelPlus",
    ctaNote,
  ),
  shuffle: pack(
    "Para qué sirve esta página",
    "Esta página cambia el orden de las líneas. No saca un ganador. Pega cada línea, puedes quitar las vacías o las repetidas, y copiar o bajar el resultado. El historial se queda en este aparato. Si quieres verla más grande, abre la misma herramienta en SpinWheelPlus.",
    [
      feature("list", "Tu lista", "Una cosa por línea. Pega, abre un .txt o borra todo."),
      feature(
        "ignore-empty",
        "Quitar líneas vacías",
        "Prendido: antes de mezclar quita las líneas sin texto. Apagado: las vacías se quedan, como un lugar vacío.",
      ),
      feature(
        "duplicates",
        "Quitar líneas repetidas",
        "Prendido: el mismo texto se queda solo en la primera línea, sin importar mayúsculas. Apagado: las repetidas se quedan, como un boleto extra.",
      ),
      feature(
        "sound",
        "Sonido al salir el resultado",
        "Puede sonar un momento cuando aparece el orden nuevo. El orden ya está elegido. El sonido no lo cambia. Si lo abres desde el historial, no suena.",
      ),
      feature(
        "order",
        "Un orden al azar",
        "Usa Fisher-Yates y crypto.getRandomValues() en este navegador. Cada orden posible tiene la misma chance. La muestra está en la página de prueba.",
        fairness,
      ),
      feature(
        "history",
        "El historial se queda aquí",
        "Las mezclas recientes se quedan en este navegador (hasta 50). Toca una tarjeta para verla de nuevo, copia o baja un .txt.",
      ),
    ],
    [
      faq(
        "¿Mezclar la lista cuesta?",
        "No. Mezclar y copiar no piden cuenta. Entra en SpinWheelPlus solo si más adelante quieres otra cosa.",
      ),
      faq(
        "¿Qué tan al azar es?",
        "Usa Fisher-Yates y el crypto.getRandomValues() del navegador. No hay un número fijo de antes. Sirve para una clase, una reunión o un sorteo ligero. Una lotería regulada es otra cosa. La muestra está en la página de prueba.",
        fairness,
      ),
      faq(
        "¿Qué hacen estos interruptores?",
        "Quitar líneas vacías limpia los huecos. Quitar repetidas deja solo la primera vez que aparece cada línea. Sirve cuando pegas una tabla desordenada.",
      ),
      faq(
        "¿Puedo deshacer?",
        "Sí, en el historial reciente de este aparato. Cuando termines, puedes borrarlo. Si borras los datos del navegador, este historial local también se va.",
      ),
      faq("¿Puedo mezclar otra vez?", "Cuando quieras. Cada toque es un orden nuevo."),
      faq(
        "¿Qué puedo poner en la lista?",
        "Nombres, tareas, títulos, canciones, ideas: una cosa por línea. Una lista larga también se mezcla. Lo difícil es leer más de 100 líneas en voz alta, no la cuenta.",
      ),
      faq(
        "¿Elige un ganador?",
        "No. Te devuelve lo mismo, en otro orden. Si quieres un solo nombre, usa Elegir un nombre.",
      ),
      faq(
        "¿La lista y el historial se mandan a algún lado?",
        "No. Se quedan en la memoria de la extensión, en este navegador. Cómo trata los datos el sitio está en la Política de privacidad.",
        privacy,
      ),
    ],
    "Abrir Mezclar lista en SpinWheelPlus",
    "Abrir Mezclar lista en SpinWheelPlus",
    ctaNote,
  ),
  team: pack(
    "Para qué sirve esta página",
    "Esta página parte la lista en equipos. No saca un ganador. Agrega nombres, marca capitanes y arma los equipos. El historial se queda en este aparato. Si quieres verla más grande, abre la misma herramienta en SpinWheelPlus.",
    [
      feature(
        "list",
        "La lista de nombres",
        "Agrégalos de a uno, pega o abre un .txt. Toca la corona para marcar capitán. Hasta 300 nombres.",
      ),
      feature(
        "split",
        "Por cantidad de equipos o de personas",
        "Parte por cuántos equipos, o por cuántas personas en cada uno. Puedes dejarlos parejos, o permitir que queden distintos.",
      ),
      feature(
        "captains",
        "Capitanes",
        "Cada capitán entra en un equipo distinto, al azar, y queda primero. Los demás se acomodan detrás.",
      ),
      feature(
        "adjust",
        "Se puede corregir después",
        "Arrastra un nombre a otro equipo, o elige el equipo en esa misma fila. Cambia el nombre del equipo y copia todo.",
      ),
      feature(
        "sound",
        "Sonido al salir los equipos",
        "Puede sonar un momento cuando hay un armado nuevo. Si lo abres desde el historial, no suena.",
      ),
      feature(
        "fairness",
        "Equipos al azar",
        "Usa Fisher-Yates y crypto.getRandomValues() en este navegador. Es parejo en la chance, no en el nivel. La muestra está en la página de prueba.",
        fairness,
      ),
    ],
    [
      faq("¿Armar equipos cuesta?", "No. Puedes armar las veces que quieras. No hace falta una cuenta."),
      faq(
        "¿Los equipos quedan parejos?",
        "Los nombres se mezclan con Fisher-Yates y crypto.getRandomValues() en este navegador. Si prendes dejarlos parejos, la cantidad de personas se diferencia en una como máximo, cuando los números lo permiten. Eso es parejo en cantidad, no en nivel. La muestra está en la página de prueba.",
        fairness,
      ),
      faq(
        "¿Cuántos equipos puedo armar?",
        "Como máximo, tantos como personas haya. Elige la cantidad de equipos, o cuántas personas por equipo. Si usas capitanes, hace falta al menos un equipo por capitán.",
      ),
      faq(
        "¿Puedo marcar capitanes?",
        "Sí. Toca la corona en un nombre y prende Usar capitanes. Cada capitán entra en un equipo distinto, al azar.",
      ),
      faq(
        "¿Puedo corregir después de armar?",
        "Sí. Arrastra un nombre a otro equipo, o elige el equipo en esa misma fila. Cambia el nombre del equipo y copia todo.",
      ),
      faq(
        "¿Puedo armar de nuevo?",
        "Sí. Toca Armar de nuevo para otro reparto. Los anteriores siguen en el historial si quieres abrirlos.",
      ),
      faq(
        "¿Elige un ganador?",
        "No. Te da grupos. Si quieres un solo nombre, usa Elegir un nombre. Si quieres un orden nuevo y no equipos, usa Mezclar lista.",
      ),
      faq(
        "¿La lista y el historial se mandan a algún lado?",
        "No. Los nombres, los equipos y el historial se quedan en la memoria de la extensión, en este navegador. Cómo trata los datos el sitio está en la Política de privacidad.",
        privacy,
      ),
    ],
    "Abrir Armar equipos en SpinWheelPlus",
    "Abrir Armar equipos en SpinWheelPlus",
    ctaNote,
  ),
};
