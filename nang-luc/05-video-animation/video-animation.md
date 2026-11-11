# 05 — Video animation (chỉ bản Claude Code)

Video dọc 9:16 không cần người lên hình: lời dẫn + thẻ giao diện chuyển động (tin nhắn, bảng số, biểu đồ, danh sách, sản phẩm…), phụ đề chạy theo giọng, tiếng hiệu ứng, cảnh kết có nút kêu gọi. Onsen dựng và xuất thẳng ra MP4 bằng bộ công cụ `cong-cu/video-animation/`.

## Khi nào dùng
Sếp nói "video animation", "video thẻ giao diện / motion / explainer", "làm video không cần quay", hoặc muốn biến 1 lời dẫn thành video có hình động.
Khác `../03-content/video.md`: file đó viết KỊCH BẢN để quay người thật. Năng lực này DỰNG video hoàn chỉnh từ lời dẫn.
Không chạy được lệnh (Claude/ChatGPT/Gemini trên web) → nói rõ việc này cần Onsen bản Claude Code; thay bằng kịch bản video (`video.md`).

## Cần thêm (ngoài đầu vào chung `../03-content/_loi-chung.md` Mục 0 — hỏi gộp 1 lượt nếu thiếu)
- **Lời dẫn:** Sếp đưa sẵn, hoặc Onsen viết theo `_loi-chung.md` + brief. 20–45 giây, 5–9 câu, mỗi câu 1 ý.
- **Màu thương hiệu** (mã màu, vd `#B45309`) + **logo** (PNG/SVG). Sếp không có → dùng màu mặc định, cảnh kết hiện tên thương hiệu.
- **Phong cách:** `hien-dai` (mặc định — nền sáng/tối, thẻ bo tròn) hoặc `sang-trong` (nền kem, chữ có chân, nét mảnh — spa, mỹ phẩm cao cấp, nội thất, trang sức).
- **Giọng:** Sếp tự thu bằng điện thoại, đọc đúng lời dẫn, **nghỉ ~0,5 giây giữa các câu** (công cụ dựa vào chỗ nghỉ để khớp cảnh). Chưa có → xuất bản không lời trước để Sếp xem nhịp và đọc theo phụ đề.
- **Nhạc nền** (tuỳ chọn): file Sếp có quyền dùng. Không dùng nhạc không rõ bản quyền.
- **Ảnh sản phẩm thật** nếu có cảnh `san-pham`.

## Các bước
1. **Cài lần đầu** (1 lần/máy): `cd cong-cu/video-animation && npm install`, rồi `node onsen-video.mjs kiem-tra`. Thiếu Node 22+ → hướng dẫn Sếp cài bản LTS ở nodejs.org. Lần đầu tự tải trình duyệt render (vài phút).
2. **Chốt lời dẫn:** mỗi câu = 1 cảnh (3–6 giây). Câu đầu là hook (con số / tình huống khách nhận ra mình), câu cuối dẫn tới hành động. Cụm cần nhấn đặt trong `{…}`, tối đa 1 cụm/câu.
3. **Chọn kiểu cảnh** cho từng câu theo bảng dưới — hình phải minh hoạ đúng ý câu, không trang trí suông. Đổi kiểu liên tục, tránh 2 cảnh liền nhau cùng kiểu.
4. **Tạo dự án:** `node onsen-video.mjs tao <ten>` → `brain-template/ket-qua/video/<ten>/` có sẵn `video.json` mẫu. Chép giọng/nhạc/logo/ảnh vào đó, viết lại `video.json`.
5. **Tự soát:** `node onsen-video.mjs xem <thu-muc>` → ảnh từng cảnh ở `xem-truoc/`. Mở `contact-sheet.jpg` kiểm: chữ tràn, thẻ đè phụ đề, sai dấu, thẻ trống, màu khó đọc. Sửa rồi xem lại trước khi đưa Sếp.
6. **Bản nháp cho Sếp duyệt:** `node onsen-video.mjs xuat <thu-muc> --nhap`. Sếp ưng → `xuat` bản chính `<ten>.mp4` (1080×1920, 30 khung/giây).
7. **Sếp sửa** ("cảnh 3 đổi thành biểu đồ", "đổi màu", "thêm cảnh giá") → sửa `video.json`, xuất lại. Đổi lời → thu lại giọng.

