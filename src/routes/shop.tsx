import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NovaNav } from "@/components/NovaNav";
import { actions, cartTotal, CATEGORIES, inr, LOW_STOCK, useStore } from "@/lib/store";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [
    { title: "The Collection — Kage Supply" },
    { name: "description", content: "Shop considered audio, mechanical keyboards and wearables from Kage Supply. Prices in INR." },
    { property: "og:title", content: "The Collection — Kage Supply" },
    { property: "og:description", content: "Considered audio, keyboards and wearables for your everyday setup." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  validateSearch: (s: Record<string, unknown>): { cat?: string | undefined; q?: string | undefined } => ({
    cat: typeof s["cat"] === "string" ? s["cat"] : undefined,
    q: typeof s["q"] === "string" ? s["q"] : undefined,
  }),
  component: Shop,
});

function Shop() {
  const { products, cart } = useStore();
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const [cat, setCat] = useState(search.cat && CATEGORIES.includes(search.cat) ? search.cat : "All");
  const [sort, setSort] = useState("featured");
  const [done, setDone] = useState<number | null>(null);
  useEffect(() => {
    setQ(search.q ?? "");
    setCat(search.cat && CATEGORIES.includes(search.cat) ? search.cat : "All");
  }, [search.q, search.cat]);
  const list = products.filter(p => (cat === "All" || p.category === cat) && (p.name + p.sku).toLowerCase().includes(q.toLowerCase()));
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  const items = products.filter(p => cart[p.id]);
  const count = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const total = cartTotal(products, cart);

  return <div className="min-h-screen">
    <NovaNav />
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-9">
        <div><p className="nova-eyebrow">Kage Supply / The Collection</p><h1 className="font-display mt-4 text-4xl sm:text-5xl">Your setup. Refined.</h1><p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">Considered audio, tactile keyboards, and everyday essentials.</p></div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary" />{products.length.toString().padStart(2, "0")} essentials / INR</div>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">
        <section aria-label="Products" className="min-w-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-48 flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><input className="nova-input h-10 w-full pl-10 pr-10" placeholder="Search the collection" value={q} onChange={e => setQ(e.target.value)} aria-label="Search products" />{q && <Button variant="ghost" size="icon" className="absolute right-1 top-0.5 h-9 w-9" aria-label="Clear search" onClick={() => setQ("")}><X /></Button>}</div>
            <select aria-label="Sort products" className="nova-input h-10" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-1 border-b border-border pb-5" role="group" aria-label="Product category">
            {["All", ...CATEGORIES].map(c => <Button key={c} variant={cat === c ? "secondary" : "ghost"} size="sm" aria-pressed={cat === c} onClick={() => setCat(c)} className={cat === c ? "text-foreground" : "text-muted-foreground"}>{c === "All" ? "All essentials" : c}</Button>)}
            <span className="ml-auto text-xs text-muted-foreground" aria-live="polite">{list.length} products</span>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {list.map(p => {
              const inCart = cart[p.id] ?? 0;
              const out = p.stock === 0;
              return <article key={p.id} className="group nova-card overflow-hidden transition-colors hover:border-input">
                <div className="relative overflow-hidden"><img src={p.image} alt={p.name} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /><span className="absolute left-4 top-4 rounded bg-background/90 px-2 py-1 text-[10px] uppercase tracking-widest text-foreground">{p.category}</span>{inCart > 0 && <span className="absolute right-4 top-4 flex items-center gap-1 rounded bg-background/90 px-2 py-1 text-xs"><Check className="size-3" />{inCart} in bag</span>}</div>
                <div className="p-5"><p className="text-[10px] tracking-widest text-muted-foreground">{p.sku}</p><h2 className="mt-2 text-lg">{p.name}</h2><p className="font-display mt-3 text-xl">{inr(p.price)}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><StockBadge stock={p.stock} /><Button size="sm" variant={out ? "secondary" : "default"} disabled={out || inCart >= p.stock} onClick={() => { actions.addToCart(p.id); setDone(null); }}><Plus />{out ? "Sold out" : inCart >= p.stock ? "Max in cart" : "Add to cart"}</Button></div></div>
              </article>;
            })}
          </div>
          {list.length === 0 && <div className="py-20 text-center"><Search className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-4 text-xl">No essentials found</h2><p className="mt-2 text-sm text-muted-foreground">No matches for your current selection.</p><Button variant="outline" className="mt-5" onClick={() => { setQ(""); setCat("All"); }}>Clear filters</Button></div>}
        </section>
        <aside aria-label="Shopping cart" className="h-fit border-y border-border py-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between"><h2 className="font-display flex items-center gap-3 text-xl"><ShoppingBag className="size-5" />Your bag</h2><span className="text-xs text-muted-foreground">{count} {count === 1 ? "item" : "items"}</span></div>
          {done !== null && <div role="status" className="mt-5 border-l-2 border-primary bg-secondary p-4"><Check className="mb-2 size-5 text-primary" /><p className="text-sm">Order placed — {inr(done)}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Simulated checkout. No payment was taken.</p></div>}
          {items.length === 0 ? <div className="py-12 text-center"><ShoppingBag className="mx-auto size-8 text-muted-foreground" /><p className="mt-4 text-sm">Your cart is empty.</p></div> : <ul className="mt-6 divide-y divide-border">{items.map(p => <li key={p.id} className="flex gap-3 py-4 first:pt-0"><img src={p.image} alt="" width={56} height={56} className="h-14 w-14 rounded object-cover" /><div className="min-w-0 flex-1"><p className="text-sm leading-relaxed">{p.name}</p><p className="mt-1 text-xs text-muted-foreground">{inr(p.price)}</p><div className="mt-3 flex items-center gap-2"><Button variant="outline" size="icon" className="h-7 w-7" aria-label={`Decrease ${p.name}`} onClick={() => actions.setQty(p.id, (cart[p.id] ?? 0) - 1)}><Minus /></Button><span className="w-5 text-center text-xs">{cart[p.id]}</span><Button variant="outline" size="icon" className="h-7 w-7" aria-label={`Increase ${p.name}`} disabled={(cart[p.id] ?? 0) >= p.stock} onClick={() => actions.setQty(p.id, (cart[p.id] ?? 0) + 1)}><Plus /></Button><Button variant="ghost" size="icon" className="ml-auto h-7 w-7 text-muted-foreground" aria-label={`Remove ${p.name}`} onClick={() => actions.setQty(p.id, 0)}><X /></Button></div></div></li>)}</ul>}
          <div className="flex items-center justify-between border-t border-border pt-5"><span className="text-sm">Total</span><span className="font-display text-2xl">{inr(total)}</span></div>
          <Button className="mt-5 h-11 w-full justify-between" disabled={!items.length} onClick={() => { setDone(total); actions.checkout(); }}>Checkout<ArrowRight /></Button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">Simulated checkout · No payment taken</p>
        </aside>
      </div>
      <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t border-border pt-6 text-[11px] text-muted-foreground"><span>© 2026 Kage Supply</span><span>影 / Precision technology</span></footer>
    </main>
  </div>;
}

export function StockBadge({ stock }: { stock: number }) {
  return <span className={`inline-flex items-center gap-1.5 text-[11px] ${stock === 0 ? "text-destructive" : stock <= LOW_STOCK ? "text-warning" : "text-muted-foreground"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{stock === 0 ? "Out of stock" : stock <= LOW_STOCK ? `Only ${stock} left` : `${stock} in stock`}</span>;
}
