// Kage Supply copy for the ThreeUI Kage scroll experience.
// The canonical page (public/landing-pages/kage.html) is never edited: its HTML is
// fetched, only text/links in the existing scenes are rewritten here, and the result
// is handed to KageLandingPage through its supported `srcDoc` prop. The 3D scene,
// camera rig, scroll timing and parallax script are left untouched.
import type { Product } from "./store";
import { inr, LOW_STOCK } from "./store";

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const ARROW =
  '<svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg>';

/** Link that the parent window turns into an in-app navigation (the iframe sandbox blocks top navigation). */
const go = (to: string) => `href="${esc(to)}" data-kage-to="${esc(to)}" target="_top"`;

export const SHOP_LINKS = {
  collection: "/shop",
  audio: "/shop?cat=Audio",
  keyboards: "/shop?cat=Peripherals",
  accessories: "/shop?cat=Peripherals",
  inventory: "/inventory",
};

function stockLabel(stock: number) {
  if (stock === 0) return "Out of stock";
  if (stock <= LOW_STOCK) return `Only ${stock} left`;
  return `${stock} in stock`;
}

const BRIDGE = `<script>
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest && e.target.closest('[data-kage-to]');
  if (!a) return;
  e.preventDefault(); e.stopPropagation();
  parent.postMessage({ kageTo: a.getAttribute('data-kage-to') }, location.origin === 'null' ? '*' : location.origin);
}, true);
</script>`;

