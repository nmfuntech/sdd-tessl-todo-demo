---
name: spec-ci-sync
description: When the CI workflow needs to be created or updated to match the current specs — syncs .github/workflows/spec-verification.yml with the test files declared in specs
---

# Spec CI Sync

Synchronise `.github/workflows/spec-verification.yml` with the current state of the specs.
Run this after adding a new spec, changing the test runner, or any time the workflow may be out of date.

---

## Step 1 — Detect test runner

Check project files in this order and stop at the first match:

| File present | Runner |
|---|---|
| `pytest.ini`, `setup.cfg`, or `pyproject.toml` with `[tool.pytest]` | **pytest** |
| `package.json` with a `"test"` script | **npm test** (or `jest` / `vitest` if listed in devDependencies) |
| `Cargo.toml` | **cargo test** |
| `go.mod` | **go test ./...** |

If no file matches, ask the user: "Which test runner does this project use?"

---

## Step 2 — Collect test files from specs

Read `.spec-source-manifest.json` if it exists. If it does not, run:

```bash
python3 scripts/build-spec-manifest.py
```

Extract all unique test file paths from the manifest (`requirements[*].tests`).

If the manifest has no requirements (empty `{}`), fall back to reading `[@test]` annotations directly from every `.spec.md` in `specs/`.

---

## Step 3 — Build the workflow file

Compose `.github/workflows/spec-verification.yml` using this template. Fill in the runner-specific blocks from the table below.

```yaml
name: Spec Verification

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verify-specs:
    name: Run spec verification
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      <SETUP_STEP>

      - name: Install project dependencies
        run: <INSTALL_CMD>

      - name: Check all [@test] links resolve to existing files
        run: bash scripts/check-spec-links.sh

      - name: Check target ownership (no target changes without spec update)
        run: bash scripts/check-target-ownership.sh

      - name: Build spec manifest
        run: python3 scripts/build-spec-manifest.py

      - name: Run spec-linked tests
        run: <TEST_CMD>
```

Runner-specific values:

| Runner | `<SETUP_STEP>` | `<INSTALL_CMD>` | `<TEST_CMD>` |
|---|---|---|---|
| pytest | `- uses: actions/setup-python@v5`<br>&nbsp;&nbsp;`with: { python-version: "3.11" }` | `pip install -r requirements.txt` | `pytest <test_files> -v --tb=short` |
| npm/jest/vitest | `- uses: actions/setup-node@v4`<br>&nbsp;&nbsp;`with: { node-version: "20" }` | `npm ci` | `npm test` |
| cargo | *(none)* | *(none — omit step)* | `cargo test` |
| go | *(none)* | *(none — omit step)* | `go test ./...` |

For pytest: list the test files collected in Step 2 explicitly in `<TEST_CMD>`, one per line with `\` continuation. Example:

```yaml
        run: |
          pytest \
            src/tests/NoteList.test.jsx \
            src/tests/NoteModal.test.jsx \
            -v --tb=short
```

---

## Step 4 — Write or update the file

If `.github/workflows/spec-verification.yml` does not exist:
- Create `.github/workflows/` if needed
- Write the file

If it already exists:
- Show a diff of what will change
- Ask: "Update the workflow? (yes/no)"
- On yes: overwrite

---

## Step 5 — Report

After writing, report:

```
spec-ci-sync results
────────────────────
test runner:   <runner>
test files:    <N> files from <M> specs
workflow:      written / updated / unchanged

.github/workflows/spec-verification.yml is in sync with specs.

Next step: commit and push to trigger CI.
```

If the workflow was already up to date, say so explicitly — do not overwrite unnecessarily.
