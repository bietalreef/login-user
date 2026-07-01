# ═══════════════════════════════════════════════════════
# 🚀 Cloudflare Pages Headers Configuration
# بيت الريف - Beit Al Reef PWA
# ═══════════════════════════════════════════════════════

# Service Worker - CRITICAL: Must have correct MIME type
/service-worker.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: no-cache, no-store, must-revalidate
  X-Content-Type-Options: nosniff

# PWA Manifest
/manifest.json
  Content-Type: application/manifest+json; charset=utf-8
  Cache-Control: public, max-age=86400

# Icons - Cache for 1 year
/icons/*
  Content-Type: image/png
  Cache-Control: public, max-age=31536000, immutable

# Images
/images/*
  Cache-Control: public, max-age=31536000, immutable

# Fonts
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

# Static Assets (CSS, JS)
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# HTML - No cache
/*.html
  Cache-Control: no-cache, no-store, must-revalidate
  X-Content-Type-Options: nosniff

# Global Security Headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=()
