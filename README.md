# StockS.io

Application web SaaS de gestion de stock pour PME, développée pour Jusdeliens
dans le cadre du projet annuel Bachelor 3 « Chef de projet Web » (RNCP40857).

**Site en ligne : [https://stocksio-pi.vercel.app/](https://stocksio-pi.vercel.app/)**

- **Frontend** : React 19 + Vite + Tailwind CSS (dossier `frontend/`)
- **Backend** : Python / Flask + SQLAlchemy + JWT (dossier `backend/`)
- **Base de données** : SQLite en local, PostgreSQL recommandé en production

Le backend étant hébergé sur le plan gratuit de Render, il se met en veille
après 15 minutes d'inactivité : le premier chargement du site après une
période sans visite peut prendre 20 à 30 secondes le temps que le serveur
redémarre (voir la section Déploiement plus bas).

## Prérequis

- Node.js 18 ou supérieur, avec npm
- Python 3.10 ou supérieur, avec pip
- un environnement virtuel Python (`venv`)

## Installation : Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # adapter les valeurs si besoin
python run.py
```

Le serveur démarre sur `http://127.0.0.1:5000`. Une base SQLite (`instance/stocksio.db`)
est créée automatiquement au premier lancement si elle n'existe pas déjà.

Pour repartir directement avec les données de démonstration utilisées pour ce
projet (utilisateurs, entrepôt, produit, mouvement de stock), remplacer la base
générée par celle fournie : copier `backend/instance/stocksio_test.db` vers
`backend/instance/stocksio.db`, ou réimporter le dump SQL fourni
(`backend/stocksio_dump.sql`) dans la base de votre choix (SQLite ou PostgreSQL,
avec adaptation mineure de la syntaxe selon le moteur).

## Installation : Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Le frontend démarre sur `http://127.0.0.1:5173` et attend l'API sur l'URL
définie dans `VITE_API_URL` (par défaut `http://127.0.0.1:5000/api`, le backend
local). Lancer le backend avant le frontend.

## Tester!

Tester l'application :

- **Créer son propre compte** : la page d'inscription (`/register`) est
  fonctionnelle, il suffit d'un email valide et d'un mot de passe d'au moins
  8 caractères. C'est la meilleure façon de tester le parcours complet
  (inscription puis connexion) tel qu'un nouvel utilisateur le vivrait.

## Fichier d'exemple pour tester l'import CSV

Le fichier `stocksio_export_produits.csv` (à la racine du dépôt) est un jeu de
données fictif au format attendu par la fonctionnalité d'import CSV du
Dashboard (colonnes Nom, Référence, Catégorie, Quantité, Seuil alerte, Unité,
Entrepôt ID, En alerte). Pour le tester : se connecter, aller sur le
Dashboard, utiliser le bloc "Importer des produits (CSV)", choisir un
entrepôt de destination puis sélectionner ce fichier.

Téléchargement du fichier CSV : [stocksio_export_produits.csv](https://drive.google.com/file/d/1Mq_k7YRn67yLnqsD_QxwdDjdoAlojuz8/view?usp=sharing)

## Identifiants de connexion à la base SQL

La base utilisée en développement et en démonstration est SQLite, une base de
données fichier : elle ne fonctionne pas comme un serveur avec un couple
identifiant/mot de passe. La seule information de connexion est le chemin du
fichier, défini dans `DATABASE_URL` (`.env`) : par défaut
`sqlite:///stocksio.db`, c'est-à-dire le fichier `backend/instance/stocksio.db`.
Pour l'ouvrir directement, n'importe quel client SQLite (DB Browser for
SQLite, l'extension SQLite de VS Code, ou la commande `sqlite3
backend/instance/stocksio.db`) suffit, sans identifiants à saisir.

En production avec PostgreSQL (recommandé, voir plus haut), `DATABASE_URL`
prendrait la forme `postgresql://utilisateur:mot_de_passe@hôte:5432/stocksio`,
les identifiants étant alors ceux fournis par l'hébergeur de la base choisie.

## Base de données fournie

- `backend/instance/stocksio_test.db` : base SQLite prête à l'emploi avec les
  données de démonstration (3 utilisateurs, 1 entrepôt, 1 produit, 1 mouvement de stock).
- `backend/stocksio_dump.sql` : export SQL complet de cette base (structure + données).

## Déploiement gratuit

Le dépôt doit d'abord être poussé sur GitHub (`git push`) : Render et Vercel
se connectent tous les deux directement à un dépôt Git.

### Backend sur Render.com avec plan gratuit

1. Créer un compte sur [render.com](https://render.com), puis **New +** →
   **Web Service**, et connecter le dépôt GitHub du projet.
2. Renseigner :
   - **Root Directory** : `backend`
   - **Runtime** : Python 3
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `gunicorn run:app`
   - **Instance Type** : Free
3. Variables d'environnement (onglet Environment) :
   - `JWT_SECRET_KEY` : une valeur secrète quelconque (ne pas laisser la
     valeur par défaut du `.env.example`)
   - Ne pas définir `DATABASE_URL` : l'application utilise alors la base
     SQLite fournie (`instance/stocksio_test.db`), recopiée automatiquement
     au démarrage si `instance/stocksio.db` n'existe pas encore.
4. Déployer. Render fournit une URL du type
   `https://.onrender.com`.

Le plan gratuit met le service en veille après 15 minutes d'inactivité (le
premier appel après une veille prend quelques dizaines de secondes) et son
disque n'est pas persistant entre deux démarrages : les écritures faites
pendant une session de démo restent visibles tant que le service tourne,
mais la base repart de son état d'origine (comptes de test) après une veille
ou un redéploiement. Suffisant pour une démonstration ou une soutenance ;
pas adapté à une mise en production réelle avec de vraies données à
conserver (il faudrait alors une vraie base gérée séparément, par exemple
PostgreSQL).

### Frontend sur Vercel avec le plan gratuit aussi

1. Créer un compte sur [vercel.com](https://vercel.com), puis **Add New** →
   **Project**, et importer le même dépôt GitHub.
2. Renseigner :
   - **Root Directory** : `frontend`
   - **Framework Preset** : Vite (détecté automatiquement)
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
3. Variable d'environnement :
   - `VITE_API_URL` : l'URL du backend Render suivie de `/api`, par exemple
     `https://.onrender.com/api`
4. Déployer. Vercel fournit l'URL publique définitive du projet, par exemple
   `https://stocksio-pi.vercel.app/`.

Chaque nouveau `git push` sur la branche principale redéploie
automatiquement les deux services.

Ce projet a pour but éducatif et examen de fin d'année du bachelor 3 IA chez Nexa Digital School année scolaire 2025-2026

Auteure : Elisabeth Gil

Données fictives pour garder propriété privée de l'entreprise.