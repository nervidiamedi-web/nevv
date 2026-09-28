# Cetaphil Skincare & Routine Regimen Platform

A modern, responsive e-commerce and clinical skincare tips hub inspired by Cetaphil. Formulated with dermatologist-recommended regimens, interactive 5 Signs of Skin Sensitivity explorer, routine builder, clinical advice hub, and real-time cart/checkout.

---

## 🚀 How to Deploy to GitHub

Your Git repository is already initialized and prepared locally. Follow these simple steps to push it to your GitHub account:

### Step 1: Create a New GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `cetaphil-skincare`).
3. Set the visibility to **Public** or **Private** as you prefer.
4. **Important**: Leave "Initialize this repository with a README" **unchecked** (we already have a complete codebase ready to push).
5. Click **Create repository**.

### Step 2: Push to GitHub
In your terminal, run the following commands (replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPO_NAME>` with your GitHub handle and repo name):

```bash
# Add your GitHub repository as remote origin
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git

# Ensure the main branch is selected
git branch -M main

# Push your code to GitHub
git push -u origin main
```

*(If you are prompted for credentials, use a [GitHub Personal Access Token (Classic or Fine-grained)](https://github.com/settings/tokens) with `repo` scope as your password, or configure SSH keys).*

---

## 🌐 Deployment Options from GitHub

Once pushed to GitHub, you can deploy your application live using any of the following platforms:

### Option A: Free Static Hosting via GitHub Pages (Pre-Configured)
The repository includes an automated GitHub Actions workflow (`.github/workflows/deploy-pages.yml`):
1. On GitHub, navigate to your repository's **Settings** tab.
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push any commit or trigger the workflow manually under **Actions** > **Deploy to GitHub Pages** > **Run workflow**.
5. Your site will be published at `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>/`.

---

### Option B: Full-Stack Web Service (Render / Railway / Cloud Run)
Because the project contains a full Express backend with persistent storage (`db.json`) and AI endpoints:

#### Deploy to Render (Recommended & Free):
1. Sign up or log in at [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Render will auto-detect the configuration (or use these settings):
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. *(Optional)* Add Environment Variable:
   - `GEMINI_API_KEY`: *(Optional for AI copywriting tools)*
6. Click **Deploy Web Service**.

#### Deploy to Railway:
1. Log in at [Railway.app](https://railway.app).
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select your repository. Railway automatically builds with `npm run build` and starts with `npm start`.

---

## 💻 Local Development

### Prerequisites
- Node.js 20+ installed
- npm or bun

### Setup
```bash
# Clone the repository
git clone https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
cd <YOUR_REPO_NAME>

# Install dependencies
npm install

# Start local development server (with full Express backend + Vite frontend)
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Available Scripts
- `npm run dev` - Starts the development server with live reload.
- `npm run build` - Builds production frontend assets with Vite and bundles the Node server with esbuild.
- `npm run start` - Runs the bundled production server (`dist/server.cjs`).
- `npm run lint` - Runs TypeScript type checking.

---

## 📂 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy-pages.yml  # Automated GitHub Actions deployment
├── src/
│   ├── components/           # UI and feature components
│   │   ├── SkincareTipsPage.tsx  # Cetaphil Skincare Tips & Regimen Hub
│   │   ├── ProductCatalog.tsx    # Product catalog with filters & 5 Signs
│   │   ├── ProductDetail.tsx     # Rich product detail modal
│   │   ├── CartDrawer.tsx        # Slide-out cart & checkout flow
│   │   ├── CMSAdmin.tsx          # Admin portal for product & tip management
│   │   └── ...
│   ├── types.ts              # TypeScript schemas
│   ├── App.tsx               # Main layout & state
│   ├── main.tsx              # React entry point
│   └── index.css             # Tailwind CSS styles & typography
├── server.ts                 # Full-stack Express server with API routes
├── db.json                   # Product catalog, articles & order data
├── render.yaml               # Ready-to-go Render deployment config
└── vite.config.ts            # Vite & Tailwind build configuration
```
