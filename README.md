# Carte numérique d’Ikyane

Application Next.js prête à être hébergée sur Vercel.

## Déploiement

### Depuis ce dossier

```bash
npx vercel
npx vercel --prod
```

### Depuis un dépôt GitHub

1. Importer le dépôt dans Vercel.
2. Laisser Vercel détecter **Next.js** et conserver les commandes par défaut.
3. Vérifier que la version de Node.js est **22.x**.
4. Déployer.

Le build génère automatiquement `public/ikyane-qr.png` avec le domaine de production Vercel. Si un domaine personnalisé est utilisé, ajouter la variable d’environnement suivante dans Vercel, puis redéployer :

```text
NEXT_PUBLIC_SITE_URL=https://votre-domaine.fr
```

Ne pas ajouter de `/` final à cette valeur.

## Développement local

```bash
npm install
npm run dev
```

La carte est accessible sur `http://localhost:3000/card`.

## Photo de profil

Déposer le portrait dans `public/`, puis renseigner son chemin dans `data/profile.ts`, par exemple :

```ts
photo: '/portrait.jpg',
```
