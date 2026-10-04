# 01 — Nghiên cứu Quảng cáo Facebook cùng ngành

Xem quảng cáo công khai đang chạy trong ngành trên Meta Ad Library (gồm đối thủ, rộng hơn đối thủ), chấm 8 tiêu chí, rút pattern thị trường + khe hở. Kết quả chảy ngược bổ sung `cif.md`.

## Khi nào dùng
Sếp yêu cầu "xem quảng cáo cùng ngành / ngành đang chạy ads kiểu gì / Ad Library / soi đối thủ"; hoặc trước khi dựng CIF / lên chiến lược content.

## Đầu vào (Brain-first — đọc trước)
- `brain-template/doanh-nghiep.md` — ngành/lĩnh vực, khu vực target, đối thủ chính.
- `brain-template/chien-dich/<ten-san-pham>.md` — ngành hàng/đối thủ riêng sản phẩm.

Chỉ hỏi thứ chưa có: **từ khóa ngành/loại sản phẩm** (và/hoặc **tên fanpage** soi đích danh) · target **VN hay quốc tế**.

## Các bước
1. Chốt từ khóa ngành + (tùy chọn) fanpage. Không có → hỏi, dừng chờ.
2. Mở Ad Library 2 hướng (đổi `country` theo target):
   - Theo từ khóa: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=VN&q=<từ khóa>`
   - Theo fanpage: tra tên/link trang.
3. Trích dữ liệu công khai từng ads: creative, copy, CTA, ngày bắt đầu. Ưu tiên ads chạy lâu nhất. Spend/reach ads thương mại thường ẩn — không thấy không bịa.
4. Chấm 0–10 theo 8 tiêu chí (trọng số):
   1. Độ sống của ads (15%)
   2. Đầu tư creative (10%)
   3. Hook mở đầu (15%)
   4. Offer & CTA (15%)
   5. Landing page đồng bộ (15%)
   6. Social proof (10%)
   7. Tần suất ra ads mới (10%)
   8. Target rõ ràng (10%)
5. Bảng so sánh (1 dòng/ads, cột = điểm từng tiêu chí + tổng) + ads mạnh nhất + pattern lặp của cả ngành (hook, offer, góc, định dạng).
6. Chảy ngược CIF: gom phàn nàn + khen trong bình luận → đẩy vào 2 ô của `cif.md`.

## Đầu ra (lưu `brain-template/ket-qua/nghien-cuu-qc-<ten-san-pham>.md`)
- Bảng chấm 8 tiêu chí + bảng so sánh + "pattern chung ngành" + "bên mạnh nhất".
- Cập nhật `chien-dich/<ten-san-pham>.md`: "Đã nghiên cứu quảng cáo ngày ___" + link + 1 dòng pattern.
- Ghi chú: khoảng trống thị trường để đánh vào + nhắc "đã đẩy phàn nàn/khen sang CIF".

## An toàn khi dùng trình duyệt
Chỉ vào `facebook.com/ads/library` — không đăng nhập, không điền/submit form. Trang bắt đăng nhập → dừng, báo Sếp.

## Không có công cụ
Bản free không tự lướt web → hướng dẫn Sếp tự mở Ad Library, chụp/copy ads dán vào chat; Onsen chấm 8 tiêu chí trên phần Sếp dán. Không dán thì không chấm, không bịa. Không ghi file được → xuất bảng ra màn hình.
