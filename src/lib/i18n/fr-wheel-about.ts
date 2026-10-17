import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const FR_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "À quoi sert cette roue",
  featuresLead:
    "Vous remplissez cette roue ici, à côté de la page ouverte. Mettez les noms, changez la couleur, activez le son et tournez. La liste reste sur cet appareil. Pour envoyer un lien, placer la roue sur une page ou la garder sur votre compte, ouvrez la page d'édition sur SpinWheelPlus.",
  features: [
    {
      id: "weighted-slices",
      title: "La plus grande part sort plus souvent",
      desc: "Si une option doit sortir plus souvent, augmentez le poids. La part la plus large a plus de chances. La photo s'ajoute dans Un par un. Si les parts ne sont pas égales, dites-le avant.",
    },
    {
      id: "images-themes",
      title: "Photos et couleurs",
      desc: "Choisissez les couleurs, le bord, le centre et le titre. Collez une photo sur une part. Le fond de page et Unsplash sont sur la page d'édition du site.",
    },
    {
      id: "sounds-winner",
      title: "Son et cadre du résultat",
      desc: "Un son peut jouer au tour et quand un nom sort. À l'arrêt, vous pouvez lancer des confettis ou un feu d'artifice. Fermez le cadre, ou retirez le nom sorti, pour que le tour suivant en donne un autre.",
    },
    {
      id: "entries-history",
      title: "Liste et historique",
      desc: "Vous pouvez changer plusieurs lignes d'un coup, ou un nom à la fois. Mélangez, triez ou effacez. L'historique reste sur cet appareil.",
    },
    {
      id: "beside-tab",
      title: "Tourner à côté de la page ouverte",
      desc: "Laissez Docs, Meet ou la page du cours ouverts, et tournez ici. Cliquez sur la roue ou appuyez sur Space.",
    },
    {
      id: "full-editor",
      title: "Lien, page et compte",
      desc: "Ouvrez la page d'édition sur SpinWheelPlus pour copier le lien, placer la roue sur une page, ajouter un fond ou la garder sur votre compte.",
    },
    {
      id: "fairness-audit",
      title: "Vous pouvez vérifier le hasard",
      desc: "Chaque tour utilise crypto.getRandomValues() dans ce navigateur. La page de test publie un échantillon de 111 noms, 10 000 tours (4 fois) et un test du khi-deux selon la taille de la roue.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "page de test",
      linkTitle: "Ouvrir la page de test de SpinWheelPlus",
    },
  ],
  faqHeading: "Questions fréquentes",
  faqs: [
    {
      question: "SpinWheelPlus est gratuit ?",
      answer:
        "Oui, pour l'usage courant : cette extension et l'éditeur du site. Si un jour quelque chose est payant, ce sera en plus. Le premier tour d'essai n'est pas derrière un paiement.",
    },
    {
      question: "Faut-il un compte pour tourner ?",
      answer:
        "Non. L'extension ouvre et garde la roue sur cet appareil. Connectez-vous à SpinWheelPlus quand vous voulez garder des roues sur le compte.",
    },
    {
      question: "La roue sort vraiment au hasard ?",
      answer:
        "Chaque tour utilise crypto.getRandomValues() dans ce navigateur, pas un nombre choisi à la main. Si vous voulez voir des milliers de tours sur votre appareil, ouvrez la page de test. Ça sert en cours et en direct. Ce n'est pas une loterie officielle.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "page de test",
      linkTitle: "Ouvrir la page de test de SpinWheelPlus",
    },
    {
      question: "C'est quoi, le poids ?",
      answer:
        "Dans Un par un, un poids plus grand prend plus de place sur la roue et sort plus souvent. Ça sert pour des billets en plus, ou pour donner un peu plus de chances à une option. Le calcul se voit sur la roue. Le test du site ne mesure que des parts égales.",
    },
    {
      question: "Je peux envoyer la roue à quelqu'un ?",
      answer:
        "Depuis ici, non. Ouvrez la page d'édition sur SpinWheelPlus pour copier le lien. La personne qui présente avec vous ouvre la même roue de son côté.",
      href: SITE_URL,
      linkLabel: "page d'édition sur SpinWheelPlus",
      linkTitle: "Ouvrir la page d'édition de SpinWheelPlus",
    },
    {
      question: "Je peux mettre la roue sur un direct ou un site ?",
      answer:
        "Utilisez la page d'édition sur SpinWheelPlus pour l'intégrer ou ouvrir la page du tour. Cette extension reste à côté de l'onglet actuel pour que vous tourniez pendant que vous présentez.",
    },
    {
      question: "Ma liste part quelque part ?",
      answer:
        "Ici, non. Les noms restent dans cette extension, dans ce navigateur, jusqu'à ce que vous ouvriez l'éditeur et touchiez Partager ou Enregistrer. Ne mettez pas de données sensibles d'élèves dans un lien public. La façon de garder et d'effacer est dans la Politique de confidentialité.",
      href: SITE_PRIVACY_URL,
      linkLabel: "Politique de confidentialité",
      linkTitle: "Politique de confidentialité de SpinWheelPlus",
    },
    {
      question: "Combien de noms je peux mettre ?",
      answer:
        "Jusqu'à 1000. Au-delà d'environ 120 noms, les parts deviennent difficiles à lire sur un projecteur. Si la liste est énorme, faites deux roues.",
    },
  ],
};
