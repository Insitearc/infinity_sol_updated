import re
from pathlib import Path

root = Path('.')
html_files = [p for p in root.iterdir() if p.suffix == '.html']
for p in html_files:
    text = p.read_text(encoding='utf-8')
    orig = text
    text = re.sub(r'<a href="index\.html#appointment" class="btn btn-primary btn-sm hide-tablet">Book Consultation</a>\s*<button class="burger-menu" id="burgerToggle" aria-label="Toggle Navigation">[\s\S]*?<\/button>',
                  '<a href="index.html#appointment" class="btn btn-primary btn-sm hide-tablet">Book Consultation</a>', text)
    text = re.sub(r'<!-- MOBILE DRAWER MENU -->[\s\S]*?(?=<main>)', '', text)
    if text != orig:
        p.write_text(text, encoding='utf-8')

js_path = root / 'script.js'
js_text = js_path.read_text(encoding='utf-8')
js_orig = js_text
js_text = re.sub(r'\s*// --- 2\. MOBILE NAVIGATION DRAWER ---[\s\S]*?// --- SERVICES NAV DROPDOWN ---',
                 '\n    // --- SERVICES NAV DROPDOWN ---', js_text)
js_text = re.sub(r'\s*const drawerDropdowns = document\.querySelectorAll\("\.drawer-dropdown"\);[\s\S]*?// --- 3\. STICKY NAV ACTION & ACTIVE STATE INDICATOR ---',
                 '\n    // --- 3. STICKY NAV ACTION & ACTIVE STATE INDICATOR ---', js_text)
if js_text != js_orig:
    js_path.write_text(js_text, encoding='utf-8')

css_path = root / 'style.css'
css_text = css_path.read_text(encoding='utf-8')
css_orig = css_text
css_text = re.sub(r'\n\s*\.burger-menu \{[\s\S]*?\n\s*\}\s*\n\s*\.nav-menu \{[\s\S]*?\n\s*\}\s*', '', css_text)
css_text = re.sub(r'/\* Mobile Drawer \*[\s\S]*?\.drawer-overlay\.active \{[\s\S]*?\n\s*\}', '', css_text)
css_text = re.sub(r'\n\s*/\* Mobile drawer safety max-width \*/\s*\.mobile-drawer \{[\s\S]*?\n\s*\}\s*', '', css_text)
if css_text != css_orig:
    css_path.write_text(css_text, encoding='utf-8')

print('updated')
