---
name: spec-as-source-setup
description: When you need to add spec-as-source enforcement to a project — creates check-spec-links, check-target-ownership, build-spec-manifest, verify.sh, a CI workflow, and pre-commit config
---

# Spec-as-Source Setup

Set up mechanical spec-as-source enforcement on top of `tessl-labs/spec-driven-development`.
Execute every step in order. Create files verbatim unless a step says to adapt something.

**Prerequisites**: `tessl init` and `tessl install tessl-labs/spec-driven-development` already done. Git repo initialized.

---

## Step 1 — Create `scripts/check-spec-links.sh`

Create the `scripts/` directory if it does not exist.
Create the file with this exact content, then make it executable with `chmod +x scripts/check-spec-links.sh`.

```bash
#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path
import re
import sys

spec_root = Path("specs")
pattern = re.compile(r"\[@test\]\s+([^\s`)]+)")
missing = []

for spec in sorted(spec_root.glob("**/*.spec.md")):
    text = spec.read_text(encoding="utf-8")
    for raw_link in pattern.findall(text):
        candidate = (spec.parent / raw_link).resolve()
        cwd = Path.cwd()
        project_relative = candidate.relative_to(cwd) if str(candidate).startswith(str(cwd)) else candidate
        if not candidate.exists():
            missing.append((spec, raw_link, project_relative))

if missing:
    print("FAILED — missing tests referenced by specs.\n")
    current_spec = None
    for spec, raw_link, resolved in missing:
        if spec != current_spec:
            print(f"--- {spec}")
            current_spec = spec
        print(f"  MISSING {raw_link} -> {resolved}")
    print("\nA missing [@test] is worse than a failing test: the requirement is not verifiable.")
    sys.exit(1)

print("check-spec-links: PASSED")
PY
```

---

## Step 2 — Create `scripts/check-target-ownership.sh`

Create the file with this exact content, then make it executable with `chmod +x scripts/check-target-ownership.sh`.

```bash
#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path
import fnmatch
import subprocess
import sys

ROOT = Path.cwd()
SPEC_ROOT = ROOT / "specs"


def run(cmd):
    result = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    return result.returncode, result.stdout.strip(), result.stderr.strip()


def changed_files():
    # Prefer PR/main comparison when origin/main is available.
    code, out, _ = run("git rev-parse --verify origin/main")
    if code == 0:
        code, out, _ = run("git diff --name-only origin/main...HEAD")
        if out:
            return set(out.splitlines())

    # Fallback for local demos: staged + unstaged files.
    files = set()
    for cmd in ["git diff --name-only --cached", "git diff --name-only"]:
        _, out, _ = run(cmd)
        if out:
            files.update(out.splitlines())
    return files


def parse_targets(spec: Path):
    text = spec.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return []

    parts = text.split("---", 2)
    if len(parts) < 3:
        return []

    frontmatter = parts[1].splitlines()
    targets = []
    in_targets = False

    for line in frontmatter:
        stripped = line.strip()
        if stripped.startswith("targets:"):
            in_targets = True
            continue
        if in_targets:
            if stripped.startswith("-"):
                raw = stripped[1:].strip().strip('"\'')
                resolved = (spec.parent / raw).resolve()
                try:
                    rel = resolved.relative_to(ROOT)
                    targets.append(str(rel))
                except ValueError:
                    targets.append(raw)
            elif stripped and not line.startswith(" "):
                in_targets = False

    return targets


owners = {}
for spec in sorted(SPEC_ROOT.glob("**/*.spec.md")):
    for target in parse_targets(spec):
        owners.setdefault(target, []).append(str(spec.relative_to(ROOT)))

changed = changed_files()
changed_specs = {f for f in changed if f.startswith("specs/") and f.endswith(".spec.md")}
violations = []

for changed_file in changed:
    for target_pattern, spec_owners in owners.items():
        if changed_file == target_pattern or fnmatch.fnmatch(changed_file, target_pattern):
            if not any(owner in changed_specs for owner in spec_owners):
                violations.append((changed_file, spec_owners))

if violations:
    print("FAILED — target file changed without spec update.\n")
    for file, spec_owners in violations:
        print("Changed target:")
        print(f"  {file}\n")
        print("Owned by:")
        for owner in spec_owners:
            print(f"  {owner}")
        print()
    print("Fix:")
    print("  1. update the owning spec first")
    print("  2. ask the agent to update targets and tests from the approved spec")
    sys.exit(1)

print("check-target-ownership: PASSED")
PY
```

---

## Step 3 — Create `scripts/build-spec-manifest.py`

Create the file with this exact content (no chmod needed — it is a Python script, not a shell script):

```python
from pathlib import Path
import json
import re

