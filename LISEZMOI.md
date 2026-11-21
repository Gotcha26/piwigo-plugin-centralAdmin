[Consulter la version EN 🇬🇧](README.md)
![centralAdmin](https://cdn.jsdelivr.net/gh/Gotcha26/piwigo-plugin-centralAdmin@main/centralAdmin/user-docs/images/centralAdmin-banner.fr.webp)

# centralAdmin

centralAdmin recentre le panneau d'administration de Piwigo sur une colonne de largeur réglable et
vous donne la main sur ses couleurs, thème par thème (clair/sombre), sans toucher au cœur.  
Il s'adresse à qui administre sa galerie sur un grand écran et en a assez de courir après les boutons.

---

## 🎯 À quoi ça sert, et pourquoi

Sur les grands écrans (27" 4K, ultrawide…), l'admin Piwigo s'étale sur toute la largeur : l'œil
parcourt de grandes distances pour trouver boutons et informations. ***centralAdmin*** contraint
l'affichage à une largeur maximale (1600 px par défaut) et le centre, sans rien retirer aux
fonctions de l'administration.

Les couleurs suivent la même logique : réglées une fois pour le thème clair, une fois pour le
thème sombre, conservées séparément — changer de thème ne défait jamais votre travail.

## ✨ Ce que vous y trouvez

- **Une admin centrée** à la largeur de votre choix (1024 à 1800 px) — un interrupteur rend à
  Piwigo sa largeur d'origine.
- **Des couleurs par thème** : fonds du thème clair et du thème sombre, côte à côte, avec aperçu
  en direct pour le thème actif.
- **Des couleurs de messages** : bulles d'information, d'avertissement, de message et d'erreur,
  par thème.
- **Le contraste des textes** : un curseur qui renforce d'un geste tous les textes de l'admin,
  dans les deux thèmes.
- **L'injection CSS personnalisée**, pour vos propres retouches.
- **Des petits conforts** : ouvrir l'admin dès la connexion du webmaster, agrandir les vignettes
  des pages Propriétés, Ordre des photos et Gestionnaire de lots, masquer les graphiques de l'accueil.

## 🛠️ Installation

1. Depuis **Administration → Plugins → Ajouter un plugin**, cherchez *centralAdmin* et
   installez-le. **Ou**, à la main : copiez le dossier dans `plugins/` de votre installation Piwigo.
2. Activez-le depuis **Administration → Plugins → Liste → Désactivé**.
3. Ouvrez **Plugins → centralAdmin** et ajustez l'onglet **Paramètres**.

Fonctionne avec Piwigo 14+, les thèmes Clear et Roma (sombre), et les navigateurs récents.

**Connexion sortante :** depuis sa page d'administration, le plugin vérifie ses mises à jour auprès de pro.julien-moreau.fr. À l'activation et à la mise à jour, il y télécharge aussi son lot de composants partagés (`/commons/`) ; si ce lot manque, le navigateur de l'administrateur charge `marked` et `mermaid` (tiroir d'aide) depuis jsDelivr. [Ce qui est transmis](https://pro.julien-moreau.fr/legal/confidentialite.php#extensions-gratuites)

## 📚 Pour aller plus loin

La documentation complète est lisible en ligne sur le
[wiki du projet](https://github.com/Gotcha26/piwigo-plugin-centralAdmin/wiki/Premiers-Pas).

---

##### Liens rapides :
- Projet : https://github.com/Gotcha26/piwigo-plugin-centralAdmin
- Documentation : https://github.com/Gotcha26/piwigo-plugin-centralAdmin/wiki/Premiers-Pas
- Fiche Piwigo : https://fr.piwigo.org/ext/index.php?eid=1058
- Page officielle : https://pro.julien-moreau.fr/products/centraladmin/
- Auteur : Gotcha (Julien Moreau) — https://julien-moreau.fr

<!-- jm-conformite-lot-commun -->

---

## Réseau et confidentialité

Cette extension utilise un **lot de composants communs** — bibliothèques d'affichage et polices, libres et open source — qui n'est pas embarqué dans cette archive.

- **À l'activation et à chaque mise à jour**, l'extension le télécharge depuis `https://pro.julien-moreau.fr/commons/`, vérifie sa signature cryptographique (Ed25519) et son empreinte SHA-256, puis l'installe dans `local/jm-commons/` de votre galerie — **hors du dossier de l'extension**, parce qu'il est partagé par toutes nos extensions et n'est ainsi téléchargé qu'une seule fois.
- **Aucune donnée n'est transmise** lors de ce téléchargement : la requête est anonyme, sans identifiant, sans nom de domaine ni paramètre. Comme pour tout téléchargement, notre serveur voit l'**adresse IP publique** de votre galerie et l'horodatage de la requête.
- **Ce lot n'est demandé qu'à ces deux moments** : aucune vérification périodique ne le concerne, et son téléchargement ne sert à aucune mesure d'audience.
- **Tant qu'aucune licence n'est activée**, l'écran d'achat affiché dans l'administration interroge occasionnellement `pro.julien-moreau.fr` : au plus une fois toutes les 6 heures pour son contenu, et — pour détecter la fin de la commande — au plus une fois par heure en tâche de fond, ou jusqu'à une fois toutes les 20 secondes pendant les 10 minutes qui suivent un clic sur « Acheter ». Seuls le nom de l'extension et, dans ce second cas, le domaine de la galerie sont transmis.
- **Sans accès à Internet**, l'extension reste fonctionnelle : les composants absents se replient sur une version simplifiée. Le lot peut aussi s'installer à la main — voir la FAQ : <https://pro.julien-moreau.fr/legal/faq.php>
