import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const ZH_HANT_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "這個轉盤用來做什麼",
  featuresLead:
    "這是你自己填名字的轉盤，就開在網頁旁邊。填上名字，換顏色，打開聲音，然後轉。名單留在這台裝置上。要傳連結、嵌到網頁，或存進帳號，去 SpinWheelPlus 的編輯頁。",
  features: [
    {
      id: "weighted-slices",
      title: "扇區越大越容易中",
      desc: "想讓某個選項比較容易中，就把權重調高。扇區比較寬，機會就比較大。圖片在逐行查看裡加。扇區大小不一樣時，先跟大家說一聲。",
    },
    {
      id: "images-themes",
      title: "圖片和顏色",
      desc: "選顏色、外圈、中心和標題。把圖片貼到一個扇區上。頁面背景和 Unsplash 圖庫在網站的編輯頁裡。",
    },
    {
      id: "sounds-winner",
      title: "聲音和結果框",
      desc: "轉動時和中獎時可以有聲音。指針停下後，可以放彩紙或煙火。關掉結果框，或拿掉剛抽中的名字，下次就不會再轉到它。",
    },
    {
      id: "entries-history",
      title: "名單和紀錄",
      desc: "可以一次改很多行，也可以一個一個改。打亂、排序，或清空。結果紀錄留在這台裝置上。",
    },
    {
      id: "beside-tab",
      title: "就在目前的網頁旁邊轉",
      desc: "Docs、Meet 或課堂頁面開著，在這裡轉就好。點轉盤，或按 Space。",
    },
    {
      id: "full-editor",
      title: "傳連結、嵌網頁、存帳號",
      desc: "打開 SpinWheelPlus 的編輯頁，複製連結、把轉盤嵌進網頁、加背景，或存進帳號。",
    },
    {
      id: "fairness-audit",
      title: "可以自己核對是不是隨機",
      desc: "每次轉動都在這個瀏覽器裡用 crypto.getRandomValues()。公平性測試公布了 111 個名字、10,000 次轉動（4 輪），以及按轉盤大小做的卡方檢定。",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "公平性測試",
      linkTitle: "打開 SpinWheelPlus 的公平性測試",
    },
  ],
  faqHeading: "常見問題",
  faqs: [
    {
      question: "用 SpinWheelPlus 要錢嗎？",
      answer:
        "平常不用錢：這個擴充功能和網站上的編輯頁都是。以後如果有付費功能，也是自己選要不要用。第一次試轉不會被擋住。",
    },
    {
      question: "轉動要登入嗎？",
      answer:
        "不用。擴充功能把轉盤存在這台裝置上。只有想把轉盤存進帳號時，才去 SpinWheelPlus 登入。",
    },
    {
      question: "轉盤真的是隨機的嗎？",
      answer:
        "是。每次轉動都在這個瀏覽器裡用 crypto.getRandomValues()，不是事先定好的數字。想自己跑幾千次，打開公平性測試。上課和直播夠用。這不是有執照的彩券。",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "公平性測試",
      linkTitle: "打開 SpinWheelPlus 的公平性測試",
    },
    {
      question: "權重是什麼？",
      answer:
        "在逐行查看裡把權重調高，那個扇區就占得比較大，也比較容易中。適合有人多一張票，或想讓某個選項稍微更有機會。怎麼算就畫在轉盤上，不會在背後改。網站上的公平性測試只測大小一樣的扇區。",
    },
    {
      question: "能把轉盤傳給別人嗎？",
      answer:
        "從這個視窗不行。打開 SpinWheelPlus 的編輯頁來複製連結。對方打開連結，就能看到同一個轉盤。",
      href: SITE_URL,
      linkLabel: "SpinWheelPlus 的編輯頁",
      linkTitle: "打開 SpinWheelPlus 編輯頁",
    },
    {
      question: "能嵌到直播或網站上嗎？",
      answer:
        "用 SpinWheelPlus 的編輯頁來嵌入，或打開轉動頁面。這個擴充功能留在目前的網頁旁邊，方便你邊講邊轉。",
    },
    {
      question: "我的名單會被傳出去嗎？",
      answer:
        "只在這個視窗裡用的話，不會。名字存在這個瀏覽器的擴充功能裡，直到你打開編輯頁並點分享或儲存。別把學生的敏感資料放進公開連結。怎麼存、怎麼刪，寫在隱私權政策裡。",
      href: SITE_PRIVACY_URL,
      linkLabel: "隱私權政策",
      linkTitle: "SpinWheelPlus 隱私權政策",
    },
    {
      question: "最多能加多少個名字？",
      answer:
        "最多 1000 個。超過大約 120 個，投到大螢幕上就不好認。名單太長就分成兩個轉盤。",
    },
  ],
};
