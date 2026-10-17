import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const ZH_HANS_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "这个转盘用来做什么",
  featuresLead:
    "这是你自己填名字的转盘，就开在网页旁边。填上名字，换颜色，打开声音，然后转。名单留在这台设备上。要发链接、嵌到网页，或存进账号，去 SpinWheelPlus 的编辑页。",
  features: [
    {
      id: "weighted-slices",
      title: "扇区越大越容易中",
      desc: "想让某个选项更容易中，就把它的权重调高。扇区更宽，机会就更大。图片在逐行查看里加。扇区大小不一样时，先跟大家说一声。",
    },
    {
      id: "images-themes",
      title: "图片和颜色",
      desc: "选颜色、外圈、中心和标题。把图片贴到一个扇区上。页面背景和 Unsplash 图库在网站的编辑页里。",
    },
    {
      id: "sounds-winner",
      title: "声音和结果框",
      desc: "转动时和中奖时可以有声音。指针停下后，可以放彩纸或烟花。关掉结果框，或去掉刚抽中的名字，下次就不会再转到它。",
    },
    {
      id: "entries-history",
      title: "名单和记录",
      desc: "可以一次改很多行，也可以一个一个改。打乱、排序，或清空。结果记录留在这台设备上。",
    },
    {
      id: "beside-tab",
      title: "就在当前网页旁边转",
      desc: "Docs、Meet 或课堂页面开着，在这里转就行。点转盘，或按 Space。",
    },
    {
      id: "full-editor",
      title: "发链接、嵌网页、存账号",
      desc: "打开 SpinWheelPlus 的编辑页，复制链接、把转盘嵌进网页、加背景，或存进账号。",
    },
    {
      id: "fairness-audit",
      title: "可以自己核对是不是随机",
      desc: "每次转动都在这个浏览器里用 crypto.getRandomValues()。公平性测试公布了 111 个名字、10,000 次转动（4 轮），以及按转盘大小做的卡方检验。",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "公平性测试",
      linkTitle: "打开 SpinWheelPlus 的公平性测试",
    },
  ],
  faqHeading: "常见问题",
  faqs: [
    {
      question: "用 SpinWheelPlus 要钱吗？",
      answer:
        "平常用不用钱：这个扩展和网站上的编辑页都是。以后如果有付费功能，也是可选项。第一次试转不会被拦住。",
    },
    {
      question: "转动要登录吗？",
      answer:
        "不用。扩展把转盘存在这台设备上。只有想把转盘存进账号时，才去 SpinWheelPlus 登录。",
    },
    {
      question: "转盘真的是随机的吗？",
      answer:
        "是。每次转动都在这个浏览器里用 crypto.getRandomValues()，不是事先定好的数字。想自己跑几千次，打开公平性测试。课堂和直播够用。这不是有牌照的彩票。",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "公平性测试",
      linkTitle: "打开 SpinWheelPlus 的公平性测试",
    },
    {
      question: "权重是什么？",
      answer:
        "在逐行查看里把权重调高，那个扇区就占得更大，也更容易中。适合有人多一张票，或想让某个选项稍微更有机会。算法就画在转盘上，不会在背后改。网站上的公平性测试只测大小一样的扇区。",
    },
    {
      question: "能把转盘发给别人吗？",
      answer:
        "从这个窗口不行。打开 SpinWheelPlus 的编辑页来复制链接。对方打开链接，就能看到同一个转盘。",
      href: SITE_URL,
      linkLabel: "SpinWheelPlus 的编辑页",
      linkTitle: "打开 SpinWheelPlus 编辑页",
    },
    {
      question: "能嵌到直播或网站上吗？",
      answer:
        "用 SpinWheelPlus 的编辑页来嵌入，或打开转动页面。这个扩展留在当前网页旁边，方便你边讲边转。",
    },
    {
      question: "我的名单会被发出去吗？",
      answer:
        "只在这个窗口里用的话，不会。名字存在这个浏览器的扩展存储里，直到你打开编辑页并点分享或保存。别把学生的敏感信息放进公开链接。怎么保存、怎么删除，写在隐私政策里。",
      href: SITE_PRIVACY_URL,
      linkLabel: "隐私政策",
      linkTitle: "SpinWheelPlus 隐私政策",
    },
    {
      question: "最多能加多少个名字？",
      answer:
        "最多 1000 个。超过大约 120 个，投到大屏幕上就不好认。名单太长就分成两个转盘。",
    },
  ],
};
