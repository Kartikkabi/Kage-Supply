import { createFileRoute, Link } from "@tanstack/react-router";
import { KageLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "NOVA Supply — Enter the Temple" },
      { name: "description", content: "An immersive Kage temple journey into NOVA Supply's premium technology store." },
      { property: "og:title", content: "NOVA Supply — Enter the Temple" },
      { property: "og:description", content: "An immersive Kage temple journey into NOVA Supply's premium technology store." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="fixed inset-0 bg-background">
      <div className="shader-frame h-full w-full">
        <KageLandingPage
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
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center gap-3 px-4">
        <Link to="/shop" className="nova-cta pointer-events-auto">Enter NOVA Supply →</Link>
        <Link to="/inventory" className="nova-ghost pointer-events-auto">Inventory</Link>
      </div>
    </div>
  );
}
