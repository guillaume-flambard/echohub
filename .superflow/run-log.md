# Run log — echohub (superflow T1 fix, 2026-08-08)

## P1 — migration rollback cassée (fixé)
- `2025_10_11_160103_add_organization_id_to_existing_tables.php` : `down()` dropait la FK + colonne mais **pas l'index** → rollback puis re-migrate = index dupliqué (échec SQLite). Fix : `dropIndex(['organization_id'])` avant `dropColumn` (contacts, apps, minerva_contexts).
- `tests/Feature/Database/IndexTest.php` : stale — `--step=1` rollbackait la dernière migration (`160103`, ajoutée après `093208`) mais vérifiait les index de `093208`. Fix : cibler la migration via `--path`.
- Vérifié : `migrate:fresh` + rollback + re-migrate propres ; **94/94 tests** (321 → 323 assertions).

## P2 — WCAG color-contrast serious ×15 (fixé, 0 violation)
- Fleet sweep : `color-contrast` serious ×15 (5 nodes × 3 viewports) sur la landing `/` (`resources/js/pages/welcome.tsx`). Le reste des pages publiques (login/register/forgot) était déjà à 0.
- Cause : la marque rouge-orange `#f53003` (light) / `#FF4433` (dark) donne ~3.4–4.0:1 — blanc sur le panneau rouge (h2, para, bulles utilisateur) et rouge sur carte blanche (liens Ollama/Hub) sous 4.5:1.
- Fix (procédure dark-contrast kb — contraste ≥ 4.5:1) :
  - Panneau rouge : `bg-[#f53003]` → `bg-[#d42900]` (5.10:1), `dark:bg-[#FF4433]` → `dark:bg-[#CC2E10]` (5.30:1) ; gradient bas assorti.
  - Liens sur carte blanche : `text-[#f53003]` → `text-[#d42900]` (5.10:1) ; variants `dark:` inchangés (déjà ≥ 4.5 sur `#161615`).
  - Bulles utilisateur : `bg-white/20 text-white` → `bg-black/30 text-white` (blend blanc sur rouge = 3.3:1 impossible à sauver ; opaque sombre = 6.6:1).
  - `text-white/90` → `text-white` (axe composite l'alpha blanc pessimistement → 4.24:1 borderline/flaky ; blanc plein = 5.10/5.30).
- Vérifié : axe WCAG 2.1 A/AA (mobile-375 / tablet-768 / desktop-1280) = **0 violation** sur `/`, `/login`, `/register`, `/forgot-password`, en light ET dark. **94/94 tests** (323 assertions), `npm run build` OK.
