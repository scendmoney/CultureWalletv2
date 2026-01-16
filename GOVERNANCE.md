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

## 3. Versioning & Tagging

- **Inception Tag**: `v0.1.0-inception` (The root of the doctrine layer).
- **Amendment Tags**: `v0.1.0-doctrine.X` (Sequential numbering for locked changes).
- **Major Milestone**: Increment minor version (e.g., `v0.2.0-inception`).

---
*Follow these rules to ensure architectural integrity and auditability.*

## 🔒 Governance Invariants (Binding)

The following governance invariants are **non-negotiable** and apply to all future contributors, pull requests, automation, and AI agents operating within this repository.

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
