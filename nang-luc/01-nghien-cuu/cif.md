# 01 — Hồ sơ Insight Khách hàng (CIF)

CIF = chân dung khách theo 7 chiều. Nền cho `../02-chien-luoc/brief.md` và mọi content.

## Khi nào dùng
Sếp yêu cầu "dựng CIF / chân dung khách / nỗi đau / nỗi sợ / lý do không mua"; hoặc trước khi viết content/nghiên cứu quảng cáo cho sản phẩm mới.

## Đầu vào (Brain-first — đọc trước, không hỏi lại thứ đã có)
- `brain-template/doanh-nghiep.md` — ngành, sản phẩm, giá, khách, giọng, USP, cấm kỵ.
- `brain-template/chien-dich/<ten-san-pham>.md` — demographic + ghi chú riêng sản phẩm.
- `brain-template/ket-qua/nghien-cuu-qc-<ten-san-pham>.md` (nếu có) — hút "phàn nàn/khen đối thủ" vào đúng ô.

Bắt buộc Sếp cung cấp (không suy ra thay): **Sản phẩm** + **Demographic**. Thiếu → hỏi gộp 1 lần, kèm xin review/khảo sát nếu có.

## Các bước
1. Chốt 2 input bắt buộc. Thiếu chiều 2–7 → tự nghiên cứu/suy luận, không hỏi.
2. Gắn nhãn nguồn từng dòng: `(Sếp cung cấp)` · `(Nghiên cứu — nguồn: ___)` · `(Suy luận — cần xác minh)`.
3. Dựng đủ 7 chiều, không để trống:
   1. Demographic — tuổi, giới, vị trí, thu nhập, nghề.
   2. Behavioral — kênh mua, tần suất, giá/đơn, thanh toán, so sánh–trả giá.
   3. Pain points — nỗi đau cụ thể, có hoàn cảnh.
   4. Fears — hậu quả nếu không giải quyết / mua sai.
   5. Hopes & desires — tương lai mong đạt.
   6. Objections — muốn mà không mua (giá, chưa tin, đang dùng chỗ khác, sợ tác dụng phụ, bận).
   7. Verbatim — lời đời thường của khách, không phải lời marketing.
4. Điền ô "Phàn nàn/khen đối thủ" từ kết quả nghiên cứu quảng cáo; chưa có → ghi "Chưa có — làm `nghien-cuu-quang-cao.md` trước".
5. Chốt 3–5 dòng insight mạnh nhất + phần còn là suy luận cần xác minh.

## Đầu ra (lưu `brain-template/ket-qua/cif-<ten-san-pham>.md`)
Bảng CIF Markdown:
```markdown
# CIF — [Tên sản phẩm]
## 1. Demographic
## 2. Behavioral (nhãn từng dòng)
## 3. Top 5 Pain points
## 4. Top 5 Fears
## 5. Top 5 Hopes & desires
## 6. Top 5 Objections
## 7. Top 5 verbatim
## Phàn nàn về đối thủ / Lời khen đối thủ
## Niche segments ("Dành cho ___")
## → Insight mạnh nhất: 3–5 dòng + phần cần xác minh
```
Cập nhật `chien-dich/<ten-san-pham>.md`: "Đã có CIF ngày ___" + link.

## Chống bịa
- Không trình bày suy luận như dữ liệu thật; không bịa quote kèm tên/tuổi/nghề giả — không có trích thật thì ghi "mẫu câu điển hình".
- Phần suy luận: bỏ mọi số %, VNĐ, số lượng — chỉ định tính.
- Sản phẩm mới chưa có khách → CIF nghiêng suy luận, nói rõ; merge dữ liệu mới khi có đơn/feedback.

## Không có công cụ
Bản free không tự duyệt web → không tạo nhãn `(Nghiên cứu)` từ suy đoán; nhờ Sếp dán review thật rồi phân tích. Không ghi file được → xuất bảng ra màn hình, dặn Sếp lưu.
