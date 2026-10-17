import type { AboutFaqItem, AboutFeatureItem } from "@/lib/about-copy";
import type { ToolAbout } from "@/lib/i18n/about-pack";
import {
  SITE_FAIRNESS_AUDIT_URL,
  SITE_PRIVACY_URL,
} from "@/lib/constants";

const fairness = {
  href: SITE_FAIRNESS_AUDIT_URL,
  linkLabel: "trang kiểm tra",
  linkTitle: "Mở trang kiểm tra của SpinWheelPlus",
};

const privacy = {
  href: SITE_PRIVACY_URL,
  linkLabel: "Chính sách quyền riêng tư",
  linkTitle: "Chính sách quyền riêng tư của SpinWheelPlus",
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

const numberFeatures: readonly AboutFeatureItem[] = [
  feature(
    "range",
    "Từ số nhỏ đến số lớn",
    "Lấy số nguyên từ -1.000.000 đến 1.000.000. Nếu số nhỏ lớn hơn số lớn, trang vẫn chạy và tự hiểu đâu là thấp, đâu là cao.",
  ),
  feature(
    "exclude",
    "Bỏ vài số",
    "Gõ các số cách nhau bằng dấu phẩy. Những số đó không ra, cho đến khi bạn xóa khỏi ô này.",
  ),
  feature(
    "batch",
    "Một số hoặc nhiều số",
    "Chọn sẵn 1, 2, 3, 5 hoặc 10. Hoặc tự gõ, tối đa 500 số mỗi lần bấm.",
  ),
  feature(
    "repeat",
    "Số trùng trong một lần",
    "Bật: cùng một số có thể ra hai lần trong kết quả đó. Tắt: các số trong lần đó khác nhau.",
  ),
  feature(
    "roll",
    "Hiệu ứng trước khi ra số",
    "Có thể bật khoảng 2,5 giây số chạy trên màn hình. Số đã chọn xong trước đó bằng crypto.getRandomValues(). Phần chạy chỉ để nhìn.",
  ),
  feature(
    "history",
    "Lịch sử trên máy này",
    "Các lần ra số được giữ trong trình duyệt này. Bấm một dòng để xem lại, chép kết quả mới nhất, hoặc tải file .txt.",
  ),
  feature(
    "fairness-audit",
    "Kiểm tra được có ngẫu nhiên không",
    "Mỗi lần lấy số dùng crypto.getRandomValues() ngay trong trình duyệt này. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
];

const numberFaqs: readonly AboutFaqItem[] = [
  faq(
    "Ra số có mất phí không?",
    "Không. Ra số trong tiện ích này không cần tài khoản.",
  ),
  faq(
    "Có cần tài khoản không?",
    "Không. Tùy chọn và lịch sử nằm trên máy này. Chỉ đăng nhập SpinWheelPlus khi bạn muốn lưu bánh xe vào tài khoản.",
  ),
  faq(
    "Số có thật sự ngẫu nhiên không?",
    "Có. Mỗi lần dùng crypto.getRandomValues() trong trình duyệt này. Mọi số nguyên trong khoảng đều có cùng cơ hội. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
  faq(
    "Được lấy khoảng số nào?",
    "Số nguyên từ -1.000.000 đến 1.000.000. Khoảng hẹp hợp lúc bốc thăm. Khoảng rộng hợp lúc cần một mã mẫu.",
  ),
  faq(
    "Ra nhiều số một lúc được không?",
    "Được. Chọn mức có sẵn hoặc tự gõ, tối đa 500 số mỗi lần bấm.",
  ),
  faq(
    "Bỏ một vài số ra khỏi lần bốc được không?",
    "Được. Gõ các số cách nhau bằng dấu phẩy vào ô bỏ số. Chúng không ra cho đến khi bạn xóa khỏi ô đó.",
  ),
  faq(
    "Cùng một số có ra hai lần trong một lần bấm không?",
    "Có, khi bật cho phép trùng. Tắt nếu muốn các số trong lần đó khác nhau. Nếu bạn xin nhiều số không trùng hơn khoảng còn lại, trang sẽ báo không ra được.",
  ),
  faq(
    "Hiệu ứng có đổi số không?",
    "Không. Số đã chọn ngay lúc bạn bấm. Phần chạy trên màn hình chỉ để nhìn.",
  ),
  faq(
    "Lịch sử có bị gửi đi không?",
    "Không. Lịch sử nằm trong bộ nhớ của tiện ích, trên trình duyệt này. Cách trang web xử lý dữ liệu ghi trong Chính sách quyền riêng tư.",
    privacy,
  ),
];

const nameFeatures: readonly AboutFeatureItem[] = [
  feature(
    "list",
    "Danh sách tên",
    "Mỗi dòng một tên. Dán, mở file .txt, xáo trộn thứ tự, hoặc xóa hết.",
  ),
  feature(
    "duplicates",
    "Bỏ tên trùng",
    "Bật: mỗi tên chỉ tính dòng đầu, không phân biệt chữ hoa và chữ thường. Tắt: dòng giống nhau vẫn được giữ, như thêm một vé.",
  ),
  feature(
    "remove-winner",
    "Bỏ tên vừa trúng",
    "Bật: tên vừa trúng rời danh sách. Hợp khi chọn nhất, nhì, ba.",
  ),
  feature(
    "roll",
    "Hiệu ứng trước khi ra tên",
    "Có thể bật khoảng 2,5 giây tên chạy trên màn hình. Tên đã chọn xong trước đó bằng crypto.getRandomValues(). Phần chạy chỉ để nhìn.",
  ),
  feature(
    "history",
    "Lịch sử trên máy này",
    "Các lần chọn được giữ trong trình duyệt này (tối đa 100). Bấm một dòng để xem lại, chép tên, hoặc tải file .txt.",
  ),
  feature(
    "fairness-audit",
    "Kiểm tra được có ngẫu nhiên không",
    "Mỗi lần chọn dùng crypto.getRandomValues() ngay trong trình duyệt này. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
];

const nameFaqs: readonly AboutFaqItem[] = [
  faq(
    "Chọn tên có mất phí không?",
    "Không. Chọn tên trong tiện ích này không cần tài khoản.",
  ),
  faq(
    "Có cần tài khoản không?",
    "Không. Danh sách và lịch sử nằm trên máy này. Chỉ đăng nhập SpinWheelPlus khi bạn muốn lưu bánh xe vào tài khoản.",
  ),
  faq(
    "Mỗi tên có cùng cơ hội không?",
    "Có. Mỗi lần chọn dùng crypto.getRandomValues() trong trình duyệt này. Mỗi tên trong danh sách có cùng cơ hội. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
  faq(
    "Chọn nhiều tên một lúc được không?",
    "Mỗi lần bấm ra một tên. Muốn các tên không trùng nhau thì bật Bỏ tên vừa trúng, rồi chọn tiếp.",
  ),
  faq(
    "Bỏ tên trùng dùng để làm gì?",
    "Bật thì mỗi tên chỉ tính dòng đầu, không phân biệt chữ hoa và chữ thường. Tắt thì dòng giống nhau vẫn được giữ, như thêm một vé.",
  ),
  faq(
    "Bỏ tên vừa trúng dùng để làm gì?",
    "Sau mỗi lần chọn, tên đó rời danh sách nên không trúng lại, cho đến khi bạn thêm lại.",
  ),
  faq(
    "Hiệu ứng có đổi tên trúng không?",
    "Không. Tên đã chọn ngay lúc bạn bấm. Hiệu ứng chỉ chạy khoảng 2,5 giây trên màn hình.",
  ),
  faq(
    "Danh sách và lịch sử có bị gửi đi không?",
    "Không. Danh sách và lịch sử nằm trong bộ nhớ của tiện ích, trên trình duyệt này. Cách trang web xử lý dữ liệu ghi trong Chính sách quyền riêng tư.",
    privacy,
  ),
];

const diceFeatures: readonly AboutFeatureItem[] = [
  feature(
    "table",
    "Bàn xúc xắc",
    "Thêm tối đa 25 viên: D4, D6, D8, D10, D12, D20. Bấm Đổ hoặc nhấn Space. Mỗi mặt dùng crypto.getRandomValues().",
  ),
  feature(
    "modifier",
    "Cộng hoặc trừ sau khi đổ",
    "Cộng hoặc trừ từ -99 đến +99 vào tổng. Cách từng viên rơi không đổi. Hợp kiểu 2d6+3.",
  ),
  feature(
    "setup",
    "Màu và file",
    "Sửa một viên để đổi màu mặt, màu số hoặc chấm, và chữ trên D6. Mặt để trống vẫn hiện số. Tải hoặc mở file JSON. Khung này không có link gửi cho người khác.",
  ),
  feature(
    "click",
    "Bấm lên xúc xắc",
    "Mặc định một lần bấm đổ hết. Trong tùy chọn có thể đổi thành đổ đúng viên bạn bấm.",
  ),
  feature(
    "history",
    "Lịch sử trên máy này",
    "Các lần đổ được giữ trong trình duyệt này (tối đa 200). Tải file .txt hoặc xóa khi bắt đầu lần mới.",
  ),
  feature(
    "fairness-audit",
    "Kiểm tra được có ngẫu nhiên không",
    "Mỗi mặt dùng crypto.getRandomValues() ngay trong trình duyệt này. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
];

const diceFaqs: readonly AboutFaqItem[] = [
  faq(
    "Đổ xúc xắc có mất phí không?",
    "Không. Đổ trong tiện ích này không cần tài khoản.",
  ),
  faq(
    "Mỗi mặt có cùng cơ hội không?",
    "Có. Mỗi lần đổ dùng crypto.getRandomValues() trong trình duyệt này, nên mỗi mặt có cùng cơ hội. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
  faq(
    "Đổ nhiều viên một lúc được không?",
    "Được. Thêm tối đa 25 viên (D4 đến D20) rồi đổ cùng lúc. Từ ba viên trở lên, nút hiện Đổ tất cả.",
  ),
  faq(
    "Đổ lại đúng một viên được không?",
    "Được. Trong tùy chọn, đặt Bấm lên xúc xắc thành Đổ một viên, rồi bấm viên đó. Mặc định là đổ tất cả.",
  ),
  faq(
    "Cộng trừ kiểu 2d6+3 được không?",
    "Được. Đặt cộng hoặc trừ trên hàng thêm xúc xắc, từ -99 đến +99. Nó cộng vào mặt có số. Nếu mặt chỉ có chữ thì phần cộng trừ không tính.",
  ),
  faq(
    "Ghi chữ lên D6 được không?",
    "Được. Sửa một viên D6 và chọn Chữ. Gõ chữ cho từng mặt, hoặc dùng Số hay Có / Không. Mặt để trống vẫn hiện số và vẫn tính vào tổng.",
  ),
  faq(
    "Chép hoặc lưu các lần đổ được không?",
    "Được. Chép tổng mới nhất, tải lịch sử dạng .txt, hoặc dùng Tệp để tải và mở cấu hình JSON.",
  ),
  faq(
    "Có viên D100 không?",
    "Không có viên D100 riêng. Dùng D10 khi cần số từ 1 đến 10, hoặc để vài viên trên bàn rồi tự đọc tổng.",
  ),
  faq(
    "Lịch sử đổ có bị gửi đi không?",
    "Không. Lịch sử nằm trong bộ nhớ của tiện ích, trên trình duyệt này. Cách trang web xử lý dữ liệu ghi trong Chính sách quyền riêng tư.",
    privacy,
  ),
];

const coinFeatures: readonly AboutFeatureItem[] = [
  feature(
    "table",
    "Bàn tung xu",
    "Thêm tối đa 25 đồng. Bấm Tung hoặc nhấn Space. Mỗi lần tung dùng crypto.getRandomValues(), nên ngửa và sấp đều 50/50.",
  ),
  feature(
    "metals",
    "Vàng, bạc, đồng",
    "Chọn màu khi thêm đồng, hoặc đổi cả bàn sang Có / Không, Thắng / Thua, hoặc Chẵn / Lẻ. Tải hoặc mở file JSON. Khung này không có link gửi cho người khác.",
  ),
  feature(
    "click",
    "Bấm lên đồng xu",
    "Mặc định một lần bấm tung hết. Trong tùy chọn có thể đổi thành tung đúng đồng bạn bấm.",
  ),
  feature(
    "history",
    "Lịch sử trên máy này",
    "Các lần tung được giữ trong trình duyệt này (tối đa 200). Tải file .txt hoặc xóa khi bắt đầu lần mới.",
  ),
  feature(
    "fairness-audit",
    "Kiểm tra được có ngẫu nhiên không",
    "Mỗi lần tung dùng crypto.getRandomValues() ngay trong trình duyệt này. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
];

const coinFaqs: readonly AboutFaqItem[] = [
  faq(
    "Tung xu có mất phí không?",
    "Không. Tung trong tiện ích này không cần tài khoản.",
  ),
  faq(
    "Ngửa và sấp có đúng một nửa không?",
    "Có, với trò chơi, giờ học và các lần gọi hàng ngày. Mỗi lần tung dùng crypto.getRandomValues() trong trình duyệt này. Đây không phải máy của sòng bạc hay xổ số. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
  faq(
    "Ghi chữ lên đồng được không?",
    "Được. Trong phần Mặt, chọn Có / Không, Thắng / Thua, hoặc Chẵn / Lẻ. Cặp đó dùng cho mọi đồng. Kiểu cổ điển vẫn là vàng, bạc và đồng.",
  ),
  faq(
    "Tung nhiều đồng một lúc được không?",
    "Được. Thêm tối đa 25 đồng rồi tung cùng lúc. Từ hai đồng trở lên, nút hiện Tung tất cả.",
  ),
  faq(
    "Tung lại đúng một đồng được không?",
    "Được. Trong tùy chọn, đặt Bấm lên đồng xu thành Tung một đồng, rồi bấm đồng đó. Mặc định là tung tất cả.",
  ),
  faq(
    "Chép hoặc lưu các lần tung được không?",
    "Được. Chép kết quả mới nhất, tải lịch sử dạng .txt, hoặc dùng Tệp để tải và mở cấu hình JSON.",
  ),
  faq(
    "Lịch sử tung có bị gửi đi không?",
    "Không. Lịch sử nằm trong bộ nhớ của tiện ích, trên trình duyệt này. Cách trang web xử lý dữ liệu ghi trong Chính sách quyền riêng tư.",
    privacy,
  ),
];

const yesNoFeatures: readonly AboutFeatureItem[] = [
  feature(
    "modes",
    "Bốn kiểu trả lời",
    "Có hoặc Không, Có / Không / Có thể, Đúng / Sai, hoặc câu bạn tự gõ, mỗi dòng một câu. Mỗi câu trong nhóm có cùng cơ hội.",
  ),
  feature(
    "ask",
    "Hỏi lại",
    "Bấm Hỏi lại hoặc nhấn Space. Mỗi lần dùng crypto.getRandomValues().",
  ),
  feature(
    "motion",
    "Hiệu ứng và tiếng",
    "Chọn lật, mờ dần, hiện từng chữ, hoặc khung chọn. Tiếng bật hay tắt tùy bạn. Câu trả lời đã chọn xong trước khi hiệu ứng chạy.",
  ),
  feature(
    "history",
    "Lịch sử trên máy này",
    "Các câu gần đây được giữ trong trình duyệt này (tối đa 200). Tải file .txt hoặc xóa khi không cần nữa.",
  ),
  feature(
    "fairness-audit",
    "Kiểm tra được có ngẫu nhiên không",
    "Mỗi lần hỏi dùng crypto.getRandomValues() ngay trong trình duyệt này. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
];

const yesNoFaqs: readonly AboutFaqItem[] = [
  faq(
    "Hỏi Có hoặc Không có mất phí không?",
    "Không. Hỏi trong tiện ích này không cần tài khoản.",
  ),
  faq(
    "Có và Không có đúng một nửa không?",
    "Ở kiểu Có hoặc Không thì có. Mỗi lần hỏi dùng crypto.getRandomValues() trong trình duyệt này. Thêm Có thể thì ba câu bằng nhau. Câu tự gõ thì chia đều các dòng. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
  faq(
    "Dùng Có thể hoặc câu của mình được không?",
    "Được. Đổi sang Có / Không / Có thể, Đúng / Sai, hoặc câu tự gõ.",
  ),
  faq(
    "Hiệu ứng hoặc tiếng có đổi câu trả lời không?",
    "Không. Câu đã chọn trước. Hiệu ứng và tiếng chỉ để nhìn và nghe.",
  ),
  faq(
    "Xem lại các câu cũ được không?",
    "Được. Các câu gần đây nằm trên máy này, tối đa 200. Có nút tải file .txt nếu bạn muốn giữ một bản.",
  ),
  faq(
    "Dùng cho quyết định lớn được không?",
    "Không nên. Việc quan trọng thì tự quyết. Trang này hợp lúc bí và những lựa chọn nhẹ.",
  ),
  faq(
    "Muốn ngửa hoặc sấp thì dùng gì?",
    "Dùng Tung đồng xu. Muốn số thì dùng Xúc xắc hoặc Số ngẫu nhiên.",
  ),
  faq(
    "Lịch sử câu trả lời có bị gửi đi không?",
    "Không. Lịch sử nằm trong bộ nhớ của tiện ích, trên trình duyệt này. Cách trang web xử lý dữ liệu ghi trong Chính sách quyền riêng tư.",
    privacy,
  ),
];

const shuffleFeatures: readonly AboutFeatureItem[] = [
  feature(
    "list",
    "Danh sách của bạn",
    "Mỗi dòng một mục. Có thể dán, mở file .txt, hoặc xóa hết.",
  ),
  feature(
    "ignore-empty",
    "Bỏ dòng trống",
    "Bật: bỏ dòng không có chữ trước khi xáo trộn. Tắt: dòng trống vẫn được tính là một chỗ.",
  ),
  feature(
    "duplicates",
    "Bỏ dòng trùng",
    "Bật: mỗi nội dung chỉ giữ dòng đầu, không phân biệt chữ hoa và chữ thường. Tắt: dòng giống nhau vẫn được giữ, như thêm một vé.",
  ),
  feature(
    "sound",
    "Có tiếng khi ra kết quả",
    "Một tiếng ngắn khi thứ tự mới hiện ra. Thứ tự đã chọn xong, tiếng không đổi kết quả. Mở lại từ lịch sử thì không có tiếng.",
  ),
  feature(
    "order",
    "Xáo trộn công bằng",
    "Dùng Fisher-Yates và crypto.getRandomValues() ngay trong trình duyệt này. Mọi cách sắp xếp đều có cùng xác suất. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
  feature(
    "history",
    "Lịch sử trên máy này",
    "Các lần xáo trộn gần đây được giữ trong trình duyệt (tối đa 50). Bấm một lần để xem lại, chép, hoặc tải file .txt.",
  ),
];

const shuffleFaqs: readonly AboutFaqItem[] = [
  faq(
    "Xáo trộn danh sách có mất phí không?",
    "Không. Xáo trộn và chép kết quả không cần tài khoản. Chỉ cần đăng nhập SpinWheelPlus khi bạn dùng tính năng khác trên web.",
  ),
  faq(
    "Kết quả có thật sự ngẫu nhiên không?",
    "Có. Danh sách được xáo trộn bằng Fisher-Yates và crypto.getRandomValues() của trình duyệt. Không có số cố định từ trước. Hợp lớp học, cuộc họp, và các lần bốc nhẹ. Xổ số có kiểm soát là việc khác. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
  faq(
    "Các tùy chọn dùng để làm gì?",
    "Bỏ dòng trống thì không tính dòng không có chữ. Bỏ dòng trùng thì mỗi nội dung chỉ giữ dòng đầu. Hợp khi vừa dán một bảng tính còn lộn xộn.",
  ),
  faq(
    "Xáo trộn nhầm thì lấy lại được không?",
    "Được. Mở Lịch sử xáo trộn trên máy này. Xóa lịch sử khi không cần nữa. Nếu xóa dữ liệu trình duyệt thì lịch sử này cũng mất.",
  ),
  faq(
    "Xáo trộn lại được không?",
    "Được, lúc nào cũng được. Mỗi lần bấm là một thứ tự mới.",
  ),
  faq(
    "Cho gì vào danh sách?",
    "Tên, việc nhà, đề tài, bài hát, câu gợi ý: mỗi dòng một thứ. Danh sách rất dài vẫn xáo trộn được. Khó là lúc đọc to hơn 100 dòng, không phải lúc máy tính.",
  ),
  faq(
    "Có chọn một người thắng không?",
    "Không. Bạn vẫn giữ đủ các mục, chỉ đổi thứ tự. Khi cần một tên, dùng Chọn tên ngẫu nhiên.",
  ),
  faq(
    "Danh sách và lịch sử có bị gửi đi không?",
    "Không. Danh sách và lịch sử nằm trong bộ nhớ của tiện ích, trên trình duyệt này. Cách trang web xử lý dữ liệu ghi trong Chính sách quyền riêng tư.",
    privacy,
  ),
];

const teamFeatures: readonly AboutFeatureItem[] = [
  feature(
    "list",
    "Danh sách tên",
    "Thêm từng tên, dán, hoặc mở file .txt. Bấm vương miện để đặt đội trưởng. Tối đa 300 tên.",
  ),
  feature(
    "split",
    "Theo số đội hoặc số người",
    "Chia theo số đội, hoặc theo số người mỗi đội. Có thể giữ các đội đều nhau, hoặc cho phép lệch.",
  ),
  feature(
    "captains",
    "Đội trưởng",
    "Mỗi đội trưởng vào một đội ngẫu nhiên khác nhau, và đứng đầu đội đó. Người còn lại xếp vào sau.",
  ),
  feature(
    "adjust",
    "Sửa sau khi chia",
    "Kéo một tên sang đội khác, hoặc chọn đội ngay trên dòng đó. Đổi tên đội, rồi chép tất cả.",
  ),
  feature(
    "sound",
    "Có tiếng khi ra đội",
    "Một tiếng ngắn khi có cách chia mới. Mở lại từ lịch sử thì không có tiếng.",
  ),
  feature(
    "fairness",
    "Chia ngẫu nhiên",
    "Dùng Fisher-Yates và crypto.getRandomValues() trong trình duyệt này. Công bằng về xác suất, không cân bằng trình độ. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
];

const teamFaqs: readonly AboutFaqItem[] = [
  faq(
    "Chia đội có mất phí không?",
    "Không. Chia bao nhiêu lần cũng được. Không cần tài khoản.",
  ),
  faq(
    "Các đội có đều nhau không?",
    "Tên được xáo trộn bằng Fisher-Yates và crypto.getRandomValues() trong trình duyệt này. Bật giữ đều thì số người mỗi đội lệch nhau không quá một, khi số lượng cho phép. Đó là đều về số người, không phải đều về trình độ. Mẫu chạy nằm trên trang kiểm tra.",
    fairness,
  ),
  faq(
    "Chia được bao nhiêu đội?",
    "Nhiều nhất bằng số người bạn có. Chọn số đội, hoặc số người mỗi đội. Nếu đang dùng đội trưởng, cần ít nhất một đội cho mỗi đội trưởng.",
  ),
  faq(
    "Đặt đội trưởng được không?",
    "Được. Bấm vương miện trên một tên, bật Dùng đội trưởng. Mỗi đội trưởng vào một đội ngẫu nhiên riêng.",
  ),
  faq(
    "Sửa đội sau khi chia được không?",
    "Được. Kéo một tên sang đội khác, hoặc chọn đội ngay trên dòng đó. Đổi tên đội, rồi chép tất cả.",
  ),
  faq(
    "Chia lại được không?",
    "Được. Bấm chia lại để có cách chia mới. Các lần cũ vẫn nằm trong lịch sử nếu bạn muốn mở lại.",
  ),
  faq(
    "Có chọn một người thắng không?",
    "Không. Bạn nhận các nhóm. Dùng Chọn tên ngẫu nhiên khi cần một tên, hoặc Xáo trộn danh sách khi cần thứ tự mới mà không chia đội.",
  ),
  faq(
    "Danh sách và lịch sử có bị gửi đi không?",
    "Không. Tên, đội và lịch sử nằm trong bộ nhớ của tiện ích, trên trình duyệt này. Cách trang web xử lý dữ liệu ghi trong Chính sách quyền riêng tư.",
    privacy,
  ),
];

export const aboutVi: ToolAbout = {
  number: {
    featuresHeading: "Trang này dùng để làm gì",
    featuresLead:
      "Trang này lấy số nguyên trong khoảng bạn chọn. Có thể bỏ một vài số, ra một số hoặc nhiều số, rồi chép hoặc tải lịch sử. Lịch sử chỉ nằm trên máy này. Muốn xem rộng hơn thì mở cùng công cụ trên SpinWheelPlus.",
    features: numberFeatures,
    faqs: numberFaqs,
    ctaLabel: "Mở Số ngẫu nhiên trên SpinWheelPlus",
    ctaTitle: "Mở Số ngẫu nhiên trên SpinWheelPlus",
    ctaNote: "Cùng công cụ, mở trong một tab trình duyệt.",
  },
  name: {
    featuresHeading: "Trang này dùng để làm gì",
    featuresLead:
      "Trang này chọn một tên trong danh sách bạn gõ. Có thể bỏ tên trùng, bỏ tên vừa trúng, rồi chép hoặc tải lịch sử. Lịch sử chỉ nằm trên máy này. Muốn xem rộng hơn thì mở cùng công cụ trên SpinWheelPlus.",
    features: nameFeatures,
    faqs: nameFaqs,
    ctaLabel: "Mở Chọn tên ngẫu nhiên trên SpinWheelPlus",
    ctaTitle: "Mở Chọn tên ngẫu nhiên trên SpinWheelPlus",
    ctaNote: "Cùng công cụ, mở trong một tab trình duyệt.",
  },
  dice: {
    featuresHeading: "Trang này dùng để làm gì",
    featuresLead:
      "Trang này đổ xúc xắc nhiều mặt. Thêm D4 đến D20, cộng hoặc trừ một số, rồi chép hoặc tải lịch sử. Lịch sử chỉ nằm trên máy này. Muốn xem rộng hơn thì mở cùng công cụ trên SpinWheelPlus.",
    features: diceFeatures,
    faqs: diceFaqs,
    ctaLabel: "Mở Xúc xắc trên SpinWheelPlus",
    ctaTitle: "Mở Xúc xắc trên SpinWheelPlus",
    ctaNote: "Cùng bàn xúc xắc, mở trong một tab trình duyệt.",
  },
  coin: {
    featuresHeading: "Trang này dùng để làm gì",
    featuresLead:
      "Trang này tung ngửa hoặc sấp. Thêm đồng vàng, bạc hoặc đồng, tung một đồng hoặc tung hết, rồi chép hoặc tải lịch sử. Lịch sử chỉ nằm trên máy này. Muốn xem rộng hơn thì mở cùng công cụ trên SpinWheelPlus.",
    features: coinFeatures,
    faqs: coinFaqs,
    ctaLabel: "Mở Tung đồng xu trên SpinWheelPlus",
    ctaTitle: "Mở Tung đồng xu trên SpinWheelPlus",
    ctaNote: "Cùng bàn tung xu, mở trong một tab trình duyệt.",
  },
  yesNo: {
    featuresHeading: "Trang này dùng để làm gì",
    featuresLead:
      "Trang này chọn Có, Không, Có thể, Đúng, Sai, hoặc câu bạn tự gõ. Hỏi lại bằng Space hoặc Enter. Lịch sử chỉ nằm trên máy này. Muốn xem rộng hơn thì mở cùng công cụ trên SpinWheelPlus.",
    features: yesNoFeatures,
    faqs: yesNoFaqs,
    ctaLabel: "Mở Có hoặc không trên SpinWheelPlus",
    ctaTitle: "Mở Có hoặc không trên SpinWheelPlus",
    ctaNote: "Cùng công cụ, mở trong một tab trình duyệt.",
  },
  shuffle: {
    featuresHeading: "Trang này dùng để làm gì",
    featuresLead:
      "Trang này đảo thứ tự các dòng trong danh sách. Không rút một người thắng. Bạn dán từng dòng, có thể bỏ dòng trống hoặc dòng trùng, rồi chép hoặc tải kết quả. Lịch sử chỉ nằm trên máy này. Muốn xem rộng hơn thì mở cùng công cụ trên SpinWheelPlus.",
    features: shuffleFeatures,
    faqs: shuffleFaqs,
    ctaLabel: "Mở Xáo trộn danh sách trên SpinWheelPlus",
    ctaTitle: "Mở Xáo trộn danh sách trên SpinWheelPlus",
    ctaNote: "Cùng công cụ, mở trong một tab trình duyệt.",
  },
  team: {
    featuresHeading: "Trang này dùng để làm gì",
    featuresLead:
      "Trang này chia danh sách tên thành các đội. Không rút một người thắng. Thêm tên, đặt đội trưởng, rồi chia. Lịch sử chỉ nằm trên máy này. Muốn xem rộng hơn thì mở cùng công cụ trên SpinWheelPlus.",
    features: teamFeatures,
    faqs: teamFaqs,
    ctaLabel: "Mở Chia đội trên SpinWheelPlus",
    ctaTitle: "Mở Chia đội trên SpinWheelPlus",
    ctaNote: "Cùng công cụ, mở trong một tab trình duyệt.",
  },
};
