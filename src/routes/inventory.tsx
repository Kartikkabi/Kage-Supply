import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NovaNav } from "@/components/NovaNav";
import { StockBadge } from "./shop";
import { actions, CATEGORIES, IMAGES, inr, useStore, validateProduct, type Product } from "@/lib/store";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — NOVA Supply" },
      { name: "description", content: "Manage NOVA Supply products, prices and stock levels." },
      { property: "og:title", content: "Inventory — NOVA Supply" },
      { property: "og:description", content: "Manage NOVA Supply products, prices and stock levels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Inventory,
});

const blank = (): Product => ({ id: "", name: "", sku: "", category: CATEGORIES[0]!, price: 0, stock: 0, image: IMAGES.headphones });

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
      <main className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between">
          <div><p className="nova-eyebrow">Admin</p><h1 className="font-display mt-3 text-5xl">Inventory</h1></div>
          <button className="nova-cta" onClick={() => { setEdit(blank()); setErr(null); }}>New product</button>
        </div>

        {edit && (
          <div className="nova-card mt-8 grid gap-4 p-6 sm:grid-cols-3">
            <Field label="Name"><input className="nova-input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="SKU"><input className="nova-input" value={edit.sku} onChange={(e) => setEdit({ ...edit, sku: e.target.value })} /></Field>
            <Field label="Category"><select className="nova-input" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Price (₹)"><input type="number" className="nova-input" value={edit.price} onChange={(e) => setEdit({ ...edit, price: e.target.value as unknown as number })} /></Field>
            <Field label="Stock"><input type="number" className="nova-input" value={edit.stock} onChange={(e) => setEdit({ ...edit, stock: e.target.value as unknown as number })} /></Field>
            <Field label="Image"><select className="nova-input" value={edit.image} onChange={(e) => setEdit({ ...edit, image: e.target.value })}>{Object.entries(IMAGES).map(([k, v]) => <option key={k} value={v}>{k}</option>)}</select></Field>
            {err && <p className="text-sm text-destructive sm:col-span-3" role="alert">{err}</p>}
            <div className="flex gap-3 sm:col-span-3">
              <button className="nova-cta" onClick={save}>Save</button>
              <button className="nova-ghost" onClick={() => { setEdit(null); setErr(null); }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="nova-card mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground"><tr>{["Product", "SKU", "Category", "Price", "Stock", ""].map((h) => <th key={h} className="p-4 font-normal">{h}</th>)}</tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4 text-muted-foreground">{p.sku}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">{inr(p.price)}</td>
                  <td className="p-4"><StockBadge stock={p.stock} /></td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button className="nova-link mr-4" onClick={() => { setEdit(p); setErr(null); }}>Edit</button>
                    <button className="nova-link text-destructive" onClick={() => { if (confirm(`Delete "${p.name}"? This cannot be undone.`)) actions.remove(p.id); }}>Delete</button>
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
