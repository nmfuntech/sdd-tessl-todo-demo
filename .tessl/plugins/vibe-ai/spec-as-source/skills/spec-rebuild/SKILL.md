---
name: spec-rebuild
description: When you need to verify that specs are the true source of truth — delete all generated code and rebuild it from specs, then verify
---

# Spec Rebuild

This skill proves that the specs are the real source of truth: delete all generated code, rebuild from specs, then verify everything still passes.

## Step 1 — Safety checks

Before deleting anything:

1. Check for uncommitted changes: `git diff --stat && git diff --cached --stat`
2. If there are uncommitted changes, stop and tell the user: "Commit or stash your changes before rebuilding."
3. Check that `specs/` contains at least one `.spec.md`: `ls specs/*.spec.md`
4. If no specs exist, stop: "No specs found. Nothing to rebuild from."

## Step 2 — Show what will be deleted

Read all `.spec.md` files in `specs/`. Extract all `targets` from frontmatter. List the target files and their owning specs:

```
Files to delete (owned by specs):
  src/auth/rate_limiter.py  ← specs/login-rate-limiting.spec.md
  src/main.py               ← specs/login-rate-limiting.spec.md
  tests/auth/               ← specs/login-rate-limiting.spec.md
```

Ask for confirmation before proceeding: "Delete these files and rebuild from specs? (yes/no)"

## Step 3 — Delete generated files

Delete only the files and directories declared as `targets` in specs. Do not delete specs, scripts, config files, or plugin directories.

## Step 4 — Rebuild from specs

For each spec in `specs/`, rebuild its targets and tests:

```
Use spec-driven development.
Rebuild all missing targets and tests from <spec file>.
Use only the approved spec as source.
Do not add requirements not present in the spec.
Do not infer extra behaviour.
Add GENERATED FROM SPEC headers in target files.
Add @spec and @req comments in test files.
```

## Step 5 — Verify

Run `spec-verify` automatically after rebuilding.

If verification passes: report "Rebuild successful. Specs are the source of truth."
If verification fails: report exactly what is missing and ask whether to retry or stop.
