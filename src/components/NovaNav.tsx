import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NovaNav() {
  const cls = "nova-link";
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Kage Supply home"><span className="text-3xl text-primary" aria-hidden="true">影</span><span className="font-display text-base">KAGE<span className="text-primary">·</span>SUPPLY<span className="mt-1 hidden text-[9px] uppercase tracking-widest text-muted-foreground sm:block">Precision technology</span></span></Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1 text-sm sm:gap-4">
          <Button asChild variant="ghost" size="sm"><Link to="/" className={cls}>Experience<ArrowUpRight className="hidden sm:block" /></Link></Button>
          <Button asChild variant="ghost" size="sm"><Link to="/shop" className={cls} activeProps={{ className: "nova-link-active bg-secondary" }}>Store</Link></Button>
          <Button asChild variant="ghost" size="sm"><Link to="/inventory" className={cls} activeProps={{ className: "nova-link-active bg-secondary" }}>Inventory</Link></Button>
        </nav>
      </div>
    </header>
  );
}
