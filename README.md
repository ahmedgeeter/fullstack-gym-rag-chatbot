<img width="1901" height="871" alt="image" src="https://github.com/user-attachments/assets/4768e9a3-7da2-47f3-88a6-a5ed23238d35" />
<img width="1893" height="867" alt="Screenshot 2026-04-03 153753" src="https://github.com/user-attachments/assets/07d62cdf-7e76-47e2-9124-0b023f930010" />

# Coremont — Premium Fitness Storefront + RAG Assistant

Boutique e-commerce experience for premium gym equipment, backed by a fast RAG assistant with real product data and policy knowledge.

## Highlights
- Real product catalog with pricing, stock, and merchandising collections.
- RAG assistant with deterministic fallbacks for pricing, delivery, warranty, and recommendations.
- Local, curated product imagery mapped per SKU for a realistic storefront.
- Polished, premium UI (glass chat widget, smooth interactions, responsive layout).

## Problems Solved (Key Wins)
- **Image reliability**: swapped external placeholders for curated local assets with a Pexels-powered downloader.
- **Chat reliability**: added deterministic responses + safe fallbacks (no empty replies).
- **Data accuracy**: catalog snapshot injected for price/name questions.
- **Next.js 16 API fixes**: async params + error handling for collection routes.

## Tech Stack
Next.js 16 (App Router), TypeScript, Tailwind CSS, Prisma, PostgreSQL, local embeddings (Xenova), Groq for generation.

## Quick Start
```bash
npm install
npm run prisma:generate
```

Create `.env` (not committed):
- `DATABASE_URL`
- `GROQ_API_KEY`
- `PEXELS_API_KEY`

```bash
node scripts/download-product-images.mjs --force
npm run prisma:seed
npm run rag:index
npm run dev
```

## Scripts
- `npm run prisma:seed` — reset & seed catalog
- `npm run rag:index` — rebuild knowledge embeddings
- `node scripts/download-product-images.mjs --force` — refresh local product imagery

## Demo Prompts
- “Say equipment names and prices.”
- “What’s your delivery time and return policy?”
- “I need a compact treadmill for home, what do you recommend?”

## Notes
- Large outputs (`.next`, `node_modules`, `.env`) are excluded via `.gitignore`.
- Product/collection images are optimized and under 1MB each.
