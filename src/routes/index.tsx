import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KageLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import { useStore } from "@/lib/store";
import { buildKageSupplyDoc } from "@/lib/kage-scenes";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Kage Supply — Enter a New State of Focus" },
      { name: "description", content: "Precision-engineered headphones, keyboards and desk essentials from Kage Supply. Prices in INR." },
      { property: "og:title", content: "Kage Supply — Enter a New State of Focus" },
      { property: "og:description", content: "Precision-engineered headphones, keyboards and desk essentials from Kage Supply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { products } = useStore();
  const router = useRouter();
  const [doc, setDoc] = useState<string | null>(null);

  // Build once per visit so store updates don't reload the 3D scene mid-scroll.
  useEffect(() => {
    let alive = true;
    fetch("/landing-pages/kage.html")
      .then((r) => r.text())
      .then((html) => alive && setDoc(buildKageSupplyDoc(html, products)))
      .catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const to = (e.data as { kageTo?: unknown } | null)?.kageTo;
      if (typeof to === "string" && to.startsWith("/") && !to.startsWith("//")) router.history.push(to);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-background">
      {doc && (
        <div className="shader-frame h-full w-full">
          <KageLandingPage
            srcDoc={doc}
            headingFont="onest"
            bodyFont="onest"
            headingWeight="400"
            bodyWeight="300"
            primaryColor="#e0231c"
            headingSize={46}
            bodySize={17}
            headingLetterSpacing={-0.012}
          />
        </div>
      )}
    </div>
  );
}
