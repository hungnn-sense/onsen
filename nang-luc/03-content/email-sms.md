# Email marketing & SMS/Zalo ZNS

> Công thức, mức nhận thức, đòn tâm lý, từ cấm, quy tắc số: xem `_loi-chung.md`. File này chỉ lo điểm riêng của email và tin nhắn ngắn.

## Khi nào dùng
- Email: 1 email (tiêu đề + thân + CTA) hoặc chuỗi nurture.
- Tin ngắn: SMS hoặc Zalo ZNS (giới hạn ký tự, 1 CTA).
- Phân biệt email lạnh (chưa quen) vs khách cũ (đã mua/để lại info).

## Đầu vào (Brain-first)
- `brain-template/doanh-nghiep.md` — giọng, ngành, điều cấm kỵ, tên thương hiệu/người gửi.
- `brain-template/chien-dich/<sp>.md` — offer, mức nhận thức, mục tiêu (bán/nuôi/thông báo).
- CIF — nỗi đau, rào cản, verbatim.
Thiếu brief → gợi năng lực 02. Hỏi 1 lần nếu thiếu: danh sách lạnh/khách cũ, có tên để cá nhân hoá không, kênh (email/SMS/ZNS), link đích/mã ưu đãi.

## Các bước
1. Phân loại danh sách trước khi viết:
   - Lạnh: mở bằng lý do liên quan tới họ, cho giá trị trước (Reciprocity), CTA nhẹ (đọc/xem), tránh giọng chào hàng.
   - Khách cũ: được nhắc tên, nhắc lần mua trước, offer thẳng, CTA mạnh.
2. Chọn công thức (`_loi-chung.md`): bán theo đau → PAS; giới thiệu SP → AIDA; có trước/sau → BAB.
3. Tiêu đề (subject):
   - Ngắn (~40 ký tự), cụ thể, chạm 1 lợi ích hoặc tò mò thật.
   - Không clickbait sai, không HOA toàn bộ, tránh từ dễ vào spam.
   - 2 tiêu đề để A/B + preheader nối tiếp (không lặp subject).
4. Thân email: 1 ý lớn/email, đoạn ngắn, dẫn tới 1 CTA chính. CTA phụ để cuối, nhẹ.
5. Chuỗi nurture — bảng chuỗi, mỗi email 1 vai trò, không lặp:

   | # | Gửi | Mục tiêu | Góc | CTA |
   |---|---|---|---|---|
   | 1 | ngay sau đăng ký | chào + cho giá trị | … | đọc/xem |
   | 2 | +2 ngày | khoét đau/câu chuyện | … | … |
   | 3 | +4 ngày | bằng chứng, xử lý rào cản | … | dùng thử |
   | 4 | +6 ngày | offer + khan hiếm | … | mua/đăng ký |

   Mỗi email đứng riêng đọc vẫn hiểu, nhưng nối mạch với email trước.
6. SMS/ZNS:
   - Đếm ký tự: SMS ~160/tin (tiếng Việt có dấu tốn hơn — cân nhắc bỏ dấu nếu brand chấp nhận); ZNS theo mẫu đã duyệt.
   - 1 thông điệp, 1 CTA, 1 link (rút gọn). Không nhồi.
   - Tên người gửi/brand ở đầu để khách nhận ra.
   - ZNS khớp template nền tảng duyệt. Không đưa dữ liệu cá nhân nhạy cảm vào link/nội dung.

## Đầu ra
Lưu `brain-template/ket-qua/`, cập nhật file chiến dịch. Gồm:
- Email: 2 tiêu đề (A/B) + preheader + thân + CTA. Chuỗi thì kèm bảng chuỗi + nội dung từng email.
- SMS/ZNS: bản tin + số ký tự đã đếm + ghi rõ lạnh/khách cũ.
- Ghi chú (`_loi-chung.md` mục 7): định dạng · lạnh/khách cũ · mức nhận thức · công thức · đòn tâm lý · chỗ cần số thật · gợi ý A/B.

## Không có công cụ
File này chỉ sinh chữ, không gửi mail/tin. Gửi, cài automation, đo open-rate là của ESP/CRM. Thiếu CIF → viết theo thông tin đưa, đánh dấu chỗ phỏng đoán.
