# Architecture
Ce projet est constitué d'un serveur hébergé sur un raspberry.

Il sert à 3 types de cas d'usage :
1. Depuis chez eux, ou n'importe où, les animateurs viennent préparer leurs sujets pour l'émission
2. En live depuis le canapé, les animateurs peuvent piloter les titres et incrusts affichées
3. le PC de la régie capte une page consituée dynamiquement par les titres + incrusts en cours d'affichage (en overlay)

![architecture](http://chriscamicas.github.io/girr/docs/global_architecture.svg)

# Stack technique
## Backend
Node + Express + Socket.io
Le stockage est actuellement dans MongoDB.
Le choix de mongodb est du principalement à la facilté d'y stocker nativement du JSON, ainsi que la capacité à stocker des images (les incrusts, logo, etc.).

La communication avec le front se fait :
- par API REST pour les accès en lecture/écriture sur les données
- par Websocket pour être notifié des changements des données

## Frontend
Le frontend est une WebApp construite avec Webpack et VueJS. Elle permet de manipuler les données en consommant l'API REST du back-end et de recevoir les changements en se connectant aux Events du serveur Websocket.
Elle est découper en 3 parties principales :
1. la manipulation des émissions dans /programs
2. l'affichage en overlay pour le logiciel d'enregistrement XSplit dans /xsplit
3. l'administration direct des données affichées à /xsplit dans /admin

Le frontend utilise VueJS pour l'aspect dynamique, principalement car j'avais envie de tester ce framework, mais aussi par son aspect léger.
