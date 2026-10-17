import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const JA_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "このルーレットは何に使う",
  featuresLead:
    "開いているページの横で、このルーレットに名前を入れます。色を変えて、音を付けて、回します。リストはこの端末に残ります。リンクを送る、ページに載せる、アカウントに残すときは、SpinWheelPlusの編集ページを開いてください。",
  features: [
    {
      id: "weighted-slices",
      title: "大きい枠ほど出やすい",
      desc: "ある選択肢を多く出したいときは、重みを上げます。広い枠ほど出やすくなります。写真は「1人ずつ」で付けます。枠の大きさが違うときは、回す前に言ってください。",
    },
    {
      id: "images-themes",
      title: "写真と色",
      desc: "色、ふち、中心、タイトルを選べます。枠に写真を貼れます。ページの背景と Unsplash は、サイトの編集ページにあります。",
    },
    {
      id: "sounds-winner",
      title: "音と結果の枠",
      desc: "回っているときと、名前が出たときに音を出せます。止まったら、紙吹雪か花火を出せます。結果の枠を閉じるか、出た名前を外すと、次は別の名前が出ます。",
    },
    {
      id: "entries-history",
      title: "リストと履歴",
      desc: "何行もまとめて直すことも、1人ずつ直すこともできます。混ぜる、並べる、消すができます。履歴はこの端末に残ります。",
    },
    {
      id: "beside-tab",
      title: "開いているページの横で回す",
      desc: "Docs や Meet、授業のページを開いたまま、ここで回します。ルーレットをクリックするか、Space を押します。",
    },
    {
      id: "full-editor",
      title: "リンク、ページ、アカウント",
      desc: "SpinWheelPlusの編集ページを開くと、リンクをコピーしたり、ページに載せたり、背景を付けたり、アカウントに残せます。",
    },
    {
      id: "fairness-audit",
      title: "本当にランダムか確かめられる",
      desc: "毎回の回転は、このブラウザの crypto.getRandomValues() を使います。テストページには、111人、1万回（4回分）の結果と、ルーレットの大きさごとのカイ二乗検定が出ています。",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "テストページ",
      linkTitle: "SpinWheelPlusのテストページを開く",
    },
  ],
  faqHeading: "よくある質問",
  faqs: [
    {
      question: "SpinWheelPlusは有料？",
      answer:
        "ふだんの使い方は無料です。この拡張機能も、サイトの編集もです。あとから有料のものが出ても、それは別です。試しの1回が、支払った人だけ、ということはありません。",
    },
    {
      question: "回すのにアカウントは要る？",
      answer:
        "要りません。拡張機能が、この端末でルーレットを開いて残します。アカウントにルーレットを残したいときだけ、SpinWheelPlusに入ってください。",
    },
    {
      question: "本当にランダム？",
      answer:
        "毎回、このブラウザの crypto.getRandomValues() を使います。人が数字を選んでいるのではありません。何千回も自分の端末で見たいときは、テストページを開いてください。授業や配信に使えます。公的なくじではありません。",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "テストページ",
      linkTitle: "SpinWheelPlusのテストページを開く",
    },
    {
      question: "重みって何？",
      answer:
        "「1人ずつ」で重みを大きくすると、その枠が広くなり、出やすくなります。追加のくじ、または少しだけ出やすくしたいときに使います。計算はルーレットの上に見えます。サイトのテストは、同じ大きさの枠だけを測ります。",
    },
    {
      question: "誰かにルーレットを送れる？",
      answer:
        "ここからは送れません。SpinWheelPlusの編集ページを開いて、リンクをコピーしてください。一緒に出す人は、向こうで同じルーレットを開きます。",
      href: SITE_URL,
      linkLabel: "SpinWheelPlusの編集ページ",
      linkTitle: "SpinWheelPlusの編集ページを開く",
    },
    {
      question: "配信やサイトに載せられる？",
      answer:
        "載せるときや、回すページを開くときは、SpinWheelPlusの編集ページを使います。この拡張機能は、今のタブの横に置いて、話しながら回すためのものです。",
    },
    {
      question: "リストはどこかに送られる？",
      answer:
        "ここでは送られません。名前は、このブラウザの拡張機能の中に残ります。編集ページを開いて、共有か保存を押すまでは外に出ません。生徒の大事な情報を、公開リンクに入れないでください。残し方と消し方は、プライバシーポリシーに書いてあります。",
      href: SITE_PRIVACY_URL,
      linkLabel: "プライバシーポリシー",
      linkTitle: "SpinWheelPlusのプライバシーポリシー",
    },
    {
      question: "名前は何人まで？",
      answer:
        "1000人までです。120人を超えると、プロジェクターでは枠が読みにくくなります。多いときは、ルーレットを2つに分けてください。",
    },
  ],
};
