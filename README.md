# GeekInc Remote Regie
Ce projet a pour but de proposer une interface afin de piloter la régie GeekInc en live depuis le canapé !

Pour le moment, il permet :
* de préparer les sujets et incrusts pour une émission via une [page de préparation](http://localhost:8081/emissions.html)
* de piloter les titres et incrusts à afficher via une [interface tactile simple](http://localhost:8081/presentateur.html)
* d'afficher les titres et incrusts dynamiquement via une [page overlay pour xsplit](http://localhost:8081/xsplit.html)

## Installation
Prérequis :
- Node v8
- MongoDB

```
git clone
npm install
```


## Lancement
```
npm start
```
ou pour le lancer en mode développement (auto reload du backend)
```
npm run dev
```
