#!/usr/bin/env bash
# Gộp toàn bộ bộ não Onsen thành 1 file knowledge để upload vào ChatGPT Project / Gemini Gem.
# Chạy: bash adapters/build-bundle.sh   (từ thư mục gốc repo)
set -euo pipefail
cd "$(dirname "$0")/.."   # về gốc repo
OUT="adapters/onsen-knowledge-bundle.md"

{
  echo "# ONSEN — KIẾN THỨC GỘP (knowledge bundle)"
  echo ""
  echo "> File này gộp persona + nguyên tắc + toàn bộ năng lực của Onsen để nạp làm knowledge cho ChatGPT Project / Gemini Gem. Sinh tự động từ repo — đừng sửa tay, hãy sửa file gốc rồi chạy lại build-bundle.sh."
  echo ""
  echo "---"
  echo ""
  cat CLAUDE.md
  echo ""; echo "---"; echo ""
  cat NGUYEN-TAC.md
  echo ""; echo "---"; echo ""
  # Mọi năng lực, theo thứ tự nhóm
  for f in $(find nang-luc -name "*.md" | sort); do
    echo ""; echo "<!-- ===== $f ===== -->"; echo ""
    cat "$f"
    echo ""; echo "---"; echo ""
  done
} > "$OUT"

echo "Đã tạo $OUT ($(wc -l < "$OUT") dòng, $(wc -c < "$OUT" | awk '{printf "%.0f KB", $1/1024}'))."
