import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
  SITE_URL,
} from "@/lib/constants";
import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";

export const VI_WHEEL_ABOUT: {
  featuresHeading: string;
  featuresLead: string;
  features: readonly AboutFeatureItem[];
  faqHeading: string;
  faqs: readonly AboutFaqItem[];
} = {
  featuresHeading: "Bánh xe này dùng để làm gì",
  featuresLead:
    "Đây là bánh xe bạn tự điền tên, ngay trong khung bên cạnh trang web. Thêm tên, đổi màu, bật tiếng, rồi quay. Danh sách nằm trên máy này. Muốn gửi link, gắn bánh lên trang web, hoặc lưu vào tài khoản thì mở trang sửa trên SpinWheelPlus.",
  features: [
    {
      id: "weighted-slices",
      title: "Lát to thì dễ trúng hơn",
      desc: "Muốn một lựa chọn dễ trúng hơn, tăng trọng số của lát đó. Lát rộng hơn là xác suất cao hơn. Ảnh thêm ở mục Xem từng dòng. Nếu các lát không đều, nói trước cho mọi người.",
    },
    {
      id: "images-themes",
      title: "Ảnh và màu",
      desc: "Chọn màu, viền, tâm bánh và tiêu đề. Gắn ảnh lên một lát. Nền trang và kho ảnh Unsplash nằm ở trang sửa trên web.",
    },
    {
      id: "sounds-winner",
      title: "Tiếng và khung kết quả",
      desc: "Bật tiếng lúc quay và lúc trúng. Khi kim dừng, có thể thả hoa giấy hoặc pháo hoa. Đóng khung, hoặc bỏ tên vừa trúng để lần sau không ra tên đó nữa.",
    },
    {
      id: "entries-history",
      title: "Danh sách và lịch sử",
      desc: "Sửa nhiều dòng cùng lúc, hoặc sửa từng tên. Xáo trộn, sắp xếp, hoặc xóa. Lịch sử kết quả nằm trên máy này.",
    },
    {
      id: "beside-tab",
      title: "Quay ngay cạnh trang đang mở",
      desc: "Giữ Docs, Meet hoặc trang lớp học mở, rồi quay ở đây. Bấm bánh hoặc nhấn Space.",
    },
    {
      id: "full-editor",
      title: "Gửi link, gắn trang, lưu tài khoản",
      desc: "Mở trang sửa trên SpinWheelPlus để copy link, gắn bánh xe, thêm nền, hoặc lưu vào tài khoản.",
    },
    {
      id: "fairness-audit",
      title: "Kiểm tra được có ngẫu nhiên không",
      desc: "Mỗi lần quay dùng crypto.getRandomValues() ngay trên trình duyệt này. Trang kiểm tra công bố mẫu 111 tên, 10.000 lần quay (4 lượt) và phép kiểm chi-square theo cỡ bánh.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "Trang kiểm tra",
      linkTitle: "Mở trang kiểm tra của SpinWheelPlus",
    },
  ],
  faqHeading: "Câu hỏi thường gặp",
  faqs: [
    {
      question: "SpinWheelPlus có mất phí không?",
      answer:
        "Không, với cách dùng thông thường: tiện ích này và trang sửa trên web. Nếu sau này có phần trả phí, đó là phần thêm. Lần quay thử đầu không bị chặn.",
    },
    {
      question: "Có cần tài khoản để quay không?",
      answer:
        "Không. Tiện ích lưu bánh trên máy này. Đăng nhập trên SpinWheelPlus khi bạn muốn lưu bánh vào tài khoản.",
    },
    {
      question: "Bánh có thật sự ngẫu nhiên không?",
      answer:
        "Có. Mỗi lần quay dùng crypto.getRandomValues() trên trình duyệt này, không phải một số chọn sẵn. Muốn tự chạy hàng nghìn lượt thì mở trang kiểm tra. Đủ cho lớp học và livestream. Đây không phải xổ số có giấy phép.",
      href: SITE_FAIRNESS_AUDIT_URL,
      linkLabel: "trang kiểm tra",
      linkTitle: "Mở trang kiểm tra của SpinWheelPlus",
    },
    {
      question: "Trọng số là gì?",
      answer:
        "Ở mục Xem từng dòng, tăng trọng số thì lát đó chiếm nhiều bánh hơn và dễ trúng hơn. Hợp khi ai đó có thêm vé, hoặc khi muốn một lựa chọn nhỉnh hơn một chút. Cách tính nằm ngay trên mặt bánh, không chỉnh ngầm. Trang kiểm tra trên web chỉ đo các lát bằng nhau.",
    },
    {
      question: "Gửi bánh cho người khác được không?",
      answer:
        "Từ khung này thì không. Mở trang sửa trên SpinWheelPlus để copy link. Người kia mở link đó là thấy bánh xe.",
      href: SITE_URL,
      linkLabel: "trang sửa trên SpinWheelPlus",
      linkTitle: "Mở trang sửa SpinWheelPlus",
    },
    {
      question: "Gắn bánh lên livestream hoặc website được không?",
      answer:
        "Dùng trang sửa trên SpinWheelPlus để gắn bánh hoặc mở trang quay. Tiện ích này nằm cạnh tab hiện tại để bạn vừa nói vừa quay.",
    },
    {
      question: "Danh sách của tôi có bị gửi đi không?",
      answer:
        "Không, khi bạn chỉ dùng khung này. Tên nằm trong bộ nhớ của tiện ích, trên trình duyệt này, cho đến khi bạn mở trang sửa và bấm Chia sẻ hoặc Lưu. Đừng đưa thông tin nhạy cảm của học sinh lên link công khai. Cách lưu và cách xóa ghi trong Chính sách quyền riêng tư.",
      href: SITE_PRIVACY_URL,
      linkLabel: "Chính sách quyền riêng tư",
      linkTitle: "Chính sách quyền riêng tư của SpinWheelPlus",
    },
    {
      question: "Thêm được bao nhiêu tên?",
      answer:
        "Tối đa 1000. Quá khoảng 120 tên thì lát khó đọc trên máy chiếu. Danh sách quá dài thì chia làm hai bánh.",
    },
  ],
};
