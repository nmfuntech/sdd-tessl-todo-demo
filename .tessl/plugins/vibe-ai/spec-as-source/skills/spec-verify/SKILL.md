---
name: spec-verify
description: When you need to verify that specs, tests, and target files are consistent — run all spec checks and the test suite and report results
---

# Spec Verify

Run the full spec verification suite in this order. Do not skip steps even if an earlier one passes.

## Step 1 — Check spec test links

Run:

```bash
bash scripts/check-spec-links.sh
```

This checks that every `[@test]` annotation in every `.spec.md` points to a file that actually exists on disk. A missing test file is worse than a failing test: the requirement has no verification.

## Step 2 — Check target ownership

Run:

```bash
bash scripts/check-target-ownership.sh
```

This checks that no file declared as a `targets` in a spec has been modified without a corresponding update to its owning spec.

## Step 3 — Build spec manifest

Run:

```bash
python3 scripts/build-spec-manifest.py
```

This writes `.spec-source-manifest.json` — a machine-readable map of specs → requirements → targets → tests.

## Step 4 — Run the test suite

Run the project test suite. Detect the test runner automatically:

- If `pytest.ini`, `pyproject.toml`, or `setup.cfg` exists → `pytest tests/ -v`
- If `package.json` with a `test` script exists → `npm test`
- If `Cargo.toml` exists → `cargo test`
- If unsure, ask the user which command to run before proceeding.

## Reporting

After all steps, report a summary:

```
spec-verify results
───────────────────
check-spec-links:       PASSED / FAILED
check-target-ownership: PASSED / FAILED
build-spec-manifest:    PASSED / FAILED
test suite:             PASSED / FAILED (N tests)

Overall: PASSED / FAILED
```

If anything failed, explain exactly what is wrong and what to fix. Do not proceed to work-review or declare implementation complete until all checks pass.
