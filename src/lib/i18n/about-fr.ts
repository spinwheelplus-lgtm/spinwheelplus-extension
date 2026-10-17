import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import type { AboutPack, ToolAbout } from "@/lib/i18n/about-pack";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
} from "@/lib/constants";

const fairness = {
  href: SITE_FAIRNESS_AUDIT_URL,
  linkLabel: "page de test",
  linkTitle: "Ouvrir la page de test de SpinWheelPlus",
};

const privacy = {
  href: SITE_PRIVACY_URL,
  linkLabel: "Politique de confidentialité",
  linkTitle: "Politique de confidentialité de SpinWheelPlus",
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

const pageNote = "Le même outil, ouvert dans un onglet du navigateur.";
const tableNote = "La même table, ouverte dans un onglet du navigateur.";

export const aboutFr: ToolAbout = {
  number: pack(
    "À quoi sert cette page",
    "Cette page tire des nombres entiers à côté de la page ouverte. Vous fixez l'intervalle, vous écartez les valeurs que vous ne voulez pas, vous en tirez un ou plusieurs, puis vous copiez ou téléchargez l'historique. Les tirages restent sur cet appareil.",
    [
      feature(
        "range",
        "Du plus petit au plus grand",
        "Tire de -1 000 000 à 1 000 000. Si le minimum est plus grand que le maximum, ça marche quand même : on va du plus petit au plus grand.",
      ),
      feature(
        "exclude",
        "Nombres laissés de côté",
        "Passez des billets ou des codes avec une liste séparée par des virgules. Ces valeurs ne sortent pas tant que vous ne les effacez pas.",
      ),
      feature(
        "batch",
        "Un ou plusieurs",
        "Raccourcis de 1, 2, 3, 5 ou 10, ou une quantité à vous, jusqu'à 500 nombres en un seul tirage.",
      ),
      feature(
        "repeat",
        "Répéter dans le même tirage",
        "Activé : le même nombre peut sortir deux fois dans ce résultat. Désactivé : chaque valeur de ce tour est différente.",
      ),
      feature(
        "roll",
        "Le mélange à l'écran",
        "Un mélange d'environ 2,5 s, si vous le voulez. Les nombres finaux sont déjà choisis avec crypto.getRandomValues(). L'animation ne fait que montrer.",
      ),
      feature(
        "history",
        "Historique sur cet appareil",
        "Les tirages récents restent dans ce navigateur. Rouvrez une ligne, copiez le dernier résultat ou téléchargez un .txt.",
      ),
      feature(
        "fairness-audit",
        "Vous pouvez vérifier le hasard",
        "Chaque choix utilise crypto.getRandomValues() dans ce navigateur. La page de test publie des échantillons que vous pouvez lire.",
        fairness,
      ),
    ],
    [
      faq(
        "Ce tirage de nombres est gratuit ?",
        "Oui. L'extension et l'outil du site sont gratuits pour l'usage courant. Pas besoin de compte pour tirer.",
      ),
      faq(
        "Faut-il un compte pour tirer ?",
        "Non. Les options et l'historique restent sur cet appareil. Connectez-vous à SpinWheelPlus seulement si vous voulez garder des roues sur le compte.",
      ),
      faq(
        "Les nombres sortent vraiment au hasard ?",
        "Chaque tirage utilise crypto.getRandomValues() dans ce navigateur. Chaque entier de l'intervalle a la même chance, indépendamment des autres. Ouvrez la page de test si vous voulez voir des échantillons sur le site.",
        fairness,
      ),
      faq(
        "Quel intervalle je peux utiliser ?",
        "N'importe quel entier de -1 000 000 à 1 000 000. Un intervalle court sert pour des billets. Un large, pour des codes d'échantillon.",
      ),
      faq(
        "Je peux tirer plusieurs nombres d'un coup ?",
        "Oui. Utilisez un raccourci ou une quantité à vous, jusqu'à 500 nombres par tirage.",
      ),
      faq(
        "Je peux laisser certains nombres de côté ?",
        "Oui. Écrivez les valeurs séparées par une virgule dans Exclure des nombres. Elles restent dehors tant que vous ne les effacez pas de la liste.",
      ),
      faq(
        "Le même nombre peut sortir deux fois dans un tirage ?",
        "Oui, si Répéter dans le même tirage est activé. Désactivez-le pour des valeurs différentes. Si vous demandez plus de nombres différents qu'il n'en reste après les exclusions, un message apparaît.",
      ),
      faq(
        "L'animation change le résultat ?",
        "Non. Les nombres finaux sont choisis tout de suite. Le mélange à l'écran ne change pas les chances.",
      ),
      faq(
        "L'historique reste chez moi ?",
        "Ici, oui. L'historique reste dans cette extension, dans ce navigateur. La Politique de confidentialité explique comment SpinWheelPlus traite les données sur le site.",
        privacy,
      ),
    ],
    "Ouvrir Nombre au hasard sur SpinWheelPlus",
    "Ouvrir le tirage de nombres sur SpinWheelPlus",
    pageNote,
  ),
  name: pack(
    "À quoi sert cette page",
    "Cette page choisit un nom dans votre liste, à côté de la page ouverte. Collez ou importez les noms, ignorez les doublons, retirez le nom sorti, puis copiez ou téléchargez l'historique. Les choix restent sur cet appareil.",
    [
      feature(
        "list",
        "La liste de noms",
        "Un nom par ligne. Collez depuis le presse-papiers, importez un .txt, mélangez l'ordre ou effacez la liste.",
      ),
      feature(
        "duplicates",
        "Ignorer les noms en double",
        "Activé : seule la première ligne de chaque nom compte (les majuscules ne changent rien). Désactivé : les lignes en plus comptent comme des billets en plus.",
      ),
      feature(
        "remove-winner",
        "Retirer le nom sorti",
        "Activé : ce nom quitte la liste après chaque choix. C'est le moyen habituel de sortir le premier, le deuxième et le troisième.",
      ),
      feature(
        "roll",
        "Le mélange à l'écran",
        "Un mélange d'environ 2,5 s, si vous le voulez. Le nom est déjà choisi avec crypto.getRandomValues(). L'animation ne fait que montrer.",
      ),
      feature(
        "history",
        "Historique sur cet appareil",
        "Les choix récents restent dans ce navigateur (jusqu'à 100). Rouvrez une ligne, copiez un nom ou téléchargez un .txt.",
      ),
      feature(
        "fairness-audit",
        "Vous pouvez vérifier le hasard",
        "Chaque choix utilise crypto.getRandomValues() dans ce navigateur. La page de test publie des échantillons que vous pouvez lire.",
        fairness,
      ),
    ],
    [
      faq(
        "Choisir un nom est gratuit ?",
        "Oui. L'extension et l'outil du site sont gratuits pour l'usage courant. Pas besoin de compte pour choisir.",
      ),
      faq(
        "Faut-il un compte pour choisir des noms ?",
        "Non. La liste, les options et l'historique restent sur cet appareil. Connectez-vous à SpinWheelPlus seulement si vous voulez garder des roues sur le compte.",
      ),
      faq(
        "Le choix est juste ?",
        "Chaque choix prend une place au hasard avec crypto.getRandomValues() dans ce navigateur. Chaque nom du groupe a la même chance. Ouvrez la page de test si vous voulez voir des échantillons sur le site.",
        fairness,
      ),
      faq(
        "Je peux choisir plusieurs noms d'un coup ?",
        "Chaque clic choisit un nom. Pour plusieurs noms différents, activez Retirer le nom sorti et continuez.",
      ),
      faq(
        "À quoi sert Ignorer les noms en double ?",
        "S'il est activé, seule la première ligne de chaque nom compte. Les copies sont ignorées (les majuscules ne changent rien). S'il est désactivé, les lignes répétées comptent comme des billets en plus.",
      ),
      faq(
        "À quoi sert Retirer le nom sorti ?",
        "Après chaque choix, ce nom quitte la liste et ne peut plus sortir tant que vous ne le remettez pas.",
      ),
      faq(
        "L'animation change le nom ?",
        "Non. Le nom est choisi au moment où vous cliquez. L'animation montre seulement un mélange d'environ 2,5 secondes.",
      ),
      faq(
        "La liste reste chez moi ?",
        "Ici, oui. La liste et l'historique restent dans cette extension, dans ce navigateur. La Politique de confidentialité explique comment SpinWheelPlus traite les données sur le site.",
        privacy,
      ),
    ],
    "Ouvrir Choisir un nom sur SpinWheelPlus",
    "Ouvrir le choix de noms sur SpinWheelPlus",
    pageNote,
  ),
  dice: pack(
    "À quoi sert cette page",
    "Cette page lance des dés de plusieurs faces, à côté de la page ouverte. Mélangez de D4 à D20, ajoutez ou retirez un modificateur, puis copiez ou téléchargez l'historique. Les résultats restent sur cet appareil.",
    [
      feature(
        "table",
        "La table de dés",
        "Posez jusqu'à 25 dés (D4, D6, D8, D10, D12, D20). Cliquez sur Lancer ou appuyez sur Space. Chaque face utilise crypto.getRandomValues().",
      ),
      feature(
        "modifier",
        "Modificateur",
        "Ajoutez ou retirez de -99 à +99. Ça vaut pour le total, pas pour la façon dont chaque dé tombe. Ça sert pour un jet du type 2d6+3.",
      ),
      feature(
        "setup",
        "Couleurs et fichier",
        "Modifiez un dé pour changer la couleur de la face et des marques, les chiffres du D6, les points ou six mots. Une face vide montre le chiffre. Dans Fichier, vous téléchargez ou ouvrez la configuration. Cette extension n'a pas de lien à partager.",
      ),
      feature(
        "click",
        "Clic sur le dé",
        "Un clic lance tous les dés (le réglage de départ), ou vous lancez un dé à la fois dans le menu de l'engrenage.",
      ),
      feature(
        "history",
        "Historique sur cet appareil",
        "Les résultats récents restent dans ce navigateur (jusqu'à 200). Téléchargez un .txt ou videz la liste avant une autre séance.",
      ),
      feature(
        "fairness-audit",
        "Vous pouvez vérifier le hasard",
        "Chaque face utilise crypto.getRandomValues() dans ce navigateur. La page de test publie des échantillons que vous pouvez lire.",
        fairness,
      ),
    ],
    [
      faq(
        "Les dés sont gratuits ?",
        "Oui. L'extension et l'outil du site sont gratuits pour l'usage courant. Pas besoin de compte pour lancer.",
      ),
      faq(
        "Les résultats sortent au hasard ?",
        "Oui. Chaque lancer prend des octets au hasard avec crypto.getRandomValues() dans ce navigateur, donc chaque face a la même chance. La page de test montre des échantillons sur le site.",
        fairness,
      ),
      faq(
        "Je peux lancer plusieurs dés ?",
        "Oui. Posez jusqu'à 25 dés sur la table (de D4 à D20) et lancez-les ensemble. À partir de trois, le bouton dit Lancer tous.",
      ),
      faq(
        "Je peux relancer un seul dé ?",
        "Oui. Dans les options de la table, mettez Clic sur le dé sur Lancer un dé, puis cliquez sur ce dé. Au départ, tout se lance ensemble.",
      ),
      faq(
        "Je peux ajouter un modificateur du type 2d6+3 ?",
        "Oui. Mettez un modificateur +/- sur la rangée d'ajout (de -99 à +99). Ça vaut pour les faces avec un chiffre. Un résultat qui tombe seulement sur des mots n'utilise pas le modificateur.",
      ),
      faq(
        "Je peux mettre des mots sur un D6 ?",
        "Oui. Modifiez un D6 et choisissez Mots. Écrivez un libellé sur chaque face, ou utilisez Chiffre ou Oui / Non. Une face vide continue d'afficher le chiffre et entre dans le total.",
      ),
      faq(
        "Je peux copier ou garder les résultats ?",
        "Oui. Copiez le dernier total de la table, téléchargez l'historique en .txt, ou utilisez Fichier pour télécharger et ouvrir la configuration.",
      ),
      faq(
        "Il existe un dé D100 ?",
        "Il n'y a pas de type D100 à part. Utilisez un D10 façon pourcentage, ou réunissez des dés sur la même table (par exemple 2d10) et lisez le total vous-même.",
      ),
      faq(
        "L'historique reste chez moi ?",
        "Ici, oui. Il reste dans cette extension, dans ce navigateur. La Politique de confidentialité explique comment SpinWheelPlus traite les données sur le site.",
        privacy,
      ),
    ],
    "Ouvrir Dés sur SpinWheelPlus",
    "Ouvrir les dés sur SpinWheelPlus",
    tableNote,
  ),
  coin: pack(
    "À quoi sert cette page",
    "Cette page joue à pile ou face à côté de la page ouverte. Mélangez des pièces d'or, d'argent et de cuivre, lancez-en une ou toutes, puis copiez ou téléchargez l'historique. Les lancers restent sur cet appareil.",
    [
      feature(
        "table",
        "La table de pièces",
        "Posez jusqu'à 25 pièces. Cliquez sur Lancer ou appuyez sur Space. Chaque lancer utilise crypto.getRandomValues(), donc pile et face restent à 50/50.",
      ),
      feature(
        "metals",
        "Or, argent et cuivre",
        "Choisissez le métal en posant une pièce, ou passez toute la table sur Oui / Non, Gagne / Perd ou Impair / Pair. Dans Fichier, vous téléchargez la configuration. Cette extension n'a pas de lien à partager.",
      ),
      feature(
        "click",
        "Clic sur la pièce",
        "Un clic lance toutes les pièces (le réglage de départ), ou vous en lancez une à la fois dans le menu de l'engrenage.",
      ),
      feature(
        "history",
        "Historique sur cet appareil",
        "Les lancers récents restent dans ce navigateur (jusqu'à 200). Téléchargez un .txt ou videz la liste avant une autre séance.",
      ),
      feature(
        "fairness-audit",
        "Vous pouvez vérifier le hasard",
        "Chaque lancer utilise crypto.getRandomValues() dans ce navigateur. La page de test publie des échantillons que vous pouvez lire.",
        fairness,
      ),
    ],
    [
      faq(
        "Pile ou face est gratuit ?",
        "Oui. L'extension et l'outil du site sont gratuits pour l'usage courant. Pas besoin de compte pour lancer.",
      ),
      faq(
        "Pile ou face est vraiment 50/50 ?",
        "Oui pour un jeu, une démo en cours et les décisions du quotidien. Chaque lancer prend des octets au hasard avec crypto.getRandomValues() dans ce navigateur. La page de test montre des échantillons. Ce n'est pas un générateur de casino ou de loterie.",
        fairness,
      ),
      faq(
        "Je peux mettre des mots sur les pièces ?",
        "Oui. Dans Faces, choisissez Oui / Non, Gagne / Perd ou Impair / Pair. Cette paire vaut pour toutes les pièces. Classique garde l'or, l'argent et le cuivre.",
      ),
      faq(
        "Je peux lancer plusieurs pièces ?",
        "Oui. Posez jusqu'à 25 pièces (or, argent ou cuivre) et lancez-les ensemble. À partir de deux, le bouton dit Lancer toutes.",
      ),
      faq(
        "Je peux relancer une seule pièce ?",
        "Oui. Dans les options de la table, mettez Clic sur la pièce sur Lancer une pièce, puis cliquez sur cette pièce. Au départ, tout se lance ensemble.",
      ),
      faq(
        "Je peux copier ou garder les lancers ?",
        "Oui. Copiez le dernier résultat de la table, téléchargez l'historique en .txt, ou utilisez Fichier pour télécharger et ouvrir la configuration.",
      ),
      faq(
        "L'historique reste chez moi ?",
        "Ici, oui. Il reste dans cette extension, dans ce navigateur. La Politique de confidentialité explique comment SpinWheelPlus traite les données sur le site.",
        privacy,
      ),
    ],
    "Ouvrir Pile ou face sur SpinWheelPlus",
    "Ouvrir Pile ou face sur SpinWheelPlus",
    tableNote,
  ),
  yesNo: pack(
    "À quoi sert cette page",
    "Cette page choisit Oui, Non, Peut-être, Vrai, Faux, ou des phrases que vous avez écrites. Redemandez avec Space ou Entrée. L'historique reste sur cet appareil.",
    [
      feature(
        "modes",
        "Quatre façons de répondre",
        "Oui ou non (50/50), Oui / Non / Peut-être, Vrai / Faux, ou vos phrases, une par ligne. Chaque option du groupe a la même chance.",
      ),
      feature(
        "ask",
        "Redemander",
        "Cliquez sur Redemander ou appuyez sur Space. Le hasard est crypto.getRandomValues().",
      ),
      feature(
        "motion",
        "Animation et son",
        "Sélecteur, retournement, fondu ou lettre par lettre. Le son est facultatif. La réponse est déjà choisie avant que l'animation commence.",
      ),
      feature(
        "history",
        "Historique sur cet appareil",
        "Les réponses récentes restent dans ce navigateur (jusqu'à 200). Téléchargez un .txt ou videz la liste.",
      ),
      feature(
        "fairness-audit",
        "Vous pouvez vérifier le hasard",
        "Chaque question utilise crypto.getRandomValues() dans ce navigateur. La page de test publie des échantillons que vous pouvez lire.",
        fairness,
      ),
    ],
    [
      faq(
        "Ce Oui ou non est gratuit ?",
        "Oui. L'extension et l'outil du site sont gratuits pour l'usage courant. Pas besoin de compte pour demander.",
      ),
      faq(
        "Oui et Non sont à 50/50 ?",
        "Dans le mode Oui ou non, oui. Chaque question vient de crypto.getRandomValues() dans ce navigateur. Peut-être a trois chemins égaux. Le mode de vos phrases partage à parts égales les lignes que vous avez écrites. La page de test montre des échantillons.",
        fairness,
      ),
      faq(
        "Je peux utiliser Peut-être ou mes phrases ?",
        "Oui. Passez le mode sur Oui / Non / Peut-être, Vrai / Faux, ou vos phrases.",
      ),
      faq(
        "L'animation ou le son change la réponse ?",
        "Non. Le choix se fait d'abord. L'animation et le son ne font que présenter.",
      ),
      faq(
        "Je peux revoir les réponses d'avant ?",
        "Oui. Les récentes restent sur cet appareil (jusqu'à 200), avec Télécharger .txt si vous voulez un fichier.",
      ),
      faq(
        "Ça sert pour une décision importante ?",
        "Non. Pour ce qui compte vraiment, suivez votre propre jugement. Ça sert à débloquer et pour des choix à petit risque.",
      ),
      faq(
        "Et si je veux pile ou face ?",
        "Utilisez Pile ou face dans cette extension. Pour des nombres, essayez Dés ou Nombre au hasard.",
      ),
      faq(
        "L'historique reste chez moi ?",
        "Ici, oui. Il reste dans cette extension, dans ce navigateur. La Politique de confidentialité explique comment SpinWheelPlus traite les données sur le site.",
        privacy,
      ),
    ],
    "Ouvrir Oui ou non sur SpinWheelPlus",
    "Ouvrir l'outil Oui ou non sur SpinWheelPlus",
    pageNote,
  ),
  shuffle: pack(
    "À quoi sert cette page",
    "Cette page met votre liste dans un ordre nouveau, à côté de la page ouverte. Elle ne choisit pas un nom. Collez ou importez les lignes, retirez les vides ou les doublons, puis copiez ou téléchargez le mélange. L'historique reste sur cet appareil.",
    [
      feature(
        "list",
        "Votre liste",
        "Un élément par ligne. Collez depuis le presse-papiers, importez un .txt ou effacez la liste.",
      ),
      feature(
        "ignore-empty",
        "Ignorer les lignes vides",
        "Activé : les lignes blanches sortent avant le mélange. Désactivé : elles restent comme des espaces vides.",
      ),
      feature(
        "duplicates",
        "Retirer les doublons",
        "Activé : seule la première copie de chaque ligne reste (les majuscules ne changent rien). Désactivé : les copies en plus restent comme des billets en plus.",
      ),
      feature(
        "sound",
        "Son à l'affichage",
        "Un son court, si vous le voulez, quand un nouveau mélange apparaît. L'ordre est déjà choisi. Le son ne le change pas. Rouvrir depuis l'historique reste silencieux.",
      ),
      feature(
        "order",
        "Un ordre au hasard",
        "Fisher-Yates avec crypto.getRandomValues() dans ce navigateur. Chaque ordre complet de la liste a la même chance. La page de test publie des échantillons que vous pouvez lire.",
        fairness,
      ),
      feature(
        "history",
        "Historique sur cet appareil",
        "Les mélanges récents restent dans ce navigateur (jusqu'à 50). Rouvrez une carte, copiez un mélange ou téléchargez un .txt.",
      ),
    ],
    [
      faq(
        "Mélanger la liste est gratuit ?",
        "Oui. Mélangez et copiez sans compte. Connectez-vous à SpinWheelPlus seulement si vous utilisez d'autres fonctions plus tard.",
      ),
      faq(
        "C'est vraiment au hasard ?",
        "Fisher-Yates plus le hasard du navigateur (crypto.getRandomValues()). Ce n'est pas une graine fixe. Ça sert en cours, en réunion et pour un tirage informel. Une loterie réglementée, c'est autre chose. La page de test publie des échantillons.",
        fairness,
      ),
      faq(
        "À quoi servent les options ?",
        "Ignorer les lignes vides retire les blancs. Retirer les doublons garde la première copie de chaque ligne. Ça aide après l'export d'un tableau en désordre.",
      ),
      faq(
        "Je peux revenir en arrière ?",
        "Oui, dans Mélanges récents sur cet appareil. Videz l'historique quand vous avez fini. Si vous effacez les données du navigateur, cet historique local disparaît aussi.",
      ),
      faq(
        "Je peux mélanger encore ?",
        "Quand vous voulez. Chaque clic donne un ordre nouveau.",
      ),
      faq(
        "Qu'est-ce que je peux mettre dans la liste ?",
        "Des noms, des tâches, des titres, des morceaux, des idées : une chose par ligne. Les longues listes se mélangent aussi. Lire plus de 100 lignes à voix haute, c'est ça le difficile, pas le calcul.",
      ),
      faq(
        "Ça choisit un nom ?",
        "Non. Vous récupérez les mêmes éléments dans un autre ordre. Utilisez Choisir un nom quand il vous en faut un seul.",
      ),
      faq(
        "La liste reste chez moi ?",
        "Ici, oui. La liste et l'historique restent dans cette extension, dans ce navigateur. La Politique de confidentialité explique comment SpinWheelPlus traite les données sur le site.",
        privacy,
      ),
    ],
    "Ouvrir Mélanger la liste sur SpinWheelPlus",
    "Ouvrir Mélanger la liste sur SpinWheelPlus",
    pageNote,
  ),
  team: pack(
    "À quoi sert cette page",
    "Cette page répartit la liste en équipes, à côté de la page ouverte. Elle ne choisit pas un gagnant. Collez les noms, marquez les capitaines, formez les équipes, puis copiez ou téléchargez. L'historique reste sur cet appareil.",
    [
      feature(
        "list",
        "La liste de noms",
        "Un nom par ligne. Collez, importez un .txt ou un .csv, ou effacez. La couronne marque un capitaine. Le maximum est de 300 noms.",
      ),
      feature(
        "split",
        "Nombre ou taille",
        "Répartissez par nombre d'équipes, ou par la taille que vous voulez. Gardez des équipes de taille proche, ou laissez des tailles différentes.",
      ),
      feature(
        "captains",
        "Capitaines",
        "Chaque nom avec une couronne tombe d'abord dans une équipe différente. Le reste se place autour.",
      ),
      feature(
        "adjust",
        "Ajuster après la répartition",
        "Glissez un nom vers une autre équipe, ou choisissez l'équipe dans le menu de la ligne. Changez le nom, puis Copier tout.",
      ),
      feature(
        "sound",
        "Son à l'affichage",
        "Un son court, si vous le voulez, quand une nouvelle répartition apparaît. Rouvrir depuis l'historique reste silencieux.",
      ),
      feature(
        "fairness",
        "Une répartition au hasard",
        "Fisher-Yates avec crypto.getRandomValues() dans ce navigateur. C'est une chance égale, pas un équilibre de niveau. La page de test publie des échantillons que vous pouvez lire.",
        fairness,
      ),
    ],
    [
      faq(
        "Former des équipes est gratuit ?",
        "Oui. Répartissez autant de fois que vous voulez. Pas besoin de compte.",
      ),
      faq(
        "Les équipes sont justes ?",
        "Les noms sont mélangés avec Fisher-Yates et crypto.getRandomValues() dans ce navigateur. Garder des équipes de taille proche laisse les tailles à une personne près, quand les nombres le permettent. C'est une chance égale, pas le niveau. La page de test publie des échantillons.",
        fairness,
      ),
      faq(
        "Combien d'équipes je peux créer ?",
        "Autant que vous avez de personnes. Choisissez Nombre d'équipes ou une taille. Avec les capitaines activés, il faut au moins une équipe par capitaine.",
      ),
      faq(
        "Je peux désigner des capitaines ?",
        "Oui. Mettez la couronne sur un nom, activez Utiliser les capitaines, et chaque capitaine tombe d'abord dans une équipe différente.",
      ),
      faq(
        "Je peux ajuster les équipes après ?",
        "Oui. Glissez un nom vers une autre équipe, ou choisissez l'équipe dans le menu de la ligne. Changez le nom, puis Copier tout.",
      ),
      faq(
        "Je peux recommencer ?",
        "Cliquez sur Refaire pour une autre répartition. Les précédentes restent dans Répartitions récentes, si vous voulez en rouvrir une.",
      ),
      faq(
        "Ça choisit un gagnant ?",
        "Non. Vous obtenez des groupes. Utilisez Choisir un nom pour un seul nom, ou Mélanger la liste pour un ordre nouveau sans équipes.",
      ),
      faq(
        "La liste reste chez moi ?",
        "Ici, oui. Les noms, les équipes et l'historique restent dans cette extension, dans ce navigateur. La Politique de confidentialité couvre le site.",
        privacy,
      ),
    ],
    "Ouvrir Former des équipes sur SpinWheelPlus",
    "Ouvrir Former des équipes sur SpinWheelPlus",
    pageNote,
  ),
};
