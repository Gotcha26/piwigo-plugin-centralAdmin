[Read the FR version 🇫🇷](LISEZMOI.md)
![centralAdmin](https://cdn.jsdelivr.net/gh/Gotcha26/piwigo-plugin-centralAdmin@main/centralAdmin/user-docs/images/centralAdmin-banner.en.webp)

# centralAdmin

centralAdmin centers the Piwigo admin panel on a column of configurable width and gives you full
control over its colors, theme by theme (light/dark), without touching the Piwigo core.  
It's for anyone who runs their gallery's admin on a large screen and is tired of chasing buttons.

---

## 🎯 What it does, and why

On large screens (27" 4K, ultrawide…), the Piwigo admin stretches across the full width: your
eyes travel long distances to find buttons and information. ***centralAdmin*** constrains the
display to a maximum width (1600 px by default) and centers it, while keeping 100% of the
admin's features.

The colors follow the same logic: set once for the light theme and once for the dark theme, each
kept separately, so switching themes never undoes your work.

## ✨ What you get

- **A centered admin** at the width you choose (1024 to 1800 px) — one switch restores Piwigo's
  original width.
- **Colors per theme**: background colors for the light and the dark theme, side by side, with a
  live preview for the active one.
- **Message colors**: info, warning, message and error bubbles, per theme.
- **Text contrast**: one slider that strengthens every admin text at once, in both themes.
- **Custom CSS injection**, for your own adjustments.
- **Small comforts**: open the admin right after the webmaster logs in, enlarge thumbnails on the
  properties, photo order and Batch Manager pages, hide the home page charts.

## 🛠️ Installation

1. From **Administration → Plugins → Add a plugin**, search for *centralAdmin* and install it.
   **Or**, by hand: copy the folder into `plugins/` on your Piwigo installation.
2. Activate it from **Administration → Plugins → List → Deactivated**.
3. Open **Plugins → centralAdmin** and adjust the **Settings** tab.

Works with Piwigo 14+, the Clear and Roma (dark) themes, and modern browsers.

**Outbound connection:** from its administration page, the plugin checks for its updates with pro.julien-moreau.fr. On activation and on update, it also downloads its bundle of shared components from there (`/commons/`); if that bundle is missing, the administrator's browser loads `marked` and `mermaid` (help drawer) from jsDelivr. [What is transmitted](https://pro.julien-moreau.fr/legal/confidentialite.php?lang=en#extensions-gratuites)

## 📚 Further reading

The full documentation is readable online on the
[project wiki](https://github.com/Gotcha26/piwigo-plugin-centralAdmin/wiki).

---

##### Quick links:
- Project: https://github.com/Gotcha26/piwigo-plugin-centralAdmin
- Documentation: https://github.com/Gotcha26/piwigo-plugin-centralAdmin/wiki
- Piwigo listing: https://fr.piwigo.org/ext/index.php?eid=1058
- Official page: https://pro.julien-moreau.fr/products/centraladmin/
- Author: Gotcha (Julien Moreau) — https://julien-moreau.fr

<!-- jm-conformite-lot-commun -->

---

## Network & privacy

This extension uses a **shared components bundle** — display libraries and fonts, all free and open source — which is not included in this archive.

- **On activation and on every update**, the extension downloads it from `https://pro.julien-moreau.fr/commons/`, verifies its cryptographic signature (Ed25519) and its SHA-256 digest, then installs it into `local/jm-commons/` in your gallery — **outside the extension's own folder**, because it is shared by all our extensions and is therefore downloaded only once.
- **No data is submitted** during that download: the request is anonymous, with no identifier, no domain name and no parameter. As with any download, our server sees your gallery's **public IP address** and the time of the request.
- **That bundle is requested at those two moments only**: no periodic check concerns it, and downloading it feeds no audience measurement.
- **As long as no licence is active**, the purchase screen shown in the admin panel occasionally queries `pro.julien-moreau.fr`: at most once every 6 hours for its content, and — to detect that the order completed — at most once an hour in the background, or as often as every 20 seconds for the 10 minutes following a click on "Buy". What is sent: the extension's name and, in that second case, the gallery's domain name.
- **Without Internet access** the extension still works: missing components fall back to a simplified version. The bundle can also be installed by hand — see the FAQ: <https://pro.julien-moreau.fr/legal/faq.php>
