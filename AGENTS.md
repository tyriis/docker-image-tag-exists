# AGENTS.md — docker-image-tag-exists

## What this is

A GitHub Action that checks whether a container image tag exists in a remote registry. Single-package, ESM-only Node.js project.

## Key commands

| Command               | What it does                                       |
| --------------------- | -------------------------------------------------- |
| `pnpm test`           | Run Jest integration tests (calls real registries) |
| `pnpm lint`           | ESLint on `src/**/*.mjs`                           |
| `pnpm build`          | `ncc build --license LICENSE` → outputs to `dist/` |
| `task pre-commit:run` | Run all pre-commit hooks on all files              |
| `task node:ncu`       | Interactive npm dependency updates                 |

`pnpm test` requires `--experimental-vm-modules` (already in scripts). Tests are **integration tests** against live registries (docker.io, ghcr.io, public.ecr.aws) — they need network access.

## Architecture

- `src/index.mjs` — action entrypoint, reads `@actions/core` inputs, calls `findTag()`
- `src/find-tag.mjs` — core logic: tries `docker manifest inspect` first, falls back to axios HTTP if token provided
- `action.yml` — declares the action (inputs: registry, repository, tag, token; output: tag)
- `dist/index.mjs` — bundled output committed to repo (standard for GH Actions)
- `__tests__/find-tag.test.mjs` — Jest integration tests

## Development quirks

- **`pnpm/action-setup` must precede `actions/setup-node`** in workflows (setup-node's `cache: pnpm` needs pnpm on PATH)
- **CI uses `pnpm install --frozen-lockfile --ignore-scripts`** — pnpm 11.x blocks build scripts by default (`unrs-resolver`)
- **`dist/` is committed** — rebuild with `pnpm build` before release commits
- **`doctoc` pre-commit hook** auto-updates README TOC; if it fails, stage the modified README and retry
- **`.prettierrc.js`** may be reformatted by the prettier pre-commit hook — stage it together with your changes
- **ESLint** enforces `comma-dangle: always-multiline` and `semi: never`

## Release flow

1. Create branch: `release/X.Y.Z`
2. Run `pnpm install` (updates lockfile if needed)
3. Run `pnpm build` (rebuilds `dist/`)
4. Update version in:
   - `package.json` (`"version": "X.Y.Z"`)
   - `README.md` (`@vX.Y.Z` in usage block)
   - `.github/workflows/test-action.yaml` (`# vX.Y.Z` comment)
5. Commit `release: X.Y.Z`
6. Tag: `git tag vX.Y.Z`
7. Push branch + tag, create PR with **regular merge** (no squash)
8. After merge, create GitHub Release from tag

## CI workflows

| Workflow              | Trigger                          | Purpose                                  |
| --------------------- | -------------------------------- | ---------------------------------------- |
| `Test - Suite`        | PR + push to main                | Runs `pnpm test`                         |
| `Test - Action`       | `workflow_dispatch`              | Manual test of the published action      |
| `Schedule - Renovate` | cron `17 * * * *` + push to main | Auto-dependency updates via Renovate bot |
