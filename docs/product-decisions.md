# Qard : décisions produit appliquées

## Positionnement et activation

Positionnement : la carte personnelle qui transforme une rencontre en contact durable. Cible de départ : freelances et indépendants qui rencontrent leurs prospects en personne. Signature conservée : « Scanne. Une nouvelle façon de se présenter. »

Activation vécue : une autre personne ouvre la Qard pendant une rencontre et utilise un moyen de contact ou enregistre les coordonnées. Créer un compte ou télécharger son propre QR ne suffit pas.

Mesure disponible : ouvertures et demandes d’enregistrement depuis les nouveaux QR marqués `via=qr`, stockées dans les événements existants avec `referrer=qard:qr`. Les propres visites connectées sont exclues. Le téléphone ne communique pas la confirmation d’import : ces compteurs sont des indicateurs, pas des contacts acquis ni une attribution individuelle. Les anciens QR fonctionnent toujours, mais leurs visites ne sont pas identifiées comme issues d’un QR. Aucun destinataire n’a à créer un compte.

## Critique

| Problème | Décision et modification | Emplacement | Résultat attendu |
|---|---|---|---|
| Création trop longue et parfois sans coordonnées | Retirer le nom de l’inscription ; demander une seule fois nom + email ou téléphone public, métier facultatif ; garder l’adresse générée ; photo et réseaux après création. Enregistrer le profil en une mise à jour, puis ouvrir le QR. | AuthForm, OnboardingFlow, onboardingSchema | Première carte immédiatement utilisable ; pas de double saisie du nom. |
| Les coordonnées sont cachées derrière un retournement | Supprimer le recto/verso, les gestes de rotation et le badge vérifié sans vérification ; identité, bouton d’enregistrement et contact prioritaire visibles directement. | QardPreview et son module CSS | Compréhension immédiate ; moins de gestes après scan. |
| L’export n’inclut pas tous les moyens de contact | Bouton « Enregistrer le contact » gratuit ; vCard avec coordonnées du profil, liens publics activés et lien Qard ; gestion des retours à la ligne et Unicode. | QardPreview, contacts.ts, vcard.ts, route vCard | Un fichier contact utile, avec une adresse pour retrouver la carte actualisée. |
| Le QR est difficile à retrouver | Onglet « Montrer » permanent ; QR grand format et dialogue accessible ; téléchargement et lien de secours ; consignes pour le garder à portée de main. | DashboardNav, dashboard, QRManager | Retrouver le QR sans chercher dans les réglages. |

## Important

| Problème | Décision et modification | Emplacement | Résultat attendu |
|---|---|---|---|
| Promesse abstraite | Headline « Une rencontre. Un scan. On garde le contact. » ; sous-titre expliquant l’ouverture et l’enregistrement ; CTA « Créer gratuitement ». | prisma-hero, métadonnées | Compréhension en quelques secondes. |
| Absence de démonstration autonome | Ordre : promesse → trois gestes → carte fictive interactive + QR → usage professionnel → réassurance/FAQ → CTA et tarifs. Démo indépendante des données de production, contact téléchargeable. | LandingSections, /demo, /api/demo-contact | Prouver le fonctionnement avant l’inscription, sans fausse preuve sociale. |
| Aucun signal après le premier partage | Retour d’ouverture depuis le QR et de demande d’enregistrement, interrogé toutes les 8 secondes pendant deux minutes au maximum, uniquement lorsque la page est visible. Compteurs privés du propriétaire ; indisponibilité des statistiques sans blocage du QR. | /api/activation, QRManager, PublicAnalytics, /api/analytics | Aider l’utilisateur à constater son premier échange. |
| Tableau de bord orienté édition et chiffres trompeurs | Mettre « Montrer mon QR » en premier ; prochaine action selon publication/contact ; remplacer le ratio clics/vues par les demandes d’enregistrement ; préciser ce que chaque compteur mesure. | dashboard et analytics | Encourager le prochain partage et éviter de confondre clics et prospects. |

## Amélioration

| Problème | Décision et modification | Emplacement | Résultat attendu |
|---|---|---|---|
| Trop de choix avant le premier échange | Trois styles gratuits d’abord ; autres thèmes sur demande ; animation secondaire ; bouton pour revenir au QR. | AppearanceEditor | Personnalisation rapide, sans obligation avant partage. |
| Découverte de Qard sans suite claire | Signature discrète « Créer ma Qard gratuitement » après les coordonnées ; suppression possible avec le branding Pro. | QardPreview | Boucle de découverte volontaire, sans interstitiel ni publicité agressive. |
| Offre Pro floue | Gratuit : coordonnées, QR, partage, export contact, styles essentiels, résultats sur 7 jours. Pro : styles avancés, retrait de la marque, visualisation sur 30/90 jours. Retirer le domaine personnalisé des promesses ; abonnement annoncé à venir, 4,99 € indicatifs, aucun checkout ajouté. | pricing, plans, analytics | Offre lisible qui protège l’adoption. La valeur payante et le prix restent à tester. |

## Rétention retenue

Accès direct au QR, image enregistrable, aide pour un raccourci d’accueil, résultats des rencontres et retour vers « Montrer ». Aucun rappel artificiel, email automatique, streak ou notification de réengagement ajouté. La carte reste utile sans modification régulière. Aucun Wallet, CRM, NFC ou système de profils multiples ajouté à ce stade.

## Limites de validation

Tests unitaires : coordonnées publiques/masquées, export et Unicode, validation du formulaire, accès privé aux compteurs. Contrôles : lint, TypeScript, build de production, consultation de la landing et de la démo à largeur mobile, réponse HTTP du contact de démonstration.

Le parcours connecté avec Supabase et l’import réel dans Contacts iOS/Android restent à vérifier sur des appareils connectés avant publication. Aucun compte utilisateur ni schéma de production modifié pour ces corrections. La sélection de période Free/Pro côté application ne remplace pas une politique d’accès payant en base à prévoir avant la commercialisation. Le nouveau tarif reste une présentation, pas une intégration de paiement.