## video.json
```json
{
  "ten": "nen-thom-thang-11",
  "phong_cach": "hien-dai",
  "thuong_hieu": { "ten": "…", "mau_chinh": "#B45309", "mau_phu": "#F59E0B", "logo": "logo.png", "lien_he": "fb.com/…" },
  "giong": "giong.m4a",
  "nhac": "",
  "canh": [ { "loi": "Câu lời dẫn, {cụm nhấn}.", "kieu": "so-lon", "nhan": "Nhãn nhỏ đầu cảnh", "…": "tham số theo kiểu" } ]
}
```
- Mọi đường dẫn file tính từ thư mục dự án. `mau_phu` bỏ trống → tự pha sáng từ `mau_chinh`.
- Mỗi cảnh: `loi` (bắt buộc, trừ cảnh cuối như `ket`) · `kieu` · `nhan` (tuỳ chọn) · `nen` (`sang`/`toi`, có mặc định theo kiểu).
- Chưa có giọng: `toc_do_doc` (âm tiết/giây, mặc định 4.2) quyết định nhịp.
- Chỉ các cảnh CUỐI được bỏ trống `loi` (dùng `thoi_luong` giây).

## Thư viện cảnh
| kieu | Hợp với câu nói về | Tham số |
|---|---|---|
| `so-lon` | Hook bằng con số (nền tối) | `so` (số, tự đếm lên) hoặc `chu` · `don_vi` · `dong_phu` |
| `tieu-de` | Câu khẳng định, lật ý | `chu` (có `{nhấn}`) · `gach` (dòng bị gạch đỏ) · `dong_phu` |
| `tin-nhan` | Khách nhắn hỏi, inbox | `tieu_de` · `tin[]` (≤5) · `dem` · `the_duoi` {`tieu_de`,`so`,`ghi_chu`,`xau`} |
| `chi-so` | Nhìn số liệu, chỉ số | `o[]` {`ten`,`gia_tri` (số hoặc "?"),`don_vi`,`ghi_chu`} ≤6 · `con_tro` |
| `bieu-do` | Lên xuống theo thời gian | `tieu_de` · `diem[]` · `chip[]` {`i`,`chu`,`xau`} · `xu_huong` (`giam` = đỏ) |
| `danh-sach` | Lợi ích, ưu đãi, các bước | `tieu_de` · `muc[]` ≤5 · `dau` (`tich`/`x`) |
| `so-sanh` | Cách cũ vs cách mới | `trai` {`tieu_de`,`muc[]`} (sai) · `phai` {…} (đúng) |
| `cau-hoi` | Băn khoăn của khách | `cau[]` ≤3 |
| `dau-moc` | Câu chốt mạnh, phán quyết | `tren` · `chu` (1–2 từ) |
| `san-pham` | Giới thiệu sản phẩm + giá | `ten` · `gia` · `gia_cu` · `nhan_dan` · `nut` · `anh` (ảnh thật) |
| `thong-bao` | Đơn / lịch hẹn / tin mới về | `tb[]` {`tieu_de`,`noi_dung`,`gio`} ≤5 |
| `ket` | Cảnh cuối, kêu gọi | `cta` · `dong_phu` · `lien_he` · `thoi_luong` |

Cần hình không có trong bảng → chọn kiểu gần nhất; đừng sửa `runtime/` trừ khi Sếp yêu cầu.

## Luật riêng
- Số trong thẻ là minh hoạ → để "?" hoặc ghi "minh hoạ" (`chi-so` có số và `bieu-do` tự gắn "Số liệu minh hoạ"). Chỉ số thật của Sếp mới được trình bày như số thật.
- Không dựng lại logo/giao diện Facebook, Zalo, Shopee…: dùng tên chung ("Tin nhắn", "Đơn hàng").
- Lời dẫn theo `_loi-chung.md` Mục 5–6 (từ cấm, không bịa số, không bịa review). Giá/ưu đãi/liên hệ trong thẻ phải là của Sếp.
- Giọng và nhạc là của Sếp hoặc có quyền dùng. Dùng giọng AI → nhắc bật nhãn nội dung AI của nền tảng khi đăng.

## Đầu ra
- `<ten>.mp4` + `video.json` + `moc-thoi-gian.json` trong `brain-template/ket-qua/video/<ten>/`; cập nhật file chiến dịch.
- Báo Sếp: thời lượng, số cảnh, chỗ là số minh hoạ, chỗ cần Sếp kiểm (tên sản phẩm, giá, liên hệ).

## Khi lỗi
- Lệnh không chạy → `node onsen-video.mjs kiem-tra`, xử lý dòng ✗.
- Cảnh/phụ đề lệch lời → số câu trong `loi` phải khớp đúng lời đã thu (đúng thứ tự, không thêm/bớt câu); nhờ Sếp thu lại với chỗ nghỉ rõ giữa câu; xem `moc-thoi-gian.json` để biết cảnh nào lệch.
- Máy yếu, render lâu → dùng `--nhap` khi duyệt, bản chính chạy 1 lần cuối.
