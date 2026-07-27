# GitHub publishing

The project is configured for the public repository `markofornoliak/nexus-code-v4` and
a default branch named `main`.

## Automated first publish with GitHub CLI

From the project root:

```bash
gh auth login
gh repo create markofornoliak/nexus-code-v4 --public --source=. --remote=origin --push
```

If the repository already exists:

```bash
git remote add origin https://github.com/markofornoliak/nexus-code-v4.git
git push -u origin main
```

If `origin` exists but points elsewhere, inspect it before changing anything:

```bash
git remote -v
git remote set-url origin https://github.com/markofornoliak/nexus-code-v4.git
git push -u origin main
```

Never commit a personal access token or place it in a tracked remote URL. Prefer the
GitHub CLI credential store, the operating-system credential manager, or SSH.

## Enable Pages

1. Open **Settings → Pages** in the repository.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Push `main` or start **Deploy NEXUS to GitHub Pages** manually under **Actions**.
4. Wait for the `build` and `deploy` jobs to finish.

The workflow computes `VITE_BASE_PATH` from the repository name, so no hard-coded owner
or repository setting is required.

## Manual build and deployment

To verify the exact repository-subpath build locally:

```bash
VITE_BASE_PATH=/nexus-code-v4/ npm run build
npm run preview
```

For a non-GitHub static host at the domain root:

```bash
VITE_BASE_PATH=/ npm run build
```

Publish the complete `dist/` directory. Keep `.nojekyll`; do not rewrite the hash-based
application routes on the server.

## Branch protection recommendation

After the first successful CI run, protect `main` and require:

- the `NEXUS quality gate / verify` status check;
- one approving review for external contributions;
- resolved review conversations;
- no force pushes or branch deletion.
