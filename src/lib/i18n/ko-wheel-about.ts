import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const KO_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "이 룰렛은 어디에 쓰나요",
  featuresLead:
    "열린 페이지 옆에서 이 룰렛에 이름을 넣어요. 색을 바꾸고, 소리를 켜고, 돌려요. 목록은 이 기기에 남아요. 링크를 보내거나, 페이지에 올리거나, 계정에 남기려면 SpinWheelPlus 편집 페이지를 열어요.",
  features: [
    {
      id: "weighted-slices",
      title: "큰 칸이 더 자주 나와요",
      desc: "어떤 항목을 더 자주 내고 싶으면 무게를 올려요. 넓은 칸일수록 잘 나와요. 사진은 한 명씩에서 넣어요. 칸 크기가 다르면 돌리기 전에 말해요.",
    },
    {
      id: "images-themes",
      title: "사진과 색",
      desc: "색, 테두리, 가운데, 제목을 골라요. 칸에 사진을 붙여요. 페이지 배경과 Unsplash는 사이트 편집 페이지에 있어요.",
    },
    {
      id: "sounds-winner",
      title: "소리와 결과 칸",
      desc: "돌릴 때와 이름이 나올 때 소리가 날 수 있어요. 멈추면 색종이나 불꽃을 터뜨려요. 결과 칸을 닫거나, 나온 이름을 빼면 다음에는 다른 이름이 나와요.",
    },
    {
      id: "entries-history",
      title: "목록과 기록",
      desc: "여러 줄을 한꺼번에 고치거나, 한 명씩 고칠 수 있어요. 섞기, 정렬, 지우기가 돼요. 기록은 이 기기에 남아요.",
    },
    {
      id: "beside-tab",
      title: "열린 페이지 옆에서 돌려요",
      desc: "Docs, Meet, 수업 페이지를 연 채로 여기서 돌려요. 룰렛을 누르거나 Space를 눌러요.",
    },
    {
      id: "full-editor",
      title: "링크, 페이지, 계정",
      desc: "SpinWheelPlus 편집 페이지를 열면 링크를 복사하고, 페이지에 올리고, 배경을 넣거나 계정에 남겨요.",
    },
    {
      id: "fairness-audit",
      title: "정말 무작위인지 확인할 수 있어요",
      desc: "돌릴 때마다 이 브라우저의 crypto.getRandomValues()를 써요. 테스트 페이지에 이름 111개, 1만 번(4회) 결과와, 룰렛 크기에 따른 카이제곱 검정이 있어요.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "테스트 페이지",
      linkTitle: "SpinWheelPlus 테스트 페이지 열기",
    },
  ],
  faqHeading: "자주 묻는 질문",
  faqs: [
    {
      question: "SpinWheelPlus는 유료인가요?",
      answer:
        "평소에 쓰는 건 무료예요. 이 확장 프로그램도, 사이트의 편집도요. 나중에 유료가 생겨도 그건 따로예요. 시험으로 한 번 돌리는 일이 결제 뒤에 숨어 있지는 않아요.",
    },
    {
      question: "돌리려면 계정이 필요한가요?",
      answer:
        "필요 없어요. 확장 프로그램이 이 기기에서 룰렛을 열고 남겨요. 계정에 룰렛을 남기고 싶을 때만 SpinWheelPlus에 들어가요.",
    },
    {
      question: "정말 무작위로 나오나요?",
      answer:
        "돌릴 때마다 이 브라우저의 crypto.getRandomValues()를 써요. 사람이 숫자를 고르는 게 아니에요. 내 기기에서 수천 번을 보고 싶으면 테스트 페이지를 열어요. 수업이나 방송에 써요. 공식 복권은 아니에요.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "테스트 페이지",
      linkTitle: "SpinWheelPlus 테스트 페이지 열기",
    },
    {
      question: "무게가 뭔가요?",
      answer:
        "한 명씩에서 무게를 키우면 그 칸이 넓어지고 더 자주 나와요. 추가 응모나, 한 항목만 조금 더 잘 나오게 할 때 써요. 계산은 룰렛 위에 보여요. 사이트의 테스트는 칸 크기가 같을 때만 재요.",
    },
    {
      question: "룰렛을 다른 사람에게 보낼 수 있나요?",
      answer:
        "여기서는 못 보내요. SpinWheelPlus 편집 페이지를 열고 링크를 복사해요. 같이 진행하는 사람은 그쪽에서 같은 룰렛을 열어요.",
      href: SITE_URL,
      linkLabel: "SpinWheelPlus 편집 페이지",
      linkTitle: "SpinWheelPlus 편집 페이지 열기",
    },
    {
      question: "방송이나 사이트에 올릴 수 있나요?",
      answer:
        "올리거나 돌리는 페이지를 열 때는 SpinWheelPlus 편집 페이지를 써요. 이 확장 프로그램은 지금 탭 옆에 두고, 말하면서 돌리려고 있는 거예요.",
    },
    {
      question: "목록이 어디로 나가나요?",
      answer:
        "여기서는 안 나가요. 이름은 이 브라우저의 확장 프로그램 안에 남아요. 편집 페이지를 열고 공유나 저장을 누르기 전까지는요. 학생의 민감한 정보는 공개 링크에 넣지 마세요. 남기는 법과 지우는 법은 개인정보 처리방침에 있어요.",
      href: SITE_PRIVACY_URL,
      linkLabel: "개인정보 처리방침",
      linkTitle: "SpinWheelPlus 개인정보 처리방침",
    },
    {
      question: "이름은 몇 명까지 넣나요?",
      answer:
        "1000명까지예요. 120명을 넘으면 프로젝터에서 칸이 잘 안 읽혀요. 너무 많으면 룰렛을 둘로 나눠요.",
    },
  ],
};
