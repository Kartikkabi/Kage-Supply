import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NovaNav } from "@/components/NovaNav";
import { actions, cartTotal, CATEGORIES, inr, LOW_STOCK, useStore } from "@/lib/store";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Store — NOVA Supply" },
      { name: "description", content: "Shop premium audio, peripherals and wearables at NOVA Supply. Prices in INR." },
      { property: "og:title", content: "Store — NOVA Supply" },
      { property: "og:description", content: "Shop premium audio, peripherals and wearables at NOVA Supply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { products, cart } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [done, setDone] = useState<number | null>(null);
  const list = products.filter(
    (p) => (cat === "All" || p.category === cat) &&
      (p.name + p.sku).toLowerCase().includes(q.toLowerCase()),
  );
  const items = products.filter((p) => cart[p.id]);
  const total = cartTotal(products, cart);

  return (
    <div className="min-h-screen">
      <NovaNav />
      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_320px]">
        <section>
          <p className="nova-eyebrow">The Collection</p>
          <h1 className="font-display mt-3 text-5xl">Tools for quiet focus.</h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <input className="nova-input flex-1 min-w-48" placeholder="Search name or SKU" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
            {["All", ...CATEGORIES].map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cat === c ? "nova-chip nova-chip-on" : "nova-chip"}>{c}</button>
            ))}
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {list.map((p) => {
              const inCart = cart[p.id] ?? 0;
              const out = p.stock === 0;
              return (
                <article key={p.id} className="nova-card overflow-hidden">
                  <img src={p.image} alt={p.name} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg">{p.name}</h2>
                        <p className="text-xs text-muted-foreground">{p.sku} · {p.category}</p>
                      </div>
                      <p className="font-display text-lg">{inr(p.price)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <StockBadge stock={p.stock} />
                      <button disabled={out || inCart >= p.stock} onClick={() => actions.addToCart(p.id)} className="nova-cta-sm">
                        {out ? "Sold out" : inCart >= p.stock ? "Max in cart" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
            {list.length === 0 && <p className="text-muted-foreground">No products match.</p>}
          </div>
        </section>
        <aside className="nova-card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Cart</h2>
          {done !== null && <p className="mt-3 text-sm text-primary">Order placed — {inr(done)} (simulated, no payment taken).</p>}
          {items.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p> : (
            <ul className="mt-4 space-y-4">
              {items.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
                  <div><p>{p.name}</p><p className="text-muted-foreground">{inr(p.price)}</p></div>
                  <div className="flex items-center gap-2">
                    <button className="nova-qty" aria-label="Decrease" onClick={() => actions.setQty(p.id, cart[p.id] - 1)}>−</button>
                    <span className="w-5 text-center">{cart[p.id]}</span>
                    <button className="nova-qty" aria-label="Increase" disabled={cart[p.id] >= p.stock} onClick={() => actions.setQty(p.id, cart[p.id] + 1)}>+</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex justify-between border-t border-border pt-4"><span>Total</span><span className="font-display text-xl">{inr(total)}</span></div>
          <button className="nova-cta mt-5 w-full" disabled={!items.length} onClick={() => { setDone(total); actions.checkout(); }}>Checkout</button>
        </aside>
      </main>
    </div>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="nova-badge nova-badge-out">Out of stock</span>;
  if (stock <= LOW_STOCK) return <span className="nova-badge nova-badge-low">Only {stock} left</span>;
  return <span className="nova-badge">{stock} in stock</span>;
}
