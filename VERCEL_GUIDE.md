# Deploying Technidy to Vercel

Vercel is the best place to deploy Next.js apps, but there is one critical change needed: **Vercel does not support SQLite** (the file-based database we are currently using) because Vercel is serverless and files are not persistent.

You must switch to a cloud database like **Vercel Postgres** (easiest), Neon, or Supabase.

## Step 1: Create a Vercel Project

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import from GitHub and select your repository: `technidy`.
4.  **DO NOT click Deploy yet.**

## Step 2: Set Up Vercel Postgres (Database)

1.  In your Vercel project dashboard, go to the **Storage** tab.
2.  Click **"Connect Store"** -> **"Create New"** -> **"Postgres"**.
3.  Accept the terms and create the database.
4.  Select region (e.g., `Washington, D.C. - iad1` or `London - lhr1`).
5.  Once created, click **"Connect Project"** and select your `technidy` project.
6.  This will automatically add environment variables (`POSTGRES_URL`, etc.) to your project.

## Step 3: Update Codebase for Postgres

You need to update your project to use Postgres instead of SQLite.

1.  **Open `prisma/schema.prisma`** and change the provider:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql" // Change from "sqlite"
  url      = env("POSTGRES_PRISMA_URL") // Uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // Uses direct connection
}
```

2.  **Commit and Push** this change to GitHub.

## Step 4: Configure Environment Variables

Go to your Vercel Project -> **Settings** -> **Environment Variables**.
The database variables should already be there (from Step 2). You need to add these:

1.  `NEXTAUTH_URL` = `https://your-vercel-domain.vercel.app` (You can get this after first deploy, or set to your custom domain)
2.  `NEXTAUTH_SECRET` = (Generate a random string, e.g., using `openssl rand -base64 32`)

## Step 5: Deploy

1.  Since you pushed the change to `prisma/schema.prisma` in Step 3, Vercel might have already triggered a deployment.
2.  If not, go to **Deployments** and click **Redeploy**.
3.  Vercel will automatically run `npm install`, `npx prisma generate`, and `npm run build`.

## Step 6: Initialize the Database

After strict deployment, the database is empty. You need to push your schema to it.

1.  **Install Vercel CLI locally** (optional but recommended for debugging):
    ```bash
    npm i -g vercel
    ```
2.  **Pull Environment Variables locally:**
    ```bash
    vercel env pull .env.development.local
    ```
3.  **Run Migration:**
    ```bash
    npx prisma db push
    ```
    (This will push the schema to the Vercel Postgres database using the credentials you just downloaded).

## Troubleshooting

### "Error: P1003: The database provider... is not valid"
*   **Cause**: Your `schema.prisma` still says `"sqlite"`.
*   **Fix**: Update it to `"postgresql"` and push to GitHub.

### "PrismaClientInitializationError"
*   **Cause**: Incorrect database URL.
*   **Fix**: Ensure `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` are set in Vercel Environment Variables.

---
**Note:** Once you switch to Postgres in `schema.prisma`, your local `npm run dev` will break unless you also have a local Postgres running or use the Vercel Postgres credentials locally (via `vercel env pull`).