export function buildKageSupplyDoc(html: string, products: Product[], base = "/landing-pages/"): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const $ = (sel: string) => doc.querySelector(sel);
  const $$ = (sel: string) => Array.from(doc.querySelectorAll(sel));
  const text = (sel: string, value: string) => {
    const el = $(sel);
    if (el) el.textContent = value;
  };
  const html_ = (sel: string, value: string) => {
    const el = $(sel);
    if (el) el.innerHTML = value;
  };

  // Relative assets (three.min.js, foreground art) keep resolving from the original folder.
  const baseEl = doc.createElement("base");
  baseEl.href = base;
  doc.head.prepend(baseEl);
  doc.title = "Kage Supply — Enter a New State of Focus";

  // Preloader + nav
  text(".pre-jp", "影");
  text(".pre-meta > span", "Preparing Kage Supply");
  html_(".brand-tx", "<b>KAGE</b><i>SUPPLY · PRECISION TECHNOLOGY</i>");
  const nav = [
    ["#gate", "Audio", "音"],
    ["#pathways", "Keyboards", "鍵"],
    ["#lessons", "Collection", "品"],
  ];
  $$(".nav-link").forEach((a, i) => {
    if (i < 3) {
      a.setAttribute("href", nav[i]![0]!);
      a.innerHTML = `<span>${nav[i]![1]}</span><span class="alt">${nav[i]![2]}</span>`;
    } else {
      a.outerHTML = `<a class="nav-link" ${go(SHOP_LINKS.collection)} data-cursor><span>Store</span><span class="alt">店</span></a>`;
    }
  });

  // Scene 1 — brand introduction (hero)
  html_("#hero .eyebrow", '<span class="dot"></span> Kage Supply — Precision Technology');
  const lines = $$("#hero .mask-line > span");
  ["Enter a New", "State of", "Focus."].forEach((t, i) => lines[i] && (lines[i]!.textContent = t));
  const sub = $("#hero .hero-sub");
  if (sub) {
    sub.textContent = "Precision-engineered essentials for those who expect more from their everyday technology.";
    sub.insertAdjacentHTML(
      "afterend",
      `<div class="kage-actions" style="display:flex;flex-wrap:wrap;gap:22px;align-items:center;margin-top:28px;pointer-events:auto">
        <a class="cta" ${go(SHOP_LINKS.collection)} data-cursor><i></i><span>Explore the Collection</span>${ARROW}</a>
        <a class="arrowlink" href="#gate" data-cursor><span>Discover Kage</span><span class="ar">${ARROW}</span></a>
      </div>`,
    );
  }
  text("#hero .hero-cue > span", "Scroll to discover");
  const chips = [
    ["Audio", "Sound without distraction, built around the way you listen."],
    ["Keyboards", "Tactile precision for uninterrupted creation."],
    ["Accessories", "Mice, stands, hubs and desk essentials with a purpose."],
    ["Collection", "Every Kage Supply essential, priced in INR."],
  ];
  $$("#chips .chip .tx").forEach((tx, i) => {
    if (chips[i]) tx.innerHTML = `<b>${chips[i]![0]}</b><p>${chips[i]![1]}</p>`;
  });
  $("#hero .peek")?.setAttribute("aria-label", "Preview: the Kage night setup");
  html_("#hero .peek-cap", '<b class="jp">影</b><i>Kage — the night setup</i>');
  text("#hero .hero-side .v", "影");

  // Scene 2 — headphones (chapter I)
  html_("#gate .sec-head", '<span class="k"><b>01</b> — Audio</span><span class="rule"></span><span class="k jp">音</span>');
  text("#gate h2", "Sound Without Distraction.");
  text("#gate .lead", "Immersive audio. Considered design. Every detail built around the way you listen.");
  text(
    "#gate .gate-copy .body",
    "Premium wireless headphones and compact speakers tuned for long, quiet hours — active noise cancelling, soft-touch materials and controls that disappear under your fingers.",
  );
  const gateLink = $("#gate .arrowlink");
  if (gateLink) gateLink.outerHTML = `<a class="arrowlink" ${go(SHOP_LINKS.audio)} data-rv="fade" data-cursor><span>Explore Audio</span><span class="ar">${ARROW}</span></a>`;
  const cats = new Set(products.map((p) => p.category)).size;
  const from = products.length ? Math.min(...products.map((p) => p.price)) : 0;
  html_(
    "#gate .gate-stats",
    `<div><b>${String(products.length).padStart(2, "0")}</b><span>Essentials</span></div>
     <div><b>${String(cats).padStart(2, "0")}</b><span>Categories</span></div>
     <div><b>${esc(inr(from).replace(/\s/g, ""))}</b><span>Starting at</span></div>
     <div><b>∞</b><span>Focus</span></div>`,
  );

  // Scenes 3 + 4 — keyboards and accessories (chapter II, the live camera cards)
  const pathHead = $("#pathways .sec-head");
  if (pathHead) {
    pathHead.innerHTML = '<span class="k"><b>02</b> — Keyboards &amp; Accessories</span><span class="rule"></span><span class="k jp">鍵</span>';
    pathHead.insertAdjacentHTML(
      "afterend",
      `<div class="cur-head" style="margin-bottom:28px">
        <h2 class="display h-sec" data-rv="up">Every Keystroke, Intentional.</h2>
        <p class="body-lg" data-rv="up">Precision, tactile feedback, and a workspace designed for uninterrupted creation.</p>
        <a class="arrowlink" ${go(SHOP_LINKS.keyboards)} data-rv="fade" data-cursor style="margin-top:18px"><span>Explore Keyboards</span><span class="ar">${ARROW}</span></a>
      </div>`,
    );
  }
  const cards = [
    { lab: "Keyboards", meta: "Every keystroke, intentional", to: SHOP_LINKS.keyboards },
    { lab: "Accessories", meta: "Designed around your flow", to: SHOP_LINKS.accessories },
    { lab: "Audio", meta: "Sound without distraction", to: SHOP_LINKS.audio },
  ];
  $$("#cards .card").forEach((card, i) => {
    const c = cards[i];
    if (!c) return;
    card.setAttribute("data-kage-to", c.to);
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `${c.lab} — ${c.meta}`);
    const lab = card.querySelector(".card-lab");
    if (lab) lab.innerHTML = `<b>${c.lab}</b>`;
    const meta = card.querySelector(".card-meta");
    if (meta) meta.innerHTML = `<span>${c.meta}</span><span>0${i + 1} / 03</span>`;
  });
  $("#cards")?.insertAdjacentHTML(
    "afterend",
    `<div class="cur-head" style="margin-top:36px">
      <h2 class="display h-sec" data-rv="up" style="font-size:clamp(28px,3.2vw,44px)">Designed Around Your Flow.</h2>
      <p class="body-lg" data-rv="up">From precision mice to minimal desk accessories, every element has a purpose. Wireless mice, laptop stands, USB hubs and desk accessories.</p>
      <a class="arrowlink" ${go(SHOP_LINKS.accessories)} data-rv="fade" data-cursor style="margin-top:18px"><span>Explore Accessories</span><span class="ar">${ARROW}</span></a>
    </div>`,
  );

  // Scene 5 — product collection (chapter III, the lesson rows become real products)
  html_("#lessons .sec-head", '<span class="k"><b>03</b> — The Collection</span><span class="rule"></span><span class="k jp">品</span>');
  text("#lessons .cur-head h2", "Your Setup. Refined.");
  const curP = $("#lessons .cur-head p");
  if (curP) {
    curP.textContent = "Discover the essentials that bring your workspace together.";
    curP.insertAdjacentHTML(
      "afterend",
      `<div style="display:flex;flex-wrap:wrap;gap:22px;align-items:center;margin-top:22px">
        <a class="cta" ${go(SHOP_LINKS.collection)} data-cursor><i></i><span>Shop Now</span>${ARROW}</a>
        <a class="arrowlink" ${go(SHOP_LINKS.collection)} data-cursor><span>View All Products</span><span class="ar">${ARROW}</span></a>
      </div>`,
    );
  }
  const cur = $("#cur");
  if (cur) {
    cur.innerHTML = products
      .slice(0, 5)
      .map((p, i) => {
        const to = `/shop?q=${encodeURIComponent(p.sku)}`;
        return `<div class="les" data-les="${i}" data-cursor data-kage-to="${esc(to)}" role="link" tabindex="0" aria-label="${esc(`${p.name}, ${inr(p.price)}, ${stockLabel(p.stock)}`)}">
          <span class="k">0${i + 1}</span>
          <h3><img src="${esc(p.image)}" alt="${esc(p.name)}" width="44" height="44" style="width:44px;height:44px;object-fit:cover;border-radius:6px;vertical-align:middle;margin-right:12px">${esc(p.name)}<em>${esc(inr(p.price))}</em></h3>
          <p>${esc(p.category)} · ${esc(p.sku)}</p>
          <span class="t">${esc(stockLabel(p.stock))}</span><i class="bar"></i>
        </div>`;
      })
      .join("");
  }

  // Scene 6 — closing brand statement (chapter IV)
  text("#eternity .eyebrow", "Kage Supply");
  text("#eternity h2", "Make Space for Better.");
  const finP = $("#eternity .body-lg");
  if (finP) finP.textContent = "Less distraction. Better tools. A more considered way to work.";
  const finCta = $("#eternity .cta");
  if (finCta)
    finCta.outerHTML = `<div style="display:flex;flex-wrap:wrap;gap:22px;align-items:center;justify-content:center">
      <a class="cta" ${go(SHOP_LINKS.collection)} data-rv="fade" data-cursor><i></i><span>Shop Kage Supply</span>${ARROW}</a>
      <a class="arrowlink" ${go(SHOP_LINKS.collection)} data-rv="fade" data-cursor><span>Explore the Collection</span><span class="ar">${ARROW}</span></a>
    </div>`;

  // Footer
  text(".foot-brand p", "Kage Supply — precision-engineered audio, keyboards and desk essentials. Prices in INR. Checkout is simulated; no payment is taken.");
  const cols = $$(".foot-grid > div:not(.foot-brand)");
  const footCols: [string, [string, string][]][] = [
    ["Shop", [["All products", SHOP_LINKS.collection], ["Audio", SHOP_LINKS.audio], ["Keyboards", SHOP_LINKS.keyboards], ["Accessories", SHOP_LINKS.accessories]]],
    ["Explore", [["Audio", "#gate"], ["Keyboards", "#pathways"], ["Collection", "#lessons"], ["Back to top", "#top"]]],
    ["Manage", [["Inventory", SHOP_LINKS.inventory], ["Cart", SHOP_LINKS.collection]]],
  ];
  cols.forEach((col, i) => {
    const c = footCols[i];
    if (!c) return;
    col.innerHTML = `<h4>${c[0]}</h4><ul>${c[1]
      .map(([label, to]) => `<li><a ${to.startsWith("#") ? `href="${to}"` : go(to)} data-cursor>${label}</a></li>`)
      .join("")}</ul>`;
  });
  html_(".foot-base", "<span>© 2026 Kage Supply</span><span class=\"jp\">影</span><span>Premium technology · INR</span>");

  // Section rail tooltips live in the page script; only that string array is rewritten.
  let out = "<!doctype html>\n" + doc.documentElement.outerHTML;
  out = out.replace(
    /const names = \[[^\]]*\];/,
    "const names = ['Kage Supply', 'Audio', 'Keyboards & Accessories', 'The Collection', 'Make Space for Better', 'Footer'];",
  );
  return out.replace("</body>", `${BRIDGE}</body>`);
}
