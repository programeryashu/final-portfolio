#!/usr/bin/env python3
"""Generate AGENCY_SKILLS.md index for the cloned agency-agents repo.

Sources:
- divisions.json  -> authoritative division list + labels
- agent frontmatter -> name, description, emoji
- README tables   -> "specialty" and "when to use" columns (fallback: frontmatter description)
"""
import json
import os
import re
import subprocess

ROOT = "agency-agents"
OUT = "AGENCY_SKILLS.md"

with open(os.path.join(ROOT, "divisions.json"), encoding="utf-8") as fh:
    divisions = json.load(fh)["divisions"]

DIVS = list(divisions.keys())

sha = subprocess.run(["git", "-C", ROOT, "rev-parse", "--short", "HEAD"],
                     capture_output=True, text=True, check=True).stdout.strip()

# --- collect agent files (recursive, matching installer behavior) ------------
all_files = {}  # relpath (repo-relative, forward slashes) -> division
for d in DIVS:
    base = os.path.join(ROOT, d)
    for root, _dirs, files in os.walk(base):
        for f in files:
            if f.endswith(".md"):
                rel = os.path.relpath(os.path.join(root, f), ROOT).replace(os.sep, "/")
                all_files[rel] = d

# --- parse frontmatter -------------------------------------------------------
fm_re = re.compile(r"\A---\s*\n(.*?)\n---", re.S)
field_re = re.compile(r'^(name|description|emoji|vibe):\s*(.+?)\s*$', re.M)


def unquote(v: str) -> str:
    v = v.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        return v[1:-1]
    return v


def frontmatter(path: str) -> dict:
    text = open(path, encoding="utf-8").read()
    m = fm_re.match(text)
    if not m:
        return {}
    fields = {}
    for k, v in field_re.findall(m.group(1)):
        fields[k] = unquote(v)
    return fields

# --- parse README roster tables ---------------------------------------------
readme = open(os.path.join(ROOT, "README.md"), encoding="utf-8").read()
row_re = re.compile(r"^\|\s*(\S+)\s+\[([^\]]+)\]\(([^)]+\.md)\)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|", re.M)
readme_rows = {}  # relpath -> (emoji, name, specialty, when_to_use)
for emoji, name, href, specialty, when in row_re.findall(readme):
    if href in all_files:
        readme_rows[href] = (emoji.strip(), name.strip(), specialty.strip(), when.strip())

# Division taglines: "### <emoji> <Label> Division" followed by a one-line description.
tagline_re = re.compile(r"^### \S+ (.+?) Division$\n\n(.+?)$", re.M)
taglines = {label.strip(): text.strip() for label, text in tagline_re.findall(readme)}

# --- build index data --------------------------------------------------------
agents = []
problems = []
for rel, div in sorted(all_files.items()):
    fm = frontmatter(os.path.join(ROOT, rel))
    if "name" not in fm or "description" not in fm:
        problems.append(f"frontmatter incomplete: {rel}")
        fm.setdefault("name", os.path.basename(rel)[:-3])
        fm.setdefault("description", "")
    rrow = readme_rows.get(rel)
    specialty = rrow[2] if rrow else fm.get("description", "")
    when = rrow[3] if rrow else ""
    if not rrow:
        problems.append(f"no README table row (description fallback): {rel}")
    agents.append({
        "div": div,
        "rel": rel,
        "slug": os.path.basename(rel)[:-3],
        "emoji": (rrow[0] if rrow else fm.get("emoji", "")).strip(),
        "name": rrow[1] if rrow else fm["name"],
        "fm_name": fm["name"],
        "specialty": specialty,
        "when": when,
    })

# --- sanity checks -----------------------------------------------------------
name_mismatch = [a for a in agents if a["emoji"] and r"\u" not in a["emoji"] and a["emoji"].startswith("\\")]
if len(readme_rows) != len(readme_rows):
    pass
dup_names = {}
for a in agents:
    dup_names.setdefault((a["div"], a["name"]), []).append(a["rel"])
dups = {k: v for k, v in dup_names.items() if len(v) > 1}

print(f"agent files: {len(all_files)}")
print(f"README rows matched: {len(readme_rows)}")
print(f"problems: {len(problems)}")
for p in problems:
    print("  -", p)
print(f"duplicate (division, name): {len(dups)}")
for k, v in dups.items():
    print("  -", k, v)
missing_taglines = [d for d in DIVS if divisions[d].get("label", d.title()) not in taglines]
print(f"divisions missing tagline: {len(missing_taglines)}{': ' + ', '.join(missing_taglines) if missing_taglines else ''}")

# --- generate AGENCY_SKILLS.md ----------------------------------------------
lines = []
lines.append("# Agency Skills Index")
lines.append("")
lines.append(f"> Index of **{len(agents)} AI agent personas** from the cloned")
lines.append(f"> [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) catalog (`{ROOT}/`, commit `{sha}`).")
lines.append(">")
lines.append("> **How to use:** ask Buffy to *activate* any persona — e.g. \u201cactivate the Frontend Developer persona\u201d or")
lines.append("> \u201cuse the Database Optimizer agent to tune this query\u201d. Buffy loads the linked agent file, adopts that")
lines.append("> persona's personality, workflow, and deliverables, and applies them to your task. The linked file is the")
lines.append("> full definition: identity, core mission, workflows, technical deliverables, success metrics.")
lines.append("")

for div in DIVS:
    meta = divisions[div]
    div_agents = [a for a in agents if a["div"] == div]
    label = meta.get("label", div.title())
    lines.append(f"## {label} ({len(div_agents)} agents)")
    lines.append("")
    tagline = taglines.get(label, "")
    if tagline:
        lines.append(f"*{tagline}*")
        lines.append("")
    else:
        problems.append(f"no division tagline in README: {div}")
    lines.append("| Agent | Slug | Specialty | When to use | File |")
    lines.append("|---|---|---|---|---|")
    for a in sorted(div_agents, key=lambda x: x["name"].lower()):
        emoji = a["emoji"] or "•"
        name = a["name"].replace("|", "\\|")
        spec = a["specialty"].replace("|", "\\|")
        when = a["when"].replace("|", "\\|")
        lines.append(f"| {emoji} {name} | `{a['slug']}` | {spec} | {when} | [`{a['rel']}`]({a['rel']}) |")
    lines.append("")

lines.append("---")
lines.append("")
lines.append(f"*Generated by `_agency_index.py`; covers all {len(DIVS)} divisions from `divisions.json`. ")
lines.append(f"Update with `git -C {ROOT} pull`, then re-run `python3 _agency_index.py`.*")
lines.append("")

with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
    fh.write("\n".join(lines))
print(f"wrote {OUT}: {len(agents)} agents across {len(DIVS)} divisions")
