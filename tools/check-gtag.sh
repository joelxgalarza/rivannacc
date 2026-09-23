#!/bin/sh
# Regression check: every page carries exactly one Google tag (G-4K0GCV1JKV)
# immediately after <head>, plus exactly one Meta Pixel (1357863269567859)
# with PageView, a Contact event on call-button taps, and a noscript fallback.
# Run from rivanna-site/:  sh tools/check-gtag.sh
fail=0
n=0
for f in *.html areas/*.html services/*.html; do
  n=$((n + 1))
  hits=$(grep -c 'G-4K0GCV1JKV' "$f")
  if [ "$hits" -ne 2 ]; then
    echo "FAIL $f: measurement ID occurs $hits times, want 2 (script src + config)"
    fail=1
  fi
  next=$(grep -A1 '^<head>$' "$f" | tail -n 1)
  if [ "$next" != '<!-- Google tag (gtag.js) -->' ]; then
    echo "FAIL $f: line after <head> is not the Google tag"
    fail=1
  fi
  init=$(grep -c "fbq('init', '1357863269567859')" "$f")
  if [ "$init" -ne 1 ]; then
    echo "FAIL $f: Meta Pixel init occurs $init times, want 1"
    fail=1
  fi
  pv=$(grep -c "fbq('track', 'PageView')" "$f")
  if [ "$pv" -ne 1 ]; then
    echo "FAIL $f: PageView track occurs $pv times, want 1"
    fail=1
  fi
  contact=$(grep -c "fbq('track', 'Contact')" "$f")
  if [ "$contact" -ne 1 ]; then
    echo "FAIL $f: Contact track occurs $contact times, want 1"
    fail=1
  fi
  noscript=$(grep -c 'facebook.com/tr?id=1357863269567859' "$f")
  if [ "$noscript" -ne 1 ]; then
    echo "FAIL $f: noscript fallback occurs $noscript times, want 1"
    fail=1
  fi
  gtag_line=$(grep -n "gtag('config', 'G-4K0GCV1JKV');" "$f" | cut -d: -f1)
  pixel_line=$(grep -n '<!-- Meta Pixel Code -->' "$f" | cut -d: -f1)
  if [ -z "$pixel_line" ] || [ "$pixel_line" -le "$gtag_line" ]; then
    echo "FAIL $f: Meta Pixel block is not placed after the Google tag"
    fail=1
  fi
done
echo "checked $n pages"
exit $fail
