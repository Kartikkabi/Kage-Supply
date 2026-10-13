<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Preserve the canonical Kage landing HTML and ThreeUI animation; adapt text and accessibility only through the srcDoc builder to keep the approved experience intact.
- Landing iframe shopping messages must be validated against the iframe window and routed with TanStack navigate so the visible page changes, not just the address.
- Use the shared Button component and semantic global color tokens for store and inventory controls to keep presentation consistent.
