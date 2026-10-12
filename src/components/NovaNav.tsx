import { Link } from "@tanstack/react-router";

export function NovaNav() {
  const cls = "nova-link";
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-lg tracking-[0.3em]">KAGE<span className="text-primary">·</span>SUPPLY</Link>
        <nav className="flex gap-6 text-sm">
          <Link to="/" className={cls}>Temple</Link>
          <Link to="/shop" className={cls} activeProps={{ className: "nova-link-active" }}>Store</Link>
          <Link to="/inventory" className={cls} activeProps={{ className: "nova-link-active" }}>Inventory</Link>
        </nav>
      </div>
    </header>
  );
}