ROOT = Path.cwd()
SPEC_ROOT = ROOT / "specs"
REQ_PATTERN = re.compile(r"^#{2,3}\s+(REQ-[A-Z0-9-]+)", re.MULTILINE)
TEST_PATTERN = re.compile(r"\[@test\]\s+([^\s`)]+)")


def parse_targets(spec: Path):
    text = spec.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return []

    parts = text.split("---", 2)
    if len(parts) < 3:
        return []

    frontmatter = parts[1].splitlines()
    targets = []
    in_targets = False

    for line in frontmatter:
        stripped = line.strip()
        if stripped.startswith("targets:"):
            in_targets = True
            continue
        if in_targets:
            if stripped.startswith("-"):
                raw = stripped[1:].strip().strip('"\'')
                resolved = (spec.parent / raw).resolve()
                try:
                    targets.append(str(resolved.relative_to(ROOT)))
                except ValueError:
                    targets.append(raw)
            elif stripped and not line.startswith(" "):
                in_targets = False

    return targets


def parse_requirements(spec: Path):
    text = spec.read_text(encoding="utf-8")
    req_matches = list(REQ_PATTERN.finditer(text))
    requirements = {}

    for idx, match in enumerate(req_matches):
        req_id = match.group(1)
        start = match.end()
        end = req_matches[idx + 1].start() if idx + 1 < len(req_matches) else len(text)
        block = text[start:end]
        tests = []
        for raw in TEST_PATTERN.findall(block):
            resolved = (spec.parent / raw).resolve()
            try:
                tests.append(str(resolved.relative_to(ROOT)))
            except ValueError:
                tests.append(raw)
        requirements[req_id] = {"tests": tests}

    return requirements


manifest = {}
for spec in sorted(SPEC_ROOT.glob("**/*.spec.md")):
    manifest[str(spec.relative_to(ROOT))] = {
        "targets": parse_targets(spec),
        "requirements": parse_requirements(spec),
    }

output = ROOT / ".spec-source-manifest.json"
output.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"spec manifest written to {output.relative_to(ROOT)}")
```

---

## Step 4 — Create `scripts/verify.sh`

Create the file with this exact content, then make it executable with `chmod +x scripts/verify.sh`.

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=== Spec Verification ==="
echo ""

bash scripts/check-spec-links.sh
bash scripts/check-target-ownership.sh
python3 scripts/build-spec-manifest.py

echo ""
echo "Spec checks passed. Running test suite..."
echo ""

if [ -f "pytest.ini" ] || [ -f "pyproject.toml" ] || [ -f "setup.cfg" ]; then
    pytest tests/ -v
elif [ -f "package.json" ] && grep -q '"test"' package.json; then
    npm test
elif [ -f "Cargo.toml" ]; then
    cargo test
else
    echo "No test runner detected. Run your test suite manually."
    exit 1
fi
```

---

## Step 5 — Create `.pre-commit-config.yaml`

Create the file with this exact content in the project root:

```yaml
repos:
  - repo: local
    hooks:
      - id: check-spec-links
        name: Check spec test links
        entry: bash scripts/check-spec-links.sh
        language: system
        pass_filenames: false

      - id: check-target-ownership
        name: Check target ownership
        entry: bash scripts/check-target-ownership.sh
        language: system
        pass_filenames: false
```

---

## Step 6 — Create `.github/workflows/spec-verification.yml`

Create `.github/workflows/` if it does not exist.

**This file must be adapted to the project's test runner.** Create it with the content below, then ask the user:

> "Which test runner does this project use? (e.g., pytest, jest, npm test, cargo test, go test)"

Replace the `# ADAPT: install and run tests here` comment with the actual install + test commands for the project.

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

      - name: Check all [@test] links resolve to existing files
        run: bash scripts/check-spec-links.sh

      - name: Check target ownership (no target changes without spec update)
        run: bash scripts/check-target-ownership.sh

      - name: Build spec manifest
        run: python3 scripts/build-spec-manifest.py

      # ADAPT: install and run tests here
      # Example for Python/pytest:
      #   - uses: actions/setup-python@v5
      #     with: { python-version: "3.11" }
      #   - run: pip install -r requirements.txt
      #   - run: pytest -v
      #
      # Example for Node/jest:
      #   - uses: actions/setup-node@v4
      #     with: { node-version: "20" }
      #   - run: npm ci
      #   - run: npm test
```

---

## Step 7 — Post-setup checklist

After creating all six files, show the user this checklist:

```
Setup complete. Two remaining manual steps:

1. Enable pre-commit locally:
   pip install pre-commit && pre-commit install

2. On GitHub → Settings → Branches → Add rule for "main":
   ✓ Require status checks to pass before merging
   ✓ Require branches to be up to date before merging
   ✓ Status check: "Run spec verification"
```

Then run verification automatically:

```
Use spec-verify.
```

Remind the user: the CI workflow test runner step must be adapted to their stack before committing (step 6 above).
