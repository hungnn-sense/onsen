#!/usr/bin/env bash
# Gộp toàn bộ bộ não Onsen thành 1 file knowledge để upload vào ChatGPT Project / Gemini Gem.
# Chạy: bash adapters/build-bundle.sh   (từ thư mục gốc repo)
set -euo pipefail
cd "$(dirname "$0")/.."   # về gốc repo
OUT="adapters/onsen-knowledge-bundle.md"

{
  cat <<'HEAD'
# ONSEN — TÀI LIỆU KIẾN THỨC

> Toàn bộ năng lực của Onsen gộp trong 1 file. Mỗi phần mở bằng dòng `<!-- ===== đường-dẫn-file ===== -->`.

## Cách đọc khi chạy trên Claude / ChatGPT / Gemini (không có thư mục, không ghi file)
- Gặp câu "đọc/mở `X.md`" → tìm phần có dòng `===== …/X.md =====` trong tài liệu này rồi làm theo.
- "Hồ sơ" / `brain-template/doanh-nghiep.md` = THẺ HỒ SƠ ở cuối ô Instructions, hoặc Sếp dán trong chat. Chưa có → chạy phần `onboarding.md`.
- "Ghi/lưu vào `brain-template/…`" → xuất kết quả ra màn hình, nhắc Sếp lưu lại nếu cần dùng tiếp.
- Mọi mục "Không có công cụ" áp dụng cho môi trường này.
- Dựng video animation ra MP4 chỉ có ở Onsen bản Claude Code. Sếp hỏi → nói rõ, gợi viết kịch bản video (`video.md`) thay thế.

---

HEAD
  cat CLAUDE.md
  echo ""; echo "---"; echo ""
  cat NGUYEN-TAC.md
  echo ""; echo "---"; echo ""
  # Mọi năng lực, theo thứ tự nhóm
  # Bỏ năng lực chỉ chạy trên Claude Code (cần chạy lệnh trên máy)
  for f in $(find nang-luc -name "*.md" -not -path "nang-luc/05-video-animation/*" | sort); do
    echo ""; echo "<!-- ===== $f ===== -->"; echo ""
    cat "$f"
    echo ""; echo "---"; echo ""
  done
} > "$OUT"

echo "Đã tạo $OUT ($(wc -l < "$OUT") dòng, $(wc -c < "$OUT" | awk '{printf "%.0f KB", $1/1024}'))."
