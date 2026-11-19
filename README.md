# 📋 FlowBoard – Tableau Kanban

Application web de gestion de tâches de type Kanban connectée à une API.

## 🚀 Fonctionnalités

- **Affichage des cartes (Fetch API) :** Récupération des tâches depuis l'API et répartition automatique dans 3 colonnes (`To Do`, `In Progress`, `Done`) avec compteurs dynamiques.
- **États d'interface :** Gestion du chargement (`loading`), des erreurs réseau/serveur (`error` avec bouton *Réessayer*) et de l'état vide.
- **Ajout de carte :** Formulaire en modale avec validation par **Regex** (affichage des erreurs dans le DOM) et mise à jour directe via l'état JavaScript (`state_cards.cards`).
- **Filtres dynamiques :** Filtrage combiné par mot-clé (`q`), priorité et assigné via `URLSearchParams` + bouton de réinitialisation.
- **Sécurité (Anti-XSS) :** Aucune utilisation de `innerHTML` ou `alert()`. Rendu DOM 100% sécurisé avec `createElement` et `textContent`.

## 🛠️ Technologies utilisées

- **HTML5**
- **Tailwind CSS & DaisyUI** (Interface & composants)
- **JavaScript Vanilla (ES6 Modules)** (`fetch`, Promises `.then/.catch`, `URLSearchParams`, `RegExp`)
- **Git & GitHub** (Workflow GitFlow : `main`, `develop`, `feature/*`)
- **Jira** (Planification des tâches)

## 📁 Structure du projet

```text
flowboard/
├── index.html      # Structure du tableau, filtres et modale
├── README.md       # Documentation du projet
└── js/
    ├── api.js      # Appels réseau (Fetch API & URLSearchParams)
    ├── ui.js       # Manipulation sécurisée du DOM et gestion des états
    └── app.js      # État global (state), événements et validation Regex
