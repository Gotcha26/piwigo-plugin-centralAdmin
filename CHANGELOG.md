# Changelog — centralAdmin Plugin

Toutes les modifications notables sont documentées ici.
Format : [Version] — Date — Description

---

## [unreleased]

### Changed
- ca-patcher : refonte de l'onglet Réparer en wizard cascade (CORE / Plugin / Thème × officiel / ZIP).
- ca-patcher : ajout du backup automatique CORE avant mutation.
- ca-patcher : token de session unifié à 10 minutes.
- ca-patcher : refus si une mise à jour Piwigo CORE est active (concurrence).

### Fixed
- ca-patcher : `Lock::acquire(0)` tente désormais l'acquisition au moins une fois.

---

## [3.7.0] — 2026-05-06

### Changed (BREAKING — action utilisateur requise)
- ca-patcher : le dossier de stockage des patches passe de `local/patches/` à `local/centralAdmin/patches-storage/`. **Après mise à jour, déplacez manuellement le contenu de `local/patches/` vers `local/centralAdmin/patches-storage/`** (fichiers `.patch` et leurs `.crlf-backup` éventuels). Le statut « appliqué » est conservé (indexé par slug en DB, indépendant du chemin) — aucune réactivation nécessaire. L'ancien dossier `local/patches/` peut être supprimé une fois vide. (#33)

---

## [3.4.0] — 2026-04-08

### Ajouté
- Architecture deux-repos : source privée + diffusion Free publique
- Dossier `modules/` pour les modules additionnels payants
- Scripts de build et sync : `build-free.sh`, `sync-free-repo.sh`

---

## [3.3.x] — Versions précédentes

Voir l'historique git pour le détail des versions antérieures.
