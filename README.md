This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project structure: admin + website

The admin dashboard and the public website are two independent apps in one
Next.js project. Each has its own root layout, fonts and stylesheet:

| Part    | Root layout               | Stylesheet                  | Components            |
| ------- | ------------------------- | --------------------------- | --------------------- |
| Shared  | —                         | `styles/base.css`           | —                     |
| Admin   | `app/admin/layout.tsx`    | `styles/admin/theme.css`    | `components/admin/`   |
| Website | `app/(website)/layout.tsx`| `styles/website/theme.css`  | `components/website/` |

`styles/base.css` holds the Tailwind setup and shadcn neutral tokens and is never
edited per client. Each theme file imports it, lists its own `@source` folders and
fills the `--font-sans` / `--font-heading` slots.

### Reusing the admin for a new client

1. Delete `app/(website)/`, `components/website/` and `styles/website/theme.css`.
2. Build the new site in `app/(website)/` with its own `layout.tsx` (fonts,
   `<html data-website-theme>`), and a new `styles/website/theme.css` that imports
   `../base.css`.
3. Update `app/global-not-found.tsx` (the 404 for unknown URLs) if the new site's
   fonts differ.
4. Rebrand the admin: `lib/admin/config.ts`, colors in `styles/admin/theme.css`,
   and the logos in `public/brand/` (see `lib/brand.ts`).
