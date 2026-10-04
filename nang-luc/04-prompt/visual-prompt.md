# Visual Prompt Studio (prompt ảnh & video)

> Một năng lực, hai chế độ: prompt ảnh tĩnh (A) hoặc prompt video từng shot (B). Dùng chung phần "Khóa chủ thể". Ra prompt/brief hình ảnh, KHÔNG viết kịch bản (đó là năng lực 03).

## Khi nào dùng
Định tuyến ngay từ đầu — hỏi muốn ảnh hay video, chọn đúng một nhánh:

| Muốn… | Dùng |
|---|---|
| Ảnh tĩnh cho ads/feed/landing (concept + prompt AI, hoặc brief chụp thật) | Chế độ A |
| Video động (chuyển kịch bản thành prompt render từng shot cho Veo/Kling/Seedance/Sora/Runway/Wan) | Chế độ B |

Nói chung chung → hỏi 1 câu: ảnh đứng yên hay video chạy được? Không tự đoán rồi làm cả hai.

## Đầu vào (Brain-first + luật ảnh thật)
- `brain-template/doanh-nghiep.md` — giọng, ngành, điều cấm kỵ.
- CIF + Brief/Big Idea trong `brain-template/ket-qua/` (nếu có) — góc, thông điệp hình cần truyền.
Thiếu brief → gợi năng lực 02.

Luật ảnh thật (chặn cứng):
- Mọi chế độ: bắt buộc có ảnh sản phẩm/chủ thể THẬT. Chưa có → dừng, xin ảnh (để bám đúng hình/màu/chất liệu/logo, tránh AI vẽ sai).
- Chế độ B thêm: bắt buộc kích thước/dung tích thật (cao × rộng × sâu, hoặc dung tích, hoặc chiều cao người). Thiếu → scale drift. Không tự ước lượng.
- Thiếu đầu vào bắt buộc: được dựng ý tưởng/shot list trong lúc chờ, nhưng không sinh prompt chủ thể. Thiếu thông tin không bắt buộc → suy luận, ghi assumption.

## Phần chung — Khóa chủ thể
Lập "Bản khóa chủ thể" mô tả cái bất biến; sinh một lần, copy nguyên văn vào mọi prompt; đưa duyệt TRƯỚC khi sinh prompt.
```
━━━ BẢN KHÓA CHỦ THỂ ━━━
A. KHỐI NHẬN DẠNG (cho T2V, tiếng Anh, một khối liền): [5–7 đặc điểm quan sát từ ảnh]
B. KHỐI BẤT BIẾN (do-not-change — mọi chế độ):
   Người:   face structure, hairstyle, [dấu hiệu riêng], outfit
   Sản phẩm: exact shape, proportions, color, label layout, logo, cap/closure, material finish
C. KHỐI TỈ LỆ (scale anchor — bắt buộc Chế độ B): [số đo thật] + [vật tham chiếu, vd "fits inside an adult palm"]
```
Cảnh báo bắt buộc: AI hay vẽ sai logo/chữ/tỉ lệ. Có logo/chữ nhận diện rõ → khuyên dùng AI tạo nền/bối cảnh rồi ghép ảnh SP thật vào, thay vì để AI vẽ lại SP.

## Chế độ A — Ảnh tĩnh
1. Quan sát ảnh (2–3 dòng, không bịa): hình dáng, màu, chất liệu, bối cảnh, điểm nhấn, hạn chế.
2. 3–5 ý tưởng concept, đa dạng góc. Mỗi ý: bố cục & bối cảnh · điểm nhấn thị giác (có chữ overlay không, chữ gì) · vì sao hiệu quả (dừng lướt/làm rõ lợi ích/tạo tin) · hợp nền tảng. Hướng: lifestyle · cận chất liệu · before/after · con người/cảm xúc · offer · so sánh.
3. Luôn hỏi: viết prompt AI hay brief chụp thật?
   - Prompt AI (Midjourney/DALL-E/Ideogram/Nano Banana): hợp SP generic/chỉ cần bối cảnh. Tiếng Anh + chú giải Việt, mỗi ý 1 prompt. Cấu trúc `[chủ thể + mô tả], [bối cảnh], [ánh sáng], [góc máy], [mood], [photorealistic, product photography, 8k]`. Khó giữ 100% logo/tỉ lệ → hợp làm nền/mood board để ghép SP thật.
   - Brief chụp thật (photographer): hợp SP có logo/chữ/tỉ lệ cần giữ chính xác. Gồm: Concept · Setup · Ánh sáng · Góc máy · Props · Lưu ý (giữ logo rõ, không che chi tiết X).

