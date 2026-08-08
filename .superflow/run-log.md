# Run log — echohub (superflow T1 fix, 2026-08-08)

## P1 — migration rollback cassée (fixé)
- `2025_10_11_160103_add_organization_id_to_existing_tables.php` : `down()` dropait la FK + colonne mais **pas l'index** → rollback puis re-migrate = index dupliqué (échec SQLite). Fix : `dropIndex(['organization_id'])` avant `dropColumn` (contacts, apps, minerva_contexts).
- `tests/Feature/Database/IndexTest.php` : stale — `--step=1` rollbackait la dernière migration (`160103`, ajoutée après `093208`) mais vérifiait les index de `093208`. Fix : cibler la migration via `--path`.
- Vérifié : `migrate:fresh` + rollback + re-migrate propres ; **94/94 tests** (321 → 323 assertions).
