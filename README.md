# SHOP.CO — E-commerce Website

A full-stack clone of the "E-commerce Website Template (Freebie)" Figma design, built with:

- **Frontend:** React 18 + Vite + React Router + Tailwind CSS
- **Backend:** Express.js REST API
- **Data storage:** JSON files on disk (no database) — `server/data/*.json`
- **Auth:** Full session-based auth with JWT stored in an httpOnly cookie + bcrypt password hashing

Pages: Home, Shop (category listing with filters/sort/pagination), Product Detail, Cart,
Checkout, Login, Register, Order Confirmation, Account (order history). Fully responsive
from mobile through desktop.

---

## 1. Run it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
# 1. Backend
cd server
npm install
cp .env.example .env      # edit JWT_SECRET if you like
npm run dev                # http://localhost:5000

# 2. Frontend (in a second terminal)
cd client
npm install
npm run dev                # http://localhost:5173
```

Open **http://localhost:5173** — the Vite dev server proxies `/api` requests to the
Express server on port 5000 (see `client/vite.config.js`), and the Express server sends
credentials-friendly CORS headers back to it (see `server/server.js`).

Try the promo codes `SHOPCO20` or `WELCOME10` in the cart.

### Data files

`server/data/products.json`, `users.json`, `carts.json`, and `orders.json` are the entire
database. They're created empty (except products) and Express reads/writes them directly —
delete their contents any time to reset the store back to a clean slate.

---

## 2. Push the code to GitHub

From the project root (the folder containing this README):

```bash
git init
git add .
git commit -m "Initial commit: SHOP.CO e-commerce site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Create the empty repo on GitHub first (github.com → New repository), then run the commands
above. `.gitignore` already excludes `node_modules/`, `dist/`, and `.env`.

---

## 3. Deploy it live

The simplest free path is **Render** for the API and **Vercel** for the frontend (two
separate services, one repo). Render.com and Vercel.com both let you sign in with GitHub
and deploy straight from the repo you just pushed.

### Backend → Render
1. render.com → New → Web Service → connect your GitHub repo.
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `JWT_SECRET` (any long random string), `CLIENT_ORIGIN`
   (fill this in after step 4, once you have the Vercel URL), `NODE_ENV=production`.
6. Deploy → copy the resulting URL, e.g. `https://shopco-api.onrender.com`.

### Frontend → Vercel
1. vercel.com → New Project → import the same repo.
2. Root directory: `client`
3. Build command: `npm run build`  Output directory: `dist`
4. Add a rewrite so `/api/*` calls reach Render instead of Vercel — create
   `client/vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/api/:path*", "destination": "https://shopco-api.onrender.com/api/:path*" }]
   }
   ```
5. Deploy → copy the resulting URL, e.g. `https://shopco.vercel.app`.
6. Go back to Render → set `CLIENT_ORIGIN=https://shopco.vercel.app` → redeploy the backend
   so CORS + cookies are allowed from your live frontend.

### Alternative: one service
If you'd rather run everything from a single URL, Express already serves the built React
app in production (see the bottom of `server/server.js`). On Render, set the build command
to `npm install && cd ../client && npm install && npm run build`, keep the start command as
`npm start` from `server/`, and skip Vercel entirely — one Render URL serves both.

---

## Project structure

```
shopco/
├── server/                 Express API
│   ├── data/                JSON "database": products, users, carts, orders
│   ├── middleware/auth.js   JWT cookie auth
│   ├── routes/               auth, products, cart, orders
│   └── server.js
└── client/                 React app (Vite)
    └── src/
        ├── api/client.js    axios instance
        ├── context/          Auth + Cart React context
        ├── components/       Header, Footer, ProductCard, filters, etc.
        └── pages/             Home, Shop, ProductDetail, Cart, Checkout, Login, Register,
                                 OrderConfirmation, Account
```

## API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account, sets session cookie |
| POST | `/api/auth/login` | – | Sign in |
| POST | `/api/auth/logout` | – | Clear session |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/products` | – | List products (filters: category, dressStyle, color, size, minPrice, maxPrice, search, sort, isNew, onSale, page, limit) |
| GET | `/api/products/categories` | – | Distinct categories & dress styles |
| GET | `/api/products/:id` | – | Product detail + related products |
| GET | `/api/cart` | ✓ | Current user's cart |
| POST | `/api/cart` | ✓ | Add item |
| PATCH | `/api/cart/:itemId` | ✓ | Update quantity |
| DELETE | `/api/cart/:itemId` | ✓ | Remove item |
| DELETE | `/api/cart` | ✓ | Clear cart |
| POST | `/api/cart/merge` | ✓ | Merge guest (localStorage) cart on login |
| POST | `/api/orders` | ✓ | Place order from cart |
| GET | `/api/orders` | ✓ | Order history |
| GET | `/api/orders/:id` | ✓ | Order detail |
| POST | `/api/orders/apply-coupon` | ✓ | Validate a promo code |

## Notes on the Figma match

Built to match the screenshots shared in chat (SHOP.CO template): black/white minimalist
palette, bold uppercase display type, pill-shaped buttons and inputs, star ratings, discount
badges, the announcement bar, and the filter sidebar (category / price / color / size /
dress style) on the shop page. Product photography uses placeholder images
(`picsum.photos`) since the real template assets aren't accessible from Figma's API —
swap the `images` arrays in `server/data/products.json` for real photos whenever you have
them.
