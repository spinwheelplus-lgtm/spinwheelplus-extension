import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const ES_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "Para qué sirve esta rueda",
  featuresLead:
    "Esta rueda la llenas tú, al lado de la página que tienes abierta. Pon nombres, cambia el color, prende el sonido y gira. La lista se queda en este aparato. Si quieres mandar un enlace, poner la rueda en una página o guardarla en tu cuenta, abre la página de edición en SpinWheelPlus.",
  features: [
    {
      id: "weighted-slices",
      title: "La rebanada más grande sale más",
      desc: "Si quieres que una opción salga más seguido, súbele el peso. La rebanada más ancha tiene más chance. La foto se agrega en Ver uno por uno. Si las rebanadas no son iguales, díselo a la gente antes.",
    },
    {
      id: "images-themes",
      title: "Fotos y colores",
      desc: "Elige colores, el borde, el centro y el título. Pega una foto en una rebanada. El fondo de la página y Unsplash están en la página de edición del sitio.",
    },
    {
      id: "sounds-winner",
      title: "Sonido y el cuadro del resultado",
      desc: "Puede sonar al girar y al salir un nombre. Cuando se detiene, puedes soltar confeti o fuegos artificiales. Cierra el cuadro, o quita el nombre que salió, para que la próxima vez no salga ese.",
    },
    {
      id: "entries-history",
      title: "Lista e historial",
      desc: "Puedes cambiar muchas líneas a la vez, o un nombre a la vez. Mezcla, ordena o borra. El historial se queda en este aparato.",
    },
    {
      id: "beside-tab",
      title: "Gira al lado de la página abierta",
      desc: "Deja Docs, Meet o la página de la clase abierta, y gira aquí. Toca la rueda o pulsa Space.",
    },
    {
      id: "full-editor",
      title: "Enlace, página y cuenta",
      desc: "Abre la página de edición en SpinWheelPlus para copiar el enlace, poner la rueda en una página, agregar un fondo o guardarla en tu cuenta.",
    },
    {
      id: "fairness-audit",
      title: "Puedes revisar si es al azar",
      desc: "Cada giro usa crypto.getRandomValues() en este navegador. La página de prueba publica una muestra de 111 nombres, 10.000 giros (4 veces) y una prueba de chi-cuadrado según el tamaño de la rueda.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "página de prueba",
      linkTitle: "Abrir la página de prueba de SpinWheelPlus",
    },
  ],
  faqHeading: "Preguntas frecuentes",
  faqs: [
    {
      question: "¿SpinWheelPlus cuesta?",
      answer:
        "Para el uso normal, no: ni esta extensión ni la página de edición del sitio. Si más adelante hay algo de pago, será aparte. El primer giro de prueba no se bloquea.",
    },
    {
      question: "¿Necesito una cuenta para girar?",
      answer:
        "No. La extensión guarda la rueda en este aparato. Entra en SpinWheelPlus solo cuando quieras guardar la rueda en tu cuenta.",
    },
    {
      question: "¿La rueda sale de verdad al azar?",
      answer:
        "Sí. Cada giro usa crypto.getRandomValues() en este navegador, no un número elegido de antemano. Si quieres correr miles de giros tú mismo, abre la página de prueba. Alcanza para una clase o un directo. Esto no es una lotería con permiso.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "página de prueba",
      linkTitle: "Abrir la página de prueba de SpinWheelPlus",
    },
    {
      question: "¿Qué es el peso?",
      answer:
        "En Ver uno por uno, si subes el peso, esa rebanada ocupa más rueda y sale más seguido. Sirve cuando alguien tiene un boleto extra, o cuando quieres que una opción tenga un poco más de chance. El cálculo se ve en la rueda. La página de prueba del sitio solo mide rebanadas iguales.",
    },
    {
      question: "¿Puedo mandarle la rueda a alguien?",
      answer:
        "Desde esta ventana, no. Abre la página de edición en SpinWheelPlus para copiar el enlace. La otra persona abre ese enlace y ve la misma rueda.",
      href: SITE_URL,
      linkLabel: "página de edición en SpinWheelPlus",
      linkTitle: "Abrir la página de edición de SpinWheelPlus",
    },
    {
      question: "¿Puedo poner la rueda en un directo o en un sitio?",
      answer:
        "Usa la página de edición en SpinWheelPlus para insertarla o abrir la página del giro. Esta extensión se queda al lado de la pestaña actual, para que hables y gires a la vez.",
    },
    {
      question: "¿Mi lista se manda a algún lado?",
      answer:
        "No, si solo usas esta ventana. Los nombres se quedan en la memoria de la extensión, en este navegador, hasta que abras la página de edición y toques Compartir o Guardar. No pongas datos sensibles de alumnos en un enlace público. Cómo se guarda y cómo se borra está en la Política de privacidad.",
      href: SITE_PRIVACY_URL,
      linkLabel: "Política de privacidad",
      linkTitle: "Política de privacidad de SpinWheelPlus",
    },
    {
      question: "¿Cuántos nombres puedo poner?",
      answer:
        "Hasta 1000. Pasados unos 120, las rebanadas se leen mal en un proyector. Si la lista es muy larga, ármala en dos ruedas.",
    },
  ],
};
