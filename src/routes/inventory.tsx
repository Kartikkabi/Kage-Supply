import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2, Check, X } from "lucide-react";
import { NovaNav } from "@/components/NovaNav";
import { StockBadge } from "./shop";
import { actions, CATEGORIES, IMAGES, inr, useStore, validateProduct, type Product } from "@/lib/store";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Kage Supply" },
      { name: "description", content: "Manage Kage Supply products, prices and stock levels." },
      { property: "og:title", content: "Inventory — Kage Supply" },
      { property: "og:description", content: "Manage Kage Supply products, prices and stock levels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Inventory,
});

const blank = (): Product => ({ id: "", name: "", sku: "", category: CATEGORIES[0] ?? "Audio", price: 0, stock: 0, image: IMAGES.headphones });

function Inventory() {
  const { products } = useStore();
  const [edit, setEdit] = useState<Product | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const save = () => {
    if (!edit) return;
    const e = validateProduct(edit, products);
    if (e) return setErr(e);
    actions.upsert({ ...edit, name: edit.name.trim(), sku: edit.sku.trim(), price: Number(edit.price), stock: Number(edit.stock), id: edit.id || crypto.randomUUID() });
    setEdit(null); setErr(null);
  };

  return (
    <div className="min-h-screen">
      <NovaNav />
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-8">
          <div><p className="nova-eyebrow">Kage Supply / Manage</p><h1 className="font-display mt-3 text-4xl sm:text-5xl">Inventory</h1></div>
          <Button onClick={() => { setEdit(blank()); setErr(null); }}><Plus />New product</Button>
        </div>

        {edit && (
          <div className="mt-8 grid gap-4 border-y border-border bg-secondary/30 py-6 sm:grid-cols-3">
            <Field label="Name"><input className="nova-input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="SKU"><input className="nova-input" value={edit.sku} onChange={(e) => setEdit({ ...edit, sku: e.target.value })} /></Field>
            <Field label="Category"><select className="nova-input" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Price (₹)"><input type="number" className="nova-input" value={edit.price} onChange={(e) => setEdit({ ...edit, price: e.target.value as unknown as number })} /></Field>
            <Field label="Stock"><input type="number" className="nova-input" value={edit.stock} onChange={(e) => setEdit({ ...edit, stock: e.target.value as unknown as number })} /></Field>
            <Field label="Image"><select className="nova-input" value={edit.image} onChange={(e) => setEdit({ ...edit, image: e.target.value })}>{Object.entries(IMAGES).map(([k, v]) => <option key={k} value={v}>{k}</option>)}</select></Field>
            {err && <p className="text-sm text-destructive sm:col-span-3" role="alert">{err}</p>}
            <div className="flex gap-3 sm:col-span-3">
              <Button onClick={save}><Check />Save</Button>
              <Button variant="outline" onClick={() => { setEdit(null); setErr(null); }}><X />Cancel</Button>
            </div>
          </div>
        )}

        <div className="mt-8 overflow-x-auto border-y border-border">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground"><tr>{["Product", "SKU", "Category", "Price", "Stock", ""].map((h) => <th key={h} className="p-4 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="min-w-60 p-4"><div className="flex items-center gap-3"><img src={p.image} alt="" width={40} height={40} className="h-10 w-10 rounded object-cover" />{p.name}</div></td>
                  <td className="p-4 text-muted-foreground">{p.sku}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">{inr(p.price)}</td>
                  <td className="p-4"><StockBadge stock={p.stock} /></td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" title={`Edit ${p.name}`} aria-label={`Edit ${p.name}`} onClick={() => { setEdit(p); setErr(null); }}><Pencil /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" title={`Delete ${p.name}`} aria-label={`Delete ${p.name}`} onClick={() => { if (confirm(`Delete "${p.name}"? This cannot be undone.`)) actions.remove(p.id); }}><Trash2 /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1 text-xs text-muted-foreground">{label}{children}</label>;
}
