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