## Chế độ B — Video shot
Không viết kịch bản. Chưa có kịch bản → chuyển năng lực 03 (`nang-luc/03-content/video.md`) viết trước.
Bốn nguyên tắc: (1) một prompt = một cú máy, 4–8s; (2) I2V chỉ mô tả cái thay đổi theo thời gian — nhắc lại ngoại hình sẽ gây trôi chủ thể; (3) sản phẩm: liệt kê cái KHÔNG được đổi thay vì mô tả cái đẹp; (4) thiếu ảnh/kích thước thật → không sinh prompt.
1. Tách shot list: mỗi shot 1 hành động + 1 chuyển camera; 4–6s (trần 8s); ≤2–3 chủ thể; thoại <12 từ. Bảng `Cảnh → Shot → Thời lượng → Cỡ cảnh → Có chủ thể`.
2. Phân loại rủi ro từng shot:
   - Render được: SP tĩnh + camera động, B-roll, cận chất liệu, khí quyển, vi biểu cảm.
   - Rủi ro (prompt kèm cảnh báo): tay cầm/thao tác, thoại dài trực diện, >2 người, chất lỏng rót, thú cưng, chuyển động nhanh. Nêu cách giảm (cắt tay khỏi khung, rút thoại, render 2–3 lần).
   - Không nên render: cận chữ/thông số nhãn, logo chiếm phần lớn khung, before/after cơ thể, thao tác y tế, mặt người thật đã có footage. Không sinh prompt — đề xuất: quay thật · ảnh tĩnh + Ken Burns · comp logo hậu kỳ · motion graphic.
3. Chọn chế độ từng shot: ảnh khớp bối cảnh → I2V trực tiếp (ưu tiên); nền studio đổi nhẹ → I2V + đổi môi trường (chủ thể ≤40% khung); cần góc khác → xin ảnh góc đó (SP có thể T2V + khối nhận dạng); người thật ảnh không dùng được → xin chụp thêm, không thay T2V; shot không chủ thể → T2V thuần. Giữ nhất quán: cùng seed, copy nguyên văn khối nhận dạng, giữ bảng màu + hướng sáng, dùng chung ảnh reference.
4. Prompt tiếng Anh + negative + chú giải Việt:
   - I2V chỉ chứa: động từ + chuyển động camera + biến đổi ánh sáng + khí quyển + khối bất biến + khối tỉ lệ.
   - Negative theo nhóm: chung (morphing, flicker, gibberish text, watermark) · người (face drift, extra fingers, deformed hands) · sản phẩm (label/logo distortion, changed color/proportions, scale drift) · có thoại (bad lip sync).
   - Tránh: phủ định trong prompt chính (đẩy sang negative) · quá nhiều chủ thể · nhiều chuyển camera một shot · hoa văn/chữ phức tạp trên trang phục.
5. Checklist QC + chẩn đoán (kèm mỗi lần xuất): dừng khung cuối kiểm logo/nhãn đọc được, so tỉ lệ, đếm ngón/răng, soi chữ rác, kiểm vật lý. Khi hỏng: biến dạng dần → cắt ngắn/giảm biên độ; SP phình to → xóa mô tả ngoại hình khỏi I2V; logo méo → xoay nhãn khỏi khung/comp hậu kỳ; đổi mặt giữa shot → copy nguyên văn + khóa seed. Thường render 2–3 biến thể/clip.
6. Nhãn AI + bản quyền: bật nhãn AI nền tảng (TikTok AIGC, Meta "AI info") khi có người/giọng/cảnh tổng hợp; ảnh người thật phải có đồng ý (Điều 32 BLDS 2015); không tạo người có thật nói/làm điều họ không — ranh giới cứng. Video quảng cáo: kiểm thêm chính sách ngành (dược/mỹ phẩm/TPCN, công khai tài trợ).

> Model đổi hàng tháng: photoreal+thoại → Veo · chuyển động mạnh → Kling · tối ưu chi phí → Seedance · giữ nhân vật từ reference → Runway · khóa khung đầu–cuối → Wan. Quá 2 tháng từ lần cập nhật hoặc hỏi model cụ thể → tra web trước khi khuyến nghị.

## Đầu ra
Lưu `brain-template/ket-qua/` (gắn sản phẩm/chiến dịch), nối mạch CIF/brief. Chế độ B: Bản khóa chủ thể → shot list → từng shot (prompt + negative + chú giải + rủi ro + vùng chừa overlay) → QC → ghi chú (chế độ, kết quả kiểm tuân thủ, assumption, số lần render). >8 shot hoặc cần bản cho ê-kíp → gợi ý xuất file `.md` riêng.

## Không có công cụ
Đầu ra là text prompt/brief — chạy tốt mọi cửa (Claude, ChatGPT, Gemini free), không cần web. Chỉ cần dán ảnh thật + thông tin (kích thước thật nếu làm video, thông điệp chính). Nhắc lưu Bản khóa chủ thể để tái dùng.
