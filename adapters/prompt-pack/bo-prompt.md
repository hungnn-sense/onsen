# Bộ prompt

Copy nguyên khối, điền `[…]`, dán vào chatbot. Từ Prompt 1 trở đi: dán kèm Thẻ hồ sơ ở đầu.

## Prompt 0 — Onboarding (tạo Thẻ hồ sơ, làm 1 lần)
```
Bạn là Onsen, trợ lý marketing. Xưng "Onsen", gọi tôi "Sếp", trả lời tiếng Việt.
Hỏi tôi từng cụm 2–3 câu: (1) tôi là ai; (2) thương hiệu + ngành; (3) sản phẩm chính + giá; (4) khách mục tiêu; (5) giọng thương hiệu; (6) kênh; (7) USP; (8) điều cấm kỵ ngành; (9) đối thủ chính.
Xong, xuất "THẺ HỒ SƠ" <150 từ để tôi lưu và dán lại phiên sau. Không bịa — thiếu gì để trống.
```

## Prompt 1 — Chân dung khách hàng (CIF)
```
[Thẻ hồ sơ]
Dựng bảng CIF cho [sản phẩm] theo 7 chiều: nhân khẩu · hành vi & kênh · nỗi đau · nỗi sợ · khao khát · rào cản · ngôn ngữ khách dùng. Mỗi dòng đánh dấu nguồn (tôi cung cấp / suy luận). Chốt 1 insight mạnh nhất. Không bịa review/số.
Dữ liệu (nếu có): [dán review, bình luận khách]
```

## Prompt 2 — Nghiên cứu quảng cáo cùng ngành
```
[Thẻ hồ sơ]
Tôi dán các quảng cáo Facebook cùng ngành (lấy từ Meta Ad Library). Chấm mỗi cái theo 8 tiêu chí (0–10): độ sống, creative, hook, offer/CTA, landing, social proof, tần suất ra ads mới, độ rõ target. Cho bảng so sánh + pattern chung của ngành + 1 khe hở tôi đánh vào được.
Quảng cáo: [dán copy/CTA/ngày chạy/mô tả ảnh]
```

## Prompt 3 — Kế hoạch chiến dịch (nhiều bài, có lịch)
```
[Thẻ hồ sơ] [CIF nếu có]
Lên KẾ HOẠCH CHIẾN DỊCH cho [mục tiêu + thời hạn] của [sản phẩm], gồm 8 mục:
(1) Mục tiêu + KPI (số + mốc; chưa có số thật thì để "[tôi chốt KPI]"); (2) Khách mục tiêu (tóm từ CIF); (3) 3–4 trụ thông điệp; (4) chiến lược kênh + vai trò mỗi kênh; (5) map phễu: nhận biết → cân nhắc → chuyển đổi; (6) LỊCH NỘI DUNG dạng bảng: tuần/ngày × tầng phễu × định dạng × kênh × trụ × mục tiêu bài × phụ thuộc; (7) ngân sách thô theo tầng (nếu có ads); (8) chỉ số đo + mốc review.
Nặng nhận biết ở đầu, dồn chuyển đổi về cuối; số bài vừa sức tôi (hỏi tôi năng lực sản xuất). Hỏi tôi xác nhận trước khi đi vào từng bài.
```

## Prompt 4 — Brief 1 bài
```
[Thẻ hồ sơ] [CIF + kế hoạch nếu có]
Lên content brief cho [1 bài / 1 dòng trong lịch]: (1) Big Idea; (2) 3 góc tiếp cận → chọn 1; (3) mức nhận thức nhắm tới; (4) công thức; (5) đòn tâm lý chính; (6) định dạng (lấy từ lịch, hoặc gợi 1–2 định dạng hợp nhất + lý do); (7) thông điệp cốt lõi + 1 CTA. Hỏi tôi xác nhận trước khi viết.
```

## Prompt 5 — Viết content (chọn định dạng trước)
```
[Thẻ hồ sơ] [CIF + brief nếu có]
Trước khi viết: gợi tôi 1–2 ĐỊNH DẠNG hợp nhất theo mục tiêu + mức nhận thức + kênh (bài dài / kịch bản video / post-caption-carousel / email-SMS / mô tả sàn TMĐT / kịch bản livestream / blog SEO / landing), nêu lý do, để tôi chốt.
Nếu là bài Facebook: cho tôi chọn 1 trong các định dạng — chính luận · kể chuyện · listicle · carousel · trước/sau · phá lầm tưởng/Hỏi-Đáp · mini case study · so sánh A/B · hậu trường · tương tác · mẹo nhanh · ưu đãi/đếm ngược.
Tôi chốt xong hãy viết cho [sản phẩm]: đúng giọng hồ sơ; khung Hook → Body → Bridge → Proof+CTA; 1 CTA; không bịa số (thiếu để "[Sếp bổ sung]"); tránh từ dễ bị từ chối quảng cáo. Cuối bài ghi: định dạng + công thức dùng + 1 gợi ý A/B.
```

## Prompt 6 — Prompt ảnh/video (cần ảnh thật)
```
[Thẻ hồ sơ]
Tôi gửi ảnh thật sản phẩm [tên], kích thước thật [nếu làm video].
- Ảnh tĩnh: 3–5 concept (bố cục · bối cảnh · điểm nhấn) → prompt tiếng Anh + chú giải tiếng Việt.
- Video: shot list, mỗi shot prompt tiếng Anh + negative prompt + chú giải, đánh dấu shot dễ sai.
Nhắc: AI dễ sai logo/chữ/tỉ lệ → ghép sản phẩm thật vào. [đính kèm ảnh]
```
