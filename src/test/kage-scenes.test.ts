import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildKageSupplyDoc } from "@/lib/kage-scenes";

const html = readFileSync("public/landing-pages/kage.html", "utf8");
const products = [
  { id: "a", name: "Kage Over-Ear ANC", sku: "NV-AUD-001", category: "Audio", price: 24990, stock: 14, image: "/a.jpg" },
  { id: "b", name: "Lantern Mini Speaker", sku: "NV-AUD-004", category: "Audio", price: 5990, stock: 0, image: "/b.jpg" },
];
const doc = new DOMParser().parseFromString(buildKageSupplyDoc(html, products), "text/html");
const t = (s: string) => doc.querySelector(s)?.textContent?.replace(/\s+/g, " ").trim();

describe("Kage Supply scenes", () => {
  it("hero introduces Kage Supply", () => expect(t("#hero h1")).toBe("Enter a New State of Focus."));
  it("audio scene", () => expect(t("#gate h2")).toBe("Sound Without Distraction."));
  it("collection scene", () => expect(t("#lessons .cur-head h2")).toBe("Your Setup. Refined."));
  it("closing scene", () => expect(t("#eternity h2")).toBe("Make Space for Better."));
  it("collection rows show INR price and stock", () => {
    expect(t("#cur")).toContain("Kage Over-Ear ANC");
    expect(t("#cur")).toContain("Out of stock");
    expect(t("#cur")).toMatch(/₹\s?24,990/);
  });
  it("audio CTA goes to the Audio category", () =>
    expect(doc.querySelector("#gate .arrowlink")?.getAttribute("data-kage-to")).toBe("/shop?cat=Audio"));
  it("no temple copy remains in visible text", () => {
    doc.querySelectorAll("script,style").forEach((e) => e.remove());
    expect(doc.body.textContent).not.toMatch(/Kyoto|Sanmon|temple|shrine/i);
  });
  it("3D scene script is kept", () => expect(buildKageSupplyDoc(html, products)).toContain("buildLantern"));
});
