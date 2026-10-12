import { useSyncExternalStore } from "react";
import headphones from "@/assets/p-headphones.jpg";
import keyboard from "@/assets/p-keyboard.jpg";
import watch from "@/assets/p-watch.jpg";
import speaker from "@/assets/p-speaker.jpg";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number; // INR
  stock: number;
  image: string;
};

export const LOW_STOCK = 5;
export const IMAGES = { headphones, keyboard, watch, speaker };
export const CATEGORIES = ["Audio", "Peripherals", "Wearables"];

const SEED: Product[] = [
  { id: "p1", name: "Kage Over-Ear ANC", sku: "NV-AUD-001", category: "Audio", price: 24990, stock: 14, image: headphones },
  { id: "p2", name: "Shadow 60 Mechanical", sku: "NV-PER-002", category: "Peripherals", price: 11490, stock: 4, image: keyboard },
  { id: "p3", name: "Moonwater Watch", sku: "NV-WEA-003", category: "Wearables", price: 18990, stock: 9, image: watch },
  { id: "p4", name: "Lantern Mini Speaker", sku: "NV-AUD-004", category: "Audio", price: 5990, stock: 0, image: speaker },
];

type State = { products: Product[]; cart: Record<string, number> };
const KEY = "nova-supply-v1";
let state: State = { products: SEED, cart: {} };
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw);
  } catch {}
}
function set(next: State) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  subs.forEach((f) => f());
}
const SERVER: State = { products: SEED, cart: {} };

export function useStore() {
  return useSyncExternalStore(
    (f) => { load(); subs.add(f); f(); return () => subs.delete(f); },
    () => { load(); return state; },
    () => SERVER,
  );
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function validateProduct(p: Partial<Product>, all: Product[]): string | null {
  if (!p.name?.trim()) return "Name is required";
  if (!p.sku?.trim()) return "SKU is required";
  if (all.some((x) => x.sku.toLowerCase() === p.sku!.trim().toLowerCase() && x.id !== p.id)) return "SKU must be unique";
  if (!(Number(p.price) > 0)) return "Price must be greater than 0";
  if (!Number.isInteger(Number(p.stock)) || Number(p.stock) < 0) return "Stock must be a whole number ≥ 0";
  return null;
}

export const actions = {
  addToCart(id: string) {
    const p = state.products.find((x) => x.id === id);
    const q = state.cart[id] ?? 0;
    if (!p || q >= p.stock) return;
    set({ ...state, cart: { ...state.cart, [id]: q + 1 } });
  },
  setQty(id: string, q: number) {
    const p = state.products.find((x) => x.id === id);
    const cart = { ...state.cart };
    const clamped = Math.min(Math.max(0, q), p?.stock ?? 0);
    if (clamped <= 0) delete cart[id]; else cart[id] = clamped;
    set({ ...state, cart });
  },
  checkout() {
    const products = state.products.map((p) => ({ ...p, stock: p.stock - (state.cart[p.id] ?? 0) }));
    set({ products, cart: {} });
  },
  upsert(p: Product) {
    const exists = state.products.some((x) => x.id === p.id);
    const products = exists ? state.products.map((x) => (x.id === p.id ? p : x)) : [...state.products, p];
    const cart = { ...state.cart };
    if ((cart[p.id] ?? 0) > p.stock) cart[p.id] = p.stock;
    if (cart[p.id] === 0) delete cart[p.id];
    set({ products, cart });
  },
  remove(id: string) {
    const cart = { ...state.cart }; delete cart[id];
    set({ products: state.products.filter((x) => x.id !== id), cart });
  },
};

export function cartTotal(products: Product[], cart: Record<string, number>) {
  return products.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0);
}
