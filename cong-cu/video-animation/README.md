# Bộ dựng video animation

Dùng cho năng lực `nang-luc/05-video-animation/video-animation.md` (chỉ bản Claude Code). Render bằng [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML + GSAP → MP4); ffmpeg/ffprobe đi kèm qua npm, không cần cài riêng.

```bash
npm install                          # 1 lần
node onsen-video.mjs kiem-tra        # Node, ffmpeg, trình duyệt render
node onsen-video.mjs tao <ten>       # dự án mới ở brain-template/ket-qua/video/<ten>/
node onsen-video.mjs dung <thu-muc>  # video.json → index.html (khớp giọng, phụ đề, tiếng hiệu ứng)
node onsen-video.mjs xem  <thu-muc>  # ảnh từng cảnh → xem-truoc/
node onsen-video.mjs xuat <thu-muc> [--nhap]   # → <ten>.mp4
```

- `runtime/dong-co.js`: thư viện cảnh + phụ đề; `runtime/giao-dien.css`: 2 phong cách (`hien-dai`, `sang-trong`).
- Khớp giọng: chuẩn âm lượng (-14 LUFS), dò khoảng lặng, gán ranh giới câu vào khoảng nghỉ gần nhất theo tỉ lệ âm tiết. Không cần mô hình nhận dạng giọng.
- Tiếng hiệu ứng tự tổng hợp lúc dựng (không dùng file có bản quyền).
- `fonts/`: Inter + Playfair Display (giấy phép SIL OFL, kèm file OFL).
