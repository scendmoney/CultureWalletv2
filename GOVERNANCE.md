# ⚖️ Doctrine Governance & Change Control

This document defines the rules for managing, versioning, and modifying the platform's core doctrine.

## 1. Document Classification

| Class | Definition | Modification Rule |
| :--- | :--- | :--- |
| **IMMUTABLE** | Foundational doctrine. | No edits allowed. Superseded only by a new major version (e.g., `_v2.md`). |
| **LOCKED** | Critical structural doctrine. | Edits allowed only via explicit "Doctrine Amendment" procedure. |
| **LIVING** | Operational guidance. | Normal collaborative edits allowed. |

### Document Registry
- `CANONICAL_CORE.md`: **IMMUTABLE**
- `GOVERNANCE.md`: **LOCKED**
- `TRUST_GATED_PAYMENTS.md`: **LOCKED**
- `SURFACE_ADAPTERS.md`: **LIVING**
- `WORLD_VALUE_FLOWS.md`: **LIVING**
- `INCEPTION_SKIN_CULTUREWALLET.md`: **LIVING**

## 2. Change Procedures

### 2.1 Immutable Documents
- Content is never modified once tagged.
- Errors or enhancements are addressed in successor documents.
- Target block height or commit must be specified in the successor.

### 2.2 Locked Amendments
- Amendments must be clearly marked.
- Requires commit message prefix: `DOCTRINE: <Description>`
- Requires tagging with `v0.1.0-doctrine.X` convention.

### 2.3 Living Documents
- Normal Git flow applies.
- Commit messages should still be descriptive but do not require specific prefixes.

## 3. Versioning & Tagging (Release Cadence)

Doctrine versions follow the convention: `vMAJOR.MINOR.PATCH-doctrine`.

| Level | Increment Rule |
| :--- | :--- |
| **MAJOR** | Foundational shifts in protocol truth or governance (rare). |
| **MINOR** | New doctrine documents or ratified extensions. |
| **PATCH** | Clarifications, non-semantic edits, or formatting updates. |

### Tagging Rules
- Every doctrine release requires an associated governance ticket reference (e.g., `CW-GOV-XXX`).
- Tags must be immutable (no moving tags once released).
- **Inception**: `v0.1.0-inception`
- **Amendments**: `v0.1.0-doctrine.X` (Legacy) or `v0.1.0-doctrine.X.Y` (Standard compliance).

## 4. Pre-PR Doctrine Compliance Gate

All Pull Requests (human or agent) must affirm compliance with the following checklist. PRs failing these checks are blocked until governance resolution.

**Compliance Checklist:**
1. ✅ **No Contradiction**: Does this change contradict any root-level doctrine document? (Target: No)
2. ✅ **Economic Integrity**: Does this alter economics, trust flows, or authority boundaries? (Target: No, unless authorized)
3. ✅ **Authorized Amendment**: If the above are 'Yes', is there an approved and referenced `CW-GOV` ticket? (Target: Yes)

---
*Follow these rules to ensure architectural integrity and auditability.*

## 🔒 Governance Invariants (Binding)

> **RATIFIED via CW-GOV-004**. These invariants are non-negotiable and apply to all future contributors, pull requests, automation, and AI agents operating within this repository.

1. **Doctrine Supremacy**
   Root-level doctrine documents define intent, authority, and meaning.
   Content under `/docs` may describe *implementation*, but may not redefine *purpose*, *economics*, or *governance*.

2. **Immutability Rules**
   `CANONICAL_CORE.md` is immutable by definition.
   Any modification to root doctrine files requires an explicit governance ticket (`CW-GOV-XXX`) and documented approval.

3. **Inception Skins Are Derivative**
   Inception skins (e.g., CultureWallet) are reference implementations only.
   They do **not** define protocol truth, roadmap authority, or economic rules.

4. **No Technical Contradictions**
   No technical change may introduce logic, flows, or economics that contradict doctrine.
   If a conflict arises, doctrine must be resolved first—*before* implementation proceeds.

5. **Trust-Gated Economics Are Canonical**
   Payments, stipends, boosts, and tips must respect trust gates and defined value flows.
   Bypass paths, shadow mechanics, or implicit overrides are prohibited.

6. **Agents Are Bound**
   Any AI agent, automation, or coding assistant operating in this repository is governed by root doctrine first, tooling second.
   Agents may not infer, invent, or override doctrine.

---

## 🏗️ Agent Charter (Binding Appendix)

This charter defines the operational boundaries for all AI agents, automations, and coding assistants operating within this repository.

### A. Agents MAY:
- Implement technical changes, features, and UI/UX improvements aligned with doctrine.
- Refactor, optimize, and document existing implementations.
- Propose governance changes by initiating new `CW-GOV` tickets in the task buffer.
- Perform audit and verification tasks for doctrine compliance.

### B. Agents MAY NOT:
- **Invent Doctrine**: Agents cannot declare new "truth" or purpose outside of existing documentation.
- **Reinterpret Rules**: Agents cannot override or redefine economics, trust rules, or governance tiering.
- **Bypass Gates**: Agents cannot merge or push changes that explicitly fail the Doctrine Compliance Gate.
- **Silence Contradictions**: Agents must flag conflicts between technical requirements and root doctrine immediately.

*All agents operate under **Doctrine Supremacy** at all times. Failure to comply is a blocking failure.*
