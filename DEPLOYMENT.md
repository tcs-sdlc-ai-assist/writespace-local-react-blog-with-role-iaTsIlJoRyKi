# Deployment Guide — WriteSpace Blog

## Platform: Vercel

This project is configured for deployment on [Vercel](https://vercel.com). It uses Vite as the build tool and outputs a static single-page application (SPA).

---

## Build Configuration

| Setting          | Value            |
|------------------|------------------|
| **Framework**    | Vite             |
| **Build Command**| `npm run build`  |
| **Output Directory** | `dist`       |
| **Install Command** | `npm install`  |

When connecting the repository to Vercel, these settings should be auto-detected. If not, configure them manually in the Vercel project dashboard under **Settings → General → Build & Development Settings**.

---

## SPA Rewrite Configuration

Since this is a single-page application with client-side routing, all routes must be rewritten to `index.html`. Create a `vercel.json` file in the project root with the following configuration:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures that navigating directly to any route (e.g., `/blog/my-post`, `/about`) serves the SPA entry point instead of returning a 404.

---

## Environment Variables

**No environment variables are required** for the current deployment. The application runs entirely on the client side with no external API dependencies.

If environment variables are added in the future, follow these guidelines:

- All client-side variables **must** be prefixed with `VITE_` (e.g., `VITE_API_URL`).
- Access them in code via `import.meta.env.VITE_API_URL` — never use `process.env`.
- Add variables in the Vercel dashboard under **Settings → Environment Variables**.
- Configure separate values for **Production**, **Preview**, and **Development** environments as needed.

---

## CI/CD — Auto-Deploy on Push

Vercel provides automatic deployments out of the box when connected to a Git repository:

### Production Deployments
- Every push to the **`main`** branch triggers a **production deployment**.
- The production URL is your custom domain or the default `*.vercel.app` domain.

### Preview Deployments
- Every push to **any other branch** or every **pull request** triggers a **preview deployment**.
- Each preview deployment gets a unique URL for testing and review.
- Preview URLs are automatically posted as comments on pull requests (GitHub integration).

### Deployment Workflow

1. **Develop** on a feature branch.
2. **Open a pull request** — Vercel creates a preview deployment automatically.
3. **Review** the preview deployment using the generated URL.
4. **Merge to `main`** — Vercel deploys to production automatically.

### Skipping Deployments

To skip a deployment for a specific commit, include `[skip ci]` or `[vercel skip]` in the commit message:

```
git commit -m "update README [skip ci]"
```

---

## Manual Deployment

If you need to deploy manually using the Vercel CLI:

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Deploy a preview build
vercel

# Deploy to production
vercel --prod
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on page refresh | Ensure `vercel.json` has the SPA rewrite rule configured above. |
| Build fails | Run `npm run build` locally to verify the build succeeds before pushing. |
| Blank page after deploy | Check the browser console for errors. Verify `base` in `vite.config.js` is set to `'/'` or removed (defaults to `'/'`). |
| Assets not loading | Ensure asset paths are relative or use the Vite `base` config correctly. |

---

## Related User Stories

- **SCRUM-18933** — Deployment pipeline setup
- **SCRUM-18934** — Vercel configuration and SPA routing
- **SCRUM-18935** — CI/CD auto-deploy workflow